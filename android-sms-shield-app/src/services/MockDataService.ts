import { SMSMessage, Analytics, SpamCategory } from '../types';

export class MockDataService {
  private static instance: MockDataService;
  private mockMessages: SMSMessage[] = [];
  private isInitialized = false;

  static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  private constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    if (this.isInitialized) return;

    this.mockMessages = [
      {
        id: '1',
        address: '+233 24 123 4567',
        body: 'Your MTN mobile money transaction was successful. Amount: GHS 50.00. New balance: GHS 125.50',
        timestamp: Date.now() - 300000, // 5 minutes ago
        isSpam: false,
        isAnalyzed: true,
        confidence: 0.95,
        category: SpamCategory.SAFE,
        features: {},
      },
      {
        id: '2',
        address: '+233 20 987 6543',
        body: 'CONGRATULATIONS! You have won $50,000 in our lottery! Click here to claim: bit.ly/fake-win',
        timestamp: Date.now() - 600000, // 10 minutes ago
        isSpam: true,
        isAnalyzed: true,
        confidence: 0.92,
        category: SpamCategory.SPAM,
        features: {},
      },
      {
        id: '3',
        address: '+233 26 555 1234',
        body: 'Your Bank of Ghana account has been suspended due to suspicious activity. Verify now: secure-bank-gh.com',
        timestamp: Date.now() - 900000, // 15 minutes ago
        isSpam: true,
        isAnalyzed: true,
        confidence: 0.88,
        category: SpamCategory.PHISHING,
        features: {},
      },
      {
        id: '4',
        address: '+233 54 321 0987',
        body: 'Your Vodafone data bundle has expired. Reply with 1 to renew or 2 to check balance.',
        timestamp: Date.now() - 1200000, // 20 minutes ago
        isSpam: false,
        isAnalyzed: true,
        confidence: 0.85,
        category: SpamCategory.SAFE,
        features: {},
      },
      {
        id: '5',
        address: '+233 27 777 8888',
        body: 'URGENT: Your Netflix account has been compromised! Click here to secure: netflix-secure.xyz',
        timestamp: Date.now() - 1500000, // 25 minutes ago
        isSpam: true,
        isAnalyzed: true,
        confidence: 0.90,
        category: SpamCategory.PHISHING,
        features: {},
      },
      {
        id: '6',
        address: '+233 24 999 0000',
        body: 'Your Ghana Post delivery is ready for pickup. Tracking: GH123456789. Visit any post office.',
        timestamp: Date.now() - 1800000, // 30 minutes ago
        isSpam: false,
        isAnalyzed: true,
        confidence: 0.92,
        category: SpamCategory.SAFE,
        features: {},
      },
    ];

    this.isInitialized = true;
  }

  async getMockMessages(): Promise<SMSMessage[]> {
    return this.mockMessages.sort((a, b) => b.timestamp - a.timestamp);
  }

  async getMockAnalytics(): Promise<Analytics> {
    const totalMessages = this.mockMessages.length;
    const spamDetected = this.mockMessages.filter(msg => msg.isSpam).length;
    const safeMessages = totalMessages - spamDetected;
    const protectionRate = totalMessages > 0 ? (spamDetected / totalMessages) * 100 : 0;
    const moneySaved = spamDetected * 25; // GHS 25 per spam message

    return {
      totalMessages,
      spamDetected,
      safeMessages,
      protectionRate,
      moneySaved,
      lastUpdated: Date.now(),
    };
  }

  async addMockMessage(message: Omit<SMSMessage, 'id' | 'timestamp' | 'isAnalyzed' | 'features'>): Promise<SMSMessage> {
    const newMessage: SMSMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: Date.now(),
      isAnalyzed: true,
      features: {},
    };

    this.mockMessages.unshift(newMessage);
    return newMessage;
  }

  async generateRandomSpamMessage(): Promise<SMSMessage> {
    const spamTemplates = [
      {
        body: 'CONGRATULATIONS! You have won $100,000! Click here to claim: bit.ly/fake-lottery',
        category: SpamCategory.SPAM,
        confidence: 0.95,
      },
      {
        body: 'Your Bank of Ghana account has been suspended. Verify now: secure-bank-gh.com',
        category: SpamCategory.PHISHING,
        confidence: 0.92,
      },
      {
        body: 'URGENT: Your Netflix account has been compromised! Secure now: netflix-secure.xyz',
        category: SpamCategory.PHISHING,
        confidence: 0.88,
      },
      {
        body: 'FREE AIRTIME! Send this message to 5 friends to get GHS 50 airtime!',
        category: SpamCategory.SPAM,
        confidence: 0.85,
      },
      {
        body: 'Your Amazon order has been delayed. Click here to track: amazon-track.xyz',
        category: SpamCategory.PHISHING,
        confidence: 0.90,
      },
    ];

    const template = spamTemplates[Math.floor(Math.random() * spamTemplates.length)];
    const randomNumber = Math.floor(Math.random() * 900000000) + 100000000;

    return this.addMockMessage({
      address: `+233 ${randomNumber.toString().substring(0, 2)} ${randomNumber.toString().substring(2, 5)} ${randomNumber.toString().substring(5, 8)}`,
      body: template.body,
      isSpam: true,
      confidence: template.confidence,
      category: template.category,
    });
  }

  async generateRandomSafeMessage(): Promise<SMSMessage> {
    const safeTemplates = [
      {
        body: 'Your MTN mobile money transaction was successful. Amount: GHS 25.00. New balance: GHS 150.75',
        confidence: 0.95,
      },
      {
        body: 'Your Vodafone data bundle has been renewed. 2GB valid for 30 days. Thank you!',
        confidence: 0.92,
      },
      {
        body: 'Your Ghana Post delivery is ready for pickup. Tracking: GH987654321. Visit any post office.',
        confidence: 0.88,
      },
      {
        body: 'Your electricity bill payment was successful. Amount: GHS 45.50. Thank you for using ECG.',
        confidence: 0.90,
      },
      {
        body: 'Your water bill has been paid. Amount: GHS 12.00. Thank you for using GWCL.',
        confidence: 0.85,
      },
    ];

    const template = safeTemplates[Math.floor(Math.random() * safeTemplates.length)];
    const randomNumber = Math.floor(Math.random() * 900000000) + 100000000;

    return this.addMockMessage({
      address: `+233 ${randomNumber.toString().substring(0, 2)} ${randomNumber.toString().substring(2, 5)} ${randomNumber.toString().substring(5, 8)}`,
      body: template.body,
      isSpam: false,
      confidence: template.confidence,
      category: SpamCategory.SAFE,
    });
  }

  async clearMockData(): Promise<void> {
    this.mockMessages = [];
  }
}

export const mockDataService = MockDataService.getInstance();
export default mockDataService;
