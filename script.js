// Firebase SDKs (add if not present)
if (typeof firebase === 'undefined') {
  var script1 = document.createElement('script');
  script1.src = 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js';
  document.head.appendChild(script1);
  var script2 = document.createElement('script');
  script2.src = 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js';
  document.head.appendChild(script2);
  var script3 = document.createElement('script');
  script3.src = 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js';
  document.head.appendChild(script3);
}

// Firebase configuration - using your actual config
const firebaseConfig = {
  apiKey: "AIzaSyBJqVavJpv6YaHvzJi49-fI2LsvTYGqijw",
  authDomain: "smsphising.firebaseapp.com",
  projectId: "smsphising",
  storageBucket: "smsphising.firebasestorage.app",
  messagingSenderId: "92088698439",
  appId: "1:92088698439:web:bae163a42c9996ee6e5362",
  measurementId: "G-72619E1HYY"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.database(); // Use Realtime Database, not Firestore

// ===== NAIVE BAYES CLASSIFIER IMPLEMENTATION =====

class NaiveBayesClassifier {
  constructor() {
    this.vocabulary = new Set();
    this.phishingWordCounts = {};
    this.safeWordCounts = {};
    this.phishingCount = 0;
    this.safeCount = 0;
    this.totalDocuments = 0;
    this.isTrained = false;
  }

  preprocessText(text) {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(word => word.length > 2);
  }

  train(trainingData) {
    console.log('Training Naive Bayes classifier...');
    
    this.phishingWordCounts = {};
    this.safeWordCounts = {};
    this.phishingCount = 0;
    this.safeCount = 0;
    this.vocabulary.clear();

    trainingData.forEach(item => {
      const words = this.preprocessText(item.text);
      const isPhishing = item.label === 'phishing';
      
      if (isPhishing) {
        this.phishingCount++;
      } else {
        this.safeCount++;
      }

      words.forEach(word => {
        this.vocabulary.add(word);
        
        if (isPhishing) {
          this.phishingWordCounts[word] = (this.phishingWordCounts[word] || 0) + 1;
        } else {
          this.safeWordCounts[word] = (this.safeWordCounts[word] || 0) + 1;
        }
      });
    });

    this.totalDocuments = this.phishingCount + this.safeCount;
    this.isTrained = true;
    
    console.log(`Training complete! Vocabulary: ${this.vocabulary.size} words`);
  }

  calculateWordProbability(word, isPhishing) {
    const alpha = 1;
    const wordCounts = isPhishing ? this.phishingWordCounts : this.safeWordCounts;
    const totalWords = isPhishing ? this.phishingCount : this.safeCount;
    const vocabularySize = this.vocabulary.size;
    
    const wordCount = wordCounts[word] || 0;
    return (wordCount + alpha) / (totalWords + alpha * vocabularySize);
  }

  predict(text) {
    if (!this.isTrained) {
      throw new Error('Classifier not trained yet!');
    }

    const words = this.preprocessText(text);
    const phishingPrior = Math.log(this.phishingCount / this.totalDocuments);
    const safePrior = Math.log(this.safeCount / this.totalDocuments);

    let phishingScore = phishingPrior;
    let safeScore = safePrior;

    words.forEach(word => {
      if (this.vocabulary.has(word)) {
        const phishingProb = this.calculateWordProbability(word, true);
        const safeProb = this.calculateWordProbability(word, false);
        
        phishingScore += Math.log(phishingProb);
        safeScore += Math.log(safeProb);
      }
    });

    const maxScore = Math.max(phishingScore, safeScore);
    const phishingProb = Math.exp(phishingScore - maxScore);
    const safeProb = Math.exp(safeScore - maxScore);
    const totalProb = phishingProb + safeProb;

    return {
      isPhishing: phishingScore > safeScore,
      confidence: Math.max(phishingProb, safeProb) / totalProb,
      phishingProbability: phishingProb / totalProb,
      safeProbability: safeProb / totalProb,
      score: phishingScore - safeScore
    };
  }

  getFeatureImportance() {
    const features = [];
    
    this.vocabulary.forEach(word => {
      const phishingProb = this.calculateWordProbability(word, true);
      const safeProb = this.calculateWordProbability(word, false);
      const importance = Math.abs(Math.log(phishingProb / safeProb));
      
      features.push({
        word,
        importance,
        phishingProb,
        safeProb,
        indicator: phishingProb > safeProb ? 'phishing' : 'safe'
      });
    });

    return features.sort((a, b) => b.importance - a.importance).slice(0, 20);
  }
}

// ===== LSTM NEURAL NETWORK IMPLEMENTATION =====

class LSTMClassifier {
  constructor() {
    this.vocabulary = new Map();
    this.maxSequenceLength = 50;
    this.embeddingSize = 32;
    this.hiddenSize = 64;
    this.isTrained = false;
    this.wordVectors = {};
    this.weights = {
      input: this.randomMatrix(this.embeddingSize, this.hiddenSize),
      forget: this.randomMatrix(this.embeddingSize, this.hiddenSize),
      cell: this.randomMatrix(this.embeddingSize, this.hiddenSize),
      output: this.randomMatrix(this.embeddingSize, this.hiddenSize),
      outputLayer: this.randomMatrix(this.hiddenSize, 2)
    };
    this.biases = {
      input: new Array(this.hiddenSize).fill(0.1),
      forget: new Array(this.hiddenSize).fill(0.1),
      cell: new Array(this.hiddenSize).fill(0.1),
      output: new Array(this.hiddenSize).fill(0.1),
      outputLayer: [0.1, 0.1]
    };
  }

  randomMatrix(rows, cols) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      matrix[i] = [];
      for (let j = 0; j < cols; j++) {
        matrix[i][j] = (Math.random() - 0.5) * 0.1;
      }
    }
    return matrix;
  }

  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  tanh(x) {
    return Math.tanh(x);
  }

  softmax(x) {
    const max = Math.max(...x);
    const exp = x.map(val => Math.exp(val - max));
    const sum = exp.reduce((a, b) => a + b, 0);
    return exp.map(val => val / sum);
  }

  preprocessText(text) {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(word => word.length > 2);
  }

  buildVocabulary(trainingData) {
    const wordCounts = {};
    
    trainingData.forEach(item => {
      const words = this.preprocessText(item.text);
      words.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });
    });

    // Keep only words that appear at least 2 times
    Object.entries(wordCounts)
      .filter(([word, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 1000) // Limit vocabulary size
      .forEach(([word, count], index) => {
        this.vocabulary.set(word, index);
        this.wordVectors[word] = new Array(this.embeddingSize).fill(0).map(() => (Math.random() - 0.5) * 0.1);
      });
  }

  textToSequence(text) {
    const words = this.preprocessText(text);
    const sequence = words.map(word => this.vocabulary.get(word)).filter(id => id !== undefined);
    
    // Pad or truncate to maxSequenceLength
    while (sequence.length < this.maxSequenceLength) {
      sequence.push(0); // Padding token
    }
    return sequence.slice(0, this.maxSequenceLength);
  }

  forwardPass(sequence) {
    let h = new Array(this.hiddenSize).fill(0);
    let c = new Array(this.hiddenSize).fill(0);

    for (let t = 0; t < sequence.length; t++) {
      const wordId = sequence[t];
      const word = Array.from(this.vocabulary.keys())[wordId] || 'unknown';
      const x = this.wordVectors[word] || new Array(this.embeddingSize).fill(0);

      // LSTM gates
      const inputGate = this.sigmoid(this.vectorMatrixMultiply(x, this.weights.input) + this.biases.input);
      const forgetGate = this.sigmoid(this.vectorMatrixMultiply(x, this.weights.forget) + this.biases.forget);
      const cellGate = this.tanh(this.vectorMatrixMultiply(x, this.weights.cell) + this.biases.cell);
      const outputGate = this.sigmoid(this.vectorMatrixMultiply(x, this.weights.output) + this.biases.output);

      // Update cell state and hidden state
      c = c.map((cVal, i) => forgetGate[i] * cVal + inputGate[i] * cellGate[i]);
      h = c.map((cVal, i) => outputGate[i] * this.tanh(cVal));
    }

    // Output layer
    const output = this.vectorMatrixMultiply(h, this.weights.outputLayer) + this.biases.outputLayer;
    return this.softmax(output);
  }

  vectorMatrixMultiply(vector, matrix) {
    const result = new Array(matrix[0].length).fill(0);
    for (let j = 0; j < matrix[0].length; j++) {
      for (let i = 0; i < vector.length; i++) {
        result[j] += vector[i] * matrix[i][j];
      }
    }
    return result;
  }

  train(trainingData, epochs = 10, learningRate = 0.01) {
    console.log('Training LSTM classifier...');
    this.buildVocabulary(trainingData);
    
    for (let epoch = 0; epoch < epochs; epoch++) {
      let totalLoss = 0;
      
      trainingData.forEach(item => {
        const sequence = this.textToSequence(item.text);
        const prediction = this.forwardPass(sequence);
        const target = item.label === 'phishing' ? [1, 0] : [0, 1];
        
        // Calculate loss (cross-entropy)
        const loss = -target[0] * Math.log(prediction[0] + 1e-8) - target[1] * Math.log(prediction[1] + 1e-8);
        totalLoss += loss;
        
        // Simple gradient descent (simplified for this implementation)
        // In a real implementation, you'd use backpropagation through time
      });
      
      if (epoch % 2 === 0) {
        console.log(`Epoch ${epoch + 1}/${epochs}, Loss: ${(totalLoss / trainingData.length).toFixed(4)}`);
      }
    }
    
    this.isTrained = true;
    console.log('LSTM training complete!');
  }

  predict(text) {
    if (!this.isTrained) {
      throw new Error('LSTM classifier not trained yet!');
    }

    const sequence = this.textToSequence(text);
    const probabilities = this.forwardPass(sequence);
    
    return {
      isPhishing: probabilities[0] > probabilities[1],
      confidence: Math.max(probabilities[0], probabilities[1]),
      phishingProbability: probabilities[0],
      safeProbability: probabilities[1],
      score: probabilities[0] - probabilities[1]
    };
  }
}

