import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { smsService, SMSPermissionStatus } from '../services/SMSService';
import { gmailService, GmailPermissionStatus } from '../services/GmailService';
import { SMSMessage } from '../types';
import { GmailMessage } from '../services/GmailService';

interface ScanResult {
  type: 'sms' | 'email';
  message: SMSMessage | GmailMessage;
  isSpam: boolean;
  category: string;
  confidence: number;
  reason: string;
}

const ScanScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isScanning, setIsScanning] = useState(false);
  const [smsPermissions, setSmsPermissions] = useState<SMSPermissionStatus | null>(null);
  const [gmailPermissions, setGmailPermissions] = useState<GmailPermissionStatus | null>(null);
  const [isSmsMonitoring, setIsSmsMonitoring] = useState(false);
  const [isGmailMonitoring, setIsGmailMonitoring] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [isGmailAuthenticated, setIsGmailAuthenticated] = useState(false);

  useEffect(() => {
    checkPermissions();
    return () => {
      // Cleanup listeners
      smsService.cleanup();
      gmailService.cleanup();
    };
  }, []);

  const checkPermissions = async () => {
    try {
      const smsPerms = await smsService.checkPermissions();
      setSmsPermissions(smsPerms);
      
      const gmailPerms = await gmailService.checkPermissions();
      setGmailPermissions(gmailPerms);
      setIsGmailAuthenticated(gmailService.isAuthenticatedUser());
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const requestSmsPermissions = async () => {
    try {
      const permissions = await smsService.requestPermissions();
      setSmsPermissions(permissions);
      
      if (permissions.readSMS && permissions.receiveSMS) {
        Alert.alert('Success', 'SMS permissions granted!');
      } else {
        Alert.alert('Warning', 'Some SMS permissions were denied. Full functionality may not be available.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to request SMS permissions');
    }
  };

  const authenticateGmail = async () => {
    try {
      const success = await gmailService.authenticate();
      setIsGmailAuthenticated(success);
      
      if (success) {
        const permissions = await gmailService.checkPermissions();
        setGmailPermissions(permissions);
        Alert.alert('Success', 'Gmail authentication successful!');
      } else {
        Alert.alert('Error', 'Gmail authentication failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to authenticate with Gmail');
    }
  };

  const startSmsMonitoring = async () => {
    try {
      await smsService.startMonitoring();
      setIsSmsMonitoring(true);
      
      // Listen for new SMS messages
      smsService.onSMSReceived((message: SMSMessage) => {
        const result: ScanResult = {
          type: 'sms',
          message,
          isSpam: message.isSpam,
          category: message.category,
          confidence: message.confidence,
          reason: 'Real-time detection',
        };
        
        setScanResults(prev => [result, ...prev]);
        
        if (message.isSpam) {
          Alert.alert(
            '🚨 Spam SMS Detected!',
            `From: ${message.address}\nCategory: ${message.category}\nConfidence: ${(message.confidence * 100).toFixed(1)}%`
          );
        }
      });
      
      Alert.alert('Success', 'SMS monitoring started!');
    } catch (error) {
      Alert.alert('Error', 'Failed to start SMS monitoring');
    }
  };

  const stopSmsMonitoring = async () => {
    try {
      await smsService.stopMonitoring();
      setIsSmsMonitoring(false);
      Alert.alert('Success', 'SMS monitoring stopped!');
    } catch (error) {
      Alert.alert('Error', 'Failed to stop SMS monitoring');
    }
  };

  const startGmailMonitoring = async () => {
    try {
      setIsGmailMonitoring(true);
      
      // Listen for new emails
      gmailService.onEmailReceived((email: GmailMessage) => {
        const result: ScanResult = {
          type: 'email',
          message: email,
          isSpam: email.isSpam,
          category: email.category,
          confidence: email.confidence,
          reason: 'Real-time detection',
        };
        
        setScanResults(prev => [result, ...prev]);
        
        if (email.isSpam) {
          Alert.alert(
            '⚠️ Suspicious Email Detected!',
            `From: ${email.from}\nSubject: ${email.subject}\nCategory: ${email.category}\nConfidence: ${(email.confidence * 100).toFixed(1)}%`
          );
        }
      });
      
      Alert.alert('Success', 'Gmail monitoring started!');
    } catch (error) {
      Alert.alert('Error', 'Failed to start Gmail monitoring');
    }
  };

  const stopGmailMonitoring = async () => {
    try {
      setIsGmailMonitoring(false);
      Alert.alert('Success', 'Gmail monitoring stopped!');
    } catch (error) {
      Alert.alert('Error', 'Failed to stop Gmail monitoring');
    }
  };

  const scanExistingMessages = async () => {
    setIsScanning(true);
    const results: ScanResult[] = [];
    
    try {
      // Scan existing SMS messages
      if (smsPermissions?.readSMS) {
        const smsMessages = await smsService.getAllSMS();
        for (const message of smsMessages.slice(0, 10)) { // Limit to 10 messages
          const analysis = await smsService.analyzeSMS(message);
          results.push({
            type: 'sms',
            message,
            isSpam: analysis.isSpam,
            category: analysis.category,
            confidence: analysis.confidence,
            reason: analysis.reason,
          });
        }
      }
      
      // Scan existing Gmail messages
      if (isGmailAuthenticated) {
        const emails = await gmailService.getRecentEmails(10);
        for (const email of emails) {
          const analysis = await gmailService.analyzeEmail(email);
          results.push({
            type: 'email',
            message: email,
            isSpam: analysis.isSpam,
            category: analysis.category,
            confidence: analysis.confidence,
            reason: analysis.reason,
          });
        }
      }
      
      setScanResults(results);
      Alert.alert('Scan Complete', `Analyzed ${results.length} messages`);
    } catch (error) {
      Alert.alert('Error', 'Failed to scan existing messages');
    } finally {
      setIsScanning(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'spam':
        return '#FF4444';
      case 'phishing':
        return '#FF8800';
      case 'suspicious':
        return '#FFAA00';
      default:
        return '#44FF44';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'spam':
        return '🚨';
      case 'phishing':
        return '⚠️';
      case 'suspicious':
        return '⚠️';
      default:
        return '✅';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Security Scanner</Text>
        <Text style={styles.subtitle}>Monitor SMS & Gmail for threats</Text>
      </View>

      {/* SMS Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 SMS Protection</Text>
        
        {!smsPermissions?.readSMS && (
          <TouchableOpacity style={styles.permissionButton} onPress={requestSmsPermissions}>
            <Text style={styles.permissionButtonText}>Grant SMS Permissions</Text>
          </TouchableOpacity>
        )}
        
        {smsPermissions?.readSMS && (
          <View style={styles.monitoringSection}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Real-time SMS Monitoring</Text>
              <Switch
                value={isSmsMonitoring}
                onValueChange={isSmsMonitoring ? stopSmsMonitoring : startSmsMonitoring}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isSmsMonitoring ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>
          </View>
        )}
      </View>

      {/* Gmail Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📧 Gmail Protection</Text>
        
        {!isGmailAuthenticated && (
          <TouchableOpacity style={styles.permissionButton} onPress={authenticateGmail}>
            <Text style={styles.permissionButtonText}>Connect Gmail Account</Text>
          </TouchableOpacity>
        )}
        
        {isGmailAuthenticated && (
          <View style={styles.monitoringSection}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Real-time Email Monitoring</Text>
              <Switch
                value={isGmailMonitoring}
                onValueChange={isGmailMonitoring ? stopGmailMonitoring : startGmailMonitoring}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isGmailMonitoring ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>
          </View>
        )}
      </View>

      {/* Scan Button */}
      <TouchableOpacity 
        style={[styles.scanButton, isScanning && styles.scanButtonDisabled]} 
        onPress={scanExistingMessages}
        disabled={isScanning}
      >
        {isScanning ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.scanButtonText}>Scan Existing Messages</Text>
        )}
      </TouchableOpacity>

      {/* Results */}
      {scanResults.length > 0 && (
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>Scan Results ({scanResults.length})</Text>
          
          {scanResults.map((result, index) => (
            <View key={index} style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultType}>
                  {result.type === 'sms' ? '📱 SMS' : '📧 Email'}
                </Text>
                <Text style={[styles.resultCategory, { color: getCategoryColor(result.category) }]}>
                  {getCategoryIcon(result.category)} {result.category.toUpperCase()}
                </Text>
              </View>
              
              <Text style={styles.resultSender}>
                {result.type === 'sms' 
                  ? (result.message as SMSMessage).address
                  : (result.message as GmailMessage).from
                }
              </Text>
              
              <Text style={styles.resultContent}>
                {result.type === 'sms' 
                  ? (result.message as SMSMessage).body
                  : (result.message as GmailMessage).subject
                }
              </Text>
              
              <View style={styles.resultFooter}>
                <Text style={styles.confidenceText}>
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </Text>
                <Text style={styles.reasonText}>{result.reason}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  section: {
    margin: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  monitoringSection: {
    marginTop: 10,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  scanButton: {
    backgroundColor: '#34C759',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  scanButtonDisabled: {
    backgroundColor: '#ccc',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsSection: {
    margin: 15,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultType: {
    fontSize: 14,
    color: '#666',
  },
  resultCategory: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultSender: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  resultContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 12,
    color: '#999',
  },
  reasonText: {
    fontSize: 12,
    color: '#999',
    flex: 1,
    textAlign: 'right',
  },
});

export default ScanScreen;
