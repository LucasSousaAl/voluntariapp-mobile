// Visual tokens ported from the web project's styles/globals.css.
// Keep these in sync if you change the web theme.

export const colors = {
  green900: '#1a3a2a',
  green800: '#1e4433',
  green700: '#2d5a3d',
  green600: '#3a7050',
  green500: '#4a8a63',
  green300: '#7bbf95',
  green100: '#d4ead9',
  green50: '#edf6ef',
  cream: '#f5f2ec',
  creamDark: '#ede9e0',
  white: '#ffffff',
  gray200: '#e8e5df',
  gray400: '#b0a99e',
  gray500: '#8a857d',
  gray600: '#6b6560',
  gray800: '#2c2825',
  danger: '#ef4444',
  dangerSoft: '#f87171',

  tagEduBg: '#e8f4ea',
  tagEduFg: '#2d5a3d',
  tagSocBg: '#fef0e0',
  tagSocFg: '#8a5a10',
  tagEnvBg: '#e8f8f0',
  tagEnvFg: '#1a6640',
  tagHltBg: '#fce8f0',
  tagHltFg: '#80204a',
  tagWkndBg: '#e8edf8',
  tagWkndFg: '#3a4a80',
  tagPresBg: '#f0edf8',
  tagPresFg: '#5a3a80',
};

export const radius = {
  sm: 8,
  md: 14,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 32,
    elevation: 10,
  },
};

export const fonts = {
  serif: 'Lora_700Bold',
  serifRegular: 'Lora_400Regular',
  sans: 'DMSans_400Regular',
  sansMedium: 'DMSans_500Medium',
  sansBold: 'DMSans_700Bold',
};

export const categoryStyle: Record<string, { bg: string; fg: string; emoji: string }> = {
  'Educação': { bg: colors.tagEduBg, fg: colors.tagEduFg, emoji: '📚' },
  'Social': { bg: colors.tagSocBg, fg: colors.tagSocFg, emoji: '🤝' },
  'Meio Ambiente': { bg: colors.tagEnvBg, fg: colors.tagEnvFg, emoji: '🌿' },
  'Saúde': { bg: colors.tagHltBg, fg: colors.tagHltFg, emoji: '💚' },
};

export const modalityStyle: Record<string, { bg: string; fg: string }> = {
  Presencial: { bg: colors.tagPresBg, fg: colors.tagPresFg },
  Remoto: { bg: '#e8f0fe', fg: '#2a4a9a' },
  'Híbrido': { bg: '#f0f4e8', fg: '#4a6020' },
};

export const iconForCategory = (cat?: string): string => {
  if (!cat) return '🤝';
  if (cat === 'Educação') return '📚';
  if (cat === 'Saúde') return '💚';
  if (cat === 'Meio Ambiente') return '🌱';
  return '🤝';
};
