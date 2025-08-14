import * as SMS from 'expo-sms';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { SMSMessage } from '../types';

export interface SMSPermissionStatus {
  readSMS: boolean;
  receiveSMS: boolean;
  sendSMS: boolean;
  notifications: boolean;
}

export interface SMSDetectionResult {
  isSpam: boolean;
  confidence: number;
  category: 'spam' | 'phishing' | 'legitimate' | 'suspicious';
  reason: string;
}

class SMSService {
  private isMonitoring = false;
  private messageStore: SMSMessage[] = [];
  private listeners: Array<(message: SMSMessage) => void> = [];
  private smsModule: any = null;
  private eventEmitter: NativeEventEmitter | null = null;

  constructor() {
    this.loadStoredMessages();
    this.initializeNativeModule();
  }

  /**
   * Initialize native SMS module if available
   */
  private initializeNativeModule(): void {
    try {
      if (NativeModules.SMSModule) {
        this.smsModule = NativeModules.SMSModule;
        this.eventEmitter = new NativeEventEmitter(this.smsModule);
        this.setupEventListeners();
        console.log('✅ Native SMS module initialized successfully');
      } else {
        console.log('⚠️ Native SMS module not available, using Expo SMS');
      }
    } catch (error) {
      console.log('❌ Error initializing native SMS module:', error);
    }
  }

  /**
   * Setup event listeners for real SMS
   */
  private setupEventListeners(): void {
    if (!this.eventEmitter) return;

    this.eventEmitter.addListener('SMSReceived', (messageData: any) => {
      console.log('📱 Real SMS received:', messageData);
      const message: SMSMessage = {
        id: messageData.id,
        address: messageData.address,
        body: messageData.body,
        timestamp: messageData.date,
        type: messageData.type || 'inbox',
        isSpam: false,
        confidence: 0,
        isAnalyzed: false,
        category: 'UNKNOWN' as any,
        features: {},
      };

      this.handleNewSMS(message);
    });
  }

  /**
   * Handle new SMS message
   */
  private async handleNewSMS(message: SMSMessage): Promise<void> {
    try {
      console.log('🔍 Analyzing real SMS:', message.address);
      
      // Analyze the message
      const analysis = await this.analyzeSMS(message);
      message.isSpam = analysis.isSpam;
      message.confidence = analysis.confidence;
      message.isAnalyzed = true;

      // Add to store
      this.messageStore.unshift(message);
      await this.saveMessages();

      // Notify listeners
      this.listeners.forEach(listener => listener(message));

      // Send notification if spam detected
      if (analysis.isSpam) {
        await this.sendSpamNotification(message, analysis);
        console.log('🚨 Spam detected and notification sent!');
      }

      console.log('✅ SMS analysis complete:', analysis);
    } catch (error) {
      console.error('❌ Error handling new SMS:', error);
    }
  }

