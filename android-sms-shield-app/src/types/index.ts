export interface SMSMessage {
  id: string;
  address: string;
  body: string;
  timestamp: number;
  type?: string;
  isSpam: boolean;
  isAnalyzed: boolean;
  confidence: number;
  category: SpamCategory;
  features: Record<string, number>;
}

export enum SpamCategory {
  SAFE = 'SAFE',
  SPAM = 'SPAM',
  PHISHING = 'PHISHING',
  FRAUD = 'FRAUD',
  UNKNOWN = 'UNKNOWN'
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  isPremium: boolean;
  subscriptionType: SubscriptionType;
  preferences: UserPreferences;
  createdAt: number;
  lastLoginAt: number;
}

export enum SubscriptionType {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE'
}

export interface UserPreferences {
  autoScan: boolean;
  scanIncoming: boolean;
  scanOutgoing: boolean;
  autoBlock: boolean;
  notifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  cloudSync: boolean;
  analyticsEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export interface Analytics {
  totalMessages: number;
  spamDetected: number;
  safeMessages: number;
  protectionRate: number;
  moneySaved: number;
  lastUpdated: number;
}

export interface ModelPerformance {
  modelName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  totalPredictions: number;
  lastUpdated: number;
}

export interface SpamTrend {
  date: string;
  totalMessages: number;
  spamCount: number;
  safeCount: number;
}

export interface ScanResult {
  messageId: string;
  isSpam: boolean;
  confidence: number;
  category: SpamCategory;
  features: Record<string, number>;
  timestamp: number;
}

export interface AppSettings {
  scanning: {
    autoScan: boolean;
    scanIncoming: boolean;
    scanOutgoing: boolean;
    autoBlock: boolean;
  };
  notifications: {
    spamAlerts: boolean;
    reports: boolean;
    sound: boolean;
    vibration: boolean;
  };
  privacy: {
    cloudSync: boolean;
    analytics: boolean;
    crashReports: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    glassMorphism: boolean;
  };
}

// Navigation types
export type RootStackParamList = {
  Main: undefined;
  Settings: undefined;
  SMSList: undefined;
  Analytics: undefined;
  Scan: undefined;
};

export type TabParamList = {
  Home: undefined;
  Scan: undefined;
  Dashboard: undefined;
  Profile: undefined;
};

export type RootParamList = RootStackParamList & TabParamList;
