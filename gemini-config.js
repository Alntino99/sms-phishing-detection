// Gemini AI Configuration with Demo Mode and User API Management
// This system allows users to test with demo API and then add their own

// Demo API key for testing (your key)
const DEMO_GEMINI_API_KEY = 'AIzaSyBioNiN-EnZCv1dYqSV83QDxV8RVK21Omg';

// User API key management
class GeminiAPIKeyManager {
  constructor() {
    this.demoKey = DEMO_GEMINI_API_KEY;
    this.userKey = localStorage.getItem('user_gemini_api_key');
    this.isDemoMode = !this.userKey;
    this.usageCount = parseInt(localStorage.getItem('demo_usage_count') || '0');
    this.maxDemoUsage = 10; // Limit demo usage to 10 requests
  }

  // Get current API key (demo or user)
  getCurrentAPIKey() {
    return this.userKey || this.demoKey;
  }

  // Check if using demo mode
  isUsingDemo() {
    return this.isDemoMode;
  }

  // Check demo usage limit
  canUseDemo() {
    return this.isDemoMode && this.usageCount < this.maxDemoUsage;
  }

  // Increment demo usage
  incrementDemoUsage() {
    if (this.isDemoMode) {
      this.usageCount++;
      localStorage.setItem('demo_usage_count', this.usageCount.toString());
    }
  }

  // Set user API key
  setUserAPIKey(apiKey) {
    this.userKey = apiKey;
    this.isDemoMode = false;
    localStorage.setItem('user_gemini_api_key', apiKey);
    localStorage.removeItem('demo_usage_count'); // Reset demo usage
    this.usageCount = 0;
  }

  // Remove user API key (back to demo)
  removeUserAPIKey() {
    this.userKey = null;
    this.isDemoMode = true;
    localStorage.removeItem('user_gemini_api_key');
    this.usageCount = 0;
  }

  // Get usage statistics
  getUsageStats() {
    return {
      isDemoMode: this.isDemoMode,
      demoUsageCount: this.usageCount,
      maxDemoUsage: this.maxDemoUsage,
      remainingDemoUsage: Math.max(0, this.maxDemoUsage - this.usageCount)
    };
  }
}

// Initialize API key manager
window.geminiAPIKeyManager = new GeminiAPIKeyManager();

// Initialize Gemini AI when the page loads
document.addEventListener('DOMContentLoaded', function() {
  const manager = window.geminiAPIKeyManager;
  const stats = manager.getUsageStats();
  
  if (stats.isDemoMode) {
    console.log('✅ Demo mode active - users can test with demo API');
    showGeminiStatus(`✅ Demo mode active (${stats.remainingDemoUsage} free tests remaining)`, 'info');
    
    // Show demo usage info
    if (stats.demoUsageCount > 0) {
      showDemoUsageInfo(stats);
    }
  } else {
    console.log('✅ User API key found - using user configuration');
    showGeminiStatus('✅ Using your personal Gemini AI API key', 'success');
  }
  
  // Initialize Gemini AI with current key
  const currentKey = manager.getCurrentAPIKey();
  if (currentKey) {
    window.initializeGeminiAI(currentKey).then(success => {
      if (success) {
        console.log('✅ Gemini AI initialized successfully');
        showGeminiStatus('✅ Gemini AI is ready for analysis!', 'success');
      } else {
        console.log('❌ Gemini AI initialization failed');
        showGeminiStatus('❌ Gemini AI initialization failed', 'error');
      }
    });
  }
});

