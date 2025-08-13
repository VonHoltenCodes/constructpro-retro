/**
 * RetroLoading - CRT scanline loading animation
 * Retro-styled loading indicators with various animations
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';
import { RetroColors, ColorUtils } from '../../styles/RetroColors';
import { RetroTypography } from '../../styles/RetroTypography';
import { RetroMeasurements } from '../../styles/RetroComponents';

export type LoadingVariant = 'scanlines' | 'pulse' | 'dots' | 'terminal' | 'static';
export type LoadingSize = 'small' | 'medium' | 'large';

export interface RetroLoadingProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  color?: string;
  text?: string;
  showText?: boolean;
  fullScreen?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

const sizeStyles: Record<LoadingSize, { size: number; fontSize: number }> = {
  small: {
    size: 40,
    fontSize: 12,
  },
  medium: {
    size: 80,
    fontSize: 14,
  },
  large: {
    size: 120,
    fontSize: 16,
  },
};

export const RetroLoading: React.FC<RetroLoadingProps> = ({
  variant = 'scanlines',
  size = 'medium',
  color = RetroColors.primary,
  text = 'LOADING',
  showText = true,
  fullScreen = false,
}) => {
  const scanlineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dotsAnim = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const terminalAnim = useRef(new Animated.Value(0)).current;
  const staticAnim = useRef(new Animated.Value(0)).current;

  const sizeStyle = sizeStyles[size];

  useEffect(() => {
    let animation: Animated.CompositeAnimation;

    switch (variant) {
      case 'scanlines':
        animation = Animated.loop(
          Animated.timing(scanlineAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          })
        );
        break;

      case 'pulse':
        animation = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.3,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'dots':
        animation = Animated.loop(
          Animated.stagger(200, [
            ...dotsAnim.map(anim =>
              Animated.sequence([
                Animated.timing(anim, {
                  toValue: 1,
                  duration: 400,
                  useNativeDriver: true,
                }),
                Animated.timing(anim, {
                  toValue: 0,
                  duration: 400,
                  useNativeDriver: true,
                }),
              ])
            ),
          ])
        );
        break;

      case 'terminal':
        animation = Animated.loop(
          Animated.sequence([
            Animated.timing(terminalAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(terminalAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'static':
        animation = Animated.loop(
          Animated.timing(staticAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          })
        );
        break;
    }

    animation.start();

    return () => {
      animation.stop();
    };
  }, [variant]);

  const containerStyle: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    ...(fullScreen && {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: RetroColors.darkBg,
      zIndex: 1000,
    }),
  };

  const loadingStyle: ViewStyle = {
    width: sizeStyle.size,
    height: sizeStyle.size,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const textStyle: TextStyle = {
    ...RetroTypography.mono,
    fontSize: sizeStyle.fontSize,
    color,
    marginTop: RetroMeasurements.spacing.md,
    letterSpacing: 2,
  };

  const renderScanlines = () => (
    <View style={loadingStyle}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            width: '100%',
            height: 2,
            backgroundColor: color,
            top: i * (sizeStyle.size / 8),
            opacity: scanlineAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.2, 1, 0.2],
            }),
            transform: [
              {
                translateY: scanlineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, sizeStyle.size / 8],
                }),
              },
            ],
          }}
        />
      ))}
      <View
        style={{
          width: sizeStyle.size,
          height: sizeStyle.size,
          borderWidth: RetroMeasurements.borderWidth.normal,
          borderColor: color,
          borderRadius: RetroMeasurements.borderRadius.md,
          ...ColorUtils.phosphorGlow(color, 0.6),
        }}
      />
    </View>
  );

  const renderPulse = () => (
    <Animated.View
      style={[
        loadingStyle,
        {
          borderWidth: RetroMeasurements.borderWidth.thick,
          borderColor: color,
          borderRadius: sizeStyle.size / 2,
          transform: [{ scale: pulseAnim }],
          opacity: pulseAnim.interpolate({
            inputRange: [1, 1.3],
            outputRange: [1, 0.6],
          }),
          ...ColorUtils.phosphorGlow(color, 0.8),
        },
      ]}
    />
  );

  const renderDots = () => (
    <View style={[loadingStyle, { flexDirection: 'row', gap: sizeStyle.size / 8 }]}>
      {dotsAnim.map((anim, i) => (
        <Animated.View
          key={i}
          style={{
            width: sizeStyle.size / 4,
            height: sizeStyle.size / 4,
            borderRadius: sizeStyle.size / 8,
            backgroundColor: color,
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.2],
                }),
              },
            ],
            opacity: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
            ...ColorUtils.phosphorGlow(color, 0.6),
          }}
        />
      ))}
    </View>
  );

  const renderTerminal = () => (
    <View style={loadingStyle}>
      <Text
        style={{
          ...RetroTypography.mono,
          fontSize: sizeStyle.fontSize,
          color,
        }}
      >
        {text}
        <Animated.View
          style={{
            width: 2,
            height: sizeStyle.fontSize,
            backgroundColor: color,
            marginLeft: 2,
            opacity: terminalAnim,
          }}
        />
      </Text>
    </View>
  );

  const renderStatic = () => (
    <View style={loadingStyle}>
      {Array.from({ length: 50 }).map((_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            width: Math.random() * 4,
            height: Math.random() * 4,
            backgroundColor: color,
            left: Math.random() * sizeStyle.size,
            top: Math.random() * sizeStyle.size,
            opacity: Math.random() * 0.8,
          }}
        />
      ))}
      <View
        style={{
          width: sizeStyle.size,
          height: sizeStyle.size,
          borderWidth: RetroMeasurements.borderWidth.normal,
          borderColor: color,
          borderRadius: RetroMeasurements.borderRadius.md,
          ...ColorUtils.phosphorGlow(color, 0.4),
        }}
      />
    </View>
  );

  const renderLoading = () => {
    switch (variant) {
      case 'scanlines':
        return renderScanlines();
      case 'pulse':
        return renderPulse();
      case 'dots':
        return renderDots();
      case 'terminal':
        return renderTerminal();
      case 'static':
        return renderStatic();
      default:
        return renderScanlines();
    }
  };

  return (
    <View style={containerStyle}>
      {renderLoading()}
      {showText && variant !== 'terminal' && (
        <Animated.Text
          style={[
            textStyle,
            variant === 'pulse' && {
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.3],
                outputRange: [0.8, 1],
              }),
            },
          ]}
        >
          {text}
        </Animated.Text>
      )}
    </View>
  );
};

export default RetroLoading;