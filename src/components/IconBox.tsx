import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';

interface Props {
  emoji: string;
  bg?: string;
  size?: number;
}

export const IconBox = ({ emoji, bg = colors.tagEduBg, size = 44 }: Props) => (
  <View
    style={[
      styles.box,
      {
        width: size,
        height: size,
        borderRadius: size * 0.22,
        backgroundColor: bg,
      },
    ]}
  >
    <Text style={{ fontSize: size * 0.5 }}>{emoji}</Text>
  </View>
);

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
