import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont requis.\n' +
        'Copiez .env.local.example vers .env.local et configurez vos identifiants Supabase.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
