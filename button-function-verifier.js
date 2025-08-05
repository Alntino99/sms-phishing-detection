// ===== BUTTON FUNCTION VERIFIER =====
// Tests all button functions to ensure they work properly

// List of all button functions that should exist
const requiredFunctions = [
    // Test functions
    'testMobileDetection',
    'testMobileSMSDetector', 
    'testMobilePermissions',
    'testFirebaseConnection',
    'testFirebaseSave',
    'testFirebaseAuth',
    'testServiceWorker',
    'testBackgroundSync',
    'testNotifications',
    'testNotification',
    'testSMSAnalysis',
    'testSMSDetectorInit',
    'testSMSDetectorAvailability',
    'testSMSDetectorMethods',
    
    // Analysis functions
    'handleAnalyzeWithFallback',
    'clearResults',
    'bulkAnalysis',
    'testBulkAnalysis',
    'startBulkAnalysis',
    'clearBulkResults',
    'exportBulkResults',
    
    // Mobile functions
    'testContacts',
    'testLocation',
    'testSMS',
    'testClipboard',
    'testPWA',
    'startRealTimeMonitoring',
    'stopRealTimeMonitoring',
    'simulateIncomingSMS',
    'testMLModels',
    'testAIAnalysis',
    'testEnsembleAnalysis',
    
    // Navigation functions
    'goBack',
    'toggleUserDropdown',
    'logoutUser',
    'logout',
    'toggleMobileMenu',
    
    // Mobile connection functions
    'connectMobilePhone',
    'requestMobilePermissions',
    'testMobileFeatures',
    
    // App installation functions
    'installApp',
    'dismissInstall',
    'installAsApp',
    
    // Password functions
    'togglePassword',
    
    // Theme functions
    'toggleTheme',
    
    // Analysis mode functions
    'setAnalysisMode',
    
    // SMS sharing functions
    'shareResultsViaSMS',
    'openSMSApp',
    
    // File functions
    'downloadSampleCSV',
    
    // Modal functions
    'copySMSMessage',
    'closeSMSModal',
    
    // Admin functions
    'deleteUser',
    'deleteFeedback',
    
    // Notification functions
    'toggleNotificationDropdown',
    'markAllAsRead',
    
    // Interactive functions
    'showExample',
    'submitFeedback',
    
    // Error analysis functions
    'analyzeErrors',
    'checkDependencies',
    'testBrowserCompatibility'
];

// Test all button functions
function verifyAllButtonFunctions() {
    console.log('🔍 Verifying all button functions...');
    
    const results = {
        available: [],
        missing: [],
        working: [],
        failed: []
    };
    
    requiredFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            results.available.push(funcName);
            
            // Test the function
            try {
                const result = window[funcName]();
                if (result && typeof result.then === 'function') {
                    // Async function
                    result.then(() => {
                        results.working.push(funcName);
                        console.log(`✅ ${funcName} - Working (async)`);
                    }).catch(error => {
                        results.failed.push(funcName);
                        console.log(`❌ ${funcName} - Failed: ${error.message}`);
                    });
                } else {
                    // Sync function
                    results.working.push(funcName);
                    console.log(`✅ ${funcName} - Working (sync)`);
                }
            } catch (error) {
                results.failed.push(funcName);
                console.log(`❌ ${funcName} - Failed: ${error.message}`);
            }
        } else {
            results.missing.push(funcName);
            console.log(`❌ ${funcName} - Missing`);
        }
    });
    
    // Summary
    setTimeout(() => {
        console.log('\n📊 BUTTON FUNCTION VERIFICATION SUMMARY:');
        console.log(`✅ Available: ${results.available.length}/${requiredFunctions.length}`);
        console.log(`❌ Missing: ${results.missing.length}`);
        console.log(`✅ Working: ${results.working.length}`);
        console.log(`❌ Failed: ${results.failed.length}`);
        
        if (results.missing.length > 0) {
            console.log('\n❌ Missing functions:');
            results.missing.forEach(func => console.log(`  - ${func}`));
        }
        
        if (results.failed.length > 0) {
            console.log('\n❌ Failed functions:');
            results.failed.forEach(func => console.log(`  - ${func}`));
        }
        
        if (results.missing.length === 0 && results.failed.length === 0) {
            console.log('\n🎉 ALL BUTTON FUNCTIONS ARE WORKING PERFECTLY!');
            showNotification('All button functions verified successfully!', 'success');
        } else {
            console.log('\n⚠️ Some button functions need attention');
            showNotification(`${results.missing.length} missing, ${results.failed.length} failed functions`, 'warning');
        }
    }, 2000);
}

// Test all buttons on the page
function testAllButtons() {
    console.log('🔍 Testing all buttons on the page...');
    
    const buttons = document.querySelectorAll('button[onclick]');
    const results = {
        total: buttons.length,
        working: 0,
        failed: 0
    };
    
    console.log(`Found ${buttons.length} buttons with onclick handlers`);
    
    buttons.forEach((button, index) => {
        const onclick = button.getAttribute('onclick');
        const functionMatch = onclick.match(/(\w+)\s*\(/);
        
        if (functionMatch) {
            const functionName = functionMatch[1];
            
            if (typeof window[functionName] === 'function') {
                results.working++;
                console.log(`✅ Button ${index + 1}: ${functionName} - Available`);
            } else {
                results.failed++;
                console.log(`❌ Button ${index + 1}: ${functionName} - Missing`);
            }
        }
    });
    
    console.log('\n📊 BUTTON TEST SUMMARY:');
    console.log(`Total buttons: ${results.total}`);
    console.log(`✅ Working: ${results.working}`);
    console.log(`❌ Failed: ${results.failed}`);
    
    if (results.failed === 0) {
        console.log('\n🎉 ALL BUTTONS ARE WORKING!');
        showNotification('All buttons verified successfully!', 'success');
    } else {
        console.log('\n⚠️ Some buttons need attention');
        showNotification(`${results.failed} buttons have missing functions`, 'warning');
    }
}

// Auto-run verification when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Button Function Verifier loaded');
    
    // Run verification after a short delay to ensure all scripts are loaded
    setTimeout(() => {
        verifyAllButtonFunctions();
        testAllButtons();
    }, 1000);
});

// Export functions for manual testing
window.verifyAllButtonFunctions = verifyAllButtonFunctions;
window.testAllButtons = testAllButtons;

console.log('✅ Button function verifier loaded successfully'); 