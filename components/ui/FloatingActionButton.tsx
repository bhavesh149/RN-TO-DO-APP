import { GradientView } from '@/components/ui/GradientView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: number;
}

export function FloatingActionButton({ 
  onPress, 
  icon = 'add', 
  size = 24 
}: FloatingActionButtonProps) {
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  
  // Safely get tab bar height, fallback to 0 if not in tab navigator
  const getTabBarHeight = () => {
    try {
      return useBottomTabOverflow();
    } catch (error) {
      return 0; // Not inside tab navigator
    }
  };
  
  const tabBarHeight = getTabBarHeight();
  
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleValue }],
          bottom: Math.max(30, tabBarHeight + 16), // Ensure it's above the tab bar
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <GradientView
          style={styles.button}
          lightColors={['#667eea', '#764ba2']}
          darkColors={['#667eea', '#764ba2']}
        >
          <Ionicons name={icon} size={size} color="white" />
        </GradientView>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000, // Ensure it's above other elements
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
