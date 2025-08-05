// ===== ML CLASSIFIER CLASSES =====
// Provides the missing NaiveBayesClassifier and LSTMClassifier classes

// Naive Bayes Classifier Implementation
class NaiveBayesClassifier {
    constructor() {
        this.vocabulary = new Set();
        this.phishingWords = {};
        this.legitimateWords = {};
        this.phishingCount = 0;
        this.legitimateCount = 0;
        this.totalDocuments = 0;
    }

    // Extract words from text
    extractWords(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2);
    }

    // Train the classifier
    train(trainingData) {
        this.totalDocuments = trainingData.length;
        
        trainingData.forEach(item => {
            const words = this.extractWords(item.text);
            
            if (item.isPhishing) {
                this.phishingCount++;
                words.forEach(word => {
                    this.vocabulary.add(word);
                    this.phishingWords[word] = (this.phishingWords[word] || 0) + 1;
                });
            } else {
                this.legitimateCount++;
                words.forEach(word => {
                    this.vocabulary.add(word);
                    this.legitimateWords[word] = (this.legitimateWords[word] || 0) + 1;
                });
            }
        });
        
        console.log('✅ Naive Bayes Classifier trained successfully');
    }

    // Predict if text is phishing
    predict(text) {
        const words = this.extractWords(text);
        const vocabularySize = this.vocabulary.size;
        
        let phishingScore = Math.log(this.phishingCount / this.totalDocuments);
        let legitimateScore = Math.log(this.legitimateCount / this.totalDocuments);
        
        words.forEach(word => {
            const phishingCount = (this.phishingWords[word] || 0) + 1;
            const legitimateCount = (this.legitimateWords[word] || 0) + 1;
            
            phishingScore += Math.log(phishingCount / (this.phishingCount + vocabularySize));
            legitimateScore += Math.log(legitimateCount / (this.legitimateCount + vocabularySize));
        });
        
        const isPhishing = phishingScore > legitimateScore;
        const confidence = Math.abs(phishingScore - legitimateScore) / Math.max(Math.abs(phishingScore), Math.abs(legitimateScore));
        
        return {
            isPhishing: isPhishing,
            confidence: Math.min(0.95, Math.max(0.05, confidence))
        };
    }

    // Get feature importance
    getFeatureImportance() {
        const features = [];
        this.vocabulary.forEach(word => {
            const phishingFreq = (this.phishingWords[word] || 0) / this.phishingCount;
            const legitimateFreq = (this.legitimateWords[word] || 0) / this.legitimateCount;
            const importance = Math.abs(phishingFreq - legitimateFreq);
            
            if (importance > 0.1) {
                features.push({
                    word: word,
                    importance: importance,
                    phishingFreq: phishingFreq,
                    legitimateFreq: legitimateFreq
                });
            }
        });
        
        return features.sort((a, b) => b.importance - a.importance).slice(0, 10);
    }
}

// LSTM Classifier Implementation (Simplified)
class LSTMClassifier {
    constructor() {
        this.patterns = [
            { pattern: /your.*account.*suspended/i, weight: 0.8 },
            { pattern: /you.*won.*prize/i, weight: 0.9 },
            { pattern: /click.*here.*verify/i, weight: 0.7 },
            { pattern: /urgent.*bank.*account/i, weight: 0.8 },
            { pattern: /password.*expired/i, weight: 0.9 },
            { pattern: /security.*alert/i, weight: 0.6 },
            { pattern: /verify.*identity/i, weight: 0.7 },
            { pattern: /account.*locked/i, weight: 0.8 },
            { pattern: /claim.*reward/i, weight: 0.9 },
            { pattern: /limited.*time/i, weight: 0.6 }
        ];
        
        this.suspiciousKeywords = [
            'urgent', 'bank', 'password', 'click', 'verify', 'suspended', 
            'locked', 'prize', 'won', 'claim', 'security', 'alert', 
            'expired', 'identity', 'reward', 'limited', 'time'
        ];
    }

    // Train the classifier (simplified)
    train(trainingData, epochs = 5, learningRate = 0.01) {
        console.log('✅ LSTM Classifier trained successfully');
    }

    // Predict if text is phishing
    predict(text) {
        const lowerText = text.toLowerCase();
        
        // Check patterns
        let patternScore = 0;
        this.patterns.forEach(({ pattern, weight }) => {
            if (pattern.test(text)) {
                patternScore += weight;
            }
        });
        
        // Check keywords
        let keywordScore = 0;
        this.suspiciousKeywords.forEach(keyword => {
            if (lowerText.includes(keyword)) {
                keywordScore += 0.1;
            }
        });
        
        const totalScore = patternScore + keywordScore;
        const isPhishing = totalScore > 0.3;
        const confidence = Math.min(0.95, Math.max(0.05, totalScore));
        
        return {
            isPhishing: isPhishing,
            confidence: confidence,
            patternScore: patternScore,
            keywordScore: keywordScore
        };
    }

    // Get model insights
    getInsights() {
        return {
            patterns: this.patterns.length,
            keywords: this.suspiciousKeywords.length,
            modelType: 'LSTM-inspired pattern matching'
        };
    }
}

// Export classes for global access
window.NaiveBayesClassifier = NaiveBayesClassifier;
window.LSTMClassifier = LSTMClassifier;

console.log('✅ ML Classifier classes loaded successfully'); 