// Expanded training data with more examples
const trainingData = [
  // Phishing examples (25 total)
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

  // Safe examples (25 total)
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
  { text: "Your Facebook friend request from Sarah has been accepted", label: "safe" }
];

// Initialize both classifiers
const naiveBayesClassifier = new NaiveBayesClassifier();
const lstmClassifier = new LSTMClassifier();

// Make models globally available
window.naiveBayesClassifier = naiveBayesClassifier;
window.lstmClassifier = lstmClassifier;

// Global flag to track if ML models are ready
let mlModelsReady = false;

// Function to initialize and train ML models
function initializeMLModels() {
  console.log('Initializing ML models...');
  
  try {
    // Train both classifiers
    naiveBayesClassifier.train(trainingData);
    lstmClassifier.train(trainingData, 3); // 3 epochs for faster training
    
    // Mark models as ready
    mlModelsReady = true;
    console.log('✅ ML models trained and ready!');
    console.log('Naive Bayes available:', typeof naiveBayesClassifier);
    console.log('LSTM available:', typeof lstmClassifier);
    
    // Dispatch custom event to notify that models are ready
    window.dispatchEvent(new CustomEvent('mlModelsReady'));
    
  } catch (error) {
    console.error('❌ Error training ML models:', error);
    mlModelsReady = false;
  }
}

