import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from './Text';
import { colors, fonts, radius, shadows } from '@/theme';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastState {
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastState | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (message: string, type: ToastType = 'info') => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setToast({ message, type });
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      timeoutRef.current = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start(() => setToast(null));
      }, 2400);
    },
    [opacity],
  );

  const value: ToastContextValue = {
    show,
    success: (m) => show(m, 'success'),
    error: (m) => show(m, 'error'),
    info: (m) => show(m, 'info'),
    warning: (m) => show(m, 'warning'),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <SafeAreaView
          pointerEvents="none"
          style={styles.wrapper}
          edges={['top']}
        >
          <Animated.View
            style={[styles.toast, styles[toast.type], { opacity }, shadows.md]}
          >
            <Text style={styles.text}>{toast.message}</Text>
          </Animated.View>
        </SafeAreaView>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    marginTop: 12,
    marginHorizontal: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: radius.md,
    maxWidth: 480,
  },
  text: {
    color: colors.white,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
  },
  success: { backgroundColor: colors.green700 },
  error: { backgroundColor: colors.danger },
  info: { backgroundColor: colors.gray800 },
  warning: { backgroundColor: '#b8860b' },
});
