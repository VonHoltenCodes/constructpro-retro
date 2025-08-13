import { ExifData, GPSCoordinates } from './ExifExtractor';
import { PhotoMetadata } from '../../services/camera/CameraService';

export interface FormattedExifDisplay {
  location?: {
    coordinates: string;
    altitude?: string;
    mapUrl?: string;
  };
  timestamp?: {
    date: string;
    time: string;
    relative: string;
  };
  device?: {
    name: string;
    details: string;
  };
  summary: string;
}

export class ExifDisplayFormatter {
  /**
   * Format EXIF data for user-friendly display
   */
  static formatExifData(exifData: ExifData | null, fallbackMetadata?: PhotoMetadata): FormattedExifDisplay {
    const formatted: FormattedExifDisplay = {
      summary: ''
    };

    // Handle location data
    if (exifData?.gps || fallbackMetadata?.location) {
      const gps = exifData?.gps || (fallbackMetadata?.location ? {
        latitude: fallbackMetadata.location.latitude,
        longitude: fallbackMetadata.location.longitude,
        altitude: fallbackMetadata.location.altitude
      } : undefined);

      if (gps) {
        formatted.location = {
          coordinates: this.formatGPSForDisplay(gps),
          altitude: gps.altitude ? this.formatAltitude(gps.altitude) : undefined,
          mapUrl: this.generateMapUrl(gps)
        };
      }
    }

    // Handle timestamp data
    const timestamp = exifData?.timestamp || fallbackMetadata?.timestamp;
    if (timestamp) {
      formatted.timestamp = this.formatTimestamp(timestamp);
    }

    // Handle device data
    if (exifData?.camera || fallbackMetadata?.deviceInfo) {
      formatted.device = this.formatDeviceInfo(
        exifData?.camera,
        fallbackMetadata?.deviceInfo
      );
    }

    // Generate summary
    formatted.summary = this.generateSummary(formatted);

    return formatted;
  }

  /**
   * Format GPS coordinates for display with both formats
   */
  private static formatGPSForDisplay(gps: GPSCoordinates): string {
    const decimal = `${gps.latitude.toFixed(6)}, ${gps.longitude.toFixed(6)}`;
    const dms = this.formatDMS(gps);
    return `${decimal}\n${dms}`;
  }

  /**
   * Format coordinates as DMS (Degrees Minutes Seconds)
   */
  private static formatDMS(gps: GPSCoordinates): string {
    const latDMS = this.decimalToDMS(Math.abs(gps.latitude));
    const lonDMS = this.decimalToDMS(Math.abs(gps.longitude));
    const latRef = gps.latitude >= 0 ? 'N' : 'S';
    const lonRef = gps.longitude >= 0 ? 'E' : 'W';
    
    return `${latDMS} ${latRef}, ${lonDMS} ${lonRef}`;
  }

  /**
   * Convert decimal degrees to DMS format
   */
  private static decimalToDMS(decimal: number): string {
    const degrees = Math.floor(decimal);
    const minutesDecimal = (decimal - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = ((minutesDecimal - minutes) * 60).toFixed(1);

    return `${degrees}°${minutes}'${seconds}"`;
  }

  /**
   * Format altitude for display
   */
  private static formatAltitude(altitude: number): string {
    const meters = altitude.toFixed(1);
    const feet = (altitude * 3.28084).toFixed(0);
    return `${meters}m (${feet}ft)`;
  }

  /**
   * Generate a map URL for the coordinates
   */
  private static generateMapUrl(gps: GPSCoordinates): string {
    return `https://maps.apple.com/?ll=${gps.latitude},${gps.longitude}&z=16`;
  }

  /**
   * Format timestamp for display
   */
  private static formatTimestamp(date: Date): { date: string; time: string; relative: string } {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      relative: this.getRelativeTime(diffMs)
    };
  }

  /**
   * Get relative time string (e.g., "2 hours ago")
   */
  private static getRelativeTime(diffMs: number): string {
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
    if (weeks < 4) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }

  /**
   * Format device information
   */
  private static formatDeviceInfo(
    camera?: { make?: string; model?: string; software?: string },
    deviceInfo?: { model: string; platform: string }
  ): { name: string; details: string } {
    if (camera?.make && camera?.model) {
      const name = `${camera.make} ${camera.model}`.replace(/\s+/g, ' ').trim();
      const details = camera.software || 'Camera';
      return { name, details };
    }

    if (deviceInfo) {
      return {
        name: deviceInfo.model,
        details: deviceInfo.platform
      };
    }

    return {
      name: 'Unknown Device',
      details: 'No device information available'
    };
  }

  /**
   * Generate a human-readable summary
   */
  private static generateSummary(formatted: FormattedExifDisplay): string {
    const parts: string[] = [];

    if (formatted.timestamp) {
      parts.push(`Taken ${formatted.timestamp.relative}`);
    }

    if (formatted.device) {
      parts.push(`with ${formatted.device.name}`);
    }

    if (formatted.location) {
      parts.push('at recorded location');
    }

    return parts.length > 0 ? parts.join(' ') : 'No metadata available';
  }

  /**
   * Format EXIF data as a detailed report
   */
  static generateDetailedReport(exifData: ExifData | null, fallbackMetadata?: PhotoMetadata): string {
    const formatted = this.formatExifData(exifData, fallbackMetadata);
    const lines: string[] = ['Photo Metadata Summary', '=' .repeat(25), ''];

    if (formatted.timestamp) {
      lines.push('Date & Time:');
      lines.push(`  ${formatted.timestamp.date} at ${formatted.timestamp.time}`);
      lines.push(`  (${formatted.timestamp.relative})`);
      lines.push('');
    }

    if (formatted.location) {
      lines.push('Location:');
      lines.push(`  Coordinates: ${formatted.location.coordinates.split('\n')[0]}`);
      lines.push(`  DMS Format: ${formatted.location.coordinates.split('\n')[1]}`);
      if (formatted.location.altitude) {
        lines.push(`  Altitude: ${formatted.location.altitude}`);
      }
      lines.push('');
    }

    if (formatted.device) {
      lines.push('Device:');
      lines.push(`  ${formatted.device.name}`);
      lines.push(`  ${formatted.device.details}`);
      lines.push('');
    }

    if (exifData?.orientation) {
      lines.push(`Orientation: ${this.getOrientationName(exifData.orientation)}`);
      lines.push('');
    }

    if (exifData?.originalWidth && exifData?.originalHeight) {
      lines.push(`Dimensions: ${exifData.originalWidth} × ${exifData.originalHeight} pixels`);
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Get human-readable orientation name
   */
  private static getOrientationName(orientation: number): string {
    const orientations: { [key: number]: string } = {
      1: 'Normal',
      2: 'Flipped Horizontal',
      3: 'Rotated 180°',
      4: 'Flipped Vertical',
      5: 'Flipped Horizontal & Rotated 270° CW',
      6: 'Rotated 90° CW',
      7: 'Flipped Horizontal & Rotated 90° CW',
      8: 'Rotated 270° CW'
    };
    return orientations[orientation] || 'Unknown';
  }
}