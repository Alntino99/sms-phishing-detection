# SMS Shield - Development Build Guide

## 🚀 **Goal: Access Real SMS Data**

This guide will help you create a development build that can access real SMS messages from your phone.

## 📋 **Prerequisites**

1. **Android Studio** (for Android development)
2. **Android SDK** and tools
3. **USB Debugging** enabled on your phone
4. **Expo account** (you already have this)

## 🛠️ **Setup Steps**

### **Step 1: Install Android Studio**
1. Download from: https://developer.android.com/studio
2. Install with default settings
3. Open Android Studio and complete setup

### **Step 2: Enable USB Debugging**
1. Go to **Settings** → **About Phone**
2. Tap **Build Number** 7 times to enable Developer Options
3. Go to **Settings** → **Developer Options**
4. Enable **USB Debugging**
5. Connect your phone via USB

### **Step 3: Create Development Build**

#### **Option A: Local Build (Recommended)**
```bash
# Install Android Studio first, then:
npx expo run:android
```

#### **Option B: EAS Build (Cloud)**
```bash
# Configure EAS
eas build:configure

# Build for development
eas build --profile development --platform android
```

## 📱 **What You'll Get**

✅ **Real SMS Access**: Read actual SMS messages  
✅ **Background Services**: Run monitoring in background  
✅ **Native Permissions**: Request SMS permissions  
✅ **Real Notifications**: Push notifications  
✅ **Full Functionality**: All features working  

## 🔧 **Current Status**

Your app is now configured for development builds:

- ✅ **expo-dev-client** installed
- ✅ **eas.json** configured
- ✅ **app.json** updated
- ✅ **EAS CLI** installed

## 🎯 **Next Steps**

### **If you have Android Studio:**
1. **Install Android Studio**
2. **Set up Android SDK**
3. **Run**: `npx expo run:android`
4. **Install APK** on your phone
5. **Grant SMS permissions**

### **If you prefer cloud build:**
1. **Run**: `eas build --profile development --platform android`
2. **Download APK** when build completes
3. **Install on your phone**
4. **Grant SMS permissions**

## 📊 **Real SMS Features**

Once you have the development build:

- **Read SMS**: Access all SMS messages
- **Monitor Incoming**: Real-time SMS scanning
- **Spam Detection**: Analyze real messages
- **Background Monitoring**: Continuous protection
- **Real Notifications**: Alert for spam detected

## 🔒 **Permissions Required**

The app will request:
- **SMS Read Permission**: To read messages
- **SMS Receive Permission**: To monitor incoming
- **Notification Permission**: To alert about spam
- **Storage Permission**: To save data locally

## 🚨 **Important Notes**

- **Development builds** are larger than Expo Go
- **First build** may take 10-15 minutes
- **Real SMS access** requires user permission
- **Background monitoring** works only with dev build

## 📞 **Need Help?**

If you encounter issues:

1. **Check Android Studio** installation
2. **Verify USB debugging** is enabled
3. **Ensure phone is connected** via USB
4. **Check Expo account** is logged in

## 🎉 **Success Indicators**

You'll know it's working when:
- ✅ APK installs successfully
- ✅ App requests SMS permissions
- ✅ Real SMS messages appear
- ✅ Spam detection works on real data

---

**Your SMS Shield app is ready for real SMS access!** 🛡️
