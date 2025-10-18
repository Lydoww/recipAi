/**
 * Hook pour gérer les recettes avec typage strict
 */

import { useState, useEffect, useCallback } from 'react';
import { Recipe } from '../types';
import { supabase } from '../lib/supabase';
import { logError } from '../lib/api';

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        setError(supabaseError.message);
        logError('useRecipes.fetchRecipes', {
          message: supabaseError.message,
          details: supabaseError,
        });
        setRecipes([]);
      } else {
        setRecipes(data || []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch recipes';
      setError(errorMessage);
      logError('useRecipes.fetchRecipes', {
        message: errorMessage,
        details: err,
      });
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return {
    recipes,
    loading,
    error,
    refetch: fetchRecipes,
  };
}
