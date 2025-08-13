import { GPSCoordinates } from './ExifExtractor';

export class CoordinateUtils {
  /**
   * Validate GPS coordinates
   */
  static isValidCoordinate(coord: GPSCoordinates): boolean {
    return (
      typeof coord.latitude === 'number' &&
      typeof coord.longitude === 'number' &&
      coord.latitude >= -90 &&
      coord.latitude <= 90 &&
      coord.longitude >= -180 &&
      coord.longitude <= 180
    );
  }

  /**
   * Calculate bearing (compass direction) between two points
   */
  static calculateBearing(from: GPSCoordinates, to: GPSCoordinates): number {
    const φ1 = from.latitude * Math.PI / 180;
    const φ2 = to.latitude * Math.PI / 180;
    const Δλ = (to.longitude - from.longitude) * Math.PI / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    const θ = Math.atan2(y, x);
    const bearing = (θ * 180 / Math.PI + 360) % 360;

    return bearing;
  }

  /**
   * Get compass direction from bearing
   */
  static bearingToCompass(bearing: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                       'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(bearing / 22.5) % 16;
    return directions[index];
  }

  /**
   * Calculate the center point of multiple coordinates
   */
  static calculateCenter(coordinates: GPSCoordinates[]): GPSCoordinates | null {
    if (coordinates.length === 0) return null;

    let sumLat = 0;
    let sumLon = 0;
    let sumAlt = 0;
    let altCount = 0;

    for (const coord of coordinates) {
      sumLat += coord.latitude;
      sumLon += coord.longitude;
      if (coord.altitude !== undefined) {
        sumAlt += coord.altitude;
        altCount++;
      }
    }

    const center: GPSCoordinates = {
      latitude: sumLat / coordinates.length,
      longitude: sumLon / coordinates.length
    };

    if (altCount > 0) {
      center.altitude = sumAlt / altCount;
    }

    return center;
  }

  /**
   * Calculate bounding box for a set of coordinates
   */
  static calculateBoundingBox(coordinates: GPSCoordinates[]): {
    north: number;
    south: number;
    east: number;
    west: number;
  } | null {
    if (coordinates.length === 0) return null;

    let north = -90;
    let south = 90;
    let east = -180;
    let west = 180;

    for (const coord of coordinates) {
      north = Math.max(north, coord.latitude);
      south = Math.min(south, coord.latitude);
      east = Math.max(east, coord.longitude);
      west = Math.min(west, coord.longitude);
    }

    return { north, south, east, west };
  }

  /**
   * Format distance for display
   */
  static formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${meters.toFixed(0)}m`;
    } else if (meters < 10000) {
      return `${(meters / 1000).toFixed(2)}km`;
    } else {
      return `${(meters / 1000).toFixed(0)}km`;
    }
  }

  /**
   * Parse coordinate string in various formats
   */
  static parseCoordinateString(input: string): GPSCoordinates | null {
    // Try to parse decimal format: "40.7128, -74.0060"
    const decimalMatch = input.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
    if (decimalMatch) {
      return {
        latitude: parseFloat(decimalMatch[1]),
        longitude: parseFloat(decimalMatch[2])
      };
    }

    // Try to parse DMS format: "40°26'46.3"N, 74°0'21.5"W"
    const dmsMatch = input.match(/(\d+)°(\d+)'([\d.]+)"([NS]),?\s*(\d+)°(\d+)'([\d.]+)"([EW])/);
    if (dmsMatch) {
      const latDegrees = parseInt(dmsMatch[1]);
      const latMinutes = parseInt(dmsMatch[2]);
      const latSeconds = parseFloat(dmsMatch[3]);
      const latRef = dmsMatch[4];

      const lonDegrees = parseInt(dmsMatch[5]);
      const lonMinutes = parseInt(dmsMatch[6]);
      const lonSeconds = parseFloat(dmsMatch[7]);
      const lonRef = dmsMatch[8];

      let latitude = latDegrees + latMinutes / 60 + latSeconds / 3600;
      let longitude = lonDegrees + lonMinutes / 60 + lonSeconds / 3600;

      if (latRef === 'S') latitude = -latitude;
      if (lonRef === 'W') longitude = -longitude;

      return { latitude, longitude };
    }

    return null;
  }

  /**
   * Generate Google Maps URL
   */
  static generateGoogleMapsUrl(coord: GPSCoordinates): string {
    return `https://www.google.com/maps/search/?api=1&query=${coord.latitude},${coord.longitude}`;
  }

  /**
   * Generate Apple Maps URL
   */
  static generateAppleMapsUrl(coord: GPSCoordinates): string {
    return `https://maps.apple.com/?ll=${coord.latitude},${coord.longitude}&z=16`;
  }

  /**
   * Check if coordinate is within a radius of another coordinate
   */
  static isWithinRadius(
    coord1: GPSCoordinates,
    coord2: GPSCoordinates,
    radiusMeters: number
  ): boolean {
    const distance = this.calculateDistance(coord1, coord2);
    return distance <= radiusMeters;
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private static calculateDistance(coord1: GPSCoordinates, coord2: GPSCoordinates): number {
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
}