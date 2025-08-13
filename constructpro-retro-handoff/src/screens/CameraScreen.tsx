import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RetroComponents, RetroMeasurements } from '../styles/RetroComponents';
import { RetroTypography } from '../styles/RetroTypography';
import { RetroColors, ColorUtils } from '../styles/RetroColors';
import { cameraService } from '../services/camera';
import * as Haptics from 'expo-haptics';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const [photoCount, setPhotoCount] = useState(0);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const cameraGranted = await cameraService.requestCameraPermission();
      setHasPermission(cameraGranted);
      
      const locationGranted = await cameraService.requestLocationPermission();
      setHasLocationPermission(locationGranted);
      
      // Get count of temp photos
      const tempPhotos = await cameraService.getTempPhotos();
      setPhotoCount(tempPhotos.length);
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      
      // Haptic feedback on capture
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      
      try {
        const photoData = await cameraService.capturePhoto(cameraRef.current);
        
        if (photoData) {
          // Update photo count
          setPhotoCount(count => count + 1);
          
          // Success haptic
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          
          const locationInfo = photoData.location 
            ? `\nLat: ${photoData.location.latitude.toFixed(6)}\nLon: ${photoData.location.longitude.toFixed(6)}`
            : '\nNo location data';
          
          Alert.alert(
            'PHOTO CAPTURED', 
            `Photo saved to temporary storage${locationInfo}\n\nAssign to project later`,
            [{ text: 'OK', style: 'default' }]
          );
        } else {
          throw new Error('Failed to capture photo');
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('ERROR', 'Failed to capture photo');
      }
      
      setIsCapturing(false);
    }
  };

  const toggleCameraType = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const toggleFlash = () => {
    const modes: Array<'off' | 'on' | 'auto'> = ['off', 'on', 'auto'];
    const currentIndex = modes.indexOf(flashMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setFlashMode(modes[nextIndex]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={RetroComponents.centeredContainer}>
        <ActivityIndicator size="large" color={RetroColors.primary} />
        <Text style={[RetroTypography.body, { marginTop: RetroMeasurements.spacing.md }]}>
          INITIALIZING CAMERA...
        </Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={RetroComponents.centeredContainer}>
        <Text style={[RetroTypography.body, { color: RetroColors.error }]}>
          CAMERA ACCESS DENIED
        </Text>
        <TouchableOpacity 
          style={[RetroComponents.buttonPrimary, { marginTop: RetroMeasurements.spacing.lg }]}
          onPress={async () => {
            const granted = await cameraService.requestCameraPermission();
            setHasPermission(granted);
          }}
        >
          <Text style={RetroTypography.buttonText}>GRANT PERMISSION</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[RetroComponents.cameraContainer, { backgroundColor: RetroColors.darkBg }]}>
      <Camera 
        style={RetroComponents.cameraPreview} 
        type={type} 
        ref={cameraRef}
        flashMode={flashMode}
      >
        <View style={RetroComponents.cameraOverlay}>
          {/* Top Controls */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: `${RetroColors.darkBg}EE`,
            padding: RetroMeasurements.spacing.md,
            marginHorizontal: RetroMeasurements.spacing.md,
            marginTop: RetroMeasurements.spacing.md,
            borderRadius: RetroMeasurements.borderRadius.md,
            borderWidth: 1,
            borderColor: RetroColors.primary,
            ...ColorUtils.phosphorGlow(RetroColors.primary, 0.5)
          }}>
            <TouchableOpacity onPress={toggleCameraType} style={RetroComponents.touchEnhanced}>
              <Text style={[RetroTypography.body, { color: RetroColors.primary }]}>FLIP</Text>
            </TouchableOpacity>
            
            <View style={{ alignItems: 'center' }}>
              <Text style={[RetroTypography.label, { color: RetroColors.primary, fontSize: 12 }]}>
                CONSTRUCTPRO CAM
              </Text>
              {photoCount > 0 && (
                <Text style={[RetroTypography.caption, { color: RetroColors.warning, fontSize: 10 }]}>
                  {photoCount} PENDING
                </Text>
              )}
            </View>
            
            <TouchableOpacity onPress={toggleFlash} style={RetroComponents.touchEnhanced}>
              <Text style={[RetroTypography.body, { color: RetroColors.primary }]}>
                {flashMode.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Viewfinder with Matrix-style borders */}
          <View style={[RetroComponents.viewfinder, { flex: 1, margin: RetroMeasurements.spacing.lg }]}>
            {/* Corner markers */}
            <View style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 40 }}>
              <View style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 2, backgroundColor: RetroColors.primary, ...ColorUtils.phosphorGlow(RetroColors.primary, 1) }} />
              <View style={{ position: 'absolute', top: 0, left: 0, width: 2, height: 40, backgroundColor: RetroColors.primary, ...ColorUtils.phosphorGlow(RetroColors.primary, 1) }} />
            </View>
            <View style={{ position: 'absolute', top: 0, right: 0, width: 40, height: 40 }}>
              <View style={{ position: 'absolute', top: 0, right: 0, width: 40, height: 2, backgroundColor: RetroColors.primary, ...ColorUtils.phosphorGlow(RetroColors.primary, 1) }} />
              <View style={{ position: 'absolute', top: 0, right: 0, width: 2, height: 40, backgroundColor: RetroColors.primary, ...ColorUtils.phosphorGlow(RetroColors.primary, 1) }} />
            </View>
            <View style={{ position: 'absolute', bottom: 0, left: 0, width: 40, height: 40 }}>
              <View style={{ position: 'absolute', bottom: 0, left: 0, width: 40, height: 2, backgroundColor: RetroColors.primary, ...ColorUtils.phosphorGlow(RetroColors.primary, 1) }} />
              <View style={{ position: 'absolute', bottom: 0, left: 0, width: 2, height: 40, backgroundColor: RetroColors.primary, ...ColorUtils.phosphorGlow(RetroColors.primary, 1) }} />
            </View>
            <View style={{ position: 'absolute', bottom: 0, right: 0, width: 40, height: 40 }}>
              <View style={{ position: 'absolute', bottom: 0, right: 0, width: 40, height: 2, backgroundColor: RetroColors.primary, ...ColorUtils.phosphorGlow(RetroColors.primary, 1) }} />
              <View style={{ position: 'absolute', bottom: 0, right: 0, width: 2, height: 40, backgroundColor: RetroColors.primary, ...ColorUtils.phosphorGlow(RetroColors.primary, 1) }} />
            </View>
            
            {/* Grid overlay */}
            {showGrid && (
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 1, borderRightWidth: 1, borderColor: `${RetroColors.primary}33` }} />
                  <View style={{ flex: 1, borderRightWidth: 1, borderColor: `${RetroColors.primary}33` }} />
                  <View style={{ flex: 1 }} />
                </View>
                <View style={{ position: 'absolute', top: '33.33%', left: 0, right: 0, height: 1, backgroundColor: `${RetroColors.primary}33` }} />
                <View style={{ position: 'absolute', top: '66.66%', left: 0, right: 0, height: 1, backgroundColor: `${RetroColors.primary}33` }} />
              </View>
            )}
            
            {/* Center crosshair */}
            <View style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -20 }, { translateY: -20 }] }}>
              <View style={{ width: 40, height: 1, backgroundColor: `${RetroColors.primary}66`, position: 'absolute', top: 19.5 }} />
              <View style={{ width: 1, height: 40, backgroundColor: `${RetroColors.primary}66`, position: 'absolute', left: 19.5 }} />
            </View>
          </View>

          {/* Bottom Controls */}
          <View style={{ 
            paddingHorizontal: RetroMeasurements.spacing.xl,
            paddingBottom: RetroMeasurements.spacing.xl,
            alignItems: 'center' 
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
              <TouchableOpacity 
                onPress={toggleGrid} 
                style={[RetroComponents.touchEnhanced, { padding: RetroMeasurements.spacing.md }]}
              >
                <Text style={[RetroTypography.body, { color: showGrid ? RetroColors.primary : RetroColors.secondary }]}>
                  GRID
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  RetroComponents.captureButton,
                  {
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: RetroColors.darkBg,
                    borderWidth: 3,
                    borderColor: isCapturing ? RetroColors.error : RetroColors.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...ColorUtils.phosphorGlow(isCapturing ? RetroColors.error : RetroColors.primary, 0.8)
                  }
                ]}
                onPress={takePicture}
                disabled={isCapturing}
              >
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: isCapturing ? RetroColors.error : RetroColors.primary,
                  ...ColorUtils.phosphorGlow(isCapturing ? RetroColors.error : RetroColors.primary, 1.2)
                }} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[RetroComponents.touchEnhanced, { padding: RetroMeasurements.spacing.md }]}
              >
                <Text style={[RetroTypography.body, { color: hasLocationPermission ? RetroColors.primary : RetroColors.secondary }]}>
                  GPS
                </Text>
              </TouchableOpacity>
            </View>
            
            <Text style={[
              RetroTypography.caption, 
              { 
                marginTop: RetroMeasurements.spacing.md,
                color: RetroColors.primary,
                textAlign: 'center'
              }
            ]}>
              {isCapturing ? 'CAPTURING...' : 'TAP TO CAPTURE'}
            </Text>
          </View>
        </View>
      </Camera>
    </SafeAreaView>
  );
}