import { supabase } from '@/lib/supabaseClient'

export type Mouvement = {
  id: string
  equipement_id: string
  type_id: string
  description: string | null
  date: string
  parc_id: string
  created_by: string | null
}

export async function listMouvementsByParc(parcId: string): Promise<Mouvement[]> {
  const { data, error } = await supabase
    .from('mouvements')
    .select('id, equipement_id, type_id, description, date, parc_id, created_by')
    .eq('parc_id', parcId)
    .order('date', { ascending: false })

  if (error) throw error
  return data ?? []
}