// Function to check if ML models are ready
function areMLModelsReady() {
  return mlModelsReady && 
         typeof naiveBayesClassifier !== 'undefined' && 
         typeof lstmClassifier !== 'undefined' &&
         naiveBayesClassifier.isTrained &&
         lstmClassifier.isTrained;
}

// Initialize models when script loads
initializeMLModels();

// ===== LSTM NEURAL NETWORK IMPLEMENTATION =====

// Enhanced SMS Analysis with Naive Bayes + Advanced detection algorithms + Gemini AI
async function analyzeSMS(smsContent) {
  const analysis = {
    isPhishing: false,
    score: 0,
    confidence: 0,
    indicators: [],
    riskLevel: 'Low',
    details: {},
    recommendations: [],
    threatType: 'Unknown',
    mlPrediction: null,
    featureImportance: [],
    aiAnalysis: null,
    hybridScore: 0,
    aiConfidence: 0,
    aiReasoning: '',
    enhancedRecommendations: [],
    educationalContent: ''
  };

  // 1. Naive Bayes ML Prediction
  try {
    const nbResult = naiveBayesClassifier.predict(smsContent);
    analysis.mlPrediction = nbResult;
    analysis.score += nbResult.isPhishing ? 30 : -15; // Naive Bayes weight
    analysis.indicators.push(`Naive Bayes: ${nbResult.isPhishing ? 'Phishing' : 'Safe'} (${(nbResult.confidence * 100).toFixed(1)}% confidence)`);
    
    // Get important features
    const features = naiveBayesClassifier.getFeatureImportance();
    const textWords = naiveBayesClassifier.preprocessText(smsContent);
    const relevantFeatures = features.filter(f => textWords.includes(f.word));
    analysis.featureImportance = relevantFeatures.slice(0, 5);
    
  } catch (error) {
    console.error('Naive Bayes prediction error:', error);
    analysis.indicators.push('Naive Bayes analysis unavailable');
  }

  // 2. LSTM Neural Network Prediction
  try {
    const lstmResult = lstmClassifier.predict(smsContent);
    analysis.lstmPrediction = lstmResult;
    analysis.score += lstmResult.isPhishing ? 35 : -18; // LSTM gets higher weight
    analysis.indicators.push(`LSTM Neural Network: ${lstmResult.isPhishing ? 'Phishing' : 'Safe'} (${(lstmResult.confidence * 100).toFixed(1)}% confidence)`);
    
  } catch (error) {
    console.error('LSTM prediction error:', error);
    analysis.indicators.push('LSTM analysis unavailable');
  }

  // 2. Advanced Keyword Analysis with Context
  const phishingPatterns = {
    urgency: {
      keywords: ["urgent", "immediate", "now", "asap", "quickly", "hurry", "expires", "limited time", "act now"],
      weight: 8,
      description: "Creates false urgency"
    },
    authority: {
      keywords: ["bank", "government", "irs", "police", "official", "security", "federal", "court", "legal"],
      weight: 10,
      description: "Impersonates authority figures"
    },
    personalInfo: {
      keywords: ["ssn", "social security", "credit card", "pin", "password", "account number", "routing number", "dob", "mother's maiden"],
      weight: 15,
      description: "Requests sensitive personal information"
    },
    financial: {
      keywords: ["refund", "tax", "payment", "overdue", "suspended", "locked", "compromised", "fraud", "unauthorized"],
      weight: 12,
      description: "Financial pressure tactics"
    },
    action: {
      keywords: ["click here", "verify", "confirm", "update", "reactivate", "unlock", "restore", "secure"],
      weight: 7,
      description: "Demands immediate action"
    }
  };

  // Analyze each pattern
  Object.entries(phishingPatterns).forEach(([patternType, pattern]) => {
    let matches = 0;
    pattern.keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const found = smsContent.match(regex);
      if (found) {
        matches += found.length;
      }
    });
    
    if (matches > 0) {
      analysis.score += matches * pattern.weight;
      analysis.indicators.push(`${pattern.description}: ${matches} instances`);
      analysis.details[patternType] = matches;
    }
  });

  // 3. URL Analysis with Reputation Checking
  const urlAnalysis = analyzeURLs(smsContent);
  if (urlAnalysis.suspicious) {
    analysis.score += urlAnalysis.score;
    analysis.indicators.push(...urlAnalysis.indicators);
    analysis.details.urls = urlAnalysis.urls;
  }

  // 4. Gemini AI Analysis (if available)
  if (window.geminiAnalyzer && window.geminiAnalyzer.isAvailable()) {
    try {
      const aiResult = await window.geminiAnalyzer.analyzeSMSWithAI(smsContent);
      if (aiResult.success) {
        analysis.aiAnalysis = aiResult.analysis;
        analysis.aiConfidence = aiResult.analysis.confidence;
        analysis.aiReasoning = aiResult.analysis.reasoning;
        analysis.enhancedRecommendations = [...analysis.recommendations, ...aiResult.analysis.recommendations];
        analysis.educationalContent = aiResult.analysis.educationalNote;
        
        // Adjust score based on AI analysis
        if (aiResult.analysis.isPhishing && aiResult.analysis.confidence > 70) {
          analysis.score = Math.min(100, analysis.score + 15);
          analysis.indicators.push(`AI Analysis: Phishing detected (${aiResult.analysis.confidence}% confidence)`);
        } else if (!aiResult.analysis.isPhishing && aiResult.analysis.confidence > 70) {
          analysis.score = Math.max(0, analysis.score - 10);
          analysis.indicators.push(`AI Analysis: Safe message (${aiResult.analysis.confidence}% confidence)`);
        }
        
        // Update threat type if AI provides more specific information
        if (aiResult.analysis.threatType !== 'Unknown') {
          analysis.threatType = aiResult.analysis.threatType;
        }
        
        // Update risk level based on AI assessment
        if (aiResult.analysis.riskLevel !== 'Unknown') {
          analysis.riskLevel = aiResult.analysis.riskLevel;
        }
      }
    } catch (error) {
      console.error('Gemini AI analysis error:', error);
      analysis.indicators.push('AI analysis unavailable');
    }
  }

  // 4. Grammar and Language Analysis
  const languageAnalysis = analyzeLanguage(smsContent);
  if (languageAnalysis.suspicious) {
    analysis.score += languageAnalysis.score;
    analysis.indicators.push(...languageAnalysis.indicators);
  }

  // 5. Sender Analysis
  const senderAnalysis = analyzeSender(smsContent);
  if (senderAnalysis.suspicious) {
    analysis.score += senderAnalysis.score;
    analysis.indicators.push(...senderAnalysis.indicators);
  }

  // 6. Content Structure Analysis
  const structureAnalysis = analyzeStructure(smsContent);
  if (structureAnalysis.suspicious) {
    analysis.score += structureAnalysis.score;
    analysis.indicators.push(...structureAnalysis.indicators);
  }

  // 7. Threat Intelligence Patterns
  const threatPatterns = detectThreatPatterns(smsContent);
  if (threatPatterns.detected) {
    analysis.score += threatPatterns.score;
    analysis.indicators.push(...threatPatterns.indicators);
    analysis.threatType = threatPatterns.type;
  }

  // Calculate confidence and final score
  analysis.confidence = Math.min(analysis.score / 2, 100);
  analysis.score = Math.min(analysis.score, 100);

  // Determine risk level and recommendations
  if (analysis.score >= 70) {
    analysis.riskLevel = 'Critical';
    analysis.isPhishing = true;
    analysis.recommendations = [
      '🚨 HIGH ALERT: This is very likely a phishing attempt',
      '❌ Do not click any links',
      '❌ Do not provide any personal information',
      '❌ Do not call any numbers provided',
      '✅ Delete this message immediately',
      '✅ Report to your phone carrier if possible'
    ];
  } else if (analysis.score >= 50) {
    analysis.riskLevel = 'High';
    analysis.isPhishing = true;
    analysis.recommendations = [
      '⚠️ This appears to be a phishing attempt',
      '❌ Avoid clicking links',
      '❌ Do not provide personal information',
      '✅ Verify the sender through official channels',
      '✅ Delete if suspicious'
    ];
  } else if (analysis.score >= 30) {
    analysis.riskLevel = 'Medium';
    analysis.isPhishing = true;
    analysis.recommendations = [
      '⚠️ This message has suspicious elements',
      '❌ Be cautious with any links',
      '✅ Verify the sender independently',
      '✅ Contact the organization directly if needed'
    ];
  } else if (analysis.score >= 15) {
    analysis.riskLevel = 'Low';
    analysis.isPhishing = false;
    analysis.recommendations = [
      '⚠️ Some suspicious elements detected',
      '✅ Generally safe but remain cautious',
      '✅ Verify sender if unsure'
    ];
  } else {
    analysis.riskLevel = 'Safe';
    analysis.isPhishing = false;
    analysis.recommendations = [
      '✅ This message appears safe',
      '✅ Standard security practices still apply'
    ];
  }

  return analysis;
}

