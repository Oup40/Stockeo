// Traduit les erreurs Supabase/Postgres vers des messages lisibles pour l'utilisateur.
// À utiliser dans tous les services d'insert/update.

export type PgLikeError = { code?: string; message?: string } | null

export function mapPgErrorToMessage(error: PgLikeError): string | null {
  if (!error) return null

  const code = String((error as any).code ?? '')
  const msg = String((error as any).message ?? '').toLowerCase()

  // Unicité (doublon)
  if (code === '23505') {
    if (msg.includes('idxuniq_eqt_cid_contrat_active')) return '"cid_contrat" déjà présent pour un équipement actif.'
    if (msg.includes('idxuniq_eqt_vid_reference_active')) return '"vid_reference" déjà présent pour un équipement actif.'
    if (msg.includes('uniq_equipements_cid_contrat')) return '"cid_contrat" déjà présent.'
    if (msg.includes('uniq_equipements_vid_reference')) return '"vid_reference" déjà présent.'
    return 'Valeur déjà présente (contrainte d\'unicité).'
  }

  // Colonnes obligatoires vides (CHECK)
  if (code === '23514') {
    if (msg.includes('chk_equipements_identifiers_not_blank_active')) {
      return '"cid_contrat" et "vid_reference" sont requis pour un équipement actif.'
    }
  }

  // Par défaut : message brut ou générique
  return (error as any).message ?? 'Une erreur est survenue.'
}