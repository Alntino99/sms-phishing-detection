// Enhanced Real-Time Mobile SMS Integration
// This system provides multiple approaches to connect with mobile SMS apps

class RealTimeSMSIntegration {
    constructor() {
        this.integrationMethods = {
            pwa: false,
            webhook: false,
            clipboard: false,
            shareApi: false,
            nativeApp: false
        };
        this.smsQueue = [];
        this.isMonitoring = false;
        this.analysisEngine = null;
        
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Real-Time SMS Integration...');
        
        // Check available integration methods
        await this.detectIntegrationMethods();
        
        // Initialize analysis engine
        this.analysisEngine = new SMSAnalysisEngine();
        
        // Start monitoring based on available methods
        await this.startMonitoring();
    }

    async detectIntegrationMethods() {
        // 1. PWA Integration
        this.integrationMethods.pwa = this.checkPWASupport();
        
        // 2. Webhook Integration (for native apps)
        this.integrationMethods.webhook = this.checkWebhookSupport();
        
        // 3. Clipboard Integration
        this.integrationMethods.clipboard = this.checkClipboardSupport();
        
        // 4. Share API Integration
        this.integrationMethods.shareApi = this.checkShareAPISupport();
        
        // 5. Native App Integration
        this.integrationMethods.nativeApp = this.checkNativeAppSupport();
        
        console.log('📱 Available integration methods:', this.integrationMethods);
    }

    checkPWASupport() {
        return 'serviceWorker' in navigator && 
               'PushManager' in window &&
               'Notification' in window;
    }

    checkWebhookSupport() {
        // Check if we can receive webhooks from native apps
        return 'fetch' in window && 'EventSource' in window;
    }

    checkClipboardSupport() {
        return 'clipboard' in navigator || 'clipboardData' in window;
    }

    checkShareAPISupport() {
        return 'share' in navigator;
    }

    checkNativeAppSupport() {
        // Check for custom URL schemes or deep linking
        return window.location.protocol === 'sms-shield:' || 
               window.location.search.includes('sms_data');
    }

    async startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        
        // Start all available monitoring methods
        if (this.integrationMethods.pwa) {
            await this.startPWAMonitoring();
        }
        
        if (this.integrationMethods.webhook) {
            await this.startWebhookMonitoring();
        }
        
        if (this.integrationMethods.clipboard) {
            await this.startClipboardMonitoring();
        }
        
        if (this.integrationMethods.shareApi) {
            await this.setupShareAPI();
        }
        
        if (this.integrationMethods.nativeApp) {
            await this.setupNativeAppIntegration();
        }
        
