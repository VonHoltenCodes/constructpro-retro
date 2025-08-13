/**
 * RetroProgress - Progress bars with retro animations
 * CRT-style visual effects and animations
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { RetroColors, ColorUtils } from '../../styles/RetroColors';
import { RetroTypography } from '../../styles/RetroTypography';
import { RetroMeasurements } from '../../styles/RetroComponents';

export type ProgressVariant = 'default' | 'striped' | 'pulsing' | 'segmented';
export type ProgressSize = 'small' | 'medium' | 'large';

export interface RetroProgressProps {
  value: number; // 0-100
  variant?: ProgressVariant;
  size?: ProgressSize;
  color?: string;
  showLabel?: boolean;
  labelPosition?: 'top' | 'center' | 'bottom';
  animated?: boolean;
  segments?: number; // For segmented variant
  glowIntensity?: number;
}

const sizeStyles: Record<ProgressSize, { height: number; fontSize: number }> = {
  small: {
    height: 8,
    fontSize: 12,
  },
  medium: {
    height: 16,
    fontSize: 14,
  },
  large: {
    height: 24,
    fontSize: 16,
  },
};

export const RetroProgress: React.FC<RetroProgressProps> = ({
  value,
  variant = 'default',
  size = 'medium',
  color = RetroColors.primary,
  showLabel = false,
  labelPosition = 'center',
  animated = true,
  segments = 10,
  glowIntensity = 0.6,
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const stripeAnim = useRef(new Animated.Value(0)).current;

  const sizeStyle = sizeStyles[size];
  const clampedValue = Math.max(0, Math.min(100, value));

  useEffect(() => {
    if (animated) {
      Animated.timing(progressAnim, {
        toValue: clampedValue,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } else {
      progressAnim.setValue(clampedValue);
    }
  }, [clampedValue, animated]);

  useEffect(() => {
    if (variant === 'pulsing' && animated) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    if (variant === 'striped' && animated) {
      Animated.loop(
        Animated.timing(stripeAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [variant, animated]);

  const containerStyle: ViewStyle = {
    marginVertical: RetroMeasurements.spacing.sm,
  };

  const progressBarStyle: ViewStyle = {
    height: sizeStyle.height,
    backgroundColor: RetroColors.darkAccent,
    borderWidth: RetroMeasurements.borderWidth.thin,
    borderColor: color,
    borderRadius: RetroMeasurements.borderRadius.sm,
    overflow: 'hidden',
    ...ColorUtils.phosphorGlow(color, glowIntensity * 0.3),
  };

  const progressFillStyle: Animated.AnimatedProps<ViewStyle> = {
    height: '100%',
    backgroundColor: color,
    width: progressAnim.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    }),
    transform: variant === 'pulsing' ? [{ scaleY: pulseAnim }] : [],
    ...ColorUtils.phosphorGlow(color, glowIntensity),
  };

  const labelStyle: TextStyle = {
    ...RetroTypography.mono,
    fontSize: sizeStyle.fontSize,
    color: RetroColors.textPrimary,
    textAlign: 'center',
  };

  const renderStripes = () => {
    if (variant !== 'striped') return null;

    return (
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.3,
          transform: [
            {
              translateX: stripeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 20],
              }),
            },
          ],
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: i * 20,
              width: 10,
              backgroundColor: RetroColors.textPrimary,
              transform: [{ skewX: '-45deg' }],
            }}
          />
        ))}
      </Animated.View>
    );
  };

  const renderSegmented = () => {
    if (variant !== 'segmented') return null;

    const filledSegments = Math.floor((clampedValue / 100) * segments);

    return (
      <View
        style={{
          flexDirection: 'row',
          height: sizeStyle.height,
          gap: 2,
        }}
      >
        {Array.from({ length: segments }).map((_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              backgroundColor: i < filledSegments ? color : RetroColors.darkAccent,
              borderWidth: RetroMeasurements.borderWidth.thin,
              borderColor: i < filledSegments ? color : RetroColors.lightAccent,
              borderRadius: RetroMeasurements.borderRadius.sm,
              ...(i < filledSegments && ColorUtils.phosphorGlow(color, glowIntensity * 0.5)),
            }}
          />
        ))}
      </View>
    );
  };

  const renderLabel = () => {
    if (!showLabel) return null;

    const label = (
      <Text style={labelStyle}>
        {Math.round(clampedValue)}%
      </Text>
    );

    if (labelPosition === 'top') {
      return <View style={{ marginBottom: RetroMeasurements.spacing.xs }}>{label}</View>;
    }

    if (labelPosition === 'bottom') {
      return <View style={{ marginTop: RetroMeasurements.spacing.xs }}>{label}</View>;
    }

    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {label}
      </View>
    );
  };

  if (variant === 'segmented') {
    return (
      <View style={containerStyle}>
        {labelPosition === 'top' && renderLabel()}
        {renderSegmented()}
        {labelPosition === 'bottom' && renderLabel()}
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      {labelPosition === 'top' && renderLabel()}
      <View style={progressBarStyle}>
        <Animated.View style={progressFillStyle}>
          {renderStripes()}
        </Animated.View>
        {labelPosition === 'center' && renderLabel()}
      </View>
      {labelPosition === 'bottom' && renderLabel()}
    </View>
  );
};

export default RetroProgress;