/**
 * RetroCard - Terminal-style card with glow effects
 * Supports multiple variants and animations
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  ViewStyle,
  Animated,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { RetroColors, ColorUtils } from '../../styles/RetroColors';
import { RetroMeasurements } from '../../styles/RetroComponents';

export type CardVariant = 'default' | 'terminal' | 'photo' | 'elevated';

export interface RetroCardProps extends TouchableOpacityProps {
  variant?: CardVariant;
  children: React.ReactNode;
  glowColor?: string;
  glowIntensity?: number;
  animate?: boolean;
  padding?: number;
  margin?: number;
  borderWidth?: number;
}

const variantStyles: Record<CardVariant, {
  backgroundColor: string;
  borderColor: string;
  borderRadius: number;
}> = {
  default: {
    backgroundColor: RetroColors.darkAccent,
    borderColor: RetroColors.lightAccent,
    borderRadius: RetroMeasurements.borderRadius.md,
  },
  terminal: {
    backgroundColor: RetroColors.darkBg,
    borderColor: RetroColors.primary,
    borderRadius: RetroMeasurements.borderRadius.sm,
  },
  photo: {
    backgroundColor: RetroColors.darkAccent,
    borderColor: RetroColors.accent,
    borderRadius: RetroMeasurements.borderRadius.md,
  },
  elevated: {
    backgroundColor: RetroColors.darkAccent,
    borderColor: RetroColors.secondary,
    borderRadius: RetroMeasurements.borderRadius.lg,
  },
};

export const RetroCard: React.FC<RetroCardProps> = ({
  variant = 'default',
  children,
  glowColor,
  glowIntensity = 0.4,
  animate = false,
  padding = RetroMeasurements.spacing.md,
  margin = RetroMeasurements.spacing.sm,
  borderWidth = RetroMeasurements.borderWidth.normal,
  style,
  onPress,
  disabled,
  ...props
}) => {
  const glowAnim = useRef(new Animated.Value(glowIntensity)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const variantStyle = variantStyles[variant];
  const effectiveGlowColor = glowColor || variantStyle.borderColor;

  useEffect(() => {
    if (animate) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: glowIntensity * 1.5,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: glowIntensity,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [animate, glowIntensity]);

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const cardStyle: Animated.AnimatedProps<ViewStyle> = {
    backgroundColor: variantStyle.backgroundColor,
    borderWidth,
    borderColor: variantStyle.borderColor,
    borderRadius: variantStyle.borderRadius,
    padding,
    marginVertical: margin,
    transform: [{ scale: scaleAnim }],
    overflow: 'hidden',
  };

  const animatedGlowStyle = animate
    ? {
        shadowColor: effectiveGlowColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: glowAnim,
        shadowRadius: Animated.multiply(glowAnim, 15),
        elevation: 5,
      }
    : ColorUtils.phosphorGlow(effectiveGlowColor, glowIntensity);

  const content = (
    <Animated.View
      style={[
        cardStyle,
        animatedGlowStyle,
        style,
      ]}
    >
      {variant === 'terminal' && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: effectiveGlowColor,
            opacity: 0.6,
          }}
        />
      )}
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.9}
        {...props}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default RetroCard;