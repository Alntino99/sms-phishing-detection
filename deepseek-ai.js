// DeepSeek AI Integration for SMS Phishing Detection
// This module provides AI-powered analysis using DeepSeek's advanced language model

class DeepSeekAIAnalyzer {
  constructor() {
    this.isInitialized = false;
    this.apiKey = null;
    this.baseURL = 'https://api.deepseek.com/v1/chat/completions';
    this.maxRetries = 3;
    this.retryDelay = 1000;
  }

  // Initialize DeepSeek AI with API key
  async initialize(apiKey) {
    if (!apiKey) {
      console.warn('DeepSeek AI: No API key provided. Using fallback analysis.');
      return false;
    }

    this.apiKey = apiKey;
    this.isInitialized = true;
    console.log('DeepSeek AI: Initialized successfully');
    return true;
  }

  // Generate AI-powered analysis of SMS content
  async analyzeSMSWithAI(smsContent) {
    if (!this.isInitialized) {
      return this.getFallbackAnalysis(smsContent);
    }

    try {
      const prompt = this.buildAnalysisPrompt(smsContent);
      const response = await this.callDeepSeekAPI(prompt);
      
      if (response && response.choices && response.choices[0]) {
        const aiAnalysis = this.parseAIResponse(response.choices[0].message.content);
        return {
          success: true,
          analysis: aiAnalysis,
          rawResponse: response
        };
      } else {
        throw new Error('Invalid response from DeepSeek API');
      }
    } catch (error) {
      console.error('DeepSeek AI analysis error:', error);
      return this.getFallbackAnalysis(smsContent, error.message);
    }
  }

  // Build comprehensive prompt for SMS analysis
  buildAnalysisPrompt(smsContent) {
    return {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert cybersecurity analyst specializing in SMS phishing detection. 
          
Analyze the following SMS message for potential phishing threats. Provide a detailed analysis including:

1. **Threat Assessment**: Is this message likely to be phishing? (Yes/No with confidence percentage)
2. **Risk Level**: Low/Medium/High/Critical
3. **Threat Type**: What type of phishing attack is this? (e.g., Financial, Credential Harvesting, Malware, Social Engineering, etc.)
4. **Key Indicators**: List specific suspicious elements found
5. **Psychological Tactics**: What manipulation techniques are being used?
6. **Technical Analysis**: Any suspicious URLs, phone numbers, or technical indicators?
7. **Recommendations**: What should the user do?
8. **Educational Note**: Brief explanation of why this is suspicious

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
        },
        {
          role: "user",
          content: `Analyze this SMS message: "${smsContent}"`
        }
      ],
      temperature: 0.1,
      max_tokens: 2000
    };
  }

  // Call DeepSeek API with retry logic
  async callDeepSeekAPI(prompt) {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(this.baseURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify(prompt)
        });

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          
          // Provide specific error messages for common issues
          if (response.status === 402) {
            errorMessage = 'HTTP 402: Payment Required - Your DeepSeek API account may have reached its free tier limits or requires payment. Please check your DeepSeek account status.';
          } else if (response.status === 401) {
            errorMessage = 'HTTP 401: Unauthorized - Please check your DeepSeek API key.';
          } else if (response.status === 429) {
            errorMessage = 'HTTP 429: Rate Limit Exceeded - Please wait before making another request.';
          }
          
          throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.warn(`DeepSeek API attempt ${attempt} failed:`, error);
        
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
  getFallbackAnalysis(smsContent, errorMessage = '') {
    return {
      success: false,
      analysis: {
        isPhishing: false,
        confidence: 0,
        reasoning: errorMessage || 'AI analysis unavailable',
        riskLevel: 'Unknown',
        threatType: 'Unknown',
        keyIndicators: [],
        psychologicalTactics: [],
        technicalAnalysis: {},
        recommendations: ['Use traditional analysis methods', 'Try Gemini AI Analysis instead'],
        educationalNote: 'DeepSeek AI is currently unavailable. You can use other analysis modes for immediate results.'
      }
    };
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
      const enhancedAIResult = await this.callDeepSeekAPI(enhancedPrompt);
      
      if (enhancedAIResult && enhancedAIResult.choices && enhancedAIResult.choices[0]) {
        const enhancedAnalysis = this.parseAIResponse(enhancedAIResult.choices[0].message.content);
        
        return {
          success: true,
          analysis: enhancedAnalysis,
          mlResults: mlResults,
          hybridScore: this.calculateMLHybridScore(mlResults, enhancedAnalysis),
          rawResponse: enhancedAIResult
        };
      } else {
        throw new Error('Invalid response from enhanced DeepSeek API');
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
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert cybersecurity analyst specializing in SMS phishing detection. 

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
        },
        {
          role: "user",
          content: `Analyze this SMS message with ML insights: "${smsContent}"`
        }
      ],
      temperature: 0.1,
      max_tokens: 2500
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

  // Check if DeepSeek AI is available
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

// Initialize global DeepSeek AI analyzer
window.deepseekAnalyzer = new DeepSeekAIAnalyzer();

// Configuration function for API key
window.initializeDeepSeekAI = function(apiKey) {
  return window.deepseekAnalyzer.initialize(apiKey);
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DeepSeekAIAnalyzer;
} 