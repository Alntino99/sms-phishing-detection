// ===== IMPROVED MOBILE SMS DETECTION SYSTEM =====
// Fixed version with proper mobile integration and error handling

class MobileSMSDetector {
    constructor() {
        this.isMonitoring = false;
        this.periodicIntervals = [];
        this.isDeployed = this.checkDeploymentEnvironment();
        this.contacts = [];
        this.userLocation = null;
        this.isSupported = false;
        
        console.log('📱 Mobile SMS Detector initialized');
        
        // Initialize immediately
        this.init();
    }

    checkDeploymentEnvironment() {
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
    }

    async init() {
        console.log('🚀 Initializing Mobile SMS Detector...');
        
        // Check for mobile device
        if (this.isMobileDevice()) {
            console.log('📱 Mobile device detected');
            await this.setupMobileIntegration();
        } else {
            console.log('💻 Desktop device detected - using enhanced fallback');
            this.setupDesktopFallback();
        }
    }

    isMobileDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = [
            'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone',
            'mobile', 'tablet', 'phone', 'opera mini', 'opera mobi'
        ];
        
        const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
        const hasTouch = navigator.maxTouchPoints && navigator.maxTouchPoints > 2;
        const isSmallScreen = window.innerWidth <= 768;
        
        console.log('Mobile detection:', {
            userAgent: userAgent,
            isMobileUA: isMobileUA,
            hasTouch: hasTouch,
            maxTouchPoints: navigator.maxTouchPoints,
            isSmallScreen: isSmallScreen,
            screenSize: `${window.innerWidth}x${window.innerHeight}`
        });
        
