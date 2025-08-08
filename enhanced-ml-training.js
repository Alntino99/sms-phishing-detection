// Enhanced ML Training System
// Comprehensive training data and improved training parameters for all 5 ML models

// ===== ENHANCED TRAINING DATA =====
const enhancedTrainingData = [
  // PHISHING EXAMPLES (50 total) - More diverse and realistic
  { text: "URGENT: Your bank account has been SUSPENDED! Click here to verify: bit.ly/fake-bank", label: "phishing" },
  { text: "Your account has been compromised. Verify your identity immediately at secure-verify.net", label: "phishing" },
  { text: "CONGRATULATIONS! You've won $1000! Claim your prize now at free-gift.com", label: "phishing" },
  { text: "Tax refund available. Click here to claim your payment: irs-payment.gov", label: "phishing" },
  { text: "Your package delivery is pending. Track your order at: track-order.com", label: "phishing" },
  { text: "Security alert: Unauthorized login detected. Verify account at bank-security.com", label: "phishing" },
  { text: "Your credit card has been locked. Call 1-800-123-4567 to unlock immediately", label: "phishing" },
  { text: "You have inherited $500,000! Contact lawyer immediately for transfer", label: "phishing" },
  { text: "Your Netflix account will be suspended. Update payment info now", label: "phishing" },
  { text: "Bitcoin investment opportunity! Double your money in 24 hours", label: "phishing" },
  { text: "Your PayPal account has been limited. Verify your identity at paypal-verify.com", label: "phishing" },
  { text: "Your Amazon order has been cancelled. Click here to reactivate: amazon-order.com", label: "phishing" },
  { text: "Your Google account security alert. Verify at google-security.com", label: "phishing" },
  { text: "Your Apple ID has been locked. Unlock now at apple-verify.com", label: "phishing" },
  { text: "Your Microsoft account needs verification. Click here: microsoft-verify.com", label: "phishing" },
  { text: "Your bank card has been blocked. Call 1-888-456-7890 to unblock", label: "phishing" },
  { text: "Your account balance is low. Add funds now at secure-payment.com", label: "phishing" },
  { text: "Your password will expire in 24 hours. Update now at password-reset.com", label: "phishing" },
  { text: "Your account has suspicious activity. Verify at security-check.com", label: "phishing" },
  { text: "Your delivery is delayed. Track at delivery-status.com", label: "phishing" },
  { text: "Your account needs immediate attention. Click here: account-alert.com", label: "phishing" },
  { text: "Your payment failed. Update billing info at payment-update.com", label: "phishing" },
  { text: "Your account is under review. Verify details at account-verify.com", label: "phishing" },
  { text: "Your login attempt failed. Secure your account at login-secure.com", label: "phishing" },
  { text: "Your account has been flagged. Resolve at account-resolve.com", label: "phishing" },
  { text: "Your subscription payment declined. Update at payment-fix.com", label: "phishing" },
  { text: "Your account has been suspended due to suspicious activity", label: "phishing" },
  { text: "Click here to verify your identity immediately", label: "phishing" },
  { text: "You have won a prize! Claim your reward now", label: "phishing" },
  { text: "Your password has expired. Reset now", label: "phishing" },
  { text: "Security alert: Unusual login detected", label: "phishing" },
  { text: "Your bank account has been locked", label: "phishing" },
  { text: "Verify your payment information", label: "phishing" },
  { text: "Your package delivery is pending", label: "phishing" },
  { text: "Your account has been compromised. Act now", label: "phishing" },
  { text: "Your credit card has been suspended", label: "phishing" },
  { text: "Your account needs immediate verification", label: "phishing" },
  { text: "Your payment has been declined", label: "phishing" },
  { text: "Your account is under investigation", label: "phishing" },
  { text: "Your login has been blocked", label: "phishing" },
  { text: "Your account has been flagged for review", label: "phishing" },
  { text: "Your subscription has been cancelled", label: "phishing" },
  { text: "Your account requires immediate attention", label: "phishing" },
  { text: "Your payment information needs updating", label: "phishing" },
  { text: "Your account has been temporarily suspended", label: "phishing" },
  { text: "Your login attempt was unsuccessful", label: "phishing" },
  { text: "Your account has been marked as suspicious", label: "phishing" },
  { text: "Your payment method has been declined", label: "phishing" },
  { text: "Your account is being reviewed", label: "phishing" },
  { text: "Your access has been restricted", label: "phishing" },
  { text: "Your account has been flagged for security", label: "phishing" },
  { text: "Your subscription payment failed", label: "phishing" },
  { text: "Your account requires verification", label: "phishing" },
  { text: "Your payment details need confirmation", label: "phishing" },
  { text: "Your account has been put on hold", label: "phishing" },
  { text: "Your login was unsuccessful", label: "phishing" },
  { text: "Your account has been marked for review", label: "phishing" },
  { text: "Your payment method was declined", label: "phishing" },
  { text: "Your account is under scrutiny", label: "phishing" },
  { text: "Your access has been limited", label: "phishing" },
  { text: "Your account has been flagged", label: "phishing" },
  { text: "Your subscription payment was declined", label: "phishing" },

  // SAFE EXAMPLES (50 total) - More diverse legitimate messages
  { text: "Hi John, can we meet for coffee tomorrow at 3 PM?", label: "safe" },
  { text: "Your order #12345 has been shipped. Expected delivery: Friday", label: "safe" },
  { text: "Thank you for your payment of $25.50. Your account is up to date", label: "safe" },
  { text: "Your appointment with Dr. Smith is confirmed for Tuesday at 2:30 PM", label: "safe" },
  { text: "Your flight UA123 has been delayed by 30 minutes. New departure: 3:45 PM", label: "safe" },
  { text: "Happy birthday! Hope you have a wonderful day", label: "safe" },
  { text: "Meeting reminder: Team standup tomorrow at 9 AM in conference room A", label: "safe" },
  { text: "Your library book 'The Great Gatsby' is due in 3 days", label: "safe" },
  { text: "Your gym membership will renew automatically on March 1st", label: "safe" },
  { text: "Weather alert: Rain expected this afternoon. Bring an umbrella", label: "safe" },
  { text: "Your prescription is ready for pickup at CVS Pharmacy", label: "safe" },
  { text: "Your electricity bill of $89.45 is due on March 15th", label: "safe" },
  { text: "Your car service appointment is confirmed for Friday at 10 AM", label: "safe" },
  { text: "Your online order has been delivered. Please check your porch", label: "safe" },
  { text: "Your credit card payment of $150 has been processed successfully", label: "safe" },
  { text: "Your hotel reservation for March 20-22 is confirmed", label: "safe" },
  { text: "Your dental cleaning appointment is scheduled for next Tuesday", label: "safe" },
  { text: "Your internet service will be temporarily unavailable for maintenance tonight", label: "safe" },
  { text: "Your Netflix subscription has been renewed for $15.99", label: "safe" },
  { text: "Your Amazon package will arrive tomorrow between 2-4 PM", label: "safe" },
  { text: "Your Uber ride has been completed. Total fare: $12.50", label: "safe" },
  { text: "Your Spotify Premium subscription is active until April 15th", label: "safe" },
  { text: "Your DoorDash order is being prepared. Estimated delivery: 25 minutes", label: "safe" },
  { text: "Your Google Drive storage is 85% full. Consider upgrading", label: "safe" },
  { text: "Your iPhone backup to iCloud has completed successfully", label: "safe" },
  { text: "Your Microsoft Office subscription will renew on April 1st", label: "safe" },
  { text: "Your LinkedIn profile has 5 new connection requests", label: "safe" },
  { text: "Your Instagram account has 3 new followers", label: "safe" },
  { text: "Your Twitter account has 2 new mentions", label: "safe" },
  { text: "Your Facebook friend request from Sarah has been accepted", label: "safe" },
  { text: "Your order has been confirmed", label: "safe" },
  { text: "Meeting reminder: Tomorrow at 2 PM", label: "safe" },
  { text: "Your package has been delivered", label: "safe" },
  { text: "Weather alert: Rain expected today", label: "safe" },
  { text: "Your appointment is confirmed", label: "safe" },
  { text: "Thank you for your payment", label: "safe" },
  { text: "Your subscription has been renewed", label: "safe" },
  { text: "Your account balance is $1,234.56", label: "safe" },
  { text: "Your order has been processed", label: "safe" },
  { text: "Your delivery is scheduled", label: "safe" },
  { text: "Your payment has been received", label: "safe" },
  { text: "Your account is active", label: "safe" },
  { text: "Your subscription is current", label: "safe" },
  { text: "Your order is being prepared", label: "safe" },
  { text: "Your delivery is on its way", label: "safe" },
  { text: "Your payment has been processed", label: "safe" },
  { text: "Your account is in good standing", label: "safe" },
  { text: "Your subscription is active", label: "safe" },
  { text: "Your order is confirmed", label: "safe" },
  { text: "Your delivery is scheduled", label: "safe" },
  { text: "Your payment has been confirmed", label: "safe" },
  { text: "Your account is verified", label: "safe" },
  { text: "Your subscription is valid", label: "safe" },
  { text: "Your order is being processed", label: "safe" },
  { text: "Your delivery is confirmed", label: "safe" },
  { text: "Your payment has been accepted", label: "safe" },
  { text: "Your account is confirmed", label: "safe" },
  { text: "Your subscription is confirmed", label: "safe" },
  { text: "Your order is being shipped", label: "safe" },
  { text: "Your delivery is in progress", label: "safe" },
  { text: "Your payment has been received", label: "safe" },
  { text: "Your account is active", label: "safe" },
  { text: "Your subscription is current", label: "safe" },
  { text: "Your order is being prepared", label: "safe" },
  { text: "Your delivery is on schedule", label: "safe" },
  { text: "Your payment has been processed", label: "safe" },
  { text: "Your account is in good standing", label: "safe" },
  { text: "Your subscription is active", label: "safe" }
];

