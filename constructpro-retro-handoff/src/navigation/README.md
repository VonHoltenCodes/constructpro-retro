# ConstructPro Retro Navigation Structure

## Overview
The app uses React Navigation with a bottom tab navigator as the root, and stack navigators for each tab.

## Navigation Hierarchy

```
RootNavigator (Tab Navigator)
├── Dashboard Stack
│   └── DashboardHome
├── Projects Stack
│   └── ProjectsList
├── Camera Stack
│   └── CameraCapture (headerShown: false)
├── Gallery Stack
│   └── GalleryGrid
└── Settings Stack
    └── SettingsMain
```

## Key Features

### Retro Tab Bar
- Custom tab bar component with CRT terminal styling
- Glove-friendly touch targets (44px minimum)
- Phosphor glow effects on active tabs
- Text-based icons for retro aesthetic
- Bottom position for thumb-zone accessibility

### Stack Configuration
- Consistent retro header styling across all stacks
- Matrix green borders and text
- Dark background theme
- Centered titles with letter spacing

### Navigation Types
- Fully typed navigation with TypeScript
- Composite screen props for nested navigation
- Global type declarations for typed navigation hooks

## Usage

```typescript
// Navigate between tabs
navigation.navigate('Projects');

// Navigate within a stack
navigation.navigate('ProjectDetail', { projectId: '123' });

// Access navigation in components
import { useNavigation } from '@react-navigation/native';
const navigation = useNavigation();
```

## Design Principles
1. **Mobile-first**: Optimized for one-handed use
2. **Glove-friendly**: Large touch targets for construction workers
3. **Retro aesthetic**: CRT terminal inspired visuals
4. **Performance**: Minimal animations for smooth experience