
// ===== SMS SECURITY RULES & PRIVACY PROTECTION =====

class SMSSecurityRules {
    constructor() {
        this.securityRules = {
            // Trusted contacts (saved numbers) - NEVER READ
            trustedContacts: [],
            
            // Bank numbers - NEVER READ
            bankNumbers: [
                'BANK', 'CHASE', 'WELLS', 'BOA', 'CITI', 'AMEX', 'DISCOVER',
                'CAPITAL', 'USAA', 'NAVY', 'PNC', 'TD', 'REGIONS', 'SUNTRUST',
                'BB&T', 'KEY', 'FIFTH', 'HUNTINGTON', 'COMERICA', 'ZIONS'
            ],
            
            // Government numbers - NEVER READ
            governmentNumbers: [
                'IRS', 'SSA', 'DMV', 'USPS', 'FBI', 'CIA', 'NSA', 'DHS',
                'FEMA', 'CDC', 'FDA', 'EPA', 'DOT', 'VA', 'SSN', 'SOCIAL'
            ],
            
            // Healthcare numbers - NEVER READ
            healthcareNumbers: [
                'MEDICARE', 'MEDICAID', 'BLUE CROSS', 'AETNA', 'CIGNA',
                'UNITED HEALTH', 'HUMANA', 'KAISER', 'ANTHEM', 'HEALTH'
            ],
            
            // Emergency numbers - NEVER READ
            emergencyNumbers: ['911', '112', '999', '000', '110', '119'],
            
            // SMS patterns to IGNORE (legitimate messages)
            ignorePatterns: [
                /verification code/i,
                /OTP/i,
                /one-time password/i,
                /2FA/i,
                /two-factor/i,
                /login code/i,
                /security code/i,
                /confirmation code/i,
                /activation code/i,
                /reset code/i,
                /temporary code/i,
                /access code/i,
                /pin code/i,
                /authentication code/i,
                /your code is/i,
                /use code/i,
                /enter code/i,
                /code: \d{4,6}/i,
                /code is: \d{4,6}/i,
                /your code: \d{4,6}/i
            ],
            
            // High-risk patterns that trigger immediate analysis
            highRiskPatterns: [
                /urgent/i,
                /immediate action/i,
                /account suspended/i,
                /account blocked/i,
                /account locked/i,
                /verify now/i,
                /click here/i,
                /claim your/i,
                /you've won/i,
                /congratulations/i,
                /free gift/i,
                /limited time/i,
                /act now/i,
                /don't miss/i,
                /exclusive offer/i,
                /special deal/i,
                /discount code/i,
                /cash prize/i,
                /lottery/i,
                /inheritance/i,
                /refund/i,
                /tax refund/i,
                /overpayment/i,
                /suspended/i,
                /terminated/i,
                /penalty/i,
                /fine/i,
                /legal action/i,
                /court/i,
                /arrest/i,
                /warrant/i
            ]
        };
        
        this.privacySettings = {
            // Never read messages from saved contacts
            ignoreSavedContacts: true,
            
            // Never read bank messages
            ignoreBankMessages: true,
            
            // Never read government messages
            ignoreGovernmentMessages: true,
            
            // Never read healthcare messages
            ignoreHealthcareMessages: true,
            
            // Never read emergency messages
            ignoreEmergencyMessages: true,
            
            // Only analyze messages with suspicious patterns
            analyzeOnlySuspicious: true,
            
            // Maximum message length to analyze (privacy)
            maxMessageLength: 500,
            
            // Don't store full message content
            storeOnlyAnalysis: true,
            
            // Anonymize sender numbers
            anonymizeSenders: true
        };
        
        this.init();
    }
    
    async init() {
        // Load saved contacts to ignore
        await this.loadTrustedContacts();
        
        // Load user preferences
        await this.loadPrivacySettings();
        
        console.log('✅ SMS Security Rules initialized');
    }
    
    async loadTrustedContacts() {
        try {
            // Get saved contacts from device (if permission granted)
            if ('contacts' in navigator) {
                const permission = await navigator.permissions.query({ name: 'contacts' });
                if (permission.state === 'granted') {
                    const contacts = await navigator.contacts.select(['tel'], { multiple: true });
                    this.securityRules.trustedContacts = contacts.map(contact => 
                        contact.tel ? contact.tel[0] : null
                    ).filter(Boolean);
                }
            }
        } catch (error) {
            console.log('Could not load contacts (privacy protection)');
        }
    }
    
    async loadPrivacySettings() {
        try {
            const settings = localStorage.getItem('smsPrivacySettings');
            if (settings) {
                this.privacySettings = { ...this.privacySettings, ...JSON.parse(settings) };
            }
        } catch (error) {
            console.error('Error loading privacy settings:', error);
        }
    }
    
