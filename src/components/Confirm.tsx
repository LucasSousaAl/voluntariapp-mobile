import { Alert, Platform } from 'react-native';

/**
 * Cross-platform confirm dialog. On web we fall back to window.confirm
 * because RN's Alert doesn't render there.
 */
export function confirm(
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
): void {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    else onCancel?.();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel', onPress: onCancel },
    { text: 'OK', style: 'destructive', onPress: onConfirm },
  ]);
}
