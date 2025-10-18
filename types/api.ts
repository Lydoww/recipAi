/**
 * Types pour les appels API et réponses backend
 */

import { Recipe } from './database';

// ============================================
// REQUEST TYPES
// ============================================

export interface ProcessRecipeRequest {
  url: string;
  platform: 'tiktok' | 'instagram';
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ProcessRecipeResponse {
  recipe: Recipe;
  cached: boolean; // Si la recette était déjà dans le cache
}

// ============================================
// OPENAI TYPES
// ============================================

export interface TranscriptionResult {
  text: string;
  language: string;
  duration: number;
}

export interface ParsedRecipe {
  title: string;
  ingredients: string[];
  steps: string[];
  duration?: string;
  category?: string;
}

// ============================================
// RATE LIMITING TYPES
// ============================================

export interface RateLimitStatus {
  remaining: number;
  resetAt: Date;
  limit: number;
}

// ============================================
// VALIDATION TYPES
// ============================================

export interface VideoUrlValidation {
  isValid: boolean;
  platform?: 'tiktok' | 'instagram';
  error?: string;
}
