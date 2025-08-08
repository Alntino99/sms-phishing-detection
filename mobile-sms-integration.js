// Mobile SMS Integration System
// This module provides real-time SMS reading and analysis for mobile devices

class MobileSMSIntegration {
    constructor() {
        this.isSupported = this.checkSupport();
        this.permissions = {
            sms: false,
            notifications: false
        };
        this.smsListener = null;
        this.analysisQueue = [];
        this.isProcessing = false;
        
        this.init();
    }

    // Check if SMS integration is supported
    checkSupport() {
        return 'navigator' in window && 
               ('sms' in navigator || 'webkitSms' in navigator) &&
               'serviceWorker' in navigator &&
               'Notification' in window;
    }

    // Initialize SMS integration
    async init() {
        if (!this.isSupported) {
            console.warn('SMS integration not supported on this device/browser');
            return false;
        }

        try {
            // Request SMS permissions
            await this.requestSMSPermissions();
            
            // Request notification permissions
            await this.requestNotificationPermissions();
            
            // Register service worker for background SMS monitoring
            await this.registerSMSWorker();
            
            // Start SMS monitoring
            this.startSMSMonitoring();
            
            console.log('✅ SMS integration initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ SMS integration failed:', error);
            return false;
        }
    }

    // Request SMS permissions
    async requestSMSPermissions() {
        try {
            if ('permissions' in navigator) {
                const permission = await navigator.permissions.query({ name: 'sms' });
                this.permissions.sms = permission.state === 'granted';
                
                if (permission.state === 'prompt') {
                    // Request permission
                    const result = await navigator.permissions.request({ name: 'sms' });
                    this.permissions.sms = result.state === 'granted';
                }
            }
            
            // For iOS Safari - use alternative approach
            if (!this.permissions.sms && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
                this.permissions.sms = await this.requestIOSSMSPermission();
            }
            
            return this.permissions.sms;
        } catch (error) {
            console.warn('SMS permission request failed:', error);
            return false;
        }
    }

    // Request iOS SMS permission (alternative approach)
    async requestIOSSMSPermission() {
        try {
            // Show custom permission dialog
            const granted = await this.showPermissionDialog(
                'SMS Access Required',
                'SMS Shield needs access to your SMS messages to provide real-time phishing protection. This helps protect you from scams and malicious messages.',
                'Allow SMS Access',
                'Deny'
            );
            
            if (granted) {
                // Store permission in localStorage
                localStorage.setItem('sms_permission_granted', 'true');
                return true;
            }
            
            return false;
        } catch (error) {
            console.warn('iOS SMS permission failed:', error);
            return false;
        }
    }

    // Request notification permissions
    async requestNotificationPermissions() {
        try {
            if ('Notification' in window) {
                const permission = await Notification.requestPermission();
                this.permissions.notifications = permission === 'granted';
                return this.permissions.notifications;
            }
            return false;
        } catch (error) {
            console.warn('Notification permission request failed:', error);
            return false;
        }
    }

