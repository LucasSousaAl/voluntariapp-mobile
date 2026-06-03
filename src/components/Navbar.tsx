import React, { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { Text } from './Text';
import { Avatar } from './Avatar';
import { useApp } from '@/context/AppContext';
import { useToast } from './Toast';
import { colors, fonts, shadows } from '@/theme';
import { initialsFromName } from '@/lib/mappers';

interface NavItem {
  href: string;
  label: string;
}

const allItems: NavItem[] = [
  { href: '/home', label: 'Home' },
  { href: '/form', label: 'Criar Vaga' },
  { href: '/ong', label: 'Dashboard ONG' },
  { href: '/profile', label: 'Perfil' },
];

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUserRole, currentUser, signOut } = useApp();
  const toast = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const items = allItems.filter((item) => {
    if (currentUserRole === 'ong' || currentUserRole === 'admin') {
      return item.href !== '/profile';
    }
    return item.href !== '/ong' && item.href !== '/form';
  });

  const handleLogout = async () => {
    await signOut();
    toast.success('Você saiu com sucesso, volte sempre!');
    router.replace('/login');
  };

  const go = (href: string) => {
    setDrawerOpen(false);
    router.push(href as any);
  };

  return (
    <>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <View style={styles.navbar}>
          <Pressable
            style={styles.logo}
            onPress={() => router.push('/home')}
          >
            <Image
              source={require('../../assets/images/icon-transparent.png')}
              style={styles.logoImg}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>VoluntApp</Text>
          </Pressable>

          <Pressable
            onPress={() => setDrawerOpen(true)}
            style={styles.hamburger}
            hitSlop={10}
          >
            <Ionicons name="menu" size={24} color={colors.white} />
          </Pressable>
        </View>
      </SafeAreaView>

      <Modal
        animationType="slide"
        transparent
        visible={drawerOpen}
        onRequestClose={() => setDrawerOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setDrawerOpen(false)} />
        <View style={styles.drawer}>
          <SafeAreaView edges={['top', 'right']} style={{ flex: 1 }}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Menu</Text>
              <Pressable onPress={() => setDrawerOpen(false)} hitSlop={10}>
                <Ionicons name="close" size={24} color={colors.white} />
              </Pressable>
            </View>

            <View style={styles.drawerLinks}>
              {items.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Pressable
                    key={item.href}
                    onPress={() => go(item.href)}
                    style={[styles.drawerLink, active && styles.drawerLinkActive]}
                  >
                    <Text
                      style={[
                        styles.drawerLinkText,
                        active && styles.drawerLinkTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}

              {currentUserRole !== 'guest' && (
                <Pressable
                  onPress={() => {
                    setDrawerOpen(false);
                    handleLogout();
                  }}
                  style={styles.drawerLink}
                >
                  <Text style={[styles.drawerLinkText, { color: '#ffc8c8' }]}>
                    ↗  Sair da conta
                  </Text>
                </Pressable>
              )}
            </View>

            {currentUserRole !== 'ong' && currentUserRole !== 'admin' && currentUser && (
              <Pressable
                onPress={() => go('/profile')}
                style={styles.profileFooter}
              >
                <Avatar initials={initialsFromName(currentUser.nome)} size={40} />
                <Text style={styles.profileName}>{currentUser.nome}</Text>
              </Pressable>
            )}
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.green900,
    ...shadows.sm,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoImg: {
    width: 36,
    height: 36,
  },
  logoText: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.white,
    letterSpacing: -0.3,
  },
  hamburger: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: '80%',
    maxWidth: 320,
    backgroundColor: colors.green900,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  drawerTitle: {
    fontFamily: fonts.serif,
    fontSize: 20,
    color: colors.white,
  },
  drawerLinks: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 4,
  },
  drawerLink: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  drawerLinkActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  drawerLinkText: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
  },
  drawerLinkTextActive: {
    color: colors.white,
  },
  profileFooter: {
    marginTop: 'auto',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileName: {
    fontFamily: fonts.sansBold,
    color: 'rgba(255,255,255,0.7)',
  },
});
