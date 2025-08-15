-- Activer RLS sur la table parcs
ALTER TABLE public.parcs ENABLE ROW LEVEL SECURITY;

-- Politique pour les admins : accès à tous les parcs
CREATE POLICY "Admins can access all parcs" ON public.parcs
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'role')::text = 'admin'
  );

-- Politique pour les autres utilisateurs : accès seulement aux parcs associés
CREATE POLICY "Users can access their associated parcs" ON public.parcs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.utilisateurs_parcs up
      WHERE up.parc_id = parcs.id
        AND up.utilisateur_id = (auth.jwt() ->> 'sub')::uuid
    )
  );

-- Révoquer l'accès public
REVOKE ALL PRIVILEGES ON TABLE public.parcs FROM PUBLIC;
REVOKE ALL PRIVILEGES ON TABLE public.parcs FROM anon;
GRANT SELECT ON TABLE public.parcs TO authenticated;
