import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts as useLora,
  Lora_400Regular,
  Lora_700Bold,
} from '@expo-google-fonts/lora';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { useFonts } from 'expo-font';
import { AppProvider, useApp } from '@/context/AppContext';
import { ToastProvider } from '@/components/Toast';
import { OfflineBanner } from '@/components/OfflineBanner';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

function ProtectedNavigator() {
  const { currentUserRole, isBootstrapping } = useApp();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isBootstrapping) return;
    const inAuth = segments[0] === '(auth)';
    const onPublic =
      segments[0] === undefined ||
      segments[0] === 'login' ||
      segments[0] === 'register' ||
      segments[0] === 'welcome' ||
      segments[0] === 'index';

    if (currentUserRole === 'guest' && !onPublic && !inAuth) {
      router.replace('/login');
    }
  }, [currentUserRole, isBootstrapping, segments, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.cream },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login/index" />
      <Stack.Screen name="register/index" />
      <Stack.Screen name="home/index" />
      <Stack.Screen name="profile/index" />
      <Stack.Screen name="ong/index" />
      <Stack.Screen name="form/index" />
      <Stack.Screen name="vaga/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loraLoaded] = useLora({ Lora_400Regular, Lora_700Bold });
  const [dmLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });
  const ready = loraLoaded && dmLoaded;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <AppProvider>
        <ToastProvider>
          <StatusBar style="light" />
          <ProtectedNavigator />
          <OfflineBanner />
        </ToastProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
