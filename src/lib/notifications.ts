// Local notifications via expo-notifications (Etapa 1, item 4 — native resource #2).
//
// This replaces the web PWA's Notifications API. We use LOCAL notifications
// (no push server required): the app asks for permission once and then fires
// notifications in reaction to in-app events (applying to a vaga, publishing a
// vaga, etc.). Permission-denied is handled gracefully by the callers.

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Show notifications even while the app is in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

let configured = false;

async function ensureAndroidChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Geral',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#2d5a3d',
    });
  }
}

/**
 * Ask for notification permission (idempotent).
 * @returns true when granted, false when denied/undetermined.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    if (!configured) {
      await ensureAndroidChannel();
      configured = true;
    }
    const { status } = await Notifications.getPermissionsAsync();
    if (status === 'granted') return true;
    const { status: asked } = await Notifications.requestPermissionsAsync();
    return asked === 'granted';
  } catch {
    return false;
  }
}

/** Fire a local notification immediately. No-op if permission is missing. */
export async function notify(title: string, body: string): Promise<void> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return;
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null, // deliver now
    });
  } catch {
    // ignore — notifications are best-effort
  }
}
