# ConstructPro Retro - Deployment Guide

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  📦 LOCAL INSTALLATION & DISTRIBUTION GUIDE 📦                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

## 🎯 Overview

ConstructPro Retro is designed for **local installation** without app store dependencies. This guide covers building and distributing APK/IPA files directly to construction teams.

## 🤖 Android Deployment

### Prerequisites
- **Android Studio**: Latest version installed
- **Android SDK**: API level 21+ (Android 5.0+)
- **Expo CLI**: Global installation required

### Building Android APK

#### Method 1: Expo Build Service (Recommended)
```bash
# Configure EAS CLI (if not already done)
npm install -g @expo/eas-cli
eas login

# Build APK for local distribution
eas build --platform android --local
```

#### Method 2: Local Build
```bash
# Generate Android project
npx expo run:android --variant release

# Build APK manually
cd android
./gradlew assembleRelease

# Find APK in android/app/build/outputs/apk/release/
```

### APK Signing
```bash
# Generate keystore (one-time setup)
keytool -genkey -v -keystore constructpro-release-key.keystore \
  -alias constructpro-alias -keyalg RSA -keysize 2048 -validity 10000

# Add to android/app/build.gradle
android {
  signingConfigs {
    release {
      storeFile file('../../constructpro-release-key.keystore')
      storePassword 'your-store-password'
      keyAlias 'constructpro-alias'
      keyPassword 'your-key-password'
    }
  }
}
```

### Android Installation Guide

#### For Construction Teams:
```
╔═══════════════════════════════════════════════════════════════════════════╗
║  📱 ANDROID INSTALLATION INSTRUCTIONS                                    ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  1. Open Settings → Security → Unknown Sources                          ║
║  2. Enable "Allow installation of apps from unknown sources"            ║
║  3. Download constructpro-retro.apk to your device                      ║
║  4. Tap the downloaded APK file                                         ║
║  5. Follow the installation prompts                                     ║
║  6. Grant camera and location permissions when prompted                 ║
║  7. App ready for use!                                                  ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

#### Technical Installation:
```bash
# Install via ADB (for developers)
adb install constructpro-retro.apk

# Install on multiple devices
for device in $(adb devices | grep device | cut -f1); do
  adb -s $device install constructpro-retro.apk
done
```

## 🍎 iOS Deployment

### Prerequisites
- **macOS**: Required for iOS development
- **Xcode**: Latest version
- **Apple Developer Account**: For signing (free or paid)

### Building iOS IPA

#### Method 1: Expo Build Service
```bash
# Build IPA for local distribution
eas build --platform ios --local
```

#### Method 2: Xcode Build
```bash
# Generate iOS project
npx expo run:ios --configuration Release

# Open in Xcode and archive
# Product → Archive → Distribute App → Development
```

### iOS Installation Methods

#### Option 1: AltStore (No Developer Account Required)
```
╔═══════════════════════════════════════════════════════════════════════════╗
║  📱 iOS INSTALLATION VIA ALTSTORE                                        ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  1. Install AltStore on your iOS device                                 ║
║  2. Download constructpro-retro.ipa                                     ║
║  3. Open AltStore → My Apps → +                                         ║
║  4. Select the IPA file                                                 ║
║  5. Wait for installation to complete                                   ║
║  6. Trust the developer certificate in Settings                         ║
║  7. App ready for use!                                                  ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

#### Option 2: Apple Configurator (Enterprise)
```bash
# For enterprise deployment
# Requires Apple Business Manager account
# Deploy via Apple Configurator 2
```

#### Option 3: TestFlight (Development Testing)
```bash
# Upload to TestFlight for internal testing
# Limited to 100 internal testers
# Requires Apple Developer Program membership
```

## 🏢 Enterprise Distribution

### Android Enterprise Distribution

#### Mobile Device Management (MDM)
```bash
# Configure APK for MDM deployment
# Add to enterprise app catalog
# Push to managed devices
```

#### Email Distribution
```
Subject: ConstructPro Retro App Installation

Team,

Please install the ConstructPro Retro app for project documentation:

1. Download attached APK file
2. Enable "Unknown Sources" in Android settings
3. Install the APK
4. Grant camera and location permissions

App Features:
- Photo documentation with GPS tagging
- Offline project management
- Retro terminal interface
- Glove-friendly touch targets

Support: [contact-info]
```

### iOS Enterprise Distribution

#### Apple Enterprise Developer Program
```bash
# Requires $299/year Apple Enterprise Developer Program
# Allows unlimited internal distribution
# No App Store review required
```

#### Configuration Profile
```xml
<!-- Enterprise deployment configuration -->
<dict>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadIdentifier</key>
  <string>com.vonholtencodes.constructpro-retro.config</string>
  <!-- Additional configuration -->
</dict>
```

## 🔄 Update Distribution

### Version Management
```bash
# Update version in package.json
"version": "1.1.0"

# Update version in app.json
{
  "expo": {
    "version": "1.1.0",
    "android": {
      "versionCode": 2
    },
    "ios": {
      "buildNumber": "2"
    }
  }
}
```

