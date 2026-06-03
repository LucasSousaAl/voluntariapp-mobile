import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { colors, fonts } from '@/theme';

interface Props extends TextProps {
  variant?:
    | 'body'
    | 'bodyBold'
    | 'serif'
    | 'serifLg'
    | 'serifXl'
    | 'label'
    | 'muted'
    | 'small';
  color?: string;
}

const variants: Record<NonNullable<Props['variant']>, any> = {
  body: { fontFamily: fonts.sans, fontSize: 15, color: colors.gray800, lineHeight: 22 },
  bodyBold: { fontFamily: fonts.sansBold, fontSize: 15, color: colors.gray800 },
  serif: { fontFamily: fonts.serif, fontSize: 18, color: colors.gray800 },
  serifLg: { fontFamily: fonts.serif, fontSize: 22, color: colors.gray800 },
  serifXl: { fontFamily: fonts.serif, fontSize: 32, color: colors.gray800, lineHeight: 38 },
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    color: colors.gray400,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  muted: { fontFamily: fonts.sans, fontSize: 14, color: colors.gray400 },
  small: { fontFamily: fonts.sans, fontSize: 12, color: colors.gray600 },
};

export const Text = ({ variant = 'body', color, style, children, ...rest }: Props) => {
  return (
    <RNText
      {...rest}
      style={StyleSheet.flatten([variants[variant], color ? { color } : null, style])}
    >
      {children}
    </RNText>
  );
};
