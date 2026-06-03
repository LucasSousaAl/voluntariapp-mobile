import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { colors } from '@/theme';

interface Props {
  value: number;
  max: number;
  showLabel?: boolean;
}

export const ProgressBar = ({ value, max, showLabel = true }: Props) => {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <View style={styles.row}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      {showLabel && (
        <Text variant="small" color={colors.gray400}>
          {value} / {max}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 160,
  },
  track: {
    flex: 1,
    height: 6,
    backgroundColor: colors.gray200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.green500,
    borderRadius: 3,
  },
});
