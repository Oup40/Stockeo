set search_path = public;

drop view if exists public.vue_user_info_complete;

create view public.vue_user_info_complete
with (security_invoker = true)
as
with base as (
  select
    u.id,
    (auth.jwt() ->> 'email')::text as email,
    coalesce((auth.jwt() ->> 'role'), u.role)::text as role_effectif,
    u.prenom,
    u.nom
  from public.utilisateurs u
)
select
  b.id,
  b.email,
  b.role_effectif,
  b.prenom,
  b.nom,
  case
    when b.role_effectif = 'admin'
      then coalesce( (select array_agg(p.id order by p.id) from public.parcs p), '{}'::uuid[] )
    else coalesce(
           (select array_agg(distinct up.parc_id order by up.parc_id)
              from public.utilisateurs_parcs up
             where up.utilisateur_id = b.id),
           '{}'::uuid[]
         )
  end as parcs_ids
from base b;

-- Droits: pas d'accès PUBLIC/anon, uniquement authenticated (+ service_role si besoin)
REVOKE ALL PRIVILEGES ON TABLE public.vue_user_info_complete FROM PUBLIC;
REVOKE ALL PRIVILEGES ON TABLE public.vue_user_info_complete FROM anon;
GRANT SELECT ON TABLE public.vue_user_info_complete TO authenticated;
GRANT SELECT ON TABLE public.vue_user_info_complete TO service_role;