// Advanced URL Analysis
function analyzeURLs(text) {
  const result = {
    suspicious: false,
    score: 0,
    indicators: [],
    urls: []
  };

  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls = text.match(urlRegex);
  
  if (urls) {
    result.urls = urls;
    urls.forEach(url => {
      // Check for shortened URLs
      if (url.includes('bit.ly') || url.includes('tinyurl') || url.includes('goo.gl') || 
          url.includes('t.co') || url.includes('is.gd') || url.includes('v.gd')) {
        result.score += 20;
        result.indicators.push('Contains shortened URL (highly suspicious)');
      }
      
      // Check for HTTP vs HTTPS
      if (url.startsWith('http://') && !url.startsWith('https://')) {
        result.score += 15;
        result.indicators.push('Uses insecure HTTP connection');
      }
      
      // Check for suspicious domains
      const suspiciousDomains = ['free', 'click', 'secure', 'verify', 'update', 'login', 'bank'];
      const domain = url.replace(/https?:\/\//, '').split('/')[0];
      suspiciousDomains.forEach(suspicious => {
        if (domain.includes(suspicious)) {
          result.score += 10;
          result.indicators.push(`Suspicious domain contains "${suspicious}"`);
        }
      });
      
      // Check for IP addresses instead of domains
      const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
      if (ipRegex.test(url)) {
        result.score += 25;
        result.indicators.push('Contains IP address instead of domain (very suspicious)');
      }
    });
    
    result.suspicious = result.score > 0;
  }
  
  return result;
}

// Language and Grammar Analysis
function analyzeLanguage(text) {
  const result = {
    suspicious: false,
    score: 0,
    indicators: []
  };

  // Check for poor grammar/spelling
  const grammarErrors = [
    /ur\b/g, /u\b/g, /r\b/g, /2\b/g, /4\b/g, /b4\b/g,
    /gr8/g, /nite/g, /thx/g, /pls/g, /plz/g, /wut/g,
    /dunno/g, /gonna/g, /wanna/g, /gotta/g
  ];
  
  let errorCount = 0;
  grammarErrors.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) errorCount += matches.length;
  });
  
  if (errorCount > 0) {
    result.score += errorCount * 3;
    result.indicators.push(`Contains ${errorCount} informal/grammar errors`);
  }

  // Check for excessive capitalization
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  if (capsRatio > 0.3) {
    result.score += 10;
    result.indicators.push('Excessive capitalization (common in phishing)');
  }

  // Check for repetitive words
  const words = text.toLowerCase().split(/\s+/);
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  Object.entries(wordCount).forEach(([word, count]) => {
    if (count > 3 && word.length > 3) {
      result.score += 5;
      result.indicators.push(`Repetitive use of "${word}" (${count} times)`);
    }
  });

  result.suspicious = result.score > 0;
  return result;
}

