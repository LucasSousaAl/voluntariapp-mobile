import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

export const Spinner = ({ size = 'large' as 'small' | 'large' }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.wrapper}>
      <ActivityIndicator color={colors.green500} size={size} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
});
