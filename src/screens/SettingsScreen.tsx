import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RetroComponents, RetroMeasurements } from '../styles/RetroComponents';
import { RetroTypography } from '../styles/RetroTypography';
import { RetroColors } from '../styles/RetroColors';
import { testDatabaseFunctions, clearTestData } from '../services/database/test-database';

interface SettingItem {
  id: string;
  label: string;
  type: 'toggle' | 'button' | 'info';
  value?: boolean;
  onPress?: () => void;
}

export default function SettingsScreen() {
  const [autoBackup, setAutoBackup] = useState(true);
  const [gpsTagging, setGpsTagging] = useState(true);
  const [highResPhotos, setHighResPhotos] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);

  const renderSettingItem = (item: SettingItem) => {
    switch (item.type) {
      case 'toggle':
        return (
          <View style={[RetroComponents.listItem, { justifyContent: 'space-between' }]}>
            <Text style={RetroTypography.body}>{item.label}</Text>
            <Switch
              value={item.value}
              onValueChange={item.onPress}
              trackColor={{ false: RetroColors.lightAccent, true: RetroColors.primary }}
              thumbColor={item.value ? RetroColors.textPrimary : RetroColors.textSecondary}
              style={{ transform: [{ scale: 1.2 }] }}
            />
          </View>
        );
      case 'button':
        return (
          <TouchableOpacity style={RetroComponents.listItem} onPress={item.onPress}>
            <Text style={RetroTypography.body}>{item.label}</Text>
            <Text style={[RetroTypography.caption, { color: RetroColors.primary }]}>{'>'}</Text>
          </TouchableOpacity>
        );
      case 'info':
        return (
          <View style={RetroComponents.listItem}>
            <Text style={RetroTypography.body}>{item.label}</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={RetroComponents.container}>
      <ScrollView contentContainerStyle={RetroComponents.scrollContainer}>
        <Text style={[RetroTypography.heading1, { marginBottom: RetroMeasurements.spacing.xl }]}>
          SETTINGS
        </Text>

        {/* Camera Settings */}
        <View style={RetroComponents.terminalPanel}>
          <Text style={[RetroTypography.label, { marginBottom: RetroMeasurements.spacing.md }]}>
            CAMERA SETTINGS
          </Text>
          {renderSettingItem({
            id: 'gps',
            label: 'GPS Tagging',
            type: 'toggle',
            value: gpsTagging,
            onPress: () => setGpsTagging(!gpsTagging)
          })}
          {renderSettingItem({
            id: 'highres',
            label: 'High Resolution Photos',
            type: 'toggle',
            value: highResPhotos,
            onPress: () => setHighResPhotos(!highResPhotos)
          })}
          {renderSettingItem({
            id: 'grid',
            label: 'Grid Overlay Settings',
            type: 'button',
            onPress: () => console.log('Grid settings')
          })}
        </View>

        {/* Data & Storage */}
        <View style={[RetroComponents.card, { marginTop: RetroMeasurements.spacing.lg }]}>
          <Text style={[RetroTypography.label, { marginBottom: RetroMeasurements.spacing.md }]}>
            DATA & STORAGE
          </Text>
          {renderSettingItem({
            id: 'backup',
            label: 'Auto Backup',
            type: 'toggle',
            value: autoBackup,
            onPress: () => setAutoBackup(!autoBackup)
          })}
          {renderSettingItem({
            id: 'storage',
            label: 'Storage Used: 2.4 GB',
            type: 'info'
          })}
          {renderSettingItem({
            id: 'clear',
            label: 'Clear Cache',
            type: 'button',
            onPress: () => console.log('Clear cache')
          })}
        </View>

        {/* App Settings */}
        <View style={[RetroComponents.card, { marginTop: RetroMeasurements.spacing.lg }]}>
          <Text style={[RetroTypography.label, { marginBottom: RetroMeasurements.spacing.md }]}>
            APP SETTINGS
          </Text>
          {renderSettingItem({
            id: 'sound',
            label: 'Sound Effects',
            type: 'toggle',
            value: soundEffects,
            onPress: () => setSoundEffects(!soundEffects)
          })}
          {renderSettingItem({
            id: 'export',
            label: 'Export Data',
            type: 'button',
            onPress: () => console.log('Export data')
          })}
          {renderSettingItem({
            id: 'about',
            label: 'About',
            type: 'button',
            onPress: () => console.log('About')
          })}
        </View>

        {/* Developer Options - Temporary for testing */}
        <View style={[RetroComponents.card, { marginTop: RetroMeasurements.spacing.lg }]}>
          <Text style={[RetroTypography.label, { marginBottom: RetroMeasurements.spacing.md }]}>
            DEVELOPER OPTIONS
          </Text>
          {renderSettingItem({
            id: 'testdb',
            label: 'Test Database Functions',
            type: 'button',
            onPress: async () => {
              try {
                await testDatabaseFunctions();
                Alert.alert('Success', 'Database tests completed. Check console for details.');
              } catch (error) {
                Alert.alert('Error', 'Database test failed. Check console for details.');
              }
            }
          })}
          {renderSettingItem({
            id: 'cleartest',
            label: 'Clear Test Data',
            type: 'button',
            onPress: async () => {
              try {
                await clearTestData();
                Alert.alert('Success', 'Test data cleared.');
              } catch (error) {
                Alert.alert('Error', 'Failed to clear test data.');
              }
            }
          })}
        </View>

        {/* Version Info */}
        <View style={{ marginTop: RetroMeasurements.spacing.xl, alignItems: 'center' }}>
          <Text style={[RetroTypography.caption, { color: RetroColors.textMuted }]}>
            CONSTRUCTPRO RETRO v1.0.0
          </Text>
          <Text style={[RetroTypography.small, { color: RetroColors.primary, marginTop: RetroMeasurements.spacing.xs }]}>
            CRT TERMINAL EDITION
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}