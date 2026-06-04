import React, { useMemo } from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Navbar } from '@/components/Navbar';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { IconBox } from '@/components/IconBox';
import { CategoryTag, ModalityTag } from '@/components/Tag';
import { Spinner } from '@/components/Spinner';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/Toast';
import { api, API_BASE_URL } from '@/lib/api';
import { useFetch } from '@/hooks/useFetch';
import { useMutation } from '@/hooks/useMutation';
import { notify } from '@/lib/notifications';
import { mapTrabalhoToVaga } from '@/lib/mappers';
import { Vaga } from '@/types';
import { fonts, Palette, radius, shadows } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';

export default function VagaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { selectedVaga } = useApp();

  const needFetch = !!id && (!selectedVaga || selectedVaga.id !== id);

  // Custom data hook — only fetches when we don't already hold the vaga.
  const { data: vaga, loading } = useFetch<Vaga | null>('/trabalho', {
    query: { id },
    enabled: needFetch,
    initialData: selectedVaga,
    select: (raw) =>
      Array.isArray(raw) && raw.length > 0 ? mapTrabalhoToVaga(raw[0]) : null,
  });

  // Custom mutation hook for the apply action.
  const apply = useMutation((trabalhoId: number) =>
    api.post('/trabalho/apply', { trabalho_id: trabalhoId }),
  );

  const handleApply = async () => {
    if (!vaga) return;
    try {
      await apply.mutate(parseInt(vaga.id, 10));
      toast.success('Inscrição realizada com sucesso!');
      notify('Inscrição confirmada 🎉', `Você se candidatou para "${vaga.title}".`);
      router.replace('/profile');
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao realizar inscrição.');
    }
  };

  const handleShare = async () => {
    if (!vaga) return;
    const url = `${API_BASE_URL}/vaga?id=${vaga.id}`;
    try {
      await Share.share({
        title: vaga.title,
        message: `Confira esta vaga de voluntariado na ${vaga.ong}: ${vaga.title}\n\nVeja mais detalhes em: ${url}`,
        url,
      });
    } catch {
      toast.error('Erro ao compartilhar!');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream }}>
        <Navbar />
        <Spinner />
      </View>
    );
  }
  if (!vaga) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream }}>
        <Navbar />
        <View style={{ padding: 40, alignItems: 'center' }}>
          <Text>Vaga não encontrada.</Text>
        </View>
      </View>
    );
  }

  const remaining = Math.max(0, vaga.totalSlots - vaga.filledSlots);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Button variant="ghost" onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={16} color={colors.gray600} />
          <Text style={{ color: colors.gray600 }}>Voltar</Text>
        </Button>

        <View style={styles.hero}>
          <View style={styles.heroOngRow}>
            <View style={styles.heroIcon}>
              <Text style={{ fontSize: 20 }}>{vaga.icon}</Text>
            </View>
            <View>
              <Text style={styles.heroOng}>{vaga.ong}</Text>
              <Text style={styles.heroVerified}>ONG verificada ✓</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>{vaga.title}</Text>
          <View style={styles.tagRow}>
            <CategoryTag category={vaga.category} />
            <ModalityTag modality={vaga.modality} />
          </View>
        </View>

        <View style={styles.infoGrid}>
          <InfoBox label="Vagas Abertas" value={`${remaining} restantes`} colors={colors} />
          <InfoBox label="Carga Horária" value={`${vaga.hoursPerWeek}h / semana`} colors={colors} />
          <InfoBox label="Período" value={String(vaga.availability)} colors={colors} />
          <InfoBox label="Início" value={vaga.startDate} colors={colors} />
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text variant="serif" style={{ fontSize: 18, marginBottom: 12 }}>
            Sobre a vaga
          </Text>
          <Text style={{ color: colors.gray600, lineHeight: 24 }}>
            {vaga.description}
          </Text>
        </View>

        {vaga.requirements?.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text variant="serif" style={{ fontSize: 18, marginBottom: 12 }}>
              Requisitos
            </Text>
            {vaga.requirements.map((r, i) => (
              <View key={i} style={styles.reqRow}>
                <Text style={{ color: colors.green700, fontFamily: fonts.sansBold }}>
                  ✓
                </Text>
                <Text style={{ color: colors.gray600, flex: 1 }}>{r}</Text>
              </View>
            ))}
          </View>
        )}

        <Card style={styles.ctaCard}>
          <Text variant="serif" style={{ fontSize: 20, marginBottom: 6 }}>
            Pronto para contribuir?
          </Text>
          <Text variant="small" color={colors.gray400} style={{ marginBottom: 18 }}>
            {remaining} vagas disponíveis · Resposta em até 48h
          </Text>
          <Button block size="lg" loading={apply.loading} onPress={handleApply}>
            Quero me voluntariar →
          </Button>
          <View style={{ height: 10 }} />
          <Button block variant="secondary" onPress={handleShare}>
            🔗 Compartilhar
          </Button>
        </Card>

        <Card style={{ marginTop: 16, marginBottom: 40 }}>
          <View style={styles.heroOngRow}>
            <IconBox emoji={vaga.icon} bg={colors.green50} size={48} />
            <View>
              <Text variant="serif" style={{ fontSize: 15 }}>
                {vaga.ong}
              </Text>
              <Text variant="small" color={colors.gray400}>
                📍 {vaga.city}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 12, gap: 6 }}>
            {vaga.ongEmail ? (
              <>
                <Text variant="small" color={colors.gray600}>📧 {vaga.ongEmail}</Text>
                <Text variant="small" color={colors.gray600}>📞 {vaga.ongPhone}</Text>
                <Text variant="small" color={colors.gray600}>
                  Associada desde {vaga.ongSince}
                </Text>
              </>
            ) : (
              <Text variant="small" color={colors.gray600}>
                Organização dedicada à transformação social através da educação e do voluntariado.
              </Text>
            )}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const InfoBox = ({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: Palette;
}) => (
  <View style={[infoStyles.infoBox, { backgroundColor: colors.surface }, shadows.sm]}>
    <Text variant="label">{label}</Text>
    <Text
      style={{
        fontSize: 17,
        fontFamily: fonts.sansBold,
        color: colors.gray800,
        marginTop: 4,
      }}
      numberOfLines={2}
    >
      {value}
    </Text>
  </View>
);

const infoStyles = StyleSheet.create({
  infoBox: {
    width: '47%',
    flexGrow: 1,
    borderRadius: 8,
    padding: 14,
  },
});

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    scroll: { padding: 16, paddingBottom: 32 },
    back: { alignSelf: 'flex-start', paddingHorizontal: 0, marginBottom: 8 },
    hero: {
      backgroundColor: colors.green800,
      borderRadius: radius.md,
      padding: 24,
      marginBottom: 20,
    },
    heroOngRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12,
    },
    heroIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: 'rgba(255,255,255,0.15)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroOng: {
      color: '#ffffff',
      fontSize: 15,
      fontFamily: fonts.sansBold,
    },
    heroVerified: {
      color: colors.green300,
      fontSize: 12,
      fontFamily: fonts.sans,
    },
    heroTitle: {
      fontFamily: fonts.serif,
      fontSize: 28,
      color: '#ffffff',
      lineHeight: 34,
      marginBottom: 12,
    },
    tagRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    infoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 24,
    },
    reqRow: {
      flexDirection: 'row',
      gap: 10,
      paddingVertical: 4,
    },
    ctaCard: {
      ...shadows.md,
    },
  });
