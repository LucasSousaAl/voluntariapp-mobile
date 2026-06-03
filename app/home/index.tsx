import React, { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
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
import { mapTrabalhoToVaga } from '@/lib/mappers';
import { Category, Vaga } from '@/types';
import { colors, fonts } from '@/theme';
import { useRouter } from 'expo-router';

const categories: ('Todas' | Category)[] = [
  'Todas',
  'Educação',
  'Saúde',
  'Meio Ambiente',
  'Social',
];

const normalize = (s?: string) =>
  s
    ?.normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim() || '';

export default function HomeScreen() {
  const router = useRouter();
  const toast = useToast();
  const { currentUserRole } = useApp();
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [active, setActive] = useState<'Todas' | Category>('Todas');

  const fetchVagas = useCallback(async () => {
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
        }
      } catch {
        // ignore, fall back to /trabalho
      }

      const data = await api.get<any[]>(path, { query });
      setVagas(Array.isArray(data) ? data.map(mapTrabalhoToVaga) : []);
    } catch (err: any) {
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

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <Navbar />
      {loading ? (
        <Spinner />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
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

          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text variant="muted" style={{ textAlign: 'center' }}>
                Nenhuma vaga encontrada na base de dados conectada.
              </Text>
            </View>
          ) : (
            filtered.map((v) => <VagaCard key={v.id} vaga={v} />)
          )}

          {currentUserRole === 'volunteer' && (
            <Card style={{ marginTop: 8 }}>
              <Text variant="label">Minhas horas</Text>
              <View style={styles.statsRow}>
                <StatBox num={0} label="Total horas" />
                <StatBox num={0} label="Atividades" />
              </View>

              <Text variant="label" style={{ marginTop: 16 }}>
                Histórico recente
              </Text>
              <Text
                variant="small"
                style={{ textAlign: 'center', marginVertical: 12 }}
              >
                Nenhuma atividade de voluntariado registrada recentemente.
              </Text>
              <Button
                variant="outline"
                block
                onPress={() => router.push('/profile')}
              >
                Ver perfil completo →
              </Button>
            </Card>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const StatBox = ({ num, label }: { num: number; label: string }) => (
  <View style={styles.statBox}>
    <Text style={{ fontSize: 28, color: colors.green700, fontFamily: fonts.sansBold }}>
      {num}
    </Text>
    <Text variant="label" style={{ marginTop: 4 }}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
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
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: colors.green50,
    borderRadius: 8,
  },
});
