import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { colors, fonts } from '@/theme';

interface Props {
  initials: string;
  size?: number;
  bg?: string;
}

export const Avatar = ({ initials, size = 40, bg = colors.green600 }: Props) => (
  <View
    style={[
      styles.avatar,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
      },
    ]}
  >
    <Text
      style={{
        fontFamily: fonts.sansBold,
        color: colors.white,
        fontSize: size * 0.35,
      }}
    >
      {initials}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
