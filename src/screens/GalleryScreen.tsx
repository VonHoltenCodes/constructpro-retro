import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { RetroComponents, RetroMeasurements } from '../styles/RetroComponents';
import { RetroTypography } from '../styles/RetroTypography';
import { RetroColors } from '../styles/RetroColors';
import PhotoStorageService, { Photo, PhotoFilter } from '../services/storage/PhotoStorageService';
import ExifViewer from '../components/ExifViewer';
import { ExifExtractor } from '../utils/exif';
import * as Haptics from 'expo-haptics';
import { MockPhotoGenerator } from '../utils/mockData/mockPhotoGenerator';

const { width: screenWidth } = Dimensions.get('window');
const COLUMNS = 3;
const SPACING = RetroMeasurements.spacing.sm;
const imageSize = (screenWidth - SPACING * (COLUMNS + 1)) / COLUMNS;

export default function GalleryScreen() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showMetadata, setShowMetadata] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [showProjectPicker, setShowProjectPicker] = useState(false);

  // Mock projects - in real app would come from storage
  const mockProjects = [
    { id: '1', name: 'Site A - Office Complex' },
    { id: '2', name: 'Site B - Residential' },
    { id: '3', name: 'Site C - Warehouse' },
    { id: '4', name: 'Site D - Retail Center' }
  ];

  useFocusEffect(
    useCallback(() => {
      loadPhotos();
    }, [])
  );

  useEffect(() => {
    applyFilters();
  }, [photos, selectedFilter, searchText]);

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const allPhotos = await PhotoStorageService.getAllPhotos();
      setPhotos(allPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
      Alert.alert('Error', 'Failed to load photos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = async () => {
    let filter: PhotoFilter = {};
    
    switch (selectedFilter) {
      case 'unassigned':
        filter.isUnassigned = true;
        break;
      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filter.startDate = today;
        break;
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filter.startDate = weekAgo;
        break;
    }
    
    if (searchText) {
      filter.searchText = searchText;
    }
    
    const filtered = await PhotoStorageService.filterPhotos(photos, filter);
    setFilteredPhotos(filtered);
  };

  const togglePhotoSelection = (photoId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPhotoIds(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handlePhotoPress = (photo: Photo) => {
    if (selectionMode) {
      togglePhotoSelection(photo.id);
    } else {
      setSelectedPhoto(photo);
      setShowMetadata(true);
    }
  };

  const handleAssignToProject = async (projectId: string) => {
    setShowProjectPicker(false);
    
    const success = await PhotoStorageService.assignPhotosToProject(selectedPhotoIds, projectId);
    if (success) {
      Alert.alert('Success', `${selectedPhotoIds.length} photos assigned to project`);
      setSelectionMode(false);
      setSelectedPhotoIds([]);
      loadPhotos();
    } else {
      Alert.alert('Error', 'Failed to assign photos to project');
    }
  };

  const handleDeleteSelected = () => {
    Alert.alert(
      'Delete Photos',
      `Are you sure you want to delete ${selectedPhotoIds.length} photos?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await PhotoStorageService.deletePhotos(selectedPhotoIds);
            if (success) {
              setSelectionMode(false);
              setSelectedPhotoIds([]);
              loadPhotos();
            } else {
              Alert.alert('Error', 'Failed to delete photos');
            }
          }
        }
      ]
    );
  };

  const handleGenerateMockPhotos = async () => {
    setLoading(true);
    const success = await MockPhotoGenerator.generateMockPhotos();
    if (success) {
      Alert.alert('Success', 'Mock photos generated');
      loadPhotos();
    } else {
      Alert.alert('Error', 'Failed to generate mock photos');
      setLoading(false);
    }
  };

  const renderPhoto = ({ item }: { item: Photo }) => {
    const isSelected = selectedPhotoIds.includes(item.id);
    const coords = item.metadata.location || item.exifData?.gps;
    const timestamp = new Date(item.metadata.timestamp);
    
    return (
      <TouchableOpacity
        style={{
          width: imageSize,
          height: imageSize,
          margin: SPACING / 2,
          position: 'relative'
        }}
        onPress={() => handlePhotoPress(item)}
        onLongPress={() => {
          if (!selectionMode) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            setSelectionMode(true);
            setSelectedPhotoIds([item.id]);
          }
        }}
      >
        {/* Photo with retro border */}
        <View style={{
          width: '100%',
          height: '100%',
          borderWidth: 2,
          borderColor: item.isUnassigned ? RetroColors.warning : RetroColors.primary,
          backgroundColor: RetroColors.darkBg,
          shadowColor: item.isUnassigned ? RetroColors.warning : RetroColors.primary,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 4,
          elevation: 5
        }}>
          <Image
            source={{ uri: item.uri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          
          {/* Metadata overlay */}
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: `${RetroColors.darkBg}E6`,
            padding: 4,
            borderTopWidth: 1,
            borderTopColor: RetroColors.primary
          }}>
            <Text style={[RetroTypography.small, { 
              color: item.isUnassigned ? RetroColors.warning : RetroColors.primary,
              fontSize: 10
            }]}>
              {item.projectName || 'UNASSIGNED'}
            </Text>
            <Text style={[RetroTypography.small, { color: RetroColors.textSecondary, fontSize: 9 }]}>
              {timestamp.toLocaleDateString()} {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {coords && (
              <Text style={[RetroTypography.small, { color: RetroColors.accent, fontSize: 8 }]}>
                {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}
              </Text>
            )}
          </View>
          
          {/* Selection indicator */}
          {selectionMode && (
            <View style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 24,
              height: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: RetroColors.primary,
              backgroundColor: isSelected ? RetroColors.primary : 'transparent',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isSelected && (
                <Text style={{ color: RetroColors.darkBg, fontWeight: 'bold' }}>✓</Text>
              )}
            </View>
          )}
          
          {/* Unassigned indicator */}
          {item.isUnassigned && (
            <View style={{
              position: 'absolute',
              top: 4,
              left: 4,
              backgroundColor: RetroColors.warning,
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 2
            }}>
              <Text style={[RetroTypography.small, { color: RetroColors.darkBg, fontSize: 10, fontWeight: 'bold' }]}>
                NEW
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const filters = [
    { id: 'all', label: 'ALL' },
    { id: 'unassigned', label: 'UNASSIGNED' },
    { id: 'today', label: 'TODAY' },
    { id: 'week', label: 'THIS WEEK' }
  ];

  if (loading) {
    return (
      <SafeAreaView style={RetroComponents.container}>
        <View style={[RetroComponents.safeContainer, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={RetroColors.primary} />
          <Text style={[RetroTypography.body, { marginTop: RetroMeasurements.spacing.md }]}>
            LOADING PHOTOS...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={RetroComponents.container}>
      <View style={RetroComponents.safeContainer}>
        {/* Header */}
        <View style={{ marginVertical: RetroMeasurements.spacing.md }}>
          <Text style={RetroTypography.heading1}>PHOTO GALLERY</Text>
          {selectionMode && (
            <Text style={[RetroTypography.caption, { color: RetroColors.accent }]}>
              {selectedPhotoIds.length} SELECTED
            </Text>
          )}
        </View>

        {/* Search Bar */}
        <View style={[RetroComponents.terminalPanel, { 
          marginBottom: RetroMeasurements.spacing.md,
          flexDirection: 'row',
          alignItems: 'center'
        }]}>
          <Text style={[RetroTypography.mono, { marginRight: RetroMeasurements.spacing.sm }]}>
            SEARCH:
          </Text>
          <TextInput
            style={[RetroTypography.mono, { 
              flex: 1,
              color: RetroColors.text,
              padding: 0
            }]}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="location, date, or tag..."
            placeholderTextColor={RetroColors.textSecondary}
          />
        </View>

        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: RetroMeasurements.spacing.md }}
        >
          {filters.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                RetroComponents.statusBadge,
                {
                  marginRight: RetroMeasurements.spacing.sm,
                  borderColor: selectedFilter === filter.id ? RetroColors.primary : RetroColors.lightAccent,
                  backgroundColor: selectedFilter === filter.id ? `${RetroColors.primary}30` : 'transparent'
                }
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                RetroTypography.caption,
                { color: selectedFilter === filter.id ? RetroColors.primary : RetroColors.textSecondary }
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Photo Count */}
        <View style={[RetroComponents.terminalPanel, { marginBottom: RetroMeasurements.spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <Text style={RetroTypography.body}>
            {filteredPhotos.length} PHOTOS
            {filteredPhotos.filter(p => p.isUnassigned).length > 0 && (
              <Text style={{ color: RetroColors.warning }}>
                {' '}({filteredPhotos.filter(p => p.isUnassigned).length} UNASSIGNED)
              </Text>
            )}
          </Text>
          {filteredPhotos.length === 0 && (
            <TouchableOpacity
              style={[RetroComponents.button, { paddingVertical: 4, paddingHorizontal: 8 }]}
              onPress={handleGenerateMockPhotos}
            >
              <Text style={[RetroTypography.buttonText, { fontSize: 12 }]}>GENERATE TEST PHOTOS</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Selection Mode Actions */}
        {selectionMode && (
          <View style={{ 
            flexDirection: 'row', 
            marginBottom: RetroMeasurements.spacing.md,
            gap: RetroMeasurements.spacing.sm
          }}>
            <TouchableOpacity
              style={[RetroComponents.button, { flex: 1 }]}
              onPress={() => setShowProjectPicker(true)}
            >
              <Text style={RetroTypography.buttonText}>ASSIGN TO PROJECT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[RetroComponents.button, RetroComponents.buttonDanger, { flex: 1 }]}
              onPress={handleDeleteSelected}
            >
              <Text style={RetroTypography.buttonText}>DELETE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[RetroComponents.button, RetroComponents.buttonSecondary]}
              onPress={() => {
                setSelectionMode(false);
                setSelectedPhotoIds([]);
              }}
            >
              <Text style={RetroTypography.buttonText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Photo Grid */}
        <FlatList
          data={filteredPhotos}
          renderItem={renderPhoto}
          keyExtractor={item => item.id}
          numColumns={COLUMNS}
          contentContainerStyle={{ paddingBottom: RetroMeasurements.spacing.lg }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadPhotos();
              }}
              tintColor={RetroColors.primary}
            />
          }
        />

        {/* Metadata Modal */}
        <Modal
          visible={showMetadata && selectedPhoto !== null}
          animationType="slide"
          onRequestClose={() => setShowMetadata(false)}
        >
          {selectedPhoto && (
            <ExifViewer
              photoUri={selectedPhoto.uri}
              fallbackMetadata={selectedPhoto.metadata}
              onClose={() => {
                setShowMetadata(false);
                setSelectedPhoto(null);
              }}
            />
          )}
        </Modal>

        {/* Project Picker Modal */}
        <Modal
          visible={showProjectPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowProjectPicker(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.8)',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <View style={[RetroComponents.terminalPanel, {
              width: '80%',
              maxHeight: '60%',
              padding: RetroMeasurements.spacing.lg
            }]}>
              <Text style={[RetroTypography.heading2, { marginBottom: RetroMeasurements.spacing.md }]}>
                SELECT PROJECT
              </Text>
              <ScrollView>
                {mockProjects.map(project => (
                  <TouchableOpacity
                    key={project.id}
                    style={[RetroComponents.button, { marginBottom: RetroMeasurements.spacing.sm }]}
                    onPress={() => handleAssignToProject(project.id)}
                  >
                    <Text style={RetroTypography.buttonText}>{project.name.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={[RetroComponents.button, RetroComponents.buttonSecondary, { marginTop: RetroMeasurements.spacing.md }]}
                onPress={() => setShowProjectPicker(false)}
              >
                <Text style={RetroTypography.buttonText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}