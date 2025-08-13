# ConstructPro Retro - Android Device Installation Guide

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🤖 COMPLETE ANDROID INSTALLATION GUIDE 🤖                               ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

## 📱 Overview

This guide covers **THREE methods** to get ConstructPro Retro on Android devices:
1. **Direct APK Installation** (Easiest for field teams)
2. **Development Build via USB** (For testing)
3. **Local Network Installation** (For multiple devices)

---

## Method 1: Direct APK Installation (Recommended for Teams)

### Step 1: Build the APK

#### Option A: Using EAS Build (Recommended)
```bash
# On your development machine
cd ~/repos/projects/constructpro-retro

# Install EAS CLI if not already installed
npm install -g eas-cli

# Login to Expo account (free account works)
eas login

# Build APK for Android
eas build --platform android --profile preview

# This will generate an APK file in the cloud
# Download link will be provided after build completes
```

#### Option B: Local Build with Android Studio
```bash
# Generate Android project
npx expo prebuild --platform android

# Navigate to Android directory
cd android

# Build release APK
./gradlew assembleRelease

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

### Step 2: Transfer APK to Device

#### Method A: Email
```
Subject: ConstructPro Retro App Installation

Team,

Please install the ConstructPro Retro app:

1. Download the attached APK file
2. Open your Downloads folder
3. Tap on constructpro-retro.apk
4. Follow installation prompts

Note: You may need to enable "Unknown Sources" first (see instructions below)

[Attach constructpro-retro.apk]
```

#### Method B: Google Drive/Dropbox
1. Upload APK to Google Drive or Dropbox
2. Share link with team
3. Open link on Android device
4. Download and install

#### Method C: USB Transfer
```bash
# Connect device via USB
# Enable file transfer mode on device

# Copy APK to device
adb push constructpro-retro.apk /sdcard/Download/

# Or use file manager to copy
```

#### Method D: QR Code
```bash
# Upload APK to your server
# Generate QR code for download URL
# Team scans QR code to download
```

### Step 3: Enable Unknown Sources

**For Android 8.0 and higher:**
1. Open **Settings**
2. Go to **Apps & notifications**
3. Tap **Advanced** (may need to expand)
4. Tap **Special app access**
5. Tap **Install unknown apps**
6. Select your browser or file manager
7. Toggle **Allow from this source** ON

**For Android 7.1 and lower:**
1. Open **Settings**
2. Go to **Security**
3. Toggle **Unknown sources** ON
4. Tap **OK** on warning dialog

### Step 4: Install the APK

1. Open your **Downloads** folder or **File Manager**
2. Find and tap **constructpro-retro.apk**
3. Tap **Install** when prompted
4. Wait for installation to complete
5. Tap **Open** to launch the app

### Step 5: Grant Permissions

When first launching the app:
1. **Camera Permission**: Tap "Allow" for photo documentation
2. **Location Permission**: Tap "Allow" for GPS tagging
3. **Storage Permission**: Tap "Allow" for saving photos

---

## Method 2: Development Build via USB

### Prerequisites
- Android device with Developer Mode enabled
- USB cable
- Computer with Android SDK/Android Studio

### Step 1: Enable Developer Options
1. Open **Settings** on Android device
2. Go to **About phone**
3. Tap **Build number** 7 times
4. Enter PIN/password if prompted
5. "You are now a developer!" message appears

### Step 2: Enable USB Debugging
1. Go back to **Settings**
2. Open **System** → **Developer options**
3. Toggle **USB debugging** ON
4. Tap **OK** on warning dialog

### Step 3: Connect and Verify Device
```bash
# Connect device via USB
# Choose "File Transfer" or "PTP" mode on device

# Verify connection
adb devices

# Should show:
# List of devices attached
# ABC123DEF456    device
```

### Step 4: Run Development Build
```bash
# Navigate to project
cd ~/repos/projects/constructpro-retro

# Start Metro bundler
npx expo start

# In another terminal, run on device
npx expo run:android --device

# Or if you know the device ID
npx expo run:android --device ABC123DEF456
```

### Step 5: Hot Reload Development
- App will install and launch
- Shake device to open developer menu
- Enable "Fast Refresh" for hot reload
- Make changes and see them instantly

---

## Method 3: Local Network Installation

### Step 1: Set Up Local Server
```bash
# Create simple file server
cd ~/repos/projects/constructpro-retro/builds

# Using Python
python3 -m http.server 8000

# Or using Node.js
npx http-server -p 8000
```

### Step 2: Find Your IP Address
```bash
# On Linux/Mac
ifconfig | grep "inet "

# On Windows
ipconfig

