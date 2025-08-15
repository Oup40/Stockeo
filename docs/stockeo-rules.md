# Stockéo — Règles d’architecture & conventions

## 0) TL;DR

- **Frontend** : React + Vite + TypeScript, Router, API Supabase.
- **Backend** : Supabase (Postgres + Auth + RLS), vue-driven pour l’UI.
- **Sécurité** : `security_invoker=true`, **pas d’expo** `auth.users`, RLS partout.
- **Parcs** : admin ⇒ tous les parcs ; sinon ⇒ par liaisons `utilisateurs_parcs`.
- **Pas d’enums** : toujours des tables de référence.
- **Jamais de secrets** commités.
- **Filtrage parc** : côté front via `selectedParcId`, côté DB via RLS.

---

## 1) Backend (Supabase)

### 1.1 Vues et principes

- `public.vue_user_info_complete`
  - Champs : `id`, `email` (JWT), `role_effectif` (JWT ou fallback table), `prenom`, `nom`, `parcs_ids uuid[]`.
  - Règle admin : retourne **tous** les `parcs.id`.
  - `security_invoker = true`.
  - **Droits** : `authenticated` (SELECT), `service_role` (SELECT), **aucun accès** `PUBLIC`/`anon`.
  - **Ne pas** joindre `auth.users` (email issu du **JWT**).
- `public.vue_parcs_accessibles`
  - Champs : `id`, `nom` des parcs accessibles (admin ⇒ tous ; autres ⇒ via `utilisateurs_parcs`).
  - `security_invoker = true`, mêmes **droits** que ci‑dessus.

### 1.2 Tables minimales

- `public.utilisateurs (id uuid pk, prenom, nom, role text, created_at, updated_at, deleted_at null)`
- `public.parcs (id uuid pk default gen_random_uuid(), nom text unique, created_at)`
- `public.utilisateurs_parcs (utilisateur_id uuid fk, parc_id uuid fk, pk(utilisateur_id, parc_id))`

> Les tables métier (ex. `equipements`, `mouvements`, `usagers`, `seuils`) **doivent** avoir `parc_id uuid not null` (FK vers `parcs.id`).

### 1.3 RLS (principes)

- Admin (`role = 'admin'`) : accès global (policies explicites).
- Autres rôles : accès restreint au `parc_id` ∈ `utilisateurs_parcs` pour l’utilisateur (`auth.jwt()->>'sub'`).
- Éviter `USING`/`WITH CHECK` trop permissifs. Toujours filtrer par `parc_id`.

### 1.4 Conventions migrations

- Nom : `YYYYMMDDHHMMSS_description.sql`
- Une migration = une intention. Pas de mélange “data seed + schema” si possible.
- **Jamais** de secrets dans migrations.
- Si une migration est erronée, préférer une **migration de correction** plutôt que de réécrire l’historique Git.

---

## 2) Frontend (React + Vite + TS)

### 2.1 Structure recommandée

src/
lib/ # supabaseClient, utils API
hooks/ # hooks (useCurrentUser, useParcFilter…)
routes/ # ProtectedRoute, GuestRoute
pages/ # Login, Signup, Dashboard, Profile, ...
components/ # UI (ParcSelector, Header, etc.)
App.tsx
main.tsx

### 2.2 Supabase client

- `src/lib/supabaseClient.ts` lit **exclusivement** `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` depuis `.env.local`.
- **Interdit** : clé en dur dans le code.

### 2.3 Auth & Router

- Routes :
  - `/login` & `/signup` : **GuestRoute** (redirige vers `/dashboard` si connecté)
  - `/dashboard` & `/profil` : **ProtectedRoute** (redirige `/login` si non connecté)
- `Dashboard` consomme :
  - `vue_user_info_complete` (pour `email`, `role_effectif`, `parcs_ids`)
  - `vue_parcs_accessibles` (pour `id, nom`)
- **Sélecteur de parc** : valeur persistée dans `localStorage` (`stockeo.selectedParcId`).

### 2.4 Filtrage des données

- Toute requête métier **doit** inclure `parc_id = selectedParcId` côté front.
- Ne jamais “reconstruire” les parcs côté front sans la vue — s’appuyer sur `vue_parcs_accessibles`.

---

## 3) Qualité & conventions

### 3.1 TypeScript

- Pas de `any` implicites.
- Types modèles centralisés si besoin (`types/`).

### 3.2 ESLint / Prettier

- ESLint v8 (pas de flat config v9).
- Lint script : `eslint "src/**/*.{ts,tsx,js,jsx}" --max-warnings=0`.
- Prettier : largeur 100, trailing commas all, semi true (adapter si déjà configuré).
- **CI/Local** : `npm run lint` doit passer avant merge.

### 3.3 Commits & branches

- Convention : `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `ci:`, `sec:`.
- Unité de commit raisonnable + message clair.

---

## 4) Sécurité & RGPD

- Jamais de secrets (API keys) commités. `.env*` ignorés par Git.
- Droits `PUBLIC/anon` révoqués pour les vues exposées à l’API.
- `security_invoker=true` pour les vues.
- Revue régulière du **Database Linter** Supabase.

---

## 5) Roadmap (prochaines étapes)

1. Finaliser le router : `/`, `/login`, `/signup`, `/dashboard`, `/profil`.
2. Pages métier :
   - **Équipements** (CRUD soft-delete, référence `types_equipement`, `statuts_equipement`, `etats_equipement`, `lieux_stockage`).
   - **Mouvements** (`INSERT` only pour technicien, historique consultable).
   - **Usagers** (soft delete).
3. RLS pour ces tables (admin bypass, autres par `parc_id`).
4. Composants UI : `ParcSelector`, `HeaderUserInfo`, tableaux paginés.
5. Tests manuels :
   - Admin ⇒ voit tous les parcs et toutes les données.
   - Technicien/visiteur ⇒ seulement ses parcs.

---

## 6) Annexes

### 6.1 Identifiants types d’équipement (UUID)

- Téléassistance : `eb005b1a-c255-4d02-82b6-ad47b1886e80`
- Déclencheur : `421c4dc5-68f8-4987-8d4f-b827038af4fb`
- Tablette : `7a31f799-e80d-43d7-b846-cbe3694947f7`
- Domopack : `46656e4f-2eac-45ee-9ae8-c9628b43936b`
- Modules Solem : `28299051-93c6-4c1d-8cfd-784fbc803860`

### 6.2 Paramètres dev

- Vite sur `5173` (ou 5174/5175 si occupé).
- `vite.config.ts` : `@vitejs/plugin-react-swc`.
- `.env.local` **obligatoire**.

> **Rappel pour l’IA Cursor** : Toujours expliquer les changements multi-fichiers et respecter ce document. En cas de doute de sécurité, privilégier la solution la plus restrictive.
