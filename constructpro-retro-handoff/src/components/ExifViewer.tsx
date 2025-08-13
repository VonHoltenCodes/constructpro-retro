import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ExifExtractor, ExifDisplayFormatter, CoordinateUtils } from '../utils/exif';
import { PhotoMetadata } from '../services/camera';
import { RetroComponents, RetroMeasurements } from '../styles/RetroComponents';
import { RetroTypography } from '../styles/RetroTypography';
import { RetroColors } from '../styles/RetroColors';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';

interface ExifViewerProps {
  photoUri: string;
  fallbackMetadata?: PhotoMetadata;
  onClose?: () => void;
}

export default function ExifViewer({ photoUri, fallbackMetadata, onClose }: ExifViewerProps) {
  const [exifData, setExifData] = useState<any>(null);
  const [formattedData, setFormattedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRawData, setShowRawData] = useState(false);

  useEffect(() => {
    extractExifData();
  }, [photoUri]);

  const extractExifData = async () => {
    setIsLoading(true);
    try {
      const data = await ExifExtractor.extractFromUri(photoUri);
      setExifData(data);
      
      const formatted = ExifDisplayFormatter.formatExifData(data, fallbackMetadata);
      setFormattedData(formatted);
    } catch (error) {
      console.error('Error extracting EXIF data:', error);
      // Fall back to app metadata if available
      if (fallbackMetadata) {
        const formatted = ExifDisplayFormatter.formatExifData(null, fallbackMetadata);
        setFormattedData(formatted);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const openInMaps = async () => {
    if (formattedData?.location?.mapUrl) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Linking.openURL(formattedData.location.mapUrl);
    }
  };

  const copyCoordinates = () => {
    if (formattedData?.location?.coordinates) {
      // In a real app, you'd use Clipboard API here
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Copied', 'Coordinates copied to clipboard');
    }
  };

  if (isLoading) {
    return (
      <View style={RetroComponents.container}>
        <ActivityIndicator size="large" color={RetroColors.primary.ORANGE} />
        <Text style={[RetroTypography.body, { marginTop: RetroMeasurements.spacing.MEDIUM }]}>
          Reading photo metadata...
        </Text>
      </View>
    );
  }

  const detailReport = exifData || fallbackMetadata
    ? ExifDisplayFormatter.generateDetailedReport(exifData, fallbackMetadata)
    : 'No metadata available';

  return (
    <ScrollView style={RetroComponents.container}>
      <View style={{ padding: RetroMeasurements.spacing.MEDIUM }}>
        {/* Header */}
        <View style={RetroComponents.header}>
          <Text style={RetroTypography.title}>Photo Metadata</Text>
          {onClose && (
            <TouchableOpacity
              onPress={onClose}
              style={RetroComponents.closeButton}
            >
              <Text style={RetroTypography.button}>Close</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Summary */}
        <View style={[RetroComponents.card, { marginTop: RetroMeasurements.spacing.MEDIUM }]}>
          <Text style={RetroTypography.subtitle}>{formattedData?.summary || 'No metadata found'}</Text>
        </View>

        {/* Timestamp */}
        {formattedData?.timestamp && (
          <View style={[RetroComponents.card, { marginTop: RetroMeasurements.spacing.SMALL }]}>
            <Text style={RetroTypography.label}>Date & Time</Text>
            <Text style={RetroTypography.body}>
              {formattedData.timestamp.date} at {formattedData.timestamp.time}
            </Text>
            <Text style={[RetroTypography.caption, { color: RetroColors.text.SECONDARY }]}>
              {formattedData.timestamp.relative}
            </Text>
          </View>
        )}

        {/* Location */}
        {formattedData?.location && (
          <View style={[RetroComponents.card, { marginTop: RetroMeasurements.spacing.SMALL }]}>
            <Text style={RetroTypography.label}>Location</Text>
            <Text style={[RetroTypography.mono, { marginTop: RetroMeasurements.spacing.TINY }]}>
              {formattedData.location.coordinates}
            </Text>
            {formattedData.location.altitude && (
              <Text style={RetroTypography.caption}>
                Altitude: {formattedData.location.altitude}
              </Text>
            )}
            <View style={RetroComponents.buttonRow}>
              <TouchableOpacity
                style={[RetroComponents.button, RetroComponents.buttonSmall]}
                onPress={openInMaps}
              >
                <Text style={RetroTypography.buttonText}>Open in Maps</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[RetroComponents.button, RetroComponents.buttonSmall, RetroComponents.buttonSecondary]}
                onPress={copyCoordinates}
              >
                <Text style={RetroTypography.buttonText}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Device */}
        {formattedData?.device && (
          <View style={[RetroComponents.card, { marginTop: RetroMeasurements.spacing.SMALL }]}>
            <Text style={RetroTypography.label}>Device</Text>
            <Text style={RetroTypography.body}>{formattedData.device.name}</Text>
            <Text style={RetroTypography.caption}>{formattedData.device.details}</Text>
          </View>
        )}

        {/* Toggle for raw data */}
        <TouchableOpacity
          style={[RetroComponents.button, { marginTop: RetroMeasurements.spacing.MEDIUM }]}
          onPress={() => setShowRawData(!showRawData)}
        >
          <Text style={RetroTypography.buttonText}>
            {showRawData ? 'Hide' : 'Show'} Detailed Report
          </Text>
        </TouchableOpacity>

        {/* Raw data display */}
        {showRawData && (
          <View style={[RetroComponents.card, { marginTop: RetroMeasurements.spacing.SMALL }]}>
            <Text style={[RetroTypography.mono, { fontSize: 12 }]}>{detailReport}</Text>
          </View>
        )}

        {/* No EXIF warning */}
        {!exifData && fallbackMetadata && (
          <View style={[RetroComponents.card, RetroComponents.warning, { marginTop: RetroMeasurements.spacing.MEDIUM }]}>
            <Text style={RetroTypography.caption}>
              Note: EXIF data was not available in this photo. Using app-recorded metadata instead.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}