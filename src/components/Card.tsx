import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadows } from '@/theme';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle | (ViewStyle | undefined | false)[];
  dark?: boolean;
}

export const Card = ({ children, onPress, style, dark }: Props) => {
  const Wrapper: any = onPress ? Pressable : View;
  const props = onPress
    ? {
        onPress,
        style: ({ pressed }: { pressed: boolean }) => [
          styles.card,
          dark && styles.dark,
          shadows.sm,
          pressed && styles.pressed,
          style as any,
        ],
      }
    : { style: [styles.card, dark && styles.dark, shadows.sm, style as any] };
  return <Wrapper {...props}>{children}</Wrapper>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 22,
  },
  dark: {
    backgroundColor: colors.green900,
  },
  pressed: {
    opacity: 0.95,
    transform: [{ translateY: -1 }],
  },
});
