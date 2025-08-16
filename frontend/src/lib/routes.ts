// Centralise the app "Page" union so every component shares the same type
export type Page =
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'profile'
  | 'dashboard/equipements'
  | 'dashboard/mouvements'
  | 'dashboard/usagers'