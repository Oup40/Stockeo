# Règles Stockéo
- Pas d’ENUM → tables de référence: lieux_stockage, statuts_equipement, etats_equipement.
- Vues : pas de SECURITY DEFINER.
- RLS : admin via auth.jwt()->>'role' (source de vérité), pas la colonne.
- Soft delete (`deleted_at`) pour équipements/usagers.
- Migrations versionnées dans supabase/migrations/ (source de vérité).
- `vue_user_info_complete` doit renvoyer : id, email, role_effectif (JWT prioritaire), prenom, nom, parcs_ids[].
