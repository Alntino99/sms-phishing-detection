import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { GmailModule } = NativeModules;

// Expo Go compatible Gmail service with mock data

export interface GmailMessage {
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: Date;
  isRead: boolean;
  isSpam: boolean;
  category: 'spam' | 'phishing' | 'legitimate' | 'suspicious';
  confidence: number;
}

export interface GmailPermissionStatus {
  readEmails: boolean;
  sendEmails: boolean;
  modifyEmails: boolean;
}

export interface GmailDetectionResult {
  isSpam: boolean;
  confidence: number;
  category: 'spam' | 'phishing' | 'legitimate' | 'suspicious';
  reason: string;
}

class GmailService {
  private eventEmitter: NativeEventEmitter | null = null;
  private listeners: Array<() => void> = [];
  private isAuthenticated = false;
  private isMonitoring = false;

  constructor() {
    if (Platform.OS === 'android' && GmailModule) {
      this.eventEmitter = new NativeEventEmitter(GmailModule);
    }
  }

  /**
   * Request Gmail permissions and authenticate (Expo Go compatible)
   */
  async authenticate(): Promise<boolean> {
    try {
      // In Expo Go, simulate successful authentication
      this.isAuthenticated = true;
      console.log('Gmail authentication successful (Expo Go mode)');
      return true;
    } catch (error) {
      console.error('Error authenticating with Gmail:', error);
      return false;
    }
  }

  /**
   * Check Gmail permission status (Expo Go compatible)
   */
  async checkPermissions(): Promise<GmailPermissionStatus> {
    try {
      return {
        readEmails: this.isAuthenticated,
        sendEmails: false, // Not implemented in Expo Go
        modifyEmails: this.isAuthenticated,
      };
    } catch (error) {
      console.error('Error checking Gmail permissions:', error);
      return {
        readEmails: false,
        sendEmails: false,
        modifyEmails: false,
      };
    }
  }

  /**
   * Get mock emails for testing (Expo Go compatible)
   */
  async getRecentEmails(limit: number = 50): Promise<GmailMessage[]> {
    try {
      // Return mock data for Expo Go testing
      return [
        {
          id: '1',
          threadId: 'thread1',
          from: 'noreply@bank.com',
          to: 'user@gmail.com',
          subject: 'URGENT: Your account has been suspended',
          body: 'Dear customer, your account has been suspended due to suspicious activity. Click here to verify your identity immediately.',
          date: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
          isRead: false,
          isSpam: true,
          category: 'phishing',
          confidence: 0.92,
        },
        {
          id: '2',
          threadId: 'thread2',
          from: 'support@amazon.com',
          to: 'user@gmail.com',
          subject: 'Your Amazon order has been shipped',
          body: 'Your order #12345 has been shipped and will arrive tomorrow. Track your package here.',
          date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          isRead: true,
          isSpam: false,
          category: 'legitimate',
          confidence: 0.95,
        },
        {
          id: '3',
          threadId: 'thread3',
          from: 'lottery@winner.com',
          to: 'user@gmail.com',
          subject: 'CONGRATULATIONS! You have won $1,000,000!',
          body: 'You have been selected as the winner of our lottery! Claim your prize now by clicking the link below.',
          date: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          isRead: false,
          isSpam: true,
          category: 'spam',
          confidence: 0.98,
        },
        {
          id: '4',
          threadId: 'thread4',
          from: 'security@google.com',
          to: 'user@gmail.com',
          subject: 'Unusual login attempt detected',
          body: 'We detected a login attempt from an unrecognized device. If this was you, please verify your account.',
          date: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
          isRead: false,
          isSpam: false,
          category: 'suspicious',
          confidence: 0.65,
        },
        {
          id: '5',
          threadId: 'thread5',
          from: 'friend@email.com',
          to: 'user@gmail.com',
          subject: 'Meeting tomorrow',
          body: 'Hi! Just wanted to confirm our meeting tomorrow at 2 PM. See you there!',
          date: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
          isRead: true,
          isSpam: false,
          category: 'legitimate',
          confidence: 0.88,
        },
      ].slice(0, limit);
    } catch (error) {
      console.error('Error getting Gmail emails:', error);
      return [];
    }
  }

