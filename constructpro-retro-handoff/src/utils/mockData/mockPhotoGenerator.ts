import * as FileSystem from 'expo-file-system';
import { PhotoMetadata } from '../../services/camera/CameraService';

export class MockPhotoGenerator {
  private static tempDirectory = FileSystem.documentDirectory + 'temp_photos/';
  private static projectsDirectory = FileSystem.documentDirectory + 'projects/';
  
  static mockLocations = [
    { latitude: 40.7128, longitude: -74.0060, name: 'New York' },
    { latitude: 34.0522, longitude: -118.2437, name: 'Los Angeles' },
    { latitude: 41.8781, longitude: -87.6298, name: 'Chicago' },
    { latitude: 29.7604, longitude: -95.3698, name: 'Houston' },
    { latitude: 33.4484, longitude: -112.0740, name: 'Phoenix' }
  ];
  
  static mockProjectPhotos = [
    {
      projectId: '1',
      count: 5,
      baseDate: new Date('2024-01-15'),
      tags: ['foundation', 'concrete', 'rebar']
    },
    {
      projectId: '2',
      count: 4,
      baseDate: new Date('2024-01-14'),
      tags: ['framing', 'structure', 'progress']
    },
    {
      projectId: '3',
      count: 3,
      baseDate: new Date('2024-01-13'),
      tags: ['electrical', 'wiring', 'panels']
    }
  ];
  
  static mockUnassignedPhotos = [
    {
      count: 6,
      baseDate: new Date(),
      tags: ['inspection', 'review', 'pending']
    }
  ];
  
  static async generateMockPhotos() {
    try {
      // Ensure directories exist
      await FileSystem.makeDirectoryAsync(this.tempDirectory, { intermediates: true });
      
      // Generate unassigned photos
      let photoIndex = 0;
      for (const batch of this.mockUnassignedPhotos) {
        for (let i = 0; i < batch.count; i++) {
          const location = this.mockLocations[photoIndex % this.mockLocations.length];
          const date = new Date(batch.baseDate);
          date.setHours(date.getHours() - i * 2);
          
          const metadata: PhotoMetadata = {
            uri: '', // Will be set after saving
            timestamp: date,
            location: {
              latitude: location.latitude + (Math.random() - 0.5) * 0.01,
              longitude: location.longitude + (Math.random() - 0.5) * 0.01,
              accuracy: 10 + Math.random() * 20
            },
            deviceInfo: {
              model: 'ConstructPro Camera',
              platform: 'Expo'
            },
            tags: [batch.tags[i % batch.tags.length]]
          };
          
          const fileName = `mock_photo_${Date.now()}_${photoIndex}.jpg`;
          const filePath = this.tempDirectory + fileName;
          const metadataPath = filePath.replace('.jpg', '_metadata.json');
          
          // Create a simple colored rectangle as mock photo
          const mockImageData = this.generateMockImageData(photoIndex);
          await FileSystem.writeAsStringAsync(filePath, mockImageData, {
            encoding: FileSystem.EncodingType.Base64
          });
          
          metadata.uri = filePath;
          await FileSystem.writeAsStringAsync(metadataPath, JSON.stringify(metadata, null, 2));
          
          photoIndex++;
        }
      }
      
      // Generate project photos
      for (const batch of this.mockProjectPhotos) {
        const projectDir = `${this.projectsDirectory}${batch.projectId}/photos/`;
        await FileSystem.makeDirectoryAsync(projectDir, { intermediates: true });
        
        for (let i = 0; i < batch.count; i++) {
          const location = this.mockLocations[(photoIndex + i) % this.mockLocations.length];
          const date = new Date(batch.baseDate);
          date.setHours(date.getHours() + i * 3);
          
          const metadata: PhotoMetadata = {
            uri: '', // Will be set after saving
            timestamp: date,
            location: {
              latitude: location.latitude + (Math.random() - 0.5) * 0.01,
              longitude: location.longitude + (Math.random() - 0.5) * 0.01,
              accuracy: 10 + Math.random() * 20
            },
            deviceInfo: {
              model: 'ConstructPro Camera',
              platform: 'Expo'
            },
            projectId: batch.projectId,
            tags: [batch.tags[i % batch.tags.length]]
          };
          
          const fileName = `project_photo_${Date.now()}_${photoIndex}.jpg`;
          const filePath = projectDir + fileName;
          const metadataPath = filePath.replace('.jpg', '_metadata.json');
          
          // Create a simple colored rectangle as mock photo
          const mockImageData = this.generateMockImageData(photoIndex + 10);
          await FileSystem.writeAsStringAsync(filePath, mockImageData, {
            encoding: FileSystem.EncodingType.Base64
          });
          
          metadata.uri = filePath;
          await FileSystem.writeAsStringAsync(metadataPath, JSON.stringify(metadata, null, 2));
          
          photoIndex++;
        }
      }
      
      console.log(`Generated ${photoIndex} mock photos`);
      return true;
    } catch (error) {
      console.error('Error generating mock photos:', error);
      return false;
    }
  }
  
  private static generateMockImageData(index: number): string {
    // Generate a simple 100x100 colored square as base64
    // This is a minimal valid JPEG in base64
    const colors = [
      '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKAP/2Q==', // Red
      '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKAAAAAAAAAAAAAAAAA', // Green
      '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhNBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAABBBBBBBBBAAAAAAAAAAAAAAAAAAAAA', // Blue
      '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhNBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAABBBBBBBBBCCCCCCCCCCCCCCCCCCCCCCCCAAAAAAAAA', // Cyan
      '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhNBUQdhcRMiMoEIFUKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMRAABBBBBBBBBEEEEEEEEEEEEEEEEEEEEEEEEAAAAAAAAA', // Magenta
      '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhNBUQdhcRMiMoEIFUKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMRAABBBBBBBBBGGGGGGGGGGGGGGGGGGGGGGGGAAAAAAAAA'  // Yellow
    ];
    
    return colors[index % colors.length];
  }
  
  static async clearAllMockPhotos() {
    try {
      await FileSystem.deleteAsync(this.tempDirectory, { idempotent: true });
      await FileSystem.deleteAsync(this.projectsDirectory, { idempotent: true });
      console.log('Cleared all mock photos');
      return true;
    } catch (error) {
      console.error('Error clearing mock photos:', error);
      return false;
    }
  }
}