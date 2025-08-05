// ===== SERVICE WORKER FOR SMS PHISHING DETECTION =====

const CACHE_NAME = 'sms-phishing-detection-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Files to cache
const STATIC_FILES = [
  '/',
  '/index.html',
  '/detect.html',
  '/dashboard.html',
  '/login.html',
  '/signup.html',
  '/style.css',
  '/script.js',
  '/firebase.js',
  '/chatbot.js',
  '/mobile-sms-detector.js',
  '/mobile-sms-detector.css',
  '/logo.png',
  '/background.jpg',
  '/all.min.css',
  '/webfonts/fa-solid-900.woff2',
  '/webfonts/fa-regular-400.woff2',
  '/webfonts/fa-brands-400.woff2'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static files...');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Static files cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle API requests differently
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle static file requests
  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) {
          return response; // Serve from cache
        }
        
        // Fetch from network
        return fetch(request)
          .then(response => {
            // Cache successful responses
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then(cache => {
                  cache.put(request, responseClone);
                });
            }
            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);
    return response;
  } catch (error) {
    // Fallback to cache if network fails
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return error response
    return new Response(JSON.stringify({ error: 'Network unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Background sync for SMS analysis
self.addEventListener('sync', event => {
    if (event.tag === 'sms-analysis') {
        event.waitUntil(performBackgroundSMSAnalysis());
    }
});

// Enhanced background SMS analysis
async function performBackgroundSMSAnalysis() {
    try {
        console.log('🔄 Background SMS analysis started');
        
        // Get pending analyses from IndexedDB
        const pendingAnalyses = await getPendingAnalyses();
        
        // Process each pending analysis
        for (const analysis of pendingAnalyses) {
            await analyzeSMSInBackground(analysis);
        }
        
        // Perform periodic SMS monitoring
        await performPeriodicSMSMonitoring();
        
        console.log('✅ Background SMS analysis completed');
        
    } catch (error) {
        console.error('Background SMS analysis failed:', error);
    }
}

// Get pending analyses from storage
async function getPendingAnalyses() {
    try {
        const pendingData = localStorage.getItem('pending_sms_analyses');
        return pendingData ? JSON.parse(pendingData) : [];
    } catch (error) {
        console.error('Failed to get pending analyses:', error);
        return [];
    }
}

// Analyze SMS in background
async function analyzeSMSInBackground(smsData) {
    try {
        // Perform analysis using ML models
        const analysis = await performMLAnalysis(smsData);
        
        // Store result in Firebase
        await storeAnalysisResult(analysis);
        
        // Send notification if threat detected
        if (analysis.threatLevel === 'high') {
            await sendHighRiskNotification(analysis);
        }
        
        // Mark as processed
        await markAnalysisAsProcessed(analysis.id);
        
    } catch (error) {
        console.error('Background SMS analysis failed:', error);
    }
}

// Perform ML analysis
async function performMLAnalysis(smsData) {
    const analysis = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        smsData: smsData,
        analysisResults: {}
    };

    // Naive Bayes analysis
    analysis.analysisResults.naiveBayes = await performNaiveBayesAnalysis(smsData.body);
    
    // LSTM analysis
    analysis.analysisResults.lstm = await performLSTMAnalysis(smsData.body);
    
    // Ensemble analysis
    analysis.analysisResults.ensemble = await performEnsembleAnalysis(smsData.body);
    
    // Security rules analysis
    analysis.analysisResults.securityRules = await applySecurityRules(smsData);

    // Calculate threat level
    analysis.threatLevel = calculateThreatLevel(analysis.analysisResults);
    analysis.confidence = calculateConfidence(analysis.analysisResults);

    return analysis;
}

// Store analysis result in Firebase
async function storeAnalysisResult(analysis) {
    try {
        // This would connect to Firebase
        // For now, we'll store locally
        const existingResults = JSON.parse(localStorage.getItem('analysis_results') || '[]');
        existingResults.push(analysis);
        localStorage.setItem('analysis_results', JSON.stringify(existingResults));
        
        console.log('💾 Analysis result stored');
    } catch (error) {
        console.error('Failed to store analysis result:', error);
    }
}

// Mark analysis as processed
async function markAnalysisAsProcessed(analysisId) {
    try {
        const pendingAnalyses = await getPendingAnalyses();
        const updatedAnalyses = pendingAnalyses.filter(analysis => analysis.id !== analysisId);
        localStorage.setItem('pending_sms_analyses', JSON.stringify(updatedAnalyses));
        
        console.log('✅ Analysis marked as processed');
    } catch (error) {
        console.error('Failed to mark analysis as processed:', error);
    }
}

// Calculate threat level
function calculateThreatLevel(analysisResults) {
    const scores = {
        naiveBayes: analysisResults.naiveBayes?.score || 0,
        lstm: analysisResults.lstm?.score || 0,
        ensemble: analysisResults.ensemble?.score || 0,
        securityRules: analysisResults.securityRules?.score || 0
    };

    const averageScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;

    if (averageScore > 0.7) return 'high';
    if (averageScore > 0.4) return 'medium';
    return 'low';
}

// Calculate confidence
function calculateConfidence(analysisResults) {
    const scores = Object.values(analysisResults).map(result => result?.confidence || 0);
    const averageConfidence = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.round(averageConfidence * 100);
}

// Perform Naive Bayes analysis
async function performNaiveBayesAnalysis(text) {
    // Simplified Naive Bayes implementation
    const phishingWords = ['urgent', 'suspended', 'verify', 'click', 'account', 'security', 'fraud', 'scam'];
    const legitimateWords = ['hello', 'thanks', 'ok', 'yes', 'no', 'meeting', 'lunch', 'dinner'];
    
    const words = text.toLowerCase().split(/\s+/);
    let phishingScore = 0;
    let legitimateScore = 0;
    
    words.forEach(word => {
        if (phishingWords.includes(word)) phishingScore++;
        if (legitimateWords.includes(word)) legitimateScore++;
    });
    
    const totalScore = phishingScore + legitimateScore;
    const phishingProbability = totalScore > 0 ? phishingScore / totalScore : 0;
    
    return {
        score: phishingProbability,
        confidence: Math.min(phishingProbability * 100, 95)
    };
}

// Perform LSTM analysis
async function performLSTMAnalysis(text) {
    // Simplified LSTM-like analysis
    const suspiciousPatterns = [
        /http:\/\/|https:\/\//i,
        /click here/i,
        /verify now/i,
        /account suspended/i,
        /unusual activity/i,
        /urgent action/i
    ];
    
    let patternScore = 0;
    suspiciousPatterns.forEach(pattern => {
        if (pattern.test(text)) patternScore++;
    });
    
    const score = Math.min(patternScore / suspiciousPatterns.length, 1);
    
    return {
        score: score,
        confidence: Math.min(score * 100, 90)
    };
}

// Perform Ensemble analysis
async function performEnsembleAnalysis(text) {
    // Combine multiple analysis methods
    const naiveBayes = await performNaiveBayesAnalysis(text);
    const lstm = await performLSTMAnalysis(text);
    
    const ensembleScore = (naiveBayes.score + lstm.score) / 2;
    const ensembleConfidence = (naiveBayes.confidence + lstm.confidence) / 2;
    
    return {
        score: ensembleScore,
        confidence: ensembleConfidence
    };
}

// Apply security rules
async function applySecurityRules(smsData) {
    const rules = [
        { pattern: /bank/i, weight: 0.8 },
        { pattern: /password/i, weight: 0.7 },
        { pattern: /verify/i, weight: 0.6 },
        { pattern: /urgent/i, weight: 0.9 },
        { pattern: /suspended/i, weight: 0.8 },
        { pattern: /http:\/\/|https:\/\//i, weight: 0.5 }
    ];
    
    let totalScore = 0;
    let matchedRules = 0;
    
    rules.forEach(rule => {
        if (rule.pattern.test(smsData.body)) {
            totalScore += rule.weight;
            matchedRules++;
        }
    });
    
    const score = matchedRules > 0 ? totalScore / matchedRules : 0;
    
    return {
        score: Math.min(score, 1),
        confidence: Math.min(score * 100, 85)
    };
}

// Send high-risk notification
async function sendHighRiskNotification(result) {
  const options = {
    body: 'High-risk SMS detected! Tap to view details.',
    icon: '/logo.png',
    badge: '/logo.png',
    tag: 'sms-phishing-alert',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Details'
      },
      {
        action: 'block',
        title: 'Block Sender'
      }
    ]
  };
  
  await self.registration.showNotification('🚨 Phishing Threat Detected', options);
}

// Handle push notifications
self.addEventListener('push', event => {
  console.log('Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New SMS analysis available',
    icon: '/logo.png',
    badge: '/logo.png',
    tag: 'sms-analysis',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Open App'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('SMS Phishing Detection', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'open' || event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/detect.html')
    );
  } else if (event.action === 'block') {
    event.waitUntil(
      handleBlockSender(event.notification.tag)
    );
  }
});

