# Location Verification System

A comprehensive location verification and manual GPS override system for ConstructPro Retro that allows users to verify, correct, and manually set photo locations.

## Components

### LocationVerificationModal

The main modal component that provides a full-featured location verification interface.

**Features:**
- Displays current device location vs photo EXIF location
- Shows distance between locations
- Manual GPS coordinate entry
- Interactive map view for location selection
- GPS accuracy indicator
- Support for photos without GPS data

**Usage:**
```tsx
import { LocationVerificationModal } from '../components/location';

<LocationVerificationModal
  visible={modalVisible}
  photoUri={photoUri}
  onClose={() => setModalVisible(false)}
  onLocationUpdated={(coordinates) => {
    // Handle updated coordinates
  }}
/>
```

### LocationAccuracyIndicator

Visual component that displays GPS accuracy with color-coded indicators.

**Accuracy Levels:**
- Excellent: ≤5m (green)
- Good: ≤10m (primary color)
- Fair: ≤25m (warning)
- Poor: ≤50m (error)
- Very Poor: >50m (dim)

**Usage:**
```tsx
import { LocationAccuracyIndicator } from '../components/location';

<LocationAccuracyIndicator accuracy={15} />
```

### LocationService

Utility service for location-related operations.

**Methods:**
- `verifyPhotoLocation(photoUri)`: Compare EXIF location with device location
- `updatePhotoLocation(options)`: Update photo metadata with new coordinates
- `removePhotoLocation(photoUri)`: Remove location data from photo
- `getLocationName(coordinates)`: Reverse geocode coordinates to address
- `isLocationAvailable()`: Check if location services are available

**Usage:**
```tsx
import { LocationService } from '../components/location/LocationService';

// Verify photo location
const result = await LocationService.verifyPhotoLocation(photoUri);

// Update photo location
await LocationService.updatePhotoLocation({
  photoUri: photoUri,
  coordinates: { latitude: 40.7128, longitude: -74.0060 },
  accuracy: 10,
  manuallySet: true
});
```

## Integration Example

Here's how to integrate the location verification system into your photo gallery or camera screen:

```tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { LocationVerificationModal } from '../components/location';
import { LocationService } from '../components/location/LocationService';

function PhotoReviewScreen({ photo }) {
  const [showLocationModal, setShowLocationModal] = useState(false);

  const handleLocationUpdated = async (coordinates) => {
    await LocationService.updatePhotoLocation({
      photoUri: photo.uri,
      coordinates,
      manuallySet: true,
    });
    
    // Refresh photo data
    refreshPhotoData();
  };

  return (
    <View>
      {/* Photo display */}
      
      <TouchableOpacity onPress={() => setShowLocationModal(true)}>
        <Text>Verify Location</Text>
      </TouchableOpacity>

      <LocationVerificationModal
        visible={showLocationModal}
        photoUri={photo.uri}
        onClose={() => setShowLocationModal(false)}
        onLocationUpdated={handleLocationUpdated}
      />
    </View>
  );
}
```

## Dependencies

This system requires the following packages (already included in package.json):
- `expo-location`: For device location services
- `expo-file-system`: For reading/writing photo metadata
- `react-native-maps`: For interactive map view
- `exifreader`: For extracting EXIF data from photos

## Features

1. **Automatic Location Detection**
   - Extracts GPS coordinates from photo EXIF data
   - Gets current device location for comparison
   - Calculates distance between locations

2. **Manual Location Entry**
   - Text inputs for latitude/longitude
   - Validation for coordinate ranges
   - Updates map view on manual entry

3. **Interactive Map**
   - Tap to select location
   - Shows markers for photo and selected locations
   - User location tracking

4. **Metadata Management**
   - Updates photo metadata files
   - Preserves original photo data
   - Tracks manual location updates

5. **Visual Feedback**
   - Color-coded accuracy indicators
   - Distance calculations
   - Location formatting (decimal and DMS)

## Best Practices

1. Always request location permissions before using the modal
2. Handle cases where photos have no EXIF location data
3. Consider caching reverse geocoded addresses
4. Validate manual coordinate inputs
5. Provide clear feedback when locations are updated

## Future Enhancements

- Batch location updates for multiple photos
- Location history/favorites
- Offline map support
- EXIF data writing (currently only updates metadata)
- Location search by address/place name