        console.log('✅ Real-time SMS monitoring started');
    }

    async startPWAMonitoring() {
        try {
            // Register service worker for background monitoring
            const registration = await navigator.serviceWorker.register('sw-sms-monitor.js');
            
            // Request notification permissions
            if ('Notification' in window) {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    console.log('✅ PWA notifications enabled');
                }
            }
            
            // Listen for push notifications (SMS data from native apps)
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data.type === 'SMS_RECEIVED') {
                    this.handleIncomingSMS(event.data.sms);
                }
            });
            
        } catch (error) {
            console.error('PWA monitoring failed:', error);
        }
    }

    async startWebhookMonitoring() {
        try {
            // Create webhook endpoint for native apps
            const webhookUrl = `${window.location.origin}/sms-webhook`;
            
            // Listen for webhook events
            const eventSource = new EventSource('/sms-events');
            eventSource.onmessage = (event) => {
                const smsData = JSON.parse(event.data);
                this.handleIncomingSMS(smsData);
            };
            
            console.log('✅ Webhook monitoring active:', webhookUrl);
            
        } catch (error) {
            console.error('Webhook monitoring failed:', error);
        }
    }

    async startClipboardMonitoring() {
        try {
            // Monitor clipboard for SMS content
            setInterval(async () => {
                try {
                    const clipboardText = await navigator.clipboard.readText();
                    if (this.isSMSText(clipboardText)) {
                        this.handleIncomingSMS(clipboardText);
                    }
                } catch (error) {
                    // Clipboard access denied or no text
                }
            }, 5000); // Check every 5 seconds
            
            console.log('✅ Clipboard monitoring active');
            
        } catch (error) {
            console.error('Clipboard monitoring failed:', error);
        }
    }

    setupShareAPI() {
        try {
            // Override share function to capture SMS content
            if ('share' in navigator) {
                const originalShare = navigator.share;
                navigator.share = async (data) => {
                    if (data.text && this.isSMSText(data.text)) {
                        this.handleIncomingSMS(data.text);
                    }
                    return originalShare.call(navigator, data);
                };
            }
            
            console.log('✅ Share API integration active');
            
        } catch (error) {
            console.error('Share API setup failed:', error);
        }
    }

    async setupNativeAppIntegration() {
        try {
            // Handle deep link parameters
            const urlParams = new URLSearchParams(window.location.search);
            const smsData = urlParams.get('sms_data');
            
            if (smsData) {
                const decodedSMS = decodeURIComponent(smsData);
                this.handleIncomingSMS(decodedSMS);
            }
            
            // Listen for custom URL scheme events
            window.addEventListener('sms-shield:message', (event) => {
                this.handleIncomingSMS(event.detail);
            });
            
            console.log('✅ Native app integration active');
            
        } catch (error) {
            console.error('Native app integration failed:', error);
        }
    }

    isSMSText(text) {
        // Basic SMS detection patterns
        const smsPatterns = [
            /^[A-Za-z0-9\s\-_.,!?@#$%^&*()+=<>{}[\]|\\/:;"'`~]+$/,
            /(?:from|sender|message|text|sms)/i,
            /\b\d{10,}\b/, // Phone numbers
        ];
        
        return smsPatterns.some(pattern => pattern.test(text)) && text.length > 10;
    }

    async handleIncomingSMS(smsData) {
        try {
            console.log('📱 New SMS received:', smsData);
            
            // Parse SMS data
            const sms = this.parseSMSData(smsData);
            
            // Add to processing queue
            this.smsQueue.push({
                id: Date.now(),
                ...sms,
                timestamp: new Date(),
                status: 'pending'
            });
            
            // Process immediately
            await this.processSMSQueue();
            
        } catch (error) {
            console.error('SMS handling failed:', error);
        }
    }

    parseSMSData(smsData) {
        // Handle different SMS data formats
        if (typeof smsData === 'string') {
            return {
                sender: 'Unknown',
                message: smsData,
                timestamp: new Date()
            };
        }
        
        if (typeof smsData === 'object') {
            return {
                sender: smsData.sender || smsData.from || 'Unknown',
                message: smsData.message || smsData.text || smsData.content || '',
                timestamp: smsData.timestamp ? new Date(smsData.timestamp) : new Date()
            };
        }
        
        return {
            sender: 'Unknown',
            message: String(smsData),
            timestamp: new Date()
        };
    }

    async processSMSQueue() {
        while (this.smsQueue.length > 0) {
            const smsItem = this.smsQueue.shift();
            
            try {
                // Analyze SMS
                const analysis = await this.analysisEngine.analyze(smsItem.message);
                
                // Update item with analysis
                smsItem.analysis = analysis;
                smsItem.status = 'completed';
                
                // Send notifications
                await this.sendNotifications(smsItem, analysis);
                
                // Update UI
                this.updateUI(smsItem, analysis);
                
                // Store in history
                this.storeAnalysis(smsItem, analysis);
                
            } catch (error) {
                console.error('SMS processing failed:', error);
                smsItem.status = 'failed';
            }
        }
    }

    async sendNotifications(smsItem, analysis) {
        try {
            // Browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
                const title = analysis.isPhishing ? '🚨 Phishing Alert!' : '✅ Safe Message';
                const body = analysis.isPhishing 
                    ? `Suspicious SMS from ${smsItem.sender}: ${analysis.reason}`
                    : `Safe message from ${smsItem.sender}`;
                
                new Notification(title, {
                    body: body,
                    icon: '/favicon.svg',
                    badge: '/favicon.svg',
                    tag: `sms-${smsItem.id}`,
                    requireInteraction: analysis.isPhishing
                });
            }
            
            // Send to native app (if available)
            if (this.integrationMethods.nativeApp) {
                this.sendToNativeApp(smsItem, analysis);
            }
            
        } catch (error) {
            console.error('Notification failed:', error);
        }
    }

    sendToNativeApp(smsItem, analysis) {
        try {
            // Send data to native app via custom URL scheme
            const data = {
                type: 'SMS_ANALYSIS',
                sms: smsItem,
                analysis: analysis
            };
            
            const url = `sms-shield://analysis?data=${encodeURIComponent(JSON.stringify(data))}`;
            window.location.href = url;
            
        } catch (error) {
            console.error('Native app communication failed:', error);
        }
    }

    updateUI(smsItem, analysis) {
        try {
            // Update dashboard if available
            if (window.updateSMSAnalysis) {
                window.updateSMSAnalysis(smsItem, analysis);
            }
            
            // Trigger custom event
            const event = new CustomEvent('smsAnalysisComplete', {
                detail: { sms: smsItem, analysis: analysis }
            });
            window.dispatchEvent(event);
            
        } catch (error) {
            console.error('UI update failed:', error);
        }
    }

    storeAnalysis(smsItem, analysis) {
        try {
            const analyses = JSON.parse(localStorage.getItem('sms_analyses') || '[]');
            analyses.push({
                ...smsItem,
                analysis
            });
            
            // Keep only last 100 analyses
            if (analyses.length > 100) {
                analyses.splice(0, analyses.length - 100);
            }
            
            localStorage.setItem('sms_analyses', JSON.stringify(analyses));
            
        } catch (error) {
            console.error('Analysis storage failed:', error);
        }
    }

    // Get integration status
    getStatus() {
        return {
            monitoring: this.isMonitoring,
            methods: this.integrationMethods,
            queueLength: this.smsQueue.length,
            totalAnalyses: this.getAnalysisHistory().length
        };
    }

    // Get analysis history
    getAnalysisHistory() {
        try {
            return JSON.parse(localStorage.getItem('sms_analyses') || '[]');
        } catch (error) {
            return [];
        }
    }

    // Manual SMS analysis
    async analyzeSMSText(text) {
        try {
            const analysis = await this.analysisEngine.analyze(text);
            return analysis;
        } catch (error) {
            console.error('Manual analysis failed:', error);
            return null;
        }
    }
}

