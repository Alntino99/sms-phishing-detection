// SMS Monitoring Service Worker
// Provides background SMS monitoring and analysis

const CACHE_NAME = 'sms-shield-v1';
const SMS_ANALYSIS_CACHE = 'sms-analyses';

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('📱 SMS Monitor Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll([
                    '/',
                    '/index.html',
                    '/detect.html',
                    '/dashboard.html',
                    '/mobile-sms-integration.js',
                    '/gemini-ai.js',
                    '/enhanced-design.css',
                    '/mobile-enhancements.css',
                    '/favicon.svg'
                ]);
            })
            .then(() => {
                console.log('✅ SMS Monitor Service Worker installed');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('📱 SMS Monitor Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ SMS Monitor Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Background SMS monitoring
let smsMonitoringInterval = null;

// Start SMS monitoring
function startSMSMonitoring() {
    if (smsMonitoringInterval) {
        clearInterval(smsMonitoringInterval);
    }
    
    // Check for new SMS every 15 seconds
    smsMonitoringInterval = setInterval(async () => {
        await checkForNewSMS();
    }, 15000);
    
    console.log('📱 Background SMS monitoring started');
}

// Stop SMS monitoring
function stopSMSMonitoring() {
    if (smsMonitoringInterval) {
        clearInterval(smsMonitoringInterval);
        smsMonitoringInterval = null;
    }
    console.log('📱 Background SMS monitoring stopped');
}

// Check for new SMS messages
async function checkForNewSMS() {
    try {
        // This would integrate with actual SMS APIs
        // For demonstration, we'll simulate SMS detection
        
        // Check if we should simulate a new SMS (10% chance)
        if (Math.random() < 0.1) {
            const testMessages = [
                {
                    id: Date.now(),
                    sender: '+1234567890',
                    message: 'Your bank account has been suspended. Click here to verify: http://fake-bank-verify.com',
                    timestamp: new Date().toISOString()
                },
                {
                    id: Date.now() + 1,
                    sender: '+1987654321',
                    message: 'Congratulations! You\'ve won $5000! Claim your prize now: http://fake-lottery-win.com',
                    timestamp: new Date().toISOString()
                },
                {
                    id: Date.now() + 2,
                    sender: '+1555123456',
                    message: 'Your package is ready for pickup. Click here to schedule: http://fake-delivery-pickup.com',
                    timestamp: new Date().toISOString()
                },
                {
                    id: Date.now() + 3,
                    sender: '+1444567890',
                    message: 'Your credit card has been charged $299.99. If this wasn\'t you, call immediately: 1-800-FAKE-BANK',
                    timestamp: new Date().toISOString()
                }
            ];
            
            const randomSMS = testMessages[Math.floor(Math.random() * testMessages.length)];
            await processIncomingSMS(randomSMS);
        }
    } catch (error) {
        console.error('❌ SMS check failed:', error);
    }
}

// Process incoming SMS
async function processIncomingSMS(smsData) {
    try {
        console.log('📱 New SMS detected:', smsData);
        
        // Analyze the SMS
        const analysis = await analyzeSMS(smsData.message);
        
        // Store analysis result
        await storeSMSAnalysis({
            ...smsData,
            analysis,
            processedAt: new Date().toISOString()
        });
        
        // Send notification to user
        await sendSMSNotification(smsData, analysis);
        
        // Notify all clients
        await notifyClients('new-sms', {
            sms: smsData,
            analysis: analysis
        });
        
        console.log('✅ SMS processed:', analysis);
        
    } catch (error) {
        console.error('❌ SMS processing failed:', error);
    }
}

// Analyze SMS using AI/rule-based system
async function analyzeSMS(message) {
    try {
        // Rule-based analysis (same as in main integration)
        const phishingKeywords = [
            'urgent', 'account suspended', 'verify now', 'click here',
            'bank account', 'credit card', 'social security', 'tax refund',
            'lottery winner', 'inheritance', 'free money', 'limited time',
            'account locked', 'security alert', 'verify identity'
        ];
        
        const suspiciousPatterns = [
            /https?:\/\/[^\s]+/g,  // URLs
            /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,  // Credit card numbers
            /\b\d{3}-\d{2}-\d{4}\b/g,  // SSN pattern
        ];
        
        let score = 0;
        const reasons = [];
        
        // Check for phishing keywords
        const lowerMessage = message.toLowerCase();
        phishingKeywords.forEach(keyword => {
            if (lowerMessage.includes(keyword)) {
                score += 20;
                reasons.push(`Contains suspicious keyword: "${keyword}"`);
            }
        });
        
        // Check for suspicious patterns
        suspiciousPatterns.forEach(pattern => {
            if (pattern.test(message)) {
                score += 15;
                reasons.push('Contains suspicious pattern');
            }
        });
        
        // Check for urgency indicators
        const urgencyWords = ['urgent', 'immediate', 'now', 'quick', 'fast'];
        urgencyWords.forEach(word => {
            if (lowerMessage.includes(word)) {
                score += 10;
                reasons.push('Contains urgency indicators');
            }
        });
        
        const isPhishing = score >= 30;
        const confidence = Math.min(score, 100);
        
        return {
            isPhishing,
            confidence,
            reason: reasons.join('; '),
            recommendations: isPhishing ? [
                'Do not click any links',
                'Do not provide personal information',
                'Contact the sender through official channels',
                'Report as spam if suspicious'
            ] : [
                'Message appears safe',
                'Continue with normal communication'
            ]
        };
        
    } catch (error) {
        console.error('SMS analysis failed:', error);
        return {
            isPhishing: false,
            confidence: 0,
            reason: 'Analysis failed',
            recommendations: ['Unable to analyze message']
        };
    }
}

// Store SMS analysis in cache
async function storeSMSAnalysis(analysisData) {
    try {
        const cache = await caches.open(SMS_ANALYSIS_CACHE);
        const response = new Response(JSON.stringify(analysisData));
        await cache.put(`sms-${analysisData.id}`, response);
        
        // Also store in IndexedDB for better persistence
        await storeInIndexedDB(analysisData);
        
    } catch (error) {
        console.error('Failed to store SMS analysis:', error);
    }
}

// Store in IndexedDB
async function storeInIndexedDB(analysisData) {
    try {
        const db = await openIndexedDB();
        const transaction = db.transaction(['smsAnalyses'], 'readwrite');
        const store = transaction.objectStore('smsAnalyses');
        
        await store.add(analysisData);
        
    } catch (error) {
        console.error('IndexedDB storage failed:', error);
    }
}

// Open IndexedDB
async function openIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('SMSShieldDB', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Create object store for SMS analyses
            if (!db.objectStoreNames.contains('smsAnalyses')) {
                const store = db.createObjectStore('smsAnalyses', { keyPath: 'id' });
                store.createIndex('timestamp', 'timestamp', { unique: false });
                store.createIndex('isPhishing', 'analysis.isPhishing', { unique: false });
            }
        };
    });
}