### Update Notification
```typescript
// In-app update notification system
const checkForUpdates = async () => {
  const currentVersion = await getVersion();
  const latestVersion = await fetchLatestVersion();
  
  if (currentVersion < latestVersion) {
    showUpdateAlert({
      title: "UPDATE AVAILABLE",
      message: "New version available for download",
      buttons: ["Download", "Later"]
    });
  }
};
```

### Update Distribution Methods

#### 1. Email Updates
```
Subject: ConstructPro Retro Update v1.1.0

Team,

New app update available with improvements:

✅ Enhanced photo metadata extraction
✅ Improved GPS accuracy
✅ Bug fixes and performance improvements

Installation:
- Android: Download new APK and install over existing
- iOS: Install new IPA via AltStore

Download: [secure-link]

Changes in v1.1.0:
- Fixed camera focus issues
- Added photo batch upload
- Improved offline sync
- Enhanced retro animations

Questions? Contact: [support-email]
```

#### 2. Network Share Distribution
```bash
# Set up shared network folder
# Place APK/IPA files with version numbers
# Team downloads directly from shared drive
\\server\apps\constructpro-retro\
  ├── v1.0.0\
  │   ├── constructpro-retro-v1.0.0.apk
  │   └── constructpro-retro-v1.0.0.ipa
  └── v1.1.0\
      ├── constructpro-retro-v1.1.0.apk
      └── constructpro-retro-v1.1.0.ipa
```

#### 3. QR Code Distribution
```bash
# Generate QR codes for easy download
# Host files on secure server
# Print QR codes for job sites
```

## 🔐 Security & Compliance

### Code Signing
```bash
# Android: Always sign release APKs
# iOS: Use valid provisioning profiles
# Verify signatures before distribution
```

### Data Privacy
```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🔒 PRIVACY & SECURITY FEATURES                                          ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  ✅ All data stored locally on device                                   ║
║  ✅ No cloud synchronization by default                                 ║
║  ✅ GPS data only used for photo tagging                                ║
║  ✅ Photos remain on device unless manually exported                    ║
║  ✅ No personal data collection or tracking                             ║
║  ✅ Open source code available for security audit                       ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### Compliance Considerations
- **GDPR**: No personal data collection
- **CCPA**: Local storage only
- **Industry Standards**: Construction data handling
- **Device Security**: Encourage device PIN/biometric locks

## 🛠️ Build Automation

### CI/CD Pipeline (Optional)
```yaml
# .github/workflows/build.yml
name: Build ConstructPro Retro

on:
  push:
    tags:
      - 'v*'

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build APK
        run: eas build --platform android --local
      - name: Upload APK
        uses: actions/upload-artifact@v2
        with:
          name: constructpro-retro.apk
          path: build/
```

### Automated Testing
```bash
# Run tests before building
npm run test
npm run lint
npm run typecheck

# Only build if all tests pass
if [ $? -eq 0 ]; then
  npm run build:android
  npm run build:ios
fi
```

## 📊 Distribution Metrics

### Installation Tracking
```typescript
// Simple installation analytics (privacy-friendly)
const trackInstallation = async () => {
  const installDate = new Date().toISOString();
  const version = await getVersion();
  
  // Store locally only
  await AsyncStorage.setItem('installMetrics', JSON.stringify({
    installDate,
    version,
    platform: Platform.OS
  }));
};
```

### Usage Analytics (Optional)
```typescript
// Basic usage metrics (no personal data)
const trackUsage = async (action: string) => {
  const metrics = await AsyncStorage.getItem('usageMetrics') || '{}';
  const parsedMetrics = JSON.parse(metrics);
  
  parsedMetrics[action] = (parsedMetrics[action] || 0) + 1;
  
  await AsyncStorage.setItem('usageMetrics', JSON.stringify(parsedMetrics));
};
```

## 🚨 Troubleshooting

### Common Installation Issues

#### Android: "App not installed"
```
Solutions:
1. Enable "Unknown Sources" in security settings
2. Check available storage space
3. Uninstall previous version first
4. Download APK again (may be corrupted)
```

#### iOS: "Untrusted Developer"
```
Solutions:
1. Go to Settings → General → VPN & Device Management
2. Find the developer profile
3. Tap "Trust [Developer Name]"
4. Confirm trust in popup dialog
```

#### Permissions Not Working
```
Solutions:
1. Manually grant permissions in app settings
2. Restart the app after granting permissions
3. Check if location services are enabled system-wide
4. Reinstall app if permissions are corrupted
```

### Support Contact Information
```
╔═══════════════════════════════════════════════════════════════════════════╗
║  📞 INSTALLATION SUPPORT                                                 ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  Technical Issues: [tech-support-email]                                 ║
║  Installation Help: [install-support-email]                            ║
║  Feature Requests: [feature-request-email]                              ║
║  Bug Reports: [bug-report-email]                                        ║
║                                                                          ║
║  Response Time: 24-48 hours                                             ║
║  Emergency Support: [phone-number]                                      ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🟢 DEPLOY LOCAL, BUILD TRUST, WORK OFFLINE 🟢                           ║
║                                                                           ║
║  "Every installation should be straightforward,                          ║
║   every update should improve the work,                                  ║
║   every team should have the tools they need."                          ║
║                                                                           ║
║  📦 Local-First Distribution • VonHoltenCodes • 2025 📦                  ║
╚═══════════════════════════════════════════════════════════════════════════╝
```