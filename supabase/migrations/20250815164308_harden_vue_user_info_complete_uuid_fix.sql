set search_path = public;

-- On remplace proprement la vue (pas de SECURITY DEFINER, pas de auth.users)
drop view if exists public.vue_user_info_complete;

create view public.vue_user_info_complete
with (security_invoker = true)
as
select
  u.id,
  (auth.jwt() ->> 'email')::text as email,
  coalesce((auth.jwt() ->> 'role'), u.role)::text as role_effectif,
  u.prenom,
  u.nom,
  coalesce(
    array_agg(distinct up.parc_id) filter (where up.parc_id is not null),
    '{}'::uuid[]
  ) as parcs_ids
from public.utilisateurs u
left join public.utilisateurs_parcs up on up.utilisateur_id = u.id
group by u.id, u.prenom, u.nom, role_effectif, email;

-- Droits: pas d'accès anon, uniquement authenticated (+ service_role si besoin)
revoke all on view public.vue_user_info_complete from public;
revoke all on view public.vue_user_info_complete from anon;
grant select on view public.vue_user_info_complete to authenticated;
grant select on view public.vue_user_info_complete to service_role;