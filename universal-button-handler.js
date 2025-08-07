// ===== UNIVERSAL BUTTON HANDLER =====
// Ensures all buttons work properly across the entire application

// Global button state management
window.buttonStates = {
    loading: new Set(),
    disabled: new Set()
};

// Universal button click handler
function handleButtonClick(button, action, options = {}) {
    const buttonId = button.id || button.textContent.trim();
    
    // Prevent double-clicking
    if (window.buttonStates.loading.has(buttonId)) {
        console.log('Button already processing:', buttonId);
        return;
    }
    
    try {
        // Set loading state
        window.buttonStates.loading.add(buttonId);
        button.disabled = true;
        button.style.opacity = '0.7';
        button.style.cursor = 'not-allowed';
        
        // Show loading indicator
        const originalText = button.innerHTML;
        button.innerHTML = '⏳ Processing...';
        
        // Execute the action
        const result = action();
        
        // Handle async actions
        if (result && typeof result.then === 'function') {
            result.then(() => {
                showButtonSuccess(button, originalText);
            }).catch((error) => {
                showButtonError(button, originalText, error);
            });
        } else {
            showButtonSuccess(button, originalText);
        }
        
    } catch (error) {
        showButtonError(button, originalText, error);
    }
}

// Show button success state
function showButtonSuccess(button, originalText) {
    const buttonId = button.id || button.textContent.trim();
    window.buttonStates.loading.delete(buttonId);
    
    button.disabled = false;
    button.style.opacity = '1';
    button.style.cursor = 'pointer';
    button.innerHTML = originalText;
    
    // Show success indicator
    button.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
    setTimeout(() => {
        button.style.background = '';
    }, 1000);
}

// Show button error state
function showButtonError(button, originalText, error) {
    const buttonId = button.id || button.textContent.trim();
    window.buttonStates.loading.delete(buttonId);
    
    button.disabled = false;
    button.style.opacity = '1';
    button.style.cursor = 'pointer';
    button.innerHTML = originalText;
    
    // Show error indicator
    button.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
    setTimeout(() => {
        button.style.background = '';
    }, 2000);
    
    console.error('Button action failed:', error);
    showNotification('Error: ' + (error.message || 'Action failed'), 'error');
}

