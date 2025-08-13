import { ExifExtractor, ExifDisplayFormatter, CoordinateUtils } from './index';
import { PhotoMetadata } from '../../services/camera/CameraService';

/**
 * Example usage of EXIF utilities
 */
export class ExifUsageExample {
  /**
   * Process a photo and extract all metadata
   */
  static async processPhoto(photoUri: string, fallbackMetadata?: PhotoMetadata) {
    try {
      // 1. Extract EXIF data from photo
      const exifData = await ExifExtractor.extractFromUri(photoUri);
      
      if (!exifData && !fallbackMetadata) {
        console.log('No EXIF data found and no fallback metadata provided');
        return null;
      }

      // 2. Format the data for display
      const formatted = ExifDisplayFormatter.formatExifData(exifData, fallbackMetadata);
      
      console.log('Photo Summary:', formatted.summary);
      
      if (formatted.location) {
        console.log('Location:', formatted.location.coordinates);
        console.log('Map URL:', formatted.location.mapUrl);
      }
      
      if (formatted.timestamp) {
        console.log('Taken:', formatted.timestamp.date, 'at', formatted.timestamp.time);
        console.log('That was', formatted.timestamp.relative);
      }

      // 3. Generate detailed report
      const report = ExifDisplayFormatter.generateDetailedReport(exifData, fallbackMetadata);
      console.log('\nDetailed Report:\n', report);

      return { exifData, formatted, report };
    } catch (error) {
      console.error('Error processing photo:', error);
      return null;
    }
  }

  /**
   * Compare locations of multiple photos
   */
  static async comparePhotoLocations(photoUris: string[]) {
    const locations: { uri: string; coordinates?: any }[] = [];

    // Extract coordinates from each photo
    for (const uri of photoUris) {
      const exifData = await ExifExtractor.extractFromUri(uri);
      if (exifData?.gps) {
        locations.push({ uri, coordinates: exifData.gps });
      }
    }

    if (locations.length < 2) {
      console.log('Need at least 2 photos with GPS data to compare');
      return;
    }

    // Calculate distances between consecutive photos
    for (let i = 1; i < locations.length; i++) {
      const distance = ExifExtractor.calculateDistance(
        locations[i - 1].coordinates,
        locations[i].coordinates
      );
      
      const bearing = CoordinateUtils.calculateBearing(
        locations[i - 1].coordinates,
        locations[i].coordinates
      );
      
      const compass = CoordinateUtils.bearingToCompass(bearing);
      
      console.log(`Photo ${i} is ${CoordinateUtils.formatDistance(distance)} ${compass} from Photo ${i - 1}`);
    }

    // Find center point of all photos
    const allCoordinates = locations.map(l => l.coordinates);
    const center = CoordinateUtils.calculateCenter(allCoordinates);
    
    if (center) {
      console.log('\nCenter point of all photos:', ExifExtractor.formatCoordinates(center));
    }

    // Calculate bounding box
    const bounds = CoordinateUtils.calculateBoundingBox(allCoordinates);
    if (bounds) {
      console.log('\nBounding box:', bounds);
    }
  }

  /**
   * Handle photos without EXIF data
   */
  static handlePhotoWithoutExif(photoUri: string, appMetadata: PhotoMetadata) {
    // When iOS strips EXIF or photo has no EXIF, fall back to app metadata
    const formatted = ExifDisplayFormatter.formatExifData(null, appMetadata);
    
    console.log('Using app metadata for photo:', photoUri);
    console.log('Summary:', formatted.summary);
    
    // You can still use all formatting features
    if (appMetadata.location) {
      const coordinates = {
        latitude: appMetadata.location.latitude,
        longitude: appMetadata.location.longitude,
        altitude: appMetadata.location.altitude
      };
      
      console.log('Formatted coordinates:', ExifExtractor.formatCoordinates(coordinates, 'dms'));
      console.log('Google Maps URL:', CoordinateUtils.generateGoogleMapsUrl(coordinates));
    }
    
    return formatted;
  }

  /**
   * Parse user input coordinates
   */
  static parseUserCoordinates(input: string) {
    const parsed = CoordinateUtils.parseCoordinateString(input);
    
    if (parsed) {
      console.log('Parsed coordinates:', parsed);
      console.log('Decimal format:', ExifExtractor.formatCoordinates(parsed, 'decimal'));
      console.log('DMS format:', ExifExtractor.formatCoordinates(parsed, 'dms'));
      console.log('Valid:', CoordinateUtils.isValidCoordinate(parsed));
    } else {
      console.log('Could not parse coordinates from input:', input);
    }
    
    return parsed;
  }
}