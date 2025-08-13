import React from 'react';
import { View, Image, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { PhotoMetadata } from './CameraService';
import { RetroComponents, RetroMeasurements } from '../../styles/RetroComponents';
import { RetroTypography } from '../../styles/RetroTypography';
import { RetroColors } from '../../styles/RetroColors';

interface PhotoViewerProps {
  photo: PhotoMetadata | null;
  visible: boolean;
  onClose: () => void;
  onDelete?: (photo: PhotoMetadata) => void;
  onAssign?: (photo: PhotoMetadata) => void;
}

export default function PhotoViewer({ photo, visible, onClose, onDelete, onAssign }: PhotoViewerProps) {
  if (!photo) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: `${RetroColors.darkBg}EE`,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={[
          RetroComponents.card,
          {
            width: '90%',
            maxHeight: '90%',
            padding: 0,
            overflow: 'hidden',
          }
        ]}>
          <View style={{
            padding: RetroMeasurements.spacing.md,
            backgroundColor: RetroColors.darkBg,
            borderBottomWidth: 1,
            borderBottomColor: RetroColors.primary,
          }}>
            <Text style={[RetroTypography.label, { color: RetroColors.primary }]}>
              PHOTO VIEWER
            </Text>
          </View>

          <ScrollView>
            <Image
              source={{ uri: photo.uri }}
              style={{
                width: '100%',
                height: 400,
                backgroundColor: RetroColors.darkBg,
              }}
              resizeMode="contain"
            />

            <View style={{ padding: RetroMeasurements.spacing.md }}>
              <Text style={[RetroTypography.label, { color: RetroColors.primary, marginBottom: RetroMeasurements.spacing.sm }]}>
                METADATA
              </Text>
              
              <View style={{ marginBottom: RetroMeasurements.spacing.md }}>
                <Text style={[RetroTypography.caption, { color: RetroColors.secondary }]}>
                  TIMESTAMP
                </Text>
                <Text style={[RetroTypography.body, { color: RetroColors.text }]}>
                  {new Date(photo.timestamp).toLocaleString()}
                </Text>
              </View>

              {photo.location && (
                <View style={{ marginBottom: RetroMeasurements.spacing.md }}>
                  <Text style={[RetroTypography.caption, { color: RetroColors.secondary }]}>
                    GPS COORDINATES
                  </Text>
                  <Text style={[RetroTypography.body, { color: RetroColors.success }]}>
                    Latitude: {photo.location.latitude.toFixed(6)}
                  </Text>
                  <Text style={[RetroTypography.body, { color: RetroColors.success }]}>
                    Longitude: {photo.location.longitude.toFixed(6)}
                  </Text>
                  {photo.location.altitude && (
                    <Text style={[RetroTypography.body, { color: RetroColors.success }]}>
                      Altitude: {photo.location.altitude.toFixed(2)}m
                    </Text>
                  )}
                  {photo.location.accuracy && (
                    <Text style={[RetroTypography.body, { color: RetroColors.success }]}>
                      Accuracy: ±{photo.location.accuracy.toFixed(2)}m
                    </Text>
                  )}
                </View>
              )}

              {photo.projectId && (
                <View style={{ marginBottom: RetroMeasurements.spacing.md }}>
                  <Text style={[RetroTypography.caption, { color: RetroColors.secondary }]}>
                    PROJECT
                  </Text>
                  <Text style={[RetroTypography.body, { color: RetroColors.text }]}>
                    {photo.projectId}
                  </Text>
                </View>
              )}

              <View style={{ marginBottom: RetroMeasurements.spacing.md }}>
                <Text style={[RetroTypography.caption, { color: RetroColors.secondary }]}>
                  DEVICE
                </Text>
                <Text style={[RetroTypography.body, { color: RetroColors.text }]}>
                  {photo.deviceInfo.model} ({photo.deviceInfo.platform})
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={{
            flexDirection: 'row',
            padding: RetroMeasurements.spacing.md,
            borderTopWidth: 1,
            borderTopColor: RetroColors.primary,
            backgroundColor: RetroColors.darkBg,
          }}>
            <TouchableOpacity
              style={[RetroComponents.buttonPrimary, { flex: 1 }]}
              onPress={onClose}
            >
              <Text style={RetroTypography.buttonText}>CLOSE</Text>
            </TouchableOpacity>
            
            {onAssign && !photo.projectId && (
              <TouchableOpacity
                style={[RetroComponents.buttonPrimary, { flex: 1, marginLeft: RetroMeasurements.spacing.sm }]}
                onPress={() => onAssign(photo)}
              >
                <Text style={RetroTypography.buttonText}>ASSIGN</Text>
              </TouchableOpacity>
            )}
            
            {onDelete && (
              <TouchableOpacity
                style={[RetroComponents.buttonSecondary, { flex: 1, marginLeft: RetroMeasurements.spacing.sm }]}
                onPress={() => onDelete(photo)}
              >
                <Text style={[RetroTypography.buttonText, { color: RetroColors.error }]}>DELETE</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}