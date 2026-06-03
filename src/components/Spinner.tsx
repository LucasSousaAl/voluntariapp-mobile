import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from '@/theme';

export const Spinner = ({ size = 'large' as 'small' | 'large' }) => (
  <View style={styles.wrapper}>
    <ActivityIndicator color={colors.green700} size={size} />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
});
