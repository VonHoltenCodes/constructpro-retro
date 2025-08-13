import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RetroComponents, RetroMeasurements } from '../styles/RetroComponents';
import { RetroTypography } from '../styles/RetroTypography';
import { RetroColors } from '../styles/RetroColors';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={RetroComponents.container}>
      <ScrollView contentContainerStyle={RetroComponents.scrollContainer}>
        <Text style={[RetroTypography.heading1, { marginBottom: RetroMeasurements.spacing.xl }]}>
          DASHBOARD
        </Text>

        {/* Quick Stats */}
        <View style={RetroComponents.terminalPanel}>
          <Text style={[RetroTypography.label, { marginBottom: RetroMeasurements.spacing.md }]}>
            PROJECT OVERVIEW
          </Text>
          <View style={{ marginBottom: RetroMeasurements.spacing.md }}>
            <Text style={RetroTypography.body}>Active Projects: 3</Text>
            <Text style={RetroTypography.body}>Photos Today: 24</Text>
            <Text style={RetroTypography.body}>Issues Pending: 5</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={[RetroComponents.card, { marginTop: RetroMeasurements.spacing.lg }]}>
          <Text style={[RetroTypography.label, { marginBottom: RetroMeasurements.spacing.md }]}>
            RECENT ACTIVITY
          </Text>
          <View style={RetroComponents.listItem}>
            <Text style={RetroTypography.body}>Photo added to Site A - 5 min ago</Text>
          </View>
          <View style={RetroComponents.listItem}>
            <Text style={RetroTypography.body}>Progress update - Site B - 1 hr ago</Text>
          </View>
          <View style={RetroComponents.listItem}>
            <Text style={RetroTypography.body}>New issue reported - Site C - 2 hrs ago</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ marginTop: RetroMeasurements.spacing.xl }}>
          <TouchableOpacity style={RetroComponents.buttonPrimary}>
            <Text style={RetroTypography.buttonText}>CAPTURE PHOTO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[RetroComponents.buttonSecondary, { marginTop: RetroMeasurements.spacing.md }]}>
            <Text style={[RetroTypography.buttonText, { color: RetroColors.secondary }]}>
              VIEW ALL PROJECTS
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}