// ===== REAL-TIME SMS MONITORING SYSTEM =====
// Monitors SMS messages in real-time and sends push notifications

class RealTimeSMSMonitor {
    constructor() {
        this.isMonitoring = false;
        this.notifications = [];
        this.smsHistory = [];
        this.permissionStatus = {
            sms: false,
            notifications: false,
            background: false
        };
        this.analysisQueue = [];
        this.notificationCenter = null;
        this.serviceWorker = null;
        
        this.init();
    }

    async init() {
        console.log('📱 Initializing Real-Time SMS Monitor...');
        
        // Check permissions
        await this.checkPermissions();
        
        // Initialize notification center
        this.initNotificationCenter();
        
        // Register service worker for background processing
        await this.registerServiceWorker();
        
        // Start monitoring if permissions are granted
        if (this.permissionStatus.sms && this.permissionStatus.notifications) {
            this.startMonitoring();
        }
    }

    async checkPermissions() {
        console.log('🔐 Checking permissions...');
        
        // Check SMS permission
        if ('sms' in navigator) {
            try {
                const smsPermission = await navigator.permissions.query({ name: 'sms' });
                this.permissionStatus.sms = smsPermission.state === 'granted';
                console.log('📱 SMS Permission:', smsPermission.state);
            } catch (error) {
                console.log('📱 SMS API not available, using fallback');
            }
        }

        // Check notification permission
        if ('Notification' in window) {
            this.permissionStatus.notifications = Notification.permission === 'granted';
            console.log('🔔 Notification Permission:', Notification.permission);
        }

        // Check background sync
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            this.permissionStatus.background = true;
            console.log('🔄 Background sync available');
        }
    }

    async requestPermissions() {
        console.log('🔐 Requesting permissions...');
        
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            this.permissionStatus.notifications = permission === 'granted';
            console.log('🔔 Notification permission:', permission);
        }

        // Request SMS permission (if available)
        if ('sms' in navigator) {
            try {
                const smsPermission = await navigator.permissions.query({ name: 'sms' });
                if (smsPermission.state === 'prompt') {
                    // Trigger SMS permission request
                    await this.requestSMSPermission();
                }
            } catch (error) {
                console.log('📱 SMS permission request failed:', error);
            }
        }

        // Start monitoring if permissions granted
        if (this.permissionStatus.notifications) {
            this.startMonitoring();
        }
    }

    async requestSMSPermission() {
        // This is a fallback for browsers that don't support SMS API
        console.log('📱 Requesting SMS access...');
        
        // Show user instructions for manual SMS access
        this.showSMSPermissionInstructions();
    }

    showSMSPermissionInstructions() {
        const instructions = `
            📱 To enable SMS monitoring:
            
            1. Install the app on your home screen
            2. Open the app and grant SMS permissions
            3. Allow background app refresh
            4. Enable notifications for the app
            
            For Android:
            - Go to Settings > Apps > SMS Shield > Permissions
            - Enable SMS and Notifications
            
            For iOS:
            - Go to Settings > SMS Shield
            - Enable SMS and Notifications
        `;
        
        this.showNotification('📱 SMS Permission Required', instructions, 'info');
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                this.serviceWorker = await navigator.serviceWorker.register('/sw-sms-monitor.js');
                console.log('✅ SMS Monitor Service Worker registered');
                
                // Listen for messages from service worker
                navigator.serviceWorker.addEventListener('message', (event) => {
                    this.handleServiceWorkerMessage(event.data);
                });
                
            } catch (error) {
                console.error('❌ Service Worker registration failed:', error);
            }
        }
    }

    handleServiceWorkerMessage(data) {
        switch (data.type) {
            case 'SMS_RECEIVED':
                this.handleIncomingSMS(data.sms);
                break;
            case 'ANALYSIS_COMPLETE':
                this.handleAnalysisResult(data.result);
                break;
            case 'PERMISSION_UPDATE':
                this.permissionStatus = { ...this.permissionStatus, ...data.permissions };
                break;
        }
    }

    startMonitoring() {
        if (this.isMonitoring) return;
        
        console.log('🚀 Starting real-time SMS monitoring...');
        this.isMonitoring = true;
        
        // Start background monitoring
        this.startBackgroundMonitoring();
        
        // Set up periodic checks
        this.setupPeriodicChecks();
        
        // Show monitoring status
        this.showNotification('🛡️ SMS Monitoring Active', 'Real-time SMS monitoring is now active. You will receive notifications for suspicious messages.', 'success');
        
        // Update UI
        this.updateMonitoringStatus(true);
    }

    stopMonitoring() {
        console.log('⏹️ Stopping SMS monitoring...');
        this.isMonitoring = false;
        
        // Clear intervals
        if (this.periodicCheckInterval) {
            clearInterval(this.periodicCheckInterval);
        }
        
        // Update UI
        this.updateMonitoringStatus(false);
        
        this.showNotification('⏹️ Monitoring Stopped', 'SMS monitoring has been stopped.', 'info');
    }

    startBackgroundMonitoring() {
        // Set up background sync for periodic SMS checks
        if (this.serviceWorker && this.permissionStatus.background) {
            this.serviceWorker.sync.register('sms-check').then(() => {
                console.log('🔄 Background sync registered for SMS monitoring');
            });
        }
    }

    setupPeriodicChecks() {
        // Check for new SMS every 30 seconds
        this.periodicCheckInterval = setInterval(() => {
            this.checkForNewSMS();
        }, 30000);
        
        // Also check immediately
        this.checkForNewSMS();
    }

    async checkForNewSMS() {
        if (!this.isMonitoring) return;
        
        try {
            // This would integrate with the device's SMS API
            // For now, we'll simulate SMS detection
            await this.simulateSMSDetection();
        } catch (error) {
            console.error('❌ SMS check failed:', error);
        }
    }

    async simulateSMSDetection() {
        // Simulate incoming SMS for testing
        const testSMS = [
            "URGENT: Your bank account has been suspended. Click here to verify: http://fake-bank.com",
            "Congratulations! You've won $1,000,000. Claim now: http://fake-prize.com",
            "Your package has been delivered. Track here: http://legitimate-delivery.com",
            "Security alert: Unusual login detected. Verify here: http://fake-security.com"
        ];
        
        const randomSMS = testSMS[Math.floor(Math.random() * testSMS.length)];
        
        // Simulate SMS reception
        setTimeout(() => {
            this.handleIncomingSMS({
                id: Date.now(),
                sender: '+1234567890',
                message: randomSMS,
                timestamp: new Date().toISOString()
            });
        }, Math.random() * 10000); // Random delay for testing
    }

    async handleIncomingSMS(sms) {
        console.log('📱 New SMS received:', sms);
        
        // Add to history
        this.smsHistory.push(sms);
        
        // Analyze the SMS
        const analysis = await this.analyzeSMS(sms.message);
        
        // Create notification
        const notification = {
            id: Date.now(),
            type: 'sms_analysis',
            title: analysis.isPhishing ? '🚨 Phishing SMS Detected!' : '✅ Safe SMS',
            message: sms.message,
            sender: sms.sender,
            timestamp: new Date().toISOString(),
            analysis: analysis,
            isRead: false
        };
        
        // Add to notifications
        this.notifications.unshift(notification);
        
        // Send push notification
        await this.sendPushNotification(notification);
        
        // Update notification center
        this.updateNotificationCenter();
        
        // Store in localStorage
        this.saveNotifications();
    }

    async analyzeSMS(message) {
        try {
            // Use the existing ML analysis
            if (typeof window.analyzeSMS === 'function') {
                return await window.analyzeSMS(message);
            } else {
                // Fallback analysis
                return this.fallbackAnalysis(message);
            }
        } catch (error) {
            console.error('❌ SMS analysis failed:', error);
            return this.fallbackAnalysis(message);
        }
    }

    fallbackAnalysis(message) {
        const suspiciousKeywords = ['urgent', 'bank', 'password', 'click', 'verify', 'suspended', 'locked', 'prize', 'won', 'claim'];
        const foundKeywords = suspiciousKeywords.filter(keyword => 
            message.toLowerCase().includes(keyword)
        );
        
        const isPhishing = foundKeywords.length > 0;
        const confidence = Math.min(0.9, foundKeywords.length * 0.2);
        
        return {
            isPhishing: isPhishing,
            confidence: confidence,
            riskLevel: isPhishing ? 'High' : 'Low',
            keywords: foundKeywords
        };
    }

    async sendPushNotification(notification) {
        if (!this.permissionStatus.notifications) {
            console.log('🔔 Notifications not permitted');
            return;
        }

        try {
            // Create notification options
            const options = {
                body: notification.message,
                icon: '/favicon.svg',
                badge: '/favicon.svg',
                tag: 'sms-analysis',
                data: {
                    notificationId: notification.id,
                    analysis: notification.analysis
                },
                actions: [
                    {
                        action: 'view',
                        title: 'View Details'
                    },
                    {
                        action: 'dismiss',
                        title: 'Dismiss'
                    }
                ]
            };

            // Send notification
            const pushNotification = new Notification(notification.title, options);
            
            // Handle notification clicks
            pushNotification.onclick = (event) => {
                event.preventDefault();
                this.handleNotificationClick(notification);
            };

            console.log('🔔 Push notification sent:', notification.title);
            
        } catch (error) {
            console.error('❌ Push notification failed:', error);
        }
    }

    handleNotificationClick(notification) {
        // Open the notification center
        this.openNotificationCenter();
        
        // Mark as read
        notification.isRead = true;
        this.updateNotificationCenter();
    }

    initNotificationCenter() {
        // Create notification center element
        this.notificationCenter = document.createElement('div');
        this.notificationCenter.id = 'notification-center';
        this.notificationCenter.className = 'notification-center';
        this.notificationCenter.style.cssText = `
            position: fixed;
            top: 0;
            right: -400px;
            width: 400px;
            height: 100vh;
            background: white;
            box-shadow: -5px 0 15px rgba(0,0,0,0.1);
            z-index: 10000;
            transition: right 0.3s ease;
            overflow-y: auto;
            padding: 20px;
        `;
        
        // Add notification center content
        this.notificationCenter.innerHTML = `
            <div class="notification-header">
                <h3>🔔 Notifications</h3>
                <button onclick="window.smsMonitor.closeNotificationCenter()" style="background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
            </div>
            <div class="notification-list" id="notification-list">
                <p style="text-align: center; color: #666; margin-top: 50px;">No notifications yet</p>
            </div>
        `;
        
        document.body.appendChild(this.notificationCenter);
    }

    updateNotificationCenter() {
        if (!this.notificationCenter) return;
        
        const notificationList = document.getElementById('notification-list');
        if (!notificationList) return;
        
        if (this.notifications.length === 0) {
            notificationList.innerHTML = '<p style="text-align: center; color: #666; margin-top: 50px;">No notifications yet</p>';
            return;
        }
        
        notificationList.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.isRead ? 'read' : 'unread'}" onclick="window.smsMonitor.markAsRead(${notification.id})">
                <div class="notification-header">
                    <span class="notification-title">${notification.title}</span>
                    <span class="notification-time">${this.formatTime(notification.timestamp)}</span>
                </div>
                <div class="notification-sender">From: ${notification.sender}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-analysis">
                    <span class="risk-level ${notification.analysis.isPhishing ? 'high' : 'low'}">
                        Risk: ${notification.analysis.riskLevel}
                    </span>
                    <span class="confidence">
                        Confidence: ${Math.round(notification.analysis.confidence * 100)}%
                    </span>
                </div>
            </div>
        `).join('');
    }

    openNotificationCenter() {
        if (this.notificationCenter) {
            this.notificationCenter.style.right = '0';
        }
    }

    closeNotificationCenter() {
        if (this.notificationCenter) {
            this.notificationCenter.style.right = '-400px';
        }
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.isRead = true;
            this.updateNotificationCenter();
            this.saveNotifications();
        }
    }

    updateMonitoringStatus(isActive) {
        // Update UI elements to show monitoring status
        const statusElements = document.querySelectorAll('.monitoring-status');
        statusElements.forEach(element => {
            element.textContent = isActive ? '🛡️ Monitoring Active' : '⏹️ Monitoring Stopped';
            element.className = `monitoring-status ${isActive ? 'active' : 'inactive'}`;
        });
    }

    showNotification(title, message, type = 'info') {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10001;
            max-width: 300px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
        `;
        
        // Set background based on type
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(135deg, #ffc107, #fd7e14)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        }
        
        notification.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">${title}</div>
            <div style="font-size: 0.9em; opacity: 0.9;">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString();
    }

    saveNotifications() {
        try {
            localStorage.setItem('smsNotifications', JSON.stringify(this.notifications));
        } catch (error) {
            console.error('❌ Failed to save notifications:', error);
        }
    }

    loadNotifications() {
        try {
            const saved = localStorage.getItem('smsNotifications');
            if (saved) {
                this.notifications = JSON.parse(saved);
            }
        } catch (error) {
            console.error('❌ Failed to load notifications:', error);
        }
    }

    // Public methods for UI integration
    startMonitoringFromUI() {
        if (!this.permissionStatus.notifications) {
            this.requestPermissions();
        } else {
            this.startMonitoring();
        }
    }

    stopMonitoringFromUI() {
        this.stopMonitoring();
    }

    getNotificationCount() {
        return this.notifications.filter(n => !n.isRead).length;
    }

    getNotifications() {
        return this.notifications;
    }
}

// Initialize the SMS monitor
window.smsMonitor = new RealTimeSMSMonitor();

console.log('✅ Real-time SMS monitoring system loaded'); 