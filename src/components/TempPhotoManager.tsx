import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { cameraService, PhotoMetadata } from '../services/camera';
import { RetroComponents, RetroMeasurements } from '../styles/RetroComponents';
import { RetroTypography } from '../styles/RetroTypography';
import { RetroColors, ColorUtils } from '../styles/RetroColors';
import * as Haptics from 'expo-haptics';

interface TempPhotoManagerProps {
  onAssignPhoto?: (photo: PhotoMetadata, projectId: string) => void;
  projectId?: string;
}

export default function TempPhotoManager({ onAssignPhoto, projectId }: TempPhotoManagerProps) {
  const [tempPhotos, setTempPhotos] = useState<PhotoMetadata[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTempPhotos();
  }, []);

  const loadTempPhotos = async () => {
    setIsLoading(true);
    try {
      const photos = await cameraService.getTempPhotos();
      setTempPhotos(photos);
    } catch (error) {
      console.error('Error loading temp photos:', error);
    }
    setIsLoading(false);
  };

  const handleAssignPhoto = async (photo: PhotoMetadata) => {
    if (!projectId) {
      Alert.alert('NO PROJECT', 'Please select a project first');
      return;
    }

    try {
      const success = await cameraService.assignPhotoToProject(photo.uri, projectId);
      if (success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('SUCCESS', 'Photo assigned to project');
        
        // Refresh the list
        await loadTempPhotos();
        
        if (onAssignPhoto) {
          onAssignPhoto(photo, projectId);
        }
      } else {
        throw new Error('Failed to assign photo');
      }
    } catch (error) {
      console.error('Error assigning photo:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('ERROR', 'Failed to assign photo to project');
    }
  };

  const handleDeletePhoto = async (photo: PhotoMetadata) => {
    Alert.alert(
      'DELETE PHOTO',
      'Are you sure you want to delete this photo?',
      [
        {
          text: 'CANCEL',
          style: 'cancel'
        },
        {
          text: 'DELETE',
          style: 'destructive',
          onPress: async () => {
            try {
              await cameraService.deleteTempPhoto(photo.uri);
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              await loadTempPhotos();
            } catch (error) {
              console.error('Error deleting photo:', error);
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert('ERROR', 'Failed to delete photo');
            }
          }
        }
      ]
    );
  };

  const renderPhoto = ({ item }: { item: PhotoMetadata }) => {
    const isSelected = selectedPhoto?.uri === item.uri;
    
    return (
      <TouchableOpacity
        style={[
          {
            marginHorizontal: RetroMeasurements.spacing.sm,
            marginVertical: RetroMeasurements.spacing.sm,
            borderRadius: RetroMeasurements.borderRadius.md,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: isSelected ? RetroColors.primary : RetroColors.secondary,
          },
          isSelected && ColorUtils.phosphorGlow(RetroColors.primary, 0.5)
        ]}
        onPress={() => {
          setSelectedPhoto(item);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Image
          source={{ uri: item.uri }}
          style={{
            width: 120,
            height: 120,
            backgroundColor: RetroColors.darkBg,
          }}
          resizeMode="cover"
        />
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: `${RetroColors.darkBg}CC`,
          padding: RetroMeasurements.spacing.xs,
        }}>
          <Text style={[RetroTypography.caption, { color: RetroColors.primary, fontSize: 10 }]}>
            {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
          {item.location && (
            <Text style={[RetroTypography.caption, { color: RetroColors.success, fontSize: 9 }]}>
              GPS TAGGED
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={RetroComponents.centeredContainer}>
        <Text style={RetroTypography.body}>LOADING PHOTOS...</Text>
      </View>
    );
  }

  if (tempPhotos.length === 0) {
    return (
      <View style={[RetroComponents.centeredContainer, { padding: RetroMeasurements.spacing.xl }]}>
        <Text style={[RetroTypography.body, { textAlign: 'center' }]}>
          NO PENDING PHOTOS
        </Text>
        <Text style={[RetroTypography.caption, { textAlign: 'center', marginTop: RetroMeasurements.spacing.md }]}>
          Photos captured with the camera will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={[
        RetroComponents.card,
        {
          marginHorizontal: RetroMeasurements.spacing.md,
          marginTop: RetroMeasurements.spacing.md,
          padding: RetroMeasurements.spacing.md,
        }
      ]}>
        <Text style={[RetroTypography.label, { color: RetroColors.primary }]}>
          PENDING PHOTOS ({tempPhotos.length})
        </Text>
      </View>

      <FlatList
        data={tempPhotos}
        renderItem={renderPhoto}
        keyExtractor={(item) => item.uri}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: RetroMeasurements.spacing.md,
          paddingVertical: RetroMeasurements.spacing.md,
        }}
      />

      {selectedPhoto && (
        <View style={[
          RetroComponents.card,
          {
            marginHorizontal: RetroMeasurements.spacing.md,
            marginBottom: RetroMeasurements.spacing.md,
            padding: RetroMeasurements.spacing.md,
          }
        ]}>
          <Text style={[RetroTypography.label, { color: RetroColors.primary, marginBottom: RetroMeasurements.spacing.sm }]}>
            PHOTO DETAILS
          </Text>
          <Text style={[RetroTypography.caption, { color: RetroColors.text }]}>
            Captured: {new Date(selectedPhoto.timestamp).toLocaleString()}
          </Text>
          {selectedPhoto.location && (
            <>
              <Text style={[RetroTypography.caption, { color: RetroColors.success }]}>
                Lat: {selectedPhoto.location.latitude.toFixed(6)}
              </Text>
              <Text style={[RetroTypography.caption, { color: RetroColors.success }]}>
                Lon: {selectedPhoto.location.longitude.toFixed(6)}
              </Text>
            </>
          )}
          
          <View style={{ flexDirection: 'row', marginTop: RetroMeasurements.spacing.md }}>
            {projectId && (
              <TouchableOpacity
                style={[RetroComponents.buttonPrimary, { flex: 1, marginRight: RetroMeasurements.spacing.sm }]}
                onPress={() => handleAssignPhoto(selectedPhoto)}
              >
                <Text style={RetroTypography.buttonText}>ASSIGN TO PROJECT</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[RetroComponents.buttonSecondary, { flex: projectId ? 0 : 1 }]}
              onPress={() => handleDeletePhoto(selectedPhoto)}
            >
              <Text style={[RetroTypography.buttonText, { color: RetroColors.error }]}>DELETE</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}