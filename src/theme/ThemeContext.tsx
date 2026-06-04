import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import { Palette, palettes } from '@/theme';
import { getThemeMode, setThemeMode, ThemeMode } from '@/lib/prefs';

interface ThemeContextValue {
  /** Active palette — light or dark depending on mode + system scheme. */
  colors: Palette;
  /** Whether dark colors are currently active. */
  isDark: boolean;
  /** User preference: 'light' | 'dark' | 'system'. */
  mode: ThemeMode;
  /** Persist a new preference. */
  setMode: (mode: ThemeMode) => void;
  /** Cycle light → dark → system. */
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [mode, setModeState] = useState<ThemeMode>('system');

  // Restore the persisted preference on mount.
  useEffect(() => {
    getThemeMode().then(setModeState);
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    setThemeMode(next);
  }, []);

  const toggle = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light');
  }, [mode, setMode]);

  const isDark =
    mode === 'dark' || (mode === 'system' && systemScheme === 'dark');

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: isDark ? palettes.dark : palettes.light,
      isDark,
      mode,
      setMode,
      toggle,
    }),
    [isDark, mode, setMode, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
