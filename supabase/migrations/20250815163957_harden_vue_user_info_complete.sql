set search_path = public;

-- 1) Recrée la vue en mode SECURITY INVOKER et sans dépendre de auth.users
--    -> on évite l'exposition d'auth.users
--    -> on s'exécute avec les droits de l'appelant (pas du créateur)
drop view if exists public.vue_user_info_complete;

create view public.vue_user_info_complete
with (security_invoker = true) -- évite l'équivalent "security definer"
as
select
  u.id,
  -- Email lu depuis le JWT pour ne plus dépendre de auth.users
  (auth.jwt() ->> 'email')::text as email,
  coalesce((auth.jwt() ->> 'role'), u.role)::text as role_effectif,
  u.prenom,
  u.nom,
  coalesce(
    array_agg(distinct up.parc_id) filter (where up.parc_id is not null),
    '{}'::bigint[]
  ) as parcs_ids
from public.utilisateurs u
left join public.utilisateurs_parcs up on up.utilisateur_id = u.id
group by u.id, u.prenom, u.nom, role_effectif, email;

-- 2) Droits : on coupe tout accès à anon, on limite à authenticated
revoke all on view public.vue_user_info_complete from public; -- retire les GRANT implicites
revoke all on view public.vue_user_info_complete from anon;
grant select on view public.vue_user_info_complete to authenticated;
-- (optionnel) si tu veux que service_role y accède :
grant select on view public.vue_user_info_complete to service_role;