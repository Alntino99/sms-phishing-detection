// Firebase Gemini AI Integration for SMS Phishing Detection
// This module provides AI-powered analysis using Google's Gemini model

class GeminiAIAnalyzer {
  constructor() {
    this.isInitialized = false;
    this.apiKey = null;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
    this.maxRetries = 3;
    this.retryDelay = 1000;
  }

  // Initialize Gemini AI with API key
  async initialize(apiKey) {
    if (!apiKey) {
      console.warn('Gemini AI: No API key provided. Using fallback analysis.');
      return false;
    }

    this.apiKey = apiKey;
    this.isInitialized = true;
    console.log('Gemini AI: Initialized successfully');
    return true;
  }

  // Check if demo usage limit reached
  checkDemoLimit() {
    if (window.geminiAPIKeyManager) {
      const manager = window.geminiAPIKeyManager;
      if (manager.isUsingDemo() && !manager.canUseDemo()) {
        return false;
      }
    }
    return true;
  }

  // Generate AI-powered analysis of SMS content
  async analyzeSMSWithAI(smsContent) {
    if (!this.isInitialized) {
      return this.getFallbackAnalysis(smsContent);
    }

    // Check demo usage limit
    if (!this.checkDemoLimit()) {
      return {
        success: false,
        analysis: {
          isPhishing: false,
          confidence: 0,
          reasoning: 'Demo usage limit reached. Please add your own API key for unlimited usage.',
          riskLevel: 'Unknown',
          threatType: 'Demo Limit',
          keyIndicators: [],
          psychologicalTactics: [],
          technicalAnalysis: {},
          recommendations: ['Add your own API key to continue using Gemini AI analysis'],
          educationalNote: 'Demo mode is limited to 10 free tests. Get your own free API key from Google AI Studio.'
        }
      };
    }

    try {
      const prompt = this.buildAnalysisPrompt(smsContent);
      const response = await this.callGeminiAPI(prompt);
      
      if (response && response.candidates && response.candidates[0]) {
        const aiAnalysis = this.parseAIResponse(response.candidates[0].content.parts[0].text);
        
        // Track demo usage
        if (window.geminiAPIKeyManager && window.geminiAPIKeyManager.isUsingDemo()) {
          window.geminiAPIKeyManager.incrementDemoUsage();
        }
        
        return {
          success: true,
          analysis: aiAnalysis,
          rawResponse: response
        };
      } else {
        throw new Error('Invalid response from Gemini API');
      }
    } catch (error) {
      console.error('Gemini AI analysis error:', error);
      return this.getFallbackAnalysis(smsContent);
    }
  }

  // Build comprehensive prompt for SMS analysis
  buildAnalysisPrompt(smsContent) {
    return {
      contents: [{
        parts: [{
          text: `You are an expert cybersecurity analyst specializing in SMS phishing detection. 
          
Analyze the following SMS message for potential phishing threats. Provide a detailed analysis including:

1. **Threat Assessment**: Is this message likely to be phishing? (Yes/No with confidence percentage)
2. **Risk Level**: Low/Medium/High/Critical
3. **Threat Type**: What type of phishing attack is this? (e.g., Financial, Credential Harvesting, Malware, Social Engineering, etc.)
4. **Key Indicators**: List specific suspicious elements found
5. **Psychological Tactics**: What manipulation techniques are being used?
6. **Technical Analysis**: Any suspicious URLs, phone numbers, or technical indicators?
7. **Recommendations**: What should the user do?
8. **Educational Note**: Brief explanation of why this is suspicious

SMS Message: "${smsContent}"

Please provide your analysis in the following JSON format:
{
  "threatAssessment": {
    "isPhishing": true/false,
    "confidence": 85,
    "reasoning": "Brief explanation"
  },
  "riskLevel": "High",
  "threatType": "Financial Phishing",
  "keyIndicators": [
    "Suspicious URL detected",
    "Urgency tactics used",
    "Authority impersonation"
  ],
  "psychologicalTactics": [
    "Creates false urgency",
    "Impersonates authority figure",
    "Demands immediate action"
  ],
  "technicalAnalysis": {
    "suspiciousUrls": ["url1", "url2"],
    "suspiciousPhoneNumbers": ["number1"],
    "otherIndicators": ["indicator1"]
  },
  "recommendations": [
    "Do not click any links",
    "Do not provide personal information",
    "Report to authorities if needed"
  ],
  "educationalNote": "This message uses common phishing tactics including urgency and authority impersonation to trick users into providing sensitive information."
}`
        }]
      }]
    };
  }

