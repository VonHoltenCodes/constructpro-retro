/**
 * RetroChip - Status/tag chips with retro styling
 * Compact status indicators with glow effects
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { RetroColors, ColorUtils } from '../../styles/RetroColors';
import { RetroTypography } from '../../styles/RetroTypography';
import { RetroMeasurements } from '../../styles/RetroComponents';

export type ChipVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'custom';
export type ChipSize = 'small' | 'medium' | 'large';

export interface RetroChipProps {
  label: string;
  variant?: ChipVariant;
  size?: ChipSize;
  color?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  onDelete?: () => void;
  selected?: boolean;
  disabled?: boolean;
  animated?: boolean;
  glowIntensity?: number;
}

const variantColors: Record<ChipVariant, string> = {
  default: RetroColors.lightAccent,
  success: RetroColors.success,
  warning: RetroColors.warning,
  error: RetroColors.error,
  info: RetroColors.info,
  custom: RetroColors.primary,
};

const sizeStyles: Record<ChipSize, {
  height: number;
  paddingHorizontal: number;
  fontSize: number;
  iconSize: number;
}> = {
  small: {
    height: 24,
    paddingHorizontal: RetroMeasurements.spacing.sm,
    fontSize: 12,
    iconSize: 14,
  },
  medium: {
    height: 32,
    paddingHorizontal: RetroMeasurements.spacing.md,
    fontSize: 14,
    iconSize: 18,
  },
  large: {
    height: 40,
    paddingHorizontal: RetroMeasurements.spacing.lg,
    fontSize: 16,
    iconSize: 22,
  },
};

export const RetroChip: React.FC<RetroChipProps> = ({
  label,
  variant = 'default',
  size = 'medium',
  color,
  icon,
  onPress,
  onDelete,
  selected = false,
  disabled = false,
  animated = false,
  glowIntensity = 0.4,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const effectiveColor = color || variantColors[variant];
  const sizeStyle = sizeStyles[size];
  const isInteractive = !!(onPress || onDelete);

  React.useEffect(() => {
    if (animated && selected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated, selected]);

  const handlePressIn = () => {
    if (isInteractive && !disabled) {
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (isInteractive && !disabled) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const chipStyle: Animated.AnimatedProps<ViewStyle> = {
    height: sizeStyle.height,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sizeStyle.paddingHorizontal,
    backgroundColor: selected
      ? ColorUtils.withOpacity(effectiveColor, 0.2)
      : 'transparent',
    borderWidth: RetroMeasurements.borderWidth.thin,
    borderColor: effectiveColor,
    borderRadius: sizeStyle.height / 2,
    opacity: disabled ? 0.5 : 1,
    transform: [
      { scale: scaleAnim },
      ...(animated && selected ? [{ scale: pulseAnim }] : []),
    ],
    ...(selected && ColorUtils.phosphorGlow(effectiveColor, glowIntensity)),
  };

  const labelStyle: TextStyle = {
    ...RetroTypography.body,
    fontSize: sizeStyle.fontSize,
    color: selected ? RetroColors.textPrimary : RetroColors.textSecondary,
    marginHorizontal: icon || onDelete ? RetroMeasurements.spacing.xs : 0,
  };

  const iconContainerStyle: ViewStyle = {
    width: sizeStyle.iconSize,
    height: sizeStyle.iconSize,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const deleteButtonStyle: ViewStyle = {
    marginLeft: RetroMeasurements.spacing.xs,
    width: sizeStyle.iconSize,
    height: sizeStyle.iconSize,
    borderRadius: sizeStyle.iconSize / 2,
    backgroundColor: ColorUtils.withOpacity(effectiveColor, 0.2),
    justifyContent: 'center',
    alignItems: 'center',
  };

  const deleteIconStyle: TextStyle = {
    fontSize: sizeStyle.iconSize - 4,
    color: effectiveColor,
    fontWeight: 'bold',
  };

  const content = (
    <Animated.View style={chipStyle}>
      {icon && <View style={iconContainerStyle}>{icon}</View>}
      <Text style={labelStyle}>{label}</Text>
      {onDelete && (
        <TouchableOpacity
          onPress={onDelete}
          disabled={disabled}
          style={deleteButtonStyle}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={deleteIconStyle}>×</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  if (onPress && !onDelete) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

// Convenience component for chip groups
export interface RetroChipGroupProps {
  children: React.ReactNode;
  spacing?: number;
  wrap?: boolean;
}

export const RetroChipGroup: React.FC<RetroChipGroupProps> = ({
  children,
  spacing = RetroMeasurements.spacing.sm,
  wrap = true,
}) => {
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: wrap ? 'wrap' : 'nowrap',
    gap: spacing,
    marginVertical: spacing / 2,
  };

  return <View style={containerStyle}>{children}</View>;
};

export default RetroChip;