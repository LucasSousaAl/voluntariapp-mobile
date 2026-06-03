import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { Spinner } from '@/components/Spinner';
import { useApp } from '@/context/AppContext';
import { colors, fonts } from '@/theme';

export default function WelcomeScreen() {
  const router = useRouter();
  const { setUserType, currentUserRole, isBootstrapping } = useApp();

  // If we already have a session, hop straight into the app.
  useEffect(() => {
    if (isBootstrapping) return;
    if (currentUserRole === 'ong' || currentUserRole === 'admin') {
      router.replace('/ong');
    } else if (currentUserRole === 'volunteer') {
      router.replace('/home');
    }
  }, [currentUserRole, isBootstrapping, router]);

  if (isBootstrapping) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.green900 }}>
        <Spinner />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.inner}>
        <Image
          source={require('../assets/images/icon-transparent.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          Transforme seu{'\n'}
          <Text style={styles.highlight}>tempo em impacto</Text>
        </Text>

        <Text style={styles.subtitle}>
          Conectamos voluntários a ONGs que precisam de você.
          {'\n'}Juntos construímos um futuro melhor.
        </Text>

        <View style={styles.actions}>
          <Button
            size="lg"
            block
            onPress={() => {
              setUserType('volunteer');
              router.push('/register');
            }}
          >
            Quero me voluntariar →
          </Button>

          <Button
            size="lg"
            variant="dark"
            block
            onPress={() => {
              setUserType('ong');
              router.push('/register');
            }}
          >
            Sou uma ONG
          </Button>
        </View>

        <Button
          variant="ghost"
          onPress={() => router.push('/login')}
          textStyle={{ color: 'rgba(255,255,255,0.7)' }}
        >
          Já tenho uma conta
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.green900,
    padding: 20,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 12,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 36,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 8,
  },
  highlight: {
    color: colors.green300,
    fontStyle: 'italic',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    fontFamily: fonts.sans,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
});
