import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Navbar } from '@/components/Navbar';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Chip } from '@/components/Chip';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/Toast';
import { api } from '@/lib/api';
import { notify } from '@/lib/notifications';
import {
  Availability,
  Category,
  Modality,
  NewVagaForm,
} from '@/types';
import { fonts, Palette, radius } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';

const stepLabels = ['Dados básicos', 'Detalhes', 'Revisão'];

const categories: Category[] = ['Educação', 'Saúde', 'Social', 'Meio Ambiente'];
const modalities: Modality[] = ['Presencial', 'Remoto', 'Híbrido'];
const availabilities: Availability[] = [
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
  'Domingo',
];

const initialForm: NewVagaForm = {
  title: 'Instrutor de Inglês',
  description:
    'Buscamos voluntário para ministrar aulas básicas de inglês para jovens de 14 a 18 anos...',
  slots: 6,
  hoursPerWeek: '2',
  category: 'Educação',
  modality: 'Presencial',
  availability: ['Quarta', 'Sexta'],
};

export default function FormScreen() {
  const router = useRouter();
  const toast = useToast();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { currentUser } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<NewVagaForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const toggleAvailability = (a: Availability) =>
    setForm((f) => ({
      ...f,
      availability: f.availability.includes(a)
        ? f.availability.filter((x) => x !== a)
        : [...f.availability, a],
    }));

  const submit = async () => {
    setSubmitting(true);
    try {
      const ongs = await api.get<any[]>('/ong');
      const mine = ongs.find((o) => o.email === currentUser?.email);
      if (!mine) {
        toast.error('Você precisa ter o perfil de ONG salvo primeiro.');
        return;
      }
      await api.post('/trabalho', {
        ong_id: mine.id,
        titulo: form.title,
        descricao: form.description,
        n_vagas: form.slots,
        categoria: form.category,
        disponibilidade: form.availability.join(', '),
        carga_horaria: parseInt(form.hoursPerWeek, 10) || 0,
      });
      toast.success('Vaga criada com sucesso!');
      notify('Vaga publicada ✓', `"${form.title}" já está visível para voluntários.`);
      router.replace('/ong');
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao salvar vaga');
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => {
    if (step < stepLabels.length - 1) setStep((s) => s + 1);
    else submit();
  };
  const prev = () => step > 0 && setStep((s) => s - 1);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.stepsRow}>
          {stepLabels.map((label, i) => (
            <View key={label} style={styles.stepCol}>
              <View
                style={[
                  styles.stepDot,
                  i === step && styles.stepDotActive,
                  i < step && styles.stepDotDone,
                ]}
              >
                <Text
                  style={[
                    styles.stepNum,
                    (i === step || i < step) && { color: colors.white },
                  ]}
                >
                  {i + 1}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  i === step && { color: colors.green700, fontFamily: fonts.sansBold },
                ]}
              >
                {label}
              </Text>
              {i < stepLabels.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    i < step && { backgroundColor: colors.green500 },
                  ]}
                />
              )}
            </View>
          ))}
        </View>

        <Card style={styles.card}>
          <Text variant="serif" style={{ fontSize: 22, marginBottom: 6 }}>
            Detalhes da oportunidade
          </Text>
          <Text variant="small" color={colors.gray400} style={{ marginBottom: 24 }}>
            Passo {step + 1} de {stepLabels.length} — Descreva a vaga para atrair voluntários
          </Text>

          {step === 0 && (
            <View style={{ gap: 20 }}>
              <Input
                label="Título da vaga"
                required
                value={form.title}
                onChangeText={(v) => setForm((f) => ({ ...f, title: v }))}
              />
              <Input
                label="Descrição"
                required
                value={form.description}
                onChangeText={(v) => setForm((f) => ({ ...f, description: v }))}
                multiline
                numberOfLines={4}
                style={{ minHeight: 100 }}
              />
              <View>
                <Text style={styles.fieldLabel}>Categoria</Text>
                <View style={styles.chipRow}>
                  {categories.map((c) => (
                    <Chip
                      key={c}
                      label={c}
                      active={form.category === c}
                      onPress={() => setForm((f) => ({ ...f, category: c }))}
                    />
                  ))}
                </View>
              </View>
            </View>
          )}

          {step === 1 && (
            <View style={{ gap: 20 }}>
              <View style={styles.detailsGrid}>
                <View style={{ flex: 1 }}>
                  <Input
                    label="Nº de Vagas"
                    value={String(form.slots)}
                    onChangeText={(v) =>
                      setForm((f) => ({ ...f, slots: parseInt(v || '0', 10) || 0 }))
                    }
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Input
                    label="Carga horária (h/semana)"
                    value={form.hoursPerWeek}
                    onChangeText={(v) =>
                      setForm((f) => ({ ...f, hoursPerWeek: v }))
                    }
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View>
                <Text style={styles.fieldLabel}>Modalidade</Text>
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
              </View>
              <View>
                <Text style={styles.fieldLabel}>Disponibilidade</Text>
                <View style={styles.chipRow}>
                  {availabilities.map((a) => (
                    <Chip
                      key={a}
                      label={a}
                      active={form.availability.includes(a)}
                      onPress={() => toggleAvailability(a)}
                    />
                  ))}
                </View>
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.reviewBox}>
              <Text variant="bodyBold">Título: {form.title}</Text>
              <Text>
                <Text variant="bodyBold">Vagas:</Text> {form.slots} ·{' '}
                <Text variant="bodyBold">Carga Horária:</Text> {form.hoursPerWeek}h
              </Text>
              <Text>
                <Text variant="bodyBold">Categoria:</Text> {form.category} ·{' '}
                <Text variant="bodyBold">Modalidade:</Text> {form.modality}
              </Text>
              <Text>
                <Text variant="bodyBold">Disponibilidade:</Text>{' '}
                {form.availability.join(', ') || '—'}
              </Text>
              <Text style={{ marginTop: 8 }}>
                <Text variant="bodyBold">Descrição:</Text> {form.description}
              </Text>
            </View>
          )}

          <View style={styles.actions}>
            <Button
              variant="secondary"
              onPress={prev}
              style={{ opacity: step > 0 ? 1 : 0 }}
              disabled={step === 0}
            >
              ← Voltar
            </Button>
            <Button onPress={next} loading={submitting}>
              {step < stepLabels.length - 1 ? 'Próximo →' : 'Publicar Vaga ✓'}
            </Button>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 60 },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  stepCol: { alignItems: 'center', flex: 1, position: 'relative' },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: colors.green700,
    borderWidth: 4,
    borderColor: colors.green100,
  },
  stepDotDone: {
    backgroundColor: colors.green700,
  },
  stepNum: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    color: colors.gray600,
  },
  stepLabel: {
    fontSize: 11,
    color: colors.gray600,
    marginTop: 6,
    fontFamily: fonts.sansMedium,
    textAlign: 'center',
  },
  stepLine: {
    position: 'absolute',
    top: 16,
    left: '60%',
    right: '-40%',
    height: 2,
    backgroundColor: colors.gray200,
  },
  card: {
    padding: 24,
  },
  fieldLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    color: colors.gray600,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  reviewBox: {
    backgroundColor: colors.cream,
    padding: 16,
    borderRadius: radius.sm,
    gap: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
});
