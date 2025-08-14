import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  useTheme,
  Chip,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function DashboardScreen() {
  const theme = useTheme();

  const analytics = {
    totalMessages: 1247,
    spamDetected: 89,
    safeMessages: 1158,
    protectionRate: 92.8,
    moneySaved: 450,
    todayScanned: 23,
    todaySpam: 2,
  };

  const modelPerformance = [
    {
      name: 'TensorFlow Lite',
      accuracy: 94.2,
      precision: 91.8,
      recall: 96.5,
      f1Score: 94.1,
    },
    {
      name: 'Rule-Based',
      accuracy: 87.5,
      precision: 85.2,
      recall: 89.8,
      f1Score: 87.4,
    },
    {
      name: 'Hybrid Model',
      accuracy: 96.1,
      precision: 94.8,
      recall: 97.3,
      f1Score: 96.0,
    },
  ];

  const spamTrends = [
    { day: 'Mon', spam: 12, safe: 45 },
    { day: 'Tue', spam: 8, safe: 52 },
    { day: 'Wed', spam: 15, safe: 38 },
    { day: 'Thu', spam: 6, safe: 61 },
    { day: 'Fri', spam: 11, safe: 49 },
    { day: 'Sat', spam: 9, safe: 43 },
    { day: 'Sun', spam: 7, safe: 51 },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.header}
      >
        <BlurView intensity={20} style={styles.headerContent}>
          <Ionicons name="analytics" size={48} color="white" />
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Analytics & Insights</Text>
        </BlurView>
      </LinearGradient>

      {/* Analytics Overview */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Analytics Overview
        </Text>
        <View style={styles.analyticsGrid}>
          <Card style={[styles.analyticsCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.analyticsContent}>
                <Ionicons name="mail" size={24} color={theme.colors.primary} />
                <View>
                  <Text style={[styles.analyticsNumber, { color: theme.colors.onSurface }]}>
                    {analytics.totalMessages}
                  </Text>
                  <Text style={[styles.analyticsLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Total Messages
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={[styles.analyticsCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.analyticsContent}>
                <Ionicons name="warning" size={24} color={theme.colors.error} />
                <View>
                  <Text style={[styles.analyticsNumber, { color: theme.colors.onSurface }]}>
                    {analytics.spamDetected}
                  </Text>
                  <Text style={[styles.analyticsLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Spam Detected
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={[styles.analyticsCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.analyticsContent}>
                <Ionicons name="shield-checkmark" size={24} color={theme.colors.secondary} />
                <View>
                  <Text style={[styles.analyticsNumber, { color: theme.colors.onSurface }]}>
                    {analytics.protectionRate}%
                  </Text>
                  <Text style={[styles.analyticsLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Protection Rate
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={[styles.analyticsCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.analyticsContent}>
                <Ionicons name="cash" size={24} color={theme.colors.tertiary} />
                <View>
                  <Text style={[styles.analyticsNumber, { color: theme.colors.onSurface }]}>
                    ₵{analytics.moneySaved}
                  </Text>
                  <Text style={[styles.analyticsLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Money Saved
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>
      </View>

      {/* Today's Activity */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Today's Activity
        </Text>
        <Card style={[styles.todayCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.todayContent}>
              <View style={styles.todayStat}>
                <Text style={[styles.todayNumber, { color: theme.colors.primary }]}>
                  {analytics.todayScanned}
                </Text>
                <Text style={[styles.todayLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Messages Scanned
                </Text>
              </View>
              <View style={styles.todayStat}>
                <Text style={[styles.todayNumber, { color: theme.colors.error }]}>
                  {analytics.todaySpam}
                </Text>
                <Text style={[styles.todayLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Spam Blocked
                </Text>
              </View>
              <View style={styles.todayStat}>
                <Text style={[styles.todayNumber, { color: theme.colors.secondary }]}>
                  {((analytics.todayScanned - analytics.todaySpam) / analytics.todayScanned * 100).toFixed(1)}%
                </Text>
                <Text style={[styles.todayLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Safe Rate
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Spam Trends Chart */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Spam Trends (This Week)
        </Text>
        <Card style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.chartContainer}>
              {spamTrends.map((trend, index) => (
                <View key={index} style={styles.chartBar}>
                  <View style={styles.barContainer}>
                    <View 
                      style={[
                        styles.safeBar, 
                        { 
                          height: (trend.safe / 61) * 100,
                          backgroundColor: theme.colors.primary + '40'
                        }
                      ]} 
                    />
                    <View 
                      style={[
                        styles.spamBar, 
                        { 
                          height: (trend.spam / 15) * 100,
                          backgroundColor: theme.colors.error + '60'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.chartLabel, { color: theme.colors.onSurfaceVariant }]}>
                    {trend.day}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: theme.colors.primary + '40' }]} />
                <Text style={[styles.legendText, { color: theme.colors.onSurfaceVariant }]}>Safe</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: theme.colors.error + '60' }]} />
                <Text style={[styles.legendText, { color: theme.colors.onSurfaceVariant }]}>Spam</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Model Performance */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Model Performance
        </Text>
        {modelPerformance.map((model, index) => (
          <Card key={index} style={[styles.modelCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.modelName, { color: theme.colors.onSurface }]}>
                {model.name}
              </Text>
              <View style={styles.modelMetrics}>
                <View style={styles.metric}>
                  <Text style={[styles.metricLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Accuracy
                  </Text>
                  <Text style={[styles.metricValue, { color: theme.colors.onSurface }]}>
                    {model.accuracy}%
                  </Text>
                </View>
                <View style={styles.metric}>
                  <Text style={[styles.metricLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Precision
                  </Text>
                  <Text style={[styles.metricValue, { color: theme.colors.onSurface }]}>
                    {model.precision}%
                  </Text>
                </View>
                <View style={styles.metric}>
                  <Text style={[styles.metricLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Recall
                  </Text>
                  <Text style={[styles.metricValue, { color: theme.colors.onSurface }]}>
                    {model.recall}%
                  </Text>
                </View>
                <View style={styles.metric}>
                  <Text style={[styles.metricLabel, { color: theme.colors.onSurfaceVariant }]}>
                    F1 Score
                  </Text>
                  <Text style={[styles.metricValue, { color: theme.colors.onSurface }]}>
                    {model.f1Score}%
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
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  analyticsCard: {
    width: '48%',
    marginBottom: 10,
    elevation: 4,
  },
  analyticsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analyticsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  analyticsLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  todayCard: {
    elevation: 4,
  },
  todayContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  todayStat: {
    alignItems: 'center',
  },
  todayNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  todayLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  chartCard: {
    elevation: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 20,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: 20,
  },
  safeBar: {
    width: '100%',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  spamBar: {
    width: '100%',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  chartLabel: {
    fontSize: 12,
    marginTop: 8,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
  modelCard: {
    marginBottom: 15,
    elevation: 4,
  },
  modelName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modelMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
