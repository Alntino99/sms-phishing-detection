// Firebase Quick Test Script
// Run this in the browser console to test Firebase functionality

console.log('🔥 Starting Firebase Quick Test...');

// Test 1: Check if Firebase SDK is loaded
function testFirebaseSDK() {
    console.log('📋 Test 1: Firebase SDK Loading');
    if (typeof firebase !== 'undefined') {
        console.log('✅ Firebase SDK loaded successfully');
        return true;
    } else {
        console.log('❌ Firebase SDK not loaded');
        return false;
    }
}

// Test 2: Check Firebase configuration
function testFirebaseConfig() {
    console.log('📋 Test 2: Firebase Configuration');
    if (typeof firebaseConfig !== 'undefined' && firebaseConfig.apiKey) {
        console.log('✅ Firebase configuration loaded');
        console.log('📊 Project ID:', firebaseConfig.projectId);
        console.log('🔑 Auth Domain:', firebaseConfig.authDomain);
        return true;
    } else {
        console.log('❌ Firebase configuration not found');
        return false;
    }
}

// Test 3: Check Firebase services
function testFirebaseServices() {
    console.log('📋 Test 3: Firebase Services');
    
    let allServicesWorking = true;
    
    // Check Auth service
    if (typeof auth !== 'undefined' && auth) {
        console.log('✅ Firebase Auth service available');
    } else {
        console.log('❌ Firebase Auth service not available');
        allServicesWorking = false;
    }
    
    // Check Database service
    if (typeof db !== 'undefined' && db) {
        console.log('✅ Firebase Database service available');
    } else {
        console.log('❌ Firebase Database service not available');
        allServicesWorking = false;
    }
    
    return allServicesWorking;
}

// Test 4: Test authentication functions
async function testAuthFunctions() {
    console.log('📋 Test 4: Authentication Functions');
    
    let allFunctionsWorking = true;
    
    // Test signInWithEmailAndPassword
    if (typeof auth !== 'undefined' && auth.signInWithEmailAndPassword) {
        console.log('✅ signInWithEmailAndPassword function available');
    } else {
        console.log('❌ signInWithEmailAndPassword function not available');
        allFunctionsWorking = false;
    }
    
    // Test createUserWithEmailAndPassword
    if (typeof auth !== 'undefined' && auth.createUserWithEmailAndPassword) {
        console.log('✅ createUserWithEmailAndPassword function available');
    } else {
        console.log('❌ createUserWithEmailAndPassword function not available');
        allFunctionsWorking = false;
    }
    
    // Test signOut
    if (typeof auth !== 'undefined' && auth.signOut) {
        console.log('✅ signOut function available');
    } else {
        console.log('❌ signOut function not available');
        allFunctionsWorking = false;
    }
    
    return allFunctionsWorking;
}

// Test 5: Test database functions
function testDatabaseFunctions() {
    console.log('📋 Test 5: Database Functions');
    
    let allFunctionsWorking = true;
    
    // Test saveToFirebase
    if (typeof saveToFirebase === 'function') {
        console.log('✅ saveToFirebase function available');
    } else {
        console.log('❌ saveToFirebase function not available');
        allFunctionsWorking = false;
    }
    
    // Test getFromFirebase
    if (typeof getFromFirebase === 'function') {
        console.log('✅ getFromFirebase function available');
    } else {
        console.log('❌ getFromFirebase function not available');
        allFunctionsWorking = false;
    }
    
    return allFunctionsWorking;
}

// Test 6: Test fallback system
function testFallbackSystem() {
    console.log('📋 Test 6: Fallback System');
    
    try {
        // Test localStorage
        const testData = { test: 'fallback', timestamp: Date.now() };
        localStorage.setItem('firebase_test', JSON.stringify(testData));
        const retrieved = JSON.parse(localStorage.getItem('firebase_test'));
        
        if (retrieved && retrieved.test === 'fallback') {
            console.log('✅ Fallback system (localStorage) working');
            return true;
        } else {
            console.log('❌ Fallback system not working');
            return false;
        }
    } catch (error) {
        console.log('❌ Fallback system error:', error.message);
        return false;
    }
}

// Test 7: Test error handling
function testErrorHandling() {
    console.log('📋 Test 7: Error Handling');
    
    if (typeof handleFirebaseError === 'function') {
        console.log('✅ handleFirebaseError function available');
        return true;
    } else {
        console.log('❌ handleFirebaseError function not available');
        return false;
    }
}

// Test 8: Test notification system
function testNotificationSystem() {
    console.log('📋 Test 8: Notification System');
    
    if (typeof showFirebaseNotification === 'function') {
        console.log('✅ showFirebaseNotification function available');
        return true;
    } else {
        console.log('❌ showFirebaseNotification function not available');
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Starting comprehensive Firebase tests...\n');
    
    const tests = [
        { name: 'Firebase SDK', fn: testFirebaseSDK },
        { name: 'Firebase Config', fn: testFirebaseConfig },
        { name: 'Firebase Services', fn: testFirebaseServices },
        { name: 'Auth Functions', fn: testAuthFunctions },
        { name: 'Database Functions', fn: testDatabaseFunctions },
        { name: 'Fallback System', fn: testFallbackSystem },
        { name: 'Error Handling', fn: testErrorHandling },
        { name: 'Notification System', fn: testNotificationSystem }
    ];
    
    let passedTests = 0;
    let totalTests = tests.length;
    
    for (const test of tests) {
        try {
            const result = await test.fn();
            if (result) {
                passedTests++;
            }
        } catch (error) {
            console.log(`❌ ${test.name} test failed:`, error.message);
        }
        console.log(''); // Add spacing between tests
    }
    
    // Final summary
    console.log('📊 TEST SUMMARY');
    console.log('================');
    console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
    console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! Firebase is working perfectly.');
    } else if (passedTests >= totalTests * 0.8) {
        console.log('⚠️ Most tests passed. Firebase is working with minor issues.');
    } else {
        console.log('❌ Many tests failed. Firebase needs attention.');
    }
    
    return passedTests === totalTests;
}

// Export for use in browser console
window.runFirebaseTests = runAllTests;
window.testFirebaseSDK = testFirebaseSDK;
window.testFirebaseConfig = testFirebaseConfig;
window.testFirebaseServices = testFirebaseServices;
window.testAuthFunctions = testAuthFunctions;
window.testDatabaseFunctions = testDatabaseFunctions;
window.testFallbackSystem = testFallbackSystem;
window.testErrorHandling = testErrorHandling;
window.testNotificationSystem = testNotificationSystem;

console.log('🔥 Firebase Quick Test Script loaded');
console.log('💡 Run runFirebaseTests() to start testing');
