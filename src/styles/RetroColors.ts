/**
 * ConstructPro Retro - Color System
 * Based on NEONpulseTechshop aesthetic patterns
 * NO PURPLE GRADIENTS - Green/Cyan/Magenta Focus
 */

export const RetroColors = {
  // Primary CRT Terminal Colors
  primary: '#00FF41',       // Matrix Green - Main brand color
  secondary: '#FF00FF',     // Neon Magenta - Accent elements
  accent: '#00FFFF',        // Cyber Cyan - Links, highlights
  
  // Background Hierarchy
  darkBg: '#0C0C0C',        // Terminal Black - Main background
  darkAccent: '#1A1A1A',    // Darker accent - Cards, panels
  lightAccent: '#3D3D3D',   // Lighter accent - Borders, dividers
  
  // Text Colors
  textPrimary: '#FFFFFF',   // Pure White - Primary text
  textSecondary: '#CCCCCC', // Light Gray - Secondary text
  textMuted: '#999999',     // Medium Gray - Muted text
  
  // Status Colors (Retro Style)
  success: '#00FF41',       // Matrix Green - Success states
  warning: '#FFB000',       // Amber Terminal - Warnings
  error: '#FF0040',         // Bright Red - Errors
  info: '#00FFFF',          // Cyber Cyan - Info states
  
  // Interactive States
  buttonPrimary: {
    default: 'transparent',
    border: '#00FF41',
    pressed: '#00FF41',
    disabled: '#3D3D3D',
  },
  
  buttonSecondary: {
    default: 'transparent', 
    border: '#FF00FF',
    pressed: '#FF00FF',
    disabled: '#3D3D3D',
  },
  
  // Overlay Colors
  overlay: 'rgba(0, 255, 65, 0.1)',      // Green overlay
  overlayDark: 'rgba(12, 12, 12, 0.8)',  // Dark overlay
  overlayLight: 'rgba(255, 255, 255, 0.05)', // Light overlay
  
  // CRT Effect Colors
  scanline: 'rgba(0, 255, 65, 0.03)',    // Scanline effect
  phosphor: 'rgba(0, 255, 65, 0.2)',     // Phosphor glow
  static: 'rgba(255, 255, 255, 0.02)',   // Static noise
  
  // Construction-Specific Colors
  safety: '#FFB000',        // Amber - Safety alerts
  progress: '#00FF41',      // Green - Progress indicators
  issue: '#FF0040',         // Red - Issues/problems
  material: '#00FFFF',      // Cyan - Materials/inventory
  
  // Camera UI Colors
  viewfinder: '#00FF41',    // Green viewfinder
  recording: '#FF0040',     // Red recording indicator
  focus: '#00FFFF',         // Cyan focus indicator
  
} as const;

export type RetroColorKey = keyof typeof RetroColors;

/**
 * Color utility functions
 */
export const ColorUtils = {
  /**
   * Create phosphor glow effect
   */
  phosphorGlow: (color: string, intensity: number = 1) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8 * intensity,
    shadowRadius: 10 * intensity,
    elevation: 5,
  }),
  
  /**
   * Create neon border effect
   */
  neonBorder: (color: string, width: number = 2) => ({
    borderWidth: width,
    borderColor: color,
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 3,
  }),
  
  /**
   * Create scanline overlay
   */
  scanlineOverlay: (opacity: number = 0.03) => ({
    backgroundColor: `rgba(0, 255, 65, ${opacity})`,
  }),
  
  /**
   * Get RGB values from hex
   */
  hexToRgb: (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },
  
  /**
   * Create rgba string with opacity
   */
  withOpacity: (hex: string, opacity: number) => {
    const rgb = ColorUtils.hexToRgb(hex);
    return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})` : hex;
  },
};

/**
 * Pre-defined color combinations for common use cases
 */
export const RetroColorCombos = {
  terminalText: {
    color: RetroColors.textPrimary,
    backgroundColor: RetroColors.darkBg,
  },
  
  primaryButton: {
    borderColor: RetroColors.primary,
    backgroundColor: 'transparent',
  },
  
  secondaryButton: {
    borderColor: RetroColors.secondary,
    backgroundColor: 'transparent',
  },
  
  successAlert: {
    borderColor: RetroColors.success,
    backgroundColor: ColorUtils.withOpacity(RetroColors.success, 0.1),
  },
  
  errorAlert: {
    borderColor: RetroColors.error,
    backgroundColor: ColorUtils.withOpacity(RetroColors.error, 0.1),
  },
  
  warningAlert: {
    borderColor: RetroColors.warning,
    backgroundColor: ColorUtils.withOpacity(RetroColors.warning, 0.1),
  },
  
  card: {
    backgroundColor: RetroColors.darkAccent,
    borderColor: RetroColors.lightAccent,
  },
  
  panel: {
    backgroundColor: RetroColors.darkBg,
    borderColor: RetroColors.primary,
  },
};

export default RetroColors;