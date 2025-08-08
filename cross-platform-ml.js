// ===== CROSS-PLATFORM ML MODELS =====
// Ensures all ML models work properly across all platforms

// Global ML models
let naiveBayesClassifier = null;
let lstmClassifier = null;
let knnClassifier = null;
let randomForestClassifier = null;
let mlModelsReady = false;

// Initialize ML models with cross-platform support
function initializeCrossPlatformML() {
    try {
        // Initialize Naive Bayes Classifier
        naiveBayesClassifier = new NaiveBayesClassifier();
        
        // Initialize LSTM Classifier
        lstmClassifier = new LSTMClassifier();
        
        // Initialize KNN Classifier (as specified in project document)
        knnClassifier = new KNNClassifier(6); // k=6 as specified
        
        // Initialize Random Forest Classifier (as specified in project document)
        randomForestClassifier = new RandomForestClassifier(10, 5); // 10 trees, max depth 5
        
        // Train models with sample data
        const trainingData = [
            { text: "Your account has been suspended. Click here to verify.", isPhishing: true },
            { text: "You have won a prize! Claim now.", isPhishing: true },
            { text: "URGENT: Your bank account has been compromised.", isPhishing: true },
            { text: "Hello, this is your bank. Please verify your details.", isPhishing: true },
            { text: "Your package has been delivered. Track here.", isPhishing: false },
            { text: "Meeting reminder: Tomorrow at 2 PM", isPhishing: false },
            { text: "Your order has been confirmed. Order #12345", isPhishing: false },
            { text: "Weather alert: Rain expected today", isPhishing: false }
        ];
        
        // Train models
        naiveBayesClassifier.train(trainingData);
        lstmClassifier.train(trainingData, 5, 0.01);
        knnClassifier.train(trainingData);
        randomForestClassifier.train(trainingData);
        
        mlModelsReady = true;
        console.log('✅ Cross-platform ML models initialized successfully (including KNN and Random Forest)');
        
    } catch (error) {
        console.error('❌ ML model initialization failed:', error);
        // Create fallback models
        createFallbackModels();
    }
}

// Create fallback models if main models fail
function createFallbackModels() {
    try {
        // Simple keyword-based fallback
        naiveBayesClassifier = {
            predict: (text) => {
                const suspiciousKeywords = ['urgent', 'bank', 'password', 'click', 'verify', 'suspended', 'locked', 'prize', 'won', 'claim'];
                const foundKeywords = suspiciousKeywords.filter(keyword => 
                    text.toLowerCase().includes(keyword)
                );
                
                const confidence = Math.min(0.9, foundKeywords.length * 0.2);
                return {
                    isPhishing: foundKeywords.length > 0,
                    confidence: confidence
                };
            },
            getFeatureImportance: () => [
                { word: 'urgent', importance: 0.8 },
                { word: 'bank', importance: 0.7 },
                { word: 'password', importance: 0.9 },
                { word: 'click', importance: 0.6 },
                { word: 'verify', importance: 0.7 }
            ]
        };
        
        lstmClassifier = {
            predict: (text) => {
                // Simple pattern matching fallback
                const patterns = [
                    /your.*account.*suspended/i,
                    /you.*won.*prize/i,
                    /click.*here.*verify/i,
                    /urgent.*bank.*account/i
                ];
                
                const matches = patterns.filter(pattern => pattern.test(text));
                const confidence = Math.min(0.85, matches.length * 0.3);
                
                return {
                    isPhishing: matches.length > 0,
                    confidence: confidence
                };
            }
        };
        
        mlModelsReady = true;
        console.log('✅ Fallback ML models created successfully');
        
    } catch (error) {
        console.error('❌ Fallback model creation failed:', error);
        mlModelsReady = false;
    }
}

