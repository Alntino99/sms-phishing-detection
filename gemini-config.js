// Gemini AI Configuration
// To use Gemini AI analysis, follow these steps:

// 1. Get a free API key from Google AI Studio:
//    - Go to: https://makersuite.google.com/app/apikey
//    - Sign in with your Google account
//    - Click "Create API Key"
//    - Copy the generated API key

// 2. Replace the placeholder below with your actual API key:
const GEMINI_API_KEY = 'AIzaSyBioNiN-EnZCv1dYqSV83QDxV8RVK21Omg';

// 3. Initialize Gemini AI when the page loads (only if no user API key is set)
document.addEventListener('DOMContentLoaded', function() {
  // Check if user has set their own API key via the API manager
  const userAPIKey = localStorage.getItem('user_gemini_api_key');
  
  if (userAPIKey) {
    console.log('✅ User Gemini API key found - using user configuration');
    // User's API key will be handled by the API manager
  } else if (GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
    // Fallback to hardcoded API key for demo purposes
    window.initializeGeminiAI(GEMINI_API_KEY).then(success => {
      if (success) {
        console.log('✅ Gemini AI initialized successfully (demo mode)');
        showGeminiStatus('✅ Gemini AI is ready for analysis! (demo mode)');
      } else {
        console.log('❌ Gemini AI initialization failed');
        showGeminiStatus('❌ Gemini AI initialization failed. Check your API key.');
      }
    });
  } else {
    console.log('⚠️ Gemini AI API key not configured');
    showGeminiStatus('⚠️ Click "AI Settings" button to add your Gemini AI API key');
  }
});

// Function to show Gemini AI status to user
function showGeminiStatus(message) {
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
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (statusElement.parentNode) {
      statusElement.parentNode.removeChild(statusElement);
    }
  }, 5000);
}

// Function to manually initialize Gemini AI (for testing)
window.initializeGeminiManually = function(apiKey) {
  if (!apiKey) {
    alert('Please provide a valid Gemini AI API key');
    return;
  }
  
  window.initializeGeminiAI(apiKey).then(success => {
    if (success) {
      alert('✅ Gemini AI initialized successfully! You can now use the "Gemini AI Analysis" mode.');
      showGeminiStatus('✅ Gemini AI is ready for analysis!');
    } else {
      alert('❌ Gemini AI initialization failed. Please check your API key.');
      showGeminiStatus('❌ Gemini AI initialization failed');
    }
  });
};

// Instructions for users
console.log(`
🤖 Gemini AI Setup Instructions:

1. Get a FREE API key from Google AI Studio:
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated key

2. Configure the API key:
   - Open gemini-config.js
   - Replace 'YOUR_GEMINI_API_KEY_HERE' with your actual API key
   - Save the file and reload the page

3. Alternative: Use the browser console:
   - Press F12 to open developer tools
   - Go to Console tab
   - Type: initializeGeminiManually('YOUR_API_KEY_HERE')
   - Press Enter

4. Features available with Gemini AI:
   - Advanced threat detection
   - Detailed reasoning and explanations
   - Psychological tactic analysis
   - Educational content
   - Multi-language support

💰 Cost: FREE tier includes 15 requests per minute
📚 Learn more: https://ai.google.dev/
`); 