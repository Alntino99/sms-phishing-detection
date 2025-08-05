// ===== ENHANCED PWA INSTALLATION =====
// Forces PWA installation and provides advanced user feedback

class EnhancedPWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.installButton = null;
        this.installContainer = null;
        this.init();
    }

    init() {
        console.log('🚀 Initializing Enhanced PWA Installer...');
        
        // Get DOM elements
        this.installButton = document.getElementById('install-app-btn');
        this.installContainer = document.getElementById('install-app-container');
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Check if already installed
        this.checkIfInstalled();
        
        // Force show install button
        this.forceShowInstallButton();
    }

    setupEventListeners() {
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('📱 PWA install prompt detected');
            e.preventDefault();
            this.deferredPrompt = e;
            
            // Show install button immediately
            this.showInstallButton();
            
            // Show enhanced install prompt
            this.showEnhancedInstallPrompt();
        });

        // Listen for appinstalled event
        window.addEventListener('appinstalled', (evt) => {
            console.log('✅ App installed successfully');
            this.onAppInstalled();
        });

        // Listen for load event
        window.addEventListener('load', () => {
            this.checkPWAFeatures();
        });
    }

    checkIfInstalled() {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('📱 App is already installed');
            this.hideInstallButton();
            this.showInstalledMessage();
        }
    }

    checkPWAFeatures() {
        const hasServiceWorker = 'serviceWorker' in navigator;
        const hasPushManager = 'PushManager' in window;
        const hasNotifications = 'Notification' in window;
        
        console.log('📱 PWA Features Check:', {
            serviceWorker: hasServiceWorker,
            pushManager: hasPushManager,
            notifications: hasNotifications
        });

        if (hasServiceWorker && hasPushManager) {
            this.showInstallButton();
        }
    }

    forceShowInstallButton() {
        if (this.installContainer) {
            this.installContainer.style.display = 'block';
            console.log('✅ Install button forced to show');
        }
    }

    showInstallButton() {
        if (this.installContainer) {
            this.installContainer.style.display = 'block';
            console.log('✅ Install button shown');
        }
    }

    hideInstallButton() {
        if (this.installContainer) {
            this.installContainer.style.display = 'none';
            console.log('✅ Install button hidden (already installed)');
        }
    }

    showEnhancedInstallPrompt() {
        // Create enhanced install prompt
        const prompt = document.createElement('div');
        prompt.id = 'enhanced-install-prompt';
        prompt.innerHTML = `
            <div class="enhanced-install-content">
                <div class="install-header">
                    <h3>📱 Install SMS Shield App</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="close-btn">×</button>
                </div>
                <div class="install-body">
                    <div class="install-benefits">
                        <h4>🚀 Enhanced Features:</h4>
                        <ul>
                            <li>📱 Full app experience (no browser UI)</li>
                            <li>🛡️ Enhanced SMS protection</li>
                            <li>🔔 Real-time push notifications</li>
                            <li>📊 Advanced threat detection</li>
                            <li>⚡ Faster performance</li>
                            <li>🔒 Better security permissions</li>
                        </ul>
                    </div>
                    <div class="install-actions">
                        <button onclick="window.enhancedPWAInstaller.installApp()" class="install-btn">
                            📱 Install Now
                        </button>
                        <button onclick="window.enhancedPWAInstaller.showManualInstructions()" class="manual-btn">
                            📋 Manual Instructions
                        </button>
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" class="dismiss-btn">
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #enhanced-install-prompt {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            
            .enhanced-install-content {
                background: white;
                border-radius: 20px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s ease;
            }
            
            .install-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }
            
            .install-header h3 {
                margin: 0;
                color: #333;
                font-size: 1.5rem;
            }
            
            .close-btn {
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: #666;
            }
            
            .install-benefits {
                margin-bottom: 1.5rem;
            }
            
            .install-benefits h4 {
                color: #333;
                margin-bottom: 1rem;
            }
            
            .install-benefits ul {
                list-style: none;
                padding: 0;
            }
            
            .install-benefits li {
                padding: 0.5rem 0;
                color: #666;
                border-bottom: 1px solid #eee;
            }
            
            .install-actions {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .install-btn {
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                border: none;
                padding: 1rem;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .install-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
            }
            
            .manual-btn {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                padding: 0.8rem;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .manual-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            }
            
            .dismiss-btn {
                background: #f8f9fa;
                color: #666;
                border: 1px solid #ddd;
                padding: 0.8rem;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .dismiss-btn:hover {
                background: #e9ecef;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(prompt);
        
        // Auto-show after 2 seconds
        setTimeout(() => {
            if (!localStorage.getItem('installPromptDismissed')) {
                prompt.style.display = 'flex';
            }
        }, 2000);
    }

    async installApp() {
        console.log('📱 Enhanced install app clicked');
        
        if (this.deferredPrompt) {
            console.log('📱 Using deferred prompt');
            
            if (this.installButton) {
                this.installButton.classList.add('installing');
                this.installButton.textContent = 'Installing...';
            }
            
            try {
                this.deferredPrompt.prompt();
                const choiceResult = await this.deferredPrompt.userChoice;
                
                if (choiceResult.outcome === 'accepted') {
                    console.log('✅ App installed successfully');
                    this.showSuccessMessage('📱 SMS Shield App installed successfully! Enhanced features enabled.');
                } else {
                    console.log('❌ App installation declined');
                    this.showManualInstructions();
                }
            } catch (error) {
                console.error('❌ Installation error:', error);
                this.showManualInstructions();
            }
            
            if (this.installButton) {
                this.installButton.classList.remove('installing');
                this.installButton.textContent = '📱 Install App';
            }
            
            this.deferredPrompt = null;
        } else {
            console.log('📱 No deferred prompt, showing manual instructions');
            this.showManualInstructions();
        }
        
        // Remove prompt
        const prompt = document.getElementById('enhanced-install-prompt');
        if (prompt) {
            prompt.remove();
        }
    }

    showManualInstructions() {
        const instructions = `
            📱 Manual Installation Instructions:
            
            🌐 Chrome/Edge (Desktop):
            1. Click the menu (⋮) in the address bar
            2. Select "Install SMS Shield" or "Add to home screen"
            
            📱 Chrome/Edge (Mobile):
            1. Tap the menu (⋮) in browser
            2. Select "Add to home screen" or "Install app"
            
            🍎 Safari (iOS):
            1. Tap the share button (□↑)
            2. Select "Add to Home Screen"
            3. Tap "Add" to confirm
            
            🦊 Firefox:
            1. Tap the menu (☰)
            2. Select "Install App" or "Add to Home Screen"
            
            💡 Tip: After installation, the app will appear on your home screen with enhanced SMS protection features!
        `;
        
        alert(instructions);
    }

    onAppInstalled() {
        this.hideInstallButton();
        this.showSuccessMessage('🎉 SMS Shield App installed successfully! Enhanced SMS protection is now active.');
        
        // Enable enhanced features
        setTimeout(() => {
            if (window.mobileSMSDetector) {
                window.mobileSMSDetector.enableEnhancedSMSFeatures();
            }
        }, 1000);
    }

    showInstalledMessage() {
        this.showSuccessMessage('📱 SMS Shield App is already installed! Enhanced features are active.');
    }

    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'enhanced-notification success';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✅</span>
                <span class="notification-text">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add notification styles
        const style = document.createElement('style');
        style.textContent = `
            .enhanced-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
                z-index: 10000;
                max-width: 400px;
                animation: slideIn 0.3s ease;
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
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize enhanced PWA installer
window.enhancedPWAInstaller = new EnhancedPWAInstaller();

console.log('✅ Enhanced PWA Installer loaded'); 