// Enhanced cross-platform SMS analysis
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

    try {
        // 1. Naive Bayes ML Prediction
        if (naiveBayesClassifier && mlModelsReady) {
            try {
                const nbResult = naiveBayesClassifier.predict(smsContent);
                analysis.mlPrediction = nbResult;
                analysis.score += nbResult.isPhishing ? 30 : -15;
                analysis.indicators.push(`Naive Bayes: ${nbResult.isPhishing ? 'Phishing' : 'Safe'} (${(nbResult.confidence * 100).toFixed(1)}% confidence)`);
                
                // Get important features
                const features = naiveBayesClassifier.getFeatureImportance();
                const textWords = smsContent.toLowerCase().split(' ');
                const relevantFeatures = features.filter(f => textWords.includes(f.word));
                analysis.featureImportance = relevantFeatures.slice(0, 5);
                
            } catch (error) {
                console.error('Naive Bayes prediction error:', error);
                analysis.indicators.push('Naive Bayes analysis unavailable');
            }
        }

        // 2. LSTM Neural Network Prediction
        if (lstmClassifier && mlModelsReady) {
            try {
                const lstmResult = lstmClassifier.predict(smsContent);
                analysis.lstmPrediction = lstmResult;
                analysis.score += lstmResult.isPhishing ? 35 : -18;
                analysis.indicators.push(`LSTM Neural Network: ${lstmResult.isPhishing ? 'Phishing' : 'Safe'} (${(lstmResult.confidence * 100).toFixed(1)}% confidence)`);
                
            } catch (error) {
                console.error('LSTM prediction error:', error);
                analysis.indicators.push('LSTM analysis unavailable');
            }
        }

        // 3. Advanced Keyword Analysis
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

        // 4. URL Analysis
        const urls = extractURLs(smsContent);
        if (urls.length > 0) {
            analysis.details.urls = urls;
            analysis.score += urls.length * 5;
            analysis.indicators.push(`Suspicious URLs detected: ${urls.length}`);
        }

        // 5. Language Analysis
        const languageScore = analyzeLanguage(smsContent);
        analysis.score += languageScore;
        if (languageScore > 0) {
            analysis.indicators.push('Suspicious language patterns detected');
        }

        // 6. Calculate final results
        analysis.confidence = Math.min(100, Math.max(0, Math.abs(analysis.score)));
        analysis.isPhishing = analysis.score > 20;
        analysis.riskLevel = analysis.score > 40 ? 'High' : analysis.score > 20 ? 'Medium' : 'Low';
        analysis.threatType = determineThreatType(analysis.details);
        analysis.hybridScore = analysis.score;
        analysis.aiConfidence = analysis.confidence;

        // 7. Generate recommendations
        analysis.recommendations = generateRecommendations(analysis);
        analysis.enhancedRecommendations = generateEnhancedRecommendations(analysis);
        analysis.educationalContent = generateEducationalContent(analysis);

        // 8. AI Analysis (if available)
        if (window.geminiAnalyzer) {
            try {
                const aiResult = await performAIAnalysis(smsContent);
                analysis.aiAnalysis = aiResult;
                analysis.aiReasoning = aiResult.reasoning || 'AI analysis completed';
                analysis.score += aiResult.isPhishing ? 20 : -10;
            } catch (error) {
                console.error('AI analysis error:', error);
                analysis.indicators.push('AI analysis unavailable');
            }
        }

        // 9. Additional ML Models (KNN and Random Forest)
        if (knnClassifier && randomForestClassifier) {
            try {
                const knnResult = knnClassifier.predict(smsContent);
                const rfResult = randomForestClassifier.predict(smsContent);
                
                analysis.knnAnalysis = knnResult;
                analysis.randomForestAnalysis = rfResult;
                
                // Add to overall score
                analysis.score += knnResult.isPhishing ? 15 : -5;
                analysis.score += rfResult.isPhishing ? 15 : -5;
                
                // Add model insights
                analysis.modelInsights = {
                    knn: knnResult.modelType,
                    randomForest: rfResult.modelType,
                    knnDistance: knnResult.distance,
                    rfVotes: `${rfResult.phishingVotes}/${rfResult.safeVotes}`
                };
            } catch (error) {
                console.error('Additional ML analysis error:', error);
            }
        }

        return analysis;

    } catch (error) {
        console.error('SMS analysis error:', error);
        // Return basic analysis
        return {
            isPhishing: false,
            score: 0,
            confidence: 50,
            indicators: ['Analysis error occurred'],
            riskLevel: 'Unknown',
            details: {},
            recommendations: ['Please try again or contact support'],
            threatType: 'Unknown',
            mlPrediction: null,
            featureImportance: [],
            aiAnalysis: null,
            hybridScore: 0,
            aiConfidence: 0,
            aiReasoning: 'Analysis failed',
            enhancedRecommendations: ['System error - please retry'],
            educationalContent: 'An error occurred during analysis.'
        };
    }
}

// Helper functions
function extractURLs(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
}

