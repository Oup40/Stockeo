import { mapPgErrorToMessage } from '../lib/errorMessages'
import { supabase } from '../lib/supabaseClient'

// Types légers utilisés côté UI
export type Equipement = {
  id: string
  parc_id: string
  modele_id: string
  type_id: string
  cid_contrat: string
  vid_reference: string
  etat_id: string | null
  lieu_id: string | null
  statut_id: string | null
  usager_id: string | null
  commentaires: string | null
  deleted_at: string | null
}

// Type minimal attendu pour créer un équipement
export type EquipementInsert = {
  type_id: string
  modele_id: string
  etat_id: string
  lieu_id: string
  statut_id: string
  parc_id: string
  cid_contrat: string
  vid_reference: string
  usager_id?: string | null
  commentaires?: string | null
}

export async function listEquipementsByParc(parcId: string): Promise<Equipement[]> {
  const { data, error } = await supabase
    .from('equipements')
    .select(
      'id, parc_id, modele_id, type_id, cid_contrat, vid_reference, etat_id, lieu_id, statut_id, usager_id, commentaires, deleted_at, created_at'
    )
    .eq('parc_id', parcId)
    .order('created_at', { ascending: false })

  if (error) {
    const friendly = mapPgErrorToMessage(error as any)
    throw new Error(friendly || (error as any).message)
  }
  return (data ?? []) as unknown as Equipement[]
}

export async function createEquipement(payload: EquipementInsert) {
  // Normalisation côté client (évitons les faux doublons avec espaces)
  const cleaned = {
    ...payload,
    cid_contrat: payload.cid_contrat?.trim(),
    vid_reference: payload.vid_reference?.trim(),
  }

  const { data, error } = await supabase
    .from('equipements')
    .insert(cleaned)
    .select('*')
    .single()

  if (error) {
    const friendly = mapPgErrorToMessage(error as any)
    throw new Error(friendly || (error as any).message)
  }

  return data
}