// ===== ENHANCED TRAINING FUNCTION =====
function enhancedTrainAllModels() {
  console.log('🚀 Starting Enhanced ML Training...');
  
  const trainingStartTime = Date.now();
  
  try {
    // 1. Enhanced Naive Bayes Training
    console.log('📊 Training Naive Bayes Classifier...');
    naiveBayesClassifier.train(enhancedTrainingData);
    console.log('✅ Naive Bayes trained successfully');
    
    // 2. Enhanced LSTM Training (more epochs for better performance)
    console.log('🧠 Training LSTM Neural Network...');
    lstmClassifier.train(enhancedTrainingData, 10, 0.01); // 10 epochs, 0.01 learning rate
    console.log('✅ LSTM trained successfully');
    
    // 3. Enhanced SVM Training (more iterations for better convergence)
    console.log('🔧 Training Support Vector Machine...');
    svmClassifier.train(enhancedTrainingData, 200, 0.005); // 200 iterations, 0.005 learning rate
    console.log('✅ SVM trained successfully');
    
    // 4. Enhanced Decision Tree Training
    console.log('🌲 Training Decision Tree Classifier...');
    decisionTreeClassifier.train(enhancedTrainingData);
    console.log('✅ Decision Tree trained successfully');
    
    // 5. Enhanced CNN-LSTM Hybrid Training (more epochs for deep learning)
    console.log('🧠 Training CNN-LSTM Hybrid...');
    cnnLstmHybridClassifier.train(enhancedTrainingData, 15, 0.01); // 15 epochs, 0.01 learning rate
    console.log('✅ CNN-LSTM Hybrid trained successfully');
    
    // Mark models as ready
    mlModelsReady = true;
    const trainingTime = Date.now() - trainingStartTime;
    
    console.log('🎉 All ML Models Enhanced Training Complete!');
    console.log(`⏱️ Total training time: ${trainingTime}ms`);
    console.log('📊 Training Statistics:');
    console.log(`   - Training samples: ${enhancedTrainingData.length}`);
    console.log(`   - Phishing samples: ${enhancedTrainingData.filter(d => d.label === 'phishing').length}`);
    console.log(`   - Safe samples: ${enhancedTrainingData.filter(d => d.label === 'safe').length}`);
    console.log('✅ All models ready for prediction!');
    
    // Dispatch custom event to notify that models are ready
    window.dispatchEvent(new CustomEvent('mlModelsEnhancedReady'));
    
    return {
      success: true,
      trainingTime: trainingTime,
      sampleCount: enhancedTrainingData.length,
      modelsReady: true
    };
    
  } catch (error) {
    console.error('❌ Enhanced training error:', error);
    mlModelsReady = false;
    return {
      success: false,
      error: error.message
    };
  }
}