  /**
   * Get emails from a specific label/folder (Expo Go compatible)
   */
  async getEmailsFromLabel(label: string, limit: number = 50): Promise<GmailMessage[]> {
    try {
      // For Expo Go, return the same mock data regardless of label
      return this.getRecentEmails(limit);
    } catch (error) {
      console.error('Error getting emails from label:', error);
      return [];
    }
  }

  /**
   * Analyze a single email for spam/phishing (Expo Go compatible)
   */
  async analyzeEmail(email: GmailMessage): Promise<GmailDetectionResult> {
    return this.basicEmailAnalysis(email);
  }

  /**
   * Basic email analysis (works in Expo Go)
   */
  private basicEmailAnalysis(email: GmailMessage): GmailDetectionResult {
    const subject = email.subject.toLowerCase();
    const body = email.body.toLowerCase();
    const from = email.from.toLowerCase();

    // Email spam patterns
    const spamPatterns = [
      'urgent',
      'account suspended',
      'verify your account',
      'click here',
      'limited time offer',
      'free money',
      'lottery winner',
      'bank security',
      'unusual activity',
      'verify now',
      'account locked',
      'suspicious login',
      'congratulations',
      'you\'ve won',
      'claim your prize',
      'limited time',
      'act now',
      'don\'t miss out',
      'exclusive offer',
      'one time only',
      'viagra',
      'weight loss',
      'make money fast',
      'work from home',
      'earn money online',
    ];

    // Email phishing patterns
    const phishingPatterns = [
      'bank',
      'paypal',
      'amazon',
      'netflix',
      'apple',
      'google',
      'microsoft',
      'verify',
      'secure',
      'login',
      'password',
      'account',
      'ebay',
      'facebook',
      'instagram',
      'twitter',
      'linkedin',
      'dropbox',
      'onedrive',
      'icloud',
      'irs',
      'tax',
      'social security',
      'credit card',
      'banking',
    ];

    let spamScore = 0;
    let phishingScore = 0;

    // Check subject line
    spamPatterns.forEach(pattern => {
      if (subject.includes(pattern)) {
        spamScore += 0.4;
      }
    });

    phishingPatterns.forEach(pattern => {
      if (subject.includes(pattern)) {
        phishingScore += 0.3;
      }
    });

    // Check email body
    spamPatterns.forEach(pattern => {
      if (body.includes(pattern)) {
        spamScore += 0.2;
      }
    });

    phishingPatterns.forEach(pattern => {
      if (body.includes(pattern)) {
        phishingScore += 0.15;
      }
    });

    // Check for suspicious URLs
    const urlRegex = /https?:\/\/[^\s]+/g;
    if (urlRegex.test(body)) {
      phishingScore += 0.3;
    }

    // Check for urgency indicators
    const urgencyWords = ['urgent', 'immediate', 'now', 'quick', 'fast', 'asap', 'emergency'];
    urgencyWords.forEach(word => {
      if (subject.includes(word) || body.includes(word)) {
        spamScore += 0.3;
      }
    });

    // Check for suspicious sender patterns
    const suspiciousSenders = [
      'noreply',
      'no-reply',
      'donotreply',
      'do-not-reply',
      'support',
      'security',
      'admin',
      'system',
    ];

    suspiciousSenders.forEach(sender => {
      if (from.includes(sender)) {
        spamScore += 0.2;
      }
    });

    // Check for excessive capitalization
    const capitalRatio = (subject.match(/[A-Z]/g) || []).length / subject.length;
    if (capitalRatio > 0.5) {
      spamScore += 0.2;
    }

    // Check for excessive punctuation
    const exclamationCount = (subject.match(/!/g) || []).length;
    if (exclamationCount > 2) {
      spamScore += 0.3;
    }

    const maxScore = Math.max(spamScore, phishingScore);
    
    if (maxScore >= 0.7) {
      return {
        isSpam: true,
        confidence: maxScore,
        category: spamScore > phishingScore ? 'spam' : 'phishing',
        reason: spamScore > phishingScore 
          ? 'Contains multiple spam indicators' 
          : 'Contains suspicious phishing patterns',
      };
    } else if (maxScore >= 0.4) {
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
   * Start Gmail monitoring (Expo Go compatible)
   */
  async startMonitoring(): Promise<void> {
    try {
      this.isMonitoring = true;
      console.log('Gmail monitoring started (Expo Go mode)');
      this.simulateIncomingEmails();
    } catch (error) {
      console.error('Error starting Gmail monitoring:', error);
      throw error;
    }
  }

  /**
   * Stop Gmail monitoring
   */
  async stopMonitoring(): Promise<void> {
    try {
      this.isMonitoring = false;
      console.log('Gmail monitoring stopped');
    } catch (error) {
      console.error('Error stopping Gmail monitoring:', error);
      throw error;
    }
  }

  /**
   * Simulate incoming emails for Expo Go testing
   */
  private simulateIncomingEmails() {
    if (!this.isMonitoring) return;

    const mockEmails = [
      {
        id: Date.now().toString(),
        threadId: 'sim1',
        from: 'phishing@fakebank.com',
        to: 'user@gmail.com',
        subject: 'URGENT: Your account has been compromised',
        body: 'Your bank account has been compromised. Click here to secure it immediately.',
        date: new Date(),
        isRead: false,
      },
      {
        id: (Date.now() + 1).toString(),
        threadId: 'sim2',
        from: 'spam@lottery.com',
        to: 'user@gmail.com',
        subject: 'CONGRATULATIONS! You won $500,000!',
        body: 'You have won our lottery! Claim your prize now!',
        date: new Date(),
        isRead: false,
      },
    ];

    // Simulate incoming emails every 15 seconds
    const interval = setInterval(() => {
      if (!this.isMonitoring) {
        clearInterval(interval);
        return;
      }

      const randomEmail = mockEmails[Math.floor(Math.random() * mockEmails.length)];
      const email: GmailMessage = {
        ...randomEmail,
        id: Date.now().toString(),
        isSpam: false,
        category: 'legitimate',
        confidence: 0,
      };

      // Analyze the email
      this.analyzeEmail(email).then(result => {
        email.isSpam = result.isSpam;
        email.category = result.category;
        email.confidence = result.confidence;
        
        // Emit the email to listeners
        this.listeners.forEach(listener => {
          if (typeof listener === 'function') {
            listener();
          }
        });
      });
    }, 15000); // Every 15 seconds
  }

  /**
   * Listen for new emails (Expo Go compatible)
   */
  onEmailReceived(callback: (email: GmailMessage) => void): () => void {
    // In Expo Go, we'll simulate email reception
    const mockEmail: GmailMessage = {
      id: Date.now().toString(),
      threadId: 'expo1',
      from: 'test@example.com',
      to: 'user@gmail.com',
      subject: 'Test email for Expo Go',
      body: 'This is a test email to demonstrate the Gmail monitoring feature.',
      date: new Date(),
      isRead: false,
      isSpam: false,
      category: 'legitimate',
      confidence: 0,
    };

    // Simulate email reception after 8 seconds
    setTimeout(() => {
      this.analyzeEmail(mockEmail).then(result => {
        mockEmail.isSpam = result.isSpam;
        mockEmail.category = result.category;
        mockEmail.confidence = result.confidence;
        callback(mockEmail);
      });
    }, 8000);

    const cleanup = () => {
      console.log('Gmail listener cleaned up');
    };

    this.listeners.push(cleanup);
    return cleanup;
  }

  /**
   * Mark email as spam (Expo Go compatible)
   */
  async markAsSpam(emailId: string): Promise<boolean> {
    try {
      console.log(`Marking email ${emailId} as spam (Expo Go mode)`);
      return true;
    } catch (error) {
      console.error('Error marking email as spam:', error);
      return false;
    }
  }

  /**
   * Move email to trash (Expo Go compatible)
   */
  async moveToTrash(emailId: string): Promise<boolean> {
    try {
      console.log(`Moving email ${emailId} to trash (Expo Go mode)`);
      return true;
    } catch (error) {
      console.error('Error moving email to trash:', error);
      return false;
    }
  }

  /**
   * Get email labels (Expo Go compatible)
   */
  async getLabels(): Promise<string[]> {
    try {
      return ['INBOX', 'SENT', 'DRAFT', 'SPAM', 'TRASH'];
    } catch (error) {
      console.error('Error getting Gmail labels:', error);
      return [];
    }
  }

  /**
   * Clean up all listeners
   */
  cleanup(): void {
    this.listeners.forEach(cleanup => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    });
    this.listeners = [];
  }

  /**
   * Check if authenticated
   */
  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }
}

export const gmailService = new GmailService();
export default gmailService;
