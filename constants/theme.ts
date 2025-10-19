/**
 * Design System - Constantes de style centralisées
 *
 * Principes :
 * - DRY : une seule source de vérité pour les styles
 * - Cohérence : mêmes valeurs partout
 * - Maintenabilité : un seul endroit à modifier
 */

export const colors = {
  // Brand colors - Premium minimalist palette
  primary: '#84A98C', // Sage green (natural, calming)
  primaryDark: '#52796F', // Eucalyptus dark (sophisticated)
  primaryLight: '#A8C5AC', // Sage light (subtle)

  secondary: '#CAD2C5', // Pale sage (neutral accent)
  secondaryDark: '#B4BFB6',
  secondaryLight: '#DFE5DE',

  accent: '#52796F', // Deep eucalyptus (premium)
  accentDark: '#354F52',
  accentLight: '#6B9080',

  // Neutral colors - Warm minimalist
  white: '#FFFFFF',
  black: '#000000',
  offWhite: '#FAFAF9', // Warm off-white
  gray: {
    50: '#FAFAF9',
    100: '#F5F5F4',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#2F3E46', // Charcoal (primary text)
    900: '#1C1917',
  },

  // Semantic colors - Subtle and elegant
  success: '#6B9080',
  error: '#C1666B',
  warning: '#D4A373',
  info: '#4A7C89',

  // Background colors
  background: '#FAFAF9', // Warm off-white
  backgroundSecondary: '#F5F5F4',
  backgroundTertiary: '#FFFFFF',

  // Gradient colors
  gradient: {
    primary: ['#84A98C', '#6B9080'], // Sage gradient
    secondary: ['#52796F', '#354F52'], // Dark eucalyptus
    overlay: ['rgba(47, 62, 70, 0.7)', 'rgba(47, 62, 70, 0)'], // Charcoal overlay
    card: ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)'], // Glassmorphism
  },

  // Text colors
  text: {
    primary: '#2F3E46', // Charcoal
    secondary: '#57534E', // Medium gray
    tertiary: '#A8A29E', // Light gray
    inverse: '#FFFFFF',
  },

  // Border colors
  border: {
    light: '#F5F5F4',
    default: '#E7E5E4',
    dark: '#D6D3D1',
    accent: '#CAD2C5',
  },

  // Overlay
  overlay: 'rgba(47, 62, 70, 0.6)', // Charcoal overlay
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const borderRadius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  '2xl': 28,
  full: 9999,
} as const;

export const typography = {
  fontSize: {
    xs: 12,
    sm: 13,
    base: 14,
    md: 15,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 22,
    '4xl': 26,
    '5xl': 28,
    '6xl': 32,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: 20,
    normal: 22,
    relaxed: 24,
  },
} as const;

export const shadows = {
  xs: {
    shadowColor: '#2F3E46',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sm: {
    shadowColor: '#2F3E46',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#2F3E46',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: '#2F3E46',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
  xl: {
    shadowColor: '#2F3E46',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 12,
  },
} as const;

export const layout = {
  screenPadding: spacing.lg,
  cardPadding: spacing.lg,
  maxWidth: 600,
} as const;
