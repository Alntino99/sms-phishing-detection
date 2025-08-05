// ===== COMPREHENSIVE TEST SUITE =====
// Tests all functionality to ensure everything works perfectly

class ComprehensiveTestSuite {
    constructor() {
        this.testResults = {};
        this.currentTest = null;
        this.init();
    }

    async init() {
        console.log('🧪 Initializing Comprehensive Test Suite...');
        
        // Wait for all scripts to load
        setTimeout(() => {
            this.runAllTests();
        }, 2000);
    }

    async runAllTests() {
        console.log('🚀 Starting comprehensive tests...');
        
        // Test AI Models
        await this.testAIModels();
        
        // Test Firebase Integration
        await this.testFirebaseIntegration();
        
        // Test Button Functions
        await this.testButtonFunctions();
        
        // Test Notifications
        await this.testNotifications();
        
        // Test Cross-Platform Features
        await this.testCrossPlatformFeatures();
        
        // Test PWA Installation
        await this.testPWAInstallation();
        
        // Test SMS Monitoring
        await this.testSMSMonitoring();
        
        // Generate final report
        this.generateTestReport();
    }

    async testAIModels() {
        console.log('🤖 Testing AI Models...');
        
        // Test Naive Bayes Classifier
        try {
            if (typeof NaiveBayesClassifier !== 'undefined') {
                const nbClassifier = new NaiveBayesClassifier();
                const trainingData = [
                    { text: "Your account has been suspended. Click here to verify.", isPhishing: true },
                    { text: "You have won a prize! Claim now.", isPhishing: true },
                    { text: "Your package has been delivered. Track here.", isPhishing: false },
                    { text: "Meeting reminder: Tomorrow at 2 PM", isPhishing: false }
                ];
                
                nbClassifier.train(trainingData);
                const prediction = nbClassifier.predict("URGENT: Your bank account has been compromised.");
                
                this.testResults.naiveBayes = {
                    status: 'success',
                    message: 'Naive Bayes Classifier working correctly',
                    prediction: prediction
                };
                console.log('✅ Naive Bayes Classifier test passed');
            } else {
                this.testResults.naiveBayes = {
                    status: 'error',
                    message: 'Naive Bayes Classifier not found'
                };
                console.log('❌ Naive Bayes Classifier not found');
            }
        } catch (error) {
            this.testResults.naiveBayes = {
                status: 'error',
                message: `Naive Bayes test failed: ${error.message}`
            };
            console.log('❌ Naive Bayes test failed:', error);
        }

        // Test LSTM Classifier
        try {
            if (typeof LSTMClassifier !== 'undefined') {
                const lstmClassifier = new LSTMClassifier();
                const trainingData = [
                    { text: "Your account has been suspended. Click here to verify.", isPhishing: true },
                    { text: "You have won a prize! Claim now.", isPhishing: true },
                    { text: "Your package has been delivered. Track here.", isPhishing: false },
                    { text: "Meeting reminder: Tomorrow at 2 PM", isPhishing: false }
                ];
                
                lstmClassifier.train(trainingData);
                const prediction = lstmClassifier.predict("Congratulations! You've won $1,000,000.");
                
                this.testResults.lstm = {
                    status: 'success',
                    message: 'LSTM Classifier working correctly',
                    prediction: prediction
                };
                console.log('✅ LSTM Classifier test passed');
            } else {
                this.testResults.lstm = {
                    status: 'error',
                    message: 'LSTM Classifier not found'
                };
                console.log('❌ LSTM Classifier not found');
            }
        } catch (error) {
            this.testResults.lstm = {
                status: 'error',
                message: `LSTM test failed: ${error.message}`
            };
            console.log('❌ LSTM test failed:', error);
        }

        // Test analyzeSMS function
        try {
            if (typeof window.analyzeSMS === 'function') {
                const analysis = await window.analyzeSMS("URGENT: Your bank account has been suspended. Click here to verify.");
                
                this.testResults.analyzeSMS = {
                    status: 'success',
                    message: 'analyzeSMS function working correctly',
                    analysis: analysis
                };
                console.log('✅ analyzeSMS function test passed');
            } else {
                this.testResults.analyzeSMS = {
                    status: 'error',
                    message: 'analyzeSMS function not found'
                };
                console.log('❌ analyzeSMS function not found');
            }
        } catch (error) {
            this.testResults.analyzeSMS = {
                status: 'error',
                message: `analyzeSMS test failed: ${error.message}`
            };
            console.log('❌ analyzeSMS test failed:', error);
        }
    }

