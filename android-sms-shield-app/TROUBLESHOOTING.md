# SMS Shield App - Troubleshooting Guide

## 🚨 **Main Issue: "No Android device connected"**

This error occurs because you're trying to run the app on an Android emulator or device that isn't connected. Here's how to fix it:

## ✅ **Solution: Use Expo Go (Recommended)**

### **Step 1: Download Expo Go**
- **Android**: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

### **Step 2: Start the App**
Choose one of these methods:

#### **Method A: Use the provided script**
```bash
# Windows (Command Prompt)
start-app.bat

# Windows (PowerShell)
.\start-app.ps1
```

#### **Method B: Manual command**
```bash
npx expo start --tunnel
```

### **Step 3: Connect with Expo Go**
1. Open Expo Go on your phone
2. Scan the QR code that appears in your terminal
3. Your app will load automatically!

## 🔧 **Alternative Solutions**

### **Option 1: Use Tunnel Mode**
If you're having network issues:
```bash
npx expo start --tunnel
```

### **Option 2: Use LAN Mode**
If you're on the same WiFi:
```bash
npx expo start --lan
```

### **Option 3: Use Local Mode**
For local development:
```bash
npx expo start --localhost
```

## 🚫 **What NOT to Do**

❌ **Don't try to run on Android emulator** - This requires Android Studio setup
❌ **Don't press 'a' for Android** - This tries to use an emulator
❌ **Don't install Android Studio** - Not needed for Expo Go

## 📱 **Why Expo Go is Better**

✅ **No setup required** - Just download the app
✅ **Works on any device** - Android or iOS
✅ **Instant testing** - No compilation needed
✅ **Real device testing** - Test on actual hardware
✅ **Easy sharing** - Share with others via QR code

## 🔍 **Common Issues & Fixes**

### **Issue 1: "Expo Go not connecting"**
**Solution:**
- Ensure phone and computer are on same WiFi
- Try tunnel mode: `npx expo start --tunnel`
- Check firewall settings
- Restart Expo Go app

### **Issue 2: "QR code not scanning"**
**Solution:**
- Make sure Expo Go is up to date
- Try typing the URL manually in Expo Go
- Check if your camera has permission to scan QR codes

### **Issue 3: "App not loading"**
**Solution:**
- Clear Expo Go cache (Settings → Clear Cache)
- Restart Expo Go app
- Check internet connection
- Try tunnel mode

### **Issue 4: "Metro bundler errors"**
**Solution:**
```bash
# Clear cache and restart
npx expo start --clear

# Or reset completely
npx expo start --clear --tunnel
```

## 🎯 **Testing Your App**

Once connected with Expo Go, you can test:

1. **Home Screen**: View protection statistics
2. **Scan Screen**: Grant permissions, toggle monitoring
3. **Dashboard**: View analytics and performance
4. **Profile**: Check settings and preferences

## 📊 **What Works in Expo Go**

✅ **Complete UI**: All screens and navigation
✅ **Mock SMS Data**: Realistic Ghanaian messages
✅ **Spam Detection**: AI-powered analysis
✅ **Real-time Simulation**: Mock incoming messages
✅ **Analytics Dashboard**: Performance tracking
✅ **Permission Simulation**: Mock permission dialogs

## 🚀 **Next Steps**

After testing with Expo Go:

1. **Create Development Build**: For real SMS functionality
2. **Deploy to Production**: For actual use
3. **Customize Features**: Add more functionality
4. **Test on Different Devices**: Ensure compatibility

## 📞 **Need Help?**

If you're still having issues:

1. **Check Expo documentation**: https://docs.expo.dev/
2. **Review console logs** in your terminal
3. **Try different connection modes** (tunnel, lan, localhost)
4. **Update Expo Go** to the latest version
5. **Check your network** connection

---

**Remember**: Expo Go is the easiest way to test your React Native app without setting up Android Studio or emulators!
