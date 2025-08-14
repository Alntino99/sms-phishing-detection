import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  useTheme,
  Switch,
  List,
  Divider,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function SettingsScreen() {
  const theme = useTheme();
  const [settings, setSettings] = useState({
    autoScan: true,
    scanIncoming: true,
    scanOutgoing: false,
    autoBlock: true,
    spamAlerts: true,
    reports: true,
    sound: true,
    vibration: true,
    cloudSync: true,
    analytics: false,
    crashReports: true,
  });

  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const clearData = () => {
    Alert.alert(
      'Clear Data',
      'Are you sure you want to clear all app data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const scanningSettings = [
    {
      id: 'autoScan',
      title: 'Auto-scan messages',
      description: 'Automatically scan incoming SMS messages',
      icon: 'scan',
      value: settings.autoScan,
    },
    {
      id: 'scanIncoming',
      title: 'Scan incoming messages',
      description: 'Analyze messages you receive',
      icon: 'mail-inbox',
      value: settings.scanIncoming,
    },
    {
      id: 'scanOutgoing',
      title: 'Scan outgoing messages',
      description: 'Analyze messages you send',
      icon: 'mail-send',
      value: settings.scanOutgoing,
    },
    {
      id: 'autoBlock',
      title: 'Auto-block spam',
      description: 'Automatically block detected spam messages',
      icon: 'shield-checkmark',
      value: settings.autoBlock,
    },
  ];

  const notificationSettings = [
    {
      id: 'spamAlerts',
      title: 'Spam alerts',
      description: 'Get notified when spam is detected',
      icon: 'warning',
      value: settings.spamAlerts,
    },
    {
      id: 'reports',
      title: 'Weekly reports',
      description: 'Receive weekly protection summaries',
      icon: 'document-text',
      value: settings.reports,
    },
    {
      id: 'sound',
      title: 'Sound notifications',
      description: 'Play sound for notifications',
      icon: 'volume-high',
      value: settings.sound,
    },
    {
      id: 'vibration',
      title: 'Vibration',
      description: 'Vibrate for notifications',
      icon: 'phone-portrait',
      value: settings.vibration,
    },
  ];

  const privacySettings = [
    {
      id: 'cloudSync',
      title: 'Cloud sync',
      description: 'Sync data across devices',
      icon: 'cloud-upload',
      value: settings.cloudSync,
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Help improve the app with usage data',
      icon: 'analytics',
      value: settings.analytics,
    },
    {
      id: 'crashReports',
      title: 'Crash reports',
      description: 'Send crash reports to help fix issues',
      icon: 'bug',
      value: settings.crashReports,
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.header}
      >
        <BlurView intensity={20} style={styles.headerContent}>
          <Ionicons name="settings" size={48} color="white" />
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your experience</Text>
        </BlurView>
      </LinearGradient>

      {/* Scanning Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Scanning Settings
        </Text>
        <Card style={[styles.settingsCard, { backgroundColor: theme.colors.surface }]}>
          {scanningSettings.map((setting, index) => (
            <View key={setting.id}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name={setting.icon as any} size={20} color={theme.colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: theme.colors.onSurface }]}>
                      {setting.title}
                    </Text>
                    <Text style={[styles.settingDescription, { color: theme.colors.onSurfaceVariant }]}>
                      {setting.description}
                    </Text>
                  </View>
                </View>
                <Switch 
                  value={setting.value} 
                  onValueChange={() => toggleSetting(setting.id)}
                  color={theme.colors.primary}
                />
              </View>
              {index < scanningSettings.length - 1 && (
                <Divider style={styles.divider} />
              )}
            </View>
          ))}
        </Card>
      </View>

      {/* Notification Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Notification Settings
        </Text>
        <Card style={[styles.settingsCard, { backgroundColor: theme.colors.surface }]}>
          {notificationSettings.map((setting, index) => (
            <View key={setting.id}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name={setting.icon as any} size={20} color={theme.colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: theme.colors.onSurface }]}>
                      {setting.title}
                    </Text>
                    <Text style={[styles.settingDescription, { color: theme.colors.onSurfaceVariant }]}>
                      {setting.description}
                    </Text>
                  </View>
                </View>
                <Switch 
                  value={setting.value} 
                  onValueChange={() => toggleSetting(setting.id)}
                  color={theme.colors.primary}
                />
              </View>
              {index < notificationSettings.length - 1 && (
                <Divider style={styles.divider} />
              )}
            </View>
          ))}
        </Card>
      </View>

      {/* Privacy & Data Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Privacy & Data
        </Text>
        <Card style={[styles.settingsCard, { backgroundColor: theme.colors.surface }]}>
          {privacySettings.map((setting, index) => (
            <View key={setting.id}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name={setting.icon as any} size={20} color={theme.colors.primary} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: theme.colors.onSurface }]}>
                      {setting.title}
                    </Text>
                    <Text style={[styles.settingDescription, { color: theme.colors.onSurfaceVariant }]}>
                      {setting.description}
                    </Text>
                  </View>
                </View>
                <Switch 
                  value={setting.value} 
                  onValueChange={() => toggleSetting(setting.id)}
                  color={theme.colors.primary}
                />
              </View>
              {index < privacySettings.length - 1 && (
                <Divider style={styles.divider} />
              )}
            </View>
          ))}
        </Card>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Data Management
        </Text>
        <Card style={[styles.settingsCard, { backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity style={styles.actionItem} onPress={clearData}>
            <View style={styles.actionContent}>
              <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
              <Text style={[styles.actionTitle, { color: theme.colors.error }]}>
                Clear All Data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
        </Card>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          About
        </Text>
        <Card style={[styles.settingsCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: theme.colors.onSurfaceVariant }]}>
              Version
            </Text>
            <Text style={[styles.aboutValue, { color: theme.colors.onSurface }]}>
              1.0.0
            </Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: theme.colors.onSurfaceVariant }]}>
              Build
            </Text>
            <Text style={[styles.aboutValue, { color: theme.colors.onSurface }]}>
              2024.03.15
            </Text>
          </View>
          <Divider style={styles.divider} />
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionContent}>
              <Ionicons name="refresh" size={20} color={theme.colors.primary} />
              <Text style={[styles.actionTitle, { color: theme.colors.primary }]}>
                Check for Updates
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: height * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingsCard: {
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  divider: {
    marginHorizontal: 20,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    marginLeft: 15,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  aboutLabel: {
    fontSize: 16,
  },
  aboutValue: {
    fontSize: 16,
    fontWeight: '500',
  },
});