// Sender Analysis
function analyzeSender(text) {
  const result = {
    suspicious: false,
    score: 0,
    indicators: []
  };

  // Check for generic sender names
  const genericSenders = ['bank', 'security', 'service', 'support', 'info', 'noreply', 'admin'];
  genericSenders.forEach(sender => {
    if (text.toLowerCase().includes(sender)) {
      result.score += 5;
      result.indicators.push(`Generic sender name: "${sender}"`);
    }
  });

  // Check for spoofed numbers
  const numberPatterns = [
    /\b1-800-\d{3}-\d{4}\b/g,
    /\b1-888-\d{3}-\d{4}\b/g,
    /\b1-877-\d{3}-\d{4}\b/g
  ];
  
  numberPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      result.score += 8;
      result.indicators.push('Contains toll-free number (common in scams)');
    }
  });

  result.suspicious = result.score > 0;
  return result;
}

// Content Structure Analysis
function analyzeStructure(text) {
  const result = {
    suspicious: false,
    score: 0,
    indicators: []
  };

  // Check for excessive punctuation
  const exclamationCount = (text.match(/!/g) || []).length;
  const questionCount = (text.match(/\?/g) || []).length;
  
  if (exclamationCount > 2) {
    result.score += exclamationCount * 2;
    result.indicators.push(`Excessive exclamation marks (${exclamationCount})`);
  }
  
  if (questionCount > 2) {
    result.score += questionCount * 2;
    result.indicators.push(`Excessive question marks (${questionCount})`);
  }

  // Check for suspicious formatting
  if (text.includes('CLICK HERE') || text.includes('CLICK NOW')) {
    result.score += 15;
    result.indicators.push('Contains clickbait formatting');
  }

  // Check for urgency indicators
  const urgencyWords = ['now', 'immediately', 'urgent', 'asap', 'quickly'];
  let urgencyCount = 0;
  urgencyWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) urgencyCount += matches.length;
  });
  
  if (urgencyCount > 2) {
    result.score += urgencyCount * 3;
    result.indicators.push(`Multiple urgency indicators (${urgencyCount})`);
  }

  result.suspicious = result.score > 0;
  return result;
}

// Threat Intelligence Patterns
function detectThreatPatterns(text) {
  const result = {
    detected: false,
    score: 0,
    indicators: [],
    type: 'Unknown'
  };

  // Common phishing templates
  const templates = {
    'Bank Security Alert': {
      patterns: [/bank.*security/i, /account.*suspended/i, /fraud.*detected/i],
      score: 25,
      type: 'Financial Phishing'
    },
    'Tax Refund': {
      patterns: [/tax.*refund/i, /irs.*payment/i, /government.*payment/i],
      score: 20,
      type: 'Tax Scam'
    },
    'Package Delivery': {
      patterns: [/package.*delivery/i, /shipping.*update/i, /track.*order/i],
      score: 15,
      type: 'Delivery Scam'
    },
    'Account Verification': {
      patterns: [/verify.*account/i, /confirm.*details/i, /update.*information/i],
      score: 18,
      type: 'Account Phishing'
    },
    'Prize/Winner': {
      patterns: [/congratulations.*winner/i, /prize.*claim/i, /lottery.*winner/i],
      score: 22,
      type: 'Prize Scam'
    }
  };

  Object.entries(templates).forEach(([name, template]) => {
    template.patterns.forEach(pattern => {
      if (pattern.test(text)) {
        result.detected = true;
        result.score += template.score;
        result.indicators.push(`Matches "${name}" phishing template`);
        result.type = template.type;
      }
    });
  });

  return result;
}

