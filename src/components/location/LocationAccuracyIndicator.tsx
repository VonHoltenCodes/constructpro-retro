import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { RetroColors, RetroTypography } from '../../styles';
import { ColorUtils } from '../../styles/RetroColors';
import { LocationService } from './LocationService';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';

interface LocationAccuracyIndicatorProps {
  accuracy?: number; // in meters (optional for live mode)
  showLive?: boolean; // if true, will auto-update location
  compact?: boolean; // compact display mode
  onLocationUpdate?: (location: any) => void;
}

export default function LocationAccuracyIndicator({ 
  accuracy: providedAccuracy,
  showLive = false,
  compact = false,
  onLocationUpdate 
}: LocationAccuracyIndicatorProps) {
  const [liveAccuracy, setLiveAccuracy] = useState<number | null>(null);
  const [location, setLocation] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const pulseAnim = new Animated.Value(1);

  const accuracy = providedAccuracy || liveAccuracy;

  useEffect(() => {
    if (showLive) {
      updateLocation();
      const interval = setInterval(updateLocation, 3000);
      return () => clearInterval(interval);
    }
  }, [showLive]);

  useEffect(() => {
    if (isUpdating) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.7, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isUpdating]);

  const updateLocation = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        setIsUpdating(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 1,
      });

      const newAccuracy = currentLocation.coords.accuracy;
      setLiveAccuracy(newAccuracy);
      setLocation(currentLocation);
      setLastUpdate(new Date());
      
      if (newAccuracy && newAccuracy <= 3) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (newAccuracy && newAccuracy <= 8) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      if (onLocationUpdate) {
        onLocationUpdate(currentLocation);
      }
    } catch (error) {
      console.error('Error updating location:', error);
      setLiveAccuracy(null);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setIsUpdating(false);
  };

  const getAccuracyLevel = () => {
    if (!accuracy) return { level: 'NO GPS', color: RetroColors.textMuted, bars: 0 };
    if (accuracy <= 3) return { level: 'PRECISION', color: RetroColors.success, bars: 4 };
    if (accuracy <= 8) return { level: 'EXCELLENT', color: RetroColors.primary, bars: 3 };
    if (accuracy <= 15) return { level: 'GOOD', color: RetroColors.warning, bars: 2 };
    if (accuracy <= 30) return { level: 'FAIR', color: RetroColors.error, bars: 1 };
    return { level: 'POOR', color: RetroColors.textDim, bars: 0 };
  };

  const { level, color, bars } = getAccuracyLevel();

  if (compact) {
    return (
      <TouchableOpacity 
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 6,
          borderRadius: 4,
          backgroundColor: `${RetroColors.darkAccent}CC`,
          borderWidth: 1,
          borderColor: color,
          ...ColorUtils.phosphorGlow(color, 0.3)
        }}
        onPress={showLive ? updateLocation : undefined}
        disabled={isUpdating}
      >
        <Animated.View style={{
          transform: [{ scale: pulseAnim }],
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: color,
          marginRight: 6,
          ...ColorUtils.phosphorGlow(color, 0.8)
        }} />
        
        <Text style={[
          RetroTypography.caption,
          { 
            color,
            fontSize: 9,
            fontWeight: 'bold'
          }
        ]}>
          {accuracy ? `±${Math.round(accuracy)}M` : 'GPS'}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={{
        padding: 12,
        borderRadius: 6,
        backgroundColor: RetroColors.darkAccent,
        borderWidth: 1,
        borderColor: color,
        ...ColorUtils.phosphorGlow(color, 0.3)
      }}
      onPress={showLive ? updateLocation : undefined}
      disabled={isUpdating}
    >
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <Text style={[RetroTypography.caption, { color: RetroColors.textSecondary, fontSize: 10 }]}>
          GPS ACCURACY
        </Text>
        <Text style={[RetroTypography.mono, { color, fontSize: 12, fontWeight: 'bold' }]}>
          {accuracy ? `±${accuracy.toFixed(0)}M` : 'NO SIGNAL'}
        </Text>
      </View>
      
      {/* Signal strength bars */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 16,
        marginBottom: 8,
      }}>
        {[...Array(4)].map((_, i) => (
          <View
            key={i}
            style={{
              width: 12,
              height: (i + 1) * 4,
              backgroundColor: i < bars ? color : `${color}33`,
              borderRadius: 2,
              ...ColorUtils.phosphorGlow(i < bars ? color : 'transparent', 0.5)
            }}
          />
        ))}
      </View>
      
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Text style={[RetroTypography.caption, { color, fontSize: 10, fontWeight: 'bold' }]}>
          {level}
        </Text>
        
        {isUpdating && (
          <Animated.Text style={[
            RetroTypography.caption,
            { 
              color: RetroColors.primary,
              fontSize: 8,
              transform: [{ scale: pulseAnim }]
            }
          ]}>
            UPDATING...
          </Animated.Text>
        )}
        
        {lastUpdate && !isUpdating && (
          <Text style={[
            RetroTypography.caption,
            { 
              color: RetroColors.textMuted,
              fontSize: 8
            }
          ]}>
            {lastUpdate.toLocaleTimeString()}
          </Text>
        )}
      </View>
      
      {location && (
        <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: `${color}33` }}>
          <Text style={[
            RetroTypography.mono,
            { 
              color: RetroColors.primary,
              fontSize: 9,
              opacity: 0.8
            }
          ]}>
            LAT: {location.coords.latitude.toFixed(6)}
          </Text>
          <Text style={[
            RetroTypography.mono,
            { 
              color: RetroColors.primary,
              fontSize: 9,
              opacity: 0.8
            }
          ]}>
            LON: {location.coords.longitude.toFixed(6)}
          </Text>
          {location.coords.altitude && (
            <Text style={[
              RetroTypography.mono,
              { 
                color: RetroColors.secondary,
                fontSize: 9,
                opacity: 0.6
              }
            ]}>
              ALT: {Math.round(location.coords.altitude)}m
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}