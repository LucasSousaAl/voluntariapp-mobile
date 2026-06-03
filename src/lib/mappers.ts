import { Category, Vaga } from '@/types';
import { iconForCategory } from '@/theme';

// Map a row from the /trabalho endpoint to the Vaga shape used by the UI.
export function mapTrabalhoToVaga(t: any): Vaga {
  return {
    id: t.id.toString(),
    title: t.titulo,
    ong: t.ong_nome || 'ONG Parceira',
    city: t.ong_city || 'Remoto/Local',
    category: ((t.categoria || '').trim() as Category) || 'Social',
    modality: 'Híbrido',
    availability: t.disponibilidade || 'Fins de semana',
    hoursPerWeek: (t.carga_horaria ?? 0).toString(),
    totalSlots: t.n_vagas ?? 0,
    filledSlots: 0,
    startDate: t.criado_em
      ? new Date(t.criado_em).toLocaleDateString('pt-BR')
      : '',
    description: t.descricao || '',
    requirements: [],
    icon: iconForCategory(t.categoria),
    status: 'Ativa',
    ongEmail: t.ong_email || '',
    ongPhone: t.ong_phone || '',
    ongSince: t.ong_since ? new Date(t.ong_since).getFullYear().toString() : '2023',
  };
}

export function initialsFromName(name: string): string {
  if (!name) return 'VL';
  return (
    name
      .split(' ')
      .filter((w) => w.length > 2)
      .map((w) => w[0].toUpperCase())
      .join('')
      .slice(0, 3) || name.slice(0, 2).toUpperCase()
  );
}
