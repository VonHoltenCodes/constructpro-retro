import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from './types';
import RetroTabBar from './components/RetroTabBar';

// Stack Navigators
import DashboardStack from './stacks/DashboardStack';
import ProjectsStack from './stacks/ProjectsStack';
import CameraStack from './stacks/CameraStack';
import GalleryStack from './stacks/GalleryStack';
import SettingsStack from './stacks/SettingsStack';

// Theme
import { RetroColors } from '../styles/RetroColors';

const Tab = createBottomTabNavigator<RootTabParamList>();

// Navigation theme for retro CRT look
const RetroNavigationTheme = {
  dark: true,
  colors: {
    primary: RetroColors.primary,
    background: RetroColors.darkBg,
    card: RetroColors.darkAccent,
    text: RetroColors.textPrimary,
    border: RetroColors.lightAccent,
    notification: RetroColors.error,
  },
};

export default function RootNavigator() {
  return (
    <NavigationContainer theme={RetroNavigationTheme}>
      <Tab.Navigator
        tabBar={(props) => <RetroTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardStack}
          options={{
            tabBarLabel: 'Dashboard',
          }}
        />
        <Tab.Screen 
          name="Projects" 
          component={ProjectsStack}
          options={{
            tabBarLabel: 'Projects',
          }}
        />
        <Tab.Screen 
          name="Camera" 
          component={CameraStack}
          options={{
            tabBarLabel: 'Camera',
          }}
        />
        <Tab.Screen 
          name="Gallery" 
          component={GalleryStack}
          options={{
            tabBarLabel: 'Gallery',
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsStack}
          options={{
            tabBarLabel: 'Settings',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}