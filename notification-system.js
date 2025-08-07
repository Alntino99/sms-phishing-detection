// Notification System for SMS Shield
// Provides user feedback and alerts across the application

(function() {
    'use strict';
    
    console.log('🔔 Loading Notification System...');
    
    class NotificationSystem {
        constructor() {
            this.notifications = [];
            this.maxNotifications = 5;
            this.notificationDuration = 5000; // 5 seconds
            this.init();
        }
        
        init() {
            this.createNotificationContainer();
            this.setupNotificationStyles();
            this.bindEvents();
            console.log('✅ Notification System initialized');
        }
        
        createNotificationContainer() {
            // Create notification container if it doesn't exist
            if (!document.getElementById('notification-container')) {
                const container = document.createElement('div');
                container.id = 'notification-container';
                container.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    max-width: 400px;
                    pointer-events: none;
                `;
                document.body.appendChild(container);
            }
        }
        
        setupNotificationStyles() {
            // Add notification styles to head if not already present
            if (!document.getElementById('notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    .notification {
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        border-radius: 12px;
                        padding: 16px 20px;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                        margin-bottom: 10px;
                        transform: translateX(100%);
                        opacity: 0;
                        transition: all 0.3s ease;
                        pointer-events: auto;
                        max-width: 400px;
                        word-wrap: break-word;
                    }
                    
                    .notification.show {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    
                    .notification.hide {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    
                    .notification.success {
                        border-left: 4px solid #10b981;
                        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%);
                    }
                    
                    .notification.error {
                        border-left: 4px solid #ef4444;
                        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%);
                    }
                    
                    .notification.warning {
                        border-left: 4px solid #f59e0b;
                        background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%);
                    }
                    
                    .notification.info {
                        border-left: 4px solid #3b82f6;
                        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%);
                    }
                    
                    .notification-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 8px;
                    }
                    
                    .notification-title {
                        font-weight: 600;
                        font-size: 14px;
                        color: #1f2937;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    
                    .notification-close {
                        background: none;
                        border: none;
                        color: #6b7280;
                        cursor: pointer;
                        font-size: 18px;
                        padding: 0;
                        width: 20px;
                        height: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        transition: all 0.2s ease;
                    }
                    
                    .notification-close:hover {
                        background: rgba(0, 0, 0, 0.1);
                        color: #374151;
                    }
                    
                    .notification-message {
                        font-size: 13px;
                        color: #4b5563;
                        line-height: 1.4;
                    }
                    
                    .notification-progress {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        height: 3px;
                        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
                        border-radius: 0 0 12px 12px;
                        transition: width linear;
                    }
                    
                    @media (max-width: 768px) {
                        #notification-container {
                            right: 10px;
                            left: 10px;
                            max-width: none;
                        }
                        
                        .notification {
                            max-width: none;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        bindEvents() {
            // Bind to window for global access
            window.showNotification = this.show.bind(this);
            window.showSuccess = this.success.bind(this);
            window.showError = this.error.bind(this);
            window.showWarning = this.warning.bind(this);
            window.showInfo = this.info.bind(this);
        }
        
        show(message, type = 'info', title = null, duration = null) {
            const notification = this.createNotification(message, type, title);
            this.addNotification(notification);
            
            const autoHideDuration = duration || this.notificationDuration;
            if (autoHideDuration > 0) {
                this.autoHide(notification, autoHideDuration);
            }
            
            return notification;
        }
        
        success(message, title = 'Success') {
            return this.show(message, 'success', title);
        }
        
        error(message, title = 'Error') {
            return this.show(message, 'error', title);
        }
        
        warning(message, title = 'Warning') {
            return this.show(message, 'warning', title);
        }
        
        info(message, title = 'Info') {
            return this.show(message, 'info', title);
        }
        
        createNotification(message, type, title) {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            
            const icon = this.getIcon(type);
            const defaultTitle = this.getDefaultTitle(type);
            const displayTitle = title || defaultTitle;
            
            notification.innerHTML = `
                <div class="notification-header">
                    <div class="notification-title">
                        <span>${icon}</span>
                        ${displayTitle}
                    </div>
                    <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="notification-message">${message}</div>
                <div class="notification-progress"></div>
            `;
            
            return notification;
        }
        
        getIcon(type) {
            const icons = {
                success: '✅',
                error: '❌',
                warning: '⚠️',
                info: 'ℹ️'
            };
            return icons[type] || icons.info;
        }
        
        getDefaultTitle(type) {
            const titles = {
                success: 'Success',
                error: 'Error',
                warning: 'Warning',
                info: 'Information'
            };
            return titles[type] || 'Information';
        }
        
        addNotification(notification) {
            const container = document.getElementById('notification-container');
            
            // Add to beginning of container
            container.insertBefore(notification, container.firstChild);
            
            // Limit number of notifications
            while (container.children.length > this.maxNotifications) {
                container.removeChild(container.lastChild);
            }
            
            // Trigger animation
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            this.notifications.push(notification);
        }
        
        autoHide(notification, duration) {
            const progress = notification.querySelector('.notification-progress');
            const startTime = Date.now();
            
            const updateProgress = () => {
                const elapsed = Date.now() - startTime;
                const progressPercent = Math.max(0, 100 - (elapsed / duration) * 100);
                
                if (progress) {
                    progress.style.width = `${progressPercent}%`;
                }
                
                if (elapsed >= duration) {
                    this.hide(notification);
                } else {
                    requestAnimationFrame(updateProgress);
                }
            };
            
            updateProgress();
        }
        
        hide(notification) {
            notification.classList.add('hide');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
        
        // Specialized notification methods
        showSMSAnalysisResult(result) {
            if (result.isPhishing) {
                this.warning(
                    `Phishing detected! Score: ${result.score}/100. ${result.recommendations.join(' ')}`,
                    '🚨 Phishing Alert'
                );
            } else {
                this.success(
                    `Message appears safe. Score: ${result.score}/100`,
                    '✅ Safe Message'
                );
            }
        }
        
        showFirebaseStatus(status, message) {
            if (status === 'success') {
                this.success(message, '🔥 Firebase Connected');
            } else if (status === 'error') {
                this.error(message, '🔥 Firebase Error');
            } else {
                this.info(message, '🔥 Firebase Status');
            }
        }
        
        showAIAnalysisStatus(status, message) {
            if (status === 'success') {
                this.success(message, '🤖 AI Analysis Complete');
            } else if (status === 'error') {
                this.error(message, '🤖 AI Analysis Error');
            } else {
                this.info(message, '🤖 AI Analysis');
            }
        }
        
        showCacheStatus(status, message) {
            if (status === 'success') {
                this.success(message, '🔄 Cache Cleared');
            } else if (status === 'error') {
                this.error(message, '🔄 Cache Error');
            } else {
                this.info(message, '🔄 Cache Status');
            }
        }
        
        showMobileStatus(status, message) {
            if (status === 'success') {
                this.success(message, '📱 Mobile Connected');
            } else if (status === 'error') {
                this.error(message, '📱 Mobile Error');
            } else {
                this.info(message, '📱 Mobile Status');
            }
        }
    }
    
    // Initialize notification system
    const notificationSystem = new NotificationSystem();
    
    // Make it globally available
    window.notificationSystem = notificationSystem;
    
    console.log('✅ Notification System loaded successfully');
    
})();