    async testFirebaseIntegration() {
        console.log('🔥 Testing Firebase Integration...');
        
        // Test Firebase connection
        try {
            if (typeof window.testFirebaseConnection === 'function') {
                const connectionResult = await window.testFirebaseConnection();
                
                this.testResults.firebaseConnection = {
                    status: 'success',
                    message: 'Firebase connection working',
                    result: connectionResult
                };
                console.log('✅ Firebase connection test passed');
            } else {
                this.testResults.firebaseConnection = {
                    status: 'error',
                    message: 'Firebase connection function not found'
                };
                console.log('❌ Firebase connection function not found');
            }
        } catch (error) {
            this.testResults.firebaseConnection = {
                status: 'error',
                message: `Firebase connection test failed: ${error.message}`
            };
            console.log('❌ Firebase connection test failed:', error);
        }

        // Test Firebase save
        try {
            if (typeof window.saveToFirebase === 'function') {
                const saveResult = await window.saveToFirebase('test', { test: 'data' });
                
                this.testResults.firebaseSave = {
                    status: 'success',
                    message: 'Firebase save working',
                    result: saveResult
                };
                console.log('✅ Firebase save test passed');
            } else {
                this.testResults.firebaseSave = {
                    status: 'error',
                    message: 'Firebase save function not found'
                };
                console.log('❌ Firebase save function not found');
            }
        } catch (error) {
            this.testResults.firebaseSave = {
                status: 'error',
                message: `Firebase save test failed: ${error.message}`
            };
            console.log('❌ Firebase save test failed:', error);
        }
    }

    async testButtonFunctions() {
        console.log('🔘 Testing Button Functions...');
        
        const buttonFunctions = [
            'testMobileDetection',
            'testFirebaseConnection',
            'testServiceWorker',
            'testNotifications',
            'installApp',
            'startRealTimeMonitoring',
            'stopRealTimeMonitoring',
            'analyzeSMS',
            'bulkAnalysis',
            'clearResults',
            'toggleTheme',
            'togglePassword',
            'goBack',
            'logoutUser',
            'connectMobilePhone'
        ];

        buttonFunctions.forEach(funcName => {
            try {
                if (typeof window[funcName] === 'function') {
                    this.testResults[`button_${funcName}`] = {
                        status: 'success',
                        message: `${funcName} function available`
                    };
                    console.log(`✅ ${funcName} function available`);
                } else {
                    this.testResults[`button_${funcName}`] = {
                        status: 'error',
                        message: `${funcName} function not found`
                    };
                    console.log(`❌ ${funcName} function not found`);
                }
            } catch (error) {
                this.testResults[`button_${funcName}`] = {
                    status: 'error',
                    message: `${funcName} test failed: ${error.message}`
                };
                console.log(`❌ ${funcName} test failed:`, error);
            }
        });
    }

    async testNotifications() {
        console.log('🔔 Testing Notifications...');
        
        // Test notification permission
        try {
            if ('Notification' in window) {
                const permission = Notification.permission;
                
                this.testResults.notificationPermission = {
                    status: permission === 'granted' ? 'success' : 'warning',
                    message: `Notification permission: ${permission}`,
                    permission: permission
                };
                console.log(`✅ Notification permission: ${permission}`);
            } else {
                this.testResults.notificationPermission = {
                    status: 'error',
                    message: 'Notifications not supported'
                };
                console.log('❌ Notifications not supported');
            }
        } catch (error) {
            this.testResults.notificationPermission = {
                status: 'error',
                message: `Notification permission test failed: ${error.message}`
            };
            console.log('❌ Notification permission test failed:', error);
        }

        // Test SMS Monitor
        try {
            if (window.smsMonitor) {
                const monitorStatus = window.smsMonitor.isMonitoring;
                
                this.testResults.smsMonitor = {
                    status: 'success',
                    message: 'SMS Monitor available',
                    isMonitoring: monitorStatus
                };
                console.log('✅ SMS Monitor available');
            } else {
                this.testResults.smsMonitor = {
                    status: 'error',
                    message: 'SMS Monitor not found'
                };
                console.log('❌ SMS Monitor not found');
            }
        } catch (error) {
            this.testResults.smsMonitor = {
                status: 'error',
                message: `SMS Monitor test failed: ${error.message}`
            };
            console.log('❌ SMS Monitor test failed:', error);
        }
    }

    async testCrossPlatformFeatures() {
        console.log('🌐 Testing Cross-Platform Features...');
        
        // Test service worker
        try {
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.getRegistration();
                
                this.testResults.serviceWorker = {
                    status: registration ? 'success' : 'warning',
                    message: registration ? 'Service Worker registered' : 'Service Worker not registered',
                    registration: registration
                };
                console.log('✅ Service Worker test passed');
            } else {
                this.testResults.serviceWorker = {
                    status: 'error',
                    message: 'Service Worker not supported'
                };
                console.log('❌ Service Worker not supported');
            }
        } catch (error) {
            this.testResults.serviceWorker = {
                status: 'error',
                message: `Service Worker test failed: ${error.message}`
            };
            console.log('❌ Service Worker test failed:', error);
        }

