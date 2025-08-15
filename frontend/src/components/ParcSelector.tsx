import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Parc = { id: string; nom: string }

export default function ParcSelector({
  value,
  onChange,
}: {
  value: string | null
  onChange: (id: string | null) => void
}) {
  const [parcs, setParcs] = useState<Parc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('vue_parcs_accessibles')
        .select('id,nom')
        .order('nom', { ascending: true })
      if (error) {
        console.error('vue_parcs_accessibles:', error)
        setParcs([])
      } else {
        setParcs(data as Parc[])
        if (!value && data && data.length) onChange((data[0] as Parc).id)
      }
      setLoading(false)
    }
    run()
  }, [])

  if (loading) return <span>Chargement…</span>
  if (parcs.length === 0) return <span>Aucun parc accessible</span>

  return (
    <select className="border rounded p-2" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
      {parcs.map((p) => (
        <option key={p.id} value={p.id}>
          {p.nom}
        </option>
      ))}
    </select>
  )
}