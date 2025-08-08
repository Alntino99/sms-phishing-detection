// Notification Panel System
// Manages the notification bell and panel in the navigation bar

(function() {
    'use strict';
    
    console.log('🔔 Loading Notification Panel System...');
    
    // Immediately define global functions to prevent "not defined" errors
    window.toggleNotificationPanel = function() {
        if (window.notificationPanel && typeof window.notificationPanel.togglePanel === 'function') {
            window.notificationPanel.togglePanel();
        } else {
            console.log('🔔 toggleNotificationPanel called but panel not ready yet');
        }
    };
    
    window.clearAllNotifications = function() {
        if (window.notificationPanel && typeof window.notificationPanel.clearAllNotifications === 'function') {
            window.notificationPanel.clearAllNotifications();
        } else {
            console.log('🗑️ clearAllNotifications called but panel not ready yet');
        }
    };
    
    window.clearNotification = function(notificationId) {
        if (window.notificationPanel && typeof window.notificationPanel.clearNotification === 'function') {
            window.notificationPanel.clearNotification(notificationId);
        } else {
            console.log('🗑️ clearNotification called but panel not ready yet');
        }
    };
    
    class NotificationPanel {
        constructor() {
            this.notifications = [];
            this.maxNotifications = 50; // Store more notifications in panel
            this.isPanelOpen = false;
            this.init();
        }
        
        init() {
            try {
                this.loadStoredNotifications();
                this.updateBadge();
                this.bindEvents();
                console.log('✅ Notification Panel initialized');
            } catch (error) {
                console.error('❌ Error initializing Notification Panel:', error);
            }
        }
        
        bindEvents() {
            try {
                // Close panel when clicking outside
                document.addEventListener('click', (e) => {
                    const panel = document.getElementById('notification-panel');
                    const bell = document.querySelector('.notification-bell');
                    
                    if (panel && bell && !panel.contains(e.target) && !bell.contains(e.target)) {
                        this.closePanel();
                    }
                });
                
                // Close panel on escape key
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        this.closePanel();
                    }
                });
            } catch (error) {
                console.error('❌ Error binding events:', error);
            }
        }
        
        addNotification(notification) {
            try {
                // Add timestamp if not present
                if (!notification.timestamp) {
                    notification.timestamp = new Date();
                }
                
                // Add to beginning of array
                this.notifications.unshift(notification);
                
                // Keep only max notifications
                if (this.notifications.length > this.maxNotifications) {
                    this.notifications = this.notifications.slice(0, this.maxNotifications);
                }
                
                // Store in localStorage
                this.storeNotifications();
                
                // Update UI
                this.updateBadge();
                this.updatePanel();
                
                console.log('📝 Notification added to panel:', notification);
            } catch (error) {
                console.error('❌ Error adding notification:', error);
            }
        }
        
        storeNotifications() {
            try {
                localStorage.setItem('notificationPanel', JSON.stringify(this.notifications));
            } catch (error) {
                console.warn('Could not store notifications:', error);
            }
        }
        
        loadStoredNotifications() {
            try {
                const stored = localStorage.getItem('notificationPanel');
                if (stored) {
                    this.notifications = JSON.parse(stored);
                    // Convert timestamp strings back to Date objects
                    this.notifications.forEach(notification => {
                        if (notification.timestamp) {
                            notification.timestamp = new Date(notification.timestamp);
                        }
                    });
                }
            } catch (error) {
                console.warn('Could not load stored notifications:', error);
            }
        }
        
        updateBadge() {
            try {
                // Update all notification badges on the page
                const badges = document.querySelectorAll('.notification-badge');
                const unreadCount = this.notifications.filter(n => !n.read).length;
                
                badges.forEach(badge => {
                    if (unreadCount > 0) {
                        badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
                        badge.style.display = 'flex';
                    } else {
                        badge.style.display = 'none';
                    }
                });
            } catch (error) {
                console.error('❌ Error updating badge:', error);
            }
        }
        
        updatePanel() {
            try {
                const panel = document.getElementById('notification-panel');
                const list = document.getElementById('notification-list');
                
                if (!panel || !list) {
                    console.warn('⚠️ Notification panel elements not found');
                    return;
                }
                
                if (this.notifications.length === 0) {
                    list.innerHTML = '<div class="no-notifications">No notifications yet</div>';
                    return;
                }
                
                list.innerHTML = this.notifications.map(notification => `
                    <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
                        <div class="notification-header">
                            <span class="notification-title">${notification.title || 'Notification'}</span>
                            <span class="notification-time">${this.getTimeAgo(notification.timestamp)}</span>
                        </div>
                        <div class="notification-message">${notification.message}</div>
                        <div class="notification-actions">
                            ${!notification.read ? `<button onclick="markAsRead('${notification.id}')" class="mark-read-btn">Mark as Read</button>` : ''}
                            <button onclick="clearNotification('${notification.id}')" class="clear-notification-btn">Clear</button>
                        </div>
                    </div>
                `).join('');
            } catch (error) {
                console.error('❌ Error updating panel:', error);
            }
        }
        
        getTimeAgo(timestamp) {
            try {
                const now = new Date();
                const diff = now - timestamp;
                const minutes = Math.floor(diff / 60000);
                const hours = Math.floor(diff / 3600000);
                const days = Math.floor(diff / 86400000);
                
                if (minutes < 1) return 'Just now';
                if (minutes < 60) return `${minutes}m ago`;
                if (hours < 24) return `${hours}h ago`;
                if (days < 7) return `${days}d ago`;
                
                return timestamp.toLocaleDateString();
            } catch (error) {
                console.error('❌ Error calculating time ago:', error);
                return 'Unknown time';
            }
        }
        
        togglePanel() {
            try {
                if (this.isPanelOpen) {
                    this.closePanel();
                } else {
                    this.openPanel();
                }
            } catch (error) {
                console.error('❌ Error toggling panel:', error);
            }
        }
        
        openPanel() {
            try {
                const panel = document.getElementById('notification-panel');
                if (panel) {
                    panel.classList.add('show');
                    this.isPanelOpen = true;
                    this.updatePanel();
                }
            } catch (error) {
                console.error('❌ Error opening panel:', error);
            }
        }
        
        closePanel() {
            try {
                const panel = document.getElementById('notification-panel');
                if (panel) {
                    panel.classList.remove('show');
                    this.isPanelOpen = false;
                }
            } catch (error) {
                console.error('❌ Error closing panel:', error);
            }
        }
        
        markAsRead(notificationId) {
            try {
                const notification = this.notifications.find(n => n.id === notificationId);
                if (notification) {
                    notification.read = true;
                    this.storeNotifications();
                    this.updateBadge();
                }
            } catch (error) {
                console.error('❌ Error marking as read:', error);
            }
        }
        
        clearNotification(notificationId) {
            try {
                this.notifications = this.notifications.filter(n => n.id !== notificationId);
                this.storeNotifications();
                this.updateBadge();
                this.updatePanel();
                console.log(`🗑️ Notification cleared: ${notificationId}`);
            } catch (error) {
                console.error('❌ Error clearing notification:', error);
            }
        }
        
        clearAllNotifications() {
            try {
                this.notifications = [];
                this.storeNotifications();
                this.updateBadge();
                this.updatePanel();
                console.log('🗑️ All notifications cleared');
            } catch (error) {
                console.error('❌ Error clearing all notifications:', error);
            }
        }
        
        // Method to add notification from external systems
        addNotificationFromSystem(message, type = 'info', title = null) {
            try {
                const notification = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    message: message,
                    type: type,
                    title: title || this.getDefaultTitle(type),
                    timestamp: new Date(),
                    read: false
                };
                
                this.addNotification(notification);
            } catch (error) {
                console.error('❌ Error adding system notification:', error);
            }
        }
        
        getDefaultTitle(type) {
            const titles = {
                success: 'Success',
                error: 'Error',
                warning: 'Warning',
                info: 'Info'
            };
            return titles[type] || 'Notification';
        }
    }
    
    // Create global instance with error handling
    try {
        window.notificationPanel = new NotificationPanel();
        
        // Update global functions to use the instance
        window.toggleNotificationPanel = function() {
            if (window.notificationPanel && typeof window.notificationPanel.togglePanel === 'function') {
                window.notificationPanel.togglePanel();
            } else {
                console.log('🔔 toggleNotificationPanel called but panel not ready yet');
            }
        };
        
        window.clearAllNotifications = function() {
            if (window.notificationPanel && typeof window.notificationPanel.clearAllNotifications === 'function') {
                window.notificationPanel.clearAllNotifications();
            } else {
                console.log('🗑️ clearAllNotifications called but panel not ready yet');
            }
        };
        
        window.clearNotification = function(notificationId) {
            if (window.notificationPanel && typeof window.notificationPanel.clearNotification === 'function') {
                window.notificationPanel.clearNotification(notificationId);
            } else {
                console.log('🗑️ clearNotification called but panel not ready yet');
            }
        };
        
        window.markAsRead = function(notificationId) {
            if (window.notificationPanel && typeof window.notificationPanel.markAsRead === 'function') {
                window.notificationPanel.markAsRead(notificationId);
            } else {
                console.log('📖 markAsRead called but panel not ready yet');
            }
        };
        
        // Integrate with existing notification system
        if (window.showSuccess) {
            const originalShowSuccess = window.showSuccess;
            window.showSuccess = function(message, title) {
                originalShowSuccess(message, title);
                window.notificationPanel.addNotificationFromSystem(message, 'success', title);
            };
        }
        
        if (window.showError) {
            const originalShowError = window.showError;
            window.showError = function(message, title) {
                originalShowError(message, title);
                window.notificationPanel.addNotificationFromSystem(message, 'error', title);
            };
        }
        
        if (window.showWarning) {
            const originalShowWarning = window.showWarning;
            window.showWarning = function(message, title) {
                originalShowWarning(message, title);
                window.notificationPanel.addNotificationFromSystem(message, 'warning', title);
            };
        }
        
        if (window.showInfo) {
            const originalShowInfo = window.showInfo;
            window.showInfo = function(message, title) {
                originalShowInfo(message, title);
                window.notificationPanel.addNotificationFromSystem(message, 'info', title);
            };
        }
        
        console.log('✅ Notification Panel System loaded successfully');
    } catch (error) {
        console.error('❌ Error creating Notification Panel instance:', error);
    }
})();
