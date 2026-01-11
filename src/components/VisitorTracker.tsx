'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function VisitorTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Track visitor on page load
    const trackVisitor = async () => {
      try {
        await fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page_url: window.location.href,
            referrer: document.referrer || null,
          }),
        })
      } catch (error) {
        // Silent fail - don't affect user experience
        console.debug('Visitor tracking failed:', error)
      }
    }

    trackVisitor()
  }, [pathname])

  return null // This component doesn't render anything
}