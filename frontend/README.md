# Stockéo - Frontend React

## 🎯 Vue d'ensemble

Stockéo est un **SaaS de gestion de stocks multi-parcs** développé avec React + TypeScript + Supabase.

## 🚀 État actuel

### ✅ Implémenté et fonctionnel

#### **Authentification & Navigation**

- ✅ Connexion/inscription avec Supabase Auth
- ✅ Routes protégées (`ProtectedRoute`, `GuestRoute`)
- ✅ Redirection automatique selon l'état d'authentification
- ✅ Navigation entre les pages

#### **Dashboard principal**

- ✅ Affichage des informations utilisateur (email, rôle)
- ✅ Sélecteur de parc avec persistance localStorage
- ✅ Navigation latérale vers les écrans métier
- ✅ Intégration avec les vues Supabase sécurisées

#### **Pages principales**

- ✅ **Login** : Interface moderne avec validation
- ✅ **Signup** : Création de compte avec confirmation email
- ✅ **Dashboard** : Interface principale avec sidebar
- ✅ **Profile** : Affichage des informations utilisateur

#### **Hooks personnalisés**

- ✅ `useCurrentUser` : Gestion de l'état d'authentification
- ✅ `useParcFilter` : Filtrage par parc avec localStorage

#### **Intégration backend**

- ✅ Client Supabase configuré
- ✅ Vues sécurisées : `vue_user_info_complete`, `vue_parcs_accessibles`
- ✅ RLS (Row Level Security) respectée

### 🔄 En cours / À finaliser

#### **Écrans métier (squelettes créés)**

- 🔄 **Équipements** : Interface de base créée
- 🔄 **Mouvements** : Interface de base créée
- 🔄 **Usagers** : Interface de base créée

#### **Fonctionnalités avancées**

- 🔄 CRUD complet pour chaque entité
- 🔄 Filtres et recherche
- 🔄 Gestion des permissions par rôle
- 🔄 Notifications et feedback utilisateur

## 🛠️ Architecture technique

### **Stack**

- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS (classes utilitaires)
- **Routing** : React Router v6
- **Backend** : Supabase (PostgreSQL + Auth + RLS)
- **Build** : Vite avec `@vitejs/plugin-react-swc`

### **Structure des fichiers**

```
src/
├── components/          # Composants réutilisables
├── hooks/              # Hooks personnalisés
│   ├── useCurrentUser.ts
│   └── useParcFilter.ts
├── lib/                # Configuration et types
│   ├── supabaseClient.ts
│   └── database.types.ts
├── pages/              # Pages principales
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   └── Profile.tsx
├── routes/             # Composants de routage
│   ├── ProtectedRoute.tsx
│   └── GuestRoute.tsx
└── main.tsx           # Point d'entrée
```

### **Sécurité**

- ✅ RLS (Row Level Security) côté Supabase
- ✅ Vues sécurisées avec `security_invoker = true`
- ✅ Filtrage par parc côté frontend
- ✅ JWT pour l'authentification
- ✅ Pas d'exposition de `auth.users`

## 🎨 Design & UX

### **Interface utilisateur**

- Design moderne et professionnel
- Palette de couleurs cohérente (bleu/gris)
- Responsive design
- États de chargement et feedback utilisateur
- Navigation intuitive avec sidebar

### **Expérience utilisateur**

- Redirection automatique selon l'état d'auth
- Persistance de la sélection de parc
- Messages d'erreur clairs
- Boutons d'action bien visibles

## 🔧 Configuration

### **Variables d'environnement**

Créer un fichier `.env.local` :

```env
VITE_SUPABASE_URL=https://ucdiwyopngnmwwtbvzme.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### **Dépendances principales**

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "@supabase/supabase-js": "^2.39.0",
  "typescript": "^5.0.0",
  "vite": "^5.0.0"
}
```

## 🚀 Démarrage rapide

```bash
# Installation
npm install

# Démarrage en développement
npm run dev

# Build de production
npm run build
```

L'application sera accessible sur `http://localhost:5173`

## 📋 Prochaines étapes

### **Priorité haute**

1. **Implémenter les écrans métier** (Équipements, Mouvements, Usagers)
2. **Créer les tables de référence** (types, statuts, lieux)
3. **Développer les policies RLS** pour les nouvelles tables
4. **Ajouter les fonctionnalités CRUD** complètes

### **Priorité moyenne**

1. **Améliorer l'UX** (notifications, confirmations)
2. **Ajouter des filtres avancés**
3. **Implémenter la recherche**
4. **Optimiser les performances**

### **Priorité basse**

1. **Tests unitaires et d'intégration**
2. **Documentation utilisateur**
3. **Monitoring et analytics**
4. **PWA features**

## 🔒 Sécurité et bonnes pratiques

- ✅ Pas d'enums Postgres (tables de référence)
- ✅ Soft delete avec `deleted_at`
- ✅ Validation côté client et serveur
- ✅ Gestion des erreurs appropriée
- ✅ Pas de secrets dans le code

## 📞 Support

Pour toute question ou problème :

1. Vérifier les logs de la console
2. Contrôler la configuration Supabase
3. Valider les variables d'environnement
4. Consulter la documentation Supabase
