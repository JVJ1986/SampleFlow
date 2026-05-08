import { createClient } from '@supabase/supabase-js';

// Get these from: https://supabase.com → Your Project → Settings → API
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl.includes('aBcDe')) {
  console.error('❌ REACT_APP_SUPABASE_URL is missing or incorrect in Vercel env vars');
}

if (!supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
  console.error('❌ REACT_APP_SUPABASE_ANON_KEY is missing or incorrect in Vercel env vars');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
