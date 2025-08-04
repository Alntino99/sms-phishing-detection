// API Manager for User-Defined API Keys
// Allows users to input their own API keys for AI analysis

class APIManager {
  constructor() {
    this.geminiAPIKey = null;
    this.deepseekAPIKey = null;
    this.isInitialized = false;
  }

  // Initialize the API manager
  initialize() {
    this.isInitialized = true;
    this.loadSavedAPIKeys();
    this.createAPIInputUI();
    console.log('API Manager initialized');
  }

  // Load saved API keys from localStorage
  loadSavedAPIKeys() {
    try {
      this.geminiAPIKey = localStorage.getItem('user_gemini_api_key');
      this.deepseekAPIKey = localStorage.getItem('user_deepseek_api_key');
      
      if (this.geminiAPIKey) {
        console.log('Loaded saved Gemini API key');
        this.initializeGeminiAI(this.geminiAPIKey);
      }
      
      if (this.deepseekAPIKey) {
        console.log('Loaded saved DeepSeek API key');
        this.initializeDeepSeekAI(this.deepseekAPIKey);
      }
    } catch (error) {
      console.warn('Error loading saved API keys:', error);
    }
  }

  // Save API key to localStorage
  saveAPIKey(service, apiKey) {
    try {
      localStorage.setItem(`user_${service}_api_key`, apiKey);
      console.log(`Saved ${service} API key`);
      return true;
    } catch (error) {
      console.error('Error saving API key:', error);
      return false;
    }
  }

  // Initialize Gemini AI with user's API key
  async initializeGeminiAI(apiKey) {
    if (window.initializeGeminiAI) {
      const success = await window.initializeGeminiAI(apiKey);
      if (success) {
        this.geminiAPIKey = apiKey;
        this.saveAPIKey('gemini', apiKey);
        this.showStatus('gemini', 'success', 'Gemini AI initialized successfully!');
      } else {
        this.showStatus('gemini', 'error', 'Failed to initialize Gemini AI. Please check your API key.');
      }
      return success;
    }
    return false;
  }

  // Initialize DeepSeek AI with user's API key
  async initializeDeepSeekAI(apiKey) {
    if (window.initializeDeepSeekAI) {
      const success = await window.initializeDeepSeekAI(apiKey);
      if (success) {
        this.deepseekAPIKey = apiKey;
        this.saveAPIKey('deepseek', apiKey);
        this.showStatus('deepseek', 'success', 'DeepSeek AI initialized successfully!');
      } else {
        this.showStatus('deepseek', 'error', 'Failed to initialize DeepSeek AI. Please check your API key.');
      }
      return success;
    }
    return false;
  }

  // Create the API input UI
  createAPIInputUI() {
    // Create floating API settings button
    const apiButton = document.createElement('button');
    apiButton.id = 'api-settings-btn';
    apiButton.innerHTML = '<i class="fas fa-key"></i> AI Settings';
    apiButton.className = 'api-settings-btn';
    apiButton.onclick = () => this.showAPIModal();
    document.body.appendChild(apiButton);

    // Add CSS for the button
    const style = document.createElement('style');
    style.textContent = `
      .api-settings-btn {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transition: all 0.3s ease;
      }
      
      .api-settings-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
      }
      
      .api-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 10001;
      }
      
      .api-modal-content {
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      }
      
      .api-modal h2 {
        color: #333;
        margin-bottom: 20px;
        text-align: center;
      }
      
      .api-service {
        margin-bottom: 25px;
        padding: 20px;
        border: 2px solid #f0f0f0;
        border-radius: 10px;
        background: #fafafa;
      }
      
      .api-service h3 {
        margin: 0 0 15px 0;
        color: #555;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .api-input-group {
        margin-bottom: 15px;
      }
      
      .api-input-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 600;
        color: #333;
      }
      
      .api-input-group input {
        width: 100%;
        padding: 10px;
        border: 2px solid #ddd;
        border-radius: 5px;
        font-size: 14px;
        box-sizing: border-box;
      }
      
      .api-input-group input:focus {
        border-color: #667eea;
        outline: none;
      }
      
      .api-status {
        padding: 10px;
        border-radius: 5px;
        margin-top: 10px;
        font-size: 14px;
      }
      
      .api-status.success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
      }
      
      .api-status.error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
      }
      
      .api-status.warning {
        background: #fff3cd;
        color: #856404;
        border: 1px solid #ffeaa7;
      }
      
      .api-links {
        margin-top: 15px;
        font-size: 13px;
      }
      
      .api-links a {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
      }
      
      .api-links a:hover {
        text-decoration: underline;
      }
      
      .api-actions {
        display: flex;
        gap: 10px;
        margin-top: 15px;
      }
      
      .api-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.3s ease;
      }
      
      .api-btn.primary {
        background: #667eea;
        color: white;
      }
      
      .api-btn.primary:hover {
        background: #5a6fd8;
      }
      
      .api-btn.secondary {
        background: #6c757d;
        color: white;
      }
      
      .api-btn.secondary:hover {
        background: #5a6268;
      }
      
      .api-btn.danger {
        background: #dc3545;
        color: white;
      }
      
      .api-btn.danger:hover {
        background: #c82333;
      }
      
      .modal-close {
        position: absolute;
        top: 15px;
        right: 20px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
      }
      
      .modal-close:hover {
        color: #333;
      }
    `;
    document.head.appendChild(style);
  }

