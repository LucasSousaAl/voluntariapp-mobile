import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { colors, fonts } from '@/theme';

interface Props {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export const Chip = ({ label, active, onPress }: Props) => {
  const Wrapper: any = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      style={[styles.chip, active && styles.active]}
    >
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.gray200,
    backgroundColor: colors.white,
  },
  active: {
    backgroundColor: colors.green700,
    borderColor: colors.green700,
  },
  text: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.gray600,
  },
  activeText: { color: colors.white },
});
