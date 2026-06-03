// Ported from the web project's models/types/index.ts

export type Category = 'Educação' | 'Saúde' | 'Social' | 'Meio Ambiente';
export type Modality = 'Presencial' | 'Remoto' | 'Híbrido';
export type Availability =
  | 'Segunda'
  | 'Terça'
  | 'Quarta'
  | 'Quinta'
  | 'Sexta'
  | 'Sábado'
  | 'Domingo'
  | 'Fins de semana';
export type VagaStatus = 'Ativa' | 'Pausada' | 'Rascunho';

export type UserRole = 'admin' | 'ong' | 'volunteer' | 'guest';
export type UserType = 'volunteer' | 'ong';

export interface Vaga {
  id: string;
  title: string;
  ong: string;
  city: string;
  category: Category;
  modality: Modality;
  availability: Availability | string;
  hoursPerWeek: string;
  totalSlots: number;
  filledSlots: number;
  startDate: string;
  description: string;
  requirements: string[];
  icon: string;
  status: VagaStatus;
  ongEmail?: string;
  ongPhone?: string;
  ongCity?: string;
  ongSince?: string;
}

export interface HistoricoItem {
  id: string;
  title: string;
  ong: string;
  period: string;
  hours: number;
  icon: string;
  category: Category;
}

export interface Voluntario {
  name: string;
  initials: string;
  city: string;
  state: string;
  memberSince: number | string;
  interestArea: Category | string;
  availability: Availability | string;
  modality: Modality | string;
  totalHours: number;
  historico: HistoricoItem[];
}

export interface SessionUser {
  id: string | number;
  nome: string;
  email: string;
  role: UserRole;
  city?: string;
  state?: string;
  interestArea?: string;
  availability?: string;
  modality?: string;
  memberSince?: string | number;
  totalHours?: number;
  historico?: HistoricoItem[];
}

export interface NewVagaForm {
  title: string;
  description: string;
  slots: number;
  hoursPerWeek: string;
  category: Category | '';
  modality: Modality | '';
  availability: Availability[];
}
