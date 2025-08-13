import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';
import { RetroColors } from './src/styles/RetroColors';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={RetroColors.darkBg} />
      <RootNavigator />
    </SafeAreaProvider>
  );
}
