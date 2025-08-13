# EXIF Utilities

Comprehensive EXIF extraction and formatting utilities for handling photo metadata in the ConstructPro Retro app.

## Features

- Extract GPS coordinates, timestamps, and camera information from photo EXIF data
- Convert between DMS (degrees, minutes, seconds) and decimal coordinate formats
- Calculate distances and bearings between coordinates
- Format metadata for user-friendly display
- Handle photos without EXIF data by falling back to app-stored metadata
- iOS compatibility (handles stripped EXIF scenarios)

## Installation

The utilities use the `exifreader` npm package which is already installed in the project.

## Usage

### Basic EXIF Extraction

```typescript
import { ExifExtractor } from './utils/exif';

// Extract EXIF data from a photo
const exifData = await ExifExtractor.extractFromUri(photoUri);

if (exifData?.gps) {
  console.log('GPS:', exifData.gps.latitude, exifData.gps.longitude);
}
```

### Formatting for Display

```typescript
import { ExifDisplayFormatter } from './utils/exif';

// Format EXIF data for user display
const formatted = ExifDisplayFormatter.formatExifData(exifData, fallbackMetadata);

console.log(formatted.summary); // "Taken 2 hours ago with iPhone 14 Pro at recorded location"
console.log(formatted.location.coordinates); // "40.712800, -74.006000\n40°42'46.1" N, 74°0'21.6" W"
```

### Coordinate Utilities

```typescript
import { CoordinateUtils, ExifExtractor } from './utils/exif';

// Calculate distance between two photos
const distance = ExifExtractor.calculateDistance(coord1, coord2);
console.log(CoordinateUtils.formatDistance(distance)); // "1.5km"

// Get bearing/direction
const bearing = CoordinateUtils.calculateBearing(from, to);
console.log(CoordinateUtils.bearingToCompass(bearing)); // "NE"

// Parse user input
const coords = CoordinateUtils.parseCoordinateString("40.7128, -74.0060");
// Also supports DMS format: "40°42'46.08"N, 74°0'21.6"W"
```

### React Native Component Example

```typescript
import ExifViewer from './components/ExifViewer';

// Display EXIF data in your app
<ExifViewer 
  photoUri={photo.uri}
  fallbackMetadata={photoMetadata}
  onClose={() => setShowExif(false)}
/>
```

## API Reference

### ExifExtractor

- `extractFromUri(uri: string): Promise<ExifData | null>` - Extract EXIF from photo
- `convertDMSToDecimal(dms: string, ref: string): number` - Convert DMS to decimal
- `calculateDistance(coord1, coord2): number` - Distance in meters
- `formatCoordinates(coords, format): string` - Format for display

### ExifDisplayFormatter

- `formatExifData(exifData, fallbackMetadata): FormattedExifDisplay` - Format all metadata
- `generateDetailedReport(exifData, fallbackMetadata): string` - Text report

### CoordinateUtils

- `isValidCoordinate(coord): boolean` - Validate GPS coordinates
- `calculateBearing(from, to): number` - Get compass bearing
- `parseCoordinateString(input): GPSCoordinates | null` - Parse various formats
- `formatDistance(meters): string` - Human-readable distance

## Edge Cases Handled

1. **Photos without EXIF**: Falls back to app-stored metadata
2. **iOS stripped EXIF**: Uses PhotoMetadata from camera service
3. **Invalid coordinates**: Validation and error handling
4. **Missing GPS data**: Graceful degradation
5. **Various date formats**: Robust date parsing

## Testing

Run the test suite:

```bash
npm test src/utils/exif/__tests__/ExifExtractor.test.ts
```

## Examples

See `ExifUsageExample.ts` for comprehensive usage examples including:
- Processing single photos
- Comparing multiple photo locations
- Handling photos without EXIF
- Parsing user coordinate input