// Send SMS notification
async function sendSMSNotification(smsData, analysis) {
    try {
        const title = analysis.isPhishing ? '🚨 Phishing Alert!' : '✅ Safe Message';
        const body = analysis.isPhishing 
            ? `Suspicious SMS from ${smsData.sender}: ${analysis.reason}`
            : `Safe message from ${smsData.sender}`;
        
        const options = {
            body: body,
            icon: '/favicon.svg',
            badge: '/favicon.svg',
            tag: `sms-${smsData.id}`,
            requireInteraction: analysis.isPhishing,
            data: {
                smsId: smsData.id,
                analysis: analysis
            },
            actions: analysis.isPhishing ? [
                {
                    action: 'report',
                    title: 'Report as Spam'
                },
                {
                    action: 'block',
                    title: 'Block Sender'
                },
                {
                    action: 'view',
                    title: 'View Details'
                }
            ] : [
                {
                    action: 'view',
                    title: 'View Details'
                }
            ]
        };
        
        await self.registration.showNotification(title, options);
        
    } catch (error) {
        console.error('Notification failed:', error);
    }
}

// Notify all clients
async function notifyClients(type, data) {
    try {
        const clients = await self.clients.matchAll();
        
        clients.forEach(client => {
            client.postMessage({
                type: type,
                data: data,
                timestamp: new Date().toISOString()
            });
        });
        
    } catch (error) {
        console.error('Client notification failed:', error);
    }
}