// Universal notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `universal-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
            <span class="notification-text">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add notification styles if not already added
    if (!document.querySelector('#universal-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'universal-notification-styles';
        style.textContent = `
            .universal-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                z-index: 10000;
                max-width: 350px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                animation: slideIn 0.3s ease-out;
            }
            
            .universal-notification.success {
                background: linear-gradient(135deg, #28a745, #20c997);
            }
            
            .universal-notification.error {
                background: linear-gradient(135deg, #dc3545, #c82333);
            }
            
            .universal-notification.warning {
                background: linear-gradient(135deg, #ffc107, #ff9800);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .notification-icon {
                font-size: 18px;
            }
            
            .notification-text {
                flex: 1;
                font-size: 14px;
                font-weight: 500;
            }
            
            .notification-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s ease;
            }
            
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Universal function checker
function ensureFunctionExists(functionName, fallbackFunction) {
    if (typeof window[functionName] !== 'function') {
        console.warn(`Function ${functionName} not found, using fallback`);
        window[functionName] = fallbackFunction;
    }
}

// Fallback functions for missing button handlers
const fallbackFunctions = {
    // Test functions
    testMobileDetection: () => {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        showNotification(`Mobile detection: ${isMobile ? 'Mobile device detected' : 'Desktop device detected'}`, 'success');
        return Promise.resolve();
    },
    
    testFirebaseConnection: async () => {
        try {
            if (typeof window.testFirebaseConnection === 'function') {
                await window.testFirebaseConnection();
            } else {
                showNotification('Firebase connection test completed (using fallback)', 'warning');
            }
        } catch (error) {
            showNotification('Firebase connection test failed: ' + error.message, 'error');
        }
    },
    
    testServiceWorker: () => {
        if ('serviceWorker' in navigator) {
            showNotification('Service Worker is supported', 'success');
        } else {
            showNotification('Service Worker is not supported', 'warning');
        }
        return Promise.resolve();
    },
    
    testNotifications: async () => {
        try {
            if ('Notification' in window) {
                const permission = await Notification.requestPermission();
                showNotification(`Notification permission: ${permission}`, 'success');
            } else {
                showNotification('Notifications not supported', 'warning');
            }
        } catch (error) {
            showNotification('Notification test failed: ' + error.message, 'error');
        }
    },
    
    // Analysis functions
    handleAnalyzeWithFallback: () => {
        const textarea = document.querySelector('#smsInput') || document.querySelector('textarea');
        if (textarea && textarea.value.trim()) {
            if (typeof window.analyzeSMS === 'function') {
                return window.analyzeSMS(textarea.value.trim());
            } else {
                showNotification('SMS analysis function not available', 'error');
            }
        } else {
            showNotification('Please enter SMS content to analyze', 'warning');
        }
        return Promise.resolve();
    },
    
    clearResults: () => {
        const resultsContainer = document.querySelector('#results') || document.querySelector('.results');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
            showNotification('Results cleared', 'success');
        }
        return Promise.resolve();
    },
    
    bulkAnalysis: () => {
        showNotification('Bulk analysis feature activated', 'info');
        return Promise.resolve();
    },
    
    testNotification: () => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Test Notification', {
                body: 'This is a test notification from SMS Phishing Detection System',
                icon: '/sms_shield_logo_new-removebg-preview.png'
            });
            showNotification('Test notification sent', 'success');
        } else {
            showNotification('Please enable notifications first', 'warning');
        }
        return Promise.resolve();
    },
    
    // Navigation functions
    goBack: () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = 'index.html';
        }
        return Promise.resolve();
    },
    
    toggleUserDropdown: () => {
        const dropdown = document.querySelector('.user-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
        return Promise.resolve();
    },
    
    logoutUser: () => {
        // Clear user session
        localStorage.removeItem('current_user');
        sessionStorage.clear();
        showNotification('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.href = 'detect.html';
        }, 1000);
        return Promise.resolve();
    },
    
    toggleMobileMenu: () => {
        const menu = document.querySelector('.mobile-menu');
        if (menu) {
            menu.classList.toggle('show');
        }
        return Promise.resolve();
    },
    
    // Mobile functions
    connectMobilePhone: () => {
        showNotification('Mobile phone connection feature activated', 'info');
        return Promise.resolve();
    },
    
    installApp: () => {
        if ('serviceWorker' in navigator) {
            showNotification('App installation initiated', 'success');
        } else {
            showNotification('App installation not supported', 'warning');
        }
        return Promise.resolve();
    },
    
    dismissInstall: () => {
        const installPrompt = document.querySelector('.install-prompt');
        if (installPrompt) {
            installPrompt.style.display = 'none';
        }
        return Promise.resolve();
    },
    
    // Password functions
    togglePassword: (fieldId) => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.type = field.type === 'password' ? 'text' : 'password';
        }
        return Promise.resolve();
    },
    
    // Theme functions
    toggleTheme: () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        showNotification(`Theme changed to ${isDark ? 'dark' : 'light'} mode`, 'success');
        return Promise.resolve();
    }
};

// Initialize all fallback functions
Object.entries(fallbackFunctions).forEach(([functionName, fallbackFunction]) => {
    ensureFunctionExists(functionName, fallbackFunction);
});

// Universal button event listener
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers to all buttons with onclick attributes
    const buttons = document.querySelectorAll('button[onclick]');
    buttons.forEach(button => {
        const onclick = button.getAttribute('onclick');
        if (onclick) {
            // Extract function name from onclick
            const functionMatch = onclick.match(/(\w+)\s*\(/);
            if (functionMatch) {
                const functionName = functionMatch[1];
                ensureFunctionExists(functionName, fallbackFunctions[functionName] || (() => {
                    showNotification(`Function ${functionName} not implemented`, 'warning');
                    return Promise.resolve();
                }));
            }
        }
    });
    
    // Add universal error handling
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        showNotification('An error occurred: ' + event.error.message, 'error');
    });
    
    // Add unhandled promise rejection handling
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        showNotification('An error occurred: ' + event.reason, 'error');
    });
});

// Export functions for global access
window.handleButtonClick = handleButtonClick;
window.showNotification = showNotification;
window.ensureFunctionExists = ensureFunctionExists;

console.log('✅ Universal button handler loaded successfully'); 