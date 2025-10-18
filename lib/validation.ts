/**
 * Fonctions de validation typées
 */

import { VideoUrlValidation } from '../types';

/**
 * Valide une URL de vidéo TikTok ou Instagram
 */
export function validateVideoUrl(url: string): VideoUrlValidation {
  if (!url || !url.trim()) {
    return {
      isValid: false,
      error: 'Please paste a video URL',
    };
  }

  const trimmedUrl = url.trim();

  // Validation TikTok
  if (
    trimmedUrl.includes('tiktok.com') ||
    trimmedUrl.includes('vm.tiktok.com')
  ) {
    return {
      isValid: true,
      platform: 'tiktok',
    };
  }

  // Validation Instagram
  if (
    trimmedUrl.includes('instagram.com/reel') ||
    trimmedUrl.includes('instagram.com/p/')
  ) {
    return {
      isValid: true,
      platform: 'instagram',
    };
  }

  return {
    isValid: false,
    error: 'Please use a TikTok or Instagram URL',
  };
}

/**
 * Vérifie si une URL est déjà dans le cache (éviter reprocessing)
 */
export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url.trim());
    // Retire les paramètres de tracking
    urlObj.search = '';
    urlObj.hash = '';
    return urlObj.toString();
  } catch {
    return url.trim();
  }
}
