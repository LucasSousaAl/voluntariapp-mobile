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
import { geocodeAddress } from '@/lib/geocode';
import { SessionUser } from '@/types';
import { fonts, Palette, radius, shadows } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';

export default function RegisterScreen() {
  const router = useRouter();
  const toast = useToast();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { userType, setUserType, signIn, setCurrentUserRole } = useApp();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    password: '',
    telefone: '',
    localidade: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.nome) next.nome = 'Insira seu nome/nome da ONG';
    if (!form.email) next.email = 'Insira seu e-mail';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'E-mail inválido';
    if (!form.password || form.password.length < 6)
      next.password = 'Crie uma senha de no mínimo 6 caracteres';
    if (userType === 'ong') {
      if (!form.telefone) next.telefone = 'Insira um telefone para a ONG';
      if (!form.localidade)
        next.localidade = 'Insira uma localidade para seus eventos';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const userResp = await api.post<{ token: string; user: SessionUser }>(
        '/auth/register',
        {
          nome: form.nome,
          email: form.email,
          password: form.password,
          city: form.localidade || 'Não informado',
          state: 'SP',
          interestArea: 'Outros',
          availability: 'Integral',
          modality: 'Remoto',
          role: userType,
        },
      );

      await signIn({ token: userResp.token, user: userResp.user });

      if (userType === 'ong') {
        let coords: { lat: number; lng: number } | null = null;
        if (form.localidade) {
          coords = await geocodeAddress(form.localidade);
          if (!coords) {
            toast.warning('Não foi possível localizar o endereço no mapa.');
          }
        }

        try {
          await api.post('/ong', {
            nome: form.nome,
            email: form.email,
            localidade: form.localidade || 'Não informado',
            telefone: form.telefone || '000000000',
            ...(coords ? { latitude: coords.lat, longitude: coords.lng } : {}),
          });
        } catch (err: any) {
          toast.error(err?.message || 'Falha ao cadastrar detalhes da ONG');
          return;
        }
      }

      setCurrentUserRole(userType);
      toast.success('Cadastro realizado com sucesso!');
      router.replace(userType === 'ong' ? '/ong' : '/home');
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao registrar usuário');
    } finally {
      setLoading(false);
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
              <Text style={styles.title}>Criar uma conta</Text>

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
                  ? 'Faça parte de uma comunidade que transforma!'
                  : 'Encontre os melhores voluntários para sua causa!'}
              </Text>
            </View>

            <View style={styles.form}>
              <Input
                label="Nome"
                placeholder="Nome completo"
                value={form.nome}
                onChangeText={set('nome')}
                error={errors.nome}
              />
              <Input
                label="E-mail"
                placeholder="seu@email.com"
                value={form.email}
                onChangeText={set('email')}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                error={errors.email}
              />

              {userType === 'ong' && (
                <>
                  <Input
                    label="Telefone"
                    placeholder="(11) 99999-9999"
                    value={form.telefone}
                    onChangeText={set('telefone')}
                    keyboardType="phone-pad"
                    error={errors.telefone}
                  />
                  <Input
                    label="Endereço / Localidade"
                    placeholder="Av. Paulista, 1200 - São Paulo"
                    value={form.localidade}
                    onChangeText={set('localidade')}
                    error={errors.localidade}
                  />
                </>
              )}

              <Input
                label="Senha"
                placeholder="••••••••"
                value={form.password}
                onChangeText={set('password')}
                password
                autoCapitalize="none"
                error={errors.password}
              />

              <Button size="lg" block onPress={handleSubmit} loading={loading}>
                Criar Conta →
              </Button>
            </View>

            <View style={styles.footer}>
              <Text variant="small">Já tem uma conta? </Text>
              <Pressable onPress={() => router.push('/login')}>
                <Text style={styles.link}>Faça login</Text>
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
    form: { gap: 14 },
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
