'use client'

import { useState } from 'react'

interface HeaderProps {
  activePage?: 'home' | 'motorcycles' | 'pawn-services'
}

export function Header({ activePage = 'home' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-stone-900 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Vương Cường 68" className="h-16 sm:h-20 w-auto" />
          </a>
          
          {/* Slogan - mobile only */}
          <div className="md:hidden text-center flex-1 px-2">
            <p className="text-amber-500 font-bold text-xs italic leading-tight">
              "Uy tín làm đầu,<br/>chất lượng làm gốc"
            </p>
          </div>
          
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className={activePage === 'home' ? 'text-amber-500 font-bold uppercase tracking-wide' : 'text-stone-300 hover:text-amber-500 font-semibold uppercase tracking-wide transition-colors'}>
              Trang chủ
            </a>
            <a href="/motorcycles" className={activePage === 'motorcycles' ? 'text-amber-500 font-bold uppercase tracking-wide' : 'text-stone-300 hover:text-amber-500 font-semibold uppercase tracking-wide transition-colors'}>
              Xe máy
            </a>
            <a href="/pawn-services" className={activePage === 'pawn-services' ? 'text-amber-500 font-bold uppercase tracking-wide' : 'text-stone-300 hover:text-amber-500 font-semibold uppercase tracking-wide transition-colors'}>
              Cầm đồ
            </a>
            <a href="/#contact" className="text-stone-300 hover:text-amber-500 font-semibold uppercase tracking-wide transition-colors">
              Liên hệ
            </a>
          </nav>
          
          <div className="hidden md:flex items-center gap-2">
            <a href="tel:0941231619" className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-2 px-3 rounded-lg transition-colors text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              0941 231 619
            </a>
            <a href="tel:0975965678" className="flex items-center gap-2 bg-stone-700 hover:bg-stone-600 text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              0975 965 678
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-700">
            <nav className="flex flex-col space-y-3">
              <a href="/" onClick={() => setMobileMenuOpen(false)} className={activePage === 'home' ? 'text-amber-500 font-bold py-2' : 'text-stone-300 hover:text-amber-500 font-semibold py-2'}>
                Trang chủ
              </a>
              <a href="/motorcycles" onClick={() => setMobileMenuOpen(false)} className={activePage === 'motorcycles' ? 'text-amber-500 font-bold py-2' : 'text-stone-300 hover:text-amber-500 font-semibold py-2'}>
                Xe máy
              </a>
              <a href="/pawn-services" onClick={() => setMobileMenuOpen(false)} className={activePage === 'pawn-services' ? 'text-amber-500 font-bold py-2' : 'text-stone-300 hover:text-amber-500 font-semibold py-2'}>
                Cầm đồ
              </a>
              <a href="/#contact" onClick={() => setMobileMenuOpen(false)} className="text-stone-300 hover:text-amber-500 font-semibold py-2">
                Liên hệ
              </a>
              <div className="flex gap-2 mt-2">
                <a href="tel:0941231619" className="flex-1 bg-amber-500 text-stone-900 font-bold py-3 px-4 rounded-lg text-center">
                  📞 0941 231 619
                </a>
                <a href="tel:0975965678" className="flex-1 bg-stone-700 text-white font-bold py-3 px-4 rounded-lg text-center">
                  📞 0975 965 678
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
