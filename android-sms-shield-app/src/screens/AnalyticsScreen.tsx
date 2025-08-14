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

export default function AnalyticsScreen() {
  const theme = useTheme();

  const analytics = {
    totalMessages: 1247,
    spamDetected: 89,
    safeMessages: 1158,
    protectionRate: 92.8,
    moneySaved: 450,
    change: {
      totalMessages: '+12.5%',
      spamDetected: '-8.2%',
      protectionRate: '+2.1%',
      moneySaved: '+15.3%',
    },
  };

  const dailyTrends = [
    { day: 'Mon', spam: 12, safe: 45, total: 57 },
    { day: 'Tue', spam: 8, safe: 52, total: 60 },
    { day: 'Wed', spam: 15, safe: 38, total: 53 },
    { day: 'Thu', spam: 6, safe: 61, total: 67 },
    { day: 'Fri', spam: 11, safe: 49, total: 60 },
    { day: 'Sat', spam: 9, safe: 43, total: 52 },
    { day: 'Sun', spam: 7, safe: 51, total: 58 },
  ];

  const modelPerformance = [
    {
      name: 'TensorFlow Lite',
      accuracy: 94.2,
      precision: 91.8,
      recall: 96.5,
      f1Score: 94.1,
      totalPredictions: 1247,
      lastUpdated: '2 hours ago',
    },
    {
      name: 'Rule-Based',
      accuracy: 87.5,
      precision: 85.2,
      recall: 89.8,
      f1Score: 87.4,
      totalPredictions: 1247,
      lastUpdated: '2 hours ago',
    },
    {
      name: 'Hybrid Model',
      accuracy: 96.1,
      precision: 94.8,
      recall: 97.3,
      f1Score: 96.0,
      totalPredictions: 1247,
      lastUpdated: '2 hours ago',
    },
  ];

  const topSpamSources = [
    { source: '+233 24 123 4567', count: 15, percentage: 16.9 },
    { source: '+233 20 987 6543', count: 12, percentage: 13.5 },
    { source: '+233 26 555 1234', count: 8, percentage: 9.0 },
    { source: '+233 54 777 8888', count: 6, percentage: 6.7 },
    { source: '+233 50 999 0000', count: 5, percentage: 5.6 },
  ];

  const getChangeColor = (change: string) => {
    const isPositive = change.startsWith('+');
    return isPositive ? theme.colors.secondary : theme.colors.error;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.header}
      >
        <BlurView intensity={20} style={styles.headerContent}>
          <Ionicons name="analytics" size={48} color="white" />
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSubtitle}>Detailed insights and performance</Text>
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
                  <Text style={[styles.analyticsChange, { color: getChangeColor(analytics.change.totalMessages) }]}>
                    {analytics.change.totalMessages}
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
                  <Text style={[styles.analyticsChange, { color: getChangeColor(analytics.change.spamDetected) }]}>
                    {analytics.change.spamDetected}
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
                  <Text style={[styles.analyticsChange, { color: getChangeColor(analytics.change.protectionRate) }]}>
                    {analytics.change.protectionRate}
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
                  <Text style={[styles.analyticsChange, { color: getChangeColor(analytics.change.moneySaved) }]}>
                    {analytics.change.moneySaved}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>
      </View>

      {/* Spam Trends Chart */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Spam Trends (This Week)
        </Text>
        <Card style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.chartContainer}>
              {dailyTrends.map((trend, index) => (
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
                  <Text style={[styles.chartTotal, { color: theme.colors.onSurfaceVariant }]}>
                    {trend.total}
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
              <View style={styles.modelHeader}>
                <Text style={[styles.modelName, { color: theme.colors.onSurface }]}>
                  {model.name}
                </Text>
                <Chip 
                  style={[styles.accuracyChip, { backgroundColor: theme.colors.primary + '20' }]}
                  textStyle={{ color: theme.colors.primary }}
                >
                  {model.accuracy}% accuracy
                </Chip>
              </View>
              <View style={styles.modelMetrics}>
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
                <View style={styles.metric}>
                  <Text style={[styles.metricLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Predictions
                  </Text>
                  <Text style={[styles.metricValue, { color: theme.colors.onSurface }]}>
                    {model.totalPredictions}
                  </Text>
                </View>
              </View>
              <Text style={[styles.lastUpdated, { color: theme.colors.onSurfaceVariant }]}>
                Last updated: {model.lastUpdated}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Top Spam Sources */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Top Spam Sources
        </Text>
        <Card style={[styles.sourcesCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            {topSpamSources.map((source, index) => (
              <View key={index} style={styles.sourceItem}>
                <View style={styles.sourceInfo}>
                  <Text style={[styles.sourceNumber, { color: theme.colors.onSurfaceVariant }]}>
                    #{index + 1}
                  </Text>
                  <Text style={[styles.sourceAddress, { color: theme.colors.onSurface }]}>
                    {source.source}
                  </Text>
                </View>
                <View style={styles.sourceStats}>
                  <Text style={[styles.sourceCount, { color: theme.colors.error }]}>
                    {source.count} messages
                  </Text>
                  <Text style={[styles.sourcePercentage, { color: theme.colors.onSurfaceVariant }]}>
                    {source.percentage}%
                  </Text>
                </View>
              </View>
            ))}
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
  analyticsChange: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  chartCard: {
    elevation: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
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
  chartTotal: {
    fontSize: 10,
    marginTop: 2,
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
  modelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modelName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accuracyChip: {
    height: 24,
  },
  modelMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  lastUpdated: {
    fontSize: 12,
    textAlign: 'center',
  },
  sourcesCard: {
    elevation: 4,
  },
  sourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  sourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sourceNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  sourceAddress: {
    fontSize: 14,
    fontWeight: '500',
  },
  sourceStats: {
    alignItems: 'flex-end',
  },
  sourceCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  sourcePercentage: {
    fontSize: 12,
    marginTop: 2,
  },
});
