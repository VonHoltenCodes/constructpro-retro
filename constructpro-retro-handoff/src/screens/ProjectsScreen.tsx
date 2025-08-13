import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { RetroComponents, RetroMeasurements } from '../styles/RetroComponents';
import { RetroTypography } from '../styles/RetroTypography';
import { RetroColors } from '../styles/RetroColors';
import { ProjectService, Project } from '../services/database';
import CreateProjectModal from '../components/CreateProjectModal';

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadProjects = async () => {
    try {
      const projectList = await ProjectService.getProjects();
      setProjects(projectList);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Load projects when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadProjects();
    }, [])
  );

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadProjects();
  };

  const formatLastUpdate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hr${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
  };
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return RetroColors.success;
      case 'completed': return RetroColors.info;
      case 'pending': return RetroColors.warning;
    }
  };

  const renderProject = ({ item }: { item: Project }) => {
    // Calculate progress based on status
    const progress = item.status === 'completed' ? 100 : item.status === 'active' ? 50 : 0;

    return (
      <TouchableOpacity style={RetroComponents.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={RetroTypography.heading3}>{item.name}</Text>
            <Text style={[RetroTypography.caption, { marginTop: RetroMeasurements.spacing.xs }]}>
              Client: {item.client}
            </Text>
            <Text style={[RetroTypography.caption, { marginTop: RetroMeasurements.spacing.xs }]}>
              Location: {item.location}
            </Text>
            <Text style={[RetroTypography.caption, { marginTop: RetroMeasurements.spacing.xs }]}>
              Last update: {formatLastUpdate(item.updated_at || item.created_at || new Date().toISOString())}
            </Text>
          </View>
          <View style={[
            RetroComponents.statusBadge,
            { borderColor: getStatusColor(item.status), backgroundColor: `${getStatusColor(item.status)}20` }
          ]}>
            <Text style={[RetroTypography.caption, { color: getStatusColor(item.status) }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
        
        {/* Progress Bar */}
        <View style={{ marginTop: RetroMeasurements.spacing.md }}>
          <Text style={RetroTypography.caption}>Progress: {progress}%</Text>
          <View style={[RetroComponents.progressBar, { marginTop: RetroMeasurements.spacing.xs }]}>
            <View style={[RetroComponents.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={RetroComponents.container}>
      <View style={RetroComponents.safeContainer}>
        <Text style={[RetroTypography.heading1, { marginVertical: RetroMeasurements.spacing.lg }]}>
          PROJECTS
        </Text>
        
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={RetroColors.primary} />
          </View>
        ) : projects.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[RetroTypography.body, { textAlign: 'center', color: RetroColors.textSecondary }]}>
              No projects yet.{'\n'}Tap + to create your first project.
            </Text>
          </View>
        ) : (
          <FlatList
            data={projects}
            renderItem={renderProject}
            keyExtractor={item => item.id?.toString() || ''}
            contentContainerStyle={{ paddingBottom: RetroMeasurements.spacing.xl }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={RetroColors.primary}
              />
            }
          />
        )}
      </View>
      
      {/* FAB for adding new project */}
      <TouchableOpacity 
        style={RetroComponents.fabButton}
        onPress={() => setShowCreateModal(true)}
      >
        <Text style={[RetroTypography.heading2, { color: RetroColors.primary }]}>+</Text>
      </TouchableOpacity>

      {/* Create Project Modal */}
      <CreateProjectModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onProjectCreated={loadProjects}
      />
    </SafeAreaView>
  );
}