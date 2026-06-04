import React, { useMemo, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/Toast';
import { api } from '@/lib/api';
import { useMutation } from '@/hooks/useMutation';
import { SessionUser } from '@/types';
import { fonts, Palette, radius, shadows } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';

export default function LoginScreen() {
  const router = useRouter();
  const toast = useToast();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { userType, setUserType, signIn } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const login = useMutation((body: { email: string; password: string }) =>
    api.post<{ token: string; user: SessionUser }>('/auth/login', body),
  );

  const validate = () => {
    const next: typeof errors = {};
    if (!email) next.email = 'Por favor, insira seu e-mail';
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Insira um e-mail válido';
    if (!password) next.password = 'Por favor, insira sua senha';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const data = await login.mutate({ email, password });
      await signIn({ token: data.token, user: data.user });
      toast.success('Login bem-sucedido!');
      if (data.user.role === 'ong' || data.user.role === 'admin') {
        router.replace('/ong');
      } else {
        router.replace('/home');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Falha no login');
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <Image
                source={require('../../assets/images/icon-transparent.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>Bem-vindo de volta</Text>

              <View style={styles.toggleRow}>
                <Button
                  size="sm"
                  variant={userType === 'volunteer' ? 'primary' : 'secondary'}
                  onPress={() => setUserType('volunteer')}
                >
                  Voluntário
                </Button>
                <Button
                  size="sm"
                  variant={userType === 'ong' ? 'primary' : 'secondary'}
                  onPress={() => setUserType('ong')}
                >
                  ONG
                </Button>
              </View>

              <Text style={styles.subtitle}>
                {userType === 'volunteer'
                  ? 'Entre para continuar transformando vidas'
                  : 'Entre para continuar gerenciando suas causas'}
              </Text>
            </View>

            <View style={styles.form}>
              <Input
                label="E-mail"
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                error={errors.email}
              />
              <Input
                label="Senha"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                password
                autoCapitalize="none"
                error={errors.password}
              />
              <Button size="lg" block onPress={handleSubmit} loading={login.loading}>
                Entrar →
              </Button>
            </View>

            <View style={styles.footer}>
              <Text variant="small">Ainda não tem uma conta? </Text>
              <Pressable onPress={() => router.push('/register')}>
                <Text style={styles.link}>Cadastre-se</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.green900,
    },
    scroll: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 20,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: 24,
      paddingTop: 32,
      maxWidth: 440,
      width: '100%',
      alignSelf: 'center',
      ...shadows.lg,
    },
    header: {
      alignItems: 'center',
      marginBottom: 24,
      gap: 12,
    },
    logo: { width: 56, height: 56 },
    title: {
      fontFamily: fonts.serif,
      fontSize: 28,
      color: colors.gray800,
      textAlign: 'center',
    },
    toggleRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 4,
    },
    subtitle: {
      fontFamily: fonts.sans,
      color: colors.gray600,
      fontSize: 15,
      textAlign: 'center',
    },
    form: {
      gap: 14,
    },
    footer: {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    link: {
      color: colors.green500,
      fontFamily: fonts.sansBold,
      fontSize: 13,
    },
  });
