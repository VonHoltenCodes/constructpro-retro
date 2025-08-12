# ConstructPro Retro - Development Guide

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🔧 DEVELOPMENT SETUP & AGENT-POWERED WORKFLOW 🔧                        ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18+ (tested with v20.19.3)
- **React Native CLI**: Globally installed
- **Expo CLI**: Globally installed (@expo/cli)
- **Android Studio**: For Android development
- **Xcode**: For iOS development (macOS only)

### Development Setup
```bash
# Clone the repository
git clone <repo-url>
cd constructpro-retro

# Install dependencies
npm install

# Start development server
npm run dev

# Run on specific platform
npm run android    # Android device/emulator
npm run ios        # iOS device/simulator
```

## 🤖 Agent-Powered Development

This project leverages Claude Code's specialized agents for efficient development:

### 🔧 Core Development Agents

#### `/develop` - Feature Development
```bash
# Use for implementing new features
/develop camera component with retro styling
/develop GPS integration with EXIF extraction
/develop offline photo storage system
```

#### `/ship` - Fast Implementation
```bash
# Use for rapid deployment of working code
/ship photo capture functionality
/ship retro UI components
/ship navigation system
```

#### `/research` - Codebase Analysis
```bash
# Use for understanding existing patterns
/research React Native camera implementations
/research Expo location services
/research retro styling patterns
```

### 🧪 Quality Assurance Agents

#### `/test` - Functionality Testing
```bash
# Use for testing core features
/test camera permissions and capture
/test GPS coordinate extraction
/test offline storage functionality
```

#### `/qa` - Quality Verification
```bash
# Use for comprehensive quality checks
/qa photo metadata extraction accuracy
/qa mobile responsiveness and touch targets
/qa retro visual consistency
```

### 🎯 Specialized Agents

#### `/install` - Dependency Management
```bash
# Use for adding new packages
/install react-native-vision-camera
/install @react-native-async-storage/async-storage
/install expo-haptics
```

#### `/fix` - Issue Resolution
```bash
# Use for resolving problems
/fix metro bundler configuration issues
/fix Android permissions not working
/fix iOS build errors
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── buttons/         # Retro-styled buttons
│   ├── camera/          # Camera interface components
│   ├── cards/           # Project and photo cards
│   ├── forms/           # Input components
│   ├── navigation/      # Navigation components
│   └── overlays/        # Modal and overlay components
├── screens/             # Main app screens
│   ├── auth/            # Authentication screens
│   ├── camera/          # Camera capture screens
│   ├── dashboard/       # Main dashboard
│   ├── projects/        # Project management screens
│   └── settings/        # App settings
├── services/            # Business logic and API services
│   ├── camera/          # Camera and EXIF services
│   ├── database/        # SQLite database services
│   ├── location/        # GPS and location services
│   └── storage/         # File storage services
├── navigation/          # Navigation configuration
│   ├── AppNavigator.tsx # Main app navigation
│   ├── TabNavigator.tsx # Bottom tab navigation
│   └── StackNavigator.tsx # Stack navigation
├── styles/              # Design system
│   ├── RetroColors.ts   # Color palette and utilities
│   ├── RetroTypography.ts # Typography system
│   ├── RetroComponents.ts # Component styles
│   └── index.ts         # Style system exports
├── utils/               # Utility functions
│   ├── exif/            # EXIF data extraction
│   ├── permissions/     # Device permissions
│   └── validation/      # Input validation
└── assets/              # Static assets
    ├── fonts/           # Custom fonts
    ├── images/          # App images and icons
    └── sounds/          # Retro sound effects
```

## 🎨 Retro Design System

### Color Palette
```typescript
import { RetroColors } from './src/styles';

// Primary colors
RetroColors.primary    // #00FF41 (Matrix Green)
RetroColors.secondary  // #FF00FF (Neon Magenta)
RetroColors.accent     // #00FFFF (Cyber Cyan)

// Background hierarchy
RetroColors.darkBg      // #0C0C0C (Terminal Black)
RetroColors.darkAccent  // #1A1A1A (Dark panels)
RetroColors.lightAccent // #3D3D3D (Borders)
```

### Typography System
```typescript
import { RetroTypography } from './src/styles';

// Headers use monospace fonts with letter spacing
<Text style={RetroTypography.h1}>PROJECT TITLE</Text>
<Text style={RetroTypography.terminal}>GPS: 40.7128, -74.0060</Text>
<Text style={RetroTypography.body}>Regular body text</Text>
```

### Component Usage
```typescript
import { RetroComponents } from './src/styles';

// Buttons with phosphor glow
<TouchableOpacity style={RetroComponents.buttonPrimary}>
  <Text style={RetroTypography.button}>CAPTURE PHOTO</Text>
</TouchableOpacity>

// Cards with retro styling
<View style={RetroComponents.terminalPanel}>
  <Text style={RetroTypography.h3}>PROJECT STATUS</Text>
</View>
```

## 📱 Mobile Development Considerations

### Glove-Friendly Interface
- **Touch Targets**: Minimum 44px for standard, 56px for primary actions
- **Spacing**: Enhanced spacing between interactive elements
- **Visual Feedback**: Strong visual feedback for interactions

