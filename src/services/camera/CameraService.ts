import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';

export interface PhotoMetadata {
  uri: string;
  timestamp: Date;
  location?: {
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy?: number;
  };
  deviceInfo: {
    model: string;
    platform: string;
  };
  projectId?: string;
  tags?: string[];
}

export class CameraService {
  private static instance: CameraService;
  private tempPhotoDirectory: string = FileSystem.documentDirectory + 'temp_photos/';

  private constructor() {
    this.ensureTempDirectory();
  }

  static getInstance(): CameraService {
    if (!CameraService.instance) {
      CameraService.instance = new CameraService();
    }
    return CameraService.instance;
  }

  private async ensureTempDirectory() {
    const dirInfo = await FileSystem.getInfoAsync(this.tempPhotoDirectory);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.tempPhotoDirectory, { intermediates: true });
    }
  }

  async requestCameraPermission(): Promise<boolean> {
    const { status } = await Camera.requestCameraPermissionsAsync();
    return status === 'granted';
  }

  async requestLocationPermission(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  async requestMediaLibraryPermission(): Promise<boolean> {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  }

  async getCurrentLocation() {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) return null;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude || undefined,
        accuracy: location.coords.accuracy || undefined,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  }

  async capturePhoto(cameraRef: any): Promise<PhotoMetadata | null> {
    try {
      if (!cameraRef) return null;

      // Capture photo with EXIF data
      const photo = await cameraRef.takePictureAsync({
        quality: 0.9,
        base64: false,
        exif: true,
        skipProcessing: false,
      });

      // Get current location
      const location = await this.getCurrentLocation();

      // Create metadata
      const metadata: PhotoMetadata = {
        uri: photo.uri,
        timestamp: new Date(),
        location: location || undefined,
        deviceInfo: {
          model: 'ConstructPro Camera',
          platform: 'Expo',
        },
      };

      // Save to temp directory with metadata
      const tempFileName = `photo_${Date.now()}.jpg`;
      const tempPath = this.tempPhotoDirectory + tempFileName;
      
      await FileSystem.copyAsync({
        from: photo.uri,
        to: tempPath,
      });

      // Save metadata alongside photo
      const metadataPath = tempPath.replace('.jpg', '_metadata.json');
      await FileSystem.writeAsStringAsync(
        metadataPath,
        JSON.stringify(metadata, null, 2)
      );

      return { ...metadata, uri: tempPath };
    } catch (error) {
      console.error('Error capturing photo:', error);
      return null;
    }
  }

  async getTempPhotos(): Promise<PhotoMetadata[]> {
    try {
      const files = await FileSystem.readDirectoryAsync(this.tempPhotoDirectory);
      const photos: PhotoMetadata[] = [];

      for (const file of files) {
        if (file.endsWith('_metadata.json')) {
          const metadataPath = this.tempPhotoDirectory + file;
          const metadataString = await FileSystem.readAsStringAsync(metadataPath);
          const metadata = JSON.parse(metadataString);
          photos.push(metadata);
        }
      }

      return photos.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error('Error getting temp photos:', error);
      return [];
    }
  }

  async assignPhotoToProject(photoUri: string, projectId: string): Promise<boolean> {
    try {
      // Find the metadata file
      const metadataPath = photoUri.replace('.jpg', '_metadata.json');
      const metadataString = await FileSystem.readAsStringAsync(metadataPath);
      const metadata: PhotoMetadata = JSON.parse(metadataString);

      // Update metadata with project ID
      metadata.projectId = projectId;

      // Move to project directory
      const projectDir = FileSystem.documentDirectory + `projects/${projectId}/photos/`;
      await FileSystem.makeDirectoryAsync(projectDir, { intermediates: true });

      const fileName = photoUri.split('/').pop() || `photo_${Date.now()}.jpg`;
      const newPhotoPath = projectDir + fileName;
      const newMetadataPath = newPhotoPath.replace('.jpg', '_metadata.json');

      // Move files
      await FileSystem.moveAsync({
        from: photoUri,
        to: newPhotoPath,
      });

      await FileSystem.writeAsStringAsync(
        newMetadataPath,
        JSON.stringify(metadata, null, 2)
      );

      // Delete old metadata file
      await FileSystem.deleteAsync(metadataPath, { idempotent: true });

      return true;
    } catch (error) {
      console.error('Error assigning photo to project:', error);
      return false;
    }
  }

  async saveToGallery(photoUri: string): Promise<string | null> {
    try {
      const hasPermission = await this.requestMediaLibraryPermission();
      if (!hasPermission) return null;

      const asset = await MediaLibrary.createAssetAsync(photoUri);
      return asset.uri;
    } catch (error) {
      console.error('Error saving to gallery:', error);
      return null;
    }
  }

  async deleteTempPhoto(photoUri: string): Promise<boolean> {
    try {
      await FileSystem.deleteAsync(photoUri, { idempotent: true });
      const metadataPath = photoUri.replace('.jpg', '_metadata.json');
      await FileSystem.deleteAsync(metadataPath, { idempotent: true });
      return true;
    } catch (error) {
      console.error('Error deleting temp photo:', error);
      return false;
    }
  }

  async clearTempPhotos(): Promise<void> {
    try {
      await FileSystem.deleteAsync(this.tempPhotoDirectory, { idempotent: true });
      await this.ensureTempDirectory();
    } catch (error) {
      console.error('Error clearing temp photos:', error);
    }
  }
}

export default CameraService.getInstance();