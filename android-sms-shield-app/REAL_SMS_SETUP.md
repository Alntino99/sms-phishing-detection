# SMS Shield - Real SMS Data Access Setup Guide

## 🚀 Development Build Setup for Real SMS Access

This guide will help you set up your SMS Shield app to access real SMS data using a development build.

## 📱 What You Can Access with Development Build

✅ **Real SMS Messages**: Access actual SMS from device  
✅ **Real-time Monitoring**: Live SMS interception and analysis  
✅ **Native Permissions**: Request real SMS permissions  
✅ **Background Services**: Continuous monitoring  
✅ **Real Analytics**: Based on actual SMS data  
✅ **Spam Detection**: Real-time analysis of incoming messages  

## 🛠️ Prerequisites

1. **Expo CLI**: `npm install -g @expo/cli`
2. **EAS CLI**: `npm install -g eas-cli`
3. **Android Studio**: For Android development
4. **Physical Android Device**: For testing real SMS

## 📋 Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure EAS Build

Your `eas.json` is already configured for development builds:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug"
      }
    }
  }
}
```

### 3. Build Development Version

```bash
# Login to Expo (if not already logged in)
eas login

# Build development version for Android
eas build --platform android --profile development
```

### 4. Install Development Build

1. Download the APK from the build link
2. Enable "Install from Unknown Sources" on your Android device
3. Install the APK on your device
4. Open the app and grant SMS permissions when prompted

## 🔐 Permission Setup

### Required Permissions

The app will request these permissions:

- **READ_SMS**: Read existing SMS messages
- **RECEIVE_SMS**: Intercept incoming SMS
- **SEND_SMS**: Send SMS (for blocking responses)
- **POST_NOTIFICATIONS**: Show spam alerts

### Granting Permissions

1. **First Launch**: App will request permissions automatically
2. **Manual Grant**: Go to Settings → Apps → SMS Shield → Permissions
3. **Verify**: Check that all SMS permissions are granted

## 🧪 Testing Real SMS Functionality

### 1. Test SMS Reading

```typescript
// In your app, this will now read real SMS
const messages = await smsService.getAllSMS();
console.log('Real SMS messages:', messages);
```

### 2. Test Real-time Monitoring

```typescript
// Start monitoring real SMS
await smsService.startMonitoring();

// Listen for new SMS
smsService.onSMSReceived((message) => {
  console.log('New SMS received:', message);
  console.log('Spam analysis:', message.isSpam);
});
```

### 3. Test Spam Detection

Send test SMS to your device:
- **Spam**: "Congratulations! You've won $50,000..."
- **Phishing**: "Your Bank of Ghana account has been suspended..."
- **Legitimate**: "Your MTN mobile money transaction was successful..."

## 🔧 Native Module Integration

### Android Native Components

Your app includes these native components:

1. **SMSModule.kt**: Main SMS interface
2. **SMSReceiver.kt**: Broadcast receiver for incoming SMS
3. **SMSMonitoringService.kt**: Background service
4. **SMSClassifier.kt**: ML-based spam detection

### React Native Bridge

The app uses React Native's Native Modules to bridge JavaScript and native code:

```typescript
// Native module methods available:
- requestPermissions(): Promise<SMSPermissionStatus>
- getAllSMS(): Promise<SMSMessage[]>
- startMonitoring(): Promise<void>
- stopMonitoring(): Promise<void>
- analyzeSMS(message): Promise<SMSAnalysisResult>
```

## 📊 Real Data Analytics

### What You Can Test

1. **Message Analysis**: Real SMS spam detection
2. **Performance Metrics**: Actual protection rates
3. **User Experience**: Real app flow with live data
4. **Algorithm Accuracy**: Test against real spam patterns

### Analytics Features

- **Total Messages**: Count of all SMS
- **Spam Detected**: Number of spam messages
- **Protection Rate**: Percentage of spam caught
- **Money Saved**: Estimated savings from spam prevention

## 🚨 Troubleshooting

### Common Issues

**"Permission Denied"**
- Go to Settings → Apps → SMS Shield → Permissions
- Grant all SMS permissions manually

**"No SMS Data"**
- Ensure you have SMS messages on your device
- Check that READ_SMS permission is granted
- Restart the app after granting permissions

**"Monitoring Not Working"**
- Verify RECEIVE_SMS permission is granted
- Check that the app is not battery optimized
- Ensure background services are enabled

**"Build Failed"**
- Check your EAS account has build credits
- Verify Android Studio is properly configured
- Check network connection during build

### Debug Mode

Enable debug logging:

```bash
# Start with debug logging
expo start --dev-client

# Check logs
adb logcat | grep SMSShield
```

## 🔄 Development Workflow

### 1. Make Changes
Edit your code in the development build

### 2. Test Real Data
- Send test SMS to your device
- Verify spam detection works
- Check analytics update correctly

### 3. Iterate
- Update algorithms based on real data
- Improve UI based on actual usage
- Optimize performance

### 4. Rebuild (if needed)
```bash
eas build --platform android --profile development
```

## 📱 Device Requirements

### Android Requirements
- **Android Version**: 6.0 (API 23) or higher
- **RAM**: 2GB minimum
- **Storage**: 100MB free space
- **Permissions**: SMS access enabled

### Recommended Devices
- **Samsung Galaxy**: S8 or newer
- **Google Pixel**: Any recent model
- **OnePlus**: 6 or newer
- **Xiaomi**: Mi 8 or newer

## 🔒 Security Considerations

### Data Privacy
- SMS data is processed locally on device
- No SMS content is sent to external servers
- Analytics are anonymized and local

### Permission Usage
- SMS permissions are used only for spam detection
- No SMS content is stored in cloud
- User can revoke permissions anytime

## 📈 Performance Optimization

### Best Practices
1. **Batch Processing**: Analyze multiple SMS at once
2. **Caching**: Cache analysis results
3. **Background Limits**: Respect Android background limits
4. **Memory Management**: Clear old data periodically

### Monitoring
- Check memory usage in Android Settings
- Monitor battery impact
- Verify background service stability

## 🎯 Next Steps

After setting up real SMS access:

1. **Test with Real Spam**: Send various spam messages
2. **Optimize Algorithms**: Improve detection accuracy
3. **Enhance UI**: Based on real user interactions
4. **Performance Tuning**: Optimize for battery and memory
5. **User Testing**: Get feedback from real usage

## 📞 Support

For issues with real SMS setup:

1. Check this guide first
2. Review console logs for errors
3. Verify permissions are granted
4. Test on different devices
5. Check EAS build status

---

**Note**: This development build provides full SMS functionality. For production deployment, ensure all security and privacy measures are properly implemented.
