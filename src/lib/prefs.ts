// Local preferences + lightweight cache backed by AsyncStorage (Etapa 1, item 5).
//
// AsyncStorage is used for NON-sensitive data (UI preferences, cached lists).
// Sensitive data (the auth token) lives in expo-secure-store — see lib/storage.ts.

import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_KEY = 'voluntariapp.pref.theme';

export async function getThemeMode(): Promise<ThemeMode> {
  try {
    const v = await AsyncStorage.getItem(THEME_KEY);
    if (v === 'light' || v === 'dark' || v === 'system') return v;
  } catch {}
  return 'system';
}

export async function setThemeMode(mode: ThemeMode): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_KEY, mode);
  } catch {}
}

/** Persist any JSON-serializable value under a cache key. */
export async function cacheSet<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(`voluntariapp.cache.${key}`, JSON.stringify(value));
  } catch {}
}

/** Read a previously cached value, or null when missing/corrupt. */
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(`voluntariapp.cache.${key}`);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
