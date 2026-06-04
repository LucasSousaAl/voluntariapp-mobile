import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { fonts } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';

interface Props {
  title: string;
  action?: string;
  onAction?: () => void;
}

export const SectionHeader = ({ title, action, onAction }: Props) => {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text variant="label">{title}</Text>
      {action ? (
        <Pressable onPress={onAction}>
          <Text style={[styles.action, { color: colors.green500 }]}>{action} →</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  action: {
    fontSize: 13,
    fontFamily: fonts.sansMedium,
  },
});
