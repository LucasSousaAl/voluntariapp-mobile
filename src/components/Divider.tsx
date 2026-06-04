import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

export const Divider = ({ color, style }: { color?: string; style?: ViewStyle }) => {
  const { colors } = useTheme();
  return <View style={[{ height: 1, backgroundColor: color ?? colors.gray200 }, style]} />;
};
