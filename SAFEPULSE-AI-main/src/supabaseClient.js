import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If env vars are not set, we use a local mock mode (demo auth)
const isConfigured = supabaseUrl && supabaseAnonKey;

export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const IS_DEMO_MODE = !isConfigured;
