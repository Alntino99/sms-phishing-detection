// Enhanced ML Model for Chatbot
// Provides intelligent responses based on SMS security context

(function() {
    'use strict';
    
    console.log('🧠 Loading Chatbot ML Model...');
    
    class ChatbotMLModel {
        constructor() {
            this.context = {};
            this.conversationHistory = [];
            this.responsePatterns = this.initializeResponsePatterns();
            this.init();
        }
        
        init() {
            this.setupContextualLearning();
            console.log('✅ Chatbot ML Model initialized');
        }
        
        initializeResponsePatterns() {
            return {
                // Security-focused responses
                security: {
                    patterns: ['security', 'safe', 'protect', 'secure', 'defense'],
                    responses: [
                        '🛡️ SMS Shield provides multiple layers of protection:\n• Real-time AI analysis\n• Machine learning detection\n• URL scanning\n• Behavioral analysis\n• Privacy-first approach',
                        '🔒 Your security is our priority! We use advanced AI to detect threats before they reach you.',
                        '🛡️ Stay protected with our 99.8% accurate threat detection system.'
                    ]
                },
                
                phishing: {
                    patterns: ['phishing', 'scam', 'fake', 'fraud', 'attack'],
                    responses: [
                        '🚨 SMS phishing is a serious threat! Our AI detects:\n• Suspicious URLs\n• Urgency tactics\n• Fake bank messages\n• Prize scams\n• Government impersonation',
                        '⚠️ Common phishing signs:\n• Urgent action required\n• Prize notifications\n• Account suspension\n• Payment requests\n• Personal info requests',
                        '🔍 Our AI analyzes message patterns, URLs, and sender behavior to identify threats instantly.'
                    ]
                },
                
                detection: {
                    patterns: ['detect', 'analysis', 'scan', 'check', 'identify'],
                    responses: [
                        '🤖 Our AI uses multiple detection methods:\n• Naive Bayes classification\n• LSTM neural networks\n• Pattern recognition\n• URL analysis\n• Behavioral scoring',
                        '📊 We achieve 99.8% accuracy through ensemble learning and continuous model updates.',
                        '🔬 Each message is analyzed in real-time using our advanced ML algorithms.'
                    ]
                },
                
                ai: {
                    patterns: ['ai', 'artificial intelligence', 'machine learning', 'algorithm'],
                    responses: [
                        '🧠 Our AI combines multiple technologies:\n• Natural Language Processing\n• Deep Learning\n• Pattern Recognition\n• Behavioral Analysis\n• Continuous Learning',
                        '🤖 The AI learns from millions of messages to improve detection accuracy.',
                        '💡 Our AI adapts to new threats and evolves with changing attack patterns.'
                    ]
                },
                
                safety: {
                    patterns: ['safe', 'protect', 'prevent', 'avoid', 'defend'],
                    responses: [
                        '✅ Safety tips:\n• Never click suspicious links\n• Don\'t share personal info\n• Verify sender numbers\n• Use our detection tool\n• Report suspicious messages',
                        '🛡️ Always verify unexpected messages through official channels.',
                        '🔒 When in doubt, delete the message and contact the company directly.'
                    ]
                },
                
                bank: {
                    patterns: ['bank', 'account', 'credit', 'debit', 'financial'],
                    responses: [
                        '🏦 Banks NEVER ask for personal info via SMS!\n• Call official numbers only\n• Use official apps\n• Never share passwords\n• Verify through website',
                        '💳 Financial institutions have strict security protocols. They won\'t ask for sensitive data via text.',
                        '🔐 If you get a bank SMS, contact them directly through their official website or app.'
                    ]
                },
                
                urgent: {
                    patterns: ['urgent', 'immediate', 'now', 'quick', 'hurry'],
                    responses: [
                        '⚠️ Urgency is a classic phishing tactic!\n• Scammers create fake emergencies\n• They want you to act without thinking\n• Always pause and verify\n• Contact official sources',
                        '⏰ Real emergencies don\'t come via SMS. Take time to verify before acting.',
                        '🚨 Urgent messages are often scams. Don\'t let pressure override your judgment.'
                    ]
                },
                
                links: {
                    patterns: ['link', 'click', 'url', 'website', 'site'],
                    responses: [
                        '🔗 Suspicious links are dangerous!\n• Hover to check URLs\n• Look for HTTPS\n• Verify domain names\n• Never click if unsure\n• Use our URL scanner',
                        '🌐 Always verify links before clicking. Scammers use fake URLs to steal information.',
                        '🔍 Our AI scans URLs in real-time to detect malicious links.'
                    ]
                },
                
                personal: {
                    patterns: ['personal', 'private', 'password', 'pin', 'ssn'],
                    responses: [
                        '🔒 Never share personal info via SMS!\n• Passwords\n• PINs\n• Social Security Numbers\n• Credit card details\n• Account numbers',
                        '🛡️ Legitimate services will never ask for sensitive data via text message.',
                        '🔐 Keep your personal information private. When in doubt, don\'t share!'
                    ]
                },
                
                verification: {
                    patterns: ['verify', 'confirm', 'validate', 'check', 'authenticate'],
                    responses: [
                        '✅ Verification requests via SMS are often scams!\n• Contact companies directly\n• Use official websites\n• Call verified numbers\n• Don\'t trust SMS links',
                        '🔍 Always verify through official channels, not SMS links.',
                        '📞 Use official contact methods to verify any requests.'
                    ]
                },
                
                prize: {
                    patterns: ['prize', 'win', 'winner', 'reward', 'gift'],
                    responses: [
                        '🎁 You haven\'t won anything!\n• Prize notifications are scams\n• You didn\'t enter any contest\n• They want your personal info\n• Delete these messages',
                        '🏆 Real prizes don\'t come via unexpected SMS. These are always scams.',
                        '🎯 Prize scams are designed to steal your information. Ignore them completely.'
                    ]
                },
                
                delivery: {
                    patterns: ['delivery', 'package', 'shipping', 'track', 'courier'],
                    responses: [
                        '📦 Delivery notifications can be faked!\n• Track through official websites\n• Use courier apps\n• Verify tracking numbers\n• Don\'t click SMS links',
                        '🚚 Real delivery companies use official apps and websites, not SMS links.',
                        '📱 Use the official courier app or website to track packages safely.'
                    ]
                },
                
                government: {
                    patterns: ['government', 'official', 'authority', 'agency', 'department'],
                    responses: [
                        '🏛️ Government agencies don\'t contact via SMS!\n• Use official websites\n• Call verified numbers\n• Don\'t trust SMS links\n• Verify through official channels',
                        '📋 Government communications come through official channels, not SMS.',
                        '🔐 Official agencies have secure communication methods, not text messages.'
                    ]
                },
                
                payment: {
                    patterns: ['payment', 'pay', 'billing', 'invoice', 'charge'],
                    responses: [
                        '💳 Payment-related SMS require extra verification!\n• Use official apps\n• Check through websites\n• Verify account activity\n• Never pay via SMS links',
                        '💰 Financial transactions should be done through secure, official channels.',
                        '💸 Never make payments through SMS links. Use official payment methods.'
                    ]
                }
            };
        }
        
        async generateResponse(message) {
            // Add to conversation history
            this.conversationHistory.push({
                message: message,
                timestamp: Date.now(),
                type: 'user'
            });
            
            // Analyze message intent
            const intent = this.analyzeIntent(message);
            const context = this.buildContext(message);
            
            // Generate contextual response
            const response = this.generateContextualResponse(message, intent, context);
            
            // Add response to history
            this.conversationHistory.push({
                message: response,
                timestamp: Date.now(),
                type: 'bot'
            });
            
            // Update context
            this.updateContext(message, response);
            
            return response;
        }
        
        analyzeIntent(message) {
            const lowerMessage = message.toLowerCase();
            let bestMatch = { category: 'general', score: 0 };
            
            for (const [category, data] of Object.entries(this.responsePatterns)) {
                let score = 0;
                for (const pattern of data.patterns) {
                    if (lowerMessage.includes(pattern)) {
                        score += 1;
                    }
                }
                if (score > bestMatch.score) {
                    bestMatch = { category, score };
                }
            }
            
            return bestMatch.category;
        }
        
        buildContext(message) {
            const context = {
                recentTopics: this.getRecentTopics(),
                userSentiment: this.analyzeSentiment(message),
                messageLength: message.length,
                hasQuestions: message.includes('?'),
                urgencyLevel: this.detectUrgency(message)
            };
            
            return context;
        }
        
        generateContextualResponse(message, intent, context) {
            const lowerMessage = message.toLowerCase();
            
            // Check for specific keywords first
            const specificResponses = {
                'urgent': '⚠️ Urgency is a classic phishing tactic! Scammers create fake emergencies to bypass your critical thinking. Always pause and verify before acting.',
                'bank': '🏦 Banks NEVER ask for personal info via SMS. If you get a bank message, call the official number from their website, not the SMS.',
                'password': '🔒 Never share passwords via SMS! Legitimate services will never ask for your password in a text message.',
                'click': '🔗 Suspicious links are dangerous! Hover over links to check the URL, and never click if you\'re unsure.',
                'verify': '✅ Verification requests via SMS are often scams. Contact the company directly through their official website.',
                'prize': '🎁 You haven\'t won anything! Prize notifications are almost always scams designed to steal your information.',
                'account': '📱 Account-related SMS should be treated with extreme caution. Contact the service directly through their app or website.',
                'suspended': '🚫 Account suspension notices are common phishing tactics. Log into your account directly to check.',
                'payment': '💳 Payment-related SMS require extra verification. Use the official app or website, never SMS links.',
                'delivery': '📦 Delivery notifications can be faked. Track packages through the official courier website.',
                'government': '🏛️ Government agencies don\'t contact via SMS. Use official websites and verified contact methods.',
                'personal': '🔒 Never share personal information via SMS. Legitimate services will never ask for sensitive data via text.',
                'help': '🛡️ I can help you with:\n• Understanding SMS phishing detection\n• Identifying common scam signs\n• Security best practices\n• How our AI works\n• Staying safe from scams\n\nWhat would you like to know?',
                'hello': '👋 Hello! I\'m your SMS Shield AI assistant. I can help you understand SMS security, detect phishing attempts, and stay safe from scams. How can I help you today?',
                'hi': '👋 Hi there! I\'m here to help you stay safe from SMS phishing attacks. What would you like to know?',
                'thank': '🙏 You\'re welcome! Stay safe and remember to use our SMS detection tool for any suspicious messages. Feel free to ask if you need more help!',
                'bye': '👋 Goodbye! Stay safe and remember to use SMS Shield to protect yourself from phishing attacks. See you soon!'
            };
            
            // Check for specific keywords
            for (const [keyword, response] of Object.entries(specificResponses)) {
                if (lowerMessage.includes(keyword)) {
                    return response;
                }
            }
            
            // Use intent-based responses
            if (intent !== 'general' && this.responsePatterns[intent]) {
                const responses = this.responsePatterns[intent].responses;
                return responses[Math.floor(Math.random() * responses.length)];
            }
            
            // Default contextual response
            if (context.hasQuestions) {
                return '🤔 That\'s a great question! I can help you understand SMS security better. What specific aspect would you like to learn about?';
            }
            
            if (context.urgencyLevel > 0.7) {
                return '⚠️ I notice you mentioned something urgent. Remember, urgency is often a phishing tactic. Take time to verify before acting!';
            }
            
            return '🛡️ I\'m here to help you with SMS security! You can ask me about:\n• How phishing detection works\n• Common scam signs\n• Security best practices\n• How to stay safe\n• AI technology\n\nWhat would you like to know?';
        }
        
        getRecentTopics() {
            const recentMessages = this.conversationHistory.slice(-5);
            const topics = [];
            
            for (const msg of recentMessages) {
                if (msg.type === 'user') {
                    const intent = this.analyzeIntent(msg.message);
                    if (intent !== 'general') {
                        topics.push(intent);
                    }
                }
            }
            
            return topics;
        }
        
        analyzeSentiment(message) {
            const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'helpful'];
            const negativeWords = ['bad', 'terrible', 'awful', 'worried', 'scared', 'concerned'];
            
            const lowerMessage = message.toLowerCase();
            let sentiment = 0;
            
            positiveWords.forEach(word => {
                if (lowerMessage.includes(word)) sentiment += 1;
            });
            
            negativeWords.forEach(word => {
                if (lowerMessage.includes(word)) sentiment -= 1;
            });
            
            return sentiment;
        }
        
        detectUrgency(message) {
            const urgencyWords = ['urgent', 'immediate', 'now', 'quick', 'hurry', 'emergency', 'asap'];
            const lowerMessage = message.toLowerCase();
            let urgencyScore = 0;
            
            urgencyWords.forEach(word => {
                if (lowerMessage.includes(word)) urgencyScore += 1;
            });
            
            return urgencyScore / urgencyWords.length;
        }
        
        updateContext(message, response) {
            this.context.lastUserMessage = message;
            this.context.lastBotResponse = response;
            this.context.lastInteraction = Date.now();
        }
        
        setupContextualLearning() {
            // Simulate learning from conversations
            setInterval(() => {
                if (this.conversationHistory.length > 10) {
                    this.conversationHistory = this.conversationHistory.slice(-10);
                }
            }, 60000);
        }
    }
    
    // Initialize ML model
    const chatbotMLModel = new ChatbotMLModel();
    
    // Make it globally available
    window.chatbotMLModel = chatbotMLModel;
    
    console.log('✅ Chatbot ML Model loaded successfully');
    
})();
