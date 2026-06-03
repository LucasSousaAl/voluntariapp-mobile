import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Text } from './Text';
import { colors, fonts, radius } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  block,
  loading,
  disabled,
  onPress,
  children,
  style,
  textStyle,
}: Props) => {
  const sizeStyle = sizeStyles[size];
  const variantStyles = variantStylesMap[variant];

  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        sizeStyle.container,
        variantStyles.container,
        block && styles.block,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style as any,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.text.color as string} />
      ) : typeof children === 'string' ? (
        <Text style={[sizeStyle.text, variantStyles.text, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    gap: 6,
  },
  block: { width: '100%' },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.6 },
});

const sizeStyles = {
  sm: {
    container: { paddingVertical: 8, paddingHorizontal: 16 },
    text: { fontSize: 13, fontFamily: fonts.sansBold },
  },
  md: {
    container: { paddingVertical: 12, paddingHorizontal: 24 },
    text: { fontSize: 14, fontFamily: fonts.sansBold },
  },
  lg: {
    container: { paddingVertical: 16, paddingHorizontal: 24 },
    text: { fontSize: 16, fontFamily: fonts.sansBold },
  },
};

const variantStylesMap: Record<
  ButtonVariant,
  { container: ViewStyle; text: TextStyle }
> = {
  primary: {
    container: { backgroundColor: colors.green700 },
    text: { color: colors.white },
  },
  secondary: {
    container: { backgroundColor: colors.gray200 },
    text: { color: colors.gray600 },
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.green300,
    },
    text: { color: colors.green700 },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: { color: colors.green700 },
  },
  dark: {
    container: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
    },
    text: { color: colors.white },
  },
};
