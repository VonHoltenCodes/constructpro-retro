/**
 * ConstructPro Retro - Component Styles
 * Reusable styled components based on NEONpulseTechshop patterns
 */

import { StyleSheet, Dimensions } from 'react-native';
import { RetroColors, ColorUtils } from './RetroColors';
import { RetroTypography } from './RetroTypography';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * Common measurements for construction field use
 * Large touch targets for glove-friendly interface
 */
export const RetroMeasurements = {
  // Touch targets (44px minimum for gloves)
  touchTarget: 44,
  touchTargetLarge: 56,
  touchTargetSmall: 36,
  
  // Spacing system
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border radius
  borderRadius: {
    none: 0,
    sm: 2,
    md: 4,
    lg: 8,
    full: 9999,
  },
  
  // Border widths
  borderWidth: {
    thin: 1,
    normal: 2,
    thick: 3,
    heavy: 4,
  },
  
  // Screen dimensions
  screen: {
    width: screenWidth,
    height: screenHeight,
    thumbZone: screenHeight * 0.75, // Lower 75% for thumb reach
  },
} as const;

/**
 * Base component styles
 */
export const RetroComponents = StyleSheet.create({
  // CONTAINERS
  
  container: {
    flex: 1,
    backgroundColor: RetroColors.darkBg,
  },
  
  safeContainer: {
    flex: 1,
    backgroundColor: RetroColors.darkBg,
    paddingHorizontal: RetroMeasurements.spacing.md,
  },
  
  centeredContainer: {
    flex: 1,
    backgroundColor: RetroColors.darkBg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: RetroMeasurements.spacing.md,
  },
  
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: RetroColors.darkBg,
    paddingHorizontal: RetroMeasurements.spacing.md,
    paddingVertical: RetroMeasurements.spacing.lg,
  },
  
  // CARDS & PANELS
  
  card: {
    backgroundColor: RetroColors.darkAccent,
    borderWidth: RetroMeasurements.borderWidth.normal,
    borderColor: RetroColors.lightAccent,
    borderRadius: RetroMeasurements.borderRadius.md,
    padding: RetroMeasurements.spacing.md,
    marginVertical: RetroMeasurements.spacing.sm,
    ...ColorUtils.phosphorGlow(RetroColors.lightAccent, 0.3),
  },
  
  terminalPanel: {
    backgroundColor: RetroColors.darkBg,
    borderWidth: RetroMeasurements.borderWidth.normal,
    borderColor: RetroColors.primary,
    borderRadius: RetroMeasurements.borderRadius.sm,
    padding: RetroMeasurements.spacing.md,
    marginVertical: RetroMeasurements.spacing.sm,
    ...ColorUtils.phosphorGlow(RetroColors.primary, 0.5),
  },
  
  photoCard: {
    backgroundColor: RetroColors.darkAccent,
    borderWidth: RetroMeasurements.borderWidth.normal,
    borderColor: RetroColors.accent,
    borderRadius: RetroMeasurements.borderRadius.md,
    overflow: 'hidden',
    marginVertical: RetroMeasurements.spacing.sm,
    ...ColorUtils.phosphorGlow(RetroColors.accent, 0.4),
  },
  
  // BUTTONS
  
  buttonPrimary: {
    minHeight: RetroMeasurements.touchTarget,
    backgroundColor: 'transparent',
    borderWidth: RetroMeasurements.borderWidth.normal,
    borderColor: RetroColors.primary,
    borderRadius: RetroMeasurements.borderRadius.sm,
    paddingHorizontal: RetroMeasurements.spacing.lg,
    paddingVertical: RetroMeasurements.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    ...ColorUtils.phosphorGlow(RetroColors.primary, 0.6),
  },
  
  buttonSecondary: {
    minHeight: RetroMeasurements.touchTarget,
    backgroundColor: 'transparent',
    borderWidth: RetroMeasurements.borderWidth.normal,
    borderColor: RetroColors.secondary,
    borderRadius: RetroMeasurements.borderRadius.sm,
    paddingHorizontal: RetroMeasurements.spacing.lg,
    paddingVertical: RetroMeasurements.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    ...ColorUtils.phosphorGlow(RetroColors.secondary, 0.6),
  },
  
  buttonLarge: {
    minHeight: RetroMeasurements.touchTargetLarge,
    backgroundColor: 'transparent',
    borderWidth: RetroMeasurements.borderWidth.thick,
    borderColor: RetroColors.primary,
    borderRadius: RetroMeasurements.borderRadius.md,
    paddingHorizontal: RetroMeasurements.spacing.xl,
    paddingVertical: RetroMeasurements.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...ColorUtils.phosphorGlow(RetroColors.primary, 0.8),
  },
  
  buttonPressed: {
    backgroundColor: RetroColors.primary,
    ...ColorUtils.phosphorGlow(RetroColors.primary, 1.0),
  },
  
  // Generic button (same as buttonPrimary)
  button: {
    minHeight: RetroMeasurements.touchTarget,
    backgroundColor: 'transparent',
    borderWidth: RetroMeasurements.borderWidth.normal,
    borderColor: RetroColors.primary,
    borderRadius: RetroMeasurements.borderRadius.sm,
    paddingHorizontal: RetroMeasurements.spacing.lg,
    paddingVertical: RetroMeasurements.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    ...ColorUtils.phosphorGlow(RetroColors.primary, 0.6),
  },
  
  buttonDanger: {
    minHeight: RetroMeasurements.touchTarget,
    backgroundColor: 'transparent',
    borderWidth: RetroMeasurements.borderWidth.normal,
    borderColor: RetroColors.error,
    borderRadius: RetroMeasurements.borderRadius.sm,
    paddingHorizontal: RetroMeasurements.spacing.lg,
    paddingVertical: RetroMeasurements.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    ...ColorUtils.phosphorGlow(RetroColors.error, 0.6),
  },
  
  buttonSmall: {
    minHeight: RetroMeasurements.touchTargetSmall,
    paddingHorizontal: RetroMeasurements.spacing.md,
    paddingVertical: RetroMeasurements.spacing.xs,
  },
  
  fabButton: {
    width: RetroMeasurements.touchTargetLarge,
    height: RetroMeasurements.touchTargetLarge,
    borderRadius: RetroMeasurements.touchTargetLarge / 2,
    backgroundColor: RetroColors.darkAccent,
    borderWidth: RetroMeasurements.borderWidth.thick,
    borderColor: RetroColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: RetroMeasurements.spacing.xl,
    right: RetroMeasurements.spacing.lg,
    ...ColorUtils.phosphorGlow(RetroColors.primary, 0.8),
  },
  
  // INPUT FIELDS
  
  input: {
    minHeight: RetroMeasurements.touchTarget,
    backgroundColor: RetroColors.darkBg,
    borderWidth: RetroMeasurements.borderWidth.normal,
    borderColor: RetroColors.lightAccent,
    borderRadius: RetroMeasurements.borderRadius.sm,
    paddingHorizontal: RetroMeasurements.spacing.md,
    paddingVertical: RetroMeasurements.spacing.sm,
    color: RetroColors.textPrimary,
    ...RetroTypography.input,
  },
  
  inputFocused: {
    borderColor: RetroColors.primary,
    ...ColorUtils.phosphorGlow(RetroColors.primary, 0.4),
  },
  
  textArea: {
    minHeight: RetroMeasurements.touchTarget * 2,
    backgroundColor: RetroColors.darkBg,
    borderWidth: RetroMeasurements.borderWidth.normal,
    borderColor: RetroColors.lightAccent,
    borderRadius: RetroMeasurements.borderRadius.sm,
    padding: RetroMeasurements.spacing.md,
    color: RetroColors.textPrimary,
    textAlignVertical: 'top',
    ...RetroTypography.input,
  },
  
  // NAVIGATION
  
  tabBar: {
    backgroundColor: RetroColors.darkBg,
    borderTopWidth: RetroMeasurements.borderWidth.normal,
    borderTopColor: RetroColors.primary,
    height: RetroMeasurements.touchTarget + RetroMeasurements.spacing.md,
    paddingBottom: RetroMeasurements.spacing.sm,
    ...ColorUtils.phosphorGlow(RetroColors.primary, 0.3),
  },
  
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: RetroMeasurements.touchTarget,
  },
  
  tabItemActive: {
    borderTopWidth: RetroMeasurements.borderWidth.normal,
    borderTopColor: RetroColors.primary,
  },
  
  // CAMERA UI
  
  cameraContainer: {
    flex: 1,
    backgroundColor: RetroColors.darkBg,
  },
  
  cameraPreview: {
    flex: 1,
    borderWidth: RetroMeasurements.borderWidth.thick,
    borderColor: RetroColors.primary,
    margin: RetroMeasurements.spacing.sm,
    borderRadius: RetroMeasurements.borderRadius.md,
    overflow: 'hidden',
    ...ColorUtils.phosphorGlow(RetroColors.primary, 0.6),
  },
  
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: RetroMeasurements.spacing.lg,
  },
  
  viewfinder: {
    position: 'absolute',
    top: '40%',
    left: '20%',
    right: '20%',
    bottom: '40%',
    borderWidth: RetroMeasurements.borderWidth.normal,
    borderColor: RetroColors.primary,
    borderRadius: RetroMeasurements.borderRadius.sm,
    ...ColorUtils.phosphorGlow(RetroColors.primary, 0.8),
  },
  
  captureButton: {
    width: RetroMeasurements.touchTarget * 1.5,
    height: RetroMeasurements.touchTarget * 1.5,
    borderRadius: RetroMeasurements.touchTarget * 0.75,
    backgroundColor: 'transparent',
    borderWidth: RetroMeasurements.borderWidth.thick,
    borderColor: RetroColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    ...ColorUtils.phosphorGlow(RetroColors.primary, 1.0),
  },
  
  // LISTS & GRIDS
  
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: RetroMeasurements.touchTarget,
    paddingHorizontal: RetroMeasurements.spacing.md,
    paddingVertical: RetroMeasurements.spacing.sm,
    borderBottomWidth: RetroMeasurements.borderWidth.thin,
    borderBottomColor: RetroColors.lightAccent,
  },
  
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: RetroMeasurements.spacing.sm,
  },
  
  gridItem: {
    width: (screenWidth - RetroMeasurements.spacing.md * 3) / 2,
    marginBottom: RetroMeasurements.spacing.md,
  },
  
  // STATUS INDICATORS
  
  statusBadge: {
    paddingHorizontal: RetroMeasurements.spacing.sm,
    paddingVertical: RetroMeasurements.spacing.xs,
    borderRadius: RetroMeasurements.borderRadius.sm,
    borderWidth: RetroMeasurements.borderWidth.thin,
    alignSelf: 'flex-start',
  },
  
  statusSuccess: {
    backgroundColor: ColorUtils.withOpacity(RetroColors.success, 0.1),
    borderColor: RetroColors.success,
  },
  
  statusWarning: {
    backgroundColor: ColorUtils.withOpacity(RetroColors.warning, 0.1),
    borderColor: RetroColors.warning,
  },
  
  statusError: {
    backgroundColor: ColorUtils.withOpacity(RetroColors.error, 0.1),
    borderColor: RetroColors.error,
  },
  
  // LOADING & PROGRESS
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: RetroColors.darkBg,
  },
  
  progressBar: {
    height: RetroMeasurements.spacing.sm,
    backgroundColor: RetroColors.darkAccent,
    borderWidth: RetroMeasurements.borderWidth.thin,
    borderColor: RetroColors.primary,
    borderRadius: RetroMeasurements.borderRadius.sm,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: RetroColors.primary,
    ...ColorUtils.phosphorGlow(RetroColors.primary, 0.6),
  },
  
  // OVERLAYS & MODALS
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(12, 12, 12, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: RetroMeasurements.spacing.lg,
  },
  
  modalContent: {
    backgroundColor: RetroColors.darkAccent,
    borderWidth: RetroMeasurements.borderWidth.thick,
    borderColor: RetroColors.primary,
    borderRadius: RetroMeasurements.borderRadius.md,
    padding: RetroMeasurements.spacing.lg,
    maxWidth: screenWidth * 0.9,
    maxHeight: screenHeight * 0.8,
    ...ColorUtils.phosphorGlow(RetroColors.primary, 0.8),
  },
  
  // SCANLINE EFFECTS
  
  scanlineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    // Background pattern would be implemented with LinearGradient
    pointerEvents: 'none',
  },
  
  // GLOVE-FRIENDLY ENHANCEMENTS
  
  touchEnhanced: {
    minHeight: RetroMeasurements.touchTarget,
    minWidth: RetroMeasurements.touchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  touchEnhancedLarge: {
    minHeight: RetroMeasurements.touchTargetLarge,
    minWidth: RetroMeasurements.touchTargetLarge,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // ADDITIONAL UI COMPONENTS
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: RetroMeasurements.spacing.md,
  },
  
  closeButton: {
    padding: RetroMeasurements.spacing.sm,
  },
  
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: RetroMeasurements.spacing.md,
    gap: RetroMeasurements.spacing.sm,
  },
  
  warning: {
    backgroundColor: ColorUtils.withOpacity(RetroColors.warning, 0.2),
    borderColor: RetroColors.warning,
  },

  // Modal components
  modalContainer: {
    flex: 1,
    backgroundColor: RetroColors.darkBg,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: RetroMeasurements.spacing.md,
    paddingVertical: RetroMeasurements.spacing.md,
    borderBottomWidth: RetroMeasurements.borderWidth.normal,
    borderBottomColor: RetroColors.primary,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  formSection: {
    marginVertical: RetroMeasurements.spacing.md,
    padding: RetroMeasurements.spacing.md,
    backgroundColor: RetroColors.darkAccent,
    borderRadius: RetroMeasurements.borderRadius.md,
    borderWidth: RetroMeasurements.borderWidth.thin,
    borderColor: RetroColors.lightAccent,
  },

  infoRow: {
    marginVertical: RetroMeasurements.spacing.sm,
  },

  inputRow: {
    flexDirection: 'row',
    marginVertical: RetroMeasurements.spacing.sm,
  },

  textInput: {
    minHeight: RetroMeasurements.touchTarget,
    backgroundColor: RetroColors.darkBg,
    borderWidth: RetroMeasurements.borderWidth.normal,
    borderColor: RetroColors.lightAccent,
    borderRadius: RetroMeasurements.borderRadius.sm,
    paddingHorizontal: RetroMeasurements.spacing.md,
    paddingVertical: RetroMeasurements.spacing.sm,
    color: RetroColors.textPrimary,
    ...RetroTypography.input,
  },

  secondaryButton: {
    minHeight: RetroMeasurements.touchTarget,
    backgroundColor: 'transparent',
    borderWidth: RetroMeasurements.borderWidth.normal,
    borderColor: RetroColors.secondary,
    borderRadius: RetroMeasurements.borderRadius.sm,
    paddingHorizontal: RetroMeasurements.spacing.lg,
    paddingVertical: RetroMeasurements.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    ...ColorUtils.phosphorGlow(RetroColors.secondary, 0.6),
  },

  primaryButton: {
    minHeight: RetroMeasurements.touchTarget,
    backgroundColor: 'transparent',
    borderWidth: RetroMeasurements.borderWidth.normal,
    borderColor: RetroColors.primary,
    borderRadius: RetroMeasurements.borderRadius.sm,
    paddingHorizontal: RetroMeasurements.spacing.lg,
    paddingVertical: RetroMeasurements.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    ...ColorUtils.phosphorGlow(RetroColors.primary, 0.6),
  },

  mapContainer: {
    marginVertical: RetroMeasurements.spacing.md,
    height: 300,
    borderWidth: RetroMeasurements.borderWidth.normal,
    borderColor: RetroColors.primary,
    borderRadius: RetroMeasurements.borderRadius.md,
    overflow: 'hidden',
    ...ColorUtils.phosphorGlow(RetroColors.primary, 0.4),
  },

  map: {
    flex: 1,
  },
});

/**
 * Animation configurations for retro effects
 */
export const RetroAnimations = {
  // Typing animation timing
  typingSpeed: 50, // ms per character
  
  // Pulse animation
  pulse: {
    duration: 2000,
    useNativeDriver: true,
  },
  
  // Fade animations
  fadeIn: {
    duration: 300,
    useNativeDriver: true,
  },
  
  fadeOut: {
    duration: 200,
    useNativeDriver: true,
  },
  
  // Slide animations
  slideUp: {
    duration: 300,
    useNativeDriver: true,
  },
  
  slideDown: {
    duration: 300,
    useNativeDriver: true,
  },
  
  // Scale animations
  scaleIn: {
    duration: 200,
    useNativeDriver: true,
  },
  
  scaleOut: {
    duration: 150,
    useNativeDriver: true,
  },
  
  // Glow pulsing
  glowPulse: {
    duration: 1500,
    useNativeDriver: false, // Shadow animations require layout animations
  },
};

export default RetroComponents;