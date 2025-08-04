// ===== SMS PHISHING DETECTION CHATBOT =====

class SMSChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.currentStep = 'welcome';
        this.userName = '';
        this.init();
    }

    init() {
        this.createChatbotUI();
        this.loadKnowledgeBase();
        this.addEventListeners();
        this.showWelcomeMessage();
    }

    createChatbotUI() {
        const chatbotHTML = `
            <div id="chatbot-container" class="chatbot-container">
                <!-- Chatbot Header -->
                <div class="chatbot-header" id="chatbot-header">
                    <div class="chatbot-title">
                        <i class="fas fa-robot"></i>
                        <span>SMS Phishing Assistant</span>
                    </div>
                    <div class="chatbot-controls">
                        <button class="chatbot-minimize" id="chatbot-minimize">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="chatbot-close" id="chatbot-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <!-- Chat Messages -->
                <div class="chatbot-messages" id="chatbot-messages">
                    <!-- Messages will be added here -->
                </div>

                <!-- Quick Actions -->
                <div class="chatbot-quick-actions" id="chatbot-quick-actions">
                    <button class="quick-action" data-action="what-is-phishing">
                        <i class="fas fa-question-circle"></i>
                        What is SMS Phishing?
                    </button>
                    <button class="quick-action" data-action="how-to-use">
                        <i class="fas fa-play-circle"></i>
                        How to Use
                    </button>
                    <button class="quick-action" data-action="features">
                        <i class="fas fa-star"></i>
                        Features
                    </button>
                    <button class="quick-action" data-action="contact">
                        <i class="fas fa-phone"></i>
                        Contact Support
                    </button>
                </div>

                <!-- Input Area -->
                <div class="chatbot-input-area">
                    <div class="chatbot-input-container">
                        <input type="text" id="chatbot-input" placeholder="Ask me anything about SMS phishing..." />
                        <button id="chatbot-send">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Chatbot Toggle Button -->
            <div class="chatbot-toggle" id="chatbot-toggle">
                <i class="fas fa-comments"></i>
                <span>Need Help?</span>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    loadKnowledgeBase() {
        this.knowledgeBase = {
            'what-is-phishing': {
                title: 'What is SMS Phishing?',
                content: `SMS phishing (smishing) is a cyber attack where criminals send fraudulent text messages to trick you into revealing personal information, clicking malicious links, or downloading harmful software.

**Common SMS Phishing Tactics:**
• Fake bank alerts
• Package delivery scams
• Prize/gift notifications
• Urgent account updates
• Tax refund offers

**Red Flags to Watch For:**
• Urgent or threatening language
• Requests for personal information
• Suspicious links
• Unfamiliar sender numbers
• Too-good-to-be-true offers`,
                type: 'info'
            },
            'how-to-use': {
                title: 'How to Use Our SMS Phishing Detection',
                content: `**Step-by-Step Guide:**

1. **Go to Detection Page** - Click "Detection" in the navigation
2. **Choose Analysis Mode** - Select from Basic, Advanced, Real-time, or AI-Powered
3. **Paste SMS Message** - Copy and paste the suspicious SMS into the text area
4. **Click Analyze** - Our AI will analyze the message for phishing indicators
5. **Review Results** - Get detailed analysis with risk score and explanations
6. **Take Action** - Based on results, block the sender or report the scam

**For Bulk Analysis:**
• Upload a CSV file with multiple messages
• Get comprehensive analysis of all messages
• Export results for further review`,
                type: 'guide'
            },
            'features': {
                title: 'Our Advanced Features',
                content: `**🛡️ AI-Powered Detection**
• Naive Bayes Classifier for pattern recognition
• LSTM Neural Network for advanced text analysis
• Hybrid analysis combining multiple ML models

**📊 Dashboard & Analytics**
• Track your analysis history
• View phishing detection statistics
• Earn achievements and badges
• Monitor security trends

**📱 SMS Alert System**
• Share suspicious messages with community
• Receive real-time phishing alerts
• Stay updated on latest threats

**💬 Community Features**
• Create posts about phishing experiences
• Comment and interact with other users
• Build a security-conscious community

**📈 Bulk Analysis**
• Analyze multiple messages at once
• Export results to CSV
• Statistical analysis of results`,
                type: 'features'
            },
            'contact': {
                title: 'Contact Support',
                content: `**📧 Email:** alntino99@gmail.com
**📞 Phone:** +233 598182800 or +233 598809938
**🕐 Support:** 24/7 Available
**📍 Location:** Accra, Ghana

**Need Immediate Help?**
• Technical issues with the app
• Questions about analysis results
• Report bugs or suggest features
• General SMS phishing advice

We're here to help you stay safe from SMS phishing attacks!`,
                type: 'contact'
            },
            'red-flags': {
                title: 'SMS Phishing Red Flags',
                content: `**🚨 Immediate Warning Signs:**

**Urgency & Pressure:**
• "Act now or your account will be suspended"
• "Limited time offer - respond immediately"
• "Your package will be returned if not claimed today"

**Suspicious Requests:**
• Asking for passwords or PINs
• Requesting personal information
• Asking you to call an unknown number
• Requesting bank account details

**Suspicious Links:**
• Shortened URLs (bit.ly, tinyurl)
• Misspelled domain names
• Unfamiliar websites
• HTTP instead of HTTPS

**Too Good to Be True:**
• "You've won $10,000!"
• "Free iPhone - claim now!"
• "Tax refund available"

**Unknown Senders:**
• Numbers not in your contacts
• Generic sender names
• International numbers you don't recognize`,
                type: 'warning'
            },
            'prevention': {
                title: 'How to Prevent SMS Phishing',
                content: `**🛡️ Prevention Strategies:**

**Never Share Personal Information:**
• Banks will never ask for passwords via SMS
• Don't share PINs, passwords, or account numbers
• Be suspicious of requests for personal data

**Verify Before Acting:**
• Contact the organization directly using official numbers
• Check the sender's number against official sources
• Don't click links in suspicious messages

**Use Security Tools:**
• Enable SMS filtering on your phone
• Use our SMS Phishing Detection tool
• Report suspicious messages to authorities

**Stay Informed:**
• Keep up with latest phishing tactics
• Share information with family and friends
• Join our community for updates

**Trust Your Instincts:**
• If something feels wrong, it probably is
• Don't let urgency pressure you into acting
• When in doubt, delete the message`,
                type: 'prevention'
            },
            'reporting': {
                title: 'How to Report SMS Phishing',
                content: `**📞 Reporting Steps:**

**1. Don't Respond**
• Don't reply to the message
• Don't click any links
• Don't call numbers in the message

**2. Document the Message**
• Take a screenshot
• Note the sender's number
• Save the message content

**3. Report to Authorities**
• **Ghana:** Report to Cyber Security Authority
• **Your Bank:** Forward to your bank's official number
• **Phone Carrier:** Forward to your mobile provider

**4. Use Our Tool**
• Analyze the message with our detection system
• Share with our community (anonymously)
• Help others avoid similar scams

**5. Block the Number**
• Add to your phone's blocked list
• Prevent future messages from this sender

**Emergency Contacts:**
• Ghana Police: 191
• Cyber Security Authority: +233 302 222 222`,
                type: 'reporting'
            }
        };
    }

    addEventListeners() {
        // Toggle chatbot
        document.getElementById('chatbot-toggle').addEventListener('click', () => {
            this.toggleChatbot();
        });

        // Minimize chatbot
        document.getElementById('chatbot-minimize').addEventListener('click', () => {
            this.minimizeChatbot();
        });

        // Close chatbot
        document.getElementById('chatbot-close').addEventListener('click', () => {
            this.closeChatbot();
        });

        // Send message
        document.getElementById('chatbot-send').addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key in input
        document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Quick action buttons
        document.querySelectorAll('.quick-action').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    toggleChatbot() {
        const container = document.getElementById('chatbot-container');
        const toggle = document.getElementById('chatbot-toggle');
        
        if (this.isOpen) {
            container.classList.remove('chatbot-open');
            toggle.classList.remove('chatbot-toggle-active');
            this.isOpen = false;
        } else {
            container.classList.add('chatbot-open');
            toggle.classList.add('chatbot-toggle-active');
            this.isOpen = true;
            this.scrollToBottom();
        }
    }

    minimizeChatbot() {
        const container = document.getElementById('chatbot-container');
        container.classList.remove('chatbot-open');
        document.getElementById('chatbot-toggle').classList.remove('chatbot-toggle-active');
        this.isOpen = false;
    }

    closeChatbot() {
        this.minimizeChatbot();
        this.messages = [];
        this.currentStep = 'welcome';
        this.clearMessages();
    }

    showWelcomeMessage() {
        const welcomeMessage = {
            type: 'bot',
            content: `👋 Hello! I'm your SMS Phishing Assistant.

I can help you with:
• Understanding SMS phishing threats
• How to use our detection tools
• Prevention strategies
• Reporting suspicious messages
• General security advice

What would you like to know about?`,
            timestamp: new Date()
        };

        this.addMessage(welcomeMessage);
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();

        if (message) {
            // Add user message
            this.addMessage({
                type: 'user',
                content: message,
                timestamp: new Date()
            });

            // Clear input
            input.value = '';

            // Process and respond
            this.processUserMessage(message);
        }
    }

    processUserMessage(message) {
        const lowerMessage = message.toLowerCase();
        let response = null;

        // Check for specific keywords and patterns
        if (lowerMessage.includes('what is') || lowerMessage.includes('phishing') || lowerMessage.includes('smishing')) {
            response = this.knowledgeBase['what-is-phishing'];
        } else if (lowerMessage.includes('how to use') || lowerMessage.includes('detection') || lowerMessage.includes('analyze')) {
            response = this.knowledgeBase['how-to-use'];
        } else if (lowerMessage.includes('feature') || lowerMessage.includes('what can') || lowerMessage.includes('capability')) {
            response = this.knowledgeBase['features'];
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help')) {
            response = this.knowledgeBase['contact'];
        } else if (lowerMessage.includes('red flag') || lowerMessage.includes('warning') || lowerMessage.includes('suspicious')) {
            response = this.knowledgeBase['red-flags'];
        } else if (lowerMessage.includes('prevent') || lowerMessage.includes('avoid') || lowerMessage.includes('protect')) {
            response = this.knowledgeBase['prevention'];
        } else if (lowerMessage.includes('report') || lowerMessage.includes('authority') || lowerMessage.includes('police')) {
            response = this.knowledgeBase['reporting'];
        } else {
            // Default response for unrecognized queries
            response = {
                title: 'I\'m here to help!',
                content: `I understand you're asking about "${message}". Let me help you with some common topics:

**Quick Topics:**
• What is SMS phishing?
• How to use our detection tool
• Features of our app
• Contact support
• Red flags to watch for
• Prevention strategies
• How to report scams

Try asking about any of these topics, or use the quick action buttons above!`,
                type: 'help'
            };
        }

        // Add bot response
        setTimeout(() => {
            this.addMessage({
                type: 'bot',
                content: `**${response.title}**\n\n${response.content}`,
                timestamp: new Date()
            });
        }, 500);
    }

    handleQuickAction(action) {
        const response = this.knowledgeBase[action];
        if (response) {
            this.addMessage({
                type: 'bot',
                content: `**${response.title}**\n\n${response.content}`,
                timestamp: new Date()
            });
        }
    }

    addMessage(message) {
        this.messages.push(message);
        this.displayMessage(message);
        this.scrollToBottom();
    }

    displayMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `chatbot-message ${message.type}-message`;

        const time = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-text">${this.formatMessage(message.content)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;

        messagesContainer.appendChild(messageElement);
    }

    formatMessage(content) {
        // Convert markdown-style formatting to HTML
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/•/g, '• ');
    }

    clearMessages() {
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.innerHTML = '';
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.smsChatbot = new SMSChatbot();
}); 