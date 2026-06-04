import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Palette, radius, shadows } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle | (ViewStyle | undefined | false)[];
  dark?: boolean;
}

export const Card = ({ children, onPress, style, dark }: Props) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
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

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
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
