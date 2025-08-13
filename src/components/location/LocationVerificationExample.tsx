import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { LocationVerificationModal } from './index';
import { LocationService } from './LocationService';
import { RetroComponents, RetroTypography } from '../../styles';
import { GPSCoordinates } from '../../utils/exif';

/**
 * Example component showing how to integrate the LocationVerificationModal
 * This can be used in the photo review screen or gallery
 */
export default function LocationVerificationExample() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhotoUri, setSelectedPhotoUri] = useState<string>('');
  const [locationData, setLocationData] = useState<any>(null);

  const handleVerifyLocation = (photoUri: string) => {
    setSelectedPhotoUri(photoUri);
    setModalVisible(true);
  };

  const handleLocationUpdated = async (coordinates: GPSCoordinates) => {
    // Update the photo metadata with new coordinates
    const success = await LocationService.updatePhotoLocation({
      photoUri: selectedPhotoUri,
      coordinates,
      manuallySet: true,
    });

    if (success) {
      Alert.alert('Success', 'Photo location has been updated');
      
      // Get location name for display
      const locationName = await LocationService.getLocationName(coordinates);
      setLocationData({
        coordinates,
        name: locationName,
      });
    } else {
      Alert.alert('Error', 'Failed to update photo location');
    }
  };

  return (
    <View style={RetroComponents.container}>
      {/* Example photo card with location verification button */}
      <View style={RetroComponents.photoCard}>
        <Image 
          source={{ uri: selectedPhotoUri || 'placeholder' }} 
          style={{ width: '100%', height: 200 }} 
        />
        
        <View style={{ padding: 16 }}>
          <Text style={RetroTypography.label}>Photo Location</Text>
          
          {locationData ? (
            <View>
              <Text style={RetroTypography.monoText}>
                {locationData.coordinates.latitude.toFixed(6)}, 
                {locationData.coordinates.longitude.toFixed(6)}
              </Text>
              {locationData.name && (
                <Text style={RetroTypography.smallText}>{locationData.name}</Text>
              )}
            </View>
          ) : (
            <Text style={RetroTypography.smallText}>No location data</Text>
          )}
          
          <TouchableOpacity
            style={[RetroComponents.button, { marginTop: 10 }]}
            onPress={() => handleVerifyLocation(selectedPhotoUri)}
          >
            <Text style={RetroTypography.buttonText}>Verify Location</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Verification Modal */}
      <LocationVerificationModal
        visible={modalVisible}
        photoUri={selectedPhotoUri}
        onClose={() => setModalVisible(false)}
        onLocationUpdated={handleLocationUpdated}
      />
    </View>
  );
}