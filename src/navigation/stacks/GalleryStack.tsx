import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import GalleryScreen from '../../screens/GalleryScreen';
import { GalleryStackParamList } from '../types';
import { RetroColors } from '../../styles/RetroColors';
import { RetroTypography } from '../../styles/RetroTypography';
import { RetroMeasurements } from '../../styles/RetroComponents';

const Stack = createStackNavigator<GalleryStackParamList>();

export default function GalleryStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: RetroColors.darkBg,
          borderBottomWidth: RetroMeasurements.borderWidth.normal,
          borderBottomColor: RetroColors.primary,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
        },
        headerTintColor: RetroColors.primary,
        headerTitleStyle: {
          ...RetroTypography.heading2,
          color: RetroColors.primary,
          letterSpacing: 2,
        },
        headerTitleAlign: 'center',
        cardStyle: {
          backgroundColor: RetroColors.darkBg,
        },
      }}
    >
      <Stack.Screen 
        name="GalleryGrid" 
        component={GalleryScreen}
        options={{
          title: 'GALLERY',
        }}
      />
    </Stack.Navigator>
  );
}