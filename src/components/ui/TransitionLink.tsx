'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { LoadingScreen } from './PageTransition'

interface TransitionLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function TransitionLink({ href, children, className, onClick }: TransitionLinkProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [showLoading, setShowLoading] = useState(false)

  // Hide loading when pathname changes (navigation complete)
  useEffect(() => {
    setShowLoading(false)
  }, [pathname])

  // Auto-hide loading after max 2 seconds as fallback
  useEffect(() => {
    if (showLoading) {
      const timeout = setTimeout(() => {
        setShowLoading(false)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [showLoading])

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    // Don't show loading if clicking current page
    if (href === pathname) return
    
    // Call optional onClick handler
    if (onClick) onClick()
    
    // Show loading screen
    setShowLoading(true)
    
    // Navigate after animation delay
    setTimeout(() => {
      router.push(href)
    }, 1000)
  }, [href, onClick, router, pathname])

  return (
    <>
      {showLoading && <LoadingScreen />}
      <a href={href} onClick={handleClick} className={className}>
        {children}
      </a>
    </>
  )
}

export default TransitionLink
