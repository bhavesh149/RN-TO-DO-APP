import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ProjectCard } from '@/components/todo/ProjectCard';
import { AddItemModal } from '@/components/ui/AddItemModal';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { GradientView } from '@/components/ui/GradientView';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useApp } from '@/context/AppContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

export default function ProjectsScreen() {
  const { state, addProject, deleteProject } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  
  const background = useThemeColor({}, 'background');
  const textSecondary = useThemeColor({}, 'textSecondary');
  
  // Safely get tab bar height
  const getTabBarHeight = () => {
    try {
      return useBottomTabOverflow();
    } catch (error) {
      return 80; // Default tab bar height
    }
  };
  
  const tabBarHeight = getTabBarHeight();
  
  if (state.loading) {
    return <LoadingScreen message="Loading projects..." />;
  }
  
  const handleProjectPress = (projectId: string) => {
    router.push(`/project/${projectId}` as any);
  };
  
  const handleProjectLongPress = (projectId: string, projectTitle: string) => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${projectTitle}"? This will also delete all tasks in this project.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteProject(projectId),
        },
      ]
    );
  };
  
  const handleAddProject = (title: string, description?: string, priority?: 'low' | 'medium' | 'high') => {
    addProject(title, description, priority);
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText type="title" style={styles.emptyTitle}>
        No Projects Yet
      </ThemedText>
      <ThemedText style={[styles.emptyText, { color: textSecondary }]}>
        Create your first project to get started with organizing your tasks!
      </ThemedText>
    </View>
  );
  
  return (
    <GradientView
      style={[styles.container, { backgroundColor: background }]}
      lightColors={['#f8fafc', '#ffffff']}
      darkColors={['#1a202c', '#2d3748']}
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          My Projects
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
          {state.projects.length} {state.projects.length === 1 ? 'project' : 'projects'}
        </ThemedText>
      </ThemedView>
      
      <FlatList
        data={state.projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => handleProjectPress(item.id)}
            onLongPress={() => handleProjectLongPress(item.id, item.title)}
          />
        )}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: Math.max(120, tabBarHeight + 100) }, // Account for FAB and tab bar
          state.projects.length === 0 && styles.emptyListContainer,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
      
      <FloatingActionButton
        onPress={() => setShowAddModal(true)}
        icon="add"
      />
      
      <AddItemModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddProject}
        type="project"
      />
    </GradientView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  listContainer: {
    // paddingBottom will be set dynamically
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