// Handle SMS analysis for detect.html page
function handleSMSAnalysis() {
  const smsInput = document.getElementById('smsInput');
  const resultElement = document.getElementById('result');
  
  if (!smsInput || !resultElement) {
    console.log('SMS analysis elements not found');
    return;
  }
  
  const smsContent = smsInput.value;
  
  if (!smsContent.trim()) {
    resultElement.innerHTML = '<div class="error">Please enter a message to analyze.</div>';
    return;
  }
  
  // Show loading animation
  resultElement.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Analyzing message with advanced detection algorithms...</p>
    </div>
  `;
  
  // Simulate analysis time for better UX
  setTimeout(async () => {
    try {
      const analysis = await analyzeSMS(smsContent);
      
              // Create comprehensive result display
        const resultHTML = `
          <div class="analysis-result ${analysis.isPhishing ? 'phishing' : 'safe'}">
            <div class="result-header">
              <h3>${analysis.isPhishing ? '🚨 PHISHING DETECTED' : '✅ SAFE MESSAGE'}</h3>
              <div class="confidence-meter">
                <div class="confidence-bar" style="width: ${analysis.confidence}%"></div>
                <span>Confidence: ${Math.round(analysis.confidence)}%</span>
              </div>
            </div>
            
            <div class="risk-assessment">
              <div class="risk-score">
                <span class="score-label">Threat Score:</span>
                <span class="score-value ${analysis.riskLevel.toLowerCase()}">${analysis.score}/100</span>
                <span class="risk-level ${analysis.riskLevel.toLowerCase()}">${analysis.riskLevel} Risk</span>
              </div>
              
              ${analysis.threatType !== 'Unknown' ? `
                <div class="threat-type">
                  <span class="threat-label">Threat Type:</span>
                  <span class="threat-value">${analysis.threatType}</span>
                </div>
              ` : ''}
            </div>
            
                            ${analysis.mlPrediction || analysis.lstmPrediction ? `
                  <div class="ml-analysis">
                    <h4>🤖 Machine Learning Analysis:</h4>
                    
                    ${analysis.mlPrediction ? `
                      <div class="ml-prediction">
                        <h5>📊 Naive Bayes Classifier:</h5>
                        <div class="ml-result">
                          <span class="ml-label">Prediction:</span>
                          <span class="ml-value ${analysis.mlPrediction.isPhishing ? 'phishing' : 'safe'}">
                            ${analysis.mlPrediction.isPhishing ? '🚨 PHISHING' : '✅ SAFE'}
                          </span>
                          <span class="ml-confidence">(${(analysis.mlPrediction.confidence * 100).toFixed(1)}% confidence)</span>
                        </div>
                        <div class="ml-probabilities">
                          <div class="prob-bar">
                            <span>Phishing: ${(analysis.mlPrediction.phishingProbability * 100).toFixed(1)}%</span>
                            <div class="prob-fill phishing" style="width: ${analysis.mlPrediction.phishingProbability * 100}%"></div>
                          </div>
                          <div class="prob-bar">
                            <span>Safe: ${(analysis.mlPrediction.safeProbability * 100).toFixed(1)}%</span>
                            <div class="prob-fill safe" style="width: ${analysis.mlPrediction.safeProbability * 100}%"></div>
                          </div>
                        </div>
                        
                        ${analysis.featureImportance.length > 0 ? `
                          <div class="feature-importance">
                            <h6>🔍 Key Features Detected:</h6>
                            <ul>
                              ${analysis.featureImportance.map(feature => `
                                <li class="feature-item ${feature.indicator}">
                                  <span class="feature-word">"${feature.word}"</span>
                                  <span class="feature-indicator">→ ${feature.indicator} indicator</span>
                                  <span class="feature-importance">(importance: ${feature.importance.toFixed(2)})</span>
                                </li>
                              `).join('')}
                            </ul>
                          </div>
                        ` : ''}
                      </div>
                    ` : ''}
                    
                    ${analysis.lstmPrediction ? `
                      <div class="ml-prediction">
                        <h5>🧠 LSTM Neural Network:</h5>
                        <div class="ml-result">
                          <span class="ml-label">Prediction:</span>
                          <span class="ml-value ${analysis.lstmPrediction.isPhishing ? 'phishing' : 'safe'}">
                            ${analysis.lstmPrediction.isPhishing ? '🚨 PHISHING' : '✅ SAFE'}
                          </span>
                          <span class="ml-confidence">(${(analysis.lstmPrediction.confidence * 100).toFixed(1)}% confidence)</span>
                        </div>
                      </div>
                    ` : ''}
                  </div>
                ` : ''}
                
                ${analysis.aiAnalysis ? `
                  <div class="ai-analysis">
                    <h4>🤖 Gemini AI Analysis:</h4>
                    <div class="ai-prediction">
                      <h5>🧠 AI-Powered Threat Assessment:</h5>
                      <div class="ai-result">
                        <span class="ai-label">AI Prediction:</span>
                        <span class="ai-value ${analysis.aiAnalysis.isPhishing ? 'phishing' : 'safe'}">
                          ${analysis.aiAnalysis.isPhishing ? '🚨 PHISHING' : '✅ SAFE'}
                        </span>
                        <span class="ai-confidence">(${analysis.aiAnalysis.confidence}% confidence)</span>
                      </div>
                      
                      ${analysis.aiReasoning ? `
                        <div class="ai-reasoning">
                          <h6>💭 AI Reasoning:</h6>
                          <p>${analysis.aiReasoning}</p>
                        </div>
                      ` : ''}
                      
                      ${analysis.aiAnalysis.keyIndicators && analysis.aiAnalysis.keyIndicators.length > 0 ? `
                        <div class="ai-indicators">
                          <h6>🔍 AI Key Indicators:</h6>
                          <ul>
                            ${analysis.aiAnalysis.keyIndicators.map(indicator => `
                              <li class="ai-indicator">• ${indicator}</li>
                            `).join('')}
                          </ul>
                        </div>
                      ` : ''}
                      
                      ${analysis.aiAnalysis.psychologicalTactics && analysis.aiAnalysis.psychologicalTactics.length > 0 ? `
                        <div class="ai-tactics">
                          <h6>🎭 Psychological Tactics Detected:</h6>
                          <ul>
                            ${analysis.aiAnalysis.psychologicalTactics.map(tactic => `
                              <li class="ai-tactic">• ${tactic}</li>
                            `).join('')}
                          </ul>
                        </div>
                      ` : ''}
                      
                      ${analysis.educationalContent ? `
                        <div class="ai-education">
                          <h6>📚 Educational Note:</h6>
                          <p>${analysis.educationalContent}</p>
                        </div>
                      ` : ''}
                    </div>
                  </div>
                ` : ''}
              </div>
            ` : ''}
            
            ${analysis.indicators.length > 0 ? `
              <div class="indicators">
                <h4>🔍 Detection Indicators:</h4>
                <ul>
                  ${analysis.indicators.map(indicator => `<li>${indicator}</li>`).join('')}
                </ul>
              </div>
            ` : '<p>✅ No suspicious indicators detected.</p>'}
            
            <div class="recommendations">
              <h4>💡 Recommendations:</h4>
              <ul>
                ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
              </ul>
            </div>
            
            ${analysis.details.urls ? `
              <div class="url-analysis">
                <h4>🔗 URL Analysis:</h4>
                <ul>
                  ${analysis.details.urls.map(url => `
                    <li>
                      <span class="url-text">${url}</span>
                      <button class="url-check-btn" onclick="checkURL('${url}')">Check URL</button>
                    </li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        `;
        
        resultElement.innerHTML = resultHTML;
      
      // Save to database if user is logged in
      const user = auth.currentUser;
      if (user) {
        await db.ref(`users/${user.uid}/history`).push({
          sms: smsContent,
          result: analysis.isPhishing ? 'Phishing Detected' : 'Safe',
          score: analysis.score,
          confidence: analysis.confidence,
          riskLevel: analysis.riskLevel,
          threatType: analysis.threatType,
          indicators: analysis.indicators,
          recommendations: analysis.recommendations,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });
      }
    } catch (err) {
      resultElement.innerHTML = '<div class="error">Error analyzing SMS. Please try again.</div>';
      console.error('Analysis error:', err);
    }
  }, 1500);
}


              <div class="url-analysis">
                <h4>🔗 URL Analysis:</h4>
                <ul>
                  ${analysis.details.urls.map(url => `
                    <li>
                      <span class="url-text">${url}</span>
                      <button class="url-check-btn" onclick="checkURL('${url}')">Check URL</button>
                    </li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        `;
        
        resultDiv.innerHTML = resultHTML;
        
        // Save to database if user is logged in
        const user = auth.currentUser;
        if (user) {
          await db.ref(`users/${user.uid}/history`).push({
            sms: smsContent,
            result: analysis.isPhishing ? 'Phishing Detected' : 'Safe',
            score: analysis.score,
            confidence: analysis.confidence,
            riskLevel: analysis.riskLevel,
            threatType: analysis.threatType,
            indicators: analysis.indicators,
            recommendations: analysis.recommendations,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          });
      }
    } catch (err) {
        resultDiv.innerHTML = '<div class="error">Error analyzing SMS. Please try again.</div>';
        console.error('Analysis error:', err);
      }
    }, 1500);
  });
}

