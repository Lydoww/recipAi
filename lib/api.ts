/**
 * Helpers pour les appels API typés
 */

import { ApiResponse, ApiError } from '../types';

/**
 * Wrapper typé pour les appels API avec gestion d'erreurs
 */
export async function apiCall<T>(
  promise: Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const data = await promise;
    return { data };
  } catch (error) {
    return {
      error: formatError(error),
    };
  }
}

/**
 * Formate une erreur en ApiError
 */
function formatError(error: unknown): ApiError {
  if (error instanceof Error) {
    return {
      message: error.message,
      details: error,
    };
  }

  if (typeof error === 'string') {
    return {
      message: error,
    };
  }

  return {
    message: 'An unexpected error occurred',
    details: error,
  };
}

/**
 * Helper pour gérer les erreurs Supabase
 */
export function handleSupabaseError(error: any): ApiError {
  if (!error) {
    return {
      message: 'An unknown error occurred',
    };
  }

  return {
    message: error.message || 'Database error',
    code: error.code,
    details: error,
  };
}

/**
 * Helper pour logger les erreurs (dev uniquement)
 */
export function logError(context: string, error: ApiError): void {
  if (__DEV__) {
    console.error(`[${context}]`, error);
  }
}
