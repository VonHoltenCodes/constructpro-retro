import { ExifExtractor, CoordinateUtils, ExifDisplayFormatter } from '../index';

describe('ExifExtractor', () => {
  describe('DMS to Decimal conversion', () => {
    it('should convert DMS to decimal correctly', () => {
      // New York: 40°42'51"N, 74°0'21"W
      expect(ExifExtractor.convertDMSToDecimal('40°42\'51"', 'N')).toBeCloseTo(40.714167, 5);
      expect(ExifExtractor.convertDMSToDecimal('74°0\'21"', 'W')).toBeCloseTo(-74.005833, 5);
      
      // Sydney: 33°52'4"S, 151°12'26"E
      expect(ExifExtractor.convertDMSToDecimal('33°52\'4"', 'S')).toBeCloseTo(-33.867778, 5);
      expect(ExifExtractor.convertDMSToDecimal('151°12\'26"', 'E')).toBeCloseTo(151.207222, 5);
    });
  });

  describe('Distance calculation', () => {
    it('should calculate distance between coordinates', () => {
      const nyc = { latitude: 40.7128, longitude: -74.0060 };
      const london = { latitude: 51.5074, longitude: -0.1278 };
      
      const distance = ExifExtractor.calculateDistance(nyc, london);
      // NYC to London is approximately 5570 km
      expect(distance).toBeGreaterThan(5500000);
      expect(distance).toBeLessThan(5600000);
    });

    it('should return 0 for same coordinates', () => {
      const coord = { latitude: 40.7128, longitude: -74.0060 };
      const distance = ExifExtractor.calculateDistance(coord, coord);
      expect(distance).toBe(0);
    });
  });

  describe('Coordinate formatting', () => {
    it('should format coordinates in decimal', () => {
      const coord = { latitude: 40.712800, longitude: -74.006000 };
      const formatted = ExifExtractor.formatCoordinates(coord, 'decimal');
      expect(formatted).toBe('40.712800, -74.006000');
    });

    it('should format coordinates in DMS', () => {
      const coord = { latitude: 40.7128, longitude: -74.0060 };
      const formatted = ExifExtractor.formatCoordinates(coord, 'dms');
      expect(formatted).toMatch(/40°\d+'\d+\.\d+" N, 74°\d+'\d+\.\d+" W/);
    });
  });
});

describe('CoordinateUtils', () => {
  describe('Coordinate validation', () => {
    it('should validate valid coordinates', () => {
      expect(CoordinateUtils.isValidCoordinate({ latitude: 0, longitude: 0 })).toBe(true);
      expect(CoordinateUtils.isValidCoordinate({ latitude: 90, longitude: 180 })).toBe(true);
      expect(CoordinateUtils.isValidCoordinate({ latitude: -90, longitude: -180 })).toBe(true);
    });

    it('should reject invalid coordinates', () => {
      expect(CoordinateUtils.isValidCoordinate({ latitude: 91, longitude: 0 })).toBe(false);
      expect(CoordinateUtils.isValidCoordinate({ latitude: 0, longitude: 181 })).toBe(false);
      expect(CoordinateUtils.isValidCoordinate({ latitude: -91, longitude: 0 })).toBe(false);
    });
  });

  describe('Bearing calculation', () => {
    it('should calculate bearing correctly', () => {
      const from = { latitude: 40.7128, longitude: -74.0060 }; // NYC
      const to = { latitude: 41.8781, longitude: -87.6298 }; // Chicago
      
      const bearing = CoordinateUtils.calculateBearing(from, to);
      const compass = CoordinateUtils.bearingToCompass(bearing);
      
      // NYC to Chicago is roughly west
      expect(compass).toMatch(/W/);
    });
  });

  describe('Center calculation', () => {
    it('should calculate center of coordinates', () => {
      const coords = [
        { latitude: 40, longitude: -74 },
        { latitude: 42, longitude: -72 },
        { latitude: 41, longitude: -73 }
      ];
      
      const center = CoordinateUtils.calculateCenter(coords);
      expect(center).not.toBeNull();
      expect(center!.latitude).toBe(41);
      expect(center!.longitude).toBe(-73);
    });
  });

  describe('Coordinate parsing', () => {
    it('should parse decimal format', () => {
      const parsed = CoordinateUtils.parseCoordinateString('40.7128, -74.0060');
      expect(parsed).toEqual({ latitude: 40.7128, longitude: -74.0060 });
    });

    it('should parse DMS format', () => {
      const parsed = CoordinateUtils.parseCoordinateString('40°42\'46.08"N, 74°0\'21.6"W');
      expect(parsed).not.toBeNull();
      expect(parsed!.latitude).toBeCloseTo(40.7128, 3);
      expect(parsed!.longitude).toBeCloseTo(-74.006, 3);
    });
  });

  describe('Distance formatting', () => {
    it('should format short distances in meters', () => {
      expect(CoordinateUtils.formatDistance(500)).toBe('500m');
      expect(CoordinateUtils.formatDistance(999)).toBe('999m');
    });

    it('should format medium distances in km with decimals', () => {
      expect(CoordinateUtils.formatDistance(1500)).toBe('1.50km');
      expect(CoordinateUtils.formatDistance(5250)).toBe('5.25km');
    });

    it('should format long distances in km without decimals', () => {
      expect(CoordinateUtils.formatDistance(15000)).toBe('15km');
      expect(CoordinateUtils.formatDistance(100000)).toBe('100km');
    });
  });
});

describe('ExifDisplayFormatter', () => {
  describe('Timestamp formatting', () => {
    it('should format timestamps correctly', () => {
      const exifData = {
        timestamp: new Date('2024-01-15T14:30:00')
      };
      
      const formatted = ExifDisplayFormatter.formatExifData(exifData, undefined);
      expect(formatted.timestamp).toBeDefined();
      expect(formatted.timestamp!.date).toContain('January 15, 2024');
      expect(formatted.timestamp!.time).toMatch(/2:30 PM/);
    });
  });

  describe('Summary generation', () => {
    it('should generate summary with all data', () => {
      const exifData = {
        timestamp: new Date(),
        gps: { latitude: 40.7128, longitude: -74.0060 },
        camera: { make: 'Apple', model: 'iPhone 14 Pro' }
      };
      
      const formatted = ExifDisplayFormatter.formatExifData(exifData, undefined);
      expect(formatted.summary).toContain('Taken');
      expect(formatted.summary).toContain('with');
      expect(formatted.summary).toContain('at recorded location');
    });

    it('should handle missing EXIF with fallback', () => {
      const fallback = {
        uri: 'test.jpg',
        timestamp: new Date(),
        location: { latitude: 40.7128, longitude: -74.0060 },
        deviceInfo: { model: 'iPhone', platform: 'iOS' }
      };
      
      const formatted = ExifDisplayFormatter.formatExifData(null, fallback);
      expect(formatted.location).toBeDefined();
      expect(formatted.device).toBeDefined();
    });
  });

  describe('Detailed report generation', () => {
    it('should generate comprehensive report', () => {
      const exifData = {
        timestamp: new Date('2024-01-15T14:30:00'),
        gps: { latitude: 40.7128, longitude: -74.0060, altitude: 100 },
        camera: { make: 'Apple', model: 'iPhone 14 Pro' },
        orientation: 1,
        originalWidth: 4032,
        originalHeight: 3024
      };
      
      const report = ExifDisplayFormatter.generateDetailedReport(exifData, undefined);
      expect(report).toContain('Photo Metadata Summary');
      expect(report).toContain('Date & Time:');
      expect(report).toContain('Location:');
      expect(report).toContain('Device:');
      expect(report).toContain('Orientation: Normal');
      expect(report).toContain('Dimensions: 4032 × 3024 pixels');
    });
  });
});