/**
 * RetroButton - Glowing phosphor button with multiple variants
 * Glove-friendly with 44px+ touch targets
 */

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { RetroColors, ColorUtils } from '../../styles/RetroColors';
import { RetroTypography } from '../../styles/RetroTypography';
import { RetroMeasurements } from '../../styles/RetroComponents';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'info';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface RetroButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  glowIntensity?: number;
}

const variantColors: Record<ButtonVariant, string> = {
  primary: RetroColors.primary,
  secondary: RetroColors.secondary,
  danger: RetroColors.error,
  warning: RetroColors.warning,
  info: RetroColors.info,
};

const sizeStyles: Record<ButtonSize, { height: number; padding: number; fontSize: number }> = {
  small: {
    height: RetroMeasurements.touchTargetSmall,
    padding: RetroMeasurements.spacing.sm,
    fontSize: 14,
  },
  medium: {
    height: RetroMeasurements.touchTarget,
    padding: RetroMeasurements.spacing.md,
    fontSize: 16,
  },
  large: {
    height: RetroMeasurements.touchTargetLarge,
    padding: RetroMeasurements.spacing.lg,
    fontSize: 18,
  },
};

export const RetroButton: React.FC<RetroButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  label,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  glowIntensity = 0.6,
  style,
  disabled,
  onPress,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(glowIntensity)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: glowIntensity * 1.5,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: glowIntensity,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const color = variantColors[variant];
  const sizeStyle = sizeStyles[size];
  const isDisabled = disabled || loading;

  const buttonStyle: Animated.AnimatedProps<ViewStyle> = {
    minHeight: sizeStyle.height,
    backgroundColor: 'transparent',
    borderWidth: RetroMeasurements.borderWidth.normal,
    borderColor: isDisabled ? RetroColors.lightAccent : color,
    borderRadius: RetroMeasurements.borderRadius.sm,
    paddingHorizontal: sizeStyle.padding,
    paddingVertical: sizeStyle.padding / 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    opacity: isDisabled ? 0.5 : 1,
    transform: [{ scale: scaleAnim }],
    ...(fullWidth && { width: '100%' }),
  };

  const glowStyle = Animated.createAnimatedComponent(View);

  const textStyle: TextStyle = {
    ...RetroTypography.button,
    fontSize: sizeStyle.fontSize,
    color: isDisabled ? RetroColors.textMuted : RetroColors.textPrimary,
    marginHorizontal: icon ? RetroMeasurements.spacing.xs : 0,
  };

  return (
    <Animated.View
      style={[
        buttonStyle,
        !isDisabled && ColorUtils.phosphorGlow(color, glowIntensity),
        style,
      ]}
    >
      <TouchableOpacity
        disabled={isDisabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        style={{ flexDirection: 'row', alignItems: 'center' }}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={color} size={size === 'small' ? 'small' : 'large'} />
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            <Text style={textStyle}>{label}</Text>
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default RetroButton;