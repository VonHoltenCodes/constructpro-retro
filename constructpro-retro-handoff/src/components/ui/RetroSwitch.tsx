/**
 * RetroSwitch - Toggle switches with glow
 * Glove-friendly toggle with retro styling
 */

import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { RetroColors, ColorUtils } from '../../styles/RetroColors';
import { RetroTypography } from '../../styles/RetroTypography';
import { RetroMeasurements } from '../../styles/RetroComponents';

export type SwitchSize = 'small' | 'medium' | 'large';

export interface RetroSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: SwitchSize;
  label?: string;
  labelPosition?: 'left' | 'right';
  onColor?: string;
  offColor?: string;
  thumbColor?: string;
  showState?: boolean;
  glowIntensity?: number;
}

const sizeStyles: Record<SwitchSize, {
  width: number;
  height: number;
  thumbSize: number;
  fontSize: number;
}> = {
  small: {
    width: 40,
    height: 24,
    thumbSize: 18,
    fontSize: 12,
  },
  medium: {
    width: 56,
    height: 32,
    thumbSize: 26,
    fontSize: 14,
  },
  large: {
    width: 72,
    height: 40,
    thumbSize: 34,
    fontSize: 16,
  },
};

export const RetroSwitch: React.FC<RetroSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = 'medium',
  label,
  labelPosition = 'left',
  onColor = RetroColors.primary,
  offColor = RetroColors.lightAccent,
  thumbColor = RetroColors.textPrimary,
  showState = false,
  glowIntensity = 0.6,
}) => {
  const translateX = useRef(new Animated.Value(value ? 1 : 0)).current;
  const glowAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const sizeStyle = sizeStyles[size];
  const thumbOffset = sizeStyle.width - sizeStyle.thumbSize - 4;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: value ? 1 : 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [value]);

  const handlePress = () => {
    if (!disabled) {
      // Animate press
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      onValueChange(!value);
    }
  };

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: disabled ? 0.5 : 1,
  };

  const switchContainerStyle: Animated.AnimatedProps<ViewStyle> = {
    width: sizeStyle.width,
    height: sizeStyle.height,
    borderRadius: sizeStyle.height / 2,
    backgroundColor: RetroColors.darkAccent,
    borderWidth: RetroMeasurements.borderWidth.normal,
    borderColor: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [offColor, onColor],
    }),
    padding: 2,
    transform: [{ scale: scaleAnim }],
  };

  const trackStyle: ViewStyle = {
    flex: 1,
    borderRadius: sizeStyle.height / 2,
    backgroundColor: RetroColors.darkBg,
  };

  const thumbStyle: Animated.AnimatedProps<ViewStyle> = {
    width: sizeStyle.thumbSize,
    height: sizeStyle.thumbSize,
    borderRadius: sizeStyle.thumbSize / 2,
    backgroundColor: thumbColor,
    borderWidth: RetroMeasurements.borderWidth.normal,
    borderColor: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [offColor, onColor],
    }),
    position: 'absolute',
    top: (sizeStyle.height - sizeStyle.thumbSize) / 2,
    transform: [
      {
        translateX: translateX.interpolate({
          inputRange: [0, 1],
          outputRange: [2, thumbOffset],
        }),
      },
    ],
  };

  const labelStyle: TextStyle = {
    ...RetroTypography.body,
    fontSize: sizeStyle.fontSize,
    color: RetroColors.textPrimary,
    marginHorizontal: RetroMeasurements.spacing.sm,
  };

  const stateTextStyle: TextStyle = {
    ...RetroTypography.mono,
    fontSize: sizeStyle.fontSize - 2,
    color: value ? onColor : RetroColors.textMuted,
    marginLeft: RetroMeasurements.spacing.xs,
  };

  const animatedGlow = {
    shadowColor: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [offColor, onColor],
    }),
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.8],
    }),
    shadowRadius: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 10 * glowIntensity],
    }),
    elevation: 5,
  };

  const renderSwitch = () => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled}
    >
      <Animated.View style={[switchContainerStyle, animatedGlow]}>
        <View style={trackStyle}>
          {/* Track gradient effect */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: sizeStyle.height / 2,
              backgroundColor: onColor,
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.2],
              }),
            }}
          />
        </View>
        <Animated.View
          style={[
            thumbStyle,
            value && ColorUtils.phosphorGlow(onColor, glowIntensity * 0.8),
          ]}
        >
          {/* Thumb inner glow */}
          <View
            style={{
              position: 'absolute',
              top: '25%',
              left: '25%',
              width: '50%',
              height: '50%',
              borderRadius: sizeStyle.thumbSize / 4,
              backgroundColor: value ? onColor : offColor,
              opacity: 0.6,
            }}
          />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <View style={containerStyle}>
      {label && labelPosition === 'left' && (
        <Text style={labelStyle}>{label}</Text>
      )}
      {renderSwitch()}
      {label && labelPosition === 'right' && (
        <Text style={labelStyle}>{label}</Text>
      )}
      {showState && (
        <Text style={stateTextStyle}>{value ? 'ON' : 'OFF'}</Text>
      )}
    </View>
  );
};

export default RetroSwitch;