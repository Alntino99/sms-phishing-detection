// DeepSeek AI Configuration
// To use DeepSeek AI analysis, follow these steps:

// 1. Get a free API key from DeepSeek Platform:
//    - Go to: https://platform.deepseek.com/
//    - Sign in with your account
//    - Go to API Keys section
//    - Click "Create API Key"
//    - Copy the generated API key

// 2. Replace the placeholder below with your actual API key:
const DEEPSEEK_API_KEY = 'sk-c741262ad696414e8e6bcf768590f74b';

// 3. Initialize DeepSeek AI when the page loads (only if no user API key is set)
document.addEventListener('DOMContentLoaded', function() {
  // Check if user has set their own API key via the API manager
  const userAPIKey = localStorage.getItem('user_deepseek_api_key');
  
  if (userAPIKey) {
    console.log('✅ User DeepSeek API key found - using user configuration');
    // User's API key will be handled by the API manager
  } else if (DEEPSEEK_API_KEY && DEEPSEEK_API_KEY !== 'YOUR_DEEPSEEK_API_KEY_HERE') {
    // Fallback to hardcoded API key for demo purposes
    window.initializeDeepSeekAI(DEEPSEEK_API_KEY).then(success => {
      if (success) {
        console.log('✅ DeepSeek AI initialized successfully (demo mode)');
        showDeepSeekStatus('✅ DeepSeek AI is ready for analysis! (demo mode)');
      } else {
        console.log('❌ DeepSeek AI initialization failed');
        showDeepSeekStatus('❌ DeepSeek AI initialization failed. Check your API key.');
      }
    });
  } else {
    console.log('⚠️ DeepSeek AI API key not configured');
    showDeepSeekStatus('⚠️ Click "AI Settings" button to add your DeepSeek AI API key');
  }
});

// Function to show DeepSeek AI status to user
function showDeepSeekStatus(message) {
  // Create or update status element
  let statusElement = document.getElementById('deepseek-status');
  if (!statusElement) {
    statusElement = document.createElement('div');
    statusElement.id = 'deepseek-status';
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
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (statusElement.parentNode) {
      statusElement.parentNode.removeChild(statusElement);
    }
  }, 5000);
}

// Function to manually initialize DeepSeek AI (for testing)
window.initializeDeepSeekManually = function(apiKey) {
  if (!apiKey) {
    alert('Please provide a valid DeepSeek AI API key');
    return;
  }
  
  window.initializeDeepSeekAI(apiKey).then(success => {
    if (success) {
      alert('✅ DeepSeek AI initialized successfully! You can now use the "DeepSeek AI Analysis" mode.');
      showDeepSeekStatus('✅ DeepSeek AI is ready for analysis!');
    } else {
      alert('❌ DeepSeek AI initialization failed. Please check your API key.');
      showDeepSeekStatus('❌ DeepSeek AI initialization failed');
    }
  });
};

// Instructions for users
console.log(`
🤖 DeepSeek AI Setup Instructions:

1. Get a FREE API key from DeepSeek Platform:
   - Visit: https://platform.deepseek.com/
   - Sign in with your account
   - Go to API Keys section
   - Click "Create API Key"
   - Copy the generated key

2. Configure the API key:
   - Open deepseek-config.js
   - Replace 'YOUR_DEEPSEEK_API_KEY_HERE' with your actual API key
   - Save the file and reload the page

3. Alternative: Use the browser console:
   - Press F12 to open developer tools
   - Go to Console tab
   - Type: initializeDeepSeekManually('YOUR_API_KEY_HERE')
   - Press Enter

4. Features available with DeepSeek AI:
   - Advanced threat detection
   - Detailed reasoning and explanations
   - Psychological tactic analysis
   - Educational content
   - Multi-language support
   - Strong reasoning capabilities

💰 Cost: FREE tier includes 1,000,000 tokens per month
📚 Learn more: https://platform.deepseek.com/
`); 