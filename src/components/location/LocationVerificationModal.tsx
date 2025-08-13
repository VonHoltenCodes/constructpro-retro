import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { RetroColors, RetroComponents, RetroTypography } from '../../styles';
import { ExifExtractor, GPSCoordinates } from '../../utils/exif';
import LocationAccuracyIndicator from './LocationAccuracyIndicator';
import { CameraService } from '../../services/camera';

interface LocationVerificationModalProps {
  visible: boolean;
  photoUri: string;
  onClose: () => void;
  onLocationUpdated: (coordinates: GPSCoordinates) => void;
}

export default function LocationVerificationModal({
  visible,
  photoUri,
  onClose,
  onLocationUpdated,
}: LocationVerificationModalProps) {
  const [exifLocation, setExifLocation] = useState<GPSCoordinates | null>(null);
  const [deviceLocation, setDeviceLocation] = useState<GPSCoordinates | null>(null);
  const [manualLocation, setManualLocation] = useState<GPSCoordinates>({
    latitude: 0,
    longitude: 0,
  });
  const [selectedLocation, setSelectedLocation] = useState<GPSCoordinates | null>(null);
  const [latitudeInput, setLatitudeInput] = useState('');
  const [longitudeInput, setLongitudeInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (visible) {
      loadLocationData();
    }
  }, [visible, photoUri]);

  const loadLocationData = async () => {
    setLoading(true);
    try {
      // Extract EXIF location from photo
      const exifData = await ExifExtractor.extractFromUri(photoUri);
      if (exifData?.gps) {
        setExifLocation(exifData.gps);
        setSelectedLocation(exifData.gps);
        setLatitudeInput(exifData.gps.latitude.toFixed(6));
        setLongitudeInput(exifData.gps.longitude.toFixed(6));
        setMapRegion({
          ...mapRegion,
          latitude: exifData.gps.latitude,
          longitude: exifData.gps.longitude,
        });
      }

      // Get current device location
      const cameraService = CameraService.getInstance();
      const currentLocation = await cameraService.getCurrentLocation();
      if (currentLocation) {
        setDeviceLocation({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          altitude: currentLocation.altitude,
        });
        setAccuracy(currentLocation.accuracy || null);

        // If no EXIF location, use device location
        if (!exifData?.gps) {
          setSelectedLocation(currentLocation);
          setLatitudeInput(currentLocation.latitude.toFixed(6));
          setLongitudeInput(currentLocation.longitude.toFixed(6));
          setMapRegion({
            ...mapRegion,
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          });
        }
      }
    } catch (error) {
      console.error('Error loading location data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    const newLocation: GPSCoordinates = {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    };
    setSelectedLocation(newLocation);
    setManualLocation(newLocation);
    setLatitudeInput(coordinate.latitude.toFixed(6));
    setLongitudeInput(coordinate.longitude.toFixed(6));
  };

  const handleManualInput = () => {
    const lat = parseFloat(latitudeInput);
    const lon = parseFloat(longitudeInput);

    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      Alert.alert('Invalid Coordinates', 'Please enter valid latitude (-90 to 90) and longitude (-180 to 180)');
      return;
    }

    const newLocation: GPSCoordinates = {
      latitude: lat,
      longitude: lon,
    };
    setSelectedLocation(newLocation);
    setManualLocation(newLocation);
    setMapRegion({
      ...mapRegion,
      latitude: lat,
      longitude: lon,
    });
  };

  const handleSaveLocation = async () => {
    if (!selectedLocation) {
      Alert.alert('No Location Selected', 'Please select a location before saving');
      return;
    }

    try {
      // Update photo metadata
      const metadataPath = photoUri.replace('.jpg', '_metadata.json');
      const metadataExists = await FileSystem.getInfoAsync(metadataPath);
      
      if (metadataExists.exists) {
        const metadataString = await FileSystem.readAsStringAsync(metadataPath);
        const metadata = JSON.parse(metadataString);
        
        metadata.location = {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          altitude: selectedLocation.altitude,
          accuracy: accuracy,
          manuallySet: true,
        };

        await FileSystem.writeAsStringAsync(
          metadataPath,
          JSON.stringify(metadata, null, 2)
        );
      }

      onLocationUpdated(selectedLocation);
      onClose();
    } catch (error) {
      console.error('Error saving location:', error);
      Alert.alert('Error', 'Failed to save location. Please try again.');
    }
  };

  const calculateDistance = () => {
    if (exifLocation && deviceLocation) {
      const distance = ExifExtractor.calculateDistance(exifLocation, deviceLocation);
      return distance;
    }
    return null;
  };

  const renderLocationInfo = () => {
    const distance = calculateDistance();

    return (
      <View style={RetroComponents.formSection}>
        <Text style={[RetroTypography.label, { color: RetroColors.primary }]}>
          Location Information
        </Text>
        
        {exifLocation && (
          <View style={RetroComponents.infoRow}>
            <Text style={RetroTypography.smallText}>Photo Location (EXIF):</Text>
            <Text style={[RetroTypography.monoText, { color: RetroColors.accent }]}>
              {ExifExtractor.formatCoordinates(exifLocation)}
            </Text>
          </View>
        )}

        {deviceLocation && (
          <View style={RetroComponents.infoRow}>
            <Text style={RetroTypography.smallText}>Current Device Location:</Text>
            <Text style={[RetroTypography.monoText, { color: RetroColors.secondary }]}>
              {ExifExtractor.formatCoordinates(deviceLocation)}
            </Text>
            {accuracy && <LocationAccuracyIndicator accuracy={accuracy} />}
          </View>
        )}

        {distance !== null && (
          <View style={RetroComponents.infoRow}>
            <Text style={[RetroTypography.smallText, { color: RetroColors.warning }]}>
              Distance: {distance > 1000 ? `${(distance / 1000).toFixed(2)} km` : `${distance.toFixed(0)} m`}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={RetroComponents.modalContainer}>
        <View style={RetroComponents.modalHeader}>
          <Text style={RetroTypography.title}>Verify Location</Text>
          <TouchableOpacity onPress={onClose} style={RetroComponents.closeButton}>
            <Text style={RetroTypography.buttonText}>×</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={RetroComponents.centerContainer}>
            <ActivityIndicator size="large" color={RetroColors.primary} />
            <Text style={RetroTypography.label}>Loading location data...</Text>
          </View>
        ) : (
          <ScrollView style={RetroComponents.modalContent}>
            {renderLocationInfo()}

            <View style={RetroComponents.formSection}>
              <Text style={[RetroTypography.label, { color: RetroColors.primary }]}>
                Manual Coordinate Entry
              </Text>
              
              <View style={RetroComponents.inputRow}>
                <TextInput
                  style={[RetroComponents.textInput, { flex: 1, marginRight: 10 }]}
                  placeholder="Latitude"
                  placeholderTextColor={RetroColors.textDim}
                  value={latitudeInput}
                  onChangeText={setLatitudeInput}
                  keyboardType="numeric"
                />
                <TextInput
                  style={[RetroComponents.textInput, { flex: 1 }]}
                  placeholder="Longitude"
                  placeholderTextColor={RetroColors.textDim}
                  value={longitudeInput}
                  onChangeText={setLongitudeInput}
                  keyboardType="numeric"
                />
              </View>
              
              <TouchableOpacity
                style={[RetroComponents.button, RetroComponents.secondaryButton]}
                onPress={handleManualInput}
              >
                <Text style={RetroTypography.buttonText}>Update Map</Text>
              </TouchableOpacity>
            </View>

            <View style={RetroComponents.mapContainer}>
              <Text style={[RetroTypography.label, { color: RetroColors.primary, marginBottom: 10 }]}>
                Tap to Select Location
              </Text>
              
              <MapView
                style={RetroComponents.map}
                region={mapRegion}
                onRegionChangeComplete={setMapRegion}
                onPress={handleMapPress}
                showsUserLocation={true}
                showsMyLocationButton={true}
              >
                {selectedLocation && (
                  <Marker
                    coordinate={{
                      latitude: selectedLocation.latitude,
                      longitude: selectedLocation.longitude,
                    }}
                    title="Selected Location"
                    pinColor={RetroColors.primary}
                  />
                )}
                
                {exifLocation && !selectedLocation && (
                  <Marker
                    coordinate={{
                      latitude: exifLocation.latitude,
                      longitude: exifLocation.longitude,
                    }}
                    title="Photo Location"
                    pinColor={RetroColors.accent}
                  />
                )}
              </MapView>
            </View>

            <View style={RetroComponents.buttonRow}>
              <TouchableOpacity
                style={[RetroComponents.button, RetroComponents.primaryButton]}
                onPress={handleSaveLocation}
              >
                <Text style={RetroTypography.buttonText}>Save Location</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[RetroComponents.button, RetroComponents.secondaryButton]}
                onPress={onClose}
              >
                <Text style={RetroTypography.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}