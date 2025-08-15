set search_path = public;

drop view if exists public.vue_parcs_accessibles;

create view public.vue_parcs_accessibles
with (security_invoker = true)
as
with me as (
  select
    (auth.jwt() ->> 'sub')::uuid as user_id,
    coalesce((auth.jwt() ->> 'role'), 'visiteur')::text as role_effectif
)
select p.id, p.nom
from public.parcs p
join me on true
where
  -- admin => tous les parcs
  (me.role_effectif = 'admin')
  -- autres => uniquement les parcs liés
  or exists (
    select 1
    from public.utilisateurs_parcs up
    where up.utilisateur_id = me.user_id
      and up.parc_id = p.id
  );

-- droits: pas d'accès PUBLIC/anon
REVOKE ALL PRIVILEGES ON TABLE public.vue_parcs_accessibles FROM PUBLIC;
REVOKE ALL PRIVILEGES ON TABLE public.vue_parcs_accessibles FROM anon;
GRANT SELECT ON TABLE public.vue_parcs_accessibles TO authenticated;
GRANT SELECT ON TABLE public.vue_parcs_accessibles TO service_role;