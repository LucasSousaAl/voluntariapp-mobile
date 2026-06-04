import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import { Navbar } from '@/components/Navbar';
import { VagaCard } from '@/components/VagaCard';
import { SectionHeader } from '@/components/SectionHeader';
import { Chip } from '@/components/Chip';
import { Spinner } from '@/components/Spinner';
import { Text } from '@/components/Text';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/Toast';
import { api } from '@/lib/api';
import { cacheGet, cacheSet } from '@/lib/prefs';
import { mapTrabalhoToVaga } from '@/lib/mappers';
import { Category, Vaga } from '@/types';
import { fonts, Palette } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';
import { useRouter } from 'expo-router';

const categories: ('Todas' | Category)[] = [
  'Todas',
  'Educação',
  'Saúde',
  'Meio Ambiente',
  'Social',
];

const VAGAS_CACHE_KEY = 'vagas';

const normalize = (s?: string) =>
  s
    ?.normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim() || '';

export default function HomeScreen() {
  const router = useRouter();
  const toast = useToast();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { currentUserRole } = useApp();
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [active, setActive] = useState<'Todas' | Category>('Todas');

  // Seed from the AsyncStorage cache for instant/offline content.
  useEffect(() => {
    cacheGet<Vaga[]>(VAGAS_CACHE_KEY).then((cached) => {
      if (cached && cached.length) {
        setVagas((prev) => (prev.length ? prev : cached));
        setLoading(false);
      }
    });
  }, []);

  const fetchVagas = useCallback(async () => {
    setError(false);
    try {
      let path = '/trabalho';
      let query: Record<string, string> | undefined;

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          path = '/trabalho-closest';
          query = {
            longitude: String(pos.coords.longitude),
            latitude: String(pos.coords.latitude),
            raio: '10000',
          };
        } else {
          toast.info('Localização negada — mostrando todas as vagas.');
        }
      } catch {
        // ignore, fall back to /trabalho
      }

      const data = await api.get<any[]>(path, { query });
      const mapped = Array.isArray(data) ? data.map(mapTrabalhoToVaga) : [];
      setVagas(mapped);
      cacheSet(VAGAS_CACHE_KEY, mapped);
    } catch (err: any) {
      setError(true);
      toast.error('Erro ao carregar vagas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchVagas();
  }, [fetchVagas]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVagas();
  };

  const filtered =
    active === 'Todas'
      ? vagas
      : vagas.filter((v) => normalize(v.category) === normalize(active));

  const ListHeader = (
    <>
      <SectionHeader title="Em destaque" />
      <View style={styles.pills}>
        {categories.map((c) => (
          <Chip
            key={c}
            label={c}
            active={active === c}
            onPress={() => setActive(c)}
          />
        ))}
      </View>
    </>
  );

  const ListEmpty = error ? (
    <View style={styles.empty}>
      <Text variant="muted" style={{ textAlign: 'center', marginBottom: 12 }}>
        Não foi possível carregar as vagas. Verifique sua conexão.
      </Text>
      <Button variant="outline" onPress={onRefresh}>
        Tentar novamente
      </Button>
    </View>
  ) : (
    <View style={styles.empty}>
      <Text variant="muted" style={{ textAlign: 'center' }}>
        Nenhuma vaga encontrada na base de dados conectada.
      </Text>
    </View>
  );

  const ListFooter =
    currentUserRole === 'volunteer' ? (
      <Card style={{ marginTop: 8 }}>
        <Text variant="label">Minhas horas</Text>
        <View style={styles.statsRow}>
          <StatBox num={0} label="Total horas" colors={colors} />
          <StatBox num={0} label="Atividades" colors={colors} />
        </View>

        <Text variant="label" style={{ marginTop: 16 }}>
          Histórico recente
        </Text>
        <Text variant="small" style={{ textAlign: 'center', marginVertical: 12 }}>
          Nenhuma atividade de voluntariado registrada recentemente.
        </Text>
        <Button variant="outline" block onPress={() => router.push('/profile')}>
          Ver perfil completo →
        </Button>
      </Card>
    ) : null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <Navbar />
      {loading ? (
        <Spinner />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(v) => v.id}
          renderItem={({ item }) => <VagaCard vaga={item} />}
          contentContainerStyle={styles.scroll}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListEmpty}
          ListFooterComponent={ListFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.green500}
            />
          }
        />
      )}
    </View>
  );
}

const StatBox = ({
  num,
  label,
  colors,
}: {
  num: number;
  label: string;
  colors: Palette;
}) => (
  <View style={[styles_inner.statBox, { backgroundColor: colors.green50 }]}>
    <Text style={{ fontSize: 28, color: colors.green700, fontFamily: fonts.sansBold }}>
      {num}
    </Text>
    <Text variant="label" style={{ marginTop: 4 }}>
      {label}
    </Text>
  </View>
);

const styles_inner = StyleSheet.create({
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
});

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    scroll: {
      padding: 16,
      paddingBottom: 60,
    },
    pills: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    empty: {
      paddingVertical: 40,
      alignItems: 'center',
    },
    statsRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
  });
