import { supabase } from '@/lib/supabaseClient'

export type Usager = {
  id: string
  parc_id: string
  nom: string
  prenom: string
  adresse: string | null
  complement_adresse?: string | null
  code_postal?: string | null
  commune?: string | null
  telephone_fixe?: string | null
  telephone_portable?: string | null
  commentaires?: string | null
  created_at?: string
  deleted_at?: string | null
}

export async function listUsagersByParc(parcId: string): Promise<Usager[]> {
  const { data, error } = await supabase
    .from('usagers')
    .select(
      'id, parc_id, nom, prenom, adresse, complement_adresse, code_postal, commune, telephone_fixe, telephone_portable, commentaires, created_at, deleted_at',
    )
    .eq('parc_id', parcId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}