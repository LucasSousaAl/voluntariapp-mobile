import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { Button } from './Button';
import { colors, fonts, radius, shadows } from '@/theme';

interface Props {
  visible: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
  okText?: string;
  cancelText?: string;
  loading?: boolean;
  children: React.ReactNode;
}

export const EditModal = ({
  visible,
  title,
  onCancel,
  onConfirm,
  okText = 'Salvar',
  cancelText = 'Cancelar',
  loading,
  children,
}: Props) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        <SafeAreaView style={styles.center}>
          <View style={[styles.sheet, shadows.lg]}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Pressable onPress={onCancel} hitSlop={10}>
                <Ionicons name="close" size={22} color={colors.gray600} />
              </Pressable>
            </View>
            <ScrollView style={{ maxHeight: 520 }} contentContainerStyle={styles.body}>
              {children}
            </ScrollView>
            <View style={styles.footer}>
              <Button variant="secondary" onPress={onCancel} style={{ flex: 1 }}>
                {cancelText}
              </Button>
              <Button onPress={onConfirm} loading={loading} style={{ flex: 1 }}>
                {okText}
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  center: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.gray800,
  },
  body: {
    padding: 20,
    gap: 14,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
});
