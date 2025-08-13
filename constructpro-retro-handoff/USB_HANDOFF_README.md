# ConstructPro Retro - USB Handoff Package

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  📦 USB HANDOFF PACKAGE FOR ZENTYAL SERVER DEPLOYMENT 📦                 ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

## 📋 Package Contents

This USB drive contains the complete ConstructPro Retro project ready for deployment to your Zentyal production server (192.168.68.67).

### Core Files
- **App.tsx** - Main application entry point
- **package.json** - Dependencies and scripts
- **package-lock.json** - Locked dependency versions
- **app.json** - Expo configuration
- **babel.config.js** - Babel transpiler config
- **metro.config.js** - Metro bundler config
- **tsconfig.json** - TypeScript configuration

### Source Code Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Retro-styled UI library
│   └── location/       # GPS and location services
├── screens/            # Main app screens
├── navigation/         # React Navigation setup
├── services/           # Core business logic
│   ├── camera/         # Camera and photo capture
│   ├── database/       # SQLite data management
│   └── storage/        # Photo storage management
├── styles/             # Retro design system
└── utils/              # EXIF extraction utilities
```

### Documentation
- **README.md** - Main project documentation
- **DEPLOYMENT.md** - Local development setup
- **DEVELOPMENT.md** - Development workflow
- **SERVER_HANDSHAKE.md** - Zentyal server configuration
- **ANDROID_DEVICE_INSTALL.md** - Android installation guide
- **IOS_DEVICE_INSTALL.md** - iOS installation guide
- **docs/RETRO_DESIGN_GUIDE.md** - Design system guide

### Deployment Scripts
- **deploy-to-zentyal.sh** - Automated deployment script (EXECUTABLE)

## 🚀 Quick Deployment Steps

### 1. Transfer to Server
```bash
# From your workstation, copy the project
scp -r /path/to/usb/constructpro-retro-handoff/ traxx@192.168.68.67:/var/www/

# Or if already on server, copy from mounted USB
cp -r /media/usb/constructpro-retro-handoff/ /var/www/constructpro-retro/
```

### 2. Run Deployment Script
```bash
# Navigate to project directory
cd /var/www/constructpro-retro

# Make script executable (if needed)
chmod +x deploy-to-zentyal.sh

# Run automated deployment
./deploy-to-zentyal.sh
```

The deployment script will:
- ✅ Check server connection
- ✅ Install/configure NVM and Node.js 20.19.3
- ✅ Create application directory
- ✅ Install dependencies
- ✅ Install PM2 process manager
- ✅ Configure Apache reverse proxy
- ✅ Start the application
- ✅ Show access points and monitoring commands

## 📱 After Deployment

### Build Mobile Apps
```bash
# Install EAS CLI
npm install -g eas-cli

# Build Android APK
eas build --platform android --profile preview

# Build iOS (if on Mac)
eas build --platform ios --profile preview
```

### Access Points
- **Direct**: http://192.168.68.67:3010
- **Apache Proxy**: http://constructpro.local
- **Server IP**: http://192.168.68.67

### Device Installation
1. Follow **ANDROID_DEVICE_INSTALL.md** for Android devices
2. Follow **IOS_DEVICE_INSTALL.md** for iOS devices
3. Distribute APK/IPA files to construction teams

## 🔧 Key Features

### Retro CRT Aesthetic
- Matrix green primary color (#00FF41)
- NO purple gradients (as requested)
- Scanline effects and retro typography
- Terminal-inspired UI elements

### Construction Focus
- GPS-tagged photo documentation
- Project organization and tracking
- EXIF data preservation
- Offline-first SQLite database
- Glove-friendly touch targets (44px+)

### Mobile Apps
- React Native with Expo SDK 53
- TypeScript for type safety
- Camera integration with location services
- Photo gallery with metadata display
- Cross-platform (Android & iOS)

## 🎯 Target Use Cases

### Belle Tire Renovation (Defiance, Ohio)
- Document renovation progress
- Tag photos with GPS coordinates
- Track project milestones
- Share progress with stakeholders

### Christian Brothers Development (Broken Arrow, Oklahoma)
- Ground-up construction documentation
- Photo timeline of building phases
- GPS verification of work locations
- Team coordination and progress tracking

## 📞 Support Information

### Project Details
- **Project**: ConstructPro Retro
- **Target Server**: Zentyal (192.168.68.67)
- **Node Version**: 20.19.3 (via NVM)
- **Process Manager**: PM2
- **Web Server**: Apache with reverse proxy

### File Verification
- **File Count**: 78 files
- **Package Size**: 3.6MB (excluding node_modules)
- **Executable Script**: deploy-to-zentyal.sh

### Next Steps
1. Deploy to server using deployment script
2. Build APK/IPA files for mobile distribution
3. Install on team devices using provided guides
4. Begin project documentation with retro style!

---

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  ✅ Ready for deployment to Zentyal production server!                   ║
║  📱 Complete mobile app solution for construction teams                   ║
║  🏗️ Built for the field, styled for the future                          ║
║  🖥️ Retro terminal aesthetic (no purple gradients!)                      ║
╚═══════════════════════════════════════════════════════════════════════════╝
```