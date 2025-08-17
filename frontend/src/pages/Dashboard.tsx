import EquipementsList from '@/components/EquipementsList'
import MouvementsList from '@/components/MouvementsList'
import UsagersList from '@/components/UsagersList'
import { listParcs, type Parc } from '@/services/parcs'
import { useEffect, useState } from 'react'

export type Page = 'dashboard' | 'equipements' | 'mouvements' | 'usagers' | 'profil'

export default function Dashboard(
  { currentPage = 'dashboard', setCurrentPage }: { currentPage?: Page; setCurrentPage: (p: Page) => void }
) {
  const [parcs, setParcs] = useState<Parc[]>([])
  const [selectedParcId, setSelectedParcId] = useState<string | null>(() => localStorage.getItem('stockeo.parcId'))

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const items = await listParcs()
        if (!mounted) return
        setParcs(items)
        if (!selectedParcId && items.length > 0) {
          setSelectedParcId(items[0].id)
          localStorage.setItem('stockeo.parcId', items[0].id)
        }
      } catch (e) {
        console.error('Erreur chargement parcs:', e)
      }
    })()
    return () => { mounted = false }
  }, [])

  const onChangeParc = (value: string) => {
    setSelectedParcId(value || null)
    if (value) localStorage.setItem('stockeo.parcId', value)
    else localStorage.removeItem('stockeo.parcId')
  }

  return (
    <div className="p-4">
      <nav className="space-x-2">
        <button onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
        <button onClick={() => setCurrentPage('equipements')}>Équipements</button>
        <button onClick={() => setCurrentPage('mouvements')}>Mouvements</button>
        <button onClick={() => setCurrentPage('usagers')}>Usagers</button>
        <button onClick={() => setCurrentPage('profil')}>Profil</button>
      </nav>

      <div className="mt-3">
        <label className="mr-2">Parc sélectionné :</label>
        <select value={selectedParcId ?? ''} onChange={(e) => onChangeParc(e.target.value)}>
          <option value="">— Sélectionner un parc —</option>
          {parcs.map((p) => (
            <option key={p.id} value={p.id}>{p.nom}</option>
          ))}
        </select>
      </div>

      {currentPage === 'equipements' && selectedParcId && (
        <div className="mt-4">
          <EquipementsList parcId={selectedParcId} />
        </div>
      )}

      {currentPage === 'mouvements' && selectedParcId && (
        <div className="mt-4">
          <MouvementsList parcId={selectedParcId} />
        </div>
      )}

      {currentPage === 'usagers' && selectedParcId && (
        <div className="mt-4">
          <UsagersList parcId={selectedParcId} />
        </div>
      )}

      {currentPage === 'dashboard' && (
        <div className="mt-4">
          <h1 className="text-2xl font-bold">Bienvenue !</h1>
          <p>Sélectionnez une section ci-dessus pour commencer.</p>
          {!parcs.length && (
            <p className="mt-2 text-sm opacity-70">
              Aucun parc visible. (Vérifie les rôles/politiques RLS ou l’affectation aux parcs.)
            </p>
          )}
        </div>
      )}
    </div>
  )
}