// ===== MODEL VALIDATION FUNCTION =====
function validateModels() {
  console.log('🔍 Validating ML Models...');
  
  const testMessages = [
    "Your bank account has been suspended. Click here to verify immediately!",
    "Hi Sarah, can we meet for lunch tomorrow?",
    "CONGRATULATIONS! You've won $5000! Claim now!",
    "Your package will be delivered tomorrow between 2-4 PM",
    "Your account has been compromised. Verify your identity now!",
    "Thank you for your payment. Your order has been confirmed."
  ];
  
  const results = {
    naiveBayes: [],
    lstm: [],
    svm: [],
    decisionTree: [],
    cnnLstm: []
  };
  
  testMessages.forEach((message, index) => {
    try {
      results.naiveBayes.push(naiveBayesClassifier.predict(message));
      results.lstm.push(lstmClassifier.predict(message));
      results.svm.push(svmClassifier.predict(message));
      results.decisionTree.push(decisionTreeClassifier.predict(message));
      results.cnnLstm.push(cnnLstmHybridClassifier.predict(message));
    } catch (error) {
      console.error(`Model validation error for message ${index}:`, error);
    }
  });
  
  console.log('✅ Model validation complete!');
  console.log('📊 Validation Results:', results);
  
  return results;
}

// ===== TRAINING STATUS CHECK =====
function checkTrainingStatus() {
  const status = {
    naiveBayes: naiveBayesClassifier && naiveBayesClassifier.isTrained,
    lstm: lstmClassifier && lstmClassifier.isTrained,
    svm: svmClassifier && svmClassifier.isTrained,
    decisionTree: decisionTreeClassifier && decisionTreeClassifier.isTrained,
    cnnLstm: cnnLstmHybridClassifier && cnnLstmHybridClassifier.isTrained,
    allReady: mlModelsReady
  };
  
  console.log('📋 Training Status:', status);
  return status;
}

// Export functions for global access
window.enhancedTrainAllModels = enhancedTrainAllModels;
window.validateModels = validateModels;
window.checkTrainingStatus = checkTrainingStatus;
window.enhancedTrainingData = enhancedTrainingData;

console.log('🚀 Enhanced ML Training System loaded successfully!');
console.log('📊 Training data contains', enhancedTrainingData.length, 'samples');
console.log('💡 Use enhancedTrainAllModels() to start enhanced training');
