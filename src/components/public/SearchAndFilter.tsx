'use client'

import { useState, useEffect } from 'react'
import { MOTORCYCLE_BRANDS } from '@/types'
import type { MotorcycleFilters } from '@/types'

interface SearchAndFilterProps {
  filters: MotorcycleFilters
  onChange: (filters: MotorcycleFilters) => void
}

const PRICE_RANGES = [
  { label: 'Tất cả', min: undefined, max: undefined },
  { label: 'Dưới 20 triệu', min: undefined, max: 20000000 },
  { label: '20 - 40 triệu', min: 20000000, max: 40000000 },
  { label: '40 - 60 triệu', min: 40000000, max: 60000000 },
  { label: '60 - 100 triệu', min: 60000000, max: 100000000 },
  { label: 'Trên 100 triệu', min: 100000000, max: undefined },
]

const YEARS = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i)

export function SearchAndFilter({ filters, onChange }: SearchAndFilterProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isFirstRender, setIsFirstRender] = useState(true)

  // Debounce search - only trigger after user input, not on initial render
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)
      return
    }
    
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onChange({ ...filters, search: searchInput || undefined })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  const handleBrandChange = (brand: string) => {
    onChange({ ...filters, brand: brand || undefined })
  }

  const handlePriceChange = (index: number) => {
    const range = PRICE_RANGES[index]
    onChange({ ...filters, minPrice: range.min, maxPrice: range.max })
  }

  const handleYearChange = (year: string) => {
    onChange({ ...filters, year: year ? Number(year) : undefined })
  }

  const clearFilters = () => {
    setSearchInput('')
    onChange({ page: 1, limit: filters.limit })
  }

  const hasActiveFilters = filters.brand || filters.minPrice || filters.maxPrice || filters.year || filters.search

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      {/* Search bar */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm kiếm xe máy..."
            className="form-input pl-10"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn-secondary flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Bộ lọc
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-blue-600 rounded-full" />
          )}
        </button>
      </div>

      {/* Expanded filters */}
      {isExpanded && (
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Brand filter */}
            <div>
              <label className="form-label">Hãng xe</label>
              <select
                value={filters.brand || ''}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="form-input"
              >
                <option value="">Tất cả hãng</option>
                {MOTORCYCLE_BRANDS.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Price filter */}
            <div>
              <label className="form-label">Khoảng giá</label>
              <select
                value={PRICE_RANGES.findIndex(
                  r => r.min === filters.minPrice && r.max === filters.maxPrice
                )}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="form-input"
              >
                {PRICE_RANGES.map((range, index) => (
                  <option key={index} value={index}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Year filter */}
            <div>
              <label className="form-label">Năm sản xuất</label>
              <select
                value={filters.year || ''}
                onChange={(e) => handleYearChange(e.target.value)}
                className="form-input"
              >
                <option value="">Tất cả năm</option>
                {YEARS.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active filters tags */}
      {hasActiveFilters && !isExpanded && (
        <div className="flex flex-wrap gap-2">
          {filters.brand && (
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {filters.brand}
              <button onClick={() => handleBrandChange('')} className="hover:text-blue-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {PRICE_RANGES.find(r => r.min === filters.minPrice && r.max === filters.maxPrice)?.label}
              <button onClick={() => handlePriceChange(0)} className="hover:text-blue-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {filters.year && (
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              Năm {filters.year}
              <button onClick={() => handleYearChange('')} className="hover:text-blue-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