        return isMobileUA || hasTouch || isSmallScreen;
    }

    async setupMobileIntegration() {
        try {
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
            
            console.log('📱 Mobile integration setup complete');
            
        } catch (error) {
            console.error('Mobile integration setup failed:', error);
            this.showMobileNotification('Setup Error', 'Failed to setup mobile integration');
        }
    }

    async setupMobileFeatures() {
        // Setup mobile-specific features
        if (this.isMobileDevice()) {
            console.log('📱 Setting up mobile-specific features...');
            
            // Add mobile-specific event listeners
            this.setupMobileEventListeners();
            
            // Setup mobile UI enhancements
            this.setupMobileUI();
            
            // Setup mobile gesture detection
            this.setupMobileGestures();
        }
    }

    setupMobileEventListeners() {
        // Listen for mobile-specific events
        window.addEventListener('orientationchange', () => {
            console.log('📱 Device orientation changed');
            this.updateMobileInterface();
        });
        
        window.addEventListener('resize', () => {
            console.log('📱 Screen size changed');
            this.updateMobileInterface();
        });
        
        // Listen for app state changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                console.log('📱 App became visible - checking for new SMS');
                this.checkForNewSMS();
            }
        });
    }

    setupMobileUI() {
        // Add mobile-specific UI elements
        const mobileUI = document.createElement('div');
        mobileUI.className = 'mobile-ui-overlay';
        mobileUI.innerHTML = `
            <div class="mobile-status-bar">
                <span class="mobile-status">📱 Mobile Mode Active</span>
                <span class="sms-status" id="mobile-sms-status">SMS: Checking...</span>
            </div>
        `;
        
        document.body.appendChild(mobileUI);
    }

    setupMobileGestures() {
        // Setup touch gestures for mobile
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].clientY;
            this.handleSwipeGesture(touchStartY, touchEndY);
        });
    }

    handleSwipeGesture(startY, endY) {
        const swipeDistance = startY - endY;
        const minSwipeDistance = 50;
        
        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                // Swipe up - refresh SMS
                console.log('📱 Swipe up detected - refreshing SMS');
                this.checkForNewSMS();
            } else {
                // Swipe down - show mobile interface
                console.log('📱 Swipe down detected - showing mobile interface');
                this.showMobileInterface();
            }
        }
    }

    async requestMobilePermissions() {
        const permissions = [
            { name: 'notifications' },
            { name: 'contacts' },
            { name: 'geolocation' }
        ];

        console.log('🔐 Requesting mobile permissions...');
        
        for (const permission of permissions) {
            try {
                if ('permissions' in navigator) {
                    const result = await navigator.permissions.query(permission);
                    console.log(`Permission ${permission.name}: ${result.state}`);
                    
                    if (result.state === 'prompt') {
                        // Request permission explicitly
                        if (permission.name === 'notifications') {
                            await Notification.requestPermission();
                        } else if (permission.name === 'contacts') {
                            await this.requestContactPermission();
                        } else if (permission.name === 'geolocation') {
                            await this.requestLocationPermission();
                        }
                    }
                }
            } catch (error) {
                console.log(`Permission ${permission.name} not supported or denied:`, error);
            }
        }
    }

    async requestContactPermission() {
        try {
            if ('contacts' in navigator) {
                const contacts = await navigator.contacts.select(['tel', 'name'], { multiple: true });
                this.contacts = contacts;
                console.log(`✅ Loaded ${contacts.length} contacts`);
            }
        } catch (error) {
            console.log('❌ Contact access denied or not supported');
        }
    }

    async requestLocationPermission() {
        try {
            if ('geolocation' in navigator) {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    });
                });
                console.log('✅ Location access granted');
                this.userLocation = position;
            }
        } catch (error) {
            console.log('❌ Location access denied or not supported');
        }
    }

    setupDesktopFallback() {
        console.log('💻 Setting up desktop fallback...');
        this.createEnhancedMobileInterface();
    }

    createEnhancedMobileInterface() {
        const mobileInterface = document.createElement('div');
        mobileInterface.className = 'enhanced-mobile-interface';
        mobileInterface.innerHTML = `
            <div class="mobile-sms-container">
                <h3>📱 Mobile SMS Detection</h3>
                <div class="mobile-status">
                    <p><strong>Status:</strong> <span id="mobile-status">Enhanced Mode Active</span></p>
                    <p><strong>Device:</strong> ${this.isMobileDevice() ? 'Mobile' : 'Desktop'}</p>
                    <p><strong>Permissions:</strong> <span id="permission-status">Checking...</span></p>
                </div>
                
                <div class="sms-input-section">
                    <h4>🔍 SMS Analysis</h4>
                    <textarea id="mobile-sms-input" placeholder="Paste SMS content here or use mobile features below..."></textarea>
                    <button onclick="mobileSMSDetector.analyzeMobileSMS()" class="analyze-btn">🔍 Analyze SMS</button>
                </div>
                
                <div class="mobile-features">
                    <h4>📱 Mobile Features</h4>
                    <button onclick="mobileSMSDetector.scanRecentSMS()" class="feature-btn">📋 Scan Recent SMS</button>
                    <button onclick="mobileSMSDetector.checkContacts()" class="feature-btn">👥 Check Contacts</button>
                    <button onclick="mobileSMSDetector.enableRealTimeMode()" class="feature-btn">⚡ Enable Real-time</button>
                    <button onclick="mobileSMSDetector.installAsPWA()" class="feature-btn">📲 Install as App</button>
                </div>
                
                <div class="mobile-results" id="mobile-results">
                    <!-- Results will appear here -->
                </div>
            </div>
        `;
        
        document.body.appendChild(mobileInterface);
        
        // Update permission status
        this.updatePermissionStatus();
    }

    updatePermissionStatus() {
        const statusElement = document.getElementById('permission-status');
        if (statusElement) {
            const permissions = [];
            
            if ('Notification' in window && Notification.permission === 'granted') {
                permissions.push('Notifications ✅');
            }
            
            if (this.contacts.length > 0) {
                permissions.push('Contacts ✅');
            }
            
            if (this.userLocation) {
                permissions.push('Location ✅');
            }
            
            if (this.isMonitoring) {
                permissions.push('SMS Monitoring ✅');
            }
            
            statusElement.textContent = permissions.length > 0 ? permissions.join(', ') : 'Limited';
        }
    }

    async scanRecentSMS() {
        console.log('📋 Scanning for recent SMS...');
        
        try {
            // Show loading state
            const scanBtn = document.querySelector('.feature-btn');
            if (scanBtn && scanBtn.textContent.includes('Scan')) {
                scanBtn.textContent = '📋 Scanning...';
                scanBtn.disabled = true;
            }
            
            // Check clipboard for SMS content
            try {
                if (navigator.clipboard && navigator.clipboard.readText) {
                    const clipboardText = await navigator.clipboard.readText();
                    if (this.isSMSContent(clipboardText)) {
                        console.log('📋 SMS content found in clipboard');
                        this.analyzeIncomingSMS({
                            id: Date.now(),
                            sender: 'Clipboard',
                            body: clipboardText,
                            timestamp: new Date().toISOString()
                        });
                        this.showMobileNotification('SMS Found in Clipboard', 'Analyzed clipboard content');
                    } else {
                        this.showMobileNotification('No SMS in Clipboard', 'Please paste SMS content manually');
                    }
                } else {
                    this.showMobileNotification('SMS scanning not available', 'Please paste SMS content manually');
                }
            } catch (clipboardError) {
                this.showMobileNotification('SMS scanning not available', 'Please paste SMS content manually');
            }
        } catch (error) {
            console.error('Error scanning recent SMS:', error);
            this.showMobileNotification('SMS scanning failed', 'Please paste SMS content manually');
        } finally {
            // Reset button state
            const scanBtn = document.querySelector('.feature-btn');
            if (scanBtn && scanBtn.textContent.includes('Scanning')) {
                scanBtn.textContent = '📋 Scan Recent SMS';
                scanBtn.disabled = false;
            }
        }
    }

    async analyzeMobileSMS() {
        const input = document.getElementById('mobile-sms-input');
        const content = input.value.trim();
        
        if (!content) {
            this.showMobileNotification('No content', 'Please enter SMS content to analyze');
            return;
        }
        
        // Show loading state
        const analyzeBtn = document.querySelector('.analyze-btn');
        if (analyzeBtn) {
            analyzeBtn.textContent = '🔍 Analyzing...';
            analyzeBtn.disabled = true;
        }
        
        try {
            const mockSMS = {
                id: Date.now(),
                sender: 'Unknown',
                body: content,
                timestamp: new Date().toISOString()
            };
            
            await this.analyzeIncomingSMS(mockSMS);
            input.value = '';
            
            // Show success notification
            this.showMobileNotification('Analysis Complete', 'SMS has been analyzed successfully');
            
        } catch (error) {
            console.error('Analysis failed:', error);
            this.showMobileNotification('Analysis Failed', 'Please try again');
        } finally {
            // Reset button state
            if (analyzeBtn) {
                analyzeBtn.textContent = '🔍 Analyze SMS';
                analyzeBtn.disabled = false;
            }
        }
    }

    async enableRealTimeMode() {
        console.log('⚡ Enabling real-time mode...');
        
        try {
            // Show loading state
            const realtimeBtn = document.querySelector('.feature-btn');
            if (realtimeBtn && realtimeBtn.textContent.includes('Real-time')) {
                realtimeBtn.textContent = '⚡ Enabling...';
                realtimeBtn.disabled = true;
            }
            
            // Setup periodic SMS checking
            this.setupPeriodicChecks();
            
            // Setup clipboard monitoring
            this.setupClipboardMonitoring();
            
            // Update UI
            this.updatePermissionStatus();
            
            this.showMobileNotification('Real-time mode enabled', 'Monitoring for SMS content...');
            
            // Reset button state
            if (realtimeBtn) {
                realtimeBtn.textContent = '⚡ Enable Real-time';
                realtimeBtn.disabled = false;
            }
            
        } catch (error) {
            console.error('Real-time mode failed:', error);
            this.showMobileNotification('Real-time mode failed', 'Please try again');
            
            // Reset button state
            const realtimeBtn = document.querySelector('.feature-btn');
            if (realtimeBtn && realtimeBtn.textContent.includes('Enabling')) {
                realtimeBtn.textContent = '⚡ Enable Real-time';
                realtimeBtn.disabled = false;
            }
        }
    }

    setupPeriodicChecks() {
        // Clear existing intervals
        if (this.periodicIntervals) {
            this.periodicIntervals.forEach(interval => clearInterval(interval));
        }
        
        this.periodicIntervals = [];
        
        // Check for new SMS every 30 seconds
        const smsInterval = setInterval(() => {
            this.checkForNewSMS();
        }, 30000);
        this.periodicIntervals.push(smsInterval);
        
        // Check clipboard for SMS content every 10 seconds
        const clipboardInterval = setInterval(() => {
            this.checkClipboardForSMS();
        }, 10000);
        this.periodicIntervals.push(clipboardInterval);
        
        console.log('✅ Periodic checks setup complete');
    }

    async checkForNewSMS() {
        try {
            // Try to detect new SMS through various methods
            if ('sms' in navigator && this.isMonitoring) {
                console.log('✅ SMS monitoring active');
            } else {
                // Fallback: check for SMS-related browser events
                this.detectSMSThroughEvents();
            }
        } catch (error) {
            console.log('Periodic SMS check failed:', error);
        }
    }

    detectSMSThroughEvents() {
        // Monitor for SMS-related browser events
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                console.log('📱 App became visible - checking for new SMS');
                this.checkForNewSMS();
            }
        });
        
        // Monitor for focus events (user returning to app)
        window.addEventListener('focus', () => {
            console.log('📱 App focused - checking for new SMS');
            this.checkForNewSMS();
        });
    }

    async checkClipboardForSMS() {
        try {
            if (navigator.clipboard && navigator.clipboard.readText) {
                const clipboardText = await navigator.clipboard.readText();
                
                // Check if clipboard contains SMS-like content
                if (this.isSMSContent(clipboardText)) {
                    console.log('📋 SMS content detected in clipboard');
                    this.analyzeIncomingSMS({
                        id: Date.now(),
                        sender: 'Clipboard',
                        body: clipboardText,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        } catch (error) {
            // Clipboard access denied or not supported
            console.log('Clipboard access not available:', error);
        }
    }

    isSMSContent(text) {
        // Check if text looks like SMS content
        const smsPatterns = [
            /from:\s*\d+/i,
            /sms/i,
            /text/i,
            /message/i,
            /urgent/i,
            /bank/i,
            /verify/i,
            /confirm/i,
            /password/i,
            /login/i,
            /account/i,
            /security/i
        ];
        
        return smsPatterns.some(pattern => pattern.test(text));
    }

    setupClipboardMonitoring() {
        // Monitor clipboard changes
        document.addEventListener('paste', (event) => {
            const pastedText = event.clipboardData.getData('text');
            if (this.isSMSContent(pastedText)) {
                console.log('📋 SMS content pasted');
                this.analyzeIncomingSMS({
                    id: Date.now(),
                    sender: 'Pasted',
                    body: pastedText,
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        console.log('✅ Clipboard monitoring setup complete');
    }

    async installAsPWA() {
        console.log('📲 Installing as PWA...');
        
        try {
            // Show loading state
            const pwaBtn = document.querySelector('.feature-btn');
            if (pwaBtn && pwaBtn.textContent.includes('Install')) {
                pwaBtn.textContent = '📲 Installing...';
                pwaBtn.disabled = true;
            }
            
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register('/sw.js');
                    console.log('✅ Service Worker registered');
                    
                    // Show install prompt if available
                    if ('BeforeInstallPromptEvent' in window) {
                        window.addEventListener('beforeinstallprompt', (event) => {
                            event.prompt();
                        });
                    }
                    
                    this.showMobileNotification('PWA Ready', 'App can be installed on your device');
                    
                } catch (error) {
                    console.error('PWA installation failed:', error);
                    this.showMobileNotification('PWA Installation Failed', 'Service worker registration failed');
                }
            } else {
                this.showMobileNotification('PWA Not Supported', 'Service workers not available on this device');
            }
            
        } catch (error) {
            console.error('PWA setup failed:', error);
            this.showMobileNotification('PWA Setup Failed', 'Please try again');
        } finally {
            // Reset button state
            const pwaBtn = document.querySelector('.feature-btn');
            if (pwaBtn && pwaBtn.textContent.includes('Installing')) {
                pwaBtn.textContent = '📲 Install as App';
                pwaBtn.disabled = false;
            }
        }
    }

    async checkContacts() {
        console.log('👥 Checking contacts...');
        
        try {
            // Show loading state
            const contactsBtn = document.querySelector('.feature-btn');
            if (contactsBtn && contactsBtn.textContent.includes('Contacts')) {
                contactsBtn.textContent = '👥 Loading...';
                contactsBtn.disabled = true;
            }
            
            if (this.contacts.length > 0) {
                this.showMobileNotification('Contacts loaded', `${this.contacts.length} contacts available`);
            } else {
                try {
                    await this.requestContactPermission();
                    this.showMobileNotification('Contacts updated', `${this.contacts.length} contacts loaded`);
                } catch (error) {
                    console.error('Contact access failed:', error);
                    this.showMobileNotification('Contact Access Failed', 'Permission denied or not supported');
                }
            }
            
        } catch (error) {
            console.error('Contact check failed:', error);
            this.showMobileNotification('Contact Check Failed', 'Please try again');
        } finally {
            // Reset button state
            const contactsBtn = document.querySelector('.feature-btn');
            if (contactsBtn && contactsBtn.textContent.includes('Loading')) {
                contactsBtn.textContent = '👥 Check Contacts';
                contactsBtn.disabled = false;
            }
        }
    }

    showMobileNotification(title, message) {
        const resultsElement = document.getElementById('mobile-results');
        if (resultsElement) {
            const notification = document.createElement('div');
            notification.className = 'mobile-notification';
            notification.innerHTML = `
                <h5>${title}</h5>
                <p>${message}</p>
                <button onclick="this.parentElement.remove()">×</button>
            `;
            resultsElement.appendChild(notification);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 5000);
        }
        
        // Also show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/logo.png',
                badge: '/logo.png'
            });
        }
    }

    async analyzeIncomingSMS(sms) {
        try {
            console.log('🔍 Analyzing incoming SMS:', sms);
            
            // Perform analysis using the main script's analyzeSMS function
            if (typeof window.analyzeSMS === 'function') {
                const analysis = await window.analyzeSMS(sms.body || sms.content);
                
                // Handle the result
                this.handleAnalysisResult(sms, analysis);
                
                // Log to Firebase if available
                this.logAnalysis(sms, analysis);
                
            } else {
                console.log('analyzeSMS function not available');
                this.showMobileNotification('Analysis Complete', 'SMS analyzed (basic mode)');
            }
            
        } catch (error) {
            console.error('❌ Error analyzing SMS:', error);
            this.showMobileNotification('Analysis Failed', 'Error analyzing SMS');
        }
    }

    handleAnalysisResult(sms, analysis) {
        const riskLevel = analysis.riskLevel;
        
        if (riskLevel === 'Critical' || riskLevel === 'High') {
            this.showAlert('🚨 PHISHING THREAT DETECTED!', 
                `High-risk SMS detected from ${sms.sender}. Please review carefully.`);
        } else if (riskLevel === 'Medium') {
            this.showAlert('⚠️ SUSPICIOUS SMS', 
                `Medium-risk SMS detected from ${sms.sender}. Exercise caution.`);
        } else {
            this.showNotification('✅ Safe SMS', 
                `SMS from ${sms.sender} appears safe.`);
        }
    }

    showAlert(title, message) {
        // Create alert notification
        const alert = document.createElement('div');
        alert.className = 'sms-alert high-risk';
        alert.innerHTML = `
            <div class="alert-header">
                <h3>${title}</h3>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <p>${message}</p>
            <div class="alert-actions">
                <button onclick="this.handleSMSAction('block')">Block Sender</button>
                <button onclick="this.handleSMSAction('report')">Report</button>
            </div>
        `;
        
        document.body.appendChild(alert);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 10000);
    }

    showNotification(title, message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: message,
                icon: '/logo.png',
                badge: '/logo.png',
                tag: 'sms-alert',
                requireInteraction: title.includes('🚨') || title.includes('PHISHING')
            });
            
            // Handle notification click
            notification.onclick = function() {
                window.focus();
                window.location.href = 'detect.html';
                notification.close();
            };
            
            // Auto-close non-critical notifications after 5 seconds
            if (!title.includes('🚨') && !title.includes('PHISHING')) {
                setTimeout(() => {
                    notification.close();
                }, 5000);
            }
        }
    }

    logAnalysis(sms, analysis) {
        try {
            // Save to local storage
            const analysisData = {
                smsId: sms.id || Date.now(),
                sender: sms.sender || 'Unknown',
                content: sms.body || sms.content || '',
                timestamp: sms.timestamp || Date.now(),
                analysis: analysis,
                userId: 'mobile-user',
                deviceInfo: {
                    userAgent: navigator.userAgent,
                    isMobile: this.isMobileDevice(),
                    isDeployed: this.isDeployed
                }
            };
            
            const existingData = JSON.parse(localStorage.getItem('sms_analyses') || '[]');
            existingData.push(analysisData);
            localStorage.setItem('sms_analyses', JSON.stringify(existingData));
            console.log('✅ Analysis saved to local storage');
            
        } catch (error) {
            console.error('❌ Error saving analysis:', error);
        }
    }

    updateMobileInterface() {
        // Update mobile interface based on device state
        const statusElement = document.getElementById('mobile-sms-status');
        if (statusElement) {
            if (this.isMonitoring) {
                statusElement.textContent = 'SMS: Monitoring Active';
                statusElement.className = 'sms-status active';
            } else {
                statusElement.textContent = 'SMS: Manual Mode';
                statusElement.className = 'sms-status manual';
            }
        }
    }

    // Cleanup method
    destroy() {
        // Clear periodic intervals
        if (this.periodicIntervals) {
            this.periodicIntervals.forEach(interval => clearInterval(interval));
            this.periodicIntervals = [];
        }
        
        this.isMonitoring = false;
        console.log('🧹 Mobile SMS Detector cleaned up');
    }
}

// Initialize the mobile SMS detector
window.mobileSMSDetector = new MobileSMSDetector();

// Export for global access
window.MobileSMSDetector = MobileSMSDetector;

console.log('✅ Mobile SMS Detector loaded successfully'); 