import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RetroComponents, RetroMeasurements } from '../styles/RetroComponents';
import { RetroTypography } from '../styles/RetroTypography';
import { RetroColors } from '../styles/RetroColors';
import { ProjectService } from '../services/database';

interface CreateProjectModalProps {
  visible: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

export default function CreateProjectModal({ visible, onClose, onProjectCreated }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [client, setClient] = useState('');
  const [status, setStatus] = useState<'active' | 'pending' | 'completed'>('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validate fields
    if (!name.trim() || !location.trim() || !client.trim()) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setIsSubmitting(true);
    try {
      await ProjectService.createProject({
        name: name.trim(),
        location: location.trim(),
        client: client.trim(),
        status
      });

      // Reset form
      setName('');
      setLocation('');
      setClient('');
      setStatus('pending');

      // Notify parent
      onProjectCreated();
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
      Alert.alert('Error', 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StatusButton = ({ value, label }: { value: typeof status; label: string }) => (
    <TouchableOpacity
      style={[
        RetroComponents.button,
        {
          flex: 1,
          marginHorizontal: RetroMeasurements.spacing.xs,
          backgroundColor: status === value ? RetroColors.primary : RetroColors.surface,
          borderColor: status === value ? RetroColors.primary : RetroColors.border,
        }
      ]}
      onPress={() => setStatus(value)}
    >
      <Text style={[
        RetroTypography.button,
        { color: status === value ? RetroColors.background : RetroColors.primary }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <View style={[
            RetroComponents.card,
            {
              margin: 0,
              borderRadius: 0,
              paddingTop: RetroMeasurements.spacing.xl,
              paddingBottom: RetroMeasurements.spacing.xl,
              maxHeight: '80%'
            }
          ]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[RetroTypography.heading2, { marginBottom: RetroMeasurements.spacing.lg }]}>
                NEW PROJECT
              </Text>

              {/* Project Name */}
              <View style={{ marginBottom: RetroMeasurements.spacing.lg }}>
                <Text style={[RetroTypography.label, { marginBottom: RetroMeasurements.spacing.xs }]}>
                  PROJECT NAME
                </Text>
                <TextInput
                  style={RetroComponents.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter project name"
                  placeholderTextColor={RetroColors.textSecondary}
                />
              </View>

              {/* Location */}
              <View style={{ marginBottom: RetroMeasurements.spacing.lg }}>
                <Text style={[RetroTypography.label, { marginBottom: RetroMeasurements.spacing.xs }]}>
                  LOCATION
                </Text>
                <TextInput
                  style={RetroComponents.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Enter project location"
                  placeholderTextColor={RetroColors.textSecondary}
                />
              </View>

              {/* Client */}
              <View style={{ marginBottom: RetroMeasurements.spacing.lg }}>
                <Text style={[RetroTypography.label, { marginBottom: RetroMeasurements.spacing.xs }]}>
                  CLIENT
                </Text>
                <TextInput
                  style={RetroComponents.input}
                  value={client}
                  onChangeText={setClient}
                  placeholder="Enter client name"
                  placeholderTextColor={RetroColors.textSecondary}
                />
              </View>

              {/* Status */}
              <View style={{ marginBottom: RetroMeasurements.spacing.xl }}>
                <Text style={[RetroTypography.label, { marginBottom: RetroMeasurements.spacing.sm }]}>
                  STATUS
                </Text>
                <View style={{ flexDirection: 'row', marginHorizontal: -RetroMeasurements.spacing.xs }}>
                  <StatusButton value="pending" label="PENDING" />
                  <StatusButton value="active" label="ACTIVE" />
                  <StatusButton value="completed" label="COMPLETED" />
                </View>
              </View>

              {/* Action Buttons */}
              <View style={{ flexDirection: 'row', marginTop: RetroMeasurements.spacing.lg }}>
                <TouchableOpacity
                  style={[RetroComponents.button, { flex: 1, marginRight: RetroMeasurements.spacing.sm }]}
                  onPress={onClose}
                  disabled={isSubmitting}
                >
                  <Text style={RetroTypography.button}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    RetroComponents.button,
                    {
                      flex: 1,
                      marginLeft: RetroMeasurements.spacing.sm,
                      backgroundColor: RetroColors.primary,
                      borderColor: RetroColors.primary,
                      opacity: isSubmitting ? 0.5 : 1
                    }
                  ]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  <Text style={[RetroTypography.button, { color: RetroColors.background }]}>
                    {isSubmitting ? 'CREATING...' : 'CREATE'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}