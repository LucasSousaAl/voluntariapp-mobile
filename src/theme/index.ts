// Visual tokens ported from the web project's styles/globals.css.
// Centralized color system with light + dark palettes (Etapa 1, item 6).
//
// Brand colors (greens), "white" (text drawn on dark brand surfaces),
// the pastel tag colors and danger are intentionally identical across both
// palettes — they read well on both backgrounds. Only the neutral
// surface/text tokens flip between light and dark.

export interface Palette {
  green900: string;
  green800: string;
  green700: string;
  green600: string;
  green500: string;
  green300: string;
  green100: string;
  green50: string;
  /** App screen background. */
  cream: string;
  creamDark: string;
  /** Always white — used for text/icons on dark brand surfaces. */
  white: string;
  /** Card / sheet / elevated surface background. */
  surface: string;
  /** Borders / dividers / tracks. */
  gray200: string;
  gray400: string;
  gray500: string;
  gray600: string;
  gray800: string;
  danger: string;
  dangerSoft: string;

  tagEduBg: string;
  tagEduFg: string;
  tagSocBg: string;
  tagSocFg: string;
  tagEnvBg: string;
  tagEnvFg: string;
  tagHltBg: string;
  tagHltFg: string;
  tagWkndBg: string;
  tagWkndFg: string;
  tagPresBg: string;
  tagPresFg: string;
}

const tags = {
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

const greens = {
  green900: '#1a3a2a',
  green800: '#1e4433',
  green700: '#2d5a3d',
  green600: '#3a7050',
  green500: '#4a8a63',
  green300: '#7bbf95',
  green100: '#d4ead9',
  green50: '#edf6ef',
};

export const lightColors: Palette = {
  ...greens,
  ...tags,
  cream: '#f5f2ec',
  creamDark: '#ede9e0',
  white: '#ffffff',
  surface: '#ffffff',
  gray200: '#e8e5df',
  gray400: '#b0a99e',
  gray500: '#8a857d',
  gray600: '#6b6560',
  gray800: '#2c2825',
  danger: '#ef4444',
  dangerSoft: '#f87171',
};

export const darkColors: Palette = {
  ...greens,
  ...tags,
  cream: '#121a16', // app background
  creamDark: '#0e1612',
  white: '#ffffff', // stays white (text on dark brand surfaces)
  surface: '#1b2722', // cards / sheets
  gray200: '#33403a', // borders / dividers
  gray400: '#8b948d', // muted text
  gray500: '#9aa39b',
  gray600: '#c3cbc4', // secondary text
  gray800: '#eef1ed', // primary text
  danger: '#f87171',
  dangerSoft: '#fca5a5',
};

export const palettes = { light: lightColors, dark: darkColors };

/**
 * Default/static palette. Used by non-reactive helper maps below and as a
 * fallback. Reactive UI should read `colors` from `useTheme()` instead.
 */
export const colors: Palette = lightColors;

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
  'Educação': { bg: tags.tagEduBg, fg: tags.tagEduFg, emoji: '📚' },
  'Social': { bg: tags.tagSocBg, fg: tags.tagSocFg, emoji: '🤝' },
  'Meio Ambiente': { bg: tags.tagEnvBg, fg: tags.tagEnvFg, emoji: '🌿' },
  'Saúde': { bg: tags.tagHltBg, fg: tags.tagHltFg, emoji: '💚' },
};

export const modalityStyle: Record<string, { bg: string; fg: string }> = {
  Presencial: { bg: tags.tagPresBg, fg: tags.tagPresFg },
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
