# SMS Shield App - Complete Setup Guide

## 🚀 Quick Start with Expo Go

This guide will help you get your SMS Shield app running perfectly with Expo Go.

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **Expo CLI** (install globally: `npm install -g @expo/cli`)
4. **Expo Go App** on your mobile device

## 🛠️ Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm start
# or
expo start
```

### 3. Connect with Expo Go
- **Option A**: Scan the QR code with Expo Go app
- **Option B**: Press 'a' for Android or 'i' for iOS in the terminal

## 📱 What Works in Expo Go

✅ **Complete UI**: All screens and navigation  
✅ **Mock SMS Data**: Realistic Ghanaian SMS messages  
✅ **Spam Detection**: AI-powered analysis algorithms  
✅ **Real-time Simulation**: Mock incoming messages  
✅ **Analytics Dashboard**: Performance tracking  
✅ **Permission Simulation**: Mock permission dialogs  
✅ **Gmail Integration**: Mock email scanning  

## 🎯 Testing Features

### 1. Home Screen
- View protection statistics
- See recent activity
- Navigate to other screens

### 2. Scan Screen
- **Grant SMS Permissions**: Simulates permission request
- **Toggle Real-time Monitoring**: Starts mock monitoring
- **Scan Existing Messages**: Shows mock SMS data
- **Connect Gmail**: Simulates Gmail authentication

### 3. Dashboard Screen
- View detailed analytics
- See spam detection trends
- Check protection rates

### 4. Profile Screen
- User settings and preferences
- App configuration

## 🔧 Troubleshooting

### Common Issues & Solutions

**1. "Metro bundler not starting"**
```bash
# Clear cache and restart
npx expo start --clear
```

**2. "Expo Go not connecting"**
- Ensure phone and computer are on same WiFi
- Try using tunnel: `expo start --tunnel`
- Check firewall settings

**3. "App not loading"**
```bash
# Clear Expo Go cache on your device
# Restart Expo Go app
# Check internet connection
```

**4. "Package version warnings"**
```bash
# Update packages to compatible versions
npm install
```

**5. "TypeScript errors"**
```bash
# Install missing types
npm install --save-dev @types/react @types/react-native
```

### Debug Mode
Enable debug logging:
```bash
expo start --dev-client
```

## 📊 Mock Data Features

### SMS Messages
The app includes realistic Ghanaian SMS data:
- **MTN Mobile Money**: Transaction confirmations
- **Vodafone**: Data bundle notifications
- **Bank of Ghana**: Official communications
- **Spam Messages**: Lottery scams, phishing attempts
- **Legitimate Messages**: Utility bills, delivery notifications

### Email Messages
Mock Gmail data includes:
- **Phishing Emails**: Bank security alerts, account suspensions
- **Spam Emails**: Lottery wins, free offers
- **Legitimate Emails**: Order confirmations, newsletters

## 🎨 UI Features

### Modern Design
- **Glass Morphism**: Blur effects and transparency
- **Gradient Backgrounds**: Beautiful color transitions
- **Material Design**: Google's design system
- **Dark/Light Theme**: Automatic theme switching

### Interactive Elements
- **Smooth Animations**: React Native Reanimated
- **Haptic Feedback**: Touch responses
- **Gesture Support**: Swipe and tap gestures
- **Loading States**: Activity indicators

## 🔍 Spam Detection Algorithm

### Detection Patterns
1. **Spam Keywords**: "urgent", "congratulations", "free money"
2. **Phishing Indicators**: Suspicious URLs, bank references
3. **Urgency Markers**: "act now", "limited time"
4. **Financial Terms**: Mobile money, bank transfers
5. **Suspicious Domains**: Shortened URLs, fake domains

### Confidence Scoring
- **0.8+**: High confidence spam
- **0.5-0.8**: Medium confidence (suspicious)
- **0.0-0.5**: Low confidence (legitimate)

## 📈 Analytics Features

### Protection Metrics
- **Total Messages**: Scanned message count
- **Spam Detected**: Blocked spam messages
- **Protection Rate**: Percentage of spam caught
- **Money Saved**: Estimated financial protection

### Performance Tracking
- **Real-time Updates**: Live statistics
- **Historical Data**: Trend analysis
- **Category Breakdown**: Spam vs phishing vs legitimate

## 🔄 Real-time Monitoring

### SMS Monitoring
- **Background Scanning**: Continuous message analysis
- **Instant Alerts**: Spam detection notifications
- **Auto-blocking**: Automatic spam prevention
- **Manual Review**: User override options

### Email Monitoring
- **Gmail Integration**: Email scanning
- **Spam Detection**: Email threat analysis
- **Category Classification**: Spam, phishing, legitimate

## 🎯 Testing Scenarios

### Scenario 1: Permission Flow
1. Open app → Scan screen
2. Tap "Grant SMS Permissions"
3. Observe permission simulation
4. Toggle monitoring switches

### Scenario 2: Real-time Monitoring
1. Enable SMS monitoring
2. Wait for simulated messages (every 10 seconds)
3. Observe threat detection in action
4. Check notification alerts

### Scenario 3: Message Analysis
1. Tap "Scan Existing Messages"
2. Review different message types
3. Observe confidence scores
4. Check categorization accuracy

### Scenario 4: Gmail Integration
1. Tap "Connect Gmail Account"
2. Toggle "Real-time Email Monitoring"
3. Wait for simulated emails
4. Review email analysis results

## 📱 Performance Notes

- **Mock Data**: Instant loading
- **Analysis**: < 100ms per message
- **UI Updates**: Real-time
- **Memory Usage**: Minimal
- **Battery Impact**: Low

## 🔄 Next Steps

After testing with Expo Go, you can:

1. **Create Development Build**: For real SMS/Gmail functionality
2. **Deploy to Production**: For actual use
3. **Customize Mock Data**: Add more realistic scenarios
4. **Enhance UI**: Improve user experience
5. **Add Real ML Models**: Integrate TensorFlow models

## 📞 Support

For issues with Expo Go testing:
- Check Expo documentation: https://docs.expo.dev/
- Review console logs in terminal
- Test on different devices
- Verify network connectivity
- Check Expo Go app version

## 🎉 Success Indicators

Your app is working correctly when you see:
- ✅ Expo Go connects successfully
- ✅ App loads without errors
- ✅ Navigation works smoothly
- ✅ Mock data appears
- ✅ Spam detection functions
- ✅ Analytics display correctly
- ✅ Real-time monitoring simulates

---

**Note**: This Expo Go version is for testing and demonstration purposes. For full functionality with real SMS and Gmail monitoring, use a development build or production deployment.
