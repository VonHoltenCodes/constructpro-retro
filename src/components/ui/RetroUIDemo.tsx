/**
 * RetroUIDemo - Showcase of all retro UI components
 * This file demonstrates usage of each component
 */

import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  SafeAreaView,
} from 'react-native';
import {
  RetroButton,
  RetroCard,
  RetroInput,
  RetroProgress,
  RetroAlert,
  RetroLoading,
  RetroSwitch,
  RetroChip,
  RetroChipGroup,
  RetroColors,
  RetroMeasurements,
  RetroTypography,
} from './index';

export const RetroUIDemo: React.FC = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [progress, setProgress] = useState(65);
  const [selectedChips, setSelectedChips] = useState<string[]>(['chip2']);

  const toggleChip = (chipId: string) => {
    setSelectedChips(prev =>
      prev.includes(chipId)
        ? prev.filter(id => id !== chipId)
        : [...prev, chipId]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: RetroColors.darkBg }}>
      <ScrollView
        contentContainerStyle={{
          padding: RetroMeasurements.spacing.lg,
        }}
      >
        <Text style={RetroTypography.h1}>RETRO UI COMPONENTS</Text>

        {/* Buttons Section */}
        <RetroCard variant="terminal" margin={RetroMeasurements.spacing.md}>
          <Text style={RetroTypography.h3}>BUTTONS</Text>
          
          <View style={{ gap: RetroMeasurements.spacing.sm, marginTop: RetroMeasurements.spacing.md }}>
            <RetroButton
              label="PRIMARY BUTTON"
              variant="primary"
              onPress={() => console.log('Primary pressed')}
            />
            
            <RetroButton
              label="SECONDARY"
              variant="secondary"
              size="medium"
              onPress={() => console.log('Secondary pressed')}
            />
            
            <RetroButton
              label="DANGER"
              variant="danger"
              size="small"
              onPress={() => console.log('Danger pressed')}
            />
            
            <RetroButton
              label="LOADING..."
              variant="primary"
              loading
            />
            
            <RetroButton
              label="DISABLED"
              variant="primary"
              disabled
              onPress={() => console.log('This won\'t fire')}
            />
          </View>
        </RetroCard>

        {/* Input Section */}
        <RetroCard variant="default" margin={RetroMeasurements.spacing.md}>
          <Text style={RetroTypography.h3}>INPUT FIELDS</Text>
          
          <RetroInput
            label="USERNAME"
            placeholder="Enter username"
            value={inputValue}
            onChangeText={setInputValue}
            variant="default"
          />
          
          <RetroInput
            label="TERMINAL INPUT"
            placeholder="$ Enter command..."
            variant="terminal"
          />
          
          <RetroInput
            label="WITH ERROR"
            placeholder="Invalid input"
            error="This field is required"
          />
          
          <RetroInput
            label="MULTILINE"
            placeholder="Enter description..."
            multiline
            numberOfLines={3}
          />
        </RetroCard>

        {/* Progress Section */}
        <RetroCard variant="photo" margin={RetroMeasurements.spacing.md}>
          <Text style={RetroTypography.h3}>PROGRESS INDICATORS</Text>
          
          <RetroProgress
            value={progress}
            variant="default"
            showLabel
            labelPosition="top"
          />
          
          <RetroProgress
            value={75}
            variant="striped"
            color={RetroColors.success}
            showLabel
          />
          
          <RetroProgress
            value={45}
            variant="pulsing"
            color={RetroColors.warning}
            size="large"
          />
          
          <RetroProgress
            value={85}
            variant="segmented"
            segments={10}
            color={RetroColors.accent}
          />
          
          <RetroButton
            label="UPDATE PROGRESS"
            size="small"
            onPress={() => setProgress(Math.min(100, progress + 10))}
          />
        </RetroCard>

        {/* Loading Section */}
        <RetroCard variant="elevated" margin={RetroMeasurements.spacing.md}>
          <Text style={RetroTypography.h3}>LOADING STATES</Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
            <RetroLoading variant="scanlines" size="small" />
            <RetroLoading variant="pulse" size="small" color={RetroColors.secondary} />
            <RetroLoading variant="dots" size="small" color={RetroColors.warning} />
          </View>
          
          <View style={{ marginTop: 20 }}>
            <RetroLoading variant="terminal" text="PROCESSING" />
          </View>
        </RetroCard>

        {/* Switch Section */}
        <RetroCard variant="default" margin={RetroMeasurements.spacing.md}>
          <Text style={RetroTypography.h3}>SWITCHES</Text>
          
          <View style={{ gap: RetroMeasurements.spacing.md, marginTop: RetroMeasurements.spacing.md }}>
            <RetroSwitch
              value={switchValue}
              onValueChange={setSwitchValue}
              label="Enable Feature"
              showState
            />
            
            <RetroSwitch
              value={true}
              onValueChange={() => {}}
              label="Always On"
              size="large"
              disabled
            />
            
            <RetroSwitch
              value={false}
              onValueChange={() => {}}
              label="Custom Colors"
              onColor={RetroColors.secondary}
              offColor={RetroColors.error}
            />
          </View>
        </RetroCard>

        {/* Chips Section */}
        <RetroCard variant="terminal" margin={RetroMeasurements.spacing.md}>
          <Text style={RetroTypography.h3}>CHIPS & TAGS</Text>
          
          <RetroChipGroup>
            <RetroChip
              label="DEFAULT"
              variant="default"
            />
            
            <RetroChip
              label="SUCCESS"
              variant="success"
              selected={selectedChips.includes('chip1')}
              onPress={() => toggleChip('chip1')}
            />
            
            <RetroChip
              label="WARNING"
              variant="warning"
              selected={selectedChips.includes('chip2')}
              onPress={() => toggleChip('chip2')}
              animated
            />
            
            <RetroChip
              label="ERROR"
              variant="error"
              onDelete={() => console.log('Delete chip')}
            />
            
            <RetroChip
              label="INFO"
              variant="info"
              size="large"
            />
          </RetroChipGroup>
        </RetroCard>

        {/* Alert Demo Button */}
        <RetroButton
          label="SHOW ALERT"
          variant="primary"
          size="large"
          fullWidth
          onPress={() => setAlertVisible(true)}
          style={{ marginTop: RetroMeasurements.spacing.xl }}
        />

        {/* Alert Component */}
        <RetroAlert
          visible={alertVisible}
          type="success"
          title="OPERATION COMPLETE"
          message="Your construction project photos have been successfully uploaded to the database. All EXIF data has been preserved."
          actions={[
            {
              label: 'CANCEL',
              onPress: () => setAlertVisible(false),
              variant: 'secondary',
            },
            {
              label: 'CONFIRM',
              onPress: () => setAlertVisible(false),
              variant: 'primary',
            },
          ]}
          onClose={() => setAlertVisible(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default RetroUIDemo;