import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Navbar } from '@/components/Navbar';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { IconBox } from '@/components/IconBox';
import { Chip } from '@/components/Chip';
import { Avatar } from '@/components/Avatar';
import { Spinner } from '@/components/Spinner';
import { StatusBadge } from '@/components/Tag';
import { ProgressBar } from '@/components/ProgressBar';
import { EditModal } from '@/components/EditModal';
import { Input } from '@/components/Input';
import { confirm } from '@/components/Confirm';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/Toast';
import { api } from '@/lib/api';
import { mapTrabalhoToVaga } from '@/lib/mappers';
import { Category, Vaga, VagaStatus } from '@/types';
import { fonts, iconForCategory, Palette, radius } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';

const categories: Category[] = ['Educação', 'Saúde', 'Meio Ambiente', 'Social'];

interface OngData {
  id: number | string;
  nome: string;
  email: string;
  localidade: string;
  telefone: string;
}

export default function OngScreen() {
  const router = useRouter();
  const toast = useToast();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { currentUser, currentUserRole, setCurrentUserRole, setSelectedVaga } =
    useApp();
  const [loading, setLoading] = useState(true);
  const [ong, setOng] = useState<OngData | null>(null);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [activeTab, setActiveTab] = useState<'Todas' | VagaStatus>('Todas');

  const [editingOng, setEditingOng] = useState(false);
  const [editOngForm, setEditOngForm] = useState({
    nome: '',
    localidade: '',
    telefone: '',
  });
  const [savingOng, setSavingOng] = useState(false);

  const [editingVaga, setEditingVaga] = useState<Vaga | null>(null);
  const [editVagaForm, setEditVagaForm] = useState({
    title: '',
    description: '',
    totalSlots: 1,
    category: 'Educação' as Category,
    availability: '',
    hoursPerWeek: '',
  });
  const [savingVaga, setSavingVaga] = useState(false);

  const fetchOng = useCallback(async () => {
    if (!currentUser?.email) return;
    try {
      const ongs = await api.get<any[]>('/ong');
      const mine = ongs.find((o) => o.email === currentUser.email);
      if (!mine) {
        toast.info('Cadastre uma ONG primeiro.');
        router.push('/register');
        return;
      }
      setOng(mine);
      const works = await api.get<any[]>('/trabalho', {
        query: { ong_id: mine.id },
      });
      setVagas(Array.isArray(works) ? works.map(mapTrabalhoToVaga) : []);
    } catch (err) {
      toast.error('Erro ao buscar perfil da ONG');
    } finally {
      setLoading(false);
    }
  }, [currentUser, router, toast]);

  useEffect(() => {
    fetchOng();
  }, [fetchOng]);

  const filtered =
    activeTab === 'Todas' ? vagas : vagas.filter((v) => v.status === activeTab);
  const isOwnerOrAdmin = currentUserRole === 'ong' || currentUserRole === 'admin';

  const handleDeleteOng = () => {
    if (!ong) return;
    confirm(
      'Excluir ONG',
      'Tem certeza que deseja deletar a ONG?',
      async () => {
        try {
          await api.delete('/ong', undefined, { query: { id: String(ong.id) } });
          toast.success('ONG deletada com sucesso!');
          setCurrentUserRole('guest');
          router.replace('/home');
        } catch {
          toast.error('Erro ao deletar perfil da ONG.');
        }
      },
    );
  };

  const openEditOng = () => {
    if (!ong) return;
    setEditOngForm({
      nome: ong.nome,
      localidade: ong.localidade,
      telefone: ong.telefone,
    });
    setEditingOng(true);
  };

  const submitEditOng = async () => {
    if (!ong) return;
    setSavingOng(true);
    try {
      await api.put('/ong', {
        id: ong.id,
        nome: editOngForm.nome,
        localidade: editOngForm.localidade,
        telefone: editOngForm.telefone,
      });
      setOng({ ...ong, ...editOngForm });
      toast.success('Perfil atualizado com sucesso!');
      setEditingOng(false);
    } catch {
      toast.error('Erro ao atualizar perfil.');
    } finally {
      setSavingOng(false);
    }
  };

  const handleDeleteVaga = (vagaId: string) => {
    confirm('Excluir vaga', 'Realmente deletar essa vaga?', async () => {
      try {
        await api.delete('/trabalho', undefined, { query: { id: vagaId } });
        toast.success('Vaga deletada com sucesso!');
        setVagas((vs) => vs.filter((v) => v.id !== vagaId));
      } catch {
        toast.error('Erro ao deletar vaga.');
      }
    });
  };

  const openEditVaga = (v: Vaga) => {
    setEditingVaga(v);
    setEditVagaForm({
      title: v.title,
      description: v.description,
      totalSlots: v.totalSlots,
      category: v.category,
      availability: String(v.availability),
      hoursPerWeek: v.hoursPerWeek,
    });
  };

  const submitEditVaga = async () => {
    if (!editingVaga) return;
    setSavingVaga(true);
    try {
      await api.put('/trabalho', {
        id: parseInt(editingVaga.id, 10),
        titulo: editVagaForm.title,
        descricao: editVagaForm.description,
        n_vagas: editVagaForm.totalSlots,
        categoria: editVagaForm.category,
        disponibilidade: editVagaForm.availability,
        carga_horaria: parseInt(editVagaForm.hoursPerWeek, 10) || 0,
      });
      toast.success('Vaga atualizada com sucesso!');
      setVagas((vs) =>
        vs.map((v) =>
          v.id === editingVaga.id
            ? {
                ...v,
                title: editVagaForm.title,
                description: editVagaForm.description,
                totalSlots: editVagaForm.totalSlots,
                category: editVagaForm.category,
                availability: editVagaForm.availability,
                hoursPerWeek: editVagaForm.hoursPerWeek,
                icon: iconForCategory(editVagaForm.category),
              }
            : v,
        ),
      );
      setEditingVaga(null);
    } catch {
      toast.error('Erro ao atualizar vaga.');
    } finally {
      setSavingVaga(false);
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
  if (!ong) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Avatar
              initials={(ong.nome || 'O').charAt(0).toUpperCase()}
              size={56}
              bg="rgba(255,255,255,0.15)"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.ongName}>{ong.nome}</Text>
              <Text style={styles.ongMeta}>
                {ong.localidade} · {ong.email} · {ong.telefone}
              </Text>
            </View>
          </View>
          {isOwnerOrAdmin && (
            <View style={styles.headerActions}>
              <Button variant="dark" size="sm" onPress={openEditOng}>
                Editar Perfil
              </Button>
              <Button
                variant="dark"
                size="sm"
                onPress={handleDeleteOng}
                textStyle={{ color: '#ffc8c8' }}
              >
                Excluir ONG
              </Button>
            </View>
          )}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{vagas.length}</Text>
              <Text style={styles.statLabel}>Vagas ativas</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>0</Text>
              <Text style={styles.statLabel}>Voluntários</Text>
            </View>
          </View>
        </View>

        <View style={styles.toolbar}>
          <View style={styles.tabRow}>
            {(['Todas', 'Ativa'] as const).map((t) => (
              <Chip
                key={t}
                label={t}
                active={activeTab === t}
                onPress={() => setActiveTab(t)}
              />
            ))}
          </View>
          {isOwnerOrAdmin && (
            <Button size="sm" onPress={() => router.push('/form')}>
              + Nova Vaga
            </Button>
          )}
        </View>

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text variant="muted" style={{ textAlign: 'center' }}>
              Esta ONG ainda não criou nenhuma vaga no Banco de Dados.
            </Text>
          </View>
        ) : (
          filtered.map((vaga) => (
            <Card key={vaga.id} style={styles.vagaRow}>
              <View style={styles.vagaTop}>
                <IconBox emoji={vaga.icon} bg={colors.tagEduBg} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <StatusBadge status={vaga.status} />
                  </View>
                  <Text variant="serif" style={{ fontSize: 17, marginTop: 4 }}>
                    {vaga.title}
                  </Text>
                  <Text variant="small" color={colors.gray400} style={{ marginTop: 2 }}>
                    📅 {vaga.availability} · ⏱ {vaga.hoursPerWeek}/semana · 📍 {vaga.modality}
                  </Text>
                </View>
              </View>

              <ProgressBar value={vaga.filledSlots} max={vaga.totalSlots} />

              <View style={styles.vagaActions}>
                {isOwnerOrAdmin && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      style={{ flex: 1 }}
                      onPress={() => openEditVaga(vaga)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      style={{ flex: 1, borderColor: colors.dangerSoft }}
                      textStyle={{ color: colors.danger }}
                      onPress={() => handleDeleteVaga(vaga.id)}
                    >
                      Deletar
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  style={{ flex: 1 }}
                  onPress={() => {
                    setSelectedVaga(vaga);
                    router.push({ pathname: '/vaga/[id]', params: { id: vaga.id } });
                  }}
                >
                  Ver
                </Button>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      <EditModal
        visible={editingOng}
        title="Editar Perfil da ONG"
        loading={savingOng}
        okText="Salvar Alterações"
        onCancel={() => setEditingOng(false)}
        onConfirm={submitEditOng}
      >
        <Input
          label="Nome da ONG"
          required
          value={editOngForm.nome}
          onChangeText={(v) => setEditOngForm((f) => ({ ...f, nome: v }))}
        />
        <Input
          label="Localidade"
          required
          value={editOngForm.localidade}
          onChangeText={(v) => setEditOngForm((f) => ({ ...f, localidade: v }))}
        />
        <Input
          label="Telefone"
          required
          value={editOngForm.telefone}
          onChangeText={(v) => setEditOngForm((f) => ({ ...f, telefone: v }))}
          keyboardType="phone-pad"
        />
      </EditModal>

      <EditModal
        visible={editingVaga !== null}
        title="Editar Vaga"
        loading={savingVaga}
        okText="Salvar Alterações"
        onCancel={() => setEditingVaga(null)}
        onConfirm={submitEditVaga}
      >
        <Input
          label="Título da Vaga"
          required
          value={editVagaForm.title}
          onChangeText={(v) => setEditVagaForm((f) => ({ ...f, title: v }))}
        />
        <Input
          label="Descrição"
          required
          value={editVagaForm.description}
          onChangeText={(v) => setEditVagaForm((f) => ({ ...f, description: v }))}
          multiline
          numberOfLines={4}
          style={{ minHeight: 100 }}
        />
        <Input
          label="Número de vagas (Total)"
          required
          value={String(editVagaForm.totalSlots)}
          onChangeText={(v) =>
            setEditVagaForm((f) => ({ ...f, totalSlots: parseInt(v || '0', 10) || 0 }))
          }
          keyboardType="numeric"
        />
        <Text style={styles.modalLabel}>Categoria</Text>
        <View style={styles.chipRow}>
          {categories.map((c) => (
            <Chip
              key={c}
              label={c}
              active={editVagaForm.category === c}
              onPress={() => setEditVagaForm((f) => ({ ...f, category: c }))}
            />
          ))}
        </View>
        <Input
          label="Disponibilidade"
          required
          placeholder="Ex: Segunda a Sexta, Fins de semana"
          value={editVagaForm.availability}
          onChangeText={(v) => setEditVagaForm((f) => ({ ...f, availability: v }))}
        />
        <Input
          label="Carga horária (h/semana)"
          required
          value={editVagaForm.hoursPerWeek}
          onChangeText={(v) => setEditVagaForm((f) => ({ ...f, hoursPerWeek: v }))}
          keyboardType="numeric"
        />
      </EditModal>
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 60 },
  header: {
    backgroundColor: colors.green800,
    borderRadius: radius.md,
    padding: 24,
    marginBottom: 24,
    gap: 16,
  },
  headerContent: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  ongName: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.white,
  },
  ongMeta: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontFamily: fonts.sans,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  statNum: {
    fontFamily: fonts.sansBold,
    color: colors.green300,
    fontSize: 28,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: fonts.sans,
    marginTop: 4,
  },
  toolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 6,
  },
  empty: {
    padding: 40,
  },
  vagaRow: {
    marginBottom: 14,
    gap: 12,
  },
  vagaTop: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  vagaActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  modalLabel: {
    fontFamily: fonts.sansBold,
    color: colors.gray800,
    fontSize: 13,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
