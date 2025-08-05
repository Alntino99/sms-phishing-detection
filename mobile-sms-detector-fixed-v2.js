// ===== IMPROVED MOBILE SMS DETECTION SYSTEM V2 =====
// Enhanced version with better error handling and initialization

class MobileSMSDetector {
    constructor() {
        this.isMonitoring = false;
        this.periodicIntervals = [];
        this.isDeployed = this.checkDeploymentEnvironment();
        this.contacts = [];
        this.userLocation = null;
        this.isSupported = false;
        this.isInitialized = false;
        
        console.log('📱 Mobile SMS Detector V2 initialized');
        
        // Initialize with error handling
        this.init().catch(error => {
            console.error('❌ Mobile SMS Detector initialization failed:', error);
            this.showError('Initialization failed', error.message);
        });
    }

    checkDeploymentEnvironment() {
        try {
            const isVercel = window.location.hostname.includes('vercel.app') || 
                             window.location.hostname.includes('vercel.com');
            const isLocalhost = window.location.hostname === 'localhost' || 
                               window.location.hostname === '127.0.0.1';
            
            console.log('🌐 Deployment Environment:', {
                hostname: window.location.hostname,
                isVercel: isVercel,
                isLocalhost: isLocalhost,
                protocol: window.location.protocol
            });
            
            return isVercel;
        } catch (error) {
            console.error('Environment check failed:', error);
            return false;
        }
    }

    async init() {
        try {
            console.log('🚀 Initializing Mobile SMS Detector V2...');
            
            // Check for mobile device
            if (this.isMobileDevice()) {
                console.log('📱 Mobile device detected');
                await this.setupMobileIntegration();
            } else {
                console.log('💻 Desktop device detected - using enhanced fallback');
                this.setupDesktopFallback();
            }
            
            this.isInitialized = true;
            console.log('✅ Mobile SMS Detector initialization complete');
            
        } catch (error) {
            console.error('❌ Mobile SMS Detector initialization failed:', error);
            this.showError('Initialization Error', error.message);
            throw error;
        }
    }

    isMobileDevice() {
        try {
            const userAgent = navigator.userAgent.toLowerCase();
            const mobileKeywords = [
                'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone',
                'mobile', 'tablet', 'phone', 'opera mini', 'opera mobi'
            ];
            
            const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
            const hasTouch = navigator.maxTouchPoints && navigator.maxTouchPoints > 2;
            const isSmallScreen = window.innerWidth <= 768;
            
            const result = isMobileUA || hasTouch || isSmallScreen;
            
            console.log('Mobile detection:', {
                userAgent: userAgent,
                isMobileUA: isMobileUA,
                hasTouch: hasTouch,
                maxTouchPoints: navigator.maxTouchPoints,
                isSmallScreen: isSmallScreen,
                screenSize: `${window.innerWidth}x${window.innerHeight}`,
                result: result
            });
            
            return result;
        } catch (error) {
            console.error('Mobile device detection failed:', error);
            return false;
        }
    }

    async setupMobileIntegration() {
        try {
            console.log('📱 Setting up mobile integration...');
            
            // Setup mobile features
            await this.setupMobileFeatures();
            
            // Setup mobile UI
            this.setupMobileUI();
            
            // Setup mobile event listeners
            this.setupMobileEventListeners();
            
            // Request permissions
            await this.requestMobilePermissions();
            
            // Start monitoring
            this.isMonitoring = true;
            
            console.log('✅ Mobile integration setup complete');
            
        } catch (error) {
            console.error('❌ Mobile integration setup failed:', error);
            this.showError('Setup Error', 'Failed to setup mobile integration: ' + error.message);
            throw error;
        }
    }

    async setupMobileFeatures() {
        try {
            console.log('📱 Setting up mobile-specific features...');
            
            // Check for required APIs
            const requiredAPIs = ['Notification', 'navigator'];
            const missingAPIs = requiredAPIs.filter(api => !(api in window));
            
            if (missingAPIs.length > 0) {
                console.warn('⚠️ Missing APIs:', missingAPIs);
            }
            
            // Setup clipboard monitoring
            this.setupClipboardMonitoring();
            
            // Setup periodic checks
            this.setupPeriodicChecks();
            
            console.log('✅ Mobile features setup complete');
            
        } catch (error) {
            console.error('❌ Mobile features setup failed:', error);
            throw error;
        }
    }

