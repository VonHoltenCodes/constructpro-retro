import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RetroColors, RetroTypography } from '../../styles';

interface LocationAccuracyIndicatorProps {
  accuracy: number; // in meters
}

export default function LocationAccuracyIndicator({ accuracy }: LocationAccuracyIndicatorProps) {
  const getAccuracyLevel = () => {
    if (accuracy <= 5) return { level: 'Excellent', color: RetroColors.success };
    if (accuracy <= 10) return { level: 'Good', color: RetroColors.primary };
    if (accuracy <= 25) return { level: 'Fair', color: RetroColors.warning };
    if (accuracy <= 50) return { level: 'Poor', color: RetroColors.error };
    return { level: 'Very Poor', color: RetroColors.textDim };
  };

  const { level, color } = getAccuracyLevel();
  const barWidth = Math.max(10, Math.min(100, 100 - (accuracy / 100) * 100));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[RetroTypography.smallText, { color: RetroColors.textDim }]}>
          GPS Accuracy
        </Text>
        <Text style={[RetroTypography.monoText, { color }]}>
          ±{accuracy.toFixed(0)}m
        </Text>
      </View>
      
      <View style={styles.barContainer}>
        <View style={[styles.barBackground, { borderColor: color }]}>
          <View 
            style={[
              styles.barFill, 
              { 
                width: `${barWidth}%`, 
                backgroundColor: color 
              }
            ]} 
          />
        </View>
      </View>
      
      <Text style={[RetroTypography.smallText, { color, textAlign: 'center' }]}>
        {level}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  barContainer: {
    marginVertical: 5,
  },
  barBackground: {
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    backgroundColor: RetroColors.backgroundDark,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
});