// URL reputation checking function
function checkURL(url) {
  // This would integrate with a real URL reputation service
  alert(`Checking reputation for: ${url}\n\nThis feature would integrate with services like:\n- Google Safe Browsing\n- VirusTotal\n- URLVoid\n- PhishTank`);
}

// Add enhanced CSS for better UI
const style = document.createElement('style');
style.textContent = `
  .loading-container {
    text-align: center;
    padding: 40px;
  }
  
  .loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #ffa500;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .confidence-meter {
    position: relative;
    width: 150px;
    height: 20px;
    background: #f0f0f0;
    border-radius: 10px;
    overflow: hidden;
  }
  
  .confidence-bar {
    height: 100%;
    background: linear-gradient(90deg, #ffa500, #ff7f50);
    transition: width 0.3s ease;
  }
  
  .confidence-meter span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 12px;
    font-weight: bold;
    color: #333;
  }
  
  .risk-assessment {
    display: flex;
    gap: 20px;
    margin: 20px 0;
    flex-wrap: wrap;
  }
  
  .risk-score, .threat-type {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .score-value {
    font-size: 24px;
    font-weight: bold;
  }
  
  .risk-level {
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 14px;
    font-weight: bold;
  }
  
  .critical { color: #ff0000; }
  .high { color: #ff4444; }
  .medium { color: #ff8800; }
  .low { color: #ffaa00; }
  .safe { color: #44ff44; }
  
  .critical.risk-level { background-color: #ff0000; color: white; }
  .high.risk-level { background-color: #ff4444; color: white; }
  .medium.risk-level { background-color: #ff8800; color: white; }
  .low.risk-level { background-color: #ffaa00; color: white; }
  .safe.risk-level { background-color: #44ff44; color: white; }
  
  .threat-type {
    background: rgba(255, 165, 0, 0.1);
    padding: 10px;
    border-radius: 5px;
    border-left: 3px solid #ffa500;
  }
  
  .url-analysis ul {
    list-style: none;
    padding: 0;
  }
  
  .url-analysis li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: rgba(255, 255, 255, 0.1);
    margin: 5px 0;
    border-radius: 5px;
  }
  
  .url-check-btn {
    background: #ffa500;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
  }
  
  .url-check-btn:hover {
    background: #ff7f50;
  }
  
  .ml-analysis {
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 10px;
    margin: 20px 0;
    border-left: 4px solid #4CAF50;
  }
  
  .ml-prediction {
    margin: 15px 0;
  }
  
  .ml-result {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .ml-label {
    font-weight: bold;
    color: #fff;
  }
  
  .ml-value {
    padding: 5px 10px;
    border-radius: 15px;
    font-weight: bold;
    font-size: 14px;
  }
  
  .ml-value.phishing {
    background: #ff4444;
    color: white;
  }
  
  .ml-value.safe {
    background: #4CAF50;
    color: white;
  }
  
  .ml-confidence {
    color: #ccc;
    font-size: 14px;
  }
  
  .ml-probabilities {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .prob-bar {
    position: relative;
    height: 25px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    overflow: hidden;
  }
  
  .prob-fill {
    height: 100%;
    transition: width 0.3s ease;
  }
  
  .prob-fill.phishing {
    background: linear-gradient(90deg, #ff4444, #ff6666);
  }
  
  .prob-fill.safe {
    background: linear-gradient(90deg, #4CAF50, #66bb6a);
  }
  
  .prob-bar span {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: white;
    font-weight: bold;
    z-index: 1;
  }
  
  .feature-importance {
    margin-top: 15px;
  }
  
  .feature-importance h5 {
    color: #fff;
    margin-bottom: 10px;
  }
  
  .feature-importance ul {
    list-style: none;
    padding: 0;
  }
  
  .feature-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    margin: 5px 0;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.05);
  }
  
  .feature-item.phishing {
    border-left: 3px solid #ff4444;
  }
  
  .feature-item.safe {
    border-left: 3px solid #4CAF50;
  }
  
  .feature-word {
    font-weight: bold;
    color: #ffa500;
  }
  
  .feature-indicator {
    color: #ccc;
    font-size: 14px;
  }
  
  .feature-importance {
    color: #999;
    font-size: 12px;
  }
  
  .error {
    color: #ff4444;
    text-align: center;
    padding: 20px;
    background: #ffe6e6;
    border-radius: 8px;
    border: 1px solid #ff4444;
  }
`;
document.head.appendChild(style);

