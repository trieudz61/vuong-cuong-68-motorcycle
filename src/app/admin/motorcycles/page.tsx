'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { AdminLayout } from '@/components/admin/AdminLayout'
import type { Motorcycle } from '@/types'

type SortField = 'display_id' | 'title' | 'brand' | 'price' | 'is_sold' | 'created_at'
type SortOrder = 'asc' | 'desc'

export default function AdminMotorcyclesPage() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const limit = 20

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) {
      setUser({ email: authUser.email || '' })
    }
    setAuthLoading(false)
  }

  useEffect(() => {
    if (!authLoading && user) {
      fetchMotorcycles()
    }
  }, [authLoading, user, page, sortField, sortOrder])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const sortedMotorcycles = [...motorcycles].sort((a, b) => {
    let aVal: string | number | boolean = a[sortField] ?? ''
    let bVal: string | number | boolean = b[sortField] ?? ''
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase()
    if (typeof bVal === 'string') bVal = bVal.toLowerCase()
    
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="ml-1 inline-flex flex-col">
      <svg className={`w-3 h-3 ${sortField === field && sortOrder === 'asc' ? 'text-amber-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 14l5-5 5 5z"/>
      </svg>
      <svg className={`w-3 h-3 -mt-1 ${sortField === field && sortOrder === 'desc' ? 'text-amber-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 10l5 5 5-5z"/>
      </svg>
    </span>
  )

  const fetchMotorcycles = async () => {
    setIsLoading(true)
    try {
      const from = (page - 1) * limit
      const to = from + limit - 1

      // Sử dụng API thay vì direct Supabase client
      const response = await fetch(`/api/motorcycles?showAll=true&page=${page}&limit=${limit}`)
      
      if (!response.ok) {
        console.error('Error fetching motorcycles:', response.statusText)
        return
      }

      const result = await response.json()
      setMotorcycles(result.motorcycles || [])
      setTotalCount(result.totalCount || 0)
    } catch (error) {
      console.error('Error fetching motorcycles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa xe máy này?')) return
    
    try {
      const response = await fetch(`/api/motorcycles/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Delete error:', result)
        alert('Lỗi xóa: ' + (result.error || result.message || 'Không thể xóa xe máy'))
        return
      }

      // Xóa khỏi state
      setMotorcycles(prev => prev.filter(m => m.id !== id))
      setTotalCount(prev => prev - 1)
      
      alert('Đã xóa xe máy thành công!')
    } catch (error) {
      console.error('Error deleting motorcycle:', error)
      alert('Lỗi kết nối khi xóa: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const toggleSoldStatus = async (motorcycle: Motorcycle) => {
    try {
      const response = await fetch(`/api/motorcycles/${motorcycle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_sold: !motorcycle.is_sold }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert('Lỗi cập nhật: ' + error.message)
        return
      }

      // Cập nhật state
      setMotorcycles(prev => prev.map(m => 
        m.id === motorcycle.id ? { ...m, is_sold: !m.is_sold } : m
      ))
    } catch (error) {
      console.error('Error updating motorcycle:', error)
      alert('Lỗi kết nối khi cập nhật')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Bạn chưa đăng nhập</p>
          <a href="/login" className="btn-primary px-6 py-2">Đăng nhập</a>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout title="Quản lý xe máy">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <p className="text-sm sm:text-base text-gray-600">{totalCount} xe máy</p>
        <a href="/admin/motorcycles/new" className="btn-primary text-sm sm:text-base">
          + Thêm xe
        </a>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Đang tải...</div>
        ) : motorcycles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Chưa có xe máy nào</div>
        ) : (
          sortedMotorcycles.map((motorcycle) => (
            <div key={motorcycle.id} className="bg-white rounded-lg shadow p-3">
              <div className="flex gap-3">
                <div className="w-20 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {motorcycle.images?.[0] ? (
                    <img src={motorcycle.images[0]} alt={motorcycle.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {motorcycle.display_id && (
                      <span className="px-2 py-0.5 bg-stone-800 text-amber-500 text-xs font-bold rounded">
                        #{String(motorcycle.display_id).padStart(4, '0')}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">{motorcycle.brand} {motorcycle.model}</span>
                  </div>
                  <p className="font-medium text-gray-900 text-sm line-clamp-1">{motorcycle.title}</p>
                  <p className="text-sm font-semibold text-blue-600 mt-1">{formatPrice(motorcycle.price)}</p>
                </div>
                <button
                  onClick={() => toggleSoldStatus(motorcycle)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                    motorcycle.is_sold ? 'bg-gray-400' : 'bg-green-500'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      motorcycle.is_sold ? 'translate-x-1' : 'translate-x-6'
                    }`}
                  />
                </button>
              </div>
              <div className="flex justify-end gap-1 mt-2 pt-2 border-t">
                <a href={`/motorcycles/${motorcycle.id}`} target="_blank" className="p-2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </a>
                <a href={`/admin/motorcycles/${motorcycle.id}/edit`} className="p-2 text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </a>
                <button onClick={() => handleDelete(motorcycle.id)} className="p-2 text-red-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Hình</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('display_id')}>
                  <span className="flex items-center">Mã Xe<SortIcon field="display_id" /></span>
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('title')}>
                  <span className="flex items-center">Tiêu đề<SortIcon field="title" /></span>
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('brand')}>
                  <span className="flex items-center">Hãng/Model<SortIcon field="brand" /></span>
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('price')}>
                  <span className="flex items-center">Giá<SortIcon field="price" /></span>
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('is_sold')}>
                  <span className="flex items-center">Trạng thái<SortIcon field="is_sold" /></span>
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('created_at')}>
                  <span className="flex items-center">Ngày đăng<SortIcon field="created_at" /></span>
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              ) : motorcycles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Chưa có xe máy nào
                  </td>
                </tr>
              ) : (
                sortedMotorcycles.map((motorcycle) => (
                  <tr key={motorcycle.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden">
                        {motorcycle.images?.[0] ? (
                          <img
                            src={motorcycle.images[0]}
                            alt={motorcycle.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {motorcycle.display_id && (
                          <span className="px-2 py-1 bg-stone-800 text-amber-500 text-xs font-bold rounded">
                            #{String(motorcycle.display_id).padStart(4, '0')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 line-clamp-1">{motorcycle.title}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {motorcycle.brand} {motorcycle.model}
                    </td>
                    <td className="px-4 py-3 font-medium text-blue-600">
                      {formatPrice(motorcycle.price)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSoldStatus(motorcycle)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                            motorcycle.is_sold ? 'bg-gray-400' : 'bg-green-500'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              motorcycle.is_sold ? 'translate-x-1' : 'translate-x-6'
                            }`}
                          />
                        </button>
                        <span className={`text-xs font-medium ${
                          motorcycle.is_sold ? 'text-gray-600' : 'text-green-700'
                        }`}>
                          {motorcycle.is_sold ? 'Đã bán' : 'Đang bán'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(motorcycle.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <a
                          href={`/motorcycles/${motorcycle.id}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-blue-600"
                          title="Xem"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </a>
                        <a
                          href={`/admin/motorcycles/${motorcycle.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600"
                          title="Sửa"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </a>
                        <button
                          onClick={() => handleDelete(motorcycle.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                          title="Xóa"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalCount > limit && (
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Trang {page} / {Math.ceil(totalCount / limit)}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary text-sm disabled:opacity-50"
            >
              Trước
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(totalCount / limit)}
              className="btn-secondary text-sm disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
