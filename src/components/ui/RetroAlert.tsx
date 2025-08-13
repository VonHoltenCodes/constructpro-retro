/**
 * RetroAlert - Modal alerts with terminal styling
 * CRT-style alert dialogs with retro animations
 */

import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  ViewStyle,
  TextStyle,
  TouchableWithoutFeedback,
} from 'react-native';
import { RetroColors, ColorUtils } from '../../styles/RetroColors';
import { RetroTypography } from '../../styles/RetroTypography';
import { RetroMeasurements } from '../../styles/RetroComponents';
import { RetroButton } from './RetroButton';

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface AlertAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface RetroAlertProps {
  visible: boolean;
  type?: AlertType;
  title: string;
  message: string;
  actions?: AlertAction[];
  onClose?: () => void;
  closeOnBackdrop?: boolean;
  animated?: boolean;
  showIcon?: boolean;
  customIcon?: React.ReactNode;
}

const typeStyles: Record<AlertType, {
  color: string;
  icon: string;
  defaultAction: string;
}> = {
  success: {
    color: RetroColors.success,
    icon: '✓',
    defaultAction: 'OK',
  },
  error: {
    color: RetroColors.error,
    icon: '✕',
    defaultAction: 'DISMISS',
  },
  warning: {
    color: RetroColors.warning,
    icon: '!',
    defaultAction: 'ACKNOWLEDGE',
  },
  info: {
    color: RetroColors.info,
    icon: 'i',
    defaultAction: 'GOT IT',
  },
  confirm: {
    color: RetroColors.primary,
    icon: '?',
    defaultAction: 'CONFIRM',
  },
};

export const RetroAlert: React.FC<RetroAlertProps> = ({
  visible,
  type = 'info',
  title,
  message,
  actions,
  onClose,
  closeOnBackdrop = true,
  animated = true,
  showIcon = true,
  customIcon,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const typeStyle = typeStyles[type];

  useEffect(() => {
    if (visible && animated) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else if (!visible && animated) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, animated]);

  const defaultActions: AlertAction[] = actions || [
    {
      label: typeStyle.defaultAction,
      onPress: () => onClose?.(),
      variant: type === 'error' ? 'danger' : 'primary',
    },
  ];

  const backdropStyle: Animated.AnimatedProps<ViewStyle> = {
    flex: 1,
    backgroundColor: 'rgba(12, 12, 12, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: RetroMeasurements.spacing.lg,
    opacity: animated ? fadeAnim : 1,
  };

  const alertStyle: Animated.AnimatedProps<ViewStyle> = {
    backgroundColor: RetroColors.darkAccent,
    borderWidth: RetroMeasurements.borderWidth.thick,
    borderColor: typeStyle.color,
    borderRadius: RetroMeasurements.borderRadius.md,
    padding: RetroMeasurements.spacing.lg,
    maxWidth: 400,
    width: '100%',
    transform: animated ? [{ scale: scaleAnim }] : [],
    ...ColorUtils.phosphorGlow(typeStyle.color, 0.8),
  };

  const headerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: RetroMeasurements.spacing.md,
  };

  const iconContainerStyle: ViewStyle = {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: RetroMeasurements.borderWidth.normal,
    borderColor: typeStyle.color,
    backgroundColor: ColorUtils.withOpacity(typeStyle.color, 0.1),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: RetroMeasurements.spacing.md,
    ...ColorUtils.phosphorGlow(typeStyle.color, 0.6),
  };

  const iconStyle: TextStyle = {
    ...RetroTypography.h3,
    color: typeStyle.color,
    fontSize: 24,
  };

  const titleStyle: TextStyle = {
    ...RetroTypography.h3,
    color: RetroColors.textPrimary,
    flex: 1,
  };

  const messageStyle: TextStyle = {
    ...RetroTypography.body,
    color: RetroColors.textSecondary,
    marginBottom: RetroMeasurements.spacing.lg,
    lineHeight: 22,
  };

  const actionsStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: RetroMeasurements.spacing.sm,
  };

  const renderScanlines = () => (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        pointerEvents: 'none',
      }}
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <View
          key={i}
          style={{
            height: 2,
            backgroundColor: RetroColors.primary,
            marginBottom: 2,
          }}
        />
      ))}
    </View>
  );

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback
        onPress={closeOnBackdrop ? onClose : undefined}
      >
        <Animated.View style={backdropStyle}>
          <TouchableWithoutFeedback>
            <Animated.View style={alertStyle}>
              {renderScanlines()}
              <View style={headerStyle}>
                {showIcon && (
                  <View style={iconContainerStyle}>
                    {customIcon || (
                      <Text style={iconStyle}>{typeStyle.icon}</Text>
                    )}
                  </View>
                )}
                <Text style={titleStyle}>{title}</Text>
              </View>
              <Text style={messageStyle}>{message}</Text>
              <View style={actionsStyle}>
                {defaultActions.map((action, index) => (
                  <RetroButton
                    key={index}
                    label={action.label}
                    onPress={action.onPress}
                    variant={action.variant || 'primary'}
                    size="small"
                  />
                ))}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default RetroAlert;