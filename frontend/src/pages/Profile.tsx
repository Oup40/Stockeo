import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type MeView = {
  id: string
  email: string | null
  role_effectif: string | null
  prenom: string | null
  nom: string | null
  parcs_ids: string[]
}

export default function Profile() {
  const [me, setMe] = useState<MeView | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      const { data: authRes, error: authErr } = await supabase.auth.getUser()
      if (authErr) {
        console.error('Erreur auth:', authErr)
        setLoading(false)
        return
      }

      const user = authRes?.user
      if (!user) {
        setMe(null)
        setLoading(false)
        return
      }

      const { data: meData, error: meErr } = await supabase
        .from('vue_user_info_complete')
        .select('id,email,role_effectif,prenom,nom,parcs_ids')
        .eq('id', user.id)
        .maybeSingle()

      if (meErr) {
        console.error('Erreur vue_user_info_complete:', meErr)
      }

      setMe((meData as MeView) ?? null)
      setLoading(false)
    }

    loadProfile()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900">Chargement...</div>
        </div>
      </div>
    )
  }

  if (!me) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900">Utilisateur non trouvé</div>
          <a href="/login" className="text-blue-600 hover:underline">Se connecter</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold text-gray-900">Profil utilisateur</h1>
          <div className="flex items-center gap-4">
            <a 
              href="/dashboard"
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              Retour au dashboard
            </a>
            <button 
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50" 
              onClick={logout}
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Informations personnelles</h2>
          </div>
          
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 text-sm text-gray-900">{me.email || '—'}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <div className="mt-1 text-sm text-gray-900">{me.prenom || '—'}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <div className="mt-1 text-sm text-gray-900">{me.nom || '—'}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Rôle</label>
              <div className="mt-1">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  me.role_effectif === 'admin' 
                    ? 'bg-red-100 text-red-800'
                    : me.role_effectif === 'technicien'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {me.role_effectif || '—'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre de parcs accessibles</label>
              <div className="mt-1 text-sm text-gray-900">{me.parcs_ids?.length || 0}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Actions</h2>
          </div>
          
          <div className="px-6 py-4">
            <button
              onClick={logout}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}