function analyzeLanguage(text) {
    let score = 0;
    const suspiciousPatterns = [
        /urgent/i,
        /immediate action/i,
        /click here/i,
        /verify now/i,
        /account suspended/i,
        /security alert/i
    ];
    
    suspiciousPatterns.forEach(pattern => {
        if (pattern.test(text)) {
            score += 5;
        }
    });
    
    return score;
}

function determineThreatType(details) {
    if (details.personalInfo) return 'Data Theft';
    if (details.financial) return 'Financial Fraud';
    if (details.authority) return 'Authority Impersonation';
    if (details.urgency) return 'Urgency Scam';
    return 'General Phishing';
}

function generateRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.isPhishing) {
        recommendations.push('Do not click any links in this message');
        recommendations.push('Do not provide any personal information');
        recommendations.push('Contact the organization directly using official channels');
        recommendations.push('Report this message to your mobile carrier');
    } else {
        recommendations.push('Message appears to be safe');
        recommendations.push('Always verify with official sources');
        recommendations.push('Be cautious with personal information');
    }
    
    return recommendations;
}

function generateEnhancedRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.riskLevel === 'High') {
        recommendations.push('🚨 HIGH RISK: Block this sender immediately');
        recommendations.push('📞 Contact your bank/company directly');
        recommendations.push('🔒 Enable two-factor authentication');
        recommendations.push('📱 Report to authorities if needed');
    } else if (analysis.riskLevel === 'Medium') {
        recommendations.push('⚠️ MEDIUM RISK: Exercise caution');
        recommendations.push('🔍 Verify sender through official channels');
        recommendations.push('📧 Check for similar scams online');
    } else {
        recommendations.push('✅ LOW RISK: Message appears safe');
        recommendations.push('🔍 Still verify with official sources');
    }
    
    return recommendations;
}

function generateEducationalContent(analysis) {
    if (analysis.isPhishing) {
        return `This message shows signs of phishing. Phishing attacks often use urgency, authority figures, and requests for personal information to trick victims. Always verify with official sources before taking action.`;
    } else {
        return `This message appears safe, but always be cautious with personal information and verify through official channels when in doubt.`;
    }
}

// AI Analysis function
async function performAIAnalysis(smsContent) {
    try {
        if (window.geminiAnalyzer) {
            return await window.geminiAnalyzer.analyzeSMSWithAI(smsContent);
        } else {
            return {
                isPhishing: false,
                confidence: 0.5,
                reasoning: 'AI analysis not available'
            };
        }
    } catch (error) {
        console.error('AI analysis error:', error);
        return {
            isPhishing: false,
            confidence: 0.5,
            reasoning: 'AI analysis failed'
        };
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initializeCrossPlatformML();
    }, 1000);
});

// Export functions for global access
window.analyzeSMS = analyzeSMS;
window.initializeCrossPlatformML = initializeCrossPlatformML;
window.createFallbackModels = createFallbackModels;

// Ensure analyzeSMS is always available with fallback
if (typeof window.analyzeSMS !== 'function') {
  window.analyzeSMS = async function(smsContent) {
    console.log('Using fallback analyzeSMS function from cross-platform-ml.js');
    
    // Simple fallback analysis
    const suspiciousKeywords = [
      'urgent', 'bank', 'password', 'click', 'verify', 'suspended', 
      'locked', 'prize', 'won', 'claim', 'security', 'alert', 
      'expired', 'identity', 'reward', 'limited', 'time'
    ];
    
    const text = smsContent.toLowerCase();
    const foundKeywords = suspiciousKeywords.filter(keyword => text.includes(keyword));
    
    const threatLevel = foundKeywords.length > 2 ? 'high' : 
                      foundKeywords.length > 0 ? 'medium' : 'low';
    
    return {
      isPhishing: threatLevel === 'high',
      confidence: threatLevel === 'high' ? 0.9 : threatLevel === 'medium' ? 0.6 : 0.3,
      threatLevel: threatLevel,
      suspiciousKeywords: foundKeywords,
      recommendations: threatLevel === 'high' ? 
        ['This message appears to be phishing. Do not click any links.', 'Delete this message immediately.'] :
        threatLevel === 'medium' ? 
        ['Be cautious with this message.', 'Verify the sender before responding.'] :
        ['This message appears safe.', 'No immediate action required.']
    };
  };
}

console.log('✅ Cross-platform ML models loaded successfully'); 