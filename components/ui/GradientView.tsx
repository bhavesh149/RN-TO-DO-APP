import { useThemeColor } from '@/hooks/useThemeColor';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ColorValue, ViewProps } from 'react-native';

interface GradientViewProps extends ViewProps {
  colors?: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  lightColors?: string[];
  darkColors?: string[];
  children?: React.ReactNode;
}

export function GradientView({
  colors,
  lightColors,
  darkColors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
  children,
  ...rest
}: GradientViewProps) {
  const gradientStart = useThemeColor(
    { light: lightColors?.[0], dark: darkColors?.[0] },
    'gradientStart'
  );
  const gradientEnd = useThemeColor(
    { light: lightColors?.[1], dark: darkColors?.[1] },
    'gradientEnd'
  );

  const gradientColors = colors || [gradientStart, gradientEnd];

  return (
    <LinearGradient
      colors={gradientColors.length >= 2 ? gradientColors as [ColorValue, ColorValue, ...ColorValue[]] : [gradientStart, gradientEnd]}
      start={start}
      end={end}
      style={style}
      {...rest}
    >
      {children}
    </LinearGradient>
  );
}
