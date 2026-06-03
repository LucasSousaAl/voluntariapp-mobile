import React from 'react';
import { View, ViewStyle } from 'react-native';
import { colors } from '@/theme';

export const Divider = ({ color = colors.gray200, style }: { color?: string; style?: ViewStyle }) => (
  <View style={[{ height: 1, backgroundColor: color }, style]} />
);
