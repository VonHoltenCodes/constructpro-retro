import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';

// Stack Navigator Params
export type DashboardStackParamList = {
  DashboardHome: undefined;
  ProjectDetail: { projectId: string };
};

export type ProjectsStackParamList = {
  ProjectsList: undefined;
  ProjectDetail: { projectId: string };
  NewProject: undefined;
};

export type CameraStackParamList = {
  CameraCapture: undefined;
  PhotoPreview: { photoUri: string };
  PhotoEdit: { photoUri: string };
};

export type GalleryStackParamList = {
  GalleryGrid: undefined;
  PhotoDetail: { photoId: string };
  PhotosByProject: { projectId: string };
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  CameraSettings: undefined;
  StorageSettings: undefined;
  About: undefined;
};

// Bottom Tab Navigator Params
export type RootTabParamList = {
  Dashboard: NavigatorScreenParams<DashboardStackParamList>;
  Projects: NavigatorScreenParams<ProjectsStackParamList>;
  Camera: NavigatorScreenParams<CameraStackParamList>;
  Gallery: NavigatorScreenParams<GalleryStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

// Screen Props Types
export type DashboardScreenProps<T extends keyof DashboardStackParamList> = CompositeScreenProps<
  StackScreenProps<DashboardStackParamList, T>,
  BottomTabScreenProps<RootTabParamList>
>;

export type ProjectsScreenProps<T extends keyof ProjectsStackParamList> = CompositeScreenProps<
  StackScreenProps<ProjectsStackParamList, T>,
  BottomTabScreenProps<RootTabParamList>
>;

export type CameraScreenProps<T extends keyof CameraStackParamList> = CompositeScreenProps<
  StackScreenProps<CameraStackParamList, T>,
  BottomTabScreenProps<RootTabParamList>
>;

export type GalleryScreenProps<T extends keyof GalleryStackParamList> = CompositeScreenProps<
  StackScreenProps<GalleryStackParamList, T>,
  BottomTabScreenProps<RootTabParamList>
>;

export type SettingsScreenProps<T extends keyof SettingsStackParamList> = CompositeScreenProps<
  StackScreenProps<SettingsStackParamList, T>,
  BottomTabScreenProps<RootTabParamList>
>;

// Type declarations for typed navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}