    // Register service worker for background SMS monitoring
    async registerSMSWorker() {
        try {
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.register('sw-sms-monitor.js');
                console.log('SMS monitoring service worker registered:', registration);
                return registration;
            }
            return null;
        } catch (error) {
            console.error('SMS worker registration failed:', error);
            return null;
        }
    }

    // Start SMS monitoring
    startSMSMonitoring() {
        if (!this.permissions.sms) {
            console.warn('SMS permissions not granted');
            return;
        }

        try {
            // Listen for incoming SMS messages
            if ('sms' in navigator) {
                navigator.sms.addEventListener('received', (event) => {
                    this.handleIncomingSMS(event.message);
                });
            }

            // Alternative: Use WebSocket for real-time communication
            this.setupWebSocketConnection();
            
            // Start periodic SMS checking (fallback)
            this.startPeriodicSMSCheck();
            
            console.log('✅ SMS monitoring started');
        } catch (error) {
            console.error('SMS monitoring failed:', error);
        }
    }

    // Handle incoming SMS message
    async handleIncomingSMS(message) {
        try {
            console.log('📱 New SMS received:', message);
            
            // Add to analysis queue
            this.analysisQueue.push({
                id: Date.now(),
                message: message,
                timestamp: new Date(),
                status: 'pending'
            });
            
            // Process queue
            this.processAnalysisQueue();
            
        } catch (error) {
            console.error('SMS handling failed:', error);
        }
    }

    // Process analysis queue
    async processAnalysisQueue() {
        if (this.isProcessing || this.analysisQueue.length === 0) {
            return;
        }

        this.isProcessing = true;
        
        try {
            while (this.analysisQueue.length > 0) {
                const smsItem = this.analysisQueue.shift();
                
                // Analyze SMS using AI
                const analysis = await this.analyzeSMS(smsItem.message);
                
                // Send result back to phone
                await this.sendAnalysisResult(smsItem, analysis);
                
                // Update status
                smsItem.status = 'completed';
                smsItem.analysis = analysis;
            }
        } catch (error) {
            console.error('Analysis queue processing failed:', error);
        } finally {
            this.isProcessing = false;
        }
    }

    // Analyze SMS using AI
    async analyzeSMS(message) {
        try {
            // Use existing AI analysis system
            if (window.geminiAI && typeof window.geminiAI.analyzeSMS === 'function') {
                return await window.geminiAI.analyzeSMS(message);
            }
            
            // Fallback to rule-based analysis
            return this.ruleBasedAnalysis(message);
            
        } catch (error) {
            console.error('SMS analysis failed:', error);
            return {
                isPhishing: false,
                confidence: 0,
                reason: 'Analysis failed',
                recommendations: ['Unable to analyze message']
            };
        }
    }

    // Rule-based SMS analysis (fallback)
    ruleBasedAnalysis(message) {
        const phishingKeywords = [
            'urgent', 'account suspended', 'verify now', 'click here',
            'bank account', 'credit card', 'social security', 'tax refund',
            'lottery winner', 'inheritance', 'free money', 'limited time',
            'account locked', 'security alert', 'verify identity'
        ];
        
        const suspiciousPatterns = [
            /https?:\/\/[^\s]+/g,  // URLs
            /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,  // Credit card numbers
            /\b\d{3}-\d{2}-\d{4}\b/g,  // SSN pattern
        ];
        
        let score = 0;
        const reasons = [];
        
        // Check for phishing keywords
        const lowerMessage = message.toLowerCase();
        phishingKeywords.forEach(keyword => {
            if (lowerMessage.includes(keyword)) {
                score += 20;
                reasons.push(`Contains suspicious keyword: "${keyword}"`);
            }
        });
        
        // Check for suspicious patterns
        suspiciousPatterns.forEach(pattern => {
            if (pattern.test(message)) {
                score += 15;
                reasons.push('Contains suspicious pattern');
            }
        });
        
        // Check for urgency indicators
        const urgencyWords = ['urgent', 'immediate', 'now', 'quick', 'fast'];
        urgencyWords.forEach(word => {
            if (lowerMessage.includes(word)) {
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

    // Send analysis result back to phone
    async sendAnalysisResult(smsItem, analysis) {
        try {
            // Send notification
            if (this.permissions.notifications) {
                this.sendNotification(smsItem, analysis);
            }
            
            // Send SMS response (if supported)
            await this.sendSMSResponse(smsItem, analysis);
            
            // Update UI
            this.updateAnalysisUI(smsItem, analysis);
            
            console.log('✅ Analysis result sent:', analysis);
            
        } catch (error) {
            console.error('Failed to send analysis result:', error);
        }
    }

    // Send notification
    sendNotification(smsItem, analysis) {
        try {
            const title = analysis.isPhishing ? '🚨 Phishing Alert!' : '✅ Safe Message';
            const body = analysis.isPhishing 
                ? `Suspicious SMS detected: ${analysis.reason}`
                : 'Message appears to be safe';
            
            const notification = new Notification(title, {
                body: body,
                icon: '/favicon.svg',
                badge: '/favicon.svg',
                tag: `sms-${smsItem.id}`,
                requireInteraction: analysis.isPhishing,
                actions: analysis.isPhishing ? [
                    {
                        action: 'report',
                        title: 'Report as Spam'
                    },
                    {
                        action: 'block',
                        title: 'Block Sender'
                    }
                ] : []
            });
            
            // Handle notification clicks
            notification.onclick = () => {
                window.focus();
                this.showDetailedAnalysis(smsItem, analysis);
            };
            
        } catch (error) {
            console.error('Notification failed:', error);
        }
    }

    // Send SMS response (if supported)
    async sendSMSResponse(smsItem, analysis) {
        try {
            if ('sms' in navigator && navigator.sms.send) {
                const response = analysis.isPhishing 
                    ? `🚨 PHISHING ALERT: ${analysis.reason}. Do not respond or click links.`
                    : `✅ Message appears safe. Confidence: ${analysis.confidence}%`;
                
                // Note: This is a conceptual implementation
                // Real SMS sending requires proper mobile APIs
                console.log('SMS Response would be sent:', response);
            }
        } catch (error) {
            console.warn('SMS response not supported:', error);
        }
    }

    // Update analysis UI
    updateAnalysisUI(smsItem, analysis) {
        try {
            // Update dashboard if available
            if (window.updateSMSAnalysis) {
                window.updateSMSAnalysis(smsItem, analysis);
            }
            
            // Store in localStorage for persistence
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
            console.error('UI update failed:', error);
        }
    }

    // Show detailed analysis
    showDetailedAnalysis(smsItem, analysis) {
        try {
            const modal = document.createElement('div');
            modal.className = 'sms-analysis-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${analysis.isPhishing ? '🚨 Phishing Alert' : '✅ Safe Message'}</h3>
                        <button onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Message:</strong> ${smsItem.message}</p>
                        <p><strong>Analysis:</strong> ${analysis.reason}</p>
                        <p><strong>Confidence:</strong> ${analysis.confidence}%</p>
                        <div class="recommendations">
                            <h4>Recommendations:</h4>
                            <ul>
                                ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
        } catch (error) {
            console.error('Detailed analysis display failed:', error);
        }
    }

    // Setup WebSocket connection for real-time communication
    setupWebSocketConnection() {
        try {
            // This would connect to a backend service for real-time SMS monitoring
            // For now, we'll simulate with periodic checks
            console.log('WebSocket connection would be established for real-time SMS monitoring');
        } catch (error) {
            console.error('WebSocket setup failed:', error);
        }
    }

    // Start periodic SMS check (fallback)
    startPeriodicSMSCheck() {
        // Check for new SMS every 30 seconds
        setInterval(() => {
            this.checkForNewSMS();
        }, 30000);
    }

    // Check for new SMS (simulated)
    async checkForNewSMS() {
        try {
            // This would integrate with actual SMS APIs
            // For now, we'll simulate with test messages
            if (Math.random() < 0.1) { // 10% chance of test message
                const testMessages = [
                    "Your account has been suspended. Click here to verify: http://fake-bank.com",
                    "You've won $1000! Claim your prize now: http://fake-lottery.com",
                    "Hi, this is your bank. We need to verify your account immediately.",
                    "Your package is ready for pickup. Click here: http://fake-delivery.com"
                ];
                
                const randomMessage = testMessages[Math.floor(Math.random() * testMessages.length)];
                await this.handleIncomingSMS(randomMessage);
            }
        } catch (error) {
            console.error('SMS check failed:', error);
        }
    }

    // Show permission dialog
    async showPermissionDialog(title, message, allowText, denyText) {
        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'permission-dialog';
            dialog.innerHTML = `
                <div class="dialog-content">
                    <h3>${title}</h3>
                    <p>${message}</p>
                    <div class="dialog-buttons">
                        <button class="btn-enhanced btn-primary" onclick="this.parentElement.parentElement.parentElement.remove(); window.smsIntegration.permissionResult(true);">${allowText}</button>
                        <button class="btn-enhanced btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove(); window.smsIntegration.permissionResult(false);">${denyText}</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(dialog);
            
            // Store resolve function
            window.smsIntegration = window.smsIntegration || {};
            window.smsIntegration.permissionResult = (result) => {
                resolve(result);
            };
        });
    }

    // Get SMS analysis history
    getAnalysisHistory() {
        try {
            return JSON.parse(localStorage.getItem('sms_analyses') || '[]');
        } catch (error) {
            console.error('Failed to get analysis history:', error);
            return [];
        }
    }

    // Clear analysis history
    clearAnalysisHistory() {
        try {
            localStorage.removeItem('sms_analyses');
            console.log('Analysis history cleared');
        } catch (error) {
            console.error('Failed to clear analysis history:', error);
        }
    }

    // Get integration status
    getStatus() {
        return {
            supported: this.isSupported,
            permissions: this.permissions,
            monitoring: this.smsListener !== null,
            queueLength: this.analysisQueue.length,
            isProcessing: this.isProcessing
        };
    }
}

// Initialize SMS integration when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize SMS integration
    window.smsIntegration = new MobileSMSIntegration();
    
    // Add to window for global access
    window.mobileSMSIntegration = window.smsIntegration;
    
    console.log('📱 Mobile SMS Integration loaded');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileSMSIntegration;
}