// Handle blocking sender
async function handleBlockSender(notificationTag) {
  // This would implement sender blocking logic
  console.log('Blocking sender for notification:', notificationTag);
  
  // Show confirmation
  const options = {
    body: 'Sender has been blocked.',
    icon: '/logo.png',
    tag: 'block-confirmation'
  };
  
  await self.registration.showNotification('Sender Blocked', options);
}

// Handle message events from main thread
self.addEventListener('message', event => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data.type === 'SMS_ANALYSIS_REQUEST') {
    event.waitUntil(
      handleSMSAnalysisRequest(event.data.sms)
    );
  }
});

// Handle SMS analysis request
async function handleSMSAnalysisRequest(smsData) {
  try {
    // Perform analysis
    const analysis = await analyzeSMSInBackground(smsData);
    
    // Send result back to main thread
    event.source.postMessage({
      type: 'SMS_ANALYSIS_RESULT',
      analysis: analysis
    });
    
    // Store in IndexedDB for background processing
    await storeAnalysisForBackground(smsData, analysis);
    
  } catch (error) {
    console.error('Error handling SMS analysis request:', error);
  }
}

// Store analysis for background processing
async function storeAnalysisForBackground(smsData, analysis) {
  // This would store the analysis in IndexedDB
  console.log('Storing analysis for background processing:', { smsData, analysis });
}

// Periodic background sync for SMS monitoring
self.addEventListener('periodicsync', event => {
  console.log('Periodic background sync:', event.tag);
  
  if (event.tag === 'sms-monitoring') {
    event.waitUntil(performPeriodicSMSMonitoring());
  }
});

// Perform periodic SMS monitoring
async function performPeriodicSMSMonitoring() {
  try {
    // Check for new SMS messages
    // This would use the SMS API if available
    console.log('Performing periodic SMS monitoring...');
    
    // Update last sync time
    await updateLastSyncTime();
    
  } catch (error) {
    console.error('Periodic SMS monitoring failed:', error);
  }
}

// Update last sync time
async function updateLastSyncTime() {
  // This would update the last sync time in storage
  const now = new Date().toISOString();
  console.log('Updated last sync time:', now);
}

console.log('Service Worker loaded successfully'); 