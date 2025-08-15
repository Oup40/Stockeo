set search_path = public;

-- On supprime la vue si elle existe (nécessaire pour changer les noms de colonnes)
drop view if exists public.vue_user_info_complete;

-- On recrée la vue propre avec l’alias final "id"
create view public.vue_user_info_complete as
select
  u.id,
  au.email,
  coalesce((auth.jwt() ->> 'role'), u.role) as role_effectif,
  u.prenom,
  u.nom,
  coalesce(
    array_agg(distinct up.parc_id) filter (where up.parc_id is not null),
    '{}'
  ) as parcs_ids
from public.utilisateurs u
left join auth.users au on au.id = u.id
left join public.utilisateurs_parcs up on up.utilisateur_id = u.id
group by u.id, au.email, role_effectif, u.prenom, u.nom;