import React, { useState } from 'react';
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
  useTheme,
  Chip,
  Searchbar,
  FAB,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface SMSMessage {
  id: string;
  address: string;
  body: string;
  timestamp: number;
  isSpam: boolean;
  category: string;
  confidence: number;
}

export default function SMSListScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const sampleMessages: SMSMessage[] = [
    {
      id: '1',
      address: '+233 24 123 4567',
      body: 'Congratulations! You have won ₵50,000. Click here to claim your prize.',
      timestamp: Date.now() - 1000 * 60 * 5,
      isSpam: true,
      category: 'FRAUD',
      confidence: 0.95,
    },
    {
      id: '2',
      address: 'Bank of Ghana',
      body: 'Your account has been suspended. Call +233-xxx-xxx to verify.',
      timestamp: Date.now() - 1000 * 60 * 15,
      isSpam: true,
      category: 'PHISHING',
      confidence: 0.88,
    },
    {
      id: '3',
      address: 'MTN Mobile Money',
      body: 'Your transaction was successful. Amount: ₵100.00. Ref: TXN123456',
      timestamp: Date.now() - 1000 * 60 * 30,
      isSpam: false,
      category: 'SAFE',
      confidence: 0.92,
    },
    {
      id: '4',
      address: '+233 20 987 6543',
      body: 'Free airtime! Send "FREE" to 1234 to get ₵5 airtime instantly.',
      timestamp: Date.now() - 1000 * 60 * 45,
      isSpam: true,
      category: 'SPAM',
      confidence: 0.76,
    },
    {
      id: '5',
      address: 'Vodafone Ghana',
      body: 'Your data bundle has been activated. 2GB valid for 30 days.',
      timestamp: Date.now() - 1000 * 60 * 60,
      isSpam: false,
      category: 'SAFE',
      confidence: 0.89,
    },
  ];

  const filters = [
    { id: 'all', label: 'All', icon: 'list' },
    { id: 'spam', label: 'Spam', icon: 'warning' },
    { id: 'safe', label: 'Safe', icon: 'checkmark-circle' },
    { id: 'fraud', label: 'Fraud', icon: 'alert-circle' },
    { id: 'phishing', label: 'Phishing', icon: 'fish' },
  ];

  const filteredMessages = sampleMessages.filter(message => {
    const matchesSearch = message.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'spam') return matchesSearch && message.isSpam;
    if (selectedFilter === 'safe') return matchesSearch && !message.isSpam;
    if (selectedFilter === 'fraud') return matchesSearch && message.category === 'FRAUD';
    if (selectedFilter === 'phishing') return matchesSearch && message.category === 'PHISHING';
    
    return matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'FRAUD':
        return theme.colors.error;
      case 'PHISHING':
        return '#FF9800';
      case 'SPAM':
        return '#9C27B0';
      default:
        return theme.colors.primary;
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.header}
      >
        <BlurView intensity={20} style={styles.headerContent}>
          <Ionicons name="mail" size={48} color="white" />
          <Text style={styles.headerTitle}>SMS Messages</Text>
          <Text style={styles.headerSubtitle}>View and manage scanned messages</Text>
        </BlurView>
      </LinearGradient>

      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <Searchbar
          placeholder="Search messages..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
          iconColor={theme.colors.onSurfaceVariant}
          inputStyle={{ color: theme.colors.onSurface }}
        />
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => setSelectedFilter(filter.id)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: selectedFilter === filter.id 
                    ? theme.colors.primary 
                    : theme.colors.surface,
                }
              ]}
            >
              <Ionicons 
                name={filter.icon as any} 
                size={16} 
                color={selectedFilter === filter.id ? 'white' : theme.colors.onSurfaceVariant} 
              />
              <Text style={[
                styles.filterText,
                { 
                  color: selectedFilter === filter.id 
                    ? 'white' 
                    : theme.colors.onSurfaceVariant 
                }
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Messages List */}
      <ScrollView style={styles.messagesContainer}>
        {filteredMessages.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="mail-open" size={64} color={theme.colors.onSurfaceVariant} />
            <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
              No messages found
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Try adjusting your search or filters
            </Text>
          </View>
        ) : (
          filteredMessages.map((message) => (
            <Card key={message.id} style={[styles.messageCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <View style={styles.messageHeader}>
                  <View style={styles.messageInfo}>
                    <Text style={[styles.messageAddress, { color: theme.colors.onSurface }]}>
                      {message.address}
                    </Text>
                    <Text style={[styles.messageTime, { color: theme.colors.onSurfaceVariant }]}>
                      {formatTime(message.timestamp)}
                    </Text>
                  </View>
                  <View style={styles.messageStatus}>
                    <Ionicons 
                      name={message.isSpam ? 'warning' : 'checkmark-circle'} 
                      size={20} 
                      color={message.isSpam ? theme.colors.error : theme.colors.primary} 
                    />
                    <Chip 
                      style={[
                        styles.categoryChip,
                        { backgroundColor: getCategoryColor(message.category) + '20' }
                      ]}
                      textStyle={{ color: getCategoryColor(message.category) }}
                    >
                      {message.category}
                    </Chip>
                  </View>
                </View>
                
                <Text style={[styles.messageBody, { color: theme.colors.onSurface }]}>
                  {message.body}
                </Text>
                
                <View style={styles.messageFooter}>
                  <Text style={[styles.confidenceText, { color: theme.colors.onSurfaceVariant }]}>
                    Confidence: {(message.confidence * 100).toFixed(1)}%
                  </Text>
                  <View style={styles.messageActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="eye" size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="share" size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="flag" size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <FAB
        icon="refresh"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {}}
      />
    </View>
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
  searchSection: {
    padding: 20,
  },
  searchBar: {
    marginBottom: 15,
    elevation: 4,
  },
  filtersContainer: {
    marginBottom: 10,
  },
  filtersContent: {
    paddingHorizontal: 5,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    elevation: 2,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messageCard: {
    marginBottom: 15,
    elevation: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  messageInfo: {
    flex: 1,
  },
  messageAddress: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  messageTime: {
    fontSize: 12,
  },
  messageStatus: {
    alignItems: 'flex-end',
  },
  categoryChip: {
    height: 24,
    marginTop: 5,
  },
  messageBody: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 12,
  },
  messageActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
