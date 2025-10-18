import { supabase } from './supabase';
import { ProcessRecipeResponse, ApiResponse } from '../types';

export async function processRecipeFromUrl(url: string): Promise<ApiResponse<ProcessRecipeResponse>> {
  try {
    const { data, error } = await supabase.functions.invoke('process-recipe', {
      body: { url },
    });

    if (error) {
      return {
        error: {
          message: error.message || 'Failed to process recipe',
          details: error,
        },
      };
    }

    return { data };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error,
      },
    };
  }
}
