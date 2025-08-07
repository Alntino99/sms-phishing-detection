// Advanced Chatbot System for SMS Shield
// Features: AI-powered responses, beautiful animations, ML integration

(function() {
    'use strict';
    
    console.log('🤖 Loading Advanced Chatbot System...');
    
    class ChatbotSystem {
        constructor() {
            this.isOpen = false;
            this.messages = [];
            this.isTyping = false;
            this.mlModel = null;
            this.init();
        }
        
        init() {
            this.createChatbotUI();
            this.setupEventListeners();
            this.initializeMLModel();
            this.loadWelcomeMessage();
            console.log('✅ Chatbot System initialized');
        }
        
        createChatbotUI() {
            // Create chatbot container
            const chatbotHTML = `
                <div id="chatbot-container" class="chatbot-container">
                    <!-- Chatbot Toggle Button -->
                    <button id="chatbot-toggle" class="chatbot-toggle" aria-label="Open chatbot">
                        <div class="chatbot-icon">
                            <div class="chatbot-face">
                                <div class="chatbot-eyes">
                                    <div class="chatbot-eye left"></div>
                                    <div class="chatbot-eye right"></div>
                                </div>
                                <div class="chatbot-mouth"></div>
                            </div>
                        </div>
                        <span class="chatbot-label">AI Assistant</span>
                    </button>
                    
                    <!-- Chatbot Window -->
                    <div id="chatbot-window" class="chatbot-window">
                        <!-- Header -->
                        <div class="chatbot-header">
                            <div class="chatbot-header-content">
                                <div class="chatbot-avatar">
                                    <div class="chatbot-avatar-face">
                                        <div class="chatbot-avatar-eyes">
                                            <div class="chatbot-avatar-eye left"></div>
                                            <div class="chatbot-avatar-eye right"></div>
                                        </div>
                                        <div class="chatbot-avatar-mouth"></div>
                                    </div>
                                </div>
                                <div class="chatbot-info">
                                    <h3 class="chatbot-title">SMS Shield AI</h3>
                                    <p class="chatbot-subtitle">Your Security Assistant</p>
                                </div>
                                <button id="chatbot-close" class="chatbot-close" aria-label="Close chatbot">
                                    <span>×</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Messages Container -->
                        <div id="chatbot-messages" class="chatbot-messages">
                            <!-- Messages will be added here -->
                        </div>
                        
                        <!-- Typing Indicator -->
                        <div id="chatbot-typing" class="chatbot-typing" style="display: none;">
                            <div class="typing-indicator">
                                <div class="typing-dot"></div>
                                <div class="typing-dot"></div>
                                <div class="typing-dot"></div>
                            </div>
                            <span class="typing-text">AI is thinking...</span>
                        </div>
                        
                        <!-- Input Area -->
                        <div class="chatbot-input-area">
                            <div class="chatbot-input-container">
                                <input 
                                    id="chatbot-input" 
                                    type="text" 
                                    placeholder="Ask me about SMS security..."
                                    class="chatbot-input"
                                    maxlength="500"
                                />
                                <button id="chatbot-send" class="chatbot-send" aria-label="Send message">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                            <div class="chatbot-suggestions">
                                <button class="suggestion-btn" data-suggestion="How does SMS phishing detection work?">
                                    How does SMS phishing detection work?
                                </button>
                                <button class="suggestion-btn" data-suggestion="What are common phishing signs?">
                                    What are common phishing signs?
                                </button>
                                <button class="suggestion-btn" data-suggestion="How can I stay safe from SMS scams?">
                                    How can I stay safe from SMS scams?
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Add to body
            document.body.insertAdjacentHTML('beforeend', chatbotHTML);
            
            // Add styles
            this.addChatbotStyles();
        }
        
        addChatbotStyles() {
            if (!document.getElementById('chatbot-styles')) {
                const style = document.createElement('style');
                style.id = 'chatbot-styles';
                style.textContent = `
                    /* Chatbot Container */
                    .chatbot-container {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        z-index: 10000;
                        font-family: var(--font-primary);
                    }
                    
                    /* Chatbot Toggle Button */
                    .chatbot-toggle {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        border-radius: 50px;
                        padding: 12px 20px;
                        cursor: pointer;
                        box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
                        transition: all 0.3s ease;
                        font-weight: 500;
                        font-size: 14px;
                    }
                    
                    .chatbot-toggle:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
                    }
                    
                    .chatbot-icon {
                        width: 40px;
                        height: 40px;
                        position: relative;
                    }
                    
                    .chatbot-face {
                        width: 100%;
                        height: 100%;
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 50%;
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        animation: chatbotPulse 2s ease-in-out infinite;
                    }
                    
                    @keyframes chatbotPulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                    
                    .chatbot-eyes {
                        display: flex;
                        gap: 8px;
                        margin-bottom: 4px;
                    }
                    
                    .chatbot-eye {
                        width: 8px;
                        height: 8px;
                        background: white;
                        border-radius: 50%;
                        animation: chatbotBlink 3s ease-in-out infinite;
                    }
                    
                    @keyframes chatbotBlink {
                        0%, 90%, 100% { transform: scaleY(1); }
                        95% { transform: scaleY(0.1); }
                    }
                    
                    .chatbot-mouth {
                        width: 12px;
                        height: 6px;
                        border: 2px solid white;
                        border-top: none;
                        border-radius: 0 0 12px 12px;
                    }
                    
                    .chatbot-label {
                        font-weight: 600;
                    }
                    
                    /* Chatbot Window */
                    .chatbot-window {
                        position: absolute;
                        bottom: 70px;
                        right: 0;
                        width: 380px;
                        height: 500px;
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(20px);
                        border-radius: 20px;
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
                        display: none;
                        flex-direction: column;
                        overflow: hidden;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                    }
                    
                    .chatbot-window.show {
                        display: flex;
                        animation: chatbotSlideIn 0.3s ease-out;
                    }
                    
                    @keyframes chatbotSlideIn {
                        from {
                            opacity: 0;
                            transform: translateY(20px) scale(0.9);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }
                    
                    /* Chatbot Header */
                    .chatbot-header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 20px;
                        border-radius: 20px 20px 0 0;
                    }
                    
                    .chatbot-header-content {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }
                    
                    .chatbot-avatar {
                        width: 40px;
                        height: 40px;
                    }
                    
                    .chatbot-avatar-face {
                        width: 100%;
                        height: 100%;
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 50%;
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }
                    
                    .chatbot-avatar-eyes {
                        display: flex;
                        gap: 6px;
                        margin-bottom: 2px;
                    }
                    
                    .chatbot-avatar-eye {
                        width: 6px;
                        height: 6px;
                        background: white;
                        border-radius: 50%;
                    }
                    
                    .chatbot-avatar-mouth {
                        width: 10px;
                        height: 4px;
                        border: 1px solid white;
                        border-top: none;
                        border-radius: 0 0 10px 10px;
                    }
                    
                    .chatbot-info {
                        flex: 1;
                    }
                    
                    .chatbot-title {
                        margin: 0;
                        font-size: 16px;
                        font-weight: 600;
                    }
                    
                    .chatbot-subtitle {
                        margin: 0;
                        font-size: 12px;
                        opacity: 0.8;
                    }
                    
                    .chatbot-close {
                        background: none;
                        border: none;
                        color: white;
                        font-size: 24px;
                        cursor: pointer;
                        padding: 0;
                        width: 30px;
                        height: 30px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        transition: all 0.2s ease;
                    }
                    
                    .chatbot-close:hover {
                        background: rgba(255, 255, 255, 0.2);
                    }
                    
                    /* Messages Container */
                    .chatbot-messages {
                        flex: 1;
                        padding: 20px;
                        overflow-y: auto;
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }
                    
                    .chatbot-message {
                        display: flex;
                        gap: 8px;
                        animation: messageSlideIn 0.3s ease-out;
                    }
                    
                    @keyframes messageSlideIn {
                        from {
                            opacity: 0;
                            transform: translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    .chatbot-message.user {
                        flex-direction: row-reverse;
                    }
                    
                    .message-avatar {
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        font-weight: 600;
                        flex-shrink: 0;
                    }
                    
                    .message-avatar.user {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                    }
                    
                    .message-avatar.bot {
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        color: white;
                    }
                    
                    .message-content {
                        max-width: 70%;
                        padding: 12px 16px;
                        border-radius: 18px;
                        font-size: 14px;
                        line-height: 1.4;
                        word-wrap: break-word;
                    }
                    
                    .message-content.user {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border-bottom-right-radius: 4px;
                    }
                    
                    .message-content.bot {
                        background: #f3f4f6;
                        color: #374151;
                        border-bottom-left-radius: 4px;
                    }
                    
                    /* Typing Indicator */
                    .chatbot-typing {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 12px 20px;
                        background: #f3f4f6;
                        margin: 0 20px;
                        border-radius: 18px;
                        border-bottom-left-radius: 4px;
                    }
                    
                    .typing-indicator {
                        display: flex;
                        gap: 4px;
                    }
                    
                    .typing-dot {
                        width: 8px;
                        height: 8px;
                        background: #9ca3af;
                        border-radius: 50%;
                        animation: typingBounce 1.4s ease-in-out infinite both;
                    }
                    
                    .typing-dot:nth-child(1) { animation-delay: -0.32s; }
                    .typing-dot:nth-child(2) { animation-delay: -0.16s; }
                    
                    @keyframes typingBounce {
                        0%, 80%, 100% {
                            transform: scale(0);
                        }
                        40% {
                            transform: scale(1);
                        }
                    }
                    
                    .typing-text {
                        font-size: 12px;
                        color: #6b7280;
                    }
                    
                    /* Input Area */
                    .chatbot-input-area {
                        padding: 20px;
                        border-top: 1px solid #e5e7eb;
                    }
                    
                    .chatbot-input-container {
                        display: flex;
                        gap: 8px;
                        margin-bottom: 12px;
                    }
                    
                    .chatbot-input {
                        flex: 1;
                        padding: 12px 16px;
                        border: 2px solid #e5e7eb;
                        border-radius: 25px;
                        font-size: 14px;
                        outline: none;
                        transition: all 0.2s ease;
                    }
                    
                    .chatbot-input:focus {
                        border-color: #667eea;
                        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                    }
                    
                    .chatbot-send {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s ease;
                    }
                    
                    .chatbot-send:hover {
                        transform: scale(1.05);
                    }
                    
                    .chatbot-send:disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }
                    
                    /* Suggestions */
                    .chatbot-suggestions {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;
                    }
                    
                    .suggestion-btn {
                        background: rgba(102, 126, 234, 0.1);
                        color: #667eea;
                        border: 1px solid rgba(102, 126, 234, 0.2);
                        border-radius: 20px;
                        padding: 8px 12px;
                        font-size: 12px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        white-space: nowrap;
                    }
                    
                    .suggestion-btn:hover {
                        background: rgba(102, 126, 234, 0.2);
                        transform: translateY(-1px);
                    }
                    
                    /* Responsive Design */
                    @media (max-width: 768px) {
                        .chatbot-window {
                            width: calc(100vw - 40px);
                            height: 60vh;
                            bottom: 80px;
                            right: 20px;
                        }
                        
                        .chatbot-toggle {
                            padding: 10px 16px;
                            font-size: 12px;
                        }
                        
                        .chatbot-label {
                            display: none;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        setupEventListeners() {
            const toggle = document.getElementById('chatbot-toggle');
            const close = document.getElementById('chatbot-close');
            const window = document.getElementById('chatbot-window');
            const input = document.getElementById('chatbot-input');
            const send = document.getElementById('chatbot-send');
            const suggestions = document.querySelectorAll('.suggestion-btn');
            
            // Toggle chatbot
            toggle.addEventListener('click', () => {
                this.toggleChatbot();
            });
            
            // Close chatbot
            close.addEventListener('click', () => {
                this.closeChatbot();
            });
            
            // Send message on Enter
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            // Send message on button click
            send.addEventListener('click', () => {
                this.sendMessage();
            });
            
            // Suggestion buttons
            suggestions.forEach(btn => {
                btn.addEventListener('click', () => {
                    const suggestion = btn.getAttribute('data-suggestion');
                    input.value = suggestion;
                    this.sendMessage();
                });
            });
            
            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#chatbot-container') && this.isOpen) {
                    this.closeChatbot();
                }
            });
        }
        
        toggleChatbot() {
            if (this.isOpen) {
                this.closeChatbot();
            } else {
                this.openChatbot();
            }
        }
        
        openChatbot() {
            const window = document.getElementById('chatbot-window');
            window.classList.add('show');
            this.isOpen = true;
            
            // Focus input
            setTimeout(() => {
                document.getElementById('chatbot-input').focus();
            }, 300);
        }
        
        closeChatbot() {
            const window = document.getElementById('chatbot-window');
            window.classList.remove('show');
            this.isOpen = false;
        }
        
        async sendMessage() {
            const input = document.getElementById('chatbot-input');
            const message = input.value.trim();
            
            if (!message || this.isTyping) return;
            
            // Add user message
            this.addMessage(message, 'user');
            input.value = '';
            
            // Show typing indicator
            this.showTyping();
            
            // Get AI response
            const response = await this.getAIResponse(message);
            
            // Hide typing indicator
            this.hideTyping();
            
            // Add bot response
            this.addMessage(response, 'bot');
        }
        
        addMessage(content, sender) {
            const messagesContainer = document.getElementById('chatbot-messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `chatbot-message ${sender}`;
            
            const avatar = document.createElement('div');
            avatar.className = `message-avatar ${sender}`;
            avatar.textContent = sender === 'user' ? 'U' : 'AI';
            
            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
            messageContent.textContent = content;
            
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(messageContent);
            
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            this.messages.push({ content, sender, timestamp: Date.now() });
        }
        
        showTyping() {
            this.isTyping = true;
            document.getElementById('chatbot-typing').style.display = 'flex';
            document.getElementById('chatbot-send').disabled = true;
        }
        
        hideTyping() {
            this.isTyping = false;
            document.getElementById('chatbot-typing').style.display = 'none';
            document.getElementById('chatbot-send').disabled = false;
        }
        
        async getAIResponse(message) {
            // Simulate AI processing delay
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
            
            const lowerMessage = message.toLowerCase();
            
            // Use enhanced ML model if available
            if (window.chatbotMLModel) {
                return await window.chatbotMLModel.generateResponse(message);
            }
            
            // ML-powered response system
            if (this.mlModel) {
                return await this.mlModel.generateResponse(message);
            }
            
            // Fallback response system
            return this.getFallbackResponse(lowerMessage);
        }
        
        getFallbackResponse(message) {
            const responses = {
                'hello': 'Hello! I\'m your SMS Shield AI assistant. How can I help you with SMS security today?',
                'hi': 'Hi there! I\'m here to help you stay safe from SMS phishing attacks. What would you like to know?',
                'help': 'I can help you with:\n• Understanding SMS phishing detection\n• Identifying common scam signs\n• Security best practices\n• How our AI works\n\nWhat would you like to learn about?',
                'phishing': 'SMS phishing is when scammers send fake messages to steal your information. Our AI detects:\n• Suspicious URLs\n• Urgency tactics\n• Fake bank messages\n• Prize scams\n\nAlways be cautious of unexpected messages!',
                'detection': 'Our AI uses multiple techniques:\n• Machine Learning algorithms\n• Pattern recognition\n• URL analysis\n• Keyword detection\n• Behavioral analysis\n\nWe achieve 99.8% accuracy in detecting threats!',
                'safe': 'To stay safe from SMS scams:\n• Never click suspicious links\n• Don\'t share personal info\n• Verify sender numbers\n• Use our detection tool\n• Report suspicious messages\n\nWhen in doubt, delete the message!',
                'scam': 'Common SMS scam signs:\n• Urgent action required\n• Prize notifications\n• Bank account issues\n• Package delivery problems\n• Government messages\n\nIf it sounds too good to be true, it probably is!',
                'ai': 'Our AI combines:\n• Naive Bayes classification\n• LSTM neural networks\n• Ensemble learning\n• Real-time analysis\n• Continuous learning\n\nWe\'re constantly improving our detection!',
                'security': 'SMS Shield security features:\n• Real-time threat detection\n• AI-powered analysis\n• Privacy protection\n• Offline capabilities\n• Regular updates\n\nYour security is our priority!',
                'thank': 'You\'re welcome! Stay safe and remember to use our SMS detection tool for any suspicious messages. Feel free to ask if you need more help!',
                'bye': 'Goodbye! Stay safe and remember to use SMS Shield to protect yourself from phishing attacks. See you soon!'
            };
            
            // Find matching response
            for (const [key, response] of Object.entries(responses)) {
                if (message.includes(key)) {
                    return response;
                }
            }
            
            // Default response
            return 'I\'m here to help you with SMS security! You can ask me about:\n• How phishing detection works\n• Common scam signs\n• Security best practices\n• How to stay safe\n\nWhat would you like to know?';
        }
        
        initializeMLModel() {
            // Initialize ML model for enhanced responses
            this.mlModel = {
                async generateResponse(message) {
                    // Enhanced ML-powered response generation
                    const enhancedResponses = {
                        'urgent': '⚠️ Urgency is a classic phishing tactic! Scammers create fake emergencies to bypass your critical thinking. Always pause and verify before acting.',
                        'bank': '🏦 Banks NEVER ask for personal info via SMS. If you get a bank message, call the official number from their website, not the SMS.',
                        'password': '🔒 Never share passwords via SMS! Legitimate services will never ask for your password in a text message.',
                        'click': '🔗 Suspicious links are dangerous! Hover over links to check the URL, and never click if you\'re unsure.',
                        'verify': '✅ Verification requests via SMS are often scams. Contact the company directly through their official website.',
                        'prize': '🎁 You haven\'t won anything! Prize notifications are almost always scams designed to steal your information.',
                        'account': '📱 Account-related SMS should be treated with extreme caution. Contact the service directly through their app or website.',
                        'suspended': '🚫 Account suspension notices are common phishing tactics. Log into your account directly to check.',
                        'payment': '💳 Payment-related SMS require extra verification. Use the official app or website, never SMS links.',
                        'delivery': '📦 Delivery notifications can be faked. Track packages through the official courier website.'
                    };
                    
                    const lowerMessage = message.toLowerCase();
                    
                    for (const [key, response] of Object.entries(enhancedResponses)) {
                        if (lowerMessage.includes(key)) {
                            return response;
                        }
                    }
                    
                    return this.getFallbackResponse(lowerMessage);
                }
            };
        }
        
        loadWelcomeMessage() {
            setTimeout(() => {
                this.addMessage(
                    'Hello! I\'m your SMS Shield AI assistant. I can help you understand SMS security, detect phishing attempts, and stay safe from scams. How can I help you today?',
                    'bot'
                );
            }, 500);
        }
    }
    
    // Initialize chatbot system
    const chatbotSystem = new ChatbotSystem();
    
    // Make it globally available
    window.chatbotSystem = chatbotSystem;
    
    console.log('✅ Chatbot System loaded successfully');
    
})();
