import * as FileSystem from 'expo-file-system';
import { ExifExtractor, ExifData } from '../../utils/exif';
import { PhotoMetadata } from '../camera/CameraService';

export interface Photo {
  id: string;
  uri: string;
  thumbnail?: string;
  metadata: PhotoMetadata;
  exifData?: ExifData;
  projectId?: string;
  projectName?: string;
  tags: string[];
  isUnassigned: boolean;
}

export interface PhotoFilter {
  projectId?: string;
  startDate?: Date;
  endDate?: Date;
  location?: {
    latitude: number;
    longitude: number;
    radiusMeters: number;
  };
  tags?: string[];
  isUnassigned?: boolean;
  searchText?: string;
}

export class PhotoStorageService {
  private static instance: PhotoStorageService;
  private photosDirectory = FileSystem.documentDirectory + 'photos/';
  private projectsDirectory = FileSystem.documentDirectory + 'projects/';
  private tempDirectory = FileSystem.documentDirectory + 'temp_photos/';
  private thumbnailsDirectory = FileSystem.documentDirectory + 'thumbnails/';

  private constructor() {
    this.ensureDirectories();
  }

  static getInstance(): PhotoStorageService {
    if (!PhotoStorageService.instance) {
      PhotoStorageService.instance = new PhotoStorageService();
    }
    return PhotoStorageService.instance;
  }

  private async ensureDirectories() {
    const dirs = [
      this.photosDirectory,
      this.projectsDirectory,
      this.tempDirectory,
      this.thumbnailsDirectory
    ];
    
    for (const dir of dirs) {
      const dirInfo = await FileSystem.getInfoAsync(dir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      }
    }
  }

  async getAllPhotos(): Promise<Photo[]> {
    try {
      const photos: Photo[] = [];
      
      // Get temp photos (unassigned)
      const tempPhotos = await this.getTempPhotos();
      photos.push(...tempPhotos);
      
      // Get project photos
      const projectPhotos = await this.getProjectPhotos();
      photos.push(...projectPhotos);
      
      // Sort by timestamp (newest first)
      return photos.sort((a, b) => {
        const timeA = new Date(a.metadata.timestamp).getTime();
        const timeB = new Date(b.metadata.timestamp).getTime();
        return timeB - timeA;
      });
    } catch (error) {
      console.error('Error getting all photos:', error);
      return [];
    }
  }

