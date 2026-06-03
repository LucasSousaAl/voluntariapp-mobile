import React, { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from './Text';
import { colors, fonts } from '@/theme';

export const OfflineBanner = () => {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      setOffline(!(state.isConnected && state.isInternetReachable !== false));
    });
    return () => unsub();
  }, []);

  if (!offline) return null;

  return (
    <SafeAreaView edges={['top']} style={styles.wrapper} pointerEvents="none">
      <View style={styles.banner}>
        <Text style={styles.text}>📡  Você está offline</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9998,
  },
  banner: {
    backgroundColor: colors.green900,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  text: {
    color: colors.white,
    fontFamily: fonts.sansMedium,
    fontSize: 13,
  },
});