  // Call Gemini API with retry logic
  async callGeminiAPI(prompt) {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(prompt)
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.warn(`Gemini API attempt ${attempt} failed:`, error);
        
        if (attempt === this.maxRetries) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
      }
    }
  }

  // Parse AI response into structured format
  parseAIResponse(responseText) {
    try {
      // Extract JSON from response (handle cases where response includes markdown)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const aiData = JSON.parse(jsonMatch[0]);
      
      return {
        isPhishing: aiData.threatAssessment?.isPhishing || false,
        confidence: aiData.threatAssessment?.confidence || 0,
        reasoning: aiData.threatAssessment?.reasoning || '',
        riskLevel: aiData.riskLevel || 'Unknown',
        threatType: aiData.threatType || 'Unknown',
        keyIndicators: aiData.keyIndicators || [],
        psychologicalTactics: aiData.psychologicalTactics || [],
        technicalAnalysis: aiData.technicalAnalysis || {},
        recommendations: aiData.recommendations || [],
        educationalNote: aiData.educationalNote || ''
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return this.getFallbackAnalysis('');
    }
  }

  // Fallback analysis when AI is not available
  getFallbackAnalysis(smsContent) {
    return {
      success: false,
      analysis: {
        isPhishing: false,
        confidence: 0,
        reasoning: 'AI analysis unavailable',
        riskLevel: 'Unknown',
        threatType: 'Unknown',
        keyIndicators: [],
        psychologicalTactics: [],
        technicalAnalysis: {},
        recommendations: ['Use traditional analysis methods'],
        educationalNote: 'AI-powered analysis is currently unavailable. Using rule-based detection.'
      }
    };
  }

  // Enhanced analysis combining AI with traditional methods
  async performHybridAnalysis(smsContent, traditionalAnalysis) {
    const aiResult = await this.analyzeSMSWithAI(smsContent);
    
    if (!aiResult.success) {
      return traditionalAnalysis;
    }

    // Combine AI analysis with traditional analysis
    const hybridAnalysis = {
      ...traditionalAnalysis,
      aiAnalysis: aiResult.analysis,
      hybridScore: this.calculateHybridScore(traditionalAnalysis, aiResult.analysis),
      aiConfidence: aiResult.analysis.confidence,
      aiReasoning: aiResult.analysis.reasoning,
      enhancedRecommendations: [
        ...traditionalAnalysis.recommendations,
        ...aiResult.analysis.recommendations
      ],
      educationalContent: aiResult.analysis.educationalNote
    };

    // Adjust final score based on AI analysis
    if (aiResult.analysis.isPhishing && aiResult.analysis.confidence > 70) {
      hybridAnalysis.score = Math.min(100, hybridAnalysis.score + 15);
    } else if (!aiResult.analysis.isPhishing && aiResult.analysis.confidence > 70) {
      hybridAnalysis.score = Math.max(0, hybridAnalysis.score - 10);
    }

    return hybridAnalysis;
  }

  // Enhanced analysis combining AI with ML models (Naive Bayes + LSTM)
  async performMLEnhancedAnalysis(smsContent) {
    try {
      // Get ML model predictions
      const mlResults = {
        naiveBayes: null,
        lstm: null,
        ai: null
      };

      // Naive Bayes Analysis
      if (window.naiveBayesClassifier && window.naiveBayesClassifier.isTrained) {
        try {
          mlResults.naiveBayes = window.naiveBayesClassifier.predict(smsContent);
        } catch (error) {
          console.warn('Naive Bayes prediction failed:', error);
        }
      }

      // LSTM Analysis
      if (window.lstmClassifier && window.lstmClassifier.isTrained) {
        try {
          mlResults.lstm = window.lstmClassifier.predict(smsContent);
        } catch (error) {
          console.warn('LSTM prediction failed:', error);
        }
      }

      // AI Analysis
      const aiResult = await this.analyzeSMSWithAI(smsContent);
      mlResults.ai = aiResult.success ? aiResult.analysis : null;

      // Build comprehensive prompt for AI with ML insights
      const enhancedPrompt = this.buildEnhancedAnalysisPrompt(smsContent, mlResults);
      const enhancedAIResult = await this.callGeminiAPI(enhancedPrompt);
      
      if (enhancedAIResult && enhancedAIResult.candidates && enhancedAIResult.candidates[0]) {
        const enhancedAnalysis = this.parseAIResponse(enhancedAIResult.candidates[0].content.parts[0].text);
        
        return {
          success: true,
          analysis: enhancedAnalysis,
          mlResults: mlResults,
          hybridScore: this.calculateMLHybridScore(mlResults, enhancedAnalysis),
          rawResponse: enhancedAIResult
        };
      } else {
        throw new Error('Invalid response from enhanced Gemini API');
      }
    } catch (error) {
      console.error('ML-Enhanced AI analysis error:', error);
      return this.getFallbackAnalysis(smsContent);
    }
  }

  // Build enhanced prompt that includes ML model insights
  buildEnhancedAnalysisPrompt(smsContent, mlResults) {
    let mlInsights = '';
    
    if (mlResults.naiveBayes) {
      mlInsights += `\nNaive Bayes ML Model: ${mlResults.naiveBayes.isPhishing ? 'PHISHING' : 'SAFE'} (${(mlResults.naiveBayes.confidence * 100).toFixed(1)}% confidence)`;
    }
    
    if (mlResults.lstm) {
      mlInsights += `\nLSTM Neural Network: ${mlResults.lstm.isPhishing ? 'PHISHING' : 'SAFE'} (${(mlResults.lstm.confidence * 100).toFixed(1)}% confidence)`;
    }

    return {
      contents: [{
        parts: [{
          text: `You are an expert cybersecurity analyst specializing in SMS phishing detection. 

You have access to both traditional machine learning models and advanced AI analysis. Consider the following ML model predictions when providing your analysis:

${mlInsights}

Analyze the following SMS message for potential phishing threats. Provide a detailed analysis including:

1. **Threat Assessment**: Is this message likely to be phishing? (Yes/No with confidence percentage)
2. **Risk Level**: Low/Medium/High/Critical
3. **Threat Type**: What type of phishing attack is this? (e.g., Financial, Credential Harvesting, Malware, Social Engineering, etc.)
4. **Key Indicators**: List specific suspicious elements found
5. **Psychological Tactics**: What manipulation techniques are being used?
6. **Technical Analysis**: Any suspicious URLs, phone numbers, or technical indicators?
7. **ML Model Agreement**: How do the ML models (Naive Bayes, LSTM) compare to your AI analysis?
8. **Recommendations**: What should the user do?
9. **Educational Note**: Brief explanation of why this is suspicious

SMS Message: "${smsContent}"

Please provide your analysis in the following JSON format:
{
  "threatAssessment": {
    "isPhishing": true/false,
    "confidence": 85,
    "reasoning": "Brief explanation including ML model insights"
  },
  "riskLevel": "High",
  "threatType": "Financial Phishing",
  "keyIndicators": [
    "Suspicious URL detected",
    "Urgency tactics used",
    "Authority impersonation"
  ],
  "psychologicalTactics": [
    "Creates false urgency",
    "Impersonates authority figure",
    "Demands immediate action"
  ],
  "technicalAnalysis": {
    "suspiciousUrls": ["url1", "url2"],
    "suspiciousPhoneNumbers": ["number1"],
    "otherIndicators": ["indicator1"]
  },
  "mlModelAgreement": {
    "naiveBayes": "Agrees/Disagrees with AI analysis",
    "lstm": "Agrees/Disagrees with AI analysis",
    "consensus": "Overall agreement level"
  },
  "recommendations": [
    "Do not click any links",
    "Do not provide personal information",
    "Report to authorities if needed"
  ],
  "educationalNote": "This message uses common phishing tactics including urgency and authority impersonation to trick users into providing sensitive information. ML models and AI analysis both indicate high risk."
}`
        }]
      }]
    };
  }

  // Calculate hybrid score combining ML models and AI
  calculateMLHybridScore(mlResults, aiAnalysis) {
    let totalScore = 0;
    let totalWeight = 0;
    
    // AI Analysis (40% weight)
    if (aiAnalysis) {
      const aiScore = aiAnalysis.isPhishing ? aiAnalysis.confidence : (100 - aiAnalysis.confidence);
      totalScore += aiScore * 0.4;
      totalWeight += 0.4;
    }
    
    // Naive Bayes (30% weight)
    if (mlResults.naiveBayes) {
      const nbScore = mlResults.naiveBayes.isPhishing ? 
        (mlResults.naiveBayes.confidence * 100) : 
        (100 - mlResults.naiveBayes.confidence * 100);
      totalScore += nbScore * 0.3;
      totalWeight += 0.3;
    }
    
    // LSTM (30% weight)
    if (mlResults.lstm) {
      const lstmScore = mlResults.lstm.isPhishing ? 
        (mlResults.lstm.confidence * 100) : 
        (100 - mlResults.lstm.confidence * 100);
      totalScore += lstmScore * 0.3;
      totalWeight += 0.3;
    }
    
    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  }

  // Calculate hybrid score combining traditional and AI analysis
  calculateHybridScore(traditionalAnalysis, aiAnalysis) {
    const traditionalWeight = 0.6;
    const aiWeight = 0.4;
    
    const traditionalScore = traditionalAnalysis.score;
    const aiScore = aiAnalysis.isPhishing ? 
      (aiAnalysis.confidence * 100) : 
      (100 - aiAnalysis.confidence * 100);
    
    return Math.round((traditionalScore * traditionalWeight) + (aiScore * aiWeight));
  }

  // Generate detailed threat explanation
  generateThreatExplanation(analysis) {
    if (!analysis.aiAnalysis) {
      return analysis.recommendations.join('. ');
    }

    const ai = analysis.aiAnalysis;
    let explanation = '';

    if (ai.reasoning) {
      explanation += `AI Analysis: ${ai.reasoning} `;
    }

    if (ai.keyIndicators.length > 0) {
      explanation += `Key indicators: ${ai.keyIndicators.join(', ')}. `;
    }

    if (ai.psychologicalTactics.length > 0) {
      explanation += `Psychological tactics: ${ai.psychologicalTactics.join(', ')}. `;
    }

    if (ai.educationalNote) {
      explanation += ai.educationalNote;
    }

    return explanation;
  }

  // Check if Gemini AI is available
  isAvailable() {
    return this.isInitialized && this.apiKey;
  }

  // Get API usage status
  getStatus() {
    return {
      initialized: this.isInitialized,
      apiKeyConfigured: !!this.apiKey,
      available: this.isAvailable()
    };
  }
}

// Initialize global Gemini AI analyzer
window.geminiAnalyzer = new GeminiAIAnalyzer();

// Configuration function for API key
window.initializeGeminiAI = function(apiKey) {
  return window.geminiAnalyzer.initialize(apiKey);
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GeminiAIAnalyzer;
} 