// ===== ADVANCED SMS NOTIFICATIONS =====
// Advanced notification system with detailed SMS detection results

class AdvancedSMSNotifications {
    constructor() {
        this.notifications = [];
        this.isMonitoring = false;
        this.monitoringInterval = null;
        this.init();
    }

    init() {
        console.log('🔔 Initializing Advanced SMS Notifications...');
        this.requestPermissions();
        this.setupNotificationCenter();
        this.startSimulatedMonitoring();
    }

    async requestPermissions() {
        try {
            // Request notification permission
            if ('Notification' in window && Notification.permission === 'default') {
                const permission = await Notification.requestPermission();
                console.log('🔔 Notification permission:', permission);
            }

            // Request other permissions
            if ('permissions' in navigator) {
                try {
                    const notificationPermission = await navigator.permissions.query({ name: 'notifications' });
                    console.log('🔔 Notification permission status:', notificationPermission.state);
                } catch (error) {
                    console.log('⚠️ Permission query not supported');
                }
            }
        } catch (error) {
            console.error('❌ Permission request failed:', error);
        }
    }

    setupNotificationCenter() {
        // Create notification center if it doesn't exist
        if (!document.getElementById('advanced-notification-center')) {
            const notificationCenter = document.createElement('div');
            notificationCenter.id = 'advanced-notification-center';
            notificationCenter.className = 'advanced-notification-center';
            notificationCenter.innerHTML = `
                <div class="notification-header">
                    <h3>🔔 SMS Detection Alerts</h3>
                    <button onclick="window.advancedSMSNotifications.closeNotificationCenter()" class="close-btn">×</button>
                </div>
                <div class="notification-list" id="advanced-notification-list">
                    <div class="no-notifications">No notifications yet</div>
                </div>
                <div class="notification-actions">
                    <button onclick="window.advancedSMSNotifications.clearAllNotifications()" class="clear-btn">Clear All</button>
                    <button onclick="window.advancedSMSNotifications.toggleMonitoring()" class="monitor-btn" id="monitor-toggle-btn">
                        🛡️ Start Monitoring
                    </button>
                </div>
            `;
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .advanced-notification-center {
                    position: fixed;
                    top: 0;
                    right: -450px;
                    width: 450px;
                    height: 100vh;
                    background: white;
                    box-shadow: -5px 0 15px rgba(0,0,0,0.1);
                    z-index: 10000;
                    transition: right 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }
                
                .advanced-notification-center.open {
                    right: 0;
                }
                
                .notification-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border-bottom: 1px solid #eee;
                }
                
                .notification-header h3 {
                    margin: 0;
                    font-size: 1.2rem;
                }
                
                .close-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .notification-list {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1rem;
                }
                
                .advanced-notification-item {
                    background: #f8f9fa;
                    border-radius: 10px;
                    padding: 1rem;
                    margin-bottom: 1rem;
                    border-left: 4px solid #ddd;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .advanced-notification-item:hover {
                    transform: translateX(5px);
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                
                .advanced-notification-item.high-risk {
                    border-left-color: #dc3545;
                    background: rgba(220, 53, 69, 0.1);
                }
                
                .advanced-notification-item.medium-risk {
                    border-left-color: #ffc107;
                    background: rgba(255, 193, 7, 0.1);
                }
                
                .advanced-notification-item.low-risk {
                    border-left-color: #28a745;
                    background: rgba(40, 167, 69, 0.1);
                }
                
                .notification-sender {
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 0.5rem;
                }
                
                .notification-message {
                    color: #666;
                    margin-bottom: 0.5rem;
                    word-wrap: break-word;
                }
                
                .notification-analysis {
                    display: flex;
                    gap: 1rem;
                    font-size: 0.8rem;
                    margin-bottom: 0.5rem;
                }
                
                .risk-level {
                    font-weight: bold;
                }
                
                .risk-level.high {
                    color: #dc3545;
                }
                
                .risk-level.medium {
                    color: #ffc107;
                }
                
                .risk-level.low {
                    color: #28a745;
                }
                
                .confidence {
                    color: #666;
                }
                
                .notification-time {
                    font-size: 0.7rem;
                    color: #999;
                }
                
                .notification-actions {
                    padding: 1rem;
                    border-top: 1px solid #eee;
                    display: flex;
                    gap: 0.5rem;
                }
                
                .clear-btn, .monitor-btn {
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .clear-btn {
                    background: #f8f9fa;
                    color: #666;
                    border: 1px solid #ddd;
                }
                
                .monitor-btn {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                }
                
                .monitor-btn.active {
                    background: linear-gradient(135deg, #28a745, #20c997);
                }
                
                .no-notifications {
                    text-align: center;
                    color: #999;
                    padding: 2rem;
                }
            `;
            
            document.head.appendChild(style);
            document.body.appendChild(notificationCenter);
        }
    }

    openNotificationCenter() {
        const center = document.getElementById('advanced-notification-center');
        if (center) {
            center.classList.add('open');
            this.updateNotificationList();
        }
    }

    closeNotificationCenter() {
        const center = document.getElementById('advanced-notification-center');
        if (center) {
            center.classList.remove('open');
        }
    }

    toggleMonitoring() {
        if (this.isMonitoring) {
            this.stopMonitoring();
        } else {
            this.startMonitoring();
        }
    }

    startMonitoring() {
        this.isMonitoring = true;
        console.log('🛡️ Starting SMS monitoring...');
        
        // Update button
        const monitorBtn = document.getElementById('monitor-toggle-btn');
        if (monitorBtn) {
            monitorBtn.textContent = '🛡️ Stop Monitoring';
            monitorBtn.classList.add('active');
        }
        
        // Start monitoring interval
        this.monitoringInterval = setInterval(() => {
            this.simulateSMSDetection();
        }, 10000); // Check every 10 seconds
        
        this.showNotification('🛡️ SMS monitoring started', 'Monitoring active - you will receive alerts for suspicious messages', 'info');
    }

    stopMonitoring() {
        this.isMonitoring = false;
        console.log('🛡️ Stopping SMS monitoring...');
        
        // Update button
        const monitorBtn = document.getElementById('monitor-toggle-btn');
        if (monitorBtn) {
            monitorBtn.textContent = '🛡️ Start Monitoring';
            monitorBtn.classList.remove('active');
        }
        
        // Clear interval
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        
        this.showNotification('🛡️ SMS monitoring stopped', 'Monitoring disabled - no new alerts will be generated', 'info');
    }

    startSimulatedMonitoring() {
        // Start monitoring automatically after 5 seconds
        setTimeout(() => {
            this.startMonitoring();
        }, 5000);
    }

    async simulateSMSDetection() {
        if (!this.isMonitoring) return;

        // Simulate different types of SMS messages
        const sampleMessages = [
            {
                sender: '+1234567890',
                message: 'URGENT: Your bank account has been suspended. Click here to verify: http://fake-bank.com',
                riskLevel: 'high',
                confidence: 0.95,
                threatType: 'Financial Fraud',
                suspiciousKeywords: ['urgent', 'bank', 'suspended', 'click', 'verify']
            },
            {
                sender: 'Amazon',
                message: 'Your package has been delivered. Track here: https://amazon.com/track',
                riskLevel: 'low',
                confidence: 0.15,
                threatType: 'Legitimate',
                suspiciousKeywords: []
            },
            {
                sender: '+9876543210',
                message: 'Congratulations! You have won $1,000,000! Claim your prize now: http://fake-prize.com',
                riskLevel: 'high',
                confidence: 0.98,
                threatType: 'Prize Scam',
                suspiciousKeywords: ['congratulations', 'won', 'prize', 'claim']
            },
            {
                sender: 'Netflix',
                message: 'Your account has been locked due to suspicious activity. Reset password: http://fake-netflix.com',
                riskLevel: 'medium',
                confidence: 0.75,
                threatType: 'Account Impersonation',
                suspiciousKeywords: ['locked', 'suspicious', 'reset', 'password']
            },
            {
                sender: 'FedEx',
                message: 'Your package delivery is pending. Schedule delivery: https://fedex.com/schedule',
                riskLevel: 'low',
                confidence: 0.20,
                threatType: 'Legitimate',
                suspiciousKeywords: []
            }
        ];

        // Randomly select a message
        const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
        
        // Simulate SMS detection
        await this.handleSMSDetection(randomMessage);
    }

    async handleSMSDetection(smsData) {
        console.log('📱 SMS detected:', smsData);
        
        // Create notification object
        const notification = {
            id: Date.now(),
            timestamp: new Date(),
            sender: smsData.sender,
            message: smsData.message,
            riskLevel: smsData.riskLevel,
            confidence: smsData.confidence,
            threatType: smsData.threatType,
            suspiciousKeywords: smsData.suspiciousKeywords,
            isRead: false
        };
        
        // Add to notifications list
        this.notifications.unshift(notification);
        
        // Show push notification
        await this.showPushNotification(notification);
        
        // Update notification center
        this.updateNotificationList();
        
        // Update notification count
        this.updateNotificationCount();
    }

    async showPushNotification(notification) {
        try {
            if ('Notification' in window && Notification.permission === 'granted') {
                const title = this.getNotificationTitle(notification);
                const body = this.getNotificationBody(notification);
                const icon = this.getNotificationIcon(notification);
                
                const pushNotification = new Notification(title, {
                    body: body,
                    icon: icon,
                    badge: '/favicon.svg',
                    tag: 'sms-detection',
                    requireInteraction: notification.riskLevel === 'high',
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
                });
                
                // Handle notification click
                pushNotification.onclick = () => {
                    this.openNotificationCenter();
                    this.markAsRead(notification.id);
                };
                
                // Auto-close after 10 seconds (except for high-risk)
                if (notification.riskLevel !== 'high') {
                    setTimeout(() => {
                        pushNotification.close();
                    }, 10000);
                }
                
                console.log('🔔 Push notification sent:', title);
            }
        } catch (error) {
            console.error('❌ Push notification failed:', error);
        }
    }

    getNotificationTitle(notification) {
        const riskEmoji = {
            high: '🚨',
            medium: '⚠️',
            low: '✅'
        };
        
        return `${riskEmoji[notification.riskLevel]} SMS Alert: ${notification.threatType}`;
    }

    getNotificationBody(notification) {
        const riskText = {
            high: 'HIGH RISK',
            medium: 'MEDIUM RISK',
            low: 'LOW RISK'
        };
        
        return `${riskText[notification.riskLevel]} - ${notification.message.substring(0, 100)}${notification.message.length > 100 ? '...' : ''}`;
    }

    getNotificationIcon(notification) {
        const riskIcon = {
            high: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23dc3545"><path d="M12 2L1 21h22L12 2zm0 3.17L19.83 19H4.17L12 5.17zM11 16h2v2h-2zm0-6h2v4h-2z"/></svg>',
            medium: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffc107"><path d="M12 2L1 21h22L12 2zm0 3.17L19.83 19H4.17L12 5.17zM11 16h2v2h-2zm0-6h2v4h-2z"/></svg>',
            low: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2328a745"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>'
        };
        
        return riskIcon[notification.riskLevel];
    }

    updateNotificationList() {
        const list = document.getElementById('advanced-notification-list');
        if (!list) return;
        
        if (this.notifications.length === 0) {
            list.innerHTML = '<div class="no-notifications">No notifications yet</div>';
            return;
        }
        
        list.innerHTML = this.notifications.map(notification => `
            <div class="advanced-notification-item ${notification.riskLevel}-risk" onclick="window.advancedSMSNotifications.markAsRead(${notification.id})">
                <div class="notification-sender">${notification.sender}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-analysis">
                    <span class="risk-level ${notification.riskLevel}">${notification.riskLevel.toUpperCase()} RISK</span>
                    <span class="confidence">Confidence: ${Math.round(notification.confidence * 100)}%</span>
                </div>
                <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
            </div>
        `).join('');
    }

    updateNotificationCount() {
        const unreadCount = this.notifications.filter(n => !n.isRead).length;
        const countElement = document.getElementById('notification-count');
        if (countElement) {
            countElement.textContent = unreadCount;
            countElement.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.isRead = true;
            this.updateNotificationCount();
        }
    }

    clearAllNotifications() {
        this.notifications = [];
        this.updateNotificationList();
        this.updateNotificationCount();
    }

    formatTime(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }

    showNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `advanced-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span class="notification-text">${title}: ${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize advanced SMS notifications
window.advancedSMSNotifications = new AdvancedSMSNotifications();

console.log('✅ Advanced SMS Notifications loaded'); 