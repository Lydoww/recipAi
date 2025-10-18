import Constants from 'expo-constants';

// Validation des variables d'environnement au démarrage
const validateEnv = () => {
  const requiredVars = {
    EXPO_PUBLIC_SUPABASE_URL: Constants.expoConfig?.extra?.supabaseUrl,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: Constants.expoConfig?.extra?.supabaseAnonKey,
  };

  const missing = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Make sure your .env file is properly configured.'
    );
  }

  return requiredVars;
};

const env = validateEnv();

export const config = {
  supabase: {
    url: env.EXPO_PUBLIC_SUPABASE_URL!,
    anonKey: env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  },
  // Prêt pour plus tard
  openai: {
    apiKey: Constants.expoConfig?.extra?.openaiApiKey || '',
  },
  // Limites de rate limiting
  rateLimit: {
    maxRecipesPerDay: 10,
  },
} as const;