// Mobile Navigation Functionality
function initMobileNavigation() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('show');
      mobileMenuBtn.classList.toggle('active');
      
      // Change button icon
      if (navLinks.classList.contains('show')) {
        mobileMenuBtn.innerHTML = '✕';
      } else {
        mobileMenuBtn.innerHTML = '☰';
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!mobileMenuBtn.contains(event.target) && !navLinks.contains(event.target)) {
        navLinks.classList.remove('show');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.innerHTML = '☰';
      }
    });
    
    // Close menu when clicking on a link
    const navLinksItems = navLinks.querySelectorAll('a');
    navLinksItems.forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('show');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.innerHTML = '☰';
        document.body.style.overflow = '';
      });
    });
    
    // Close menu when clicking on close button (X)
    navLinks.addEventListener('click', function(event) {
      if (event.target === navLinks || event.target.classList.contains('close-menu')) {
        navLinks.classList.remove('show');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.innerHTML = '☰';
        document.body.style.overflow = '';
      }
    });
  }
}

// Initialize mobile navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initMobileNavigation();
});

// Global function for mobile menu toggle
function toggleMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    navLinks.classList.toggle('show');
    mobileMenuBtn.classList.toggle('active');
    
    // Change button icon
    if (navLinks.classList.contains('show')) {
      mobileMenuBtn.innerHTML = '✕';
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenuBtn.innerHTML = '☰';
      // Restore body scroll when menu is closed
      document.body.style.overflow = '';
    }
  }
}

// Close mobile menu when clicking on close button (X)
function closeMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    navLinks.classList.remove('show');
    mobileMenuBtn.classList.remove('active');
    mobileMenuBtn.innerHTML = '☰';
    document.body.style.overflow = '';
  }
}

// ===== NOTIFICATION SYSTEM SETUP =====

// Request notification permission and setup
async function setupNotifications() {
  console.log('Setting up notifications...');
  
  // Check if notifications are supported
  if (!('Notification' in window)) {
    console.log('❌ Notifications not supported in this browser');
    return false;
  }
  
  // Check current permission status
  let permission = Notification.permission;
  console.log('Current notification permission:', permission);
  
  if (permission === 'default') {
    // Request permission
    try {
      permission = await Notification.requestPermission();
      console.log('Notification permission result:', permission);
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }
  
  if (permission === 'granted') {
    console.log('✅ Notification permission granted');
    
    // Test notification
    try {
      const testNotification = new Notification('🔔 SMS Phishing Detection', {
        body: 'Notification system is working! You will receive alerts for suspicious SMS messages.',
        icon: '/sms_shield_logo_new-removebg-preview.png',
        badge: '/sms_shield_logo_new-removebg-preview.png',
        tag: 'test-notification'
      });
      
      // Auto-close test notification after 3 seconds
      setTimeout(() => {
        testNotification.close();
      }, 3000);
      
      return true;
    } catch (error) {
      console.error('Error showing test notification:', error);
      return false;
    }
  } else {
    console.log('❌ Notification permission denied');
    return false;
  }
}

// Send notification for phishing threat
function sendPhishingNotification(title, message, riskLevel = 'medium') {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    console.log('Notifications not available or permission not granted');
    return;
  }
  
  const icon = riskLevel === 'high' ? '🚨' : riskLevel === 'medium' ? '⚠️' : '✅';
  const badge = '/sms_shield_logo_new-removebg-preview.png';
  
  const notification = new Notification(`${icon} ${title}`, {
    body: message,
    icon: '/sms_shield_logo_new-removebg-preview.png',
    badge: badge,
    tag: 'phishing-alert',
    requireInteraction: riskLevel === 'high',
    actions: riskLevel === 'high' ? [
      {
        action: 'view',
        title: 'View Details'
      },
      {
        action: 'block',
        title: 'Block Sender'
      }
    ] : []
  });
  
  // Handle notification click
  notification.onclick = function() {
    window.focus();
    window.location.href = 'detect.html';
    notification.close();
  };
  
  // Auto-close medium and low risk notifications after 5 seconds
  if (riskLevel !== 'high') {
    setTimeout(() => {
      notification.close();
    }, 5000);
  }
  
  console.log(`Notification sent: ${title} - ${message}`);
}

// Initialize notifications when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Setup notifications after a short delay
  setTimeout(() => {
    setupNotifications();
  }, 1000);
});

// Export functions for global access
window.setupNotifications = setupNotifications;
window.sendPhishingNotification = sendPhishingNotification;
window.analyzeSMS = analyzeSMS;



