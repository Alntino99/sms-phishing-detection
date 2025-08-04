# SMS Phishing Detection Web App

A modern, AI-powered web application for detecting SMS phishing attempts using Machine Learning and AI analysis.

## 🚀 Features

- **Advanced SMS Analysis**: Multi-layered detection using Naive Bayes, LSTM, and AI models
- **AI Integration**: Google Gemini AI and DeepSeek AI for contextual analysis
- **User Authentication**: Firebase Authentication with email/phone support
- **Real-time Database**: Firebase Realtime Database for data persistence
- **Modern UI**: Glass morphism design with dark mode support
- **Mobile Responsive**: Optimized for all devices
- **Notification System**: Real-time notifications for users
- **SMS Integration**: Share alerts via SMS and integrate with phone SMS apps
- **Chatbot**: AI-powered assistant for user guidance
- **Dashboard Analytics**: Visual charts and analysis history
- **Bulk Analysis**: CSV upload for multiple SMS analysis

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Authentication, Realtime Database, Hosting)
- **AI/ML**: Google Gemini AI, DeepSeek AI, Custom ML Models
- **Styling**: Modern CSS with Glass Morphism, Gradients
- **Charts**: Chart.js for analytics visualization
- **Icons**: Font Awesome

## 📦 Installation & Setup

### Prerequisites
- Modern web browser
- Firebase project (for backend services)
- Optional: API keys for Gemini AI and DeepSeek AI

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd sms-phishing-detection
```

2. **Set up Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication and Realtime Database
   - Update `firebase.js` with your Firebase config

3. **Configure AI APIs (Optional)**
   - Get API keys from [Google AI Studio](https://makersuite.google.com/app/apikey) and [DeepSeek](https://platform.deepseek.com/)
   - Users can add their own API keys via the web interface

4. **Run locally**
   - Open `index.html` in your browser
   - Or use a local server: `python -m http.server 8000`

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Click "Deploy"

3. **Configure Environment Variables** (if needed)
   - Add Firebase config in Vercel dashboard
   - Set up custom domain (optional)

For detailed deployment instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

### Alternative Deployment Options

- **Firebase Hosting**: Use `firebase deploy`
- **Netlify**: Drag and drop deployment
- **GitHub Pages**: Static hosting

## 📁 Project Structure

```
├── index.html              # Main homepage
├── detect.html             # SMS analysis interface
├── login.html              # User authentication
├── signup.html             # User registration
├── dashboard.html          # Analytics dashboard
├── profile.html            # User profile
├── contact.html            # Contact form
├── about.html              # About page
├── create.html             # Post creation
├── sms.html                # SMS alerts
├── script.js               # Core analysis logic
├── firebase.js             # Firebase configuration
├── chatbot.js              # AI chatbot
├── gemini-ai.js           # Gemini AI integration
├── deepseek-ai.js         # DeepSeek AI integration
├── api-manager.js          # API key management
├── darkMode.js             # Dark mode functionality
├── style.css               # Global styles
├── chatbot.css             # Chatbot styles
├── vercel.json             # Vercel configuration
└── README.md               # This file
```

## 🔧 Configuration

### Firebase Setup
1. Create Firebase project
2. Enable Authentication (Email/Password, Phone)
3. Enable Realtime Database
4. Update security rules
5. Add Firebase config to `firebase.js`

### AI API Configuration
- Users can add their own API keys via the web interface
- Default keys can be configured in respective config files
- API usage is tracked and managed per user

## 🎯 Key Features Explained

### SMS Analysis
- **Naive Bayes**: Statistical classification
- **LSTM Neural Network**: Sequence analysis
- **Hybrid Analysis**: Combined ML approach
- **AI Analysis**: Contextual understanding with Gemini/DeepSeek

### User Experience
- **Glass Morphism**: Modern UI design
- **Dark Mode**: Toggle between light/dark themes
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Live notifications and data sync

### Security
- **Firebase Security Rules**: Database protection
- **HTTPS**: Automatic SSL certificates
- **Input Validation**: Client and server-side validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the code comments and setup guides
- **Issues**: Report bugs via GitHub Issues
- **Firebase**: [Firebase Documentation](https://firebase.google.com/docs)
- **Vercel**: [Vercel Documentation](https://vercel.com/docs)

---

**Built with ❤️ for SMS security awareness** 