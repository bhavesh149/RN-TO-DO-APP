import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GradientView } from '@/components/ui/GradientView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { PriorityColors } from '@/constants/Colors';
import { useApp } from '@/context/AppContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const { state } = useApp();
  const background = useThemeColor({}, 'background');
  const surface = useThemeColor({}, 'surface');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const tint = useThemeColor({}, 'tint');
  
  // Safely get tab bar height
  const getTabBarHeight = () => {
    try {
      return useBottomTabOverflow();
    } catch (error) {
      return 80; // Default tab bar height
    }
  };
  
  const tabBarHeight = getTabBarHeight();
  
  // Analytics calculations
  const totalProjects = state.projects.length;
  const completedProjects = state.projects.filter(p => p.status === 'Completed').length;
  const totalTasks = state.projects.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTasks = state.projects.reduce((sum, p) => sum + p.tasks.filter(t => t.completed).length, 0);
  
  // Priority analytics
  const highPriorityProjects = state.projects.filter(p => p.priority === 'high').length;
  const mediumPriorityProjects = state.projects.filter(p => p.priority === 'medium').length;
  const lowPriorityProjects = state.projects.filter(p => p.priority === 'low').length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const projectCompletionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;
  
  // AI-generated insights
  const generateInsights = () => {
    const insights = [];
    
    if (completionRate > 80) {
      insights.push("🚀 Excellent progress! You're completing most of your tasks.");
    } else if (completionRate > 50) {
      insights.push("📈 Good momentum! Keep pushing to complete more tasks.");
    } else if (completionRate > 0) {
      insights.push("💪 Getting started! Focus on completing smaller tasks first.");
    }
    
    if (highPriorityProjects > 0 && completedProjects === 0) {
      insights.push("🔥 You have high-priority projects that need attention.");
    }
    
    if (totalProjects > 5 && projectCompletionRate < 20) {
      insights.push("🎯 Consider focusing on fewer projects to improve completion rate.");
    }
    
    if (totalTasks === 0) {
      insights.push("✨ Start by adding some tasks to track your progress!");
    }
    
    return insights.length > 0 ? insights : ["📊 Keep adding projects and tasks to see insights!"];
  };
  
  const handleOpenGitHub = () => {
    Linking.openURL('https://github.com/bhavesh149/RN-TO-DO-APP');
  };
  
  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    color = tint,
    gradientColors 
  }: { 
    title: string; 
    value: string | number; 
    subtitle: string;
    color?: string;
    gradientColors?: string[];
  }) => (
    <GradientView 
      style={[styles.statCard, { width: (width - 60) / 2, minHeight: 100 }]} // Add minHeight
      lightColors={gradientColors || ['#667eea', '#764ba2']}
      darkColors={gradientColors || ['#667eea', '#764ba2']}
    >
      <ThemedText style={[styles.statValue, { color: 'white' }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </ThemedText>
      <ThemedText style={[styles.statTitle, { color: 'white' }]} numberOfLines={1} adjustsFontSizeToFit>
        {title}
      </ThemedText>
      <ThemedText style={[styles.statSubtitle, { color: 'rgba(255,255,255,0.8)' }]} numberOfLines={2}>
        {subtitle}
      </ThemedText>
    </GradientView>
  );
  
  const PriorityChart = () => (
    <View style={[styles.chartContainer, { backgroundColor: surface, borderColor }]}>
      <ThemedText type="subtitle" style={styles.chartTitle}>Priority Distribution</ThemedText>
      
      <View style={styles.priorityBars}>
        <View style={styles.priorityItem}>
          <View style={styles.priorityLabel}>
            <Ionicons name="flame" size={16} color={PriorityColors.high.light[0]} />
            <ThemedText style={styles.priorityText}>High</ThemedText>
          </View>
          <View style={styles.barContainer}>
            <GradientView
              style={[
                styles.priorityBar,
                { 
                  width: totalProjects > 0 ? `${(highPriorityProjects / totalProjects) * 100}%` : '0%',
                  minWidth: highPriorityProjects > 0 ? 20 : 0,
                }
              ]}
              lightColors={PriorityColors.high.light}
              darkColors={PriorityColors.high.dark}
            />
          </View>
          <ThemedText style={[styles.priorityCount, { color: textSecondary }]}>
            {highPriorityProjects}
          </ThemedText>
        </View>
        
        <View style={styles.priorityItem}>
          <View style={styles.priorityLabel}>
            <Ionicons name="warning" size={16} color={PriorityColors.medium.light[0]} />
            <ThemedText style={styles.priorityText}>Medium</ThemedText>
          </View>
          <View style={styles.barContainer}>
            <GradientView
              style={[
                styles.priorityBar,
                { 
                  width: totalProjects > 0 ? `${(mediumPriorityProjects / totalProjects) * 100}%` : '0%',
                  minWidth: mediumPriorityProjects > 0 ? 20 : 0,
                }
              ]}
              lightColors={PriorityColors.medium.light}
              darkColors={PriorityColors.medium.dark}
            />
          </View>
          <ThemedText style={[styles.priorityCount, { color: textSecondary }]}>
            {mediumPriorityProjects}
          </ThemedText>
        </View>
        
        <View style={styles.priorityItem}>
          <View style={styles.priorityLabel}>
            <Ionicons name="leaf" size={16} color={PriorityColors.low.light[0]} />
            <ThemedText style={styles.priorityText}>Low</ThemedText>
          </View>
          <View style={styles.barContainer}>
            <GradientView
              style={[
                styles.priorityBar,
                { 
                  width: totalProjects > 0 ? `${(lowPriorityProjects / totalProjects) * 100}%` : '0%',
                  minWidth: lowPriorityProjects > 0 ? 20 : 0,
                }
              ]}
              lightColors={PriorityColors.low.light}
              darkColors={PriorityColors.low.dark}
            />
          </View>
          <ThemedText style={[styles.priorityCount, { color: textSecondary }]}>
            {lowPriorityProjects}
          </ThemedText>
        </View>
      </View>
    </View>
  );
  
  const InsightsCard = () => {
    const insights = generateInsights();
    
    return (
      <View style={[styles.insightsContainer, { backgroundColor: surface, borderColor }]}>
        <View style={styles.insightsHeader}>
          <GradientView 
            style={styles.insightsIconContainer}
            lightColors={['#667eea', '#764ba2']}
            darkColors={['#667eea', '#764ba2']}
          >
            <Ionicons name="bulb" size={20} color="white" />
          </GradientView>
          <ThemedText type="subtitle" style={styles.insightsTitle}>AI Insights</ThemedText>
        </View>
        
        {insights.map((insight, index) => (
          <GradientView 
            key={index} 
            style={styles.insightItem}
            lightColors={['rgba(102, 126, 234, 0.05)', 'rgba(118, 75, 162, 0.05)']}
            darkColors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)']}
          >
            <View style={styles.insightIconWrapper}>
              <Ionicons 
                name="sparkles" 
                size={16} 
                color={tint} 
                style={styles.insightIcon}
              />
            </View>
            <ThemedText style={[styles.insightText, { color: textSecondary }]}>
              {insight}
            </ThemedText>
          </GradientView>
        ))}
      </View>
    );
  };
  
  return (
    <GradientView
      style={[styles.container, { backgroundColor: background }]}
      lightColors={['#f8fafc', '#ffffff']}
      darkColors={['#1a202c', '#2d3748']}
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Analytics
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
          Your productivity insights
        </ThemedText>
      </ThemedView>
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(40, tabBarHeight + 20) }}
      >
        <View style={styles.statsContainer}>
          <StatCard
            title="Completion Rate"
            value={`${completionRate}%`}
            subtitle="Tasks completed"
            gradientColors={['#4facfe', '#00f2fe']}
          />
          <StatCard
            title="Projects"
            value={completedProjects}
            subtitle={`of ${totalProjects} completed`}
            gradientColors={['#f093fb', '#f5576c']}
          />
        </View>
        
        <View style={styles.statsContainer}>
          <StatCard
            title="Active Tasks"
            value={totalTasks - completedTasks}
            subtitle="Tasks remaining"
            gradientColors={['#667eea', '#764ba2']}
          />
          <StatCard
            title="Total Tasks"
            value={totalTasks}
            subtitle="All time"
            gradientColors={['#48bb78', '#38a169']}
          />
        </View>
        
        <PriorityChart />
        
        <InsightsCard />
        
        <View style={[styles.aboutContainer, { backgroundColor: surface, borderColor }]}>
          <View style={styles.aboutHeader}>
            <GradientView 
              style={styles.aboutIconContainer}
              lightColors={['#4facfe', '#00f2fe']}
              darkColors={['#4facfe', '#00f2fe']}
            >
              <Ionicons name="information-circle" size={20} color="white" />
            </GradientView>
            <ThemedText type="subtitle">About To-Do Atlas</ThemedText>
          </View>
          
          <TouchableOpacity style={styles.aboutItem} onPress={handleOpenGitHub}>
            <Ionicons name="logo-github" size={20} color={tint} />
            <View style={styles.aboutText}>
              <ThemedText type="defaultSemiBold">View on GitHub</ThemedText>
              <ThemedText style={[styles.aboutSubtext, { color: textSecondary }]}>
                Source code and documentation
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={textSecondary} />
          </TouchableOpacity>
          
          <View style={styles.aboutItem}>
            <Ionicons name="cube-outline" size={20} color={tint} />
            <View style={styles.aboutText}>
              <ThemedText type="defaultSemiBold">Version 1.0.0</ThemedText>
              <ThemedText style={[styles.aboutSubtext, { color: textSecondary }]}>
                Built with React Native, Expo & TypeScript
              </ThemedText>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <ThemedText style={[styles.footerText, { color: textSecondary }]}>
            Made with ❤️ by Bhavesh Mahajan
          </ThemedText>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    padding: 12, // Reduced padding
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center', // Center content
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 28, // Reduced font size
    fontWeight: 'bold',
    marginBottom: 4,
    padding: 4, // Added padding for better touch target
  },
  statTitle: {
    fontSize: 14, // Reduced font size
    marginBottom: 2,
    fontWeight: '600',
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 11, // Reduced font size
    textAlign: 'center',
    lineHeight: 14,
  },
  chartContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: '600',
  },
  priorityBars: {
    gap: 12,
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priorityLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 70, // Reduced width to prevent text overflow
  },
  priorityText: {
    fontSize: 12, // Reduced font size
    fontWeight: '500',
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  priorityBar: {
    height: '100%',
    borderRadius: 4,
  },
  priorityCount: {
    fontSize: 14,
    fontWeight: '600',
    width: 30,
    textAlign: 'right',
  },
  insightsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  insightsIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 10,
  },
  insightIconWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  insightIcon: {
    opacity: 0.7,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  aboutContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // Increased gap to match insights
    padding: 20,
    paddingBottom: 12,
  },
  aboutIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
  },
  aboutText: {
    flex: 1,
    marginLeft: 12,
  },
  aboutSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