// Function to show Gemini AI status to user
function showGeminiStatus(message, type = 'info') {
  // Create or update status element
  let statusElement = document.getElementById('gemini-status');
  if (!statusElement) {
    statusElement = document.createElement('div');
    statusElement.id = 'gemini-status';
    statusElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px 15px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10000;
      max-width: 300px;
      word-wrap: break-word;
    `;
    document.body.appendChild(statusElement);
  }
  
  statusElement.textContent = message;
  
  // Auto-hide after 8 seconds
  setTimeout(() => {
    if (statusElement.parentNode) {
      statusElement.parentNode.removeChild(statusElement);
    }
  }, 8000);
}

// Function to show demo usage information
function showDemoUsageInfo(stats) {
  const message = `Demo Mode: ${stats.demoUsageCount}/${stats.maxDemoUsage} tests used. ${stats.remainingDemoUsage} remaining.`;
  showGeminiStatus(message, 'warning');
}

// Function to show API key setup modal
function showAPIKeySetupModal() {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10001;
  `;
  
  modal.innerHTML = `
    <div style="
      background: white;
      padding: 30px;
      border-radius: 15px;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      color: #333;
    ">
      <h2 style="margin-bottom: 20px; color: #4285f4;">🔑 Set Up Your Gemini AI API Key</h2>
      
      <div style="margin-bottom: 20px;">
        <h3>📋 How to Get Your Free API Key:</h3>
        <ol style="margin-left: 20px; line-height: 1.6;">
          <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" style="color: #4285f4;">Google AI Studio</a></li>
          <li>Sign in with your Google account</li>
          <li>Click "Create API Key"</li>
          <li>Copy the generated key</li>
          <li>Paste it below</li>
        </ol>
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Your Gemini AI API Key:</label>
        <input type="text" id="userAPIKey" placeholder="AIzaSy..." style="
          width: 100%;
          padding: 10px;
          border: 2px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
        ">
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3>💰 Cost Information:</h3>
        <ul style="margin-left: 20px; line-height: 1.6;">
          <li><strong>Free Tier:</strong> 15 requests per minute</li>
          <li><strong>Paid Tier:</strong> $0.0005 per 1K characters</li>
          <li><strong>Demo Mode:</strong> Limited to 10 free tests</li>
        </ul>
      </div>
      
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button onclick="saveUserAPIKey()" style="
          background: #4285f4;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 600;
        ">Save API Key</button>
        <button onclick="closeAPIKeyModal()" style="
          background: #666;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        ">Cancel</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// Function to save user API key
function saveUserAPIKey() {
  const apiKey = document.getElementById('userAPIKey').value.trim();
  
  if (!apiKey) {
    alert('Please enter your Gemini AI API key');
    return;
  }
  
  if (!apiKey.startsWith('AIza')) {
    alert('Please enter a valid Gemini AI API key (should start with "AIza")');
    return;
  }
  
  // Save the API key
  window.geminiAPIKeyManager.setUserAPIKey(apiKey);
  
  // Reinitialize Gemini AI with new key
  window.initializeGeminiAI(apiKey).then(success => {
    if (success) {
      showGeminiStatus('✅ Your API key saved successfully!', 'success');
      closeAPIKeyModal();
    } else {
      alert('❌ Invalid API key. Please check your key and try again.');
    }
  });
}

// Function to close API key modal
function closeAPIKeyModal() {
  const modal = document.querySelector('div[style*="z-index: 10001"]');
  if (modal) {
    modal.remove();
  }
}

// Function to show API key management
function showAPIKeyManagement() {
  const manager = window.geminiAPIKeyManager;
  const stats = manager.getUsageStats();
  
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10001;
  `;
  
  modal.innerHTML = `
    <div style="
      background: white;
      padding: 30px;
      border-radius: 15px;
      max-width: 500px;
      width: 90%;
      color: #333;
    ">
      <h2 style="margin-bottom: 20px; color: #4285f4;">🔧 API Key Management</h2>
      
      <div style="margin-bottom: 20px;">
        <h3>📊 Current Status:</h3>
        <p><strong>Mode:</strong> ${stats.isDemoMode ? 'Demo Mode' : 'Personal API Key'}</p>
        <p><strong>Demo Usage:</strong> ${stats.demoUsageCount}/${stats.maxDemoUsage} tests used</p>
        <p><strong>Remaining Demo Tests:</strong> ${stats.remainingDemoUsage}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3>🔑 API Key Actions:</h3>
        ${stats.isDemoMode ? 
          '<button onclick="showAPIKeySetupModal()" style="background: #4285f4; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px;">Add Your API Key</button>' :
          '<button onclick="removeUserAPIKey()" style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Remove API Key</button>'
        }
        <button onclick="closeAPIKeyModal()" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Close</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// Function to remove user API key
function removeUserAPIKey() {
  if (confirm('Are you sure you want to remove your API key and return to demo mode?')) {
    window.geminiAPIKeyManager.removeUserAPIKey();
    showGeminiStatus('✅ Switched back to demo mode', 'info');
    closeAPIKeyModal();
  }
}

// Enhanced Gemini AI initialization with usage tracking
window.initializeGeminiAI = function(apiKey) {
  const manager = window.geminiAPIKeyManager;
  
  // Check demo usage limit
  if (manager.isUsingDemo() && !manager.canUseDemo()) {
    showGeminiStatus('❌ Demo limit reached. Please add your own API key.', 'error');
    return Promise.resolve(false);
  }
  
  return window.geminiAnalyzer.initialize(apiKey).then(success => {
    if (success && manager.isUsingDemo()) {
      manager.incrementDemoUsage();
      const stats = manager.getUsageStats();
      showGeminiStatus(`Demo mode: ${stats.demoUsageCount}/${stats.maxDemoUsage} tests used`, 'warning');
    }
    return success;
  });
};

// Export functions for global access
window.showAPIKeySetupModal = showAPIKeySetupModal;
window.showAPIKeyManagement = showAPIKeyManagement;
window.saveUserAPIKey = saveUserAPIKey;
window.closeAPIKeyModal = closeAPIKeyModal;
window.removeUserAPIKey = removeUserAPIKey;

// Instructions for users
console.log(`
🤖 Gemini AI Demo System Setup:

✅ Demo Mode: Users can test with your API key (limited to 10 requests)
✅ User API Keys: Users can add their own API keys for unlimited usage
✅ Usage Tracking: Demo usage is tracked and limited
✅ Easy Setup: Modal guides users to get their own API key

💰 Monetization Options:
1. Free demo with limited usage
2. Guide users to get their own free API key
3. Premium features with your API key
4. Usage-based pricing

📚 Learn more: https://ai.google.dev/
`); 