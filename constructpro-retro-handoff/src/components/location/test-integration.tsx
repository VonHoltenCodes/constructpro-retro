/**
 * Test file to verify location components can be imported and used
 * This demonstrates integration with the existing app structure
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LocationVerificationModal, LocationAccuracyIndicator } from './index';
import { LocationService } from './LocationService';
import { RetroComponents, RetroTypography } from '../../styles';

// Example integration in a photo detail screen
export function PhotoDetailWithLocation({ photoUri }: { photoUri: string }) {
  const [showLocationModal, setShowLocationModal] = React.useState(false);
  const [locationInfo, setLocationInfo] = React.useState<any>(null);

  React.useEffect(() => {
    // Verify location on mount
    LocationService.verifyPhotoLocation(photoUri).then(result => {
      setLocationInfo(result);
    });
  }, [photoUri]);

  const handleLocationUpdate = async (coordinates: any) => {
    const success = await LocationService.updatePhotoLocation({
      photoUri,
      coordinates,
      manuallySet: true,
    });
    
    if (success) {
      // Refresh location info
      const result = await LocationService.verifyPhotoLocation(photoUri);
      setLocationInfo(result);
    }
  };

  return (
    <View style={RetroComponents.container}>
      {/* Photo display would go here */}
      
      <View style={RetroComponents.card}>
        <Text style={RetroTypography.label}>Location Information</Text>
        
        {locationInfo && (
          <>
            {locationInfo.exifLocation ? (
              <Text style={RetroTypography.monoText}>
                {locationInfo.exifLocation.latitude.toFixed(6)}, 
                {locationInfo.exifLocation.longitude.toFixed(6)}
              </Text>
            ) : (
              <Text style={RetroTypography.smallText}>No location data</Text>
            )}
            
            {locationInfo.accuracy && (
              <LocationAccuracyIndicator accuracy={locationInfo.accuracy} />
            )}
          </>
        )}
        
        <TouchableOpacity
          style={[RetroComponents.button, { marginTop: 10 }]}
          onPress={() => setShowLocationModal(true)}
        >
          <Text style={RetroTypography.buttonText}>
            {locationInfo?.exifLocation ? 'Verify Location' : 'Add Location'}
          </Text>
        </TouchableOpacity>
      </View>

      <LocationVerificationModal
        visible={showLocationModal}
        photoUri={photoUri}
        onClose={() => setShowLocationModal(false)}
        onLocationUpdated={handleLocationUpdate}
      />
    </View>
  );
}