    // Check if SMS should be analyzed based on security rules
    shouldAnalyzeSMS(sms) {
        const { sender, body } = sms;
        
        // 1. Check if sender is in trusted contacts
        if (this.privacySettings.ignoreSavedContacts && this.isTrustedContact(sender)) {
            console.log('🚫 Ignoring SMS from trusted contact:', sender);
            return false;
        }
        
        // 2. Check if it's a bank message
        if (this.privacySettings.ignoreBankMessages && this.isBankMessage(sender, body)) {
            console.log('🚫 Ignoring bank message from:', sender);
            return false;
        }
        
        // 3. Check if it's a government message
        if (this.privacySettings.ignoreGovernmentMessages && this.isGovernmentMessage(sender, body)) {
            console.log('🚫 Ignoring government message from:', sender);
            return false;
        }
        
        // 4. Check if it's a healthcare message
        if (this.privacySettings.ignoreHealthcareMessages && this.isHealthcareMessage(sender, body)) {
            console.log('🚫 Ignoring healthcare message from:', sender);
            return false;
        }
        
        // 5. Check if it's an emergency message
        if (this.privacySettings.ignoreEmergencyMessages && this.isEmergencyMessage(sender)) {
            console.log('🚫 Ignoring emergency message from:', sender);
            return false;
        }
        
        // 6. Check if it matches ignore patterns (legitimate messages)
        if (this.matchesIgnorePattern(body)) {
            console.log('🚫 Ignoring legitimate message (verification code, etc.)');
            return false;
        }
        
        // 7. If analyzeOnlySuspicious is enabled, only analyze high-risk messages
        if (this.privacySettings.analyzeOnlySuspicious && !this.matchesHighRiskPattern(body)) {
            console.log('🚫 Message does not match high-risk patterns');
            return false;
        }
        
        // 8. Check message length for privacy
        if (body.length > this.privacySettings.maxMessageLength) {
            console.log('🚫 Message too long for analysis (privacy protection)');
            return false;
        }
        
        return true;
    }
    
    isTrustedContact(sender) {
        return this.securityRules.trustedContacts.includes(sender);
    }
    
    isBankMessage(sender, body) {
        const bankKeywords = this.securityRules.bankNumbers;
        const text = `${sender} ${body}`.toUpperCase();
        
        return bankKeywords.some(keyword => text.includes(keyword));
    }
    
    isGovernmentMessage(sender, body) {
        const govKeywords = this.securityRules.governmentNumbers;
        const text = `${sender} ${body}`.toUpperCase();
        
        return govKeywords.some(keyword => text.includes(keyword));
    }
    
    isHealthcareMessage(sender, body) {
        const healthKeywords = this.securityRules.healthcareNumbers;
        const text = `${sender} ${body}`.toUpperCase();
        
        return healthKeywords.some(keyword => text.includes(keyword));
    }
    
    isEmergencyMessage(sender) {
        return this.securityRules.emergencyNumbers.includes(sender);
    }
    
    matchesIgnorePattern(body) {
        return this.securityRules.ignorePatterns.some(pattern => pattern.test(body));
    }
    
    matchesHighRiskPattern(body) {
        return this.securityRules.highRiskPatterns.some(pattern => pattern.test(body));
    }
    
    // Anonymize sender for privacy
    anonymizeSender(sender) {
        if (!this.privacySettings.anonymizeSenders) {
            return sender;
        }
        
        // Keep first 3 and last 2 digits, replace middle with *
        if (sender.length >= 5) {
            return sender.substring(0, 3) + '*'.repeat(sender.length - 5) + sender.substring(sender.length - 2);
        }
        
        return '***' + sender.substring(sender.length - 2);
    }
    
    // Get safe message content for analysis
    getSafeMessageContent(sms) {
        const { body } = sms;
        
        // Truncate if too long
        if (body.length > this.privacySettings.maxMessageLength) {
            return body.substring(0, this.privacySettings.maxMessageLength) + '...';
        }
        
        return body;
    }
    
    // Update privacy settings
    updatePrivacySettings(newSettings) {
        this.privacySettings = { ...this.privacySettings, ...newSettings };
        localStorage.setItem('smsPrivacySettings', JSON.stringify(this.privacySettings));
    }
    
    // Get current privacy settings
    getPrivacySettings() {
        return { ...this.privacySettings };
    }
    
    // Add trusted contact
    addTrustedContact(phoneNumber) {
        if (!this.securityRules.trustedContacts.includes(phoneNumber)) {
            this.securityRules.trustedContacts.push(phoneNumber);
        }
    }
    
    // Remove trusted contact
    removeTrustedContact(phoneNumber) {
        this.securityRules.trustedContacts = this.securityRules.trustedContacts.filter(
            contact => contact !== phoneNumber
        );
    }
    
    // Get security statistics
    getSecurityStats() {
        return {
            trustedContactsCount: this.securityRules.trustedContacts.length,
            bankNumbersCount: this.securityRules.bankNumbers.length,
            governmentNumbersCount: this.securityRules.governmentNumbers.length,
            healthcareNumbersCount: this.securityRules.healthcareNumbers.length,
            emergencyNumbersCount: this.securityRules.emergencyNumbers.length,
            ignorePatternsCount: this.securityRules.ignorePatterns.length,
            highRiskPatternsCount: this.securityRules.highRiskPatterns.length
        };
    }
}

// Export for global access
window.smsSecurityRules = new SMSSecurityRules(); 