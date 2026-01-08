'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: '/admin/motorcycles', label: 'Xe máy', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { href: '/admin/pawn-services', label: 'Cầm đồ', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-stone-900">
      {/* Header */}
      <header className="bg-stone-950 border-b border-stone-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2 -ml-2 text-stone-400"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <a href="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
              </a>
              <div className="hidden sm:block">
                <h1 className="text-amber-500 font-bold">Admin Panel</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm text-stone-400">{user?.email}</span>
              <button onClick={handleSignOut} className="text-sm text-red-400 hover:text-red-300 font-medium">
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-stone-800 bg-stone-950">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive(item.href)
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'text-stone-400 hover:bg-stone-800'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </a>
              ))}
              <div className="border-t border-stone-800 pt-3 mt-3">
                <a href="/" className="flex items-center gap-3 px-3 py-2.5 text-sm text-stone-400 hover:text-amber-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Về trang chủ
                </a>
                <p className="px-3 py-2 text-xs text-stone-600">{user?.email}</p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Desktop Navigation */}
      <nav className="hidden sm:block bg-stone-950/50 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-12">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                  isActive(item.href)
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-stone-400 hover:text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.label}
              </a>
            ))}
            <a href="/" className="ml-auto flex items-center gap-2 px-4 text-sm text-stone-400 hover:text-white">
              ← Về trang chủ
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-6">{title}</h1>
        {children}
      </main>
    </div>
  )
}
