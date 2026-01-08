'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LoadingScreen } from '@/components/ui/PageTransition'

interface TransitionContextType {
  navigateTo: (href: string) => void
  isLoading: boolean
}

const TransitionContext = createContext<TransitionContextType>({
  navigateTo: () => {},
  isLoading: false
})

export function useTransition() {
  return useContext(TransitionContext)
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [targetHref, setTargetHref] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Navigate function
  const navigateTo = useCallback((href: string) => {
    // Don't navigate to same page
    if (href === pathname || href === pathname + '/') return
    
    // Skip loading for hash links
    if (href.startsWith('#') || href.includes('/#')) {
      window.location.href = href
      return
    }
    
    // Skip loading for external links
    if (href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) {
      window.location.href = href
      return
    }

    setIsLoading(true)
    setTargetHref(href)
  }, [pathname])

  // Perform navigation after delay
  useEffect(() => {
    if (isLoading && targetHref) {
      const timer = setTimeout(() => {
        router.push(targetHref)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isLoading, targetHref, router])

  // Hide loading when pathname changes
  useEffect(() => {
    setIsLoading(false)
    setTargetHref(null)
  }, [pathname])

  // Fallback: hide loading after 3 seconds max
  useEffect(() => {
    if (isLoading) {
      const fallback = setTimeout(() => {
        setIsLoading(false)
        setTargetHref(null)
      }, 3000)
      return () => clearTimeout(fallback)
    }
  }, [isLoading])

  // Intercept all link clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')
      
      if (!anchor) return
      
      const href = anchor.getAttribute('href')
      if (!href) return
      
      // Skip if modifier keys pressed
      if (e.ctrlKey || e.metaKey || e.shiftKey) return
      
      // Skip external links, hash links, tel, mailto
      if (
        href.startsWith('http') || 
        href.startsWith('tel:') || 
        href.startsWith('mailto:') ||
        href.startsWith('#') ||
        href.includes('/#')
      ) return
      
      // Skip if target="_blank"
      if (anchor.target === '_blank') return
      
      // Skip admin pages (no transition needed)
      if (href.startsWith('/admin') || href.startsWith('/login')) return
      
      // Skip same page
      if (href === pathname) return

      e.preventDefault()
      navigateTo(href)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [pathname, navigateTo])

  return (
    <TransitionContext.Provider value={{ navigateTo, isLoading }}>
      {isLoading && <LoadingScreen />}
      {children}
    </TransitionContext.Provider>
  )
}
