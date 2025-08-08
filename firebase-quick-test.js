// Firebase Quick Test Script
// Run this in the browser console to test all Firebase functionality

console.log('🔥 Starting Firebase Quick Test...');

const testResults = {
    sdk: false,
    config: false,
    auth: false,
    database: false,
    functions: false,
    fallback: false
};

async function runFirebaseTests() {
    console.log('🧪 Running comprehensive Firebase tests...');
    
    // Test 1: SDK Loading
    console.log('\n📦 Test 1: Firebase SDK Loading');
    try {
        if (typeof firebase !== 'undefined') {
            console.log('✅ Firebase SDK loaded');
            testResults.sdk = true;
        } else {
            console.log('❌ Firebase SDK not loaded');
        }
    } catch (error) {
        console.log('❌ SDK test failed:', error.message);
    }
    
    // Test 2: Configuration
    console.log('\n⚙️ Test 2: Firebase Configuration');
    try {
        if (typeof firebaseConfig !== 'undefined' && firebaseConfig.apiKey) {
            console.log('✅ Firebase configuration loaded');
            console.log('📋 Project ID:', firebaseConfig.projectId);
            console.log('🔑 API Key:', firebaseConfig.apiKey ? 'Configured' : 'Missing');
            testResults.config = true;
        } else {
            console.log('❌ Firebase configuration not found');
        }
    } catch (error) {
        console.log('❌ Configuration test failed:', error.message);
    }
    
    // Test 3: Authentication
    console.log('\n🔐 Test 3: Firebase Authentication');
    try {
        if (typeof auth !== 'undefined' && auth) {
            console.log('✅ Firebase Auth service available');
            testResults.auth = true;
        } else {
            console.log('❌ Firebase Auth service not available');
        }
    } catch (error) {
        console.log('❌ Auth test failed:', error.message);
    }
    
    // Test 4: Database
    console.log('\n💾 Test 4: Firebase Database');
    try {
        if (typeof db !== 'undefined' && db) {
            console.log('✅ Firebase Database service available');
            testResults.database = true;
        } else {
            console.log('❌ Firebase Database service not available');
        }
    } catch (error) {
        console.log('❌ Database test failed:', error.message);
    }
    
    // Test 5: Custom Functions
    console.log('\n🔧 Test 5: Custom Firebase Functions');
    try {
        const functions = [
            'testFirebaseConnection',
            'saveToFirebase',
            'getFromFirebase',
            'authenticateUser',
            'signOutUser'
        ];
        
        let availableFunctions = 0;
        functions.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                console.log(`✅ ${funcName} available`);
                availableFunctions++;
            } else {
                console.log(`❌ ${funcName} not available`);
            }
        });
        
        if (availableFunctions === functions.length) {
            console.log('✅ All custom functions available');
            testResults.functions = true;
        } else {
            console.log(`⚠️ ${availableFunctions}/${functions.length} functions available`);
        }
    } catch (error) {
        console.log('❌ Functions test failed:', error.message);
    }
    
    // Test 6: Fallback System
    console.log('\n🛡️ Test 6: Fallback System');
    try {
        const testData = { test: 'fallback', timestamp: Date.now() };
        localStorage.setItem('firebase_test_fallback', JSON.stringify(testData));
        const retrieved = JSON.parse(localStorage.getItem('firebase_test_fallback'));
        
        if (retrieved && retrieved.test === 'fallback') {
            console.log('✅ Fallback system working');
            testResults.fallback = true;
        } else {
            console.log('❌ Fallback system not working');
        }
        
        // Clean up
        localStorage.removeItem('firebase_test_fallback');
    } catch (error) {
        console.log('❌ Fallback test failed:', error.message);
    }
    
    // Test 7: Connection Test
    console.log('\n🔗 Test 7: Firebase Connection');
    try {
        if (typeof testFirebaseConnection === 'function') {
            const result = await testFirebaseConnection();
            if (result) {
                console.log('✅ Firebase connection successful');
            } else {
                console.log('⚠️ Firebase connection failed, using fallback');
            }
        } else {
            console.log('❌ Connection test function not available');
        }
    } catch (error) {
        console.log('❌ Connection test failed:', error.message);
    }
    
    // Generate Summary
    console.log('\n📊 Test Summary');
    console.log('================');
    
    const totalTests = Object.keys(testResults).length;
    const passedTests = Object.values(testResults).filter(result => result === true).length;
    const percentage = (passedTests / totalTests) * 100;
    
    console.log(`📈 Overall Score: ${passedTests}/${totalTests} (${percentage.toFixed(1)}%)`);
    
    Object.entries(testResults).forEach(([test, result]) => {
        const status = result ? '✅ PASS' : '❌ FAIL';
        console.log(`${status} ${test.toUpperCase()}`);
    });
    
    if (percentage >= 80) {
        console.log('\n🎉 Firebase integration is working well!');
    } else if (percentage >= 60) {
        console.log('\n⚠️ Firebase integration has some issues but fallbacks are working');
    } else {
        console.log('\n❌ Firebase integration needs attention');
    }
    
    return testResults;
}

// Auto-run tests when script is loaded
if (typeof window !== 'undefined') {
    console.log('🚀 Firebase Quick Test loaded. Run runFirebaseTests() to start testing.');
    
    // Auto-run after a short delay
    setTimeout(() => {
        console.log('🔄 Auto-running Firebase tests...');
        runFirebaseTests();
    }, 2000);
}

// Export for manual testing
if (typeof window !== 'undefined') {
    window.runFirebaseTests = runFirebaseTests;
    window.testResults = testResults;
}