  // Show the API configuration modal
  showAPIModal() {
    const modal = document.createElement('div');
    modal.className = 'api-modal';
    modal.id = 'api-modal';
    
    modal.innerHTML = `
      <div class="api-modal-content">
        <button class="modal-close" onclick="document.getElementById('api-modal').remove()">&times;</button>
        <h2><i class="fas fa-key"></i> AI API Configuration</h2>
        
        <div class="api-service">
          <h3><i class="fas fa-robot" style="color: #4285f4;"></i> Gemini AI (Google)</h3>
          <div class="api-input-group">
            <label for="gemini-api-key">API Key:</label>
            <input type="password" id="gemini-api-key" placeholder="Enter your Gemini API key" value="${this.geminiAPIKey || ''}">
          </div>
          <div class="api-status" id="gemini-status" style="display: none;"></div>
          <div class="api-links">
            <strong>Get Free API Key:</strong><br>
            <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a> → Sign in → Create API Key
          </div>
          <div class="api-actions">
            <button class="api-btn primary" onclick="window.apiManager.testGeminiAPI()">Test & Save</button>
            <button class="api-btn danger" onclick="window.apiManager.clearGeminiAPI()">Clear</button>
          </div>
        </div>
        
        <div class="api-service">
          <h3><i class="fas fa-brain" style="color: #00d4aa;"></i> DeepSeek AI</h3>
          <div class="api-input-group">
            <label for="deepseek-api-key">API Key:</label>
            <input type="password" id="deepseek-api-key" placeholder="Enter your DeepSeek API key" value="${this.deepseekAPIKey || ''}">
          </div>
          <div class="api-status" id="deepseek-status" style="display: none;"></div>
          <div class="api-links">
            <strong>Get Free API Key:</strong><br>
            <a href="https://platform.deepseek.com/" target="_blank">DeepSeek Platform</a> → Sign in → API Keys → Create API Key
          </div>
          <div class="api-actions">
            <button class="api-btn primary" onclick="window.apiManager.testDeepSeekAPI()">Test & Save</button>
            <button class="api-btn danger" onclick="window.apiManager.clearDeepSeekAPI()">Clear</button>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <button class="api-btn secondary" onclick="document.getElementById('api-modal').remove()">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
  }

  // Test and save Gemini API key
  async testGeminiAPI() {
    const apiKey = document.getElementById('gemini-api-key').value.trim();
    const statusElement = document.getElementById('gemini-status');
    
    if (!apiKey) {
      this.showStatus('gemini', 'warning', 'Please enter an API key');
      return;
    }
    
    this.showStatus('gemini', 'warning', 'Testing API key...');
    
    try {
      const success = await this.initializeGeminiAI(apiKey);
      if (success) {
        this.showStatus('gemini', 'success', '✅ Gemini AI is ready for analysis!');
      } else {
        this.showStatus('gemini', 'error', '❌ Invalid API key or service unavailable');
      }
    } catch (error) {
      this.showStatus('gemini', 'error', `❌ Error: ${error.message}`);
    }
  }

  // Test and save DeepSeek API key
  async testDeepSeekAPI() {
    const apiKey = document.getElementById('deepseek-api-key').value.trim();
    const statusElement = document.getElementById('deepseek-status');
    
    if (!apiKey) {
      this.showStatus('deepseek', 'warning', 'Please enter an API key');
      return;
    }
    
    this.showStatus('deepseek', 'warning', 'Testing API key...');
    
    try {
      const success = await this.initializeDeepSeekAI(apiKey);
      if (success) {
        this.showStatus('deepseek', 'success', '✅ DeepSeek AI is ready for analysis!');
      } else {
        this.showStatus('deepseek', 'error', '❌ Invalid API key or service unavailable');
      }
    } catch (error) {
      this.showStatus('deepseek', 'error', `❌ Error: ${error.message}`);
    }
  }

  // Clear Gemini API key
  clearGeminiAPI() {
    this.geminiAPIKey = null;
    localStorage.removeItem('user_gemini_api_key');
    document.getElementById('gemini-api-key').value = '';
    this.showStatus('gemini', 'warning', 'Gemini API key cleared');
  }

  // Clear DeepSeek API key
  clearDeepSeekAPI() {
    this.deepseekAPIKey = null;
    localStorage.removeItem('user_deepseek_api_key');
    document.getElementById('deepseek-api-key').value = '';
    this.showStatus('deepseek', 'warning', 'DeepSeek API key cleared');
  }

  // Show status message
  showStatus(service, type, message) {
    const statusElement = document.getElementById(`${service}-status`);
    if (statusElement) {
      statusElement.className = `api-status ${type}`;
      statusElement.textContent = message;
      statusElement.style.display = 'block';
      
      // Auto-hide success messages after 3 seconds
      if (type === 'success') {
        setTimeout(() => {
          statusElement.style.display = 'none';
        }, 3000);
      }
    }
  }

  // Get API key status
  getAPIStatus() {
    return {
      gemini: {
        configured: !!this.geminiAPIKey,
        available: window.geminiAnalyzer ? window.geminiAnalyzer.isAvailable() : false
      },
      deepseek: {
        configured: !!this.deepseekAPIKey,
        available: window.deepseekAnalyzer ? window.deepseekAnalyzer.isAvailable() : false
      }
    };
  }
}

// Initialize global API manager
window.apiManager = new APIManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.apiManager.initialize();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APIManager;
} 