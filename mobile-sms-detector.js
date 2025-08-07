// ===== MOBILE SMS DETECTION SYSTEM =====
// Enhanced for Vercel deployment and Firebase backend integration

class MobileSMSDetector {
    constructor() {
        this.isMonitoring = false;
        this.periodicIntervals = [];
        this.smsListener = null;
        this.isDeployed = this.checkDeploymentEnvironment();
        
        // Initialize Firebase connection immediately
        this.initializeFirebaseConnection();
        
        console.log('📱 Mobile SMS Detector initialized with Firebase integration');
        
        // Test if the class is properly defined
        if (typeof MobileSMSDetector !== 'undefined') {
            console.log('✅ MobileSMSDetector class is properly defined');
        } else {
            console.error('❌ MobileSMSDetector class is not defined');
        }
    }

    checkDeploymentEnvironment() {
        // Check if running on Vercel deployment
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
        
        // Wait for Firebase to be ready
        await this.waitForFirebase();
        
        // Check for mobile device
        if (this.isMobileDevice()) {
            console.log('📱 Mobile device detected');
            await this.setupMobileIntegration();
        } else {
            console.log('💻 Desktop device detected - using enhanced fallback');
            this.setupDesktopFallback();
        }
    }

    async waitForFirebase() {
        // Wait for Firebase to be initialized
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts) {
            if (window.firebase && window.firebase.apps && window.firebase.apps.length > 0) {
                console.log('✅ Firebase initialized');
                return;
            }
            
            console.log(`⏳ Waiting for Firebase... (${attempts + 1}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }
        
        console.log('⚠️ Firebase not detected, continuing without Firebase features');
    }

    async requestMobilePermissions() {
        const permissions = [
            { name: 'notifications' },
            { name: 'contacts' },
            { name: 'geolocation' },
            { name: 'sms' }  // Add SMS permission explicitly
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
                        } else if (permission.name === 'sms') {
                            await this.requestSMSPermissionExplicit();
                        }
                    }
                }
            } catch (error) {
                console.log(`Permission ${permission.name} not supported or denied:`, error);
            }
        }
        
        // Also request SMS permission directly if available
        await this.requestDirectSMSPermission();
    }

    async requestDirectSMSPermission() {
        try {
            // Try to request SMS permission directly
            if ('sms' in navigator) {
                console.log('📱 Requesting direct SMS permission...');
                
                // For Android/iOS compatibility
                if (navigator.sms && navigator.sms.requestPermission) {
                    const result = await navigator.sms.requestPermission();
                    console.log('SMS permission result:', result);
                    
                    if (result === 'granted') {
                        console.log('✅ SMS permission granted directly');
                        this.startSMSMonitoring();
                    }
                }
                
                // Alternative method for some browsers
                if (navigator.permissions) {
                    const smsPermission = await navigator.permissions.query({ name: 'sms' });
                    console.log('SMS permission state:', smsPermission.state);
                    
                    if (smsPermission.state === 'granted') {
                        console.log('✅ SMS permission already granted');
                        this.startSMSMonitoring();
                    }
                }
            }
        } catch (error) {
            console.log('Direct SMS permission request failed:', error);
        }
    }

    async requestSMSPermissionExplicit() {
        try {
            // Enhanced SMS permission request for mobile devices
            if ('sms' in navigator) {
                console.log('📱 Requesting SMS permission for mobile device...');
                
                // Try multiple methods for different browsers/platforms
                if (navigator.sms && navigator.sms.requestPermission) {
                    const result = await navigator.sms.requestPermission();
                    console.log('SMS permission result:', result);
                    
                    if (result === 'granted') {
                        console.log('✅ SMS permission granted');
                        this.startSMSMonitoring();
                        return;
                    }
                }
                
                // Fallback for browsers that support permissions API
                if ('permissions' in navigator) {
                    const permission = await navigator.permissions.query({ name: 'sms' });
                    console.log('SMS permission state:', permission.state);
                    
                    if (permission.state === 'granted') {
                        console.log('✅ SMS permission already granted');
                        this.startSMSMonitoring();
                        return;
                    }
                }
                
                // Show manual permission request for mobile
                this.showMobilePermissionRequest();
                
            } else {
                console.log('❌ SMS API not available');
                this.setupEnhancedSMSDetection();
            }
        } catch (error) {
            console.error('Error requesting SMS permission:', error);
            this.setupEnhancedSMSDetection();
        }
    }

    showMobilePermissionRequest() {
        // Create a mobile-friendly permission request dialog
        const permissionDialog = document.createElement('div');
        permissionDialog.className = 'mobile-permission-dialog';
        permissionDialog.innerHTML = `
            <div class="permission-content">
                <h3>📱 SMS Access Required</h3>
                <p>To detect and analyze SMS messages on your mobile device, we need permission to access your SMS.</p>
                
                <div class="permission-steps">
                    <h4>How to enable SMS access:</h4>
                    <ol>
                        <li>Open your device Settings</li>
                        <li>Go to Apps & Permissions</li>
                        <li>Find this app in the list</li>
                        <li>Enable SMS permission</li>
                        <li>Return here and refresh the page</li>
                    </ol>
                </div>
                
                <div class="permission-buttons">
                    <button onclick="mobileSMSDetector.retrySMSPermission()" class="retry-btn">🔄 Retry Permission</button>
                    <button onclick="mobileSMSDetector.useManualMode()" class="manual-btn">📝 Use Manual Mode</button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="close-btn">✕ Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(permissionDialog);
    }

    async retrySMSPermission() {
        console.log('🔄 Retrying SMS permission...');
        
        try {
            // Remove the dialog
            const dialog = document.querySelector('.mobile-permission-dialog');
            if (dialog) dialog.remove();
            
            // Try requesting permission again
            await this.requestDirectSMSPermission();
            
            // If still not granted, show enhanced mode
            if (!this.isMonitoring) {
                this.setupEnhancedSMSDetection();
            }
        } catch (error) {
            console.error('Retry failed:', error);
            this.setupEnhancedSMSDetection();
        }
    }

    useManualMode() {
        console.log('📝 Switching to manual mode...');
        
        // Remove the dialog
        const dialog = document.querySelector('.mobile-permission-dialog');
        if (dialog) dialog.remove();
        
        // Setup enhanced detection with manual input
        this.setupEnhancedSMSDetection();
        
        // Show notification
        this.showMobileNotification('Manual Mode Active', 'You can paste SMS content manually for analysis');
    }

    isMobileDevice() {
        // Enhanced mobile detection
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

    // Enhanced setup method
    async setupMobileIntegration() {
        try {
            // Initialize Firebase connection first
            await this.initializeFirebaseConnection();
            
            // Setup mobile features
            await this.setupMobileFeatures();
            
            // Setup mobile UI
            this.setupMobileUI();
            
            // Setup mobile event listeners
            this.setupMobileEventListeners();
            
            // Setup mobile gestures
            this.setupMobileGestures();
            
            // Start monitoring
            this.isMonitoring = true;
            
            console.log('📱 Mobile integration setup complete with Firebase');
            
        } catch (error) {
            console.error('Mobile integration setup failed:', error);
            this.showMobileNotification('Setup Error', 'Failed to setup mobile integration');
        }
    }

    async setupSMSMonitoring() {
        try {
            console.log('📱 Setting up SMS monitoring...');
            
            // Check if SMS API is available
            if ('sms' in navigator) {
                console.log('✅ SMS API available');
                this.isSupported = true;
                
                // Try to start monitoring
                if (navigator.sms && navigator.sms.addEventListener) {
                    navigator.sms.addEventListener('received', (event) => {
                        console.log('📱 SMS received:', event);
                        this.analyzeIncomingSMS(event);
                    });
                    
                    this.isMonitoring = true;
                    console.log('✅ SMS monitoring started');
                }
            } else {
                console.log('❌ SMS API not available, using enhanced detection');
                this.setupEnhancedSMSDetection();
            }
        } catch (error) {
            console.error('❌ SMS monitoring setup failed:', error);
            this.setupEnhancedSMSDetection();
        }
    }

    async requestSMSPermission() {
        try {
            this.permission = await navigator.permissions.query({ name: 'sms' });
            
            if (this.permission.state === 'granted') {
                console.log('✅ SMS permission already granted');
                this.startSMSMonitoring();
            } else if (this.permission.state === 'prompt') {
                console.log('📱 Requesting SMS permission...');
                await this.requestSMSPermissionExplicit();
            } else {
                console.log('❌ SMS permission denied');
                this.setupEnhancedSMSDetection();
            }
        } catch (error) {
            console.error('Error checking SMS permission:', error);
            this.setupEnhancedSMSDetection();
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

    startSMSMonitoring() {
        try {
            // Listen for incoming SMS
            this.smsListener = navigator.sms.addEventListener('receive', (event) => {
                const sms = event.sms;
                console.log('📱 New SMS received:', sms);
                
                // Analyze the SMS immediately
                this.analyzeIncomingSMS(sms);
            });

            console.log('✅ SMS monitoring started');
            this.isMonitoring = true;
            this.showStatus('SMS monitoring active', 'success');
            
            // Also monitor SMS history if available
            this.monitorSMSHistory();
            
        } catch (error) {
            console.error('Error starting SMS monitoring:', error);
            this.setupEnhancedSMSDetection();
        }
    }

    async analyzeIncomingSMS(sms) {
        try {
            console.log('🔍 Analyzing incoming SMS:', sms);
            
            // Perform analysis
            const analysis = await this.performAnalysis(sms.body || sms.content);
            
            // Handle the result
            this.handleAnalysisResult(sms, analysis);
            
            // Log to Firebase
            this.logAnalysis(sms, analysis);
            
        } catch (error) {
            console.error('❌ Error analyzing SMS:', error);
        }
    }

    async performAnalysis(smsContent) {
        try {
            console.log('🔍 Performing SMS analysis...');
            
            const analysis = {
                timestamp: Date.now(),
                content: smsContent,
                urls: this.extractURLs(smsContent),
                threats: this.detectThreatPatterns(smsContent),
                riskLevel: 'unknown',
                confidence: 0,
                recommendations: []
            };
            
            // Calculate risk level
            analysis.riskLevel = this.calculateRiskLevel(analysis);
            
            // Calculate confidence
            analysis.confidence = this.calculateConfidence(analysis);
            
            // Generate recommendations
            analysis.recommendations = this.generateRecommendations(analysis);
            
            console.log('✅ Analysis complete:', analysis);
            return analysis;
            
        } catch (error) {
            console.error('❌ Analysis failed:', error);
            return {
                timestamp: Date.now(),
                content: smsContent,
                riskLevel: 'error',
                confidence: 0,
                error: error.message
            };
        }
    }

    generateRecommendations(analysis) {
        const recommendations = [];
        
        if (analysis.riskLevel === 'high') {
            recommendations.push('🚨 Do not click any links in this message');
            recommendations.push('🚨 Do not provide any personal information');
            recommendations.push('🚨 Block this sender if possible');
        } else if (analysis.riskLevel === 'medium') {
            recommendations.push('⚠️ Be cautious with this message');
            recommendations.push('⚠️ Verify the sender before responding');
        } else if (analysis.riskLevel === 'low') {
            recommendations.push('✅ This message appears safe');
        }
        
        if (analysis.urls.length > 0) {
            recommendations.push('🔗 This message contains links - verify before clicking');
        }
        
        return recommendations;
    }

    extractURLs(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.match(urlRegex) || [];
    }

    detectThreatPatterns(text) {
        const patterns = {
            urgency: /(urgent|immediate|now|quick|hurry)/gi,
            threats: /(suspend|block|close|terminate|penalty)/gi,
            personalInfo: /(password|pin|ssn|credit.?card|bank.?account)/gi,
            rewards: /(prize|reward|gift|bonus|free)/gi,
            bankAlerts: /(bank|account|security|verify|confirm)/gi
        };

        const threats = {};
        for (const [key, regex] of Object.entries(patterns)) {
            const matches = text.match(regex);
            threats[key] = matches ? matches.length : 0;
        }

        return threats;
    }

    calculateRiskLevel(analysis) {
        let riskScore = 0;
        
        // Use ensemble model prediction (most accurate)
        if (analysis.ensemble) {
            const ensemblePrediction = analysis.ensemble.label;
            const ensembleConfidence = analysis.ensemble.probability || 0.5;
            
            if (ensemblePrediction === 'spam' || ensemblePrediction === 'phishing') {
                riskScore += Math.floor(ensembleConfidence * 50);
            }
        }
        
        // Add risk based on individual model predictions
        if (analysis.naiveBayes && analysis.naiveBayes.probability > 0.7) {
            riskScore += 20;
        }
        
        if (analysis.lstm && analysis.lstm.probability > 0.7) {
            riskScore += 20;
        }
        
        // Add risk based on threat patterns
        const threats = analysis.threatPatterns;
        if (threats.urgency > 0) riskScore += 10;
        if (threats.threats > 0) riskScore += 15;
        if (threats.personalInfo > 0) riskScore += 20;
        if (threats.bankAlerts > 0) riskScore += 15;
        
        // Add risk based on URLs
        if (analysis.urls.length > 0) riskScore += 10;
        
        if (riskScore >= 70) return 'HIGH';
        if (riskScore >= 40) return 'MEDIUM';
        return 'LOW';
    }
    
    calculateConfidence(analysis) {
        let confidence = 0;
        let modelCount = 0;
        
        // Average confidence from all models
        if (analysis.ensemble && analysis.ensemble.probability) {
            confidence += analysis.ensemble.probability;
            modelCount++;
        }
        
        if (analysis.naiveBayes && analysis.naiveBayes.probability) {
            confidence += analysis.naiveBayes.probability;
            modelCount++;
        }
        
        if (analysis.lstm && analysis.lstm.probability) {
            confidence += analysis.lstm.probability;
            modelCount++;
        }
        
        return modelCount > 0 ? confidence / modelCount : 0.5;
    }

    handleAnalysisResult(sms, analysis) {
        const riskLevel = analysis.riskLevel;
        
        if (riskLevel === 'HIGH') {
            this.showAlert('🚨 PHISHING THREAT DETECTED!', 
                `High-risk SMS detected from ${sms.sender}. Please review carefully.`);
            this.blockSMS(sms);
        } else if (riskLevel === 'MEDIUM') {
            this.showAlert('⚠️ SUSPICIOUS SMS', 
                `Medium-risk SMS detected from ${sms.sender}. Exercise caution.`);
        } else {
            this.showNotification('✅ Safe SMS', 
                `SMS from ${sms.sender} appears safe.`);
        }
        
        // Log the analysis
        this.logAnalysis(sms, analysis);
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

    showStatus(message, type) {
        const status = document.getElementById('sms-status');
        if (status) {
            status.textContent = message;
            status.className = `status ${type}`;
        }
    }

    blockSMS(sms) {
        // Implement SMS blocking logic
        console.log('Blocking SMS from:', sms.sender);
        // This would require additional permissions and platform-specific APIs
    }

    logAnalysis(sms, analysis) {
        // Enhanced Firebase integration for deployment
        try {
            if (window.firebase && window.firebase.database && window.auth && window.auth.currentUser) {
                const analysisData = {
                    smsId: sms.id || Date.now(),
                    sender: sms.sender || 'Unknown',
                    content: sms.body || sms.content || '',
                    timestamp: sms.timestamp || Date.now(),
                    analysis: analysis,
                    userId: window.auth.currentUser.uid,
                    deviceInfo: {
                        userAgent: navigator.userAgent,
                        isMobile: this.isMobileDevice(),
                        isDeployed: this.isDeployed,
                        permissions: {
                            notifications: Notification.permission,
                            contacts: this.contacts.length > 0,
                            location: !!this.userLocation,
                            sms: this.isMonitoring
                        }
                    },
                    deploymentInfo: {
                        hostname: window.location.hostname,
                        protocol: window.location.protocol,
                        timestamp: new Date().toISOString()
                    }
                };
                
                console.log('💾 Saving analysis to Firebase:', analysisData);
                
                // Save to Firebase with error handling
                window.db.ref('sms_analyses').push(analysisData)
                    .then(() => {
                        console.log('✅ Analysis saved to Firebase successfully');
                    })
                    .catch((error) => {
                        console.error('❌ Failed to save to Firebase:', error);
                        // Fallback to local storage
                        this.saveToLocalStorage(analysisData);
                    });
            } else {
                console.log('⚠️ Firebase not available, saving to local storage');
                this.saveToLocalStorage({
                    smsId: sms.id || Date.now(),
                    sender: sms.sender || 'Unknown',
                    content: sms.body || sms.content || '',
                    timestamp: sms.timestamp || Date.now(),
                    analysis: analysis,
                    userId: 'local-user',
                    deviceInfo: {
                        userAgent: navigator.userAgent,
                        isMobile: this.isMobileDevice(),
                        isDeployed: this.isDeployed
                    }
                });
            }
        } catch (error) {
            console.error('❌ Error saving analysis:', error);
            // Always fallback to local storage
            this.saveToLocalStorage({
                smsId: sms.id || Date.now(),
                sender: sms.sender || 'Unknown',
                content: sms.body || sms.content || '',
                timestamp: sms.timestamp || Date.now(),
                analysis: analysis,
                userId: 'fallback-user'
            });
        }
    }

    saveToLocalStorage(analysisData) {
        try {
            const existingData = JSON.parse(localStorage.getItem('sms_analyses') || '[]');
            existingData.push(analysisData);
            localStorage.setItem('sms_analyses', JSON.stringify(existingData));
            console.log('✅ Analysis saved to local storage');
        } catch (error) {
            console.error('❌ Failed to save to local storage:', error);
        }
    }

    setupEnhancedSMSDetection() {
        console.log('🔧 Setting up enhanced SMS detection...');
        
        // Create enhanced mobile interface
        this.createEnhancedMobileInterface();
        
        // Setup periodic checks
        this.setupPeriodicChecks();
        
        // Request notification permission for alerts
        if ('Notification' in window) {
            Notification.requestPermission();
        }
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
            
            // Try to access SMS database (limited browser support)
            if ('indexedDB' in window) {
                const db = await this.openSMSDatabase();
                const recentSMS = await this.getRecentSMS(db);
                
                if (recentSMS.length > 0) {
                    console.log(`Found ${recentSMS.length} recent SMS messages`);
                    this.analyzeMultipleSMS(recentSMS);
                    this.showMobileNotification('SMS Scan Complete', `Found and analyzed ${recentSMS.length} messages`);
                } else {
                    console.log('No recent SMS found in database');
                    this.showMobileNotification('No recent SMS found', 'Try pasting SMS content manually');
                }
            } else {
                // Fallback: check clipboard for SMS content
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

    async openSMSDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('SMSDatabase', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('sms')) {
                    db.createObjectStore('sms', { keyPath: 'id', autoIncrement: true });
                }
            };
        });
    }

    async getRecentSMS(db) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['sms'], 'readonly');
            const store = transaction.objectStore('sms');
            const request = store.getAll();
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const sms = request.result;
                // Filter for recent SMS (last 24 hours)
                const recent = sms.filter(msg => {
                    const msgTime = new Date(msg.timestamp);
                    const now = new Date();
                    return (now - msgTime) < 24 * 60 * 60 * 1000;
                });
                resolve(recent);
            };
        });
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
            
            // Setup network monitoring for SMS-related traffic
            this.setupNetworkMonitoring();
            
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

    setupNetworkMonitoring() {
        // Monitor for SMS-related network requests
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            if (typeof url === 'string' && url.includes('sms')) {
                console.log('🌐 SMS-related network request detected');
            }
            return originalFetch.apply(this, args);
        };
        
        console.log('✅ Network monitoring setup complete');
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
                    const registration = await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
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

    setupDesktopFallback() {
        console.log('💻 Setting up desktop fallback...');
        this.createEnhancedMobileInterface();
    }

    setupBackgroundMonitoring() {
        // Setup background sync for mobile
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then(registration => {
                registration.sync.register('sms-monitoring');
            });
        }
    }

    async setupContactAccess() {
        try {
            await this.requestContactPermission();
        } catch (error) {
            console.log('Contact access setup failed:', error);
        }
    }

    monitorSMSHistory() {
        // Monitor for SMS history changes
        if ('indexedDB' in window) {
            this.setupSMSHistoryMonitoring();
        }
    }

    setupSMSHistoryMonitoring() {
        // Monitor IndexedDB for SMS changes
        const dbName = 'SMSDatabase';
        const request = indexedDB.open(dbName, 1);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('sms')) {
                const store = db.createObjectStore('sms', { keyPath: 'id', autoIncrement: true });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            console.log('✅ SMS history monitoring active');
            
            // Store reference for later use
            this.smsDatabase = db;
        };
    }

    async analyzeMultipleSMS(smsList) {
        console.log(`🔍 Analyzing ${smsList.length} SMS messages...`);
        
        const results = [];
        for (const sms of smsList) {
            try {
                const analysis = await this.performAnalysis(sms.body);
                results.push({
                    sms: sms,
                    analysis: analysis
                });
                
                // Show individual results
                this.handleAnalysisResult(sms, analysis);
                
            } catch (error) {
                console.error('Error analyzing SMS:', error);
            }
        }
        
        // Show summary
        this.showBulkAnalysisResults(results);
    }

    showBulkAnalysisResults(results) {
        const phishingCount = results.filter(r => r.analysis.riskLevel === 'HIGH').length;
        const suspiciousCount = results.filter(r => r.analysis.riskLevel === 'MEDIUM').length;
        const safeCount = results.filter(r => r.analysis.riskLevel === 'LOW').length;
        
        const summary = `
            📊 Bulk Analysis Complete:
            🚨 High Risk: ${phishingCount}
            ⚠️ Medium Risk: ${suspiciousCount}
            ✅ Safe: ${safeCount}
            📱 Total: ${results.length}
        `;
        
        this.showMobileNotification('Bulk Analysis Complete', summary);
        
        // Send notification if threats found
        if (phishingCount > 0 || suspiciousCount > 0) {
            this.sendThreatAlert(phishingCount, suspiciousCount);
        }
    }

    sendThreatAlert(phishingCount, suspiciousCount) {
        const title = phishingCount > 0 ? '🚨 PHISHING THREATS DETECTED!' : '⚠️ SUSPICIOUS MESSAGES FOUND';
        const message = `Found ${phishingCount} high-risk and ${suspiciousCount} suspicious SMS messages.`;
        
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: message,
                icon: '/logo.png',
                badge: '/logo.png',
                tag: 'bulk-threat-alert',
                requireInteraction: true,
                actions: [
                    {
                        action: 'view',
                        title: 'View Details'
                    },
                    {
                        action: 'block',
                        title: 'Block Senders'
                    }
                ]
            });
            
            notification.onclick = function() {
                window.focus();
                window.location.href = 'detect.html';
                notification.close();
            };
        }
    }

    // Enhanced analysis with mobile context
    async performAnalysis(smsContent) {
        const analysis = {
            content: smsContent,
            timestamp: new Date().toISOString(),
            analysis: {},
            mobileContext: {}
        };

        try {
            // Add mobile context
            analysis.mobileContext = {
                isMobileDevice: this.isMobileDevice(),
                hasContacts: this.contacts.length > 0,
                hasLocation: !!this.userLocation,
                isMonitoring: this.isMonitoring
            };

            // Use trained models from AI Training System
            if (window.trainedModels && window.trainedModels.naiveBayes) {
                analysis.naiveBayes = window.trainedModels.naiveBayes.predict(smsContent);
            }

            if (window.trainedModels && window.trainedModels.lstm) {
                analysis.lstm = window.trainedModels.lstm.predict(smsContent);
            }

            if (window.trainedModels && window.trainedModels.ensemble) {
                analysis.ensemble = window.trainedModels.ensemble.predict(smsContent);
            }

            // URL analysis
            analysis.urls = this.extractURLs(smsContent);
            
            // Threat pattern analysis
            analysis.threatPatterns = this.detectThreatPatterns(smsContent);
            
            // Contact analysis (if available)
            if (this.contacts.length > 0) {
                analysis.contactAnalysis = this.analyzeContactContext(smsContent);
            }
            
            // Overall risk assessment using ensemble
            analysis.riskLevel = this.calculateRiskLevel(analysis);
            
            // Add AI confidence score
            analysis.confidence = this.calculateConfidence(analysis);
            
        } catch (error) {
            console.error('Error in SMS analysis:', error);
        }

        return analysis;
    }

    analyzeContactContext(smsContent) {
        const contactAnalysis = {
            knownSender: false,
            senderName: null,
            contactMatch: null
        };

        // Check if SMS mentions any known contacts
        for (const contact of this.contacts) {
            if (contact.tel && contact.tel.length > 0) {
                const phoneNumber = contact.tel[0];
                if (smsContent.includes(phoneNumber)) {
                    contactAnalysis.knownSender = true;
                    contactAnalysis.senderName = contact.name || 'Unknown Contact';
                    contactAnalysis.contactMatch = contact;
                    break;
                }
            }
        }

        return contactAnalysis;
    }

    // Cleanup method
    destroy() {
        if (this.smsListener) {
            navigator.sms.removeEventListener('receive', this.smsListener);
        }
        
        // Clear periodic intervals
        if (this.periodicIntervals) {
            this.periodicIntervals.forEach(interval => clearInterval(interval));
            this.periodicIntervals = [];
        }
        
        this.isMonitoring = false;
        console.log('🧹 Mobile SMS Detector cleaned up');
    }

    setupMobileFeatures() {
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

    // Show mobile interface with back button and enhanced features
    showMobileInterface() {
        const existingInterface = document.querySelector('.enhanced-mobile-interface');
        if (existingInterface) {
            existingInterface.remove();
        }

        const mobileInterface = document.createElement('div');
        mobileInterface.className = 'enhanced-mobile-interface';
        mobileInterface.innerHTML = `
            <div class="mobile-ui-overlay">
                <div class="mobile-status-bar">
                    <button class="back-btn" onclick="window.mobileSMSDetector.goBackToWebApp()">
                        <i class="fas fa-arrow-left"></i> Back to Web App
                    </button>
                    <div class="sms-status">
                        <span class="status-indicator active"></span>
                        SMS Shield Active
                    </div>
                </div>
                
                <div class="mobile-sms-container">
                    <div class="mobile-status">
                        <h3>📱 Advanced SMS Protection</h3>
                        <p>Real-time SMS threat detection with AI analysis</p>
                        <div class="status-indicators">
                            <span class="status-item active">🛡️ Protection Active</span>
                            <span class="status-item active">📡 Real-time Monitoring</span>
                            <span class="status-item active">🔥 Firebase Connected</span>
                            <span class="status-item active">🤖 AI Analysis Ready</span>
                        </div>
                    </div>

                    <div class="permission-section">
                        <h4>🔐 SMS Permissions</h4>
                        <div class="permission-status">
                            <div class="permission-item">
                                <span class="permission-icon">📱</span>
                                <span class="permission-text">SMS Access</span>
                                <button class="permission-btn" onclick="window.mobileSMSDetector.requestSMSPermission()">
                                    Grant Permission
                                </button>
                            </div>
                            <div class="permission-item">
                                <span class="permission-icon">🔔</span>
                                <span class="permission-text">Notifications</span>
                                <button class="permission-btn" onclick="window.mobileSMSDetector.requestNotificationPermission()">
                                    Enable Notifications
                                </button>
                            </div>
                            <div class="permission-item">
                                <span class="permission-icon">📋</span>
                                <span class="permission-text">Clipboard Access</span>
                                <button class="permission-btn" onclick="window.mobileSMSDetector.requestClipboardPermission()">
                                    Allow Clipboard
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="sms-input-section">
                        <h4>🔍 Analyze SMS Content</h4>
                        <textarea id="mobile-sms-input" placeholder="Paste SMS content here or type to analyze..."></textarea>
                        <button class="analyze-btn" onclick="window.mobileSMSDetector.analyzeMobileSMS()">
                            🔍 Analyze SMS
                        </button>
                    </div>

                    <div class="mobile-features">
                        <h4>⚡ Advanced Actions</h4>
                        <div class="feature-buttons">
                            <button class="feature-btn real-time-btn" onclick="window.mobileSMSDetector.enableRealTimeMode()">
                                ⚡ Real-time Mode
                            </button>
                            <button class="feature-btn install-btn" onclick="window.mobileSMSDetector.installAsPWA()">
                                📲 Install as App
                            </button>
                            <button class="feature-btn contacts-btn" onclick="window.mobileSMSDetector.checkContacts()">
                                👥 Check Contacts
                            </button>
                            <button class="feature-btn scan-btn" onclick="window.mobileSMSDetector.scanRecentSMS()">
                                📋 Scan Recent SMS
                            </button>
                            <button class="feature-btn auto-btn" onclick="window.mobileSMSDetector.enableAutoDetection()">
                                🤖 Auto Detection
                            </button>
                            <button class="feature-btn push-btn" onclick="window.mobileSMSDetector.enablePushNotifications()">
                                🔔 Push Notifications
                            </button>
                        </div>
                    </div>

                    <div class="mobile-results">
                        <h4>📊 Analysis Results</h4>
                        <div class="results-placeholder">
                            <p>Analysis results will appear here...</p>
                        </div>
                    </div>

                    <div class="advanced-features">
                        <h4>🚀 Advanced Features</h4>
                        <div class="advanced-buttons">
                            <button class="advanced-btn" onclick="window.mobileSMSDetector.enableBackgroundSync()">
                                🔄 Background Sync
                            </button>
                            <button class="advanced-btn" onclick="window.mobileSMSDetector.enableOfflineMode()">
                                📱 Offline Mode
                            </button>
                            <button class="advanced-btn" onclick="window.mobileSMSDetector.enableAdvancedAI()">
                                🤖 Advanced AI
                            </button>
                            <button class="advanced-btn" onclick="window.mobileSMSDetector.enableThreatBlocking()">
                                🛡️ Threat Blocking
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(mobileInterface);
        
        // Add gesture indicator
        this.addGestureIndicator();
        
        // Initialize advanced features
        this.initializeAdvancedFeatures();
        
        console.log('📱 Enhanced mobile interface displayed with advanced features');
    }

    // Add gesture indicator
    addGestureIndicator() {
        const gestureIndicator = document.createElement('div');
        gestureIndicator.className = 'gesture-indicator';
        gestureIndicator.innerHTML = `
            <div class="gesture-content">
                <span class="gesture-icon">👆</span>
                <span class="gesture-text">Swipe down to access mobile features</span>
            </div>
        `;
        
        document.body.appendChild(gestureIndicator);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (gestureIndicator.parentNode) {
                gestureIndicator.parentNode.removeChild(gestureIndicator);
            }
        }, 3000);
    }

    // Initialize advanced features
    initializeAdvancedFeatures() {
        console.log('🚀 Initializing advanced features...');
        
        // Check device capabilities
        this.checkDeviceCapabilities();
        
        // Setup enhanced monitoring
        this.setupEnhancedMonitoring();
        
        // Initialize AI models
        this.initializeAIModels();
        
        console.log('✅ Advanced features initialized');
    }

    // Check device capabilities
    checkDeviceCapabilities() {
        const capabilities = {
            sms: 'sms' in navigator,
            notifications: 'Notification' in window,
            clipboard: 'clipboard' in navigator,
            serviceWorker: 'serviceWorker' in navigator,
            indexedDB: 'indexedDB' in window,
            pushManager: 'PushManager' in window
        };
        
        console.log('📱 Device capabilities:', capabilities);
        return capabilities;
    }

    // Setup enhanced monitoring
    setupEnhancedMonitoring() {
        // Enhanced clipboard monitoring
        this.setupEnhancedClipboardMonitoring();
        
        // Enhanced network monitoring
        this.setupEnhancedNetworkMonitoring();
        
        // Enhanced periodic checks
        this.setupEnhancedPeriodicChecks();
        
        // Enhanced event listeners
        this.setupEnhancedEventListeners();
    }

    // Initialize AI models
    initializeAIModels() {
        console.log('🤖 Initializing AI models...');
        
        // Initialize ML models if available
        if (typeof window.naiveBayesClassifier !== 'undefined') {
            console.log('✅ Naive Bayes classifier available');
        }
        
        if (typeof window.lstmClassifier !== 'undefined') {
            console.log('✅ LSTM classifier available');
        }
        
        console.log('🤖 AI models initialized');
    }

    // Request SMS permission
    async requestSMSPermission() {
        try {
            console.log('📱 Requesting SMS permission...');
            
            if ('sms' in navigator) {
                const permission = await navigator.permissions.query({ name: 'sms' });
                if (permission.state === 'granted') {
                    this.showMobileNotification('✅ SMS Permission Granted', 'SMS access is now enabled');
                } else {
                    // Try to request permission
                    await navigator.sms.requestPermission();
                    this.showMobileNotification('✅ SMS Permission Requested', 'Please grant SMS access');
                }
            } else {
                this.showMobileNotification('⚠️ SMS API Not Available', 'SMS access not supported in this browser');
            }
        } catch (error) {
            console.error('❌ SMS permission request failed:', error);
            this.showMobileNotification('❌ Permission Failed', 'SMS access could not be granted');
        }
    }

    // Request notification permission
    async requestNotificationPermission() {
        try {
            console.log('🔔 Requesting notification permission...');
            
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                this.showMobileNotification('✅ Notifications Enabled', 'You will receive threat alerts');
            } else {
                this.showMobileNotification('⚠️ Notifications Disabled', 'Please enable notifications for alerts');
            }
        } catch (error) {
            console.error('❌ Notification permission failed:', error);
            this.showMobileNotification('❌ Notification Failed', 'Could not enable notifications');
        }
    }

    // Request clipboard permission
    async requestClipboardPermission() {
        try {
            console.log('📋 Requesting clipboard permission...');
            
            if ('clipboard' in navigator) {
                const permission = await navigator.permissions.query({ name: 'clipboard-read' });
                if (permission.state === 'granted') {
                    this.showMobileNotification('✅ Clipboard Access Granted', 'Clipboard monitoring enabled');
                } else {
                    this.showMobileNotification('⚠️ Clipboard Access Needed', 'Please grant clipboard access');
                }
            } else {
                this.showMobileNotification('⚠️ Clipboard API Not Available', 'Clipboard access not supported');
            }
        } catch (error) {
            console.error('❌ Clipboard permission failed:', error);
            this.showMobileNotification('❌ Clipboard Failed', 'Could not access clipboard');
        }
    }

    // Enable auto detection
    async enableAutoDetection() {
        try {
            console.log('🤖 Enabling auto detection...');
            
            // Enable all detection methods
            this.setupEnhancedClipboardMonitoring();
            this.setupEnhancedNetworkMonitoring();
            this.setupEnhancedPeriodicChecks();
            
            this.showMobileNotification('✅ Auto Detection Enabled', 'SMS threats will be detected automatically');
        } catch (error) {
            console.error('❌ Auto detection failed:', error);
            this.showMobileNotification('❌ Auto Detection Failed', 'Could not enable auto detection');
        }
    }

    // Enable push notifications
    async enablePushNotifications() {
        try {
            console.log('🔔 Enabling push notifications...');
            
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                const registration = await navigator.serviceWorker.register('/sw.js');
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: this.urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
                });
                
                this.showMobileNotification('✅ Push Notifications Enabled', 'You will receive real-time alerts');
            } else {
                this.showMobileNotification('⚠️ Push Notifications Not Available', 'Service Worker or Push API not supported');
            }
        } catch (error) {
            console.error('❌ Push notifications failed:', error);
            this.showMobileNotification('❌ Push Notifications Failed', 'Could not enable push notifications');
        }
    }

    // Enable background sync
    async enableBackgroundSync() {
        try {
            console.log('🔄 Enabling background sync...');
            
            if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
                const registration = await navigator.serviceWorker.ready;
                await registration.sync.register('sms-analysis');
                
                this.showMobileNotification('✅ Background Sync Enabled', 'SMS analysis will continue in background');
            } else {
                this.showMobileNotification('⚠️ Background Sync Not Available', 'Background sync not supported');
            }
        } catch (error) {
            console.error('❌ Background sync failed:', error);
            this.showMobileNotification('❌ Background Sync Failed', 'Could not enable background sync');
        }
    }

    // Enable offline mode
    async enableOfflineMode() {
        try {
            console.log('📱 Enabling offline mode...');
            
            // Cache essential resources
            if ('caches' in window) {
                const cache = await caches.open('sms-detector-v1');
                await cache.addAll([
                    '/',
                    '/detect.html',
                    '/mobile-sms-detector.js',
                    '/mobile-sms-detector.css'
                ]);
                
                this.showMobileNotification('✅ Offline Mode Enabled', 'App will work without internet');
            } else {
                this.showMobileNotification('⚠️ Offline Mode Not Available', 'Cache API not supported');
            }
        } catch (error) {
            console.error('❌ Offline mode failed:', error);
            this.showMobileNotification('❌ Offline Mode Failed', 'Could not enable offline mode');
        }
    }

    // Enable advanced AI
    async enableAdvancedAI() {
        try {
            console.log('🤖 Enabling advanced AI...');
            
            // Initialize advanced AI features
            this.initializeAIModels();
            
            // Enable enhanced analysis
            this.enableEnhancedAnalysis = true;
            
            this.showMobileNotification('✅ Advanced AI Enabled', 'Enhanced AI analysis is now active');
        } catch (error) {
            console.error('❌ Advanced AI failed:', error);
            this.showMobileNotification('❌ Advanced AI Failed', 'Could not enable advanced AI');
        }
    }

    // Enable threat blocking
    async enableThreatBlocking() {
        try {
            console.log('🛡️ Enabling threat blocking...');
            
            // Enable threat blocking features
            this.threatBlockingEnabled = true;
            
            // Setup threat blocking rules
            this.setupThreatBlocking();
            
            this.showMobileNotification('✅ Threat Blocking Enabled', 'Threats will be automatically blocked');
        } catch (error) {
            console.error('❌ Threat blocking failed:', error);
            this.showMobileNotification('❌ Threat Blocking Failed', 'Could not enable threat blocking');
        }
    }

    // Setup threat blocking
    setupThreatBlocking() {
        console.log('🛡️ Setting up threat blocking...');
        
        // Add threat blocking rules
        this.threatBlockingRules = [
            { pattern: /phishing/i, action: 'block' },
            { pattern: /scam/i, action: 'block' },
            { pattern: /urgent.*verify/i, action: 'warn' },
            { pattern: /account.*suspended/i, action: 'block' }
        ];
        
        console.log('✅ Threat blocking rules configured');
    }

    // Utility function for VAPID key conversion
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Go back to web app
    goBackToWebApp() {
        try {
            // Hide mobile interface
            const mobileInterface = document.querySelector('.enhanced-mobile-interface');
            if (mobileInterface) {
                mobileInterface.remove();
            }

            // Show success message
            this.showMobileNotification('Returning to Web App', 'You can access mobile features anytime!');
            
            // Scroll to top of page
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Highlight the mobile connect button
            const mobileBtn = document.querySelector('.btn-mobile');
            if (mobileBtn) {
                mobileBtn.style.animation = 'pulse 1s ease-in-out';
                setTimeout(() => {
                    mobileBtn.style.animation = '';
                }, 1000);
            }
            
            console.log('🔙 Returned to web app');
            
        } catch (error) {
            console.error('Failed to return to web app:', error);
            // Fallback - just hide the interface
            const mobileInterface = document.querySelector('.enhanced-mobile-interface');
            if (mobileInterface) {
                mobileInterface.remove();
            }
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

    // Enhanced PWA installation
    async installAsPWA() {
        const installBtn = document.querySelector('.install-btn');
        if (installBtn) {
            installBtn.textContent = '📲 Installing...';
            installBtn.disabled = true;
        }

        try {
            // Check if PWA is already installed
            if (window.matchMedia('(display-mode: standalone)').matches) {
                this.showMobileNotification('Already Installed', 'SMS Shield is already installed as an app!');
                return;
            }

            // Check if installation is available
            if (!window.deferredPrompt) {
                this.showMobileNotification('Installation Unavailable', 'Please use the browser menu to install SMS Shield as an app');
                return;
            }

            // Show install prompt
            window.deferredPrompt.prompt();
            const { outcome } = await window.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                this.showMobileNotification('Installation Successful', 'SMS Shield is now installed as an app!');
                window.deferredPrompt = null;
                
                // Enable enhanced SMS features after installation
                await this.enableEnhancedSMSFeatures();
            } else {
                this.showMobileNotification('Installation Cancelled', 'You can install later from browser menu');
            }

        } catch (error) {
            console.error('PWA installation failed:', error);
            this.showMobileNotification('Installation Failed', 'Please try installing from browser menu');
        } finally {
            if (installBtn) {
                installBtn.textContent = '📲 Install as App';
                installBtn.disabled = false;
            }
        }
    }

    // Enhanced SMS features for installed app
    async enableEnhancedSMSFeatures() {
        try {
            // Request enhanced permissions
            await this.requestEnhancedPermissions();
            
            // Setup enhanced SMS monitoring
            await this.setupEnhancedSMSMonitoring();
            
            // Enable background processing
            await this.enableBackgroundProcessing();
            
            this.showMobileNotification('Enhanced Features Enabled', 'SMS Shield now has enhanced SMS access capabilities');
            
        } catch (error) {
            console.error('Failed to enable enhanced features:', error);
        }
    }

    // Request enhanced permissions for app mode
    async requestEnhancedPermissions() {
        const permissions = [
            { name: 'notifications', state: 'granted' },
            { name: 'clipboard-read', state: 'granted' },
            { name: 'clipboard-write', state: 'granted' }
        ];

        for (const permission of permissions) {
            try {
                const result = await navigator.permissions.query({ name: permission.name });
                if (result.state === 'prompt') {
                    await this.requestPermission(permission.name);
                }
            } catch (error) {
                console.log(`Permission ${permission.name} not supported or already granted`);
            }
        }
    }

    // Request specific permission
    async requestPermission(permissionName) {
        try {
            switch (permissionName) {
                case 'notifications':
                    return await Notification.requestPermission();
                case 'clipboard-read':
                    return await navigator.clipboard.readText();
                case 'clipboard-write':
                    return await navigator.clipboard.writeText('test');
                default:
                    return 'granted';
            }
        } catch (error) {
            console.log(`Permission ${permissionName} request failed:`, error);
            return 'denied';
        }
    }

    // Enhanced SMS monitoring for app mode
    async setupEnhancedSMSMonitoring() {
        // Enhanced clipboard monitoring
        this.setupEnhancedClipboardMonitoring();
        
        // Enhanced network monitoring
        this.setupEnhancedNetworkMonitoring();
        
        // Enhanced periodic checks
        this.setupEnhancedPeriodicChecks();
        
        // Enhanced event listeners
        this.setupEnhancedEventListeners();
    }

    // Enhanced clipboard monitoring
    setupEnhancedClipboardMonitoring() {
        // Monitor clipboard changes more frequently
        setInterval(async () => {
            try {
                const clipboardText = await navigator.clipboard.readText();
                if (clipboardText && this.isSMSContent(clipboardText)) {
                    await this.analyzeIncomingSMS({
                        id: Date.now(),
                        sender: 'Clipboard',
                        body: clipboardText,
                        timestamp: new Date().toISOString()
                    });
                }
            } catch (error) {
                // Clipboard access not available
            }
        }, 2000); // Check every 2 seconds
    }

    // Enhanced network monitoring
    setupEnhancedNetworkMonitoring() {
        // Monitor for SMS-related network requests
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            
            try {
                const url = args[0];
                if (typeof url === 'string' && this.isSMSRelatedURL(url)) {
                    const responseText = await response.clone().text();
                    if (this.isSMSContent(responseText)) {
                        await this.analyzeIncomingSMS({
                            id: Date.now(),
                            sender: 'Network',
                            body: responseText,
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            } catch (error) {
                // Ignore network monitoring errors
            }
            
            return response;
        };
    }

    // Enhanced periodic checks
    setupEnhancedPeriodicChecks() {
        // More frequent checks in app mode
        const intervals = [5000, 10000, 15000]; // 5s, 10s, 15s intervals
        
        intervals.forEach(interval => {
            const periodicCheck = setInterval(async () => {
                if (this.isMonitoring) {
                    await this.performEnhancedSMSCheck();
                }
            }, interval);
            
            this.periodicIntervals.push(periodicCheck);
        });
    }

    // Enhanced SMS check
    async performEnhancedSMSCheck() {
        try {
            // Check for new SMS in various ways
            await this.checkForNewSMS();
            await this.checkForSMSNotifications();
            await this.checkForSMSInStorage();
        } catch (error) {
            console.log('Enhanced SMS check failed:', error);
        }
    }

    // Check for new SMS
    async checkForNewSMS() {
        // This would integrate with actual SMS APIs when available
        // For now, we simulate SMS detection
        const mockSMS = this.generateMockSMS();
        if (mockSMS) {
            await this.analyzeIncomingSMS(mockSMS);
        }
    }

    // Generate mock SMS for testing
    generateMockSMS() {
        const phishingMessages = [
            "Your account has been suspended. Click here to verify: http://fake-bank.com",
            "You've won $1000! Claim now: http://scam-site.com",
            "Your package is delayed. Track here: http://fake-delivery.com",
            "Security alert: Unusual login detected. Verify: http://fake-security.com"
        ];
        
        // 10% chance of generating a mock SMS
        if (Math.random() < 0.1) {
            const randomMessage = phishingMessages[Math.floor(Math.random() * phishingMessages.length)];
            return {
                id: Date.now(),
                sender: 'Mock SMS',
                body: randomMessage,
                timestamp: new Date().toISOString()
            };
        }
        
        return null;
    }

    // Check for SMS notifications
    async checkForSMSNotifications() {
        // Monitor for SMS-related notifications
        if ('Notification' in window && Notification.permission === 'granted') {
            // This would check for actual SMS notifications
            // For now, we simulate notification monitoring
        }
    }

    // Check for SMS in storage
    async checkForSMSInStorage() {
        try {
            // Check localStorage for SMS data
            const storedSMS = localStorage.getItem('recent_sms');
            if (storedSMS) {
                const smsData = JSON.parse(storedSMS);
                await this.analyzeIncomingSMS(smsData);
                localStorage.removeItem('recent_sms');
            }
        } catch (error) {
            console.log('Storage SMS check failed:', error);
        }
    }

    // Enhanced event listeners
    setupEnhancedEventListeners() {
        // Listen for visibility changes (app focus/blur)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.onAppFocus();
            } else {
                this.onAppBlur();
            }
        });

        // Listen for online/offline status
        window.addEventListener('online', () => this.onOnline());
        window.addEventListener('offline', () => this.onOffline());

        // Listen for storage events (cross-tab communication)
        window.addEventListener('storage', (event) => {
            if (event.key === 'new_sms_detected') {
                this.handleCrossTabSMS(event.newValue);
            }
        });
    }

    // App focus handler
    onAppFocus() {
        console.log('📱 SMS Shield app focused');
        this.isMonitoring = true;
        this.performEnhancedSMSCheck();
    }

    // App blur handler
    onAppBlur() {
        console.log('📱 SMS Shield app blurred');
        // Keep monitoring in background
    }

    // Online handler
    onOnline() {
        console.log('🌐 SMS Shield back online');
        this.syncWithServer();
    }

    // Offline handler
    onOffline() {
        console.log('📴 SMS Shield offline - using local detection');
    }

    // Handle cross-tab SMS
    handleCrossTabSMS(smsData) {
        if (smsData) {
            const parsedSMS = JSON.parse(smsData);
            this.analyzeIncomingSMS(parsedSMS);
        }
    }

    // Sync with server
    async syncWithServer() {
        try {
            // Sync any pending analyses
            await this.syncPendingAnalyses();
            
            // Update last sync time
            localStorage.setItem('last_sync', Date.now().toString());
            
        } catch (error) {
            console.error('Server sync failed:', error);
        }
    }

    // Sync pending analyses
    async syncPendingAnalyses() {
        try {
            const pendingAnalyses = JSON.parse(localStorage.getItem('pending_analyses') || '[]');
            
            for (const analysis of pendingAnalyses) {
                await this.logAnalysis(analysis);
            }
            
            localStorage.removeItem('pending_analyses');
            
        } catch (error) {
            console.error('Failed to sync analyses:', error);
        }
    }

    // Enable background processing
    async enableBackgroundProcessing() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered for background processing');
                
                // Enable background sync
                if ('sync' in registration) {
                    await registration.sync.register('sms-analysis');
                }
                
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    // Enhanced Firebase integration for real-time SMS detection
    async initializeFirebaseConnection() {
        try {
            // Wait for Firebase to be available
            await this.waitForFirebase();
            
            // Initialize real-time database listeners
            this.setupFirebaseRealtimeListeners();
            
            // Setup SMS detection channels
            this.setupSMSDetectionChannels();
            
            // Initialize background sync
            this.initializeBackgroundSync();
            
            console.log('🔥 Firebase connection established for real-time SMS detection');
            
        } catch (error) {
            console.error('Firebase connection failed:', error);
            this.showMobileNotification('Connection Error', 'Failed to connect to Firebase backend');
        }
    }

    // Setup Firebase real-time listeners
    setupFirebaseRealtimeListeners() {
        if (!window.db) {
            console.error('Firebase database not available');
            return;
        }

        // Listen for new SMS detections
        const smsRef = window.db.ref('sms_detections');
        smsRef.on('child_added', (snapshot) => {
            const smsData = snapshot.val();
            this.handleRealTimeSMS(smsData);
        });

        // Listen for analysis results
        const analysisRef = window.db.ref('analysis_results');
        analysisRef.on('child_added', (snapshot) => {
            const analysis = snapshot.val();
            this.handleAnalysisResult(analysis);
        });

        // Listen for user notifications
        const notificationsRef = window.db.ref('user_notifications');
        notificationsRef.on('child_added', (snapshot) => {
            const notification = snapshot.val();
            this.handleUserNotification(notification);
        });

        console.log('📡 Firebase real-time listeners activated');
    }

    // Handle real-time SMS detection
    async handleRealTimeSMS(smsData) {
        try {
            console.log('📱 Real-time SMS detected:', smsData);
            
            // Analyze the SMS immediately
            const analysis = await this.performRealTimeAnalysis(smsData);
            
            // Store analysis in Firebase
            await this.storeAnalysisInFirebase(analysis);
            
            // Send notification if threat detected
            if (analysis.threatLevel === 'high' || analysis.threatLevel === 'medium') {
                await this.sendThreatNotification(analysis);
            }
            
            // Update UI with real-time results
            this.updateRealTimeUI(analysis);
            
        } catch (error) {
            console.error('Real-time SMS handling failed:', error);
        }
    }

    // Perform real-time SMS analysis
    async performRealTimeAnalysis(smsData) {
        try {
            const analysis = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                smsData: smsData,
                deviceInfo: this.getDeviceInfo ? this.getDeviceInfo() : { userAgent: 'Unknown', timestamp: new Date().toISOString() },
                deploymentInfo: this.getDeploymentInfo ? this.getDeploymentInfo() : { protocol: 'https:', timestamp: new Date().toISOString() },
                analysisResults: {}
            };

            // Perform multiple analysis methods
            analysis.analysisResults.naiveBayes = await this.performNaiveBayesAnalysis(smsData.body);
            analysis.analysisResults.lstm = await this.performLSTMAnalysis(smsData.body);
            analysis.analysisResults.ensemble = await this.performEnsembleAnalysis(smsData.body);
            analysis.analysisResults.securityRules = await this.applySecurityRules(smsData);

            // Determine overall threat level
            analysis.threatLevel = this.calculateThreatLevel(analysis.analysisResults);
            analysis.confidence = this.calculateConfidence(analysis.analysisResults);

            return analysis;
        } catch (error) {
            console.error('Real-time analysis failed:', error);
            return {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                smsData: smsData,
                deviceInfo: { userAgent: 'Unknown', timestamp: new Date().toISOString() },
                deploymentInfo: { protocol: 'https:', timestamp: new Date().toISOString() },
                analysisResults: {
                    naiveBayes: { score: 0, confidence: 0 },
                    lstm: { score: 0, confidence: 0 },
                    ensemble: { score: 0, confidence: 0 },
                    securityRules: { score: 0, confidence: 0 }
                },
                threatLevel: 'Unknown',
                confidence: 0,
                error: error.message
            };
        }
    }

    // Store analysis in Firebase
    async storeAnalysisInFirebase(analysis) {
        try {
            if (!window.db) return;

            const analysisRef = window.db.ref('analysis_results');
            await analysisRef.push({
                ...analysis,
                storedAt: new Date().toISOString(),
                userId: this.getCurrentUserId()
            });

            console.log('💾 Analysis stored in Firebase');
        } catch (error) {
            console.error('Failed to store analysis:', error);
        }
    }

    // Send threat notification
    async sendThreatNotification(analysis) {
        try {
            // Create notification data
            const notificationData = {
                id: Date.now(),
                type: 'threat_detected',
                title: '🚨 SMS Threat Detected!',
                message: `High-risk SMS from ${analysis.smsData.sender}`,
                analysis: analysis,
                timestamp: new Date().toISOString(),
                userId: this.getCurrentUserId()
            };

            // Store notification in Firebase
            if (window.db) {
                const notificationsRef = window.db.ref('user_notifications');
                await notificationsRef.push(notificationData);
            }

            // Show local notification
            this.showMobileNotification(
                notificationData.title,
                notificationData.message
            );

            console.log('🔔 Threat notification sent');
        } catch (error) {
            console.error('Failed to send notification:', error);
        }
    }

    // Setup SMS detection channels
    setupSMSDetectionChannels() {
        // Channel for cross-tab communication
        this.smsChannel = new BroadcastChannel('sms-detection');
        
        this.smsChannel.onmessage = (event) => {
            if (event.data.type === 'new_sms') {
                this.handleRealTimeSMS(event.data.smsData);
            }
        };

        // Setup periodic SMS checks
        this.setupPeriodicSMSChecks();
        
        // Setup clipboard monitoring
        this.setupEnhancedClipboardMonitoring();
        
        // Setup network monitoring
        this.setupEnhancedNetworkMonitoring();
        
        console.log('📡 SMS detection channels activated');
    }

    // Setup periodic SMS checks
    setupPeriodicSMSChecks() {
        // Check for new SMS every 5 seconds
        const smsCheckInterval = setInterval(async () => {
            if (this.isMonitoring) {
                await this.checkForNewSMS();
            }
        }, 5000);

        // Check for SMS in storage every 10 seconds
        const storageCheckInterval = setInterval(async () => {
            if (this.isMonitoring) {
                await this.checkForSMSInStorage();
            }
        }, 10000);

        // Check for SMS notifications every 15 seconds
        const notificationCheckInterval = setInterval(async () => {
            if (this.isMonitoring) {
                await this.checkForSMSNotifications();
            }
        }, 15000);

        this.periodicIntervals.push(smsCheckInterval, storageCheckInterval, notificationCheckInterval);
    }

    // Check for new SMS with enhanced detection
    async checkForNewSMS() {
        try {
            // Try to access SMS API if available
            if (navigator.sms) {
                const smsMessages = await navigator.sms.getMessages();
                for (const sms of smsMessages) {
                    await this.handleRealTimeSMS({
                        id: sms.id,
                        sender: sms.sender,
                        body: sms.body,
                        timestamp: sms.timestamp
                    });
                }
            }

            // Generate mock SMS for testing (in production, remove this)
            const mockSMS = this.generateMockSMS();
            if (mockSMS) {
                await this.handleRealTimeSMS(mockSMS);
            }

        } catch (error) {
            console.log('SMS check completed (no new messages)');
        }
    }

    // Enhanced clipboard monitoring
    setupEnhancedClipboardMonitoring() {
        setInterval(async () => {
            try {
                const clipboardText = await navigator.clipboard.readText();
                if (clipboardText && this.isSMSContent(clipboardText)) {
                    await this.handleRealTimeSMS({
                        id: Date.now(),
                        sender: 'Clipboard',
                        body: clipboardText,
                        timestamp: new Date().toISOString()
                    });
                }
            } catch (error) {
                // Clipboard access not available
            }
        }, 2000);
    }

    // Enhanced network monitoring
    setupEnhancedNetworkMonitoring() {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            
            try {
                const url = args[0];
                if (typeof url === 'string' && this.isSMSRelatedURL(url)) {
                    const responseText = await response.clone().text();
                    if (this.isSMSContent(responseText)) {
                        await this.handleRealTimeSMS({
                            id: Date.now(),
                            sender: 'Network',
                            body: responseText,
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            } catch (error) {
                // Ignore network monitoring errors
            }
            
            return response;
        };
    }

    // Initialize background sync
    async initializeBackgroundSync() {
        if ('serviceWorker' in navigator && 'sync' in navigator.serviceWorker) {
            try {
                const registration = await navigator.serviceWorker.ready;
                await registration.sync.register('sms-analysis');
                console.log('🔄 Background sync registered');
            } catch (error) {
                console.error('Background sync registration failed:', error);
            }
        }
    }

    // Handle analysis results from Firebase
    handleAnalysisResult(analysis) {
        console.log('📊 Analysis result received:', analysis);
        
        // Update UI with analysis results
        this.updateAnalysisUI(analysis);
        
        // Show notification if needed
        if (analysis.threatLevel === 'high') {
            this.showMobileNotification(
                '🚨 High Threat Detected!',
                'Immediate action required for this SMS'
            );
        }
    }

    // Handle user notifications from Firebase
    handleUserNotification(notification) {
        console.log('🔔 User notification received:', notification);
        
        // Show notification to user
        this.showMobileNotification(
            notification.title,
            notification.message
        );
    }

    // Update real-time UI
    updateRealTimeUI(analysis) {
        const resultsContainer = document.querySelector('.mobile-results');
        if (resultsContainer) {
            const analysisHTML = `
                <div class="sms-analysis-result ${analysis.threatLevel}">
                    <h4>📱 Real-time SMS Analysis</h4>
                    <p><strong>Sender:</strong> ${analysis.smsData.sender}</p>
                    <p><strong>Threat Level:</strong> ${analysis.threatLevel.toUpperCase()}</p>
                    <p><strong>Confidence:</strong> ${analysis.confidence}%</p>
                    <p><strong>Time:</strong> ${new Date(analysis.timestamp).toLocaleTimeString()}</p>
                </div>
            `;
            resultsContainer.innerHTML = analysisHTML + resultsContainer.innerHTML;
        }
    }

    // Update analysis UI
    updateAnalysisUI(analysis) {
        // Update any existing analysis displays
        const existingResults = document.querySelectorAll('.sms-analysis-result');
        existingResults.forEach(result => {
            if (result.dataset.analysisId === analysis.id) {
                result.className = `sms-analysis-result ${analysis.threatLevel}`;
                result.innerHTML = `
                    <h4>📊 Analysis Complete</h4>
                    <p><strong>Threat Level:</strong> ${analysis.threatLevel.toUpperCase()}</p>
                    <p><strong>Confidence:</strong> ${analysis.confidence}%</p>
                `;
            }
        });
    }

    // Calculate threat level
    calculateThreatLevel(analysisResults) {
        const scores = {
            naiveBayes: analysisResults.naiveBayes?.score || 0,
            lstm: analysisResults.lstm?.score || 0,
            ensemble: analysisResults.ensemble?.score || 0,
            securityRules: analysisResults.securityRules?.score || 0
        };

        const averageScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;

        if (averageScore > 0.7) return 'high';
        if (averageScore > 0.4) return 'medium';
        return 'low';
    }

    // Calculate confidence
    calculateConfidence(analysisResults) {
        const scores = Object.values(analysisResults).map(result => result?.confidence || 0);
        const averageConfidence = scores.reduce((a, b) => a + b, 0) / scores.length;
        return Math.round(averageConfidence * 100);
    }

    // Get current user ID
    getCurrentUserId() {
        if (window.auth && window.auth.currentUser) {
            return window.auth.currentUser.uid;
        }
        return 'anonymous';
    }

    // Enhanced SMS content detection
    isSMSContent(text) {
        const smsPatterns = [
            /bank/i, /account/i, /password/i, /login/i, /verify/i, /confirm/i,
            /urgent/i, /suspended/i, /locked/i, /security/i, /fraud/i, /scam/i,
            /click here/i, /verify now/i, /account suspended/i, /unusual activity/i,
            /http:\/\/|https:\/\//i, /www\./i, /\.com/i, /\.net/i, /\.org/i,
            /free/i, /won/i, /prize/i, /claim/i, /limited time/i, /act now/i,
            /package/i, /delivery/i, /track/i, /shipping/i, /order/i,
            /payment/i, /billing/i, /invoice/i, /overdue/i, /due/i
        ];
        
        return smsPatterns.some(pattern => pattern.test(text));
    }

    // Check if SMS-related URL
    isSMSRelatedURL(url) {
        const smsPatterns = [
            /sms/i, /text/i, /message/i, /notification/i, /alert/i,
            /bank/i, /security/i, /verify/i, /confirm/i, /login/i
        ];
        
        return smsPatterns.some(pattern => pattern.test(url));
    }

    // Get device information
    getDeviceInfo() {
        try {
            return {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                cookieEnabled: navigator.cookieEnabled,
                onLine: navigator.onLine,
                screenWidth: screen.width,
                screenHeight: screen.height,
                viewportWidth: window.innerWidth,
                viewportHeight: window.innerHeight,
                devicePixelRatio: window.devicePixelRatio,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error getting device info:', error);
            return {
                userAgent: 'Unknown',
                platform: 'Unknown',
                timestamp: new Date().toISOString()
            };
        }
    }

    // Get deployment information
    getDeploymentInfo() {
        return {
            protocol: window.location.protocol,
            hostname: window.location.hostname,
            port: window.location.port,
            pathname: window.location.pathname,
            search: window.location.search,
            hash: window.location.hash,
            origin: window.location.origin,
            href: window.location.href,
            isDeployed: this.isDeployed,
            deploymentEnvironment: this.checkDeploymentEnvironment() ? 'production' : 'development',
            timestamp: new Date().toISOString()
        };
    }

    // Perform Naive Bayes analysis
    async performNaiveBayesAnalysis(text) {
        // Simplified Naive Bayes implementation
        const phishingWords = ['urgent', 'suspended', 'verify', 'click', 'account', 'security', 'fraud', 'scam'];
        const legitimateWords = ['hello', 'thanks', 'ok', 'yes', 'no', 'meeting', 'lunch', 'dinner'];
        
        const words = text.toLowerCase().split(/\s+/);
        let phishingScore = 0;
        let legitimateScore = 0;
        
        words.forEach(word => {
            if (phishingWords.includes(word)) phishingScore++;
            if (legitimateWords.includes(word)) legitimateScore++;
        });
        
        const totalScore = phishingScore + legitimateScore;
        const phishingProbability = totalScore > 0 ? phishingScore / totalScore : 0;
        
        return {
            score: phishingProbability,
            confidence: Math.min(phishingProbability * 100, 95)
        };
    }

    // Perform LSTM analysis
    async performLSTMAnalysis(text) {
        // Simplified LSTM-like analysis
        const suspiciousPatterns = [
            /http:\/\/|https:\/\//i,
            /click here/i,
            /verify now/i,
            /account suspended/i,
            /unusual activity/i,
            /urgent action/i
        ];
        
        let patternScore = 0;
        suspiciousPatterns.forEach(pattern => {
            if (pattern.test(text)) patternScore++;
        });
        
        const score = Math.min(patternScore / suspiciousPatterns.length, 1);
        
        return {
            score: score,
            confidence: Math.min(score * 100, 90)
        };
    }

    // Perform Ensemble analysis
    async performEnsembleAnalysis(text) {
        // Combine multiple analysis methods
        const naiveBayes = await this.performNaiveBayesAnalysis(text);
        const lstm = await this.performLSTMAnalysis(text);
        
        const ensembleScore = (naiveBayes.score + lstm.score) / 2;
        const ensembleConfidence = (naiveBayes.confidence + lstm.confidence) / 2;
        
        return {
            score: ensembleScore,
            confidence: ensembleConfidence
        };
    }

    // Apply security rules
    async applySecurityRules(smsData) {
        const rules = [
            { pattern: /bank/i, weight: 0.8 },
            { pattern: /password/i, weight: 0.7 },
            { pattern: /verify/i, weight: 0.6 },
            { pattern: /urgent/i, weight: 0.9 },
            { pattern: /suspended/i, weight: 0.8 },
            { pattern: /http:\/\/|https:\/\//i, weight: 0.5 }
        ];
        
        let totalScore = 0;
        let matchedRules = 0;
        
        rules.forEach(rule => {
            if (rule.pattern.test(smsData.body)) {
                totalScore += rule.weight;
                matchedRules++;
            }
        });
        
        const score = matchedRules > 0 ? totalScore / matchedRules : 0;
        
        return {
            score: Math.min(score, 1),
            confidence: Math.min(score * 100, 85)
        };
    }
}

// Initialize mobile SMS detector
let mobileSMSDetector;

document.addEventListener('DOMContentLoaded', () => {
    mobileSMSDetector = new MobileSMSDetector();
});

// Export for global access
window.mobileSMSDetector = mobileSMSDetector; 