import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Navbar } from '@/components/Navbar';
import { Text } from '@/components/Text';
import { Spinner } from '@/components/Spinner';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Avatar } from '@/components/Avatar';
import { Divider } from '@/components/Divider';
import { IconBox } from '@/components/IconBox';
import { EditModal } from '@/components/EditModal';
import { Input } from '@/components/Input';
import { Chip } from '@/components/Chip';
import { confirm } from '@/components/Confirm';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/Toast';
import { api } from '@/lib/api';
import { initialsFromName } from '@/lib/mappers';
import { categoryStyle, fonts, Palette } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';
import { Category, HistoricoItem } from '@/types';

interface Voluntario {
  name: string;
  initials: string;
  city: string;
  state: string;
  memberSince: number | string;
  interestArea: string;
  availability: string;
  modality: string;
  totalHours: number;
  historico: HistoricoItem[];
}

const interestAreas: Category[] = ['Educação', 'Social', 'Meio Ambiente', 'Saúde'];
const modalities = ['Remoto', 'Presencial', 'Híbrido'] as const;

export default function ProfileScreen() {
  const { currentUserRole, refreshSession } = useApp();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [voluntario, setVoluntario] = useState<Voluntario | null>(null);
  const [quittingId, setQuittingId] = useState<string | null>(null);

  // Edit modal
  const [editing, setEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    cidade: '',
    estado: '',
    interestArea: '' as Category | '',
    availability: '',
    modality: '' as (typeof modalities)[number] | '',
  });

  const load = useCallback(async () => {
    try {
      const data: any = await api.get('/auth/me');
      const v: Voluntario = {
        name: data.nome || 'Voluntário',
        initials: initialsFromName(data.nome || ''),
        city: data.city || 'São Paulo',
        state: data.state || 'SP',
        memberSince: data.memberSince || 2023,
        interestArea: data.interestArea || 'Educação',
        availability: data.availability || 'Fins de semana',
        modality: data.modality || 'Híbrido',
        totalHours: data.totalHours || 0,
        historico: data.historico || [],
      };
      setVoluntario(v);
    } catch {
      toast.error('Não foi possível carregar o perfil');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream }}>
        <Navbar />
        <Spinner />
      </View>
    );
  }

  if (currentUserRole !== 'volunteer') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream }}>
        <Navbar />
        <View style={{ padding: 40, alignItems: 'center' }}>
          <Text variant="serifLg" color={colors.gray600} style={{ textAlign: 'center' }}>
            Nenhum perfil de voluntário encontrado.
          </Text>
          <Text variant="muted" style={{ marginTop: 12, textAlign: 'center' }}>
            Você está visualizando a plataforma como ONG ou Convidado.
          </Text>
        </View>
      </View>
    );
  }

  if (!voluntario) return null;

  const openEdit = () => {
    setForm({
      nome: voluntario.name,
      cidade: voluntario.city,
      estado: voluntario.state,
      interestArea: voluntario.interestArea as Category,
      availability: voluntario.availability,
      modality: voluntario.modality as (typeof modalities)[number],
    });
    setEditing(true);
  };

  const submitEdit = async () => {
    if (!form.nome || !form.cidade || !form.estado || !form.interestArea ||
        !form.availability || !form.modality) {
      toast.warning('Preencha todos os campos.');
      return;
    }
    setSavingProfile(true);
    try {
      await api.put('/auth/me/update', {
        nome: form.nome,
        city: form.cidade,
        state: form.estado,
        interestArea: form.interestArea,
        availability: form.availability,
        modality: form.modality,
      });
      setVoluntario((p) =>
        p
          ? {
              ...p,
              name: form.nome,
              initials: initialsFromName(form.nome),
              city: form.cidade,
              state: form.estado,
              interestArea: form.interestArea,
              availability: form.availability,
              modality: form.modality,
            }
          : p,
      );
      await refreshSession();
      toast.success('Perfil atualizado com sucesso!');
      setEditing(false);
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao atualizar perfil.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleQuit = (trabalhoId: string) => {
    confirm(
      'Cancelar inscrição',
      'Tem certeza que deseja cancelar sua inscrição?',
      async () => {
        setQuittingId(trabalhoId);
        try {
          await api.delete('/trabalho/quit', { trabalho_id: trabalhoId });
          toast.success('Inscrição cancelada com sucesso.');
          setVoluntario((p) => {
            if (!p) return p;
            const newHist = p.historico.filter((h) => h.id !== trabalhoId);
            return {
              ...p,
              historico: newHist,
              totalHours: newHist.reduce((a, h) => a + (h.hours || 0), 0),
            };
          });
        } catch (err: any) {
          toast.error(err?.message || 'Erro ao cancelar inscrição.');
        } finally {
          setQuittingId(null);
        }
      },
    );
  };

  const uniqueOngs = new Set(voluntario.historico.map((h) => h.ong)).size;

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.profileCard}>
          <Avatar
            initials={voluntario.initials}
            size={80}
            bg={colors.green600}
          />
          <Text style={styles.name}>{voluntario.name}</Text>
          <Text style={styles.location}>
            📍 {voluntario.city}, {voluntario.state}
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Voluntário desde {voluntario.memberSince}
            </Text>
          </View>

          <Button size="sm" variant="dark" onPress={openEdit}>
            Editar Perfil
          </Button>

          <Divider color="rgba(255,255,255,0.1)" style={{ marginVertical: 16, width: '100%' }} />

          <View style={{ width: '100%' }}>
            {[
              { label: 'Área de interesse', value: voluntario.interestArea },
              { label: 'Disponibilidade', value: voluntario.availability },
              { label: 'Modalidade', value: voluntario.modality },
            ].map((info) => (
              <View key={info.label} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{info.label}</Text>
                <Text style={styles.infoValue}>{info.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.hoursBox}>
            <Text style={styles.hoursNumber}>{voluntario.totalHours}h</Text>
            <Text style={styles.hoursLabel}>Total de horas voluntariadas</Text>
          </View>
        </View>

        <View style={{ height: 20 }} />

        <Text variant="serifLg" style={{ marginBottom: 16 }}>
          Histórico de voluntariado
        </Text>

        {voluntario.historico.length === 0 ? (
          <View style={styles.emptyHistory}>
            <Text variant="muted" style={{ textAlign: 'center' }}>
              Nenhuma atividade ainda. Que tal explorar uma vaga?
            </Text>
          </View>
        ) : (
          voluntario.historico.map((h) => {
            const catStyle = categoryStyle[h.category as Category] || {
              bg: colors.tagEduBg,
              fg: colors.tagEduFg,
              emoji: '🤝',
            };
            return (
              <Card key={h.id} style={styles.historyItem}>
                <IconBox emoji={h.icon || catStyle.emoji} bg={catStyle.bg} size={52} />
                <View style={{ flex: 1 }}>
                  <Text variant="serif" style={{ fontSize: 16 }}>
                    {h.title}
                  </Text>
                  <Text variant="small" color={colors.gray400} style={{ marginTop: 2 }}>
                    {h.ong} · {h.period}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.historyHours}>{h.hours}h</Text>
                  <Text variant="label" style={{ marginTop: 2 }}>
                    horas
                  </Text>
                  <Button
                    size="sm"
                    variant="outline"
                    loading={quittingId === h.id}
                    onPress={() => handleQuit(h.id)}
                    style={{ marginTop: 8, borderColor: colors.danger }}
                    textStyle={{ color: colors.danger }}
                  >
                    Sair
                  </Button>
                </View>
              </Card>
            );
          })
        )}

        <Card style={{ marginTop: 12, marginBottom: 32 }}>
          <Text variant="label" style={{ marginBottom: 16 }}>Resumo</Text>
          <View style={styles.summaryGrid}>
            <SummaryStat num={voluntario.historico.length} label="Atividades" colors={colors} />
            <SummaryStat num={`${voluntario.totalHours}h`} label="Horas totais" colors={colors} />
            <SummaryStat num={uniqueOngs} label="ONGs" colors={colors} />
          </View>
        </Card>
      </ScrollView>

      <EditModal
        visible={editing}
        title="Editar Perfil"
        loading={savingProfile}
        okText="Salvar Alterações"
        onCancel={() => setEditing(false)}
        onConfirm={submitEdit}
      >
        <Input
          label="Nome Completo"
          required
          value={form.nome}
          onChangeText={(v) => setForm((f) => ({ ...f, nome: v }))}
        />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Input
              label="Cidade"
              required
              value={form.cidade}
              onChangeText={(v) => setForm((f) => ({ ...f, cidade: v }))}
            />
          </View>
          <View style={{ width: 100 }}>
            <Input
              label="Estado"
              required
              value={form.estado}
              onChangeText={(v) => setForm((f) => ({ ...f, estado: v }))}
              maxLength={2}
              autoCapitalize="characters"
            />
          </View>
        </View>
        <Text style={styles.modalLabel}>Área de Interesse Principal</Text>
        <View style={styles.chipRow}>
          {interestAreas.map((c) => (
            <Chip
              key={c}
              label={c}
              active={form.interestArea === c}
              onPress={() => setForm((f) => ({ ...f, interestArea: c }))}
            />
          ))}
        </View>
        <Input
          label="Disponibilidade"
          required
          placeholder="Ex: Fins de semana, Manhãs"
          value={form.availability}
          onChangeText={(v) => setForm((f) => ({ ...f, availability: v }))}
        />
        <Text style={styles.modalLabel}>Modalidade</Text>
        <View style={styles.chipRow}>
          {modalities.map((m) => (
            <Chip
              key={m}
              label={m}
              active={form.modality === m}
              onPress={() => setForm((f) => ({ ...f, modality: m }))}
            />
          ))}
        </View>
      </EditModal>
    </View>
  );
}

const SummaryStat = ({
  num,
  label,
  colors,
}: {
  num: number | string;
  label: string;
  colors: Palette;
}) => (
  <View style={[summaryStatStyle.box, { backgroundColor: colors.green50 }]}>
    <Text style={{ fontSize: 28, color: colors.green700, fontFamily: fonts.sansBold }}>
      {num}
    </Text>
    <Text variant="label" style={{ marginTop: 4 }}>
      {label}
    </Text>
  </View>
);

const summaryStatStyle = StyleSheet.create({
  box: {
    flex: 1,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
});

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 60 },
  profileCard: {
    backgroundColor: colors.green900,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
  },
  name: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.white,
    marginTop: 12,
  },
  location: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontFamily: fonts.sans,
    marginTop: 6,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginVertical: 12,
  },
  badgeText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontFamily: fonts.sans,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  infoLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontFamily: fonts.sans,
    fontSize: 14,
  },
  infoValue: {
    color: colors.white,
    fontFamily: fonts.sansBold,
    fontSize: 14,
  },
  hoursBox: {
    width: '100%',
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: 16,
  },
  hoursNumber: {
    fontFamily: fonts.sansBold,
    color: colors.green300,
    fontSize: 38,
  },
  hoursLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontFamily: fonts.sans,
    fontSize: 12,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyHistory: {
    padding: 24,
    alignItems: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  historyHours: {
    fontSize: 22,
    fontFamily: fonts.sansBold,
    color: colors.green700,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryStat: {
    flex: 1,
    backgroundColor: colors.green50,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  modalLabel: {
    fontFamily: fonts.sansBold,
    color: colors.gray800,
    fontSize: 13,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
