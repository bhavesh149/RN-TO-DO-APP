import { ThemedText } from '@/components/ThemedText';
import { GradientView } from '@/components/ui/GradientView';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  const background = useThemeColor({}, 'background');
  
  return (
    <GradientView style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#667eea" />
        <ThemedText style={styles.message}>{message}</ThemedText>
      </View>
    </GradientView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
  },
});
