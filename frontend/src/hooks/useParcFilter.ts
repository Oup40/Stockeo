import { useEffect, useMemo, useState } from 'react'
const KEY = 'stockeo.selectedParcId'

export function useParcFilter(parcsIds: string[] | null | undefined) {
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem(KEY)
    if (raw) setSelected(raw)
  }, [])

  useEffect(() => {
    if (!parcsIds || parcsIds.length === 0) {
      setSelected(null)
      return
    }
    if (selected == null || !parcsIds.includes(selected)) {
      setSelected(parcsIds[0]!)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(parcsIds)])

  const set = (val: string | null) => {
    setSelected(val)
    if (val == null) localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, val)
  }

  const filter = useMemo(() => (selected ? { parc_id: selected } : {}), [selected])

  return { selectedParcId: selected, setSelectedParcId: set, filter }
}