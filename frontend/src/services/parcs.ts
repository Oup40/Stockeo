import { supabase } from '@/lib/supabaseClient';
export type Parc = { id: string; nom: string }

export async function listParcs(): Promise<Parc[]> {
  const { data, error } = await supabase
    .from('vue_parcs_accessibles')
    .select('id, nom')
    .order('nom')
  if (error) throw error
  return data ?? []
}