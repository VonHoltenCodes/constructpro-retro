# ConstructPro Retro - iOS Device Installation Guide

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🍎 COMPLETE iOS INSTALLATION GUIDE 🍎                                   ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

## 📱 Overview

iOS installation is more restricted than Android. This guide covers **FOUR methods**:
1. **TestFlight** (Easiest, requires developer account)
2. **AltStore** (No developer account needed)
3. **Apple Configurator 2** (Enterprise deployment)
4. **Xcode Development Build** (Direct USB installation)

---

## Method 1: TestFlight (Recommended)

### Prerequisites
- Apple Developer Account ($99/year)
- TestFlight app on iOS devices
- EAS Build or Xcode

### Step 1: Build for TestFlight
```bash
# Using EAS Build
cd ~/repos/projects/constructpro-retro

# Configure for iOS
eas build:configure

# Build for iOS
eas build --platform ios --profile preview

# This creates an .ipa file
# EAS will offer to submit to TestFlight automatically
```

### Step 2: Upload to App Store Connect
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **My Apps** → **+** → **New App**
3. Fill in app information:
   - Platform: iOS
   - Name: ConstructPro Retro
   - Bundle ID: com.vonholtencodes.constructpro-retro
   - SKU: CONSTRUCTPRO001

### Step 3: Submit Build to TestFlight
```bash
# If not auto-submitted by EAS
eas submit --platform ios

# Or manually upload .ipa through Xcode
# Xcode → Window → Organizer → Upload
```

### Step 4: Add Testers
1. In App Store Connect → TestFlight
2. Add Internal Testers (up to 100)
3. Add External Testers (up to 10,000)
4. Send invitations

### Step 5: Install via TestFlight
**On iOS Device:**
1. Download **TestFlight** from App Store
2. Open email invitation
3. Tap **View in TestFlight**
4. Tap **Install**
5. App installs directly

---

## Method 2: AltStore (No Developer Account)

### Prerequisites
- Windows PC or Mac
- iTunes installed (Windows) or macOS 10.14.4+
- iOS device on same WiFi network

### Step 1: Install AltServer

