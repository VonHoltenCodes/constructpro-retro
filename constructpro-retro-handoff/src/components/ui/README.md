# Retro UI Components Library

A collection of reusable retro-styled components for the ConstructPro Retro app, featuring CRT terminal aesthetics with phosphor glow effects.

## Features

- 🎨 **Retro CRT Terminal Styling** - Matrix green phosphor glow effects
- 🧤 **Glove-Friendly** - All touch targets minimum 44px for construction site use
- 📱 **Fully Typed** - Complete TypeScript support with proper interfaces
- ⚡ **Animated** - Smooth retro animations and effects
- 🔧 **Customizable** - Multiple variants, sizes, and color options

## Components

### RetroButton
Glowing phosphor button with multiple variants
```tsx
<RetroButton
  label="CAPTURE PHOTO"
  variant="primary"
  size="large"
  onPress={handleCapture}
/>
```

### RetroCard
Terminal-style card container with glow effects
```tsx
<RetroCard variant="terminal" glowColor={RetroColors.primary}>
  <Text>Card content</Text>
</RetroCard>
```

### RetroInput
CRT-styled input fields with typing effects
```tsx
<RetroInput
  label="PROJECT NAME"
  placeholder="Enter project name..."
  variant="terminal"
  value={projectName}
  onChangeText={setProjectName}
/>
```

### RetroProgress
Progress bars with retro animations
```tsx
<RetroProgress
  value={75}
  variant="striped"
  color={RetroColors.success}
  showLabel
/>
```

### RetroAlert
Modal alerts with terminal styling
```tsx
<RetroAlert
  visible={showAlert}
  type="success"
  title="UPLOAD COMPLETE"
  message="Photos saved successfully"
  onClose={() => setShowAlert(false)}
/>
```

### RetroLoading
CRT scanline loading animations
```tsx
<RetroLoading
  variant="scanlines"
  size="medium"
  text="PROCESSING..."
/>
```

### RetroSwitch
Toggle switches with phosphor glow
```tsx
<RetroSwitch
  value={enabled}
  onValueChange={setEnabled}
  label="Enable GPS"
  showState
/>
```

### RetroChip
Status/tag chips for metadata display
```tsx
<RetroChipGroup>
  <RetroChip label="VERIFIED" variant="success" />
  <RetroChip label="PENDING" variant="warning" />
</RetroChipGroup>
```

## Usage

Import components from the central index:

```tsx
import {
  RetroButton,
  RetroCard,
  RetroInput,
  // ... other components
} from '@/components/ui';
```

## Styling

All components use the centralized retro design system:
- Colors from `RetroColors`
- Typography from `RetroTypography`
- Measurements from `RetroMeasurements`

## Demo

See `RetroUIDemo.tsx` for a complete showcase of all components and their variants.