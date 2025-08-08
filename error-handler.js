// Comprehensive Error Handler for SMS Shield
// Manages all errors, missing dependencies, and provides fallbacks

(function() {
    'use strict';
    
    console.log('🛡️ Loading Error Handler...');
    
    class ErrorHandler {
        constructor() {
            this.errors = [];
            this.maxErrors = 10;
            this.init();
        }
        
        init() {
            this.setupGlobalErrorHandling();
            this.checkDependencies();
            console.log('✅ Error Handler initialized');
        }
        
        setupGlobalErrorHandling() {
            // Global error handler
            window.addEventListener('error', (event) => {
                this.handleError(event.error || new Error(event.message), 'Global Error');
            });
            
            // Unhandled promise rejection handler
            window.addEventListener('unhandledrejection', (event) => {
                this.handleError(event.reason, 'Unhandled Promise Rejection');
            });
        }
        
        checkDependencies() {
            const requiredDependencies = [
                { name: 'authManager', file: 'auth-state-manager.js' },
                { name: 'showSuccess', file: 'notification-system.js' },
                { name: 'toggleTheme', file: 'darkMode.js' },
                { name: 'clearCacheAndReload', file: 'cache-clear.js' },
                { name: 'toggleNotificationPanel', file: 'notification-panel.js' },
                { name: 'clearAllNotifications', file: 'notification-panel.js' }
            ];
            
            requiredDependencies.forEach(dep => {
                if (typeof window[dep.name] === 'undefined') {
                    console.warn(`⚠️ Missing dependency: ${dep.name} from ${dep.file}`);
                    this.createFallback(dep.name);
                }
            });
        }
        
        createFallback(functionName) {
            switch(functionName) {
                case 'updateAuthUI':
                    window.updateAuthUI = function() {
                        console.log('🔄 updateAuthUI fallback called');
                        if (window.authManager && typeof authManager.updateAuthUI === 'function') {
                            authManager.updateAuthUI();
                        }
                    };
                    break;
                    
                case 'showSuccess':
                    window.showSuccess = function(message, title = 'Success') {
                        console.log(`✅ ${title}: ${message}`);
                        // Create a simple alert as fallback
                        if (typeof alert !== 'undefined') {
                            alert(`${title}: ${message}`);
                        }
                    };
                    break;
                    
                case 'showInfo':
                    window.showInfo = function(message, title = 'Info') {
                        console.log(`ℹ️ ${title}: ${message}`);
                        if (typeof alert !== 'undefined') {
                            alert(`${title}: ${message}`);
                        }
                    };
                    break;
                    
                case 'toggleTheme':
                    window.toggleTheme = function() {
                        console.log('🔄 toggleTheme fallback called');
                        const body = document.body;
                        const isDark = body.classList.contains('dark-mode');
                        body.classList.toggle('dark-mode');
                        localStorage.setItem('theme', isDark ? 'light' : 'dark');
                    };
                    break;
                    
                case 'clearCacheAndReload':
                    window.clearCacheAndReload = function() {
                        console.log('🔄 clearCacheAndReload fallback called');
                        if ('caches' in window) {
                            caches.keys().then(names => {
                                names.forEach(name => caches.delete(name));
                            });
                        }
                        window.location.reload();
                    };
                    break;
                    
                case 'toggleNotificationPanel':
                    window.toggleNotificationPanel = function() {
                        console.log('🔔 toggleNotificationPanel fallback called');
                        // Simple fallback - just log the action
                        console.log('Notification panel toggle requested');
                    };
                    break;
                    
                case 'clearAllNotifications':
                    window.clearAllNotifications = function() {
                        console.log('🗑️ clearAllNotifications fallback called');
                        // Simple fallback - just log the action
                        console.log('Clear all notifications requested');
                    };
                    break;
            }
        }
        
        handleError(error, context = 'Unknown') {
            const errorInfo = {
                message: error.message || 'Unknown error',
                stack: error.stack,
                context: context,
                timestamp: new Date().toISOString(),
                url: window.location.href
            };
            
            this.errors.push(errorInfo);
            
            // Keep only the last maxErrors
            if (this.errors.length > this.maxErrors) {
                this.errors.shift();
            }
            
            console.error(`❌ Error in ${context}:`, error);
            
            // Show user-friendly error message
            this.showUserError(error.message, context);
        }
        
        showUserError(message, context) {
            // Try to use notification system if available
            if (window.showError) {
                showError(`Error in ${context}: ${message}`, 'Error');
            } else if (typeof alert !== 'undefined') {
                alert(`Error: ${message}`);
            }
        }
        
        getErrors() {
            return this.errors;
        }
        
        clearErrors() {
            this.errors = [];
        }
        
        // Check if a function exists and provide fallback
        safeCall(funcName, fallback, ...args) {
            if (typeof window[funcName] === 'function') {
                try {
                    return window[funcName](...args);
                } catch (error) {
                    this.handleError(error, `Safe call to ${funcName}`);
                    if (fallback) {
                        return fallback(...args);
                    }
                }
            } else {
                console.warn(`⚠️ Function ${funcName} not found, using fallback`);
                if (fallback) {
                    return fallback(...args);
                }
            }
        }
    }
    
    // Create global instance
    window.errorHandler = new ErrorHandler();
    
    // Auto-initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        if (window.errorHandler) {
            window.errorHandler.checkDependencies();
        }
    });
    
    console.log('✅ Error Handler loaded successfully');
})();
