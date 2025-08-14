# SMS Shield - Expo Go Setup Guide

## 🚀 Quick Start with Expo Go

This guide will help you run the SMS Shield app using Expo Go for testing purposes.

## 📱 What Works in Expo Go

✅ **UI Components**: All screens and navigation  
✅ **Mock Data**: Simulated SMS and email messages  
✅ **Analysis Engine**: Spam/phishing detection algorithms  
✅ **Real-time Simulation**: Mock incoming messages  
✅ **Permission Requests**: Simulated permission dialogs  

## ❌ What Doesn't Work in Expo Go

❌ **Real SMS Reading**: Cannot access actual SMS messages  
❌ **Real Gmail Integration**: Cannot connect to actual Gmail  
❌ **Background Services**: Cannot run background monitoring  
❌ **Native Permissions**: Cannot request real SMS permissions  

## 🛠️ Setup Instructions

### 1. Install Expo Go
Download and install Expo Go on your mobile device:
- **Android**: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm start
# or
expo start
```

### 4. Connect with Expo Go
- **Option A**: Scan the QR code with Expo Go app
- **Option B**: Press 'a' for Android or 'i' for iOS in the terminal

## 🧪 Testing Features

### SMS Protection Testing
1. **Navigate to Scan Screen**
2. **Tap "Grant SMS Permissions"** - Simulates permission request
3. **Toggle "Real-time SMS Monitoring"** - Starts mock monitoring
4. **Tap "Scan Existing Messages"** - Shows mock SMS data
5. **Wait 10 seconds** - Simulated incoming messages will appear

### Gmail Protection Testing
1. **Tap "Connect Gmail Account"** - Simulates Gmail authentication
2. **Toggle "Real-time Email Monitoring"** - Starts mock email monitoring
3. **Wait 15 seconds** - Simulated incoming emails will appear

### Mock Data Examples
The app includes realistic mock data:
- **Spam SMS**: "Congratulations! You have won $50,000..."
- **Phishing SMS**: "Your Bank of Ghana account has been suspended..."
- **Legitimate SMS**: "Your MTN mobile money transaction was successful..."
- **Spam Email**: "CONGRATULATIONS! You have won $1,000,000!"
- **Phishing Email**: "URGENT: Your account has been compromised..."

## 🔍 Understanding Results

### Threat Categories
- **🚨 Spam**: High-confidence spam detection
- **⚠️ Phishing**: Suspicious phishing attempts  
- **⚠️ Suspicious**: Medium-confidence suspicious content
- **✅ Legitimate**: Safe messages

### Confidence Scores
- **0.7+**: High confidence threat
- **0.4-0.7**: Medium confidence (suspicious)
- **0.0-0.4**: Low confidence (legitimate)

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

## 🔧 Troubleshooting

### Common Issues

**"Expo Go not connecting"**
- Ensure phone and computer are on same WiFi
- Try using tunnel: `expo start --tunnel`

**"App not loading"**
- Clear Expo Go cache
- Restart Expo Go app
- Check internet connection

**"Mock data not appearing"**
- Wait 10-15 seconds for simulated messages
- Check console logs for errors
- Restart the development server

### Debug Mode
Enable debug logging:
```bash
expo start --dev-client
```

## 📊 Performance Notes

- **Mock Data**: Instant loading
- **Analysis**: < 100ms per message
- **UI Updates**: Real-time
- **Memory Usage**: Minimal

## 🔄 Next Steps

After testing with Expo Go, you can:

1. **Create Development Build**: For real SMS/Gmail functionality
2. **Deploy to Production**: For actual use
3. **Customize Mock Data**: Add more realistic scenarios
4. **Enhance UI**: Improve user experience

## 📞 Support

For issues with Expo Go testing:
- Check Expo documentation
- Review console logs
- Test on different devices
- Verify network connectivity

---

**Note**: This Expo Go version is for testing and demonstration purposes only. For full functionality with real SMS and Gmail monitoring, use a development build or production deployment.
