/**
 * RetroInput - CRT-styled input fields
 * Glove-friendly with proper touch targets
 */

import React, { useRef, useState } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  Text,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { RetroColors, ColorUtils } from '../../styles/RetroColors';
import { RetroTypography } from '../../styles/RetroTypography';
import { RetroMeasurements } from '../../styles/RetroComponents';

export type InputVariant = 'default' | 'terminal' | 'search' | 'numeric';
export type InputSize = 'small' | 'medium' | 'large';

export interface RetroInputProps extends TextInputProps {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  glowOnFocus?: boolean;
  showBorder?: boolean;
}

const sizeStyles: Record<InputSize, { height: number; fontSize: number; padding: number }> = {
  small: {
    height: RetroMeasurements.touchTargetSmall,
    fontSize: 14,
    padding: RetroMeasurements.spacing.sm,
  },
  medium: {
    height: RetroMeasurements.touchTarget,
    fontSize: 16,
    padding: RetroMeasurements.spacing.md,
  },
  large: {
    height: RetroMeasurements.touchTargetLarge,
    fontSize: 18,
    padding: RetroMeasurements.spacing.lg,
  },
};

export const RetroInput: React.FC<RetroInputProps> = ({
  variant = 'default',
  size = 'medium',
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  glowOnFocus = true,
  showBorder = true,
  style,
  onFocus,
  onBlur,
  editable = true,
  multiline,
  numberOfLines,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const glowAnim = useRef(new Animated.Value(0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  const sizeStyle = sizeStyles[size];
  const isError = !!error;
  const isDisabled = !editable;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (glowOnFocus) {
      Animated.parallel([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (glowOnFocus) {
      Animated.parallel([
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
    onBlur?.(e);
  };

  const getBorderColor = () => {
    if (isError) return RetroColors.error;
    if (isFocused) return RetroColors.primary;
    return RetroColors.lightAccent;
  };

  const containerStyle: ViewStyle = {
    marginVertical: RetroMeasurements.spacing.sm,
  };

  const inputContainerStyle: Animated.AnimatedProps<ViewStyle> = {
    minHeight: multiline ? sizeStyle.height * (numberOfLines || 3) : sizeStyle.height,
    backgroundColor: variant === 'terminal' ? RetroColors.darkBg : RetroColors.darkAccent,
    borderWidth: showBorder ? RetroMeasurements.borderWidth.normal : 0,
    borderColor: getBorderColor(),
    borderRadius: RetroMeasurements.borderRadius.sm,
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    paddingHorizontal: sizeStyle.padding,
    opacity: isDisabled ? 0.5 : 1,
  };

  const inputStyle: TextStyle = {
    flex: 1,
    ...RetroTypography.input,
    fontSize: sizeStyle.fontSize,
    color: isDisabled ? RetroColors.textMuted : RetroColors.textPrimary,
    paddingVertical: sizeStyle.padding / 2,
    textAlignVertical: multiline ? 'top' : 'center',
  };

  const labelStyle: TextStyle = {
    ...RetroTypography.label,
    color: isError ? RetroColors.error : RetroColors.textSecondary,
    marginBottom: RetroMeasurements.spacing.xs,
  };

  const helperStyle: TextStyle = {
    ...RetroTypography.small,
    color: isError ? RetroColors.error : RetroColors.textMuted,
    marginTop: RetroMeasurements.spacing.xs,
  };

  const animatedGlow = glowOnFocus && isFocused
    ? ColorUtils.phosphorGlow(getBorderColor(), 0.6)
    : {};

  // Add typing effect for terminal variant
  const terminalCursor = variant === 'terminal' && isFocused && (
    <Animated.View
      style={{
        width: 2,
        height: sizeStyle.fontSize,
        backgroundColor: RetroColors.primary,
        marginLeft: 2,
        opacity: Animated.loop(
          Animated.sequence([
            Animated.timing(new Animated.Value(1), {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(new Animated.Value(0), {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        ),
      }}
    />
  );

  return (
    <View style={containerStyle}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <Animated.View style={[inputContainerStyle, animatedGlow, style]}>
        {icon && iconPosition === 'left' && (
          <View style={{ marginRight: RetroMeasurements.spacing.sm }}>{icon}</View>
        )}
        <TextInput
          style={inputStyle}
          placeholderTextColor={RetroColors.textDim}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardAppearance="dark"
          {...props}
        />
        {terminalCursor}
        {icon && iconPosition === 'right' && (
          <View style={{ marginLeft: RetroMeasurements.spacing.sm }}>{icon}</View>
        )}
      </Animated.View>
      {(error || helperText) && (
        <Text style={helperStyle}>{error || helperText}</Text>
      )}
    </View>
  );
};

export default RetroInput;