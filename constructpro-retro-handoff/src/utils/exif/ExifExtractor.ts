import { load } from 'exifreader';
import * as FileSystem from 'expo-file-system';

export interface GPSCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface ExifData {
  gps?: GPSCoordinates;
  timestamp?: Date;
  camera?: {
    make?: string;
    model?: string;
    software?: string;
  };
  orientation?: number;
  originalWidth?: number;
  originalHeight?: number;
}

export class ExifExtractor {
  /**
   * Extract EXIF data from a photo URI
   */
  static async extractFromUri(uri: string): Promise<ExifData | null> {
    try {
      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to ArrayBuffer
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Extract EXIF data
      const tags = load(bytes.buffer);
      
      return this.parseExifTags(tags);
    } catch (error) {
      console.warn('Failed to extract EXIF data:', error);
      return null;
    }
  }

  /**
   * Parse ExifReader tags into our ExifData structure
   */
  private static parseExifTags(tags: any): ExifData {
    const exifData: ExifData = {};

    // Extract GPS coordinates
    if (tags.GPSLatitude && tags.GPSLongitude) {
      const gps: GPSCoordinates = {
        latitude: this.convertDMSToDecimal(
          tags.GPSLatitude.description,
          tags.GPSLatitudeRef?.value[0] || 'N'
        ),
        longitude: this.convertDMSToDecimal(
          tags.GPSLongitude.description,
          tags.GPSLongitudeRef?.value[0] || 'E'
        ),
      };

      if (tags.GPSAltitude) {
        gps.altitude = tags.GPSAltitude.description;
        if (tags.GPSAltitudeRef?.value === 1) {
          gps.altitude = -gps.altitude; // Below sea level
        }
      }

      exifData.gps = gps;
    }

    // Extract timestamp
    if (tags.DateTimeOriginal) {
      exifData.timestamp = this.parseExifDate(tags.DateTimeOriginal.description);
    } else if (tags.DateTime) {
      exifData.timestamp = this.parseExifDate(tags.DateTime.description);
    }

    // Extract camera information
    const camera: any = {};
    if (tags.Make) camera.make = tags.Make.description;
    if (tags.Model) camera.model = tags.Model.description;
    if (tags.Software) camera.software = tags.Software.description;
    
    if (Object.keys(camera).length > 0) {
      exifData.camera = camera;
    }

    // Extract orientation
    if (tags.Orientation) {
      exifData.orientation = tags.Orientation.value;
    }

    // Extract dimensions
    if (tags.PixelXDimension) {
      exifData.originalWidth = tags.PixelXDimension.value;
    }
    if (tags.PixelYDimension) {
      exifData.originalHeight = tags.PixelYDimension.value;
    }

    return exifData;
  }

  /**
   * Convert DMS (degrees, minutes, seconds) to decimal degrees
   */
  static convertDMSToDecimal(dmsString: string, ref: string): number {
    // Parse DMS string like "40°26'46.3020""
    const matches = dmsString.match(/(\d+)°(\d+)'(\d+\.?\d*)"/);
    if (!matches) return 0;

    const degrees = parseFloat(matches[1]);
    const minutes = parseFloat(matches[2]);
    const seconds = parseFloat(matches[3]);

    let decimal = degrees + minutes / 60 + seconds / 3600;

    // Apply reference (N/S for latitude, E/W for longitude)
    if (ref === 'S' || ref === 'W') {
      decimal = -decimal;
    }

    return decimal;
  }

  /**
   * Parse EXIF date string to JavaScript Date
   */
  private static parseExifDate(dateString: string): Date {
    // EXIF date format: "2023:12:25 14:30:45"
    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split(':');
    const [hour, minute, second] = timePart.split(':');

    return new Date(
      parseInt(year),
      parseInt(month) - 1, // JavaScript months are 0-indexed
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    );
  }

  /**
   * Calculate distance between two GPS coordinates in meters
   */
  static calculateDistance(coord1: GPSCoordinates, coord2: GPSCoordinates): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = coord1.latitude * Math.PI / 180;
    const φ2 = coord2.latitude * Math.PI / 180;
    const Δφ = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const Δλ = (coord2.longitude - coord1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Format GPS coordinates for display
   */
  static formatCoordinates(coordinates: GPSCoordinates, format: 'decimal' | 'dms' = 'decimal'): string {
    if (format === 'decimal') {
      return `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`;
    } else {
      const latDMS = this.decimalToDMS(Math.abs(coordinates.latitude));
      const lonDMS = this.decimalToDMS(Math.abs(coordinates.longitude));
      const latRef = coordinates.latitude >= 0 ? 'N' : 'S';
      const lonRef = coordinates.longitude >= 0 ? 'E' : 'W';
      
      return `${latDMS} ${latRef}, ${lonDMS} ${lonRef}`;
    }
  }

  /**
   * Convert decimal degrees to DMS format
   */
  private static decimalToDMS(decimal: number): string {
    const degrees = Math.floor(decimal);
    const minutesDecimal = (decimal - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = ((minutesDecimal - minutes) * 60).toFixed(2);

    return `${degrees}°${minutes}'${seconds}"`;
  }
}