import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { Database } from '../types/database';
import { config } from './config';

// Utilise les variables d'environnement sécurisées
export const supabase = createClient<Database>(
  config.supabase.url,
  config.supabase.anonKey
);
