import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { colors, fonts, radius } from '@/theme';

interface Props extends TextInputProps {
  label?: string;
  required?: boolean;
  error?: string | null;
  /** Use to render a password input with a toggle eye. */
  password?: boolean;
}

export const Input = ({ label, required, error, password, style, ...rest }: Props) => {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);

  return (
    <View style={styles.group}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
      >
        <TextInput
          {...rest}
          style={[styles.input, style as any]}
          secureTextEntry={password ? !show : rest.secureTextEntry}
          placeholderTextColor={colors.gray400}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
        />
        {password && (
          <Pressable onPress={() => setShow((s) => !s)} hitSlop={8}>
            <Ionicons
              name={show ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.gray400}
            />
          </Pressable>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  group: { gap: 6 },
  label: {
    fontFamily: fonts.sansBold,
    color: colors.gray800,
    fontSize: 13,
  },
  required: { color: colors.green600 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.gray200,
    borderRadius: radius.sm,
    backgroundColor: colors.cream,
    paddingHorizontal: 14,
  },
  inputFocused: {
    borderColor: colors.green500,
    backgroundColor: colors.white,
  },
  inputError: { borderColor: colors.danger },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.gray800,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    fontFamily: fonts.sans,
  },
});