  private async getTempPhotos(): Promise<Photo[]> {
    try {
      const files = await FileSystem.readDirectoryAsync(this.tempDirectory);
      const photos: Photo[] = [];
      
      for (const file of files) {
        if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
          const photoUri = this.tempDirectory + file;
          const metadataPath = photoUri.replace(/\.(jpg|jpeg|png)$/, '_metadata.json');
          
          try {
            const metadataString = await FileSystem.readAsStringAsync(metadataPath);
            const metadata: PhotoMetadata = JSON.parse(metadataString);
            
            // Extract EXIF data
            const exifData = await ExifExtractor.extractFromUri(photoUri);
            
            photos.push({
              id: file,
              uri: photoUri,
              metadata,
              exifData: exifData || undefined,
              tags: metadata.tags || [],
              isUnassigned: true,
              projectName: 'Unassigned'
            });
          } catch (error) {
            console.warn(`Failed to load metadata for ${file}:`, error);
          }
        }
      }
      
      return photos;
    } catch (error) {
      console.error('Error getting temp photos:', error);
      return [];
    }
  }

  private async getProjectPhotos(): Promise<Photo[]> {
    try {
      const photos: Photo[] = [];
      const projectDirs = await FileSystem.readDirectoryAsync(this.projectsDirectory);
      
      for (const projectId of projectDirs) {
        const projectPhotoDir = `${this.projectsDirectory}${projectId}/photos/`;
        const dirInfo = await FileSystem.getInfoAsync(projectPhotoDir);
        
        if (dirInfo.exists && dirInfo.isDirectory) {
          const files = await FileSystem.readDirectoryAsync(projectPhotoDir);
          
          for (const file of files) {
            if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
              const photoUri = projectPhotoDir + file;
              const metadataPath = photoUri.replace(/\.(jpg|jpeg|png)$/, '_metadata.json');
              
              try {
                const metadataString = await FileSystem.readAsStringAsync(metadataPath);
                const metadata: PhotoMetadata = JSON.parse(metadataString);
                
                // Extract EXIF data
                const exifData = await ExifExtractor.extractFromUri(photoUri);
                
                photos.push({
                  id: `${projectId}_${file}`,
                  uri: photoUri,
                  metadata,
                  exifData: exifData || undefined,
                  projectId,
                  projectName: await this.getProjectName(projectId),
                  tags: metadata.tags || [],
                  isUnassigned: false
                });
              } catch (error) {
                console.warn(`Failed to load metadata for ${file}:`, error);
              }
            }
          }
        }
      }
      
      return photos;
    } catch (error) {
      console.error('Error getting project photos:', error);
      return [];
    }
  }

  private async getProjectName(projectId: string): Promise<string> {
    // In a real app, this would fetch from a database or project metadata file
    // For now, return a formatted project name
    return `Project ${projectId}`;
  }

  async filterPhotos(photos: Photo[], filter: PhotoFilter): Promise<Photo[]> {
    let filtered = [...photos];
    
    // Filter by project
    if (filter.projectId !== undefined) {
      filtered = filtered.filter(p => p.projectId === filter.projectId);
    }
    
    // Filter by unassigned
    if (filter.isUnassigned !== undefined) {
      filtered = filtered.filter(p => p.isUnassigned === filter.isUnassigned);
    }
    
    // Filter by date range
    if (filter.startDate || filter.endDate) {
      filtered = filtered.filter(photo => {
        const photoDate = new Date(photo.metadata.timestamp);
        if (filter.startDate && photoDate < filter.startDate) return false;
        if (filter.endDate && photoDate > filter.endDate) return false;
        return true;
      });
    }
    
    // Filter by location proximity
    if (filter.location) {
      filtered = filtered.filter(photo => {
        const photoLoc = photo.metadata.location || photo.exifData?.gps;
        if (!photoLoc) return false;
        
        const distance = this.calculateDistance(
          filter.location!.latitude,
          filter.location!.longitude,
          photoLoc.latitude,
          photoLoc.longitude
        );
        
        return distance <= filter.location!.radiusMeters;
      });
    }
    
    // Filter by tags
    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(photo => 
        filter.tags!.some(tag => photo.tags.includes(tag))
      );
    }
    
    // Search by text (location name, date)
    if (filter.searchText) {
      const search = filter.searchText.toLowerCase();
      filtered = filtered.filter(photo => {
        const dateStr = new Date(photo.metadata.timestamp).toLocaleDateString();
        const timeStr = new Date(photo.metadata.timestamp).toLocaleTimeString();
        const coords = photo.metadata.location || photo.exifData?.gps;
        const coordsStr = coords ? `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : '';
        
        return dateStr.includes(search) ||
               timeStr.includes(search) ||
               coordsStr.includes(search) ||
               photo.projectName?.toLowerCase().includes(search) ||
               photo.tags.some(tag => tag.toLowerCase().includes(search));
      });
    }
    
    return filtered;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  async assignPhotosToProject(photoIds: string[], projectId: string): Promise<boolean> {
    try {
      const photos = await this.getAllPhotos();
      const photosToAssign = photos.filter(p => photoIds.includes(p.id) && p.isUnassigned);
      
      const projectPhotoDir = `${this.projectsDirectory}${projectId}/photos/`;
      await FileSystem.makeDirectoryAsync(projectPhotoDir, { intermediates: true });
      
      for (const photo of photosToAssign) {
        const fileName = photo.uri.split('/').pop() || `photo_${Date.now()}.jpg`;
        const newPhotoPath = projectPhotoDir + fileName;
        const newMetadataPath = newPhotoPath.replace(/\.(jpg|jpeg|png)$/, '_metadata.json');
        
        // Update metadata
        const updatedMetadata = {
          ...photo.metadata,
          projectId
        };
        
        // Move files
        await FileSystem.moveAsync({
          from: photo.uri,
          to: newPhotoPath
        });
        
        await FileSystem.writeAsStringAsync(
          newMetadataPath,
          JSON.stringify(updatedMetadata, null, 2)
        );
        
        // Delete old metadata file
        const oldMetadataPath = photo.uri.replace(/\.(jpg|jpeg|png)$/, '_metadata.json');
        await FileSystem.deleteAsync(oldMetadataPath, { idempotent: true });
      }
      
      return true;
    } catch (error) {
      console.error('Error assigning photos to project:', error);
      return false;
    }
  }

  async deletePhotos(photoIds: string[]): Promise<boolean> {
    try {
      const photos = await this.getAllPhotos();
      const photosToDelete = photos.filter(p => photoIds.includes(p.id));
      
      for (const photo of photosToDelete) {
        await FileSystem.deleteAsync(photo.uri, { idempotent: true });
        const metadataPath = photo.uri.replace(/\.(jpg|jpeg|png)$/, '_metadata.json');
        await FileSystem.deleteAsync(metadataPath, { idempotent: true });
        
        // Delete thumbnail if exists
        if (photo.thumbnail) {
          await FileSystem.deleteAsync(photo.thumbnail, { idempotent: true });
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting photos:', error);
      return false;
    }
  }
}

export default PhotoStorageService.getInstance();