// SMS Analysis Engine
class SMSAnalysisEngine {
    constructor() {
        this.aiModels = {
            gemini: null,
            ruleBased: true
        };
        
        this.init();
    }

    async init() {
        // Initialize AI models
        if (window.geminiAI) {
            this.aiModels.gemini = window.geminiAI;
        }
    }

    async analyze(text) {
        try {
            // Use AI analysis if available
            if (this.aiModels.gemini) {
                return await this.aiModels.gemini.analyzeSMS(text);
            }
            
            // Fallback to rule-based analysis
            return this.ruleBasedAnalysis(text);
            
        } catch (error) {
            console.error('Analysis failed:', error);
            return this.ruleBasedAnalysis(text);
        }
    }

    ruleBasedAnalysis(text) {
        const phishingKeywords = [
            'urgent', 'account suspended', 'verify now', 'click here',
            'bank account', 'credit card', 'social security', 'tax refund',
            'lottery winner', 'inheritance', 'free money', 'limited time',
            'account locked', 'security alert', 'verify identity'
        ];
        
        let score = 0;
        const reasons = [];
        
        const lowerText = text.toLowerCase();
        
        // Check for phishing keywords
        phishingKeywords.forEach(keyword => {
            if (lowerText.includes(keyword)) {
                score += 20;
                reasons.push(`Contains suspicious keyword: "${keyword}"`);
            }
        });
        
        // Check for URLs
        const urlPattern = /https?:\/\/[^\s]+/g;
        if (urlPattern.test(text)) {
            score += 15;
            reasons.push('Contains suspicious URL');
        }
        
        // Check for urgency
        const urgencyWords = ['urgent', 'immediate', 'now', 'quick', 'fast'];
        urgencyWords.forEach(word => {
            if (lowerText.includes(word)) {
                score += 10;
                reasons.push('Contains urgency indicators');
            }
        });
        
        const isPhishing = score >= 30;
        const confidence = Math.min(score, 100);
        
        return {
            isPhishing,
            confidence,
            reason: reasons.join('; '),
            recommendations: isPhishing ? [
                'Do not click any links',
                'Do not provide personal information',
                'Contact the sender through official channels',
                'Report as spam if suspicious'
            ] : [
                'Message appears safe',
                'Continue with normal communication'
            ]
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.realTimeSMSIntegration = new RealTimeSMSIntegration();
    console.log('🚀 Real-Time SMS Integration loaded');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RealTimeSMSIntegration, SMSAnalysisEngine };
}
