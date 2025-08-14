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
  Avatar,
  List,
  Switch,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://via.placeholder.com/100',
    isPremium: true,
    subscriptionType: 'PREMIUM',
    memberSince: 'March 2024',
  };

  const profileActions = [
    {
      id: '1',
      title: 'Edit Profile',
      icon: 'person-outline',
      action: () => {},
    },
    {
      id: '2',
      title: 'Notifications',
      icon: 'notifications-outline',
      action: () => {},
    },
    {
      id: '3',
      title: 'Privacy & Security',
      icon: 'shield-outline',
      action: () => {},
    },
    {
      id: '4',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      action: () => {},
    },
    {
      id: '5',
      title: 'Sign Out',
      icon: 'log-out-outline',
      action: () => {},
      color: theme.colors.error,
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
          <Avatar.Image 
            size={80} 
            source={{ uri: user.avatar }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.premiumText}>Premium Member</Text>
          </View>
        </BlurView>
      </LinearGradient>

      {/* User Info */}
      <View style={styles.section}>
        <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                Member Since
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                {user.memberSince}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="card-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                Subscription
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                {user.subscriptionType}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                Status
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.secondary }]}>
                Active
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Subscription Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Subscription
        </Text>
        <Card style={[styles.subscriptionCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.subscriptionHeader}>
              <View>
                <Text style={[styles.subscriptionTitle, { color: theme.colors.onSurface }]}>
                  Premium Plan
                </Text>
                <Text style={[styles.subscriptionDescription, { color: theme.colors.onSurfaceVariant }]}>
                  Advanced features and priority support
                </Text>
              </View>
              <Ionicons name="star" size={32} color="#FFD700" />
            </View>
            <View style={styles.subscriptionFeatures}>
              <Text style={[styles.featureText, { color: theme.colors.onSurface }]}>
                ✓ Unlimited SMS scanning
              </Text>
              <Text style={[styles.featureText, { color: theme.colors.onSurface }]}>
                ✓ Advanced ML models
              </Text>
              <Text style={[styles.featureText, { color: theme.colors.onSurface }]}>
                ✓ Priority support
              </Text>
              <Text style={[styles.featureText, { color: theme.colors.onSurface }]}>
                ✓ Cloud backup
              </Text>
            </View>
            <Button
              mode="outlined"
              onPress={() => {}}
              style={styles.upgradeButton}
            >
              Manage Subscription
            </Button>
          </Card.Content>
        </Card>
      </View>

      {/* Profile Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Profile Actions
        </Text>
        <Card style={[styles.actionsCard, { backgroundColor: theme.colors.surface }]}>
          {profileActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              onPress={action.action}
              style={styles.actionItem}
            >
              <View style={styles.actionContent}>
                <Ionicons 
                  name={action.icon as any} 
                  size={24} 
                  color={action.color || theme.colors.onSurfaceVariant} 
                />
                <Text style={[
                  styles.actionTitle, 
                  { color: action.color || theme.colors.onSurface }
                ]}>
                  {action.title}
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={theme.colors.onSurfaceVariant} 
              />
            </TouchableOpacity>
          ))}
        </Card>
      </View>

      {/* Quick Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Quick Settings
        </Text>
        <Card style={[styles.settingsCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications" size={20} color={theme.colors.primary} />
                <Text style={[styles.settingTitle, { color: theme.colors.onSurface }]}>
                  Push Notifications
                </Text>
              </View>
              <Switch value={true} onValueChange={() => {}} />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="cloud-upload" size={20} color={theme.colors.primary} />
                <Text style={[styles.settingTitle, { color: theme.colors.onSurface }]}>
                  Cloud Sync
                </Text>
              </View>
              <Switch value={true} onValueChange={() => {}} />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="analytics" size={20} color={theme.colors.primary} />
                <Text style={[styles.settingTitle, { color: theme.colors.onSurface }]}>
                  Analytics
                </Text>
              </View>
              <Switch value={false} onValueChange={() => {}} />
            </View>
          </Card.Content>
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
    height: height * 0.3,
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
  avatar: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  premiumText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoCard: {
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  subscriptionCard: {
    elevation: 4,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subscriptionDescription: {
    fontSize: 14,
  },
  subscriptionFeatures: {
    marginBottom: 20,
  },
  featureText: {
    fontSize: 14,
    marginBottom: 5,
  },
  upgradeButton: {
    borderRadius: 25,
  },
  actionsCard: {
    elevation: 4,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
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
  settingsCard: {
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    marginLeft: 15,
  },
});
