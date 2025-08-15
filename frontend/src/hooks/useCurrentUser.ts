import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useCurrentUser() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<import('@supabase/supabase-js').User | null>(null)

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const { data } = await supabase.auth.getUser()
      setUser(data.user ?? null)
      setLoading(false)
    }
    init()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      sub.subscription?.unsubscribe()
    }
  }, [])

  return { user, loading }
}