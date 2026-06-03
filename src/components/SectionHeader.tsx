import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { colors, fonts } from '@/theme';

interface Props {
  title: string;
  action?: string;
  onAction?: () => void;
}

export const SectionHeader = ({ title, action, onAction }: Props) => (
  <View style={styles.row}>
    <Text variant="label">{title}</Text>
    {action ? (
      <Pressable onPress={onAction}>
        <Text style={styles.action}>{action} →</Text>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  action: {
    color: colors.green600,
    fontSize: 13,
    fontFamily: fonts.sansMedium,
  },
});
