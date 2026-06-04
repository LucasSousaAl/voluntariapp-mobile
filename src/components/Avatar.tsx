import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { fonts } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';

interface Props {
  initials: string;
  size?: number;
  bg?: string;
}

export const Avatar = ({ initials, size = 40, bg }: Props) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg ?? colors.green600,
        },
      ]}
    >
      <Text
        style={{
          fontFamily: fonts.sansBold,
          color: '#ffffff',
          fontSize: size * 0.35,
        }}
      >
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
