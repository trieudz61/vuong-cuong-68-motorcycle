'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { AuthUser } from '@/lib/auth'

interface UseAuthReturn {
  user: AuthUser | null
  isLoading: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        setUser(null)
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', authUser.id)
        .single()

      setUser({
        id: authUser.id,
        email: authUser.email!,
        role: userData?.role || 'user',
      })
    } catch (error) {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single()

          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: userData?.role || 'user',
          })
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        setIsLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchUser])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return {
    user,
    isLoading,
    isAdmin: user?.role === 'admin',
    signOut: handleSignOut,
    refreshUser: fetchUser,
  }
}
