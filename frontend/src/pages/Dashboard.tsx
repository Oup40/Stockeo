import { useEffect, useMemo, useState } from 'react'
import type { Page } from '../lib/routes'
import { supabase } from '../lib/supabaseClient'

type MeView = {
  id: string
  email: string | null
  role_effectif: string | null
  prenom: string | null
  nom: string | null
  parcs_ids: string[] // UUID[]
}

type Parc = { id: string; nom: string }

const LS_KEY = 'stockeo.selectedParcId'

interface DashboardProps {
  currentPage: Page
  setCurrentPage: React.Dispatch<React.SetStateAction<Page>>
}

// Squelettes écrans
function EquipementsScreen({ parcId }: { parcId: string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Équipements</h2>
      <div className="text-sm opacity-70">
        Écran des équipements pour le parc {parcId}
        <br />
        <em>À implémenter : liste, ajout, modification, suppression</em>
      </div>
    </div>
  )
}
function MouvementsScreen({ parcId }: { parcId: string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Mouvements</h2>
      <div className="text-sm opacity-70">
        Écran des mouvements pour le parc {parcId}
        <br />
        <em>À implémenter : historique, création, validation</em>
      </div>
    </div>
  )
}
function UsagersScreen({ parcId }: { parcId: string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Usagers</h2>
      <div className="text-sm opacity-70">
        Écran des usagers pour le parc {parcId}
        <br />
        <em>À implémenter : liste, ajout, modification, suppression</em>
      </div>
    </div>
  )
}

export default function Dashboard({ currentPage, setCurrentPage }: DashboardProps) {
  const [me, setMe] = useState<MeView | null>(null)
  const [parcs, setParcs] = useState<Parc[]>([])
  const [selectedParcId, setSelectedParcId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) setSelectedParcId(raw)
  }, [])

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const { data: authRes, error: authErr } = await supabase.auth.getUser()
        if (authErr) throw authErr
        const user = authRes?.user
        if (!user) {
          setMe(null)
          setParcs([])
          setSelectedParcId(null)
          setLoading(false)
          return
        }

        const { data: meData, error: meErr } = await supabase
          .from('vue_user_info_complete')
          .select('id,email,role_effectif,prenom,nom,parcs_ids')
          .eq('id', user.id)
          .maybeSingle()
        if (meErr) throw meErr
        setMe((meData as MeView) ?? null)

        const { data: parcsData, error: parcsErr } = await supabase
          .from('parcs')
          .select('id,nom')
          .order('nom', { ascending: true })
        if (parcsErr) throw parcsErr
        setParcs((parcsData as Parc[]) ?? [])
      } catch (e) {
        console.error('Dashboard load error:', e)
        setMe(null)
        setParcs([])
        setSelectedParcId(null)
      }
      setLoading(false)
    }
    run()
  }, [])

  useEffect(() => {
    if (parcs.length === 0) {
      setSelectedParcId(null)
      localStorage.removeItem(LS_KEY)
      return
    }
    if (!selectedParcId || !parcs.some((p) => p.id === selectedParcId)) {
      const first = parcs[0]!.id
      setSelectedParcId(first)
      localStorage.setItem(LS_KEY, first)
    }
  }, [parcs, selectedParcId])

  const handleSelectParc = (id: string) => {
    setSelectedParcId(id)
    localStorage.setItem(LS_KEY, id)
  }

  const headerRight = useMemo(() => {
    if (loading) return 'Chargement…'
    if (!me) return 'Non connecté'
    const email = me.email ?? '—'
    const role = me.role_effectif ?? '—'
    return `${email} · ${role}`
  }, [loading, me])

  const debugInfo = useMemo(() => {
    if (!me) return null
    return (
      <div className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-4">
        <h3 className="mb-2 text-sm font-medium text-yellow-800">Debug - Informations utilisateur</h3>
        <div className="space-y-1 text-xs text-yellow-700">
          <div>ID: {me.id}</div>
          <div>Email: {me.email}</div>
          <div>Rôle effectif: {me.role_effectif}</div>
          <div>
            Parcs IDs: {me.parcs_ids?.length || 0} parc(s) - {me.parcs_ids?.join(', ') || 'aucun'}
          </div>
          <div>Parcs disponibles: {parcs.length} parc(s)</div>
        </div>
      </div>
    )
  }, [me, parcs])

  const logout = async () => {
    await supabase.auth.signOut()
    setCurrentPage('login')
  }

  const currentScreen =
    currentPage === 'dashboard' ? 'dashboard' : (currentPage.split('/').pop() as string) || 'dashboard'

  const renderCurrentScreen = () => {
    if (!selectedParcId) return null
    switch (currentScreen) {
      case 'equipements':
        return <EquipementsScreen parcId={selectedParcId} />
      case 'mouvements':
        return <MouvementsScreen parcId={selectedParcId} />
      case 'usagers':
        return <UsagersScreen parcId={selectedParcId} />
      default:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Tableau de bord</h2>
            <div className="text-sm opacity-70">
              Bienvenue dans Stockéo <br />
              Sélectionnez un parc et utilisez la navigation pour accéder aux différentes fonctionnalités.
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold text-gray-900">Stockéo</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">{headerRight}</div>
            <button
              className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
              onClick={logout}
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="min-h-screen w-64 bg-white shadow-sm">
          <div className="border-b p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-900">Sélection du parc</h3>
            {parcs.length === 0 ? (
              <div className="text-sm text-gray-500">Aucun parc accessible.</div>
            ) : (
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={selectedParcId ?? ''}
                onChange={(e) => handleSelectParc(e.target.value)}
              >
                {parcs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nom}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Navigation */}
          <nav className="p-4">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                    currentScreen === 'dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Tableau de bord
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('dashboard/equipements')}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                    currentScreen === 'equipements'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Équipements
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('dashboard/mouvements')}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                    currentScreen === 'mouvements'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Mouvements
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('dashboard/usagers')}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                    currentScreen === 'usagers'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Usagers
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main */}
        <div className="flex-1 p-6">
          {!me ? (
            <div className="text-sm text-gray-600">
              Vous n’êtes pas connecté.{' '}
              <button onClick={() => setCurrentPage('login')} className="text-blue-600 hover:underline">
                Se connecter
              </button>
            </div>
          ) : (
            <>
              {debugInfo}
              {renderCurrentScreen()}
            </>
          )}
        </div>
      </div>
    </div>
  )
}