    setupMobileEventListeners() {
        try {
            console.log('📱 Setting up mobile event listeners...');
            
            // Listen for visibility changes
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') {
                    console.log('📱 App became visible - checking for new SMS');
                    this.checkForNewSMS();
                }
            });
            
            // Listen for focus events
            window.addEventListener('focus', () => {
                console.log('📱 Window focused - checking clipboard');
                this.checkClipboardForSMS();
            });
            
            // Listen for paste events
            document.addEventListener('paste', (event) => {
                console.log('📱 Paste event detected');
                const pastedText = event.clipboardData?.getData('text');
                if (pastedText && this.isSMSContent(pastedText)) {
                    console.log('📱 SMS content detected in paste');
                    this.analyzeIncomingSMS({
                        body: pastedText,
                        timestamp: new Date().toISOString(),
                        source: 'clipboard'
                    });
                }
            });
            
            console.log('✅ Mobile event listeners setup complete');
            
        } catch (error) {
            console.error('❌ Mobile event listeners setup failed:', error);
        }
    }

    setupMobileUI() {
        try {
            console.log('📱 Setting up mobile UI...');
            
            // Create mobile-specific UI elements
            this.createEnhancedMobileInterface();
            
            // Setup mobile gestures
            this.setupMobileGestures();
            
            console.log('✅ Mobile UI setup complete');
            
        } catch (error) {
            console.error('❌ Mobile UI setup failed:', error);
        }
    }

    setupMobileGestures() {
        try {
            let startY = 0;
            let startX = 0;
            
            document.addEventListener('touchstart', (e) => {
                startY = e.touches[0].clientY;
                startX = e.touches[0].clientX;
            });
            
            document.addEventListener('touchend', (e) => {
                const endY = e.changedTouches[0].clientY;
                const endX = e.changedTouches[0].clientX;
                const deltaY = startY - endY;
                const deltaX = startX - endX;
                
                // Swipe up to refresh
                if (deltaY > 50 && Math.abs(deltaX) < 50) {
                    console.log('📱 Swipe up detected - refreshing SMS check');
                    this.checkForNewSMS();
                }
                
                // Swipe down to analyze clipboard
                if (deltaY < -50 && Math.abs(deltaX) < 50) {
                    console.log('📱 Swipe down detected - analyzing clipboard');
                    this.analyzeMobileSMS();
                }
            });
            
            console.log('✅ Mobile gestures setup complete');
            
        } catch (error) {
            console.error('❌ Mobile gestures setup failed:', error);
        }
    }

    async requestMobilePermissions() {
        try {
            console.log('📱 Requesting mobile permissions...');
            
            const permissions = [];
            
            // Request notification permission
            if ('Notification' in window) {
                const notificationPermission = await this.requestNotificationPermission();
                permissions.push(`Notifications: ${notificationPermission}`);
            }
            
            // Request contact permission
            if ('contacts' in navigator) {
                const contactPermission = await this.requestContactPermission();
                permissions.push(`Contacts: ${contactPermission}`);
            }
            
            // Request location permission
            if ('geolocation' in navigator) {
                const locationPermission = await this.requestLocationPermission();
                permissions.push(`Location: ${locationPermission}`);
            }
            
            console.log('📱 Permissions status:', permissions);
            this.updatePermissionStatus(permissions);
            
        } catch (error) {
            console.error('❌ Permission request failed:', error);
            this.showError('Permission Error', 'Failed to request permissions: ' + error.message);
        }
    }

    async requestNotificationPermission() {
        try {
            if (Notification.permission === 'default') {
                const permission = await Notification.requestPermission();
                console.log('📱 Notification permission:', permission);
                return permission;
            }
            return Notification.permission;
        } catch (error) {
            console.error('❌ Notification permission request failed:', error);
            return 'denied';
        }
    }

    async requestContactPermission() {
        try {
            if ('contacts' in navigator && 'ContactsManager' in window) {
                const contacts = await navigator.contacts.select(['name', 'tel'], { multiple: false });
                console.log('📱 Contact permission granted');
                return 'granted';
            }
            return 'not-supported';
        } catch (error) {
            console.error('❌ Contact permission request failed:', error);
            return 'denied';
        }
    }

    async requestLocationPermission() {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                });
            });
            
            this.userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            
            console.log('📱 Location permission granted');
            return 'granted';
        } catch (error) {
            console.error('❌ Location permission request failed:', error);
            return 'denied';
        }
    }

    setupDesktopFallback() {
        try {
            console.log('💻 Setting up desktop fallback...');
            
            // Create enhanced mobile interface for desktop testing
            this.createEnhancedMobileInterface();
            
            // Setup clipboard monitoring for desktop
            this.setupClipboardMonitoring();
            
            console.log('✅ Desktop fallback setup complete');
            
        } catch (error) {
            console.error('❌ Desktop fallback setup failed:', error);
        }
    }

    createEnhancedMobileInterface() {
        try {
            // Create mobile status indicator
            const statusIndicator = document.createElement('div');
            statusIndicator.id = 'mobile-status-indicator';
            statusIndicator.innerHTML = `
                <div style="
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 10px 15px;
                    border-radius: 10px;
                    font-size: 12px;
                    z-index: 1000;
                    backdrop-filter: blur(10px);
                ">
                    📱 Mobile SMS Detector Active
                </div>
            `;
            document.body.appendChild(statusIndicator);
            
            console.log('✅ Enhanced mobile interface created');
            
        } catch (error) {
            console.error('❌ Enhanced mobile interface creation failed:', error);
        }
    }

    updatePermissionStatus(permissions) {
        try {
            const statusIndicator = document.getElementById('mobile-status-indicator');
            if (statusIndicator) {
                const permissionText = permissions.join(', ');
                statusIndicator.innerHTML = `
                    <div style="
                        position: fixed;
                        top: 80px;
                        right: 20px;
                        background: rgba(0, 0, 0, 0.8);
                        color: white;
                        padding: 10px 15px;
                        border-radius: 10px;
                        font-size: 12px;
                        z-index: 1000;
                        backdrop-filter: blur(10px);
                        max-width: 200px;
                    ">
                        📱 SMS Detector Active<br>
                        <small>${permissionText}</small>
                    </div>
                `;
            }
        } catch (error) {
            console.error('❌ Permission status update failed:', error);
        }
    }

    async scanRecentSMS() {
        try {
            console.log('📱 Scanning for recent SMS...');
            
            // Simulate SMS scanning for demo purposes
            const mockSMS = [
                {
                    body: "URGENT: Your bank account has been suspended. Click here to verify: http://fake-bank.com",
                    timestamp: new Date().toISOString(),
                    source: 'mock'
                },
                {
                    body: "Your package is ready for pickup. Click here: http://fake-delivery.com",
                    timestamp: new Date().toISOString(),
                    source: 'mock'
                }
            ];
            
            for (const sms of mockSMS) {
                await this.analyzeIncomingSMS(sms);
            }
            
            console.log('✅ SMS scanning complete');
            
        } catch (error) {
            console.error('❌ SMS scanning failed:', error);
            this.showError('Scan Error', 'Failed to scan SMS: ' + error.message);
        }
    }

    async analyzeMobileSMS() {
        try {
            console.log('📱 Analyzing mobile SMS...');
            
            // Check clipboard for SMS content
            await this.checkClipboardForSMS();
            
            // Scan for recent SMS
            await this.scanRecentSMS();
            
            console.log('✅ Mobile SMS analysis complete');
            
        } catch (error) {
            console.error('❌ Mobile SMS analysis failed:', error);
            this.showError('Analysis Error', 'Failed to analyze SMS: ' + error.message);
        }
    }

    async enableRealTimeMode() {
        try {
            console.log('📱 Enabling real-time SMS monitoring...');
            
            if (this.isMonitoring) {
                console.log('📱 Real-time monitoring already active');
                return;
            }
            
            // Setup periodic checks
            this.setupPeriodicChecks();
            
            // Start monitoring
            this.isMonitoring = true;
            
            console.log('✅ Real-time SMS monitoring enabled');
            this.showNotification('Real-time Monitoring', 'SMS monitoring is now active');
            
        } catch (error) {
            console.error('❌ Real-time mode enable failed:', error);
            this.showError('Real-time Error', 'Failed to enable real-time mode: ' + error.message);
        }
    }

    setupPeriodicChecks() {
        try {
            console.log('📱 Setting up periodic SMS checks...');
            
            // Clear existing intervals
            this.periodicIntervals.forEach(interval => clearInterval(interval));
            this.periodicIntervals = [];
            
            // Check every 30 seconds
            const checkInterval = setInterval(() => {
                if (this.isMonitoring) {
                    this.checkForNewSMS();
                }
            }, 30000);
            
            this.periodicIntervals.push(checkInterval);
            
            console.log('✅ Periodic checks setup complete');
            
        } catch (error) {
            console.error('❌ Periodic checks setup failed:', error);
        }
    }

    async checkForNewSMS() {
        try {
            console.log('📱 Checking for new SMS...');
            
            // Check clipboard for new SMS content
            await this.checkClipboardForSMS();
            
            // Detect SMS through events
            this.detectSMSThroughEvents();
            
        } catch (error) {
            console.error('❌ New SMS check failed:', error);
        }
    }

    detectSMSThroughEvents() {
        try {
            // Listen for potential SMS-related events
            document.addEventListener('copy', () => {
                console.log('📱 Copy event detected - potential SMS content');
            });
            
            document.addEventListener('cut', () => {
                console.log('📱 Cut event detected - potential SMS content');
            });
            
        } catch (error) {
            console.error('❌ SMS event detection failed:', error);
        }
    }

    async checkClipboardForSMS() {
        try {
            if (!navigator.clipboard) {
                console.log('📱 Clipboard API not available');
                return;
            }
            
            const clipboardText = await navigator.clipboard.readText();
            
            if (clipboardText && this.isSMSContent(clipboardText)) {
                console.log('📱 SMS content detected in clipboard');
                
                const sms = {
                    body: clipboardText,
                    timestamp: new Date().toISOString(),
                    source: 'clipboard'
                };
                
                await this.analyzeIncomingSMS(sms);
            }
            
        } catch (error) {
            console.error('❌ Clipboard check failed:', error);
        }
    }

    isSMSContent(text) {
        try {
            if (!text || typeof text !== 'string') {
                return false;
            }
            
            const smsKeywords = [
                'urgent', 'suspended', 'verify', 'click here', 'account',
                'security', 'fraud', 'scam', 'bank', 'password',
                'http://', 'https://', 'www.', '.com', '.org'
            ];
            
            const lowerText = text.toLowerCase();
            const keywordMatches = smsKeywords.filter(keyword => 
                lowerText.includes(keyword.toLowerCase())
            );
            
            const hasLinks = /https?:\/\/[^\s]+/.test(text);
            const hasPhoneNumbers = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text);
            
            const isSMS = keywordMatches.length > 0 || hasLinks || hasPhoneNumbers;
            
            console.log('📱 SMS content analysis:', {
                text: text.substring(0, 100) + '...',
                keywordMatches,
                hasLinks,
                hasPhoneNumbers,
                isSMS
            });
            
            return isSMS;
            
        } catch (error) {
            console.error('❌ SMS content analysis failed:', error);
            return false;
        }
    }

    setupClipboardMonitoring() {
        try {
            console.log('📱 Setting up clipboard monitoring...');
            
            // Monitor clipboard changes
            document.addEventListener('paste', (event) => {
                const pastedText = event.clipboardData?.getData('text');
                if (pastedText && this.isSMSContent(pastedText)) {
                    console.log('📱 SMS content pasted');
                    this.analyzeIncomingSMS({
                        body: pastedText,
                        timestamp: new Date().toISOString(),
                        source: 'paste'
                    });
                }
            });
            
            console.log('✅ Clipboard monitoring setup complete');
            
        } catch (error) {
            console.error('❌ Clipboard monitoring setup failed:', error);
        }
    }

    async installAsPWA() {
        try {
            console.log('📱 Installing as PWA...');
            
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                const registration = await navigator.serviceWorker.register('/sw-fixed.js');
                console.log('✅ Service Worker registered for PWA');
                
                // Request notification permission for PWA
                if (Notification.permission === 'default') {
                    const permission = await Notification.requestPermission();
                    console.log('📱 PWA notification permission:', permission);
                }
                
                this.showNotification('PWA Installation', 'App can now be installed as PWA');
                return true;
            } else {
                console.log('⚠️ PWA features not supported');
                return false;
            }
            
        } catch (error) {
            console.error('❌ PWA installation failed:', error);
            this.showError('PWA Error', 'Failed to install as PWA: ' + error.message);
            return false;
        }
    }

    async checkContacts() {
        try {
            console.log('📱 Checking contacts...');
            
            if ('contacts' in navigator && 'ContactsManager' in window) {
                const contacts = await navigator.contacts.select(['name', 'tel'], { multiple: true });
                this.contacts = contacts;
                console.log('📱 Contacts loaded:', contacts.length);
                return contacts;
            } else {
                console.log('📱 Contacts API not available');
                return [];
            }
            
        } catch (error) {
            console.error('❌ Contacts check failed:', error);
            return [];
        }
    }

    showMobileNotification(title, message) {
        try {
            console.log(`📱 Mobile Notification: ${title} - ${message}`);
            
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(title, {
                    body: message,
                    icon: '/logo.png',
                    badge: '/logo.png',
                    tag: 'sms-detector'
                });
            } else {
                this.showAlert(title, message);
            }
            
        } catch (error) {
            console.error('❌ Mobile notification failed:', error);
            this.showAlert(title, message);
        }
    }

    async analyzeIncomingSMS(sms) {
        try {
            console.log('📱 Analyzing incoming SMS:', sms);
            
            // Perform basic analysis
            const analysis = {
                timestamp: new Date().toISOString(),
                sms: sms,
                riskLevel: 'medium',
                confidence: 75,
                threats: [],
                recommendations: []
            };
            
            // Check for phishing indicators
            const phishingIndicators = [
                { pattern: /urgent/i, weight: 0.8 },
                { pattern: /suspended/i, weight: 0.9 },
                { pattern: /verify/i, weight: 0.7 },
                { pattern: /click here/i, weight: 0.6 },
                { pattern: /http:\/\/|https:\/\//i, weight: 0.5 },
                { pattern: /bank/i, weight: 0.8 },
                { pattern: /password/i, weight: 0.7 }
            ];
            
            let totalScore = 0;
            const detectedThreats = [];
            
            phishingIndicators.forEach(indicator => {
                if (indicator.pattern.test(sms.body)) {
                    totalScore += indicator.weight;
                    detectedThreats.push(indicator.pattern.source);
                }
            });
            
            // Calculate risk level
            if (totalScore > 2.0) {
                analysis.riskLevel = 'high';
                analysis.confidence = 90;
            } else if (totalScore > 1.0) {
                analysis.riskLevel = 'medium';
                analysis.confidence = 75;
            } else {
                analysis.riskLevel = 'low';
                analysis.confidence = 60;
            }
            
            analysis.threats = detectedThreats;
            analysis.totalScore = totalScore;
            
            // Add recommendations
            if (analysis.riskLevel === 'high') {
                analysis.recommendations.push('Do not click any links');
                analysis.recommendations.push('Do not provide personal information');
                analysis.recommendations.push('Report to authorities if necessary');
            }
            
            console.log('📱 SMS Analysis Result:', analysis);
            
            // Handle the analysis result
            this.handleAnalysisResult(sms, analysis);
            
            return analysis;
            
        } catch (error) {
            console.error('❌ SMS analysis failed:', error);
            this.showError('Analysis Error', 'Failed to analyze SMS: ' + error.message);
            return null;
        }
    }

    handleAnalysisResult(sms, analysis) {
        try {
            console.log('📱 Handling analysis result:', analysis);
            
            // Log the analysis
            this.logAnalysis(sms, analysis);
            
            // Show notification for high-risk SMS
            if (analysis.riskLevel === 'high') {
                this.showNotification(
                    '🚨 High-Risk SMS Detected',
                    `Phishing threat detected with ${analysis.confidence}% confidence`
                );
            } else if (analysis.riskLevel === 'medium') {
                this.showNotification(
                    '⚠️ Medium-Risk SMS Detected',
                    `Potential threat detected with ${analysis.confidence}% confidence`
                );
            }
            
            // Update mobile interface
            this.updateMobileInterface();
            
        } catch (error) {
            console.error('❌ Analysis result handling failed:', error);
        }
    }

    showAlert(title, message) {
        try {
            const alertDiv = document.createElement('div');
            alertDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 20px;
                border-radius: 10px;
                z-index: 10000;
                max-width: 300px;
                text-align: center;
                backdrop-filter: blur(10px);
            `;
            
            alertDiv.innerHTML = `
                <h3 style="margin: 0 0 10px 0; color: #667eea;">${title}</h3>
                <p style="margin: 0 0 15px 0;">${message}</p>
                <button onclick="this.parentElement.remove()" style="
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 5px;
                    cursor: pointer;
                ">OK</button>
            `;
            
            document.body.appendChild(alertDiv);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (alertDiv.parentElement) {
                    alertDiv.remove();
                }
            }, 5000);
            
        } catch (error) {
            console.error('❌ Alert display failed:', error);
        }
    }

    showNotification(title, message) {
        try {
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(title, {
                    body: message,
                    icon: '/logo.png',
                    badge: '/logo.png',
                    tag: 'sms-detector',
                    requireInteraction: true
                });
            } else {
                this.showAlert(title, message);
            }
        } catch (error) {
            console.error('❌ Notification failed:', error);
            this.showAlert(title, message);
        }
    }

    showError(title, message) {
        console.error(`❌ ${title}: ${message}`);
        this.showAlert(title, message);
    }

    logAnalysis(sms, analysis) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                sms: sms,
                analysis: analysis
            };
            
            // Store in localStorage
            const existingLogs = JSON.parse(localStorage.getItem('sms_analysis_logs') || '[]');
            existingLogs.push(logEntry);
            localStorage.setItem('sms_analysis_logs', JSON.stringify(existingLogs));
            
            console.log('📱 Analysis logged:', logEntry);
            
        } catch (error) {
            console.error('❌ Analysis logging failed:', error);
        }
    }

    updateMobileInterface() {
        try {
            const statusIndicator = document.getElementById('mobile-status-indicator');
            if (statusIndicator) {
                statusIndicator.innerHTML = `
                    <div style="
                        position: fixed;
                        top: 80px;
                        right: 20px;
                        background: rgba(0, 0, 0, 0.8);
                        color: white;
                        padding: 10px 15px;
                        border-radius: 10px;
                        font-size: 12px;
                        z-index: 1000;
                        backdrop-filter: blur(10px);
                    ">
                        📱 SMS Detector Active<br>
                        <small>Monitoring for threats...</small>
                    </div>
                `;
            }
        } catch (error) {
            console.error('❌ Mobile interface update failed:', error);
        }
    }

    destroy() {
        try {
            console.log('📱 Destroying Mobile SMS Detector...');
            
            // Clear intervals
            this.periodicIntervals.forEach(interval => clearInterval(interval));
            this.periodicIntervals = [];
            
            // Remove status indicator
            const statusIndicator = document.getElementById('mobile-status-indicator');
            if (statusIndicator) {
                statusIndicator.remove();
            }
            
            this.isMonitoring = false;
            this.isInitialized = false;
            
            console.log('✅ Mobile SMS Detector destroyed');
            
        } catch (error) {
            console.error('❌ Mobile SMS Detector destruction failed:', error);
        }
    }
}

// Initialize the detector when the script loads
let mobileSMSDetector = null;

try {
    mobileSMSDetector = new MobileSMSDetector();
    window.mobileSMSDetector = mobileSMSDetector;
    console.log('✅ Mobile SMS Detector V2 loaded successfully');
} catch (error) {
    console.error('❌ Mobile SMS Detector V2 loading failed:', error);
}

// Export for global access
window.MobileSMSDetector = MobileSMSDetector; 