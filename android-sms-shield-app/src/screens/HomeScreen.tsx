import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  useTheme,
  IconButton,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from '../types';
import smsService from '../services/SMSService';

const { width, height } = Dimensions.get('window');

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [stats, setStats] = React.useState({
    totalMessages: 0,
    spamDetected: 0,
    protectionRate: 0,
    moneySaved: 0,
  });

  React.useEffect(() => {
    const loadStats = async () => {
      try {
        const analytics = await smsService.getAnalytics();
        setStats({
          totalMessages: analytics.totalMessages,
          spamDetected: analytics.spamDetected,
          protectionRate: analytics.protectionRate,
          moneySaved: analytics.moneySaved,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };
    
    loadStats();
  }, []);

  const features = [
    {
      id: '1',
      title: 'AI-Powered Detection',
      description: 'Advanced machine learning models trained on Ghana-specific spam patterns',
      icon: 'shield-checkmark',
      color: '#4CAF50',
    },
    {
      id: '2',
      title: 'Real-time Scanning',
      description: 'Instant SMS analysis with background monitoring',
      icon: 'scan',
      color: '#2196F3',
    },
    {
      id: '3',
      title: 'Smart Analytics',
      description: 'Detailed insights and performance tracking',
      icon: 'analytics',
      color: '#FF9800',
    },
    {
      id: '4',
      title: 'Privacy First',
      description: 'Local processing with optional cloud sync',
      icon: 'lock-closed',
      color: '#9C27B0',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'spam',
      message: 'Blocked suspicious message from +233...',
      time: '2 min ago',
    },
    {
      id: '2',
      type: 'safe',
      message: 'Verified safe message from Bank of Ghana',
      time: '5 min ago',
    },
    {
      id: '3',
      type: 'spam',
      message: 'Blocked phishing attempt from unknown sender',
      time: '12 min ago',
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Hero Section */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.heroSection}
      >
        <BlurView intensity={20} style={styles.heroContent}>
          <View style={styles.heroHeader}>
            <Ionicons name="shield-checkmark" size={48} color="white" />
            <Text style={styles.heroTitle}>SMS Shield</Text>
            <Text style={styles.heroSubtitle}>Your AI-powered SMS protection</Text>
          </View>
          
          <View style={styles.heroStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.protectionRate}%</Text>
              <Text style={styles.statLabel}>Protection Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.spamDetected}</Text>
              <Text style={styles.statLabel}>Spam Blocked</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>₵{stats.moneySaved}</Text>
              <Text style={styles.statLabel}>Money Saved</Text>
            </View>
          </View>

          <Button
            mode="contained"
            onPress={() => navigation.navigate('Scan')}
            style={styles.scanButton}
            contentStyle={styles.scanButtonContent}
            labelStyle={styles.scanButtonLabel}
          >
            <Ionicons name="scan" size={20} color="white" style={{ marginRight: 8 }} />
            Start Scanning
          </Button>
        </BlurView>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Quick Stats
        </Text>
        <View style={styles.statsGrid}>
          <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.statCardContent}>
                <Ionicons name="mail" size={24} color={theme.colors.primary} />
                <View>
                  <Text style={[styles.statCardNumber, { color: theme.colors.onSurface }]}>
                    {stats.totalMessages}
                  </Text>
                  <Text style={[styles.statCardLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Total Messages
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.statCardContent}>
                <Ionicons name="warning" size={24} color={theme.colors.error} />
                <View>
                  <Text style={[styles.statCardNumber, { color: theme.colors.onSurface }]}>
                    {stats.spamDetected}
                  </Text>
                  <Text style={[styles.statCardLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Spam Detected
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Features
        </Text>
        {features.map((feature) => (
          <Card key={feature.id} style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                  <Ionicons name={feature.icon as any} size={24} color={feature.color} />
                </View>
                <View style={styles.featureText}>
                  <Text style={[styles.featureTitle, { color: theme.colors.onSurface }]}>
                    {feature.title}
                  </Text>
                  <Text style={[styles.featureDescription, { color: theme.colors.onSurfaceVariant }]}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            Recent Activity
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
            <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {recentActivity.map((activity) => (
          <Card key={activity.id} style={[styles.activityCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.activityContent}>
                <View style={[
                  styles.activityIcon,
                  { backgroundColor: activity.type === 'spam' ? theme.colors.error + '20' : theme.colors.primary + '20' }
                ]}>
                  <Ionicons 
                    name={activity.type === 'spam' ? 'warning' : 'checkmark-circle'} 
                    size={20} 
                    color={activity.type === 'spam' ? theme.colors.error : theme.colors.primary} 
                  />
                </View>
                <View style={styles.activityText}>
                  <Text style={[styles.activityMessage, { color: theme.colors.onSurface }]}>
                    {activity.message}
                  </Text>
                  <Text style={[styles.activityTime, { color: theme.colors.onSurfaceVariant }]}>
                    {activity.time}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  scanButton: {
    borderRadius: 25,
    elevation: 8,
  },
  scanButtonContent: {
    height: 50,
    paddingHorizontal: 30,
  },
  scanButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    elevation: 4,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCardNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statCardLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  featureCard: {
    marginBottom: 15,
    elevation: 4,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  activityCard: {
    marginBottom: 10,
    elevation: 2,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityText: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
  },
});
