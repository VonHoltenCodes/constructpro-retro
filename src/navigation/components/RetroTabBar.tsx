import React from 'react';
import { View, TouchableOpacity, Text, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RetroComponents, RetroMeasurements } from '../../styles/RetroComponents';
import { RetroTypography } from '../../styles/RetroTypography';
import { RetroColors, ColorUtils } from '../../styles/RetroColors';

// Tab Icons - Using text characters for retro feel
const getTabIcon = (routeName: string, focused: boolean) => {
  const iconMap: { [key: string]: string } = {
    Dashboard: '⌂',
    Projects: '☰',
    Camera: '◉',
    Gallery: '◫',
    Settings: '⚙',
  };
  
  return iconMap[routeName] || '?';
};

export default function RetroTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      RetroComponents.tabBar,
      { 
        paddingBottom: insets.bottom || RetroMeasurements.spacing.sm,
        backgroundColor: RetroColors.darkBg,
        borderTopWidth: RetroMeasurements.borderWidth.thick,
        borderTopColor: RetroColors.primary,
        ...ColorUtils.phosphorGlow(RetroColors.primary, 0.5)
      }
    ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const icon = getTabIcon(route.name, isFocused);
        const color = isFocused ? RetroColors.primary : RetroColors.textMuted;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              RetroComponents.tabItem,
              isFocused && {
                borderTopWidth: RetroMeasurements.borderWidth.thick,
                borderTopColor: RetroColors.primary,
                marginTop: -RetroMeasurements.borderWidth.thick,
              }
            ]}
          >
            <Text style={[
              RetroTypography.heading2,
              { 
                color,
                fontSize: 24,
                marginBottom: RetroMeasurements.spacing.xs,
                textShadowColor: isFocused ? RetroColors.primary : 'transparent',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: isFocused ? 10 : 0,
              }
            ]}>
              {icon}
            </Text>
            <Text style={[
              RetroTypography.caption,
              { 
                color,
                letterSpacing: isFocused ? 2 : 1,
                textTransform: 'uppercase'
              }
            ]}>
              {label as string}
            </Text>
            {isFocused && (
              <View
                style={{
                  position: 'absolute',
                  bottom: -RetroMeasurements.spacing.xs,
                  width: 4,
                  height: 4,
                  backgroundColor: RetroColors.primary,
                  borderRadius: 2,
                  ...ColorUtils.phosphorGlow(RetroColors.primary, 1.0)
                }}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}