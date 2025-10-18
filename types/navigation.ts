/**
 * Types pour la navigation Expo Router
 */

import { Recipe } from './database';

// Paramètres typés pour chaque route
export type RouteParams = {
  '/': undefined;
  '/add-recipe': undefined;
  '/recipe-detail': {
    recipe: string; // JSON stringifié de Recipe
  };
  '/modal': undefined;
};

// Helper pour typer les params de navigation
export type RecipeDetailParams = {
  recipe: Recipe;
};
