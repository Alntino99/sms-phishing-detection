// ===== SMS MONITORING SERVICE WORKER =====
// Handles background SMS monitoring and notifications

const CACHE_NAME = 'sms-monitor-v1';
const STATIC_FILES = [
    '/',
    '/index.html',
    '/detect.html',
    '/mobile-test.html',
    '/manifest.json',
    '/favicon.svg',
    '/ml-classifiers.js',
    '/cross-platform-ml.js',
    '/real-time-sms-monitor.js'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('📱 SMS Monitor Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📱 Caching static files for SMS monitoring');
                return cache.addAll(STATIC_FILES);
            })
            .catch(error => {
                console.log('📱 Cache installation failed:', error);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('📱 SMS Monitor Service Worker activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('📱 Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Background sync for SMS monitoring
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync triggered:', event.tag);
    
    if (event.tag === 'sms-check') {
        event.waitUntil(checkForNewSMS());
    }
});

// Handle push notifications
self.addEventListener('push', (event) => {
    console.log('🔔 Push notification received');
    
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.message,
            icon: '/favicon.svg',
            badge: '/favicon.svg',
            tag: 'sms-analysis',
            data: data,
            actions: [
                {
                    action: 'view',
                    title: 'View Details'
                },
                {
                    action: 'dismiss',
                    title: 'Dismiss'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'view') {
        // Open the notification center
        event.waitUntil(
            clients.openWindow('/detect.html?notification=' + event.notification.data.notificationId)
        );
    }
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
    console.log('📱 Message received in service worker:', event.data);
    
    switch (event.data.type) {
        case 'START_MONITORING':
            startSMSMonitoring();
            break;
        case 'STOP_MONITORING':
            stopSMSMonitoring();
            break;
        case 'SMS_DETECTED':
            handleSMSDetection(event.data.sms);
            break;
        case 'PERMISSION_REQUEST':
            requestPermissions();
            break;
    }
});

// SMS monitoring functions
let isMonitoring = false;
let monitoringInterval = null;

function startSMSMonitoring() {
    if (isMonitoring) return;
    
    console.log('🚀 Starting SMS monitoring in service worker...');
    isMonitoring = true;
    
    // Set up periodic SMS checks
    monitoringInterval = setInterval(() => {
        checkForNewSMS();
    }, 30000); // Check every 30 seconds
    
    // Also check immediately
    checkForNewSMS();
    
    // Notify main thread
    notifyMainThread({
        type: 'MONITORING_STARTED',
        status: 'active'
    });
}

function stopSMSMonitoring() {
    console.log('⏹️ Stopping SMS monitoring in service worker...');
    isMonitoring = false;
    
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
    }
    
    // Notify main thread
    notifyMainThread({
        type: 'MONITORING_STOPPED',
        status: 'inactive'
    });
}

async function checkForNewSMS() {
    if (!isMonitoring) return;
    
    try {
        console.log('📱 Checking for new SMS...');
        
        // In a real implementation, this would access the device's SMS API
        // For now, we'll simulate SMS detection
        await simulateSMSDetection();
        
    } catch (error) {
        console.error('❌ SMS check failed:', error);
    }
}

async function simulateSMSDetection() {
    // Simulate incoming SMS for testing
    const testSMS = [
        {
            id: Date.now(),
            sender: '+1234567890',
            message: "URGENT: Your bank account has been suspended. Click here to verify: http://fake-bank.com",
            timestamp: new Date().toISOString()
        },
        {
            id: Date.now() + 1,
            sender: '+1987654321',
            message: "Congratulations! You've won $1,000,000. Claim now: http://fake-prize.com",
            timestamp: new Date().toISOString()
        },
        {
            id: Date.now() + 2,
            sender: '+1555123456',
            message: "Your package has been delivered. Track here: http://legitimate-delivery.com",
            timestamp: new Date().toISOString()
        },
        {
            id: Date.now() + 3,
            sender: '+1444567890',
            message: "Security alert: Unusual login detected. Verify here: http://fake-security.com",
            timestamp: new Date().toISOString()
        }
    ];
    
    // Randomly select an SMS for testing
    const randomSMS = testSMS[Math.floor(Math.random() * testSMS.length)];
    
    // Simulate SMS reception with random delay
    setTimeout(() => {
        handleSMSDetection(randomSMS);
    }, Math.random() * 10000);
}

async function handleSMSDetection(sms) {
    console.log('📱 SMS detected in service worker:', sms);
    
    // Analyze the SMS
    const analysis = await analyzeSMS(sms.message);
    
    // Create notification data
    const notificationData = {
        id: Date.now(),
        type: 'sms_analysis',
        title: analysis.isPhishing ? '🚨 Phishing SMS Detected!' : '✅ Safe SMS',
        message: sms.message,
        sender: sms.sender,
        timestamp: new Date().toISOString(),
        analysis: analysis,
        isRead: false
    };
    
    // Send to main thread
    notifyMainThread({
        type: 'SMS_RECEIVED',
        sms: sms,
        notification: notificationData
    });
    
    // Show push notification
    await showPushNotification(notificationData);
}

async function analyzeSMS(message) {
    // Simple keyword-based analysis for service worker
    const suspiciousKeywords = ['urgent', 'bank', 'password', 'click', 'verify', 'suspended', 'locked', 'prize', 'won', 'claim'];
    const foundKeywords = suspiciousKeywords.filter(keyword => 
        message.toLowerCase().includes(keyword)
    );
    
    const isPhishing = foundKeywords.length > 0;
    const confidence = Math.min(0.9, foundKeywords.length * 0.2);
    
    return {
        isPhishing: isPhishing,
        confidence: confidence,
        riskLevel: isPhishing ? 'High' : 'Low',
        keywords: foundKeywords
    };
}

async function showPushNotification(notification) {
    const options = {
        body: notification.message,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: 'sms-analysis',
        data: {
            notificationId: notification.id,
            analysis: notification.analysis
        },
        actions: [
            {
                action: 'view',
                title: 'View Details'
            },
            {
                action: 'dismiss',
                title: 'Dismiss'
            }
        ]
    };
    
    try {
        await self.registration.showNotification(notification.title, options);
        console.log('🔔 Push notification sent from service worker');
    } catch (error) {
        console.error('❌ Push notification failed:', error);
    }
}

function notifyMainThread(data) {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage(data);
        });
    });
}

async function requestPermissions() {
    console.log('🔐 Requesting permissions in service worker...');
    
    // Request notification permission
    if ('Notification' in self) {
        const permission = await Notification.requestPermission();
        console.log('🔔 Notification permission:', permission);
        
        notifyMainThread({
            type: 'PERMISSION_UPDATE',
            permissions: {
                notifications: permission === 'granted'
            }
        });
    }
}

// Handle fetch events
self.addEventListener('fetch', (event) => {
    // Handle API requests
    if (event.request.url.includes('/api/')) {
        event.respondWith(handleAPIRequest(event.request));
    } else {
        // Serve from cache for static files
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    return response || fetch(event.request);
                })
        );
    }
});

async function handleAPIRequest(request) {
    try {
        const response = await fetch(request);
        return response;
    } catch (error) {
        console.error('❌ API request failed:', error);
        return new Response(JSON.stringify({ error: 'Network error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

console.log('✅ SMS Monitor Service Worker loaded'); 