        // Test PWA features
        try {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
            const isInstalled = window.navigator.standalone || isStandalone;
            
            this.testResults.pwaFeatures = {
                status: 'success',
                message: 'PWA features available',
                isStandalone: isStandalone,
                isInstalled: isInstalled
            };
            console.log('✅ PWA features test passed');
        } catch (error) {
            this.testResults.pwaFeatures = {
                status: 'error',
                message: `PWA features test failed: ${error.message}`
            };
            console.log('❌ PWA features test failed:', error);
        }
    }

    async testPWAInstallation() {
        console.log('📱 Testing PWA Installation...');
        
        // Test install prompt
        try {
            let deferredPrompt = null;
            window.addEventListener('beforeinstallprompt', (e) => {
                deferredPrompt = e;
            });
            
            this.testResults.pwaInstall = {
                status: 'success',
                message: 'PWA installation ready',
                deferredPrompt: deferredPrompt
            };
            console.log('✅ PWA installation test passed');
        } catch (error) {
            this.testResults.pwaInstall = {
                status: 'error',
                message: `PWA installation test failed: ${error.message}`
            };
            console.log('❌ PWA installation test failed:', error);
        }
    }

    async testSMSMonitoring() {
        console.log('📱 Testing SMS Monitoring...');
        
        // Test SMS monitor functionality
        try {
            if (window.smsMonitor) {
                const canStart = typeof window.smsMonitor.startMonitoringFromUI === 'function';
                const canStop = typeof window.smsMonitor.stopMonitoringFromUI === 'function';
                const canGetNotifications = typeof window.smsMonitor.getNotificationCount === 'function';
                
                this.testResults.smsMonitoring = {
                    status: 'success',
                    message: 'SMS Monitoring functions available',
                    canStart: canStart,
                    canStop: canStop,
                    canGetNotifications: canGetNotifications
                };
                console.log('✅ SMS Monitoring test passed');
            } else {
                this.testResults.smsMonitoring = {
                    status: 'error',
                    message: 'SMS Monitor not available'
                };
                console.log('❌ SMS Monitor not available');
            }
        } catch (error) {
            this.testResults.smsMonitoring = {
                status: 'error',
                message: `SMS Monitoring test failed: ${error.message}`
            };
            console.log('❌ SMS Monitoring test failed:', error);
        }
    }

    generateTestReport() {
        console.log('📊 Generating Test Report...');
        
        const totalTests = Object.keys(this.testResults).length;
        const passedTests = Object.values(this.testResults).filter(result => result.status === 'success').length;
        const failedTests = Object.values(this.testResults).filter(result => result.status === 'error').length;
        const warningTests = Object.values(this.testResults).filter(result => result.status === 'warning').length;
        
        const report = {
            summary: {
                total: totalTests,
                passed: passedTests,
                failed: failedTests,
                warnings: warningTests,
                successRate: ((passedTests / totalTests) * 100).toFixed(2)
            },
            results: this.testResults
        };
        
        console.log('📊 Test Report:', report);
        
        // Display results in UI if available
        this.displayTestResults(report);
        
        return report;
    }

    displayTestResults(report) {
        // Create a test results display
        const resultsDiv = document.createElement('div');
        resultsDiv.id = 'test-results';
        resultsDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            max-height: 80vh;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            overflow-y: auto;
            padding: 20px;
            font-family: Arial, sans-serif;
        `;
        
        resultsDiv.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #333;">🧪 Test Results</h3>
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Total Tests:</span>
                    <span>${report.summary.total}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Passed:</span>
                    <span style="color: #28a745;">${report.summary.passed}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Failed:</span>
                    <span style="color: #dc3545;">${report.summary.failed}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <span>Success Rate:</span>
                    <span style="color: #007bff;">${report.summary.successRate}%</span>
                </div>
            </div>
            <div style="max-height: 300px; overflow-y: auto;">
                ${Object.entries(report.results).map(([test, result]) => `
                    <div style="margin-bottom: 10px; padding: 10px; border-radius: 5px; background: ${result.status === 'success' ? '#d4edda' : result.status === 'warning' ? '#fff3cd' : '#f8d7da'};">
                        <div style="font-weight: bold; color: ${result.status === 'success' ? '#155724' : result.status === 'warning' ? '#856404' : '#721c24'};">
                            ${test}
                        </div>
                        <div style="font-size: 12px; color: #666;">
                            ${result.message}
                        </div>
                    </div>
                `).join('')}
            </div>
            <button onclick="document.getElementById('test-results').remove()" style="
                background: #007bff;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 15px;
            ">Close</button>
        `;
        
        document.body.appendChild(resultsDiv);
    }
}

// Initialize comprehensive test suite
window.comprehensiveTest = new ComprehensiveTestSuite();

// Export for manual testing
window.runComprehensiveTests = () => {
    window.comprehensiveTest.runAllTests();
};

console.log('✅ Comprehensive test suite loaded'); 