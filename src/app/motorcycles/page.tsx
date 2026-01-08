'use client'

import { useState, useEffect } from 'react'
import { MotorcycleCard } from '@/components/public/MotorcycleCard'
import { Header } from '@/components/public/Header'
import { Footer } from '@/components/public/Footer'
import { MOTORCYCLE_BRANDS } from '@/types'
import type { Motorcycle, MotorcycleFilters } from '@/types'

const PRICE_RANGES = [
  { label: 'Tất cả', min: undefined, max: undefined },
  { label: 'Dưới 20 triệu', min: undefined, max: 20000000 },
  { label: '20 - 40 triệu', min: 20000000, max: 40000000 },
  { label: '40 - 60 triệu', min: 40000000, max: 60000000 },
  { label: '60 - 100 triệu', min: 60000000, max: 100000000 },
  { label: 'Trên 100 triệu', min: 100000000, max: undefined },
]

export default function MotorcyclesPage() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [filters, setFilters] = useState<MotorcycleFilters>({
    page: 1,
    limit: 12,
  })
  const [error, setError] = useState<string | null>(null)

  const fetchMotorcycles = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filters.brand) params.set('brand', filters.brand)
      if (filters.minPrice) params.set('minPrice', filters.minPrice.toString())
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString())
      if (filters.year) params.set('year', filters.year.toString())
      if (filters.search) params.set('search', filters.search)
      if (filters.page) params.set('page', filters.page.toString())
      if (filters.limit) params.set('limit', filters.limit.toString())
      params.set('showAll', 'true') // Show all motorcycles including sold ones

      const response = await fetch(`/api/motorcycles?${params.toString()}`)
      
      if (!response.ok) throw new Error('Failed to fetch')
      
      const data = await response.json()

      if (filters.page === 1) {
        setMotorcycles(data.motorcycles || [])
      } else {
        setMotorcycles(prev => [...prev, ...(data.motorcycles || [])])
      }
      setTotalCount(data.totalCount || 0)
      setHasMore(data.hasMore || false)
    } catch (err) {
      setError('Không thể tải danh sách xe máy')
      setMotorcycles([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMotorcycles()
  }, [filters])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters(prev => ({ ...prev, search: searchInput || undefined, page: 1 }))
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  const handleBrandFilter = (brand: string) => {
    setFilters(prev => ({ ...prev, brand: brand || undefined, page: 1 }))
  }

  const handlePriceFilter = (index: number) => {
    const range = PRICE_RANGES[index]
    setFilters(prev => ({ ...prev, minPrice: range.min, maxPrice: range.max, page: 1 }))
  }

  const clearFilters = () => {
    setSearchInput('')
    setFilters({ page: 1, limit: 12 })
  }

  const loadMore = () => {
    setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))
  }

  const hasActiveFilters = filters.brand || filters.minPrice || filters.maxPrice || filters.search

  return (
    <div className="min-h-screen bg-stone-50">
      <Header activePage="motorcycles" />

      {/* Hero Banner */}
      <section className="relative bg-stone-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src="/hero-bg.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/90 to-stone-900/70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              Xe Máy <span className="text-amber-500">Đang Bán</span>
            </h1>
            <p className="text-stone-300 text-lg mb-6">
              Khám phá bộ sưu tập xe máy chất lượng với giá tốt nhất tại 06 Lý Thường Kiệt - Phường Thành Vinh - Nghệ An
            </p>
            
            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tìm kiếm theo tên, hãng xe, model..."
                className="w-full py-4 px-6 pl-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
              />
              <svg className="w-6 h-6 text-stone-400 absolute left-5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-16 sm:top-20 z-30 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            {/* Brand Quick Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => handleBrandFilter('')}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  !filters.brand 
                    ? 'bg-amber-500 text-stone-900' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Tất cả
              </button>
              {MOTORCYCLE_BRANDS.slice(0, 8).map((brand) => (
                <button
                  key={brand}
                  onClick={() => handleBrandFilter(brand)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    filters.brand === brand 
                      ? 'bg-amber-500 text-stone-900' 
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {brand}
                </button>
              ))}
              
              {/* More brands dropdown */}
              <div className="relative group flex-shrink-0">
                <button className="px-4 py-2 rounded-full text-sm font-semibold bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center gap-1">
                  Khác
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-stone-200 py-2 min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {MOTORCYCLE_BRANDS.slice(8).map((brand) => (
                    <button
                      key={brand}
                      onClick={() => handleBrandFilter(brand)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-50 ${
                        filters.brand === brand ? 'text-amber-600 font-semibold' : 'text-stone-700'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Filters */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
              <span className="text-sm text-stone-500 font-medium flex-shrink-0">Giá:</span>
              {PRICE_RANGES.map((range, index) => (
                <button
                  key={index}
                  onClick={() => handlePriceFilter(index)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filters.minPrice === range.min && filters.maxPrice === range.max
                      ? 'bg-stone-900 text-white' 
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-stone-600">
              {isLoading ? (
                'Đang tải...'
              ) : (
                <>
                  Tìm thấy <span className="font-bold text-stone-900">{totalCount}</span> xe máy
                  {hasActiveFilters && (
                    <button 
                      onClick={clearFilters}
                      className="ml-3 text-amber-600 hover:text-amber-700 text-sm font-medium"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </>
              )}
            </p>
          </div>
          
          {/* Active Filters Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {filters.brand && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full font-medium">
                  {filters.brand}
                  <button onClick={() => handleBrandFilter('')} className="hover:text-amber-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <span className="inline-flex items-center gap-1 bg-stone-200 text-stone-700 text-sm px-3 py-1 rounded-full font-medium">
                  {PRICE_RANGES.find(r => r.min === filters.minPrice && r.max === filters.maxPrice)?.label}
                  <button onClick={() => handlePriceFilter(0)} className="hover:text-stone-900">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Grid */}
        {error ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">{error}</h3>
            <button 
              onClick={() => fetchMotorcycles()} 
              className="mt-4 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : isLoading && filters.page === 1 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-[4/3] bg-stone-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-6 bg-stone-200 rounded w-1/2" />
                  <div className="h-3 bg-stone-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : motorcycles.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">Không tìm thấy xe máy</h3>
            <p className="text-stone-500 mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            <button 
              onClick={clearFilters}
              className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {motorcycles.map((motorcycle) => (
                <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang tải...
                    </>
                  ) : (
                    <>
                      Xem thêm xe
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
