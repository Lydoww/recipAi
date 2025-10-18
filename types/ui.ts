/**
 * Types pour les états et composants UI
 */

// ============================================
// LOADING STATES
// ============================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// FORM STATES
// ============================================

export interface FormState {
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

// ============================================
// COMPONENT PROPS
// ============================================

export interface BaseComponentProps {
  testID?: string;
}

// Props pour les états vides
export interface EmptyStateProps extends BaseComponentProps {
  icon: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}

// Props pour les états de chargement
export interface LoadingStateProps extends BaseComponentProps {
  message?: string;
}

// Props pour les messages d'erreur
export interface ErrorStateProps extends BaseComponentProps {
  message: string;
  onRetry?: () => void;
}
