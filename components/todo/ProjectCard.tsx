import { ThemedText } from '@/components/ThemedText';
import { GradientView } from '@/components/ui/GradientView';
import { PriorityColors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Project } from '@/models/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
  onLongPress?: () => void;
}

export function ProjectCard({ project, onPress, onLongPress }: ProjectCardProps) {
  const textColor = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const shadowColor = useThemeColor({}, 'shadow');
  
  const completedTasks = project.tasks.filter(task => task.completed).length;
  const totalTasks = project.tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const isCompleted = project.status === 'Completed';
  const priorityColors = project.priority ? PriorityColors[project.priority] : undefined;
  
  const getPriorityIcon = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'flame';
      case 'medium': return 'warning';
      case 'low': return 'leaf';
      default: return null;
    }
  };
  
  const getPriorityLabel = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return '';
    }
  };
  
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.container,
        {
          borderColor,
          shadowColor,
        },
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              <ThemedText type="defaultSemiBold" style={styles.title} numberOfLines={2}>
                {project.title}
              </ThemedText>
              {project.priority && (
                <View style={[
                  styles.priorityBadge,
                  { backgroundColor: PriorityColors[project.priority].light[0] + '20' }
                ]}>
                  <Ionicons
                    name={getPriorityIcon(project.priority) as any}
                    size={12}
                    color={PriorityColors[project.priority].light[0]}
                  />
                </View>
              )}
            </View>
            {project.description && (
              <ThemedText 
                style={[styles.description, { color: textSecondary }]} 
                numberOfLines={2}
              >
                {project.description}
              </ThemedText>
            )}
            {project.priority && (
              <ThemedText style={[styles.priorityText, { color: PriorityColors[project.priority].light[0] }]}>
                {getPriorityLabel(project.priority)}
              </ThemedText>
            )}
          </View>
          <View style={styles.statusContainer}>
            <Ionicons
              name={isCompleted ? 'checkmark-circle' : 'time-outline'}
              size={24}
              color={isCompleted ? '#48bb78' : textSecondary}
            />
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: borderColor }]}>
              <GradientView
                style={[
                  styles.progressFill,
                  { width: `${progressPercentage}%` },
                ]}
                lightColors={isCompleted ? ['#4facfe', '#00f2fe'] : ['#667eea', '#764ba2']}
                darkColors={isCompleted ? ['#4facfe', '#00f2fe'] : ['#667eea', '#764ba2']}
              />
            </View>
            <ThemedText style={[styles.progressText, { color: textSecondary }]}>
              {completedTasks} of {totalTasks} tasks
            </ThemedText>
          </View>
          
          <View style={[
            styles.statusBadge,
            {
              backgroundColor: isCompleted ? '#48bb7820' : '#667eea20',
            },
          ]}>
            <ThemedText
              style={[
                styles.statusText,
                {
                  color: isCompleted ? '#48bb78' : '#667eea',
                },
              ]}
            >
              {project.status}
            </ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Changed from 'center' to handle multi-line text better
    marginBottom: 6, // Increased spacing
  },
  title: {
    fontSize: 18,
    flex: 1,
    lineHeight: 24, // Add explicit line height
  },
  priorityBadge: {
    paddingHorizontal: 6, // Reduced padding
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
    alignSelf: 'flex-start', // Align to top for multi-line titles
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8, // Increased spacing
  },
  priorityText: {
    fontSize: 10, // Slightly smaller
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginRight: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
