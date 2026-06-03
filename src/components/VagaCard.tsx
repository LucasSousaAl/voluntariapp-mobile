import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Vaga } from '@/types';
import { Text } from './Text';
import { Card } from './Card';
import { IconBox } from './IconBox';
import { Button } from './Button';
import { AvailabilityTag, CategoryTag, ModalityTag } from './Tag';
import { colors } from '@/theme';
import { useApp } from '@/context/AppContext';

interface Props {
  vaga: Vaga;
}

const iconBgMap: Record<string, string> = {
  '🌱': colors.tagEduBg,
  '🤝': colors.tagSocBg,
  '🌳': colors.tagEnvBg,
  '📚': colors.tagEduBg,
  '💚': colors.tagHltBg,
  '🎨': '#fce8f8',
};

export const VagaCard = ({ vaga }: Props) => {
  const router = useRouter();
  const { setSelectedVaga } = useApp();

  const handleView = () => {
    setSelectedVaga(vaga);
    router.push({ pathname: '/vaga/[id]', params: { id: vaga.id } });
  };

  return (
    <Card onPress={handleView} style={styles.card}>
      <View style={styles.header}>
        <IconBox emoji={vaga.icon} bg={iconBgMap[vaga.icon] || colors.tagEduBg} size={44} />
        <View style={{ flex: 1 }}>
          <Text variant="small" color={colors.gray400}>
            {vaga.ong} · {vaga.city}
          </Text>
          <Text variant="serif" style={{ fontSize: 17, lineHeight: 22 }}>
            {vaga.title}
          </Text>
        </View>
      </View>

      <View style={styles.tagRow}>
        <CategoryTag category={vaga.category} />
        <AvailabilityTag availability={String(vaga.availability)} />
        <ModalityTag modality={vaga.modality} />
      </View>

      <View style={styles.footer}>
        <Text variant="small" color={colors.gray600}>
          👥 {Math.max(0, vaga.totalSlots - vaga.filledSlots)} vagas restantes
        </Text>
        <Button size="sm" onPress={handleView}>
          Ver mais
        </Button>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 14,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