**On Windows:**
1. Download [AltServer](https://altstore.io) for Windows
2. Run installer
3. Launch AltServer from system tray

**On Mac:**
1. Download [AltServer](https://altstore.io) for Mac
2. Move to Applications folder
3. Launch AltServer
4. Enable "Mail Plug-in" if prompted

### Step 2: Install AltStore on iOS
1. Connect iOS device to computer via USB
2. Trust computer on iOS device if prompted
3. Open iTunes/Finder and ensure device is recognized

**On Windows:**
- Click AltServer icon in system tray
- Select **Install AltStore** → **[Your Device]**

**On Mac:**
- Click AltServer icon in menu bar
- Select **Install AltStore** → **[Your Device]**

4. Enter your Apple ID and password
5. AltStore installs on device

### Step 3: Trust AltStore
**On iOS Device:**
1. Go to **Settings** → **General** → **VPN & Device Management**
2. Under "Developer App" tap your Apple ID
3. Tap **Trust "[Your Apple ID]"**
4. Tap **Trust** in popup

### Step 4: Build IPA File
```bash
# Build IPA locally
cd ~/repos/projects/constructpro-retro

# Create iOS build
eas build --platform ios --profile preview --local

# Or using Expo
expo build:ios -t archive

# IPA file will be generated
```

### Step 5: Install IPA via AltStore
**On iOS Device:**
1. Transfer IPA file to iOS device:
   - Email to yourself
   - Upload to iCloud Drive
   - Use AirDrop from Mac
   
2. Open **AltStore** on device
3. Tap **+** in top corner
4. Navigate to IPA file
5. Tap to install
6. Enter Apple ID if prompted

### Note: 7-Day Limitation
- Apps installed via AltStore expire after 7 days
- Must refresh apps weekly while on same WiFi as AltServer
- AltStore shows days remaining

---

## Method 3: Apple Configurator 2 (Enterprise)

### Prerequisites
- Mac with macOS 10.14+
- Apple Configurator 2 (free from Mac App Store)
- iOS devices connected via USB
- Apple Developer Enterprise Program ($299/year) OR
- Ad Hoc provisioning profile

### Step 1: Prepare IPA
```bash
# Build IPA with proper provisioning
eas build --platform ios --profile internal

# Ensure proper signing
```

### Step 2: Set Up Apple Configurator 2
1. Download from Mac App Store
2. Launch Apple Configurator 2
3. Sign in with Apple ID

### Step 3: Prepare Devices
1. Connect iOS devices via USB
2. Trust the computer on each device
3. Devices appear in Configurator

### Step 4: Add App
1. Select all target devices
2. Click **Add** → **Apps**
3. Choose **From my Mac**
4. Select your IPA file
5. Click **Add**

### Step 5: Install
- Installation begins automatically
- Progress shown for each device
- Devices can be disconnected once complete

---

## Method 4: Xcode Development Build

### Prerequisites
- Mac with Xcode installed
- iOS device
- Apple ID (free works)
- USB cable

### Step 1: Open Project in Xcode
```bash
# Generate iOS project
cd ~/repos/projects/constructpro-retro
npx expo prebuild --platform ios

# Open in Xcode
open ios/constructproretro.xcworkspace
```

### Step 2: Configure Signing
1. Select project in navigator
2. Select your target
3. Go to "Signing & Capabilities" tab
4. Check "Automatically manage signing"
5. Select your Team (personal Apple ID)

### Step 3: Select Device
1. Connect iOS device via USB
2. Trust computer on device
3. In Xcode toolbar, select your device (not simulator)

### Step 4: Build and Run
1. Click **Play** button or press Cmd+R
2. First time: "Developer cannot be verified" error
3. On device: Settings → General → VPN & Device Management
4. Tap your developer account
5. Tap "Trust"
6. Run again from Xcode

---

## 🔧 Troubleshooting

### "Untrusted Developer" Error
1. Go to **Settings** → **General** → **VPN & Device Management**
2. Under "Developer App" find the profile
3. Tap the profile
4. Tap **Trust "[Developer Name]"**
5. Tap **Trust** in popup

### "Unable to Install" Error

**Cause 1: Provisioning Profile**
- Ensure device UDID is in provisioning profile
- Regenerate profile if needed
- Use wildcard App ID for testing

**Cause 2: iOS Version**
- Requires iOS 13.0 or higher
- Check: Settings → General → About → Software Version

**Cause 3: Storage Space**
- Need at least 200MB free
- Check: Settings → General → iPhone Storage

### AltStore Crashes on Launch
- Ensure AltServer is running on computer
- Device and computer on same WiFi
- Refresh app in AltStore
- Reinstall if persists

### TestFlight Not Showing App
- Wait up to 24 hours for processing
- Check email for issues
- Ensure build uploaded successfully
- Add tester email correctly

---

## 🏢 Enterprise Deployment

### MDM Solutions
Popular MDM providers for iOS:
- **Jamf Pro**: Full enterprise management
- **Microsoft Intune**: Integrates with Office 365
- **VMware Workspace ONE**: Comprehensive platform
- **SimpleMDM**: Easier for small teams

### Configuration Profile
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadType</key>
            <string>com.apple.app.configuration</string>
            <key>PayloadIdentifier</key>
            <string>com.vonholtencodes.constructpro.config</string>
            <key>AppConfig</key>
            <dict>
                <key>DefaultProject</key>
                <string>Main Site</string>
                <key>GPSAccuracy</key>
                <string>high</string>
            </dict>
        </dict>
    </array>
</dict>
</plist>
```

---

## 📊 Installation Verification

### Check Installation
1. Look for **ConstructPro Retro** icon on home screen
2. Icon should show retro terminal design
3. Tap to launch

### Verify Permissions
**First Launch:**
1. **Camera Access**: "ConstructPro Retro would like to access the camera" → **OK**
2. **Location Access**: "Allow location access" → **Allow While Using App**
3. **Photo Library**: "Access your photos" → **Allow Access to All Photos**

### Test Core Features
- [ ] Camera opens with retro viewfinder
- [ ] GPS coordinates display on photos
- [ ] Photos save with metadata
- [ ] Can create projects
- [ ] Gallery shows all photos

---

## 🔄 Updating the App

### TestFlight Updates
- Automatic: Enable automatic updates in TestFlight
- Manual: Open TestFlight → tap **Update**

### AltStore Updates
1. Open AltStore while on same WiFi as computer
2. Go to **My Apps**
3. Tap **Update** next to ConstructPro Retro

### Enterprise Updates
- MDM pushes updates automatically
- Or configure in-app update checks

---

## 📱 Recommended iOS Devices

### Minimum Requirements
- iOS 13.0 or later
- iPhone 6s or newer
- iPad (6th generation) or newer
- 2GB RAM minimum
- 32GB storage recommended

### Tested Devices
- iPhone 12/13/14/15 series
- iPhone SE (2nd gen or newer)
- iPad Air (3rd gen or newer)
- iPad Pro (all models)

### Construction-Specific Cases
- **OtterBox Defender**: Maximum protection
- **LifeProof FRĒ**: Waterproof
- **Catalyst**: Impact protection
- **UAG Monarch**: Military-grade

---

## 🔐 Security & Privacy

### Data Protection
- All photos stored locally on device
- No automatic cloud uploads
- GPS data only used for photo tagging
- No tracking or analytics

### App Permissions Explained
- **Camera**: Required for photo documentation
- **Location**: GPS tagging for photos
- **Photo Library**: Save and retrieve project photos
- **Local Network**: Optional for server sync

---

## 📞 Support

### Common Issues Quick Fix
```
Checklist:
✓ iOS 13.0 or higher
✓ 200MB free storage  
✓ Developer profile trusted
✓ All permissions granted
✓ Device not in Low Power Mode
```

### Installation Support
- Email: ios-support@constructproretro.com
- Video guides: youtube.com/constructproretro
- FAQ: constructproretro.com/ios-help

---

## 🎯 Quick Start After Installation

1. **Create First Project**
   - Tap Projects tab
   - Tap + button
   - Enter project details
   - Save

2. **Take First Photo**
   - Tap Camera tab
   - Allow permissions
   - Frame shot with retro viewfinder
   - Tap capture button
   - Photo saves with GPS data

3. **Review in Gallery**
   - Tap Gallery tab
   - See all photos with metadata
   - Filter by project or date
   - Tap photo for full details

---

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  ✅ iOS installation complete!                                           ║
║  📸 Your construction team can now document projects in retro style      ║
║  🏗️ Built for the field, designed for the future                        ║
║  🍎 Even iOS can't resist the retro terminal charm!                     ║
╚═══════════════════════════════════════════════════════════════════════════╝
```