// Handle push notifications
self.addEventListener('push', (event) => {
    console.log('📱 Push notification received:', event);
    
    if (event.data) {
        const data = event.data.json();
        
        if (data.type === 'sms-alert') {
            event.waitUntil(
                sendSMSNotification(data.sms, data.analysis)
            );
        }
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('📱 Notification clicked:', event);
    
    event.notification.close();
    
    const data = event.notification.data;
    
    if (event.action === 'view' || !event.action) {
        // Open the app and show SMS details
        event.waitUntil(
            self.clients.matchAll()
                .then(clients => {
                    if (clients.length > 0) {
                        // Focus existing client
                        return clients[0].focus();
                    } else {
                        // Open new client
                        return self.clients.openWindow('/detect.html');
                    }
                })
                .then(client => {
                    if (client && data) {
                        // Send SMS data to client
                        client.postMessage({
                            type: 'show-sms-details',
                            data: data
                        });
                    }
                })
        );
    } else if (event.action === 'report') {
        // Report as spam
        event.waitUntil(
            reportAsSpam(data.smsId)
        );
    } else if (event.action === 'block') {
        // Block sender
        event.waitUntil(
            blockSender(data.smsId)
        );
    }
});

// Report SMS as spam
async function reportAsSpam(smsId) {
    try {
        console.log('🚫 Reporting SMS as spam:', smsId);
        
        // Store in spam list
        const spamList = JSON.parse(localStorage.getItem('spam_list') || '[]');
        spamList.push({
            id: smsId,
            reportedAt: new Date().toISOString()
        });
        localStorage.setItem('spam_list', JSON.stringify(spamList));
        
        // Notify clients
        await notifyClients('spam-reported', { smsId });
        
    } catch (error) {
        console.error('Spam reporting failed:', error);
    }
}

// Block sender
async function blockSender(smsId) {
    try {
        console.log('🚫 Blocking sender for SMS:', smsId);
        
        // Store in blocked list
        const blockedList = JSON.parse(localStorage.getItem('blocked_list') || '[]');
        blockedList.push({
            smsId: smsId,
            blockedAt: new Date().toISOString()
        });
        localStorage.setItem('blocked_list', JSON.stringify(blockedList));
        
        // Notify clients
        await notifyClients('sender-blocked', { smsId });
        
    } catch (error) {
        console.error('Sender blocking failed:', error);
    }
}

// Handle messages from clients
self.addEventListener('message', (event) => {
    console.log('📱 Message from client:', event.data);
    
    const { type, data } = event.data;
    
    switch (type) {
        case 'start-monitoring':
            startSMSMonitoring();
            event.ports[0].postMessage({ success: true });
            break;
            
        case 'stop-monitoring':
            stopSMSMonitoring();
            event.ports[0].postMessage({ success: true });
            break;
            
        case 'get-status':
            event.ports[0].postMessage({
                monitoring: smsMonitoringInterval !== null,
                timestamp: new Date().toISOString()
            });
            break;
            
        case 'test-sms':
            event.waitUntil(
                processIncomingSMS({
                    id: Date.now(),
                    sender: '+1234567890',
                    message: data.message || 'Test SMS message',
                    timestamp: new Date().toISOString()
                })
            );
            break;
            
        default:
            console.log('Unknown message type:', type);
    }
});

// Handle fetch events
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Handle SMS-related API calls
    if (url.pathname.startsWith('/api/sms/')) {
        event.respondWith(handleSMSAPI(event.request));
        return;
    }
    
    // Cache-first strategy for other resources
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

// Handle SMS API calls
async function handleSMSAPI(request) {
    try {
        const url = new URL(request.url);
        
        if (url.pathname === '/api/sms/status') {
            return new Response(JSON.stringify({
                monitoring: smsMonitoringInterval !== null,
                timestamp: new Date().toISOString()
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        if (url.pathname === '/api/sms/history') {
            const analyses = await getSMSHistory();
            return new Response(JSON.stringify(analyses), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        if (url.pathname === '/api/sms/clear') {
            await clearSMSHistory();
            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return new Response('Not found', { status: 404 });
        
    } catch (error) {
        console.error('SMS API error:', error);
        return new Response('Internal error', { status: 500 });
    }
}

// Get SMS history
async function getSMSHistory() {
    try {
        const db = await openIndexedDB();
        const transaction = db.transaction(['smsAnalyses'], 'readonly');
        const store = transaction.objectStore('smsAnalyses');
        
        return await store.getAll();
        
    } catch (error) {
        console.error('Failed to get SMS history:', error);
        return [];
    }
}

// Clear SMS history
async function clearSMSHistory() {
    try {
        const db = await openIndexedDB();
        const transaction = db.transaction(['smsAnalyses'], 'readwrite');
        const store = transaction.objectStore('smsAnalyses');
        
        await store.clear();
        
        // Also clear cache
        const cache = await caches.open(SMS_ANALYSIS_CACHE);
        await cache.keys().then(keys => {
            return Promise.all(keys.map(key => cache.delete(key)));
        });
        
    } catch (error) {
        console.error('Failed to clear SMS history:', error);
    }
}

// Start monitoring when service worker activates
self.addEventListener('activate', (event) => {
    event.waitUntil(
        startSMSMonitoring()
    );
});

console.log('📱 SMS Monitor Service Worker loaded'); 