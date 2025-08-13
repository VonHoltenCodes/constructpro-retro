/**
 * ConstructPro Retro - Style System Export
 * Centralized export for all retro design system components
 */

// Core style systems
export { RetroColors, ColorUtils, RetroColorCombos } from './RetroColors';
export { RetroTypography, ConstructionTypography, TypographyUtils, RetroFonts } from './RetroTypography';
export { RetroComponents, RetroMeasurements, RetroAnimations } from './RetroComponents';

// Type exports for TypeScript
export type { RetroColorKey } from './RetroColors';

/**
 * Complete retro theme object for easy consumption
 */
export const RetroTheme = {
  colors: RetroColors,
  typography: RetroTypography,
  components: RetroComponents,
  measurements: RetroMeasurements,
  animations: RetroAnimations,
} as const;

export default RetroTheme;