# Look for your local IP (e.g., 192.168.1.100)
```

### Step 3: Access from Android Device
1. Connect Android device to same WiFi network
2. Open browser on Android device
3. Navigate to: `http://[YOUR-IP]:8000`
4. Tap on the APK file to download
5. Install following Method 1 steps

---

## 🔧 Troubleshooting

### "App Not Installed" Error

**Cause 1: Existing Installation**
```bash
# Uninstall existing version first
adb uninstall com.vonholtencodes.constructproretro

# Or manually: Settings → Apps → ConstructPro Retro → Uninstall
```

**Cause 2: Insufficient Storage**
- Check available storage: Settings → Storage
- Need at least 100MB free space
- Clear cache if needed

**Cause 3: Incompatible Android Version**
- Requires Android 5.0 (API 21) or higher
- Check version: Settings → About phone → Android version

**Cause 4: Corrupted APK**
- Re-download the APK file
- Verify file size matches original

### "Package Appears to be Corrupted"
```bash
# Verify APK signature
jarsigner -verify -verbose constructpro-retro.apk

# Re-sign if needed
jarsigner -keystore your-keystore.jks constructpro-retro.apk your-alias
```

### Permissions Not Working

1. Go to **Settings** → **Apps**
2. Find **ConstructPro Retro**
3. Tap **Permissions**
4. Enable all required permissions:
   - Camera
   - Location
   - Storage

### Camera Black Screen
- Force stop app: Settings → Apps → ConstructPro Retro → Force Stop
- Clear app cache
- Restart device
- Reinstall if issue persists

---

## 🏢 Enterprise Deployment

### Using MDM (Mobile Device Management)
```xml
<!-- MDM Configuration -->
<app-configuration>
  <package>com.vonholtencodes.constructproretro</package>
  <source>/path/to/constructpro-retro.apk</source>
  <permissions>
    <camera>true</camera>
    <location>true</location>
    <storage>true</storage>
  </permissions>
  <auto-update>true</auto-update>
</app-configuration>
```

### Mass Deployment Script
```bash
#!/bin/bash
# deploy-to-devices.sh

DEVICES=$(adb devices | grep device$ | cut -f1)

for DEVICE in $DEVICES; do
    echo "Installing on $DEVICE..."
    adb -s $DEVICE install -r constructpro-retro.apk
    echo "Done with $DEVICE"
done
```

---

## 📊 Installation Verification

### Check Installation
```bash
# Via ADB
adb shell pm list packages | grep constructpro

# Should show:
# package:com.vonholtencodes.constructproretro
```

### Verify App Version
1. Open ConstructPro Retro
2. Go to Settings tab
3. Scroll to bottom
4. Check version number

### Test Core Features
- [ ] Camera opens and captures photos
- [ ] GPS coordinates appear on photos
- [ ] Photos save to gallery
- [ ] Can create new projects
- [ ] Can assign photos to projects

---

## 🔄 Updating the App

### Method 1: Install Over Existing
1. Download new APK version
2. Tap to install
3. Choose "Update" when prompted
4. App data is preserved

### Method 2: Via ADB
```bash
# Update without losing data
adb install -r constructpro-retro-v1.1.0.apk
```

### Version Management
- APK filename includes version: `constructpro-retro-v1.0.0.apk`
- Check current version in app Settings
- Keep changelog for teams

---

## 📱 Recommended Android Devices

### Minimum Requirements
- Android 5.0 (Lollipop) or higher
- 2GB RAM minimum
- 32GB storage (16GB available)
- GPS capability
- Rear camera

### Tested Devices
- Samsung Galaxy S series (S8 and newer)
- Google Pixel (all models)
- OnePlus (5 and newer)
- Motorola G series
- CAT rugged phones (S61, S62 Pro)

### Construction-Specific Recommendations
- **CAT S62 Pro**: Rugged, thermal camera
- **Samsung Galaxy XCover**: Military-grade durability
- **Sonim XP8**: Ultra-rugged, loud speaker
- **Kyocera DuraForce**: Waterproof, glove-friendly

---

## 📞 Support Contacts

### Installation Issues
- Email: support@constructproretro.com
- Slack: #constructpro-support

### Quick Help
```
Installation Checklist:
✓ Unknown Sources enabled
✓ 100MB free storage
✓ Android 5.0 or higher
✓ All permissions granted
✓ Connected to internet (first launch only)
```

---

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  ✅ Your construction team is ready to document projects in retro style! ║
║  📸 Take photos, tag locations, manage projects                          ║
║  🏗️ Built for the field, styled for the future                          ║
╚═══════════════════════════════════════════════════════════════════════════╝
```