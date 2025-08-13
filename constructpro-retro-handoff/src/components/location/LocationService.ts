import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import { ExifExtractor, GPSCoordinates } from '../../utils/exif';
import { PhotoMetadata } from '../../services/camera/CameraService';

export interface LocationUpdateOptions {
  photoUri: string;
  coordinates: GPSCoordinates;
  accuracy?: number;
  manuallySet?: boolean;
}

export interface LocationVerificationResult {
  exifLocation: GPSCoordinates | null;
  deviceLocation: GPSCoordinates | null;
  distance: number | null;
  accuracy: number | null;
}

export class LocationService {
  /**
   * Verify photo location by comparing EXIF data with current device location
   */
  static async verifyPhotoLocation(photoUri: string): Promise<LocationVerificationResult> {
    try {
      // Extract EXIF location
      const exifData = await ExifExtractor.extractFromUri(photoUri);
      const exifLocation = exifData?.gps || null;

      // Get current device location
      const { status } = await Location.requestForegroundPermissionsAsync();
      let deviceLocation: GPSCoordinates | null = null;
      let accuracy: number | null = null;

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        
        deviceLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          altitude: location.coords.altitude || undefined,
        };
        
        accuracy = location.coords.accuracy || null;
      }

      // Calculate distance if both locations are available
      let distance: number | null = null;
      if (exifLocation && deviceLocation) {
        distance = ExifExtractor.calculateDistance(exifLocation, deviceLocation);
      }

      return {
        exifLocation,
        deviceLocation,
        distance,
        accuracy,
      };
    } catch (error) {
      console.error('Error verifying photo location:', error);
      return {
        exifLocation: null,
        deviceLocation: null,
        distance: null,
        accuracy: null,
      };
    }
  }

  /**
   * Update photo metadata with new GPS coordinates
   */
  static async updatePhotoLocation(options: LocationUpdateOptions): Promise<boolean> {
    try {
      const { photoUri, coordinates, accuracy, manuallySet = false } = options;
      
      // Check if metadata file exists
      const metadataPath = photoUri.replace('.jpg', '_metadata.json');
      const metadataInfo = await FileSystem.getInfoAsync(metadataPath);
      
      if (!metadataInfo.exists) {
        // Create new metadata if it doesn't exist
        const metadata: PhotoMetadata = {
          uri: photoUri,
          timestamp: new Date(),
          location: {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            altitude: coordinates.altitude,
            accuracy,
          },
          deviceInfo: {
            model: 'ConstructPro Camera',
            platform: 'Expo',
          },
        };

        await FileSystem.writeAsStringAsync(
          metadataPath,
          JSON.stringify(metadata, null, 2)
        );
      } else {
        // Update existing metadata
        const metadataString = await FileSystem.readAsStringAsync(metadataPath);
        const metadata = JSON.parse(metadataString);
        
        metadata.location = {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          altitude: coordinates.altitude,
          accuracy,
          manuallySet,
          updatedAt: new Date().toISOString(),
        };

        await FileSystem.writeAsStringAsync(
          metadataPath,
          JSON.stringify(metadata, null, 2)
        );
      }

      return true;
    } catch (error) {
      console.error('Error updating photo location:', error);
      return false;
    }
  }

  /**
   * Remove location data from photo metadata
   */
  static async removePhotoLocation(photoUri: string): Promise<boolean> {
    try {
      const metadataPath = photoUri.replace('.jpg', '_metadata.json');
      const metadataInfo = await FileSystem.getInfoAsync(metadataPath);
      
      if (metadataInfo.exists) {
        const metadataString = await FileSystem.readAsStringAsync(metadataPath);
        const metadata = JSON.parse(metadataString);
        
        delete metadata.location;
        
        await FileSystem.writeAsStringAsync(
          metadataPath,
          JSON.stringify(metadata, null, 2)
        );
      }

      return true;
    } catch (error) {
      console.error('Error removing photo location:', error);
      return false;
    }
  }

  /**
   * Get location name from coordinates using reverse geocoding
   */
  static async getLocationName(coordinates: GPSCoordinates): Promise<string | null> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return null;

      const results = await Location.reverseGeocodeAsync({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });

      if (results.length > 0) {
        const location = results[0];
        const parts = [
          location.street,
          location.city,
          location.region,
          location.postalCode,
        ].filter(Boolean);
        
        return parts.join(', ');
      }

      return null;
    } catch (error) {
      console.error('Error getting location name:', error);
      return null;
    }
  }

  /**
   * Check if location services are enabled and available
   */
  static async isLocationAvailable(): Promise<boolean> {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) return false;

      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking location availability:', error);
      return false;
    }
  }
}