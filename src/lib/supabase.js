import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aymxqvlwulylazlqmcmk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bW14cWx2d3VseWF6bHFtY21rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNjEwNTQsImV4cCI6MjA5MzYzNzA1NH0.Cq62gHljS4YiO3fBcqlNm3c0gbWvhGutvyILs974K2A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️  Supabase credentials missing.\n' +
    'Copy .env.example to .env and fill in your Supabase URL and anon key.\n' +
    'Get them from: https://supabase.com → Your Project → Settings → API'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