  /**
   * Load stored messages from AsyncStorage
   */
  private async loadStoredMessages(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('sms_messages');
      if (stored) {
        this.messageStore = JSON.parse(stored);
        console.log('📱 Loaded', this.messageStore.length, 'stored messages');
      }
    } catch (error) {
      console.error('❌ Error loading stored messages:', error);
    }
  }

  /**
   * Save messages to AsyncStorage
   */
  private async saveMessages(): Promise<void> {
    try {
      await AsyncStorage.setItem('sms_messages', JSON.stringify(this.messageStore));
    } catch (error) {
      console.error('❌ Error saving messages:', error);
    }
  }

  /**
   * Check if SMS is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      if (this.smsModule) {
        return true; // Native module available
      }
      return await SMS.isAvailableAsync();
    } catch (error) {
      console.log('❌ SMS not available:', error);
      return false;
    }
  }

  /**
   * Request SMS permissions
   */
  async requestPermissions(): Promise<SMSPermissionStatus> {
    try {
      console.log('🔐 Requesting SMS permissions...');
      
      // Request notification permissions
      const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
      
      let smsPermissions = {
        readSMS: false,
        receiveSMS: false,
        sendSMS: false,
        notifications: notificationStatus === 'granted',
      };

      if (this.smsModule) {
        // Use native module for permissions
        const permissions = await this.smsModule.requestPermissions();
        smsPermissions = {
          readSMS: permissions.readSMS,
          receiveSMS: permissions.receiveSMS,
          sendSMS: permissions.sendSMS,
          notifications: permissions.notifications,
        };
        console.log('✅ Native permissions granted:', smsPermissions);
      } else {
        // Fallback to Expo SMS
        const isAvailable = await this.isAvailable();
        smsPermissions = {
          readSMS: isAvailable,
          receiveSMS: isAvailable,
          sendSMS: isAvailable,
          notifications: notificationStatus === 'granted',
        };
        console.log('⚠️ Using Expo SMS permissions:', smsPermissions);
      }

      return smsPermissions;
    } catch (error) {
      console.error('❌ Error requesting permissions:', error);
      return {
        readSMS: false,
        receiveSMS: false,
        sendSMS: false,
        notifications: false,
      };
    }
  }

  /**
   * Check current permission status
   */
  async checkPermissions(): Promise<SMSPermissionStatus> {
    try {
      const notificationStatus = await Notifications.getPermissionsAsync();
      
      if (this.smsModule) {
        // Use native module for permission check
        const permissions = await this.smsModule.requestPermissions();
        return {
          readSMS: permissions.readSMS,
          receiveSMS: permissions.receiveSMS,
          sendSMS: permissions.sendSMS,
          notifications: permissions.notifications,
        };
      } else {
        // Fallback to Expo SMS
        const isAvailable = await this.isAvailable();
        return {
          readSMS: isAvailable,
          receiveSMS: isAvailable,
          sendSMS: isAvailable,
          notifications: notificationStatus.status === 'granted',
        };
      }
    } catch (error) {
      console.error('❌ Error checking permissions:', error);
      return {
        readSMS: false,
        receiveSMS: false,
        sendSMS: false,
        notifications: false,
      };
    }
  }

  /**
   * Start monitoring SMS messages
   */
  async startMonitoring(): Promise<void> {
    try {
      console.log('🚀 Starting SMS monitoring...');
      
      if (this.smsModule) {
        // Use native module for monitoring
        await this.smsModule.startMonitoring();
        this.isMonitoring = true;
        console.log('✅ Native SMS monitoring started');
      } else {
        // Fallback to Expo SMS
        this.isMonitoring = true;
        console.log('⚠️ SMS monitoring started (Expo mode)');
      }
      
      // Set up notification handler
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
      
      console.log('✅ SMS monitoring active');
    } catch (error) {
      console.error('❌ Error starting SMS monitoring:', error);
      throw error;
    }
  }

  /**
   * Stop monitoring SMS messages
   */
  async stopMonitoring(): Promise<void> {
    try {
      if (this.smsModule) {
        await this.smsModule.stopMonitoring();
      }
      this.isMonitoring = false;
      console.log('⏹️ SMS monitoring stopped');
    } catch (error) {
      console.error('❌ Error stopping SMS monitoring:', error);
      throw error;
    }
  }

  /**
   * Get all SMS messages
   */
  async getAllSMS(): Promise<SMSMessage[]> {
    try {
      console.log('📱 Fetching SMS messages...');
      
      if (this.smsModule) {
        // Use native module to get real SMS
        const messages = await this.smsModule.getAllSMS();
        console.log('✅ Retrieved', messages.length, 'real SMS messages');
        
        return messages.map((msg: any) => ({
          id: msg.id,
          address: msg.address,
          body: msg.body,
          timestamp: msg.date,
          type: msg.type || 'inbox',
          isSpam: false,
          confidence: 0,
          isAnalyzed: false,
          category: 'UNKNOWN' as any,
          features: {},
        }));
      } else {
        // Return stored messages if native module not available
        console.log('⚠️ Using stored messages (no native module)');
        return this.messageStore;
      }
    } catch (error) {
      console.error('❌ Error getting SMS messages:', error);
      return this.messageStore;
    }
  }

  /**
   * Add a new SMS message
   */
  async addSMSMessage(message: Omit<SMSMessage, 'id' | 'timestamp' | 'isAnalyzed' | 'features'>): Promise<SMSMessage> {
    const newMessage: SMSMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: Date.now(),
      isAnalyzed: false,
      features: {},
    };

    // Analyze the message
    const analysis = await this.analyzeSMS(newMessage);
    newMessage.isSpam = analysis.isSpam;
    newMessage.confidence = analysis.confidence;
    newMessage.isAnalyzed = true;

    // Add to store
    this.messageStore.unshift(newMessage);
    await this.saveMessages();

    // Notify listeners
    this.listeners.forEach(listener => listener(newMessage));

    // Send notification if spam detected
    if (analysis.isSpam) {
      await this.sendSpamNotification(newMessage, analysis);
    }

    return newMessage;
  }

  /**
   * Analyze a single SMS message for spam/phishing
   */
  async analyzeSMS(message: SMSMessage): Promise<SMSDetectionResult> {
    try {
      if (this.smsModule) {
        // Use native module for analysis
        const result = await this.smsModule.analyzeSMS({
          id: message.id,
          address: message.address,
          body: message.body,
          date: message.timestamp,
          type: message.type,
        });
        return {
          isSpam: result.isSpam,
          confidence: result.confidence,
          category: result.category,
          reason: result.reason,
        };
      } else {
        // Fallback to local analysis
        return this.advancedAnalysis(message);
      }
    } catch (error) {
      console.error('❌ Error analyzing SMS, using fallback:', error);
      return this.advancedAnalysis(message);
    }
  }

  /**
   * Advanced SMS analysis with machine learning patterns
   */
  private advancedAnalysis(message: SMSMessage): SMSDetectionResult {
    const body = message.body.toLowerCase();
    const address = message.address;

    // Enhanced spam detection patterns
    const spamPatterns = [
      'urgent', 'account suspended', 'verify your account', 'click here',
      'limited time offer', 'free money', 'lottery winner', 'bank security',
      'unusual activity', 'verify now', 'account locked', 'suspicious login',
      'congratulations', 'you\'ve won', 'claim your prize', 'limited time',
      'act now', 'don\'t miss out', 'exclusive offer', 'one time only',
      'free airtime', 'send to claim', 'reply to win', 'text to claim',
      'special offer', 'limited availability', 'expires soon', 'last chance',
      'urgent action required', 'immediate attention', 'security alert',
      'fraudulent activity', 'suspicious transaction', 'verify identity'
    ];

    const phishingPatterns = [
      'bank', 'paypal', 'amazon', 'netflix', 'apple', 'google', 'microsoft',
      'verify', 'secure', 'login', 'password', 'account', 'ebay', 'facebook',
      'instagram', 'twitter', 'linkedin', 'dropbox', 'onedrive', 'icloud',
      'mtn', 'vodafone', 'airtel', 'glo', 'mobile money', 'momo',
      'bank of ghana', 'ghana bank', 'ghana post', 'ghana telecom'
    ];

    const financialPatterns = [
      'bank transfer', 'mobile money', 'momo', 'airtime', 'data bundle',
      'payment', 'transaction', 'account balance', 'withdrawal', 'deposit',
      'loan', 'credit', 'debit', 'refund', 'cashback', 'bonus'
    ];

    let spamScore = 0;
    let phishingScore = 0;
    let financialScore = 0;

    // Check for spam patterns
    spamPatterns.forEach(pattern => {
      if (body.includes(pattern)) {
        spamScore += 0.25;
      }
    });

    // Check for phishing patterns
    phishingPatterns.forEach(pattern => {
      if (body.includes(pattern)) {
        phishingScore += 0.15;
      }
    });

    // Check for financial patterns
    financialPatterns.forEach(pattern => {
      if (body.includes(pattern)) {
        financialScore += 0.1;
      }
    });

    // Check for suspicious URLs
    const urlRegex = /https?:\/\/[^\s]+/g;
    const urls = body.match(urlRegex);
    if (urls && urls.length > 0) {
      phishingScore += 0.3;
      // Check for suspicious domains
      const suspiciousDomains = ['bit.ly', 'tinyurl', 'goo.gl', 't.co', 'fb.me'];
      urls.forEach(url => {
        suspiciousDomains.forEach(domain => {
          if (url.includes(domain)) {
            phishingScore += 0.2;
          }
        });
      });
    }

    // Check for urgency indicators
    const urgencyWords = ['urgent', 'immediate', 'now', 'quick', 'fast', 'hurry'];
    urgencyWords.forEach(word => {
      if (body.includes(word)) {
        spamScore += 0.15;
      }
    });

    // Check for excessive punctuation and caps
    const capsRatio = (body.match(/[A-Z]/g) || []).length / body.length;
    if (capsRatio > 0.3) {
      spamScore += 0.2;
    }

    const exclamationCount = (body.match(/!/g) || []).length;
    if (exclamationCount > 2) {
      spamScore += 0.15;
    }

    // Check for suspicious phone numbers
    const phoneRegex = /\+?[0-9]{10,}/g;
    const phones = body.match(phoneRegex);
    if (phones && phones.length > 0) {
      // Check if it's a known Ghanaian number pattern
      const ghanaPattern = /^\+?233[0-9]{8}$/;
      const isGhanaian = phones.some(phone => ghanaPattern.test(phone));
      if (!isGhanaian) {
        phishingScore += 0.2;
      }
    }

    // Determine category and confidence
    const maxScore = Math.max(spamScore, phishingScore);
    
    if (maxScore >= 0.6) {
      return {
        isSpam: true,
        confidence: Math.min(maxScore, 0.95),
        category: spamScore > phishingScore ? 'spam' : 'phishing',
        reason: spamScore > phishingScore 
          ? 'Contains multiple spam indicators' 
          : 'Contains suspicious phishing patterns',
      };
    } else if (maxScore >= 0.3) {
      return {
        isSpam: false,
        confidence: maxScore,
        category: 'suspicious',
        reason: 'Contains some suspicious elements',
      };
    } else {
      return {
        isSpam: false,
        confidence: 1 - maxScore,
        category: 'legitimate',
        reason: 'No suspicious patterns detected',
      };
    }
  }

  /**
   * Send spam notification
   */
  private async sendSpamNotification(message: SMSMessage, analysis: SMSDetectionResult): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🚨 Spam Detected',
          body: `Suspicious message from ${message.address}: ${message.body.substring(0, 50)}...`,
          data: { messageId: message.id },
        },
        trigger: null, // Send immediately
      });
      console.log('🔔 Spam notification sent');
    } catch (error) {
      console.error('❌ Error sending notification:', error);
    }
  }

  /**
   * Listen for new SMS messages
   */
  onSMSReceived(callback: (message: SMSMessage) => void): () => void {
    this.listeners.push(callback);
    
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Get analytics data
   */
  async getAnalytics(): Promise<{
    totalMessages: number;
    spamDetected: number;
    safeMessages: number;
    protectionRate: number;
    moneySaved: number;
  }> {
    const messages = await this.getAllSMS();
    const totalMessages = messages.length;
    const spamDetected = messages.filter(msg => msg.isSpam).length;
    const safeMessages = totalMessages - spamDetected;
    const protectionRate = totalMessages > 0 ? (spamDetected / totalMessages) * 100 : 0;
    const moneySaved = spamDetected * 2; // Estimate $2 saved per spam message

    return {
      totalMessages,
      spamDetected,
      safeMessages,
      protectionRate,
      moneySaved,
    };
  }

  /**
   * Clear all messages
   */
  async clearAllMessages(): Promise<void> {
    this.messageStore = [];
    await this.saveMessages();
  }

  /**
   * Clean up all listeners
   */
  cleanup(): void {
    this.listeners = [];
    if (this.eventEmitter) {
      this.eventEmitter.removeAllListeners('SMSReceived');
    }
  }
}

export const smsService = new SMSService();
export default smsService;