### Field Use Optimization
- **High Contrast**: Readable in bright sunlight
- **Large Text**: 16px+ for body text, 18px+ for important information
- **Simplified Navigation**: Bottom tab bar for one-handed use

### Offline-First Design
- **Local Storage**: SQLite for project data
- **File System**: Expo FileSystem for photos
- **Sync Strategy**: Background sync when connectivity restored

## 🔧 Development Workflow

### 1. Feature Development
```bash
# Start with research
/research existing camera implementations

# Plan the feature
/plan photo capture with EXIF extraction

# Implement with agents
/develop camera component with retro UI
/ship photo storage functionality

# Test and refine
/test camera permissions and functionality
/fix any issues found during testing
```

### 2. UI Component Creation
```bash
# Research design patterns
/research retro button styles from NEONpulseTechshop

# Implement component
/develop retro button component with animations

# Test on devices
/test touch targets and visual feedback
```

### 3. Bug Fixing Workflow
```bash
# Identify issue
/research metro bundler configuration problems

# Apply fix
/fix Android build configuration

# Verify resolution
/test build process on all platforms
```

## 🧪 Testing Strategy

### Manual Testing Checklist
- [ ] Camera opens and captures photos
- [ ] GPS coordinates extracted from photos
- [ ] Photos saved with metadata
- [ ] Offline functionality works
- [ ] Touch targets work with gloves
- [ ] Retro animations smooth
- [ ] Text readable in sunlight

### Device Testing
- **Android**: Test on various screen sizes and Android versions
- **iOS**: Test on iPhone and iPad
- **Real Devices**: Always test on physical devices for camera/GPS

### Performance Testing
- [ ] App launches quickly
- [ ] Camera preview smooth
- [ ] Photo capture responsive
- [ ] Scrolling performance good
- [ ] Memory usage reasonable

## 🔄 Build Process

### Development Builds
```bash
# Development build for testing
npm run dev

# Build for Android testing
npm run android

# Build for iOS testing  
npm run ios
```

### Production Builds
```bash
# Android APK for local distribution
npm run build:android

# iOS archive for local distribution
npm run build:ios
```

### Build Configuration
- **Development**: Fast refresh, debugging enabled
- **Production**: Optimized, minified, no debugging

## 🚨 Troubleshooting

### Common Issues

#### Metro Bundler Errors
```bash
# Clear Metro cache
npx expo start --clear

# Reset node modules
rm -rf node_modules
npm install
```

#### Android Build Issues
```bash
# Clean Android build
cd android
./gradlew clean
cd ..
```

#### iOS Build Issues
```bash
# Clean iOS build
cd ios
xcodebuild clean
cd ..
```

#### Permission Issues
- Check app.json permissions configuration
- Verify platform-specific permission requests
- Test permissions on real devices

### Agent-Assisted Debugging
```bash
# Use agents for systematic debugging
/fix metro bundler configuration
/research Android permission issues
/debug iOS camera access problems
```

## 📦 Dependencies Management

### Adding New Dependencies
```bash
# Use the install agent
/install new-package-name

# Or manually
npm install new-package-name
npx expo install expo-specific-package
```

### Version Management
- **Expo SDK**: Currently using SDK 53
- **React Native**: Compatible version (0.76.3)
- **Dependencies**: Prefer Expo-compatible packages

## 🔐 Security Considerations

### Data Privacy
- **Local Storage**: All data stored locally by default
- **Photo Metadata**: Only extract necessary EXIF data
- **Location Data**: Used only for photo tagging

### Permissions
- **Camera**: Required for photo capture
- **Location**: Required for GPS tagging
- **Storage**: Required for photo saving

## 📈 Performance Optimization

### Image Handling
- **Compression**: Compress photos for storage
- **Thumbnails**: Generate thumbnails for lists
- **Lazy Loading**: Load images on demand

### Database Optimization
- **Indexing**: Index frequently queried columns
- **Batch Operations**: Use transactions for multiple operations
- **Cleanup**: Regular cleanup of old data

## 🎯 Development Tips

### Agent Usage Best Practices
1. **Start with Research**: Use `/research` to understand existing patterns
2. **Plan Before Building**: Use `/plan` for complex features
3. **Ship Incrementally**: Use `/ship` for working functionality
4. **Test Frequently**: Use `/test` throughout development
5. **Fix Issues Promptly**: Use `/fix` when problems arise

### Code Quality
- **TypeScript**: Use strict typing
- **ESLint**: Follow linting rules
- **Prettier**: Consistent code formatting
- **Comments**: Document complex logic

### Mobile-First Mindset
- **Touch First**: Design for fingers, not mouse
- **Network Awareness**: Handle offline states
- **Performance**: Optimize for mobile hardware
- **Battery Life**: Minimize background processing

---

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  🟢 BUILD FAST, TEST OFTEN, SHIP RETRO 🟢                                ║
║                                                                           ║
║  "Every commit should be deployment-ready,                               ║
║   every feature should solve a real construction problem,                ║
║   every interaction should feel satisfyingly retro."                     ║
║                                                                           ║
║  ⚡ Agent-Powered Development • VonHoltenCodes • 2025 ⚡                  ║
╚═══════════════════════════════════════════════════════════════════════════╝
```