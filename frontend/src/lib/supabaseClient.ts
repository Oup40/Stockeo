import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquant(e) dans .env.local')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)