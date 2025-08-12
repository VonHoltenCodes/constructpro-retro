/**
 * ConstructPro Retro - Typography System
 * Based on NEONpulseTechshop terminal/monospace patterns
 */

import { Platform } from 'react-native';
import { RetroColors } from './RetroColors';

/**
 * Font families for different platforms
 */
export const RetroFonts = {
  // Primary monospace fonts (for headers, technical content)
  monospace: Platform.select({
    ios: 'Courier New',
    android: 'monospace',
    default: 'Courier New',
  }),
  
  // Secondary fonts (for body text, readability)
  body: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  
  // Special terminal font (if available)
  terminal: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'Courier New',
  }),
} as const;

/**
 * Typography scale following retro design principles
 */
export const RetroTypography = {
  // Display text (large headers, hero text)
  display: {
    fontSize: 32,
    fontFamily: RetroFonts.monospace,
    fontWeight: 'bold' as const,
    color: RetroColors.primary,
    textTransform: 'uppercase' as const,
    letterSpacing: 3,
    lineHeight: 38,
  },
  
  // Main headers (screen titles)
  h1: {
    fontSize: 28,
    fontFamily: RetroFonts.monospace,
    fontWeight: 'bold' as const,
    color: RetroColors.primary,
    textTransform: 'uppercase' as const,
    letterSpacing: 2,
    lineHeight: 34,
  },
  
  // Section headers
  h2: {
    fontSize: 24,
    fontFamily: RetroFonts.monospace,
    fontWeight: 'bold' as const,
    color: RetroColors.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 2,
    lineHeight: 30,
  },
  
  // Subsection headers
  h3: {
    fontSize: 20,
    fontFamily: RetroFonts.monospace,
    fontWeight: 'bold' as const,
    color: RetroColors.accent,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    lineHeight: 26,
  },
  
  // Small headers
  h4: {
    fontSize: 18,
    fontFamily: RetroFonts.monospace,
    fontWeight: 'bold' as const,
    color: RetroColors.textPrimary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    lineHeight: 24,
  },
  
  // Large body text
  bodyLarge: {
    fontSize: 18,
    fontFamily: RetroFonts.body,
    fontWeight: 'normal' as const,
    color: RetroColors.textPrimary,
    lineHeight: 26,
  },
  
  // Normal body text
  body: {
    fontSize: 16,
    fontFamily: RetroFonts.body,
    fontWeight: 'normal' as const,
    color: RetroColors.textPrimary,
    lineHeight: 24,
  },
  
  // Small body text
  bodySmall: {
    fontSize: 14,
    fontFamily: RetroFonts.body,
    fontWeight: 'normal' as const,
    color: RetroColors.textSecondary,
    lineHeight: 20,
  },
  
  // Button text
  button: {
    fontSize: 16,
    fontFamily: RetroFonts.monospace,
    fontWeight: 'bold' as const,
    color: RetroColors.primary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  
  // Button text (large)
  buttonLarge: {
    fontSize: 18,
    fontFamily: RetroFonts.monospace,
    fontWeight: 'bold' as const,
    color: RetroColors.primary,
    textTransform: 'uppercase' as const,
    letterSpacing: 2,
  },
  
  // Caption/metadata text
  caption: {
    fontSize: 12,
    fontFamily: RetroFonts.body,
    fontWeight: 'normal' as const,
    color: RetroColors.textMuted,
    lineHeight: 16,
  },
  
  // Terminal/code text
  terminal: {
    fontSize: 14,
    fontFamily: RetroFonts.terminal,
    fontWeight: 'normal' as const,
    color: RetroColors.primary,
    letterSpacing: 0.5,
    lineHeight: 20,
  },
  
  // Label text (for forms)
  label: {
    fontSize: 14,
    fontFamily: RetroFonts.monospace,
    fontWeight: 'bold' as const,
    color: RetroColors.accent,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  
  // Input text
  input: {
    fontSize: 16,
    fontFamily: RetroFonts.terminal,
    fontWeight: 'normal' as const,
    color: RetroColors.textPrimary,
    letterSpacing: 0.5,
  },
  
  // Navigation text
  nav: {
    fontSize: 14,
    fontFamily: RetroFonts.monospace,
    fontWeight: 'bold' as const,
    color: RetroColors.textPrimary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  
  // Tab text
  tab: {
    fontSize: 12,
    fontFamily: RetroFonts.monospace,
    fontWeight: 'bold' as const,
    color: RetroColors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  
  // Tab text (active)
  tabActive: {
    fontSize: 12,
    fontFamily: RetroFonts.monospace,
    fontWeight: 'bold' as const,
    color: RetroColors.primary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  
  // Error text
  error: {
    fontSize: 14,
    fontFamily: RetroFonts.body,
    fontWeight: 'normal' as const,
    color: RetroColors.error,
    lineHeight: 20,
  },
  
  // Success text
  success: {
    fontSize: 14,
    fontFamily: RetroFonts.body,
    fontWeight: 'normal' as const,
    color: RetroColors.success,
    lineHeight: 20,
  },
  
  // Warning text
  warning: {
    fontSize: 14,
    fontFamily: RetroFonts.body,
    fontWeight: 'normal' as const,
    color: RetroColors.warning,
    lineHeight: 20,
  },
} as const;

/**
 * Construction-specific typography variants
 */
export const ConstructionTypography = {
  // Project title
  projectTitle: {
    ...RetroTypography.h1,
    color: RetroColors.primary,
  },
  
  // GPS coordinates display
  coordinates: {
    ...RetroTypography.terminal,
    color: RetroColors.accent,
    fontSize: 12,
  },
  
  // Timestamp display
  timestamp: {
    ...RetroTypography.terminal,
    color: RetroColors.warning,
    fontSize: 12,
  },
  
  // Photo count/metadata
  metadata: {
    ...RetroTypography.caption,
    color: RetroColors.textMuted,
    fontFamily: RetroFonts.monospace,
  },
  
  // Status indicator
  status: {
    ...RetroTypography.label,
    fontSize: 12,
  },
  
  // Progress percentage
  progress: {
    ...RetroTypography.terminal,
    color: RetroColors.success,
    fontSize: 18,
    fontWeight: 'bold' as const,
  },
  
  // Team member name
  teamMember: {
    ...RetroTypography.body,
    color: RetroColors.accent,
    fontFamily: RetroFonts.monospace,
  },
  
  // Photo category tag
  categoryTag: {
    ...RetroTypography.caption,
    color: RetroColors.secondary,
    fontFamily: RetroFonts.monospace,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
} as const;

/**
 * Typography utility functions
 */
export const TypographyUtils = {
  /**
   * Create phosphor glow text effect
   */
  withGlow: (style: any, color: string = RetroColors.primary) => ({
    ...style,
    textShadowColor: color,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  }),
  
  /**
   * Create typing animation style
   */
  withTypingEffect: (style: any) => ({
    ...style,
    overflow: 'hidden' as const,
  }),
  
  /**
   * Create terminal-style text with cursor
   */
  withCursor: (style: any) => ({
    ...style,
    // This would be implemented with animation in components
  }),
  
  /**
   * Scale font size for different screen densities
   */
  scale: (size: number, factor: number = 1) => size * factor,
  
  /**
   * Create responsive font size based on screen width
   */
  responsive: (base: number, screen: 'small' | 'medium' | 'large') => {
    const scales = { small: 0.9, medium: 1.0, large: 1.1 };
    return base * scales[screen];
  },
};

export default RetroTypography;