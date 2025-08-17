import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Parc = { id: string; nom: string }
const LS_KEY = 'stockeo.selectedParcId'

export default function ParcSelector({ onChange }: { onChange: (id: string | null) => void }) {
  const [parcs, setParcs] = useState<Parc[]>([])
  const [parcId, setParcId] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem(LS_KEY) : null
  )

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('vue_parcs_accessibles').select('id, nom').order('nom')
      setParcs((data ?? []) as Parc[])
    }
    load()
  }, [])

  useEffect(() => {
    if (parcId) localStorage.setItem(LS_KEY, parcId)
    else localStorage.removeItem(LS_KEY)
    onChange(parcId)
  }, [parcId, onChange])

  const options = useMemo(() => [{ id: '', nom: '— Sélectionner un parc —' }, ...parcs], [parcs])

  return (
    <select
      className="rounded border p-2"
      value={parcId ?? ''}
      onChange={(e) => setParcId(e.target.value || null)}
    >
      {options.map((p) => (
        <option key={p.id || 'none'} value={p.id}>
          {p.nom}
        </option>
      ))}
    </select>
  )
}