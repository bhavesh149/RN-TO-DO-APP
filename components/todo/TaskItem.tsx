import { ThemedText } from '@/components/ThemedText';
import { PriorityColors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Task } from '@/models/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onLongPress?: () => void;
}

export function TaskItem({ task, onToggle, onLongPress }: TaskItemProps) {
  const textColor = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const surface = useThemeColor({}, 'surface');
  const success = useThemeColor({}, 'success');
  
  const animatedValue = React.useRef(new Animated.Value(task.completed ? 1 : 0)).current;
  
  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: task.completed ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [task.completed]);
  
  const checkboxColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [borderColor, success],
  });
  
  const textOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.6],
  });
  
  return (
    <TouchableOpacity
      onPress={onToggle}
      onLongPress={onLongPress}
      style={[
        styles.container,
        {
          backgroundColor: surface,
          borderColor,
        },
      ]}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.checkbox,
          {
            borderColor: checkboxColor,
            backgroundColor: task.completed ? success : 'transparent',
          },
        ]}
      >
        {task.completed && (
          <Ionicons name="checkmark" size={16} color="white" />
        )}
      </Animated.View>
      
      <Animated.View style={[styles.content, { opacity: textOpacity }]}>
        <View style={styles.titleRow}>
          <ThemedText
            style={[
              styles.title,
              {
                textDecorationLine: task.completed ? 'line-through' : 'none',
                color: task.completed ? textSecondary : textColor,
              },
            ]}
            numberOfLines={2}
          >
            {task.title}
          </ThemedText>
          {task.priority && (
            <View style={[
              styles.priorityIndicator,
              { backgroundColor: PriorityColors[task.priority].light[0] + '20' }
            ]}>
              <Ionicons
                name={task.priority === 'high' ? 'flame' : task.priority === 'medium' ? 'warning' : 'leaf'}
                size={10}
                color={PriorityColors[task.priority].light[0]}
              />
            </View>
          )}
        </View>
        
        <ThemedText style={[styles.date, { color: textSecondary }]}>
          {task.createdAt.toLocaleDateString()}
        </ThemedText>
      </Animated.View>
      
      <TouchableOpacity
        onPress={onLongPress}
        style={styles.menuButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="ellipsis-horizontal" size={20} color={textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Changed to handle multi-line text better
    justifyContent: 'space-between',
    marginBottom: 6, // Increased spacing
  },
  title: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22, // Add explicit line height
    marginRight: 8, // Add margin to prevent overlap with priority indicator
  },
  priorityIndicator: {
    paddingHorizontal: 4, // Reduced padding
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start', // Align to top for multi-line text
  },
  date: {
    fontSize: 12,
  },
  menuButton: {
    padding: 4,
  },
});
