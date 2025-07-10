import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TaskItem } from '@/components/todo/TaskItem';
import { AddItemModal } from '@/components/ui/AddItemModal';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { GradientView } from '@/components/ui/GradientView';
import { useApp } from '@/context/AppContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, addTask, deleteTask, toggleTaskComplete } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  
  const background = useThemeColor({}, 'background');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const tint = useThemeColor({}, 'tint');
  
  const project = state.projects.find(p => p.id === id);
  
  if (!project) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <GradientView style={[styles.container, { backgroundColor: background }]}>
          <ThemedView style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={tint} />
            </TouchableOpacity>
            <ThemedText type="title">Project Not Found</ThemedText>
          </ThemedView>
        </GradientView>
      </>
    );
  }
  
  const completedTasks = project.tasks.filter(task => task.completed).length;
  const totalTasks = project.tasks.length;
  
  const handleTaskLongPress = (taskId: string, taskTitle: string) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${taskTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTask(project.id, taskId),
        },
      ]
    );
  };
  
  const handleAddTask = (title: string) => {
    addTask(project.id, title);
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText type="title" style={styles.emptyTitle}>
        No Tasks Yet
      </ThemedText>
      <ThemedText style={[styles.emptyText, { color: textSecondary }]}>
        Add your first task to get started!
      </ThemedText>
    </View>
  );
  
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <GradientView
        style={[styles.container, { backgroundColor: background }]}
        lightColors={['#f8fafc', '#ffffff']}
        darkColors={['#1a202c', '#2d3748']}
      >
      <ThemedView style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={tint} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <ThemedText type="title" style={styles.headerTitle} numberOfLines={1}>
              {project.title}
            </ThemedText>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.projectInfo}>
          {project.description && (
            <ThemedText style={[styles.description, { color: textSecondary }]} numberOfLines={3}>
              {project.description}
            </ThemedText>
          )}
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <ThemedText style={[styles.statNumber, { color: tint }]}>
                {completedTasks}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: textSecondary }]}>
                Completed
              </ThemedText>
            </View>
            
            <View style={styles.statItem}>
              <ThemedText style={[styles.statNumber, { color: tint }]}>
                {totalTasks - completedTasks}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: textSecondary }]}>
                Remaining
              </ThemedText>
            </View>
            
            <View style={styles.statItem}>
              <ThemedText style={[styles.statNumber, { color: tint }]}>
                {totalTasks}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: textSecondary }]}>
                Total
              </ThemedText>
            </View>
          </View>
        </View>
      </ThemedView>
      
      <FlatList
        data={project.tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={() => toggleTaskComplete(project.id, item.id)}
            onLongPress={() => handleTaskLongPress(item.id, item.title)}
          />
        )}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: 120 }, // Static padding for non-tab screen
          project.tasks.length === 0 && styles.emptyListContainer,
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
        onSubmit={handleAddTask}
        type="task"
      />
    </GradientView>
    </>
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40, // Same width as back button to balance the layout
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  projectInfo: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
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
