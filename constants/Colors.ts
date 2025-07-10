/**
 * AI-Enhanced Modern color scheme with professional gradients and contemporary design
 * Optimized for productivity and visual hierarchy
 */

const primaryLight = '#667eea';
const primaryDark = '#764ba2';
const accentLight = '#f093fb';
const accentDark = '#f093fb';

// Priority color mappings for enhanced task management
export const PriorityColors = {
  high: {
    light: ['#ff6b6b', '#ee5a24'],
    dark: ['#ff6b6b', '#ee5a24'],
  },
  medium: {
    light: ['#feca57', '#ff9ff3'],
    dark: ['#feca57', '#ff9ff3'],
  },
  low: {
    light: ['#48dbfb', '#0abde3'],
    dark: ['#48dbfb', '#0abde3'],
  },
};

export const Colors = {
  light: {
    text: '#1a202c',
    textSecondary: '#4a5568',
    background: '#ffffff',
    backgroundSecondary: '#f7fafc',
    surface: '#ffffff',
    tint: primaryLight,
    accent: accentLight,
    success: '#48bb78',
    warning: '#ed8936',
    error: '#f56565',
    icon: '#718096',
    tabIconDefault: '#a0aec0',
    tabIconSelected: primaryLight,
    border: '#e2e8f0',
    shadow: '#00000010',
    // Gradient colors
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
    cardGradientStart: '#f093fb',
    cardGradientEnd: '#f5576c',
    successGradientStart: '#4facfe',
    successGradientEnd: '#00f2fe',
  },
  dark: {
    text: '#f7fafc',
    textSecondary: '#a0aec0',
    background: '#1a202c',
    backgroundSecondary: '#2d3748',
    surface: '#2d3748',
    tint: primaryDark,
    accent: accentDark,
    success: '#68d391',
    warning: '#fbb040',
    error: '#fc8181',
    icon: '#a0aec0',
    tabIconDefault: '#718096',
    tabIconSelected: primaryDark,
    border: '#4a5568',
    shadow: '#00000030',
    // Gradient colors
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
    cardGradientStart: '#667eea',
    cardGradientEnd: '#764ba2',
    successGradientStart: '#4facfe',
    successGradientEnd: '#00f2fe',
  },
};
