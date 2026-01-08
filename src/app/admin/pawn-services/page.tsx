'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { AdminLayout } from '@/components/admin/AdminLayout'
import type { PawnService } from '@/types'

export default function AdminPawnServicesPage() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [services, setServices] = useState<PawnService[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
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
      fetchServices()
    }
  }, [authLoading, user, page, statusFilter])

  const fetchServices = async () => {
    setIsLoading(true)
    try {
      const from = (page - 1) * limit
      const to = from + limit - 1

      let query = supabase
        .from('pawn_services')
        .select('*', { count: 'exact' })

      if (statusFilter) {
        query = query.eq('status', statusFilter)
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) {
        console.error('Error fetching pawn services:', error)
        setServices([])
        setTotalCount(0)
        return
      }

      setServices(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching pawn services:', error)
      setServices([])
      setTotalCount(0)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('pawn_services')
        .update({ status })
        .eq('id', id)

      if (error) {
        alert('Lỗi cập nhật: ' + error.message)
        return
      }

      // Cập nhật state
      setServices(prev => prev.map(s => 
        s.id === id ? { ...s, status: status as 'đang cầm' | 'đã chuộc' | 'quá hạn' } : s
      ))
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa dịch vụ cầm đồ này?')) return
    
    try {
      const { error } = await supabase
        .from('pawn_services')
        .delete()
        .eq('id', id)

      if (error) {
        alert('Lỗi xóa: ' + error.message)
        return
      }

      // Xóa khỏi state
      setServices(prev => prev.filter(s => s.id !== id))
      setTotalCount(prev => prev - 1)
    } catch (error) {
      console.error('Error deleting pawn service:', error)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'đang cầm': return 'bg-yellow-100 text-yellow-700'
      case 'đã chuộc': return 'bg-green-100 text-green-700'
      case 'quá hạn': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
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
    <AdminLayout title="Quản lý cầm đồ">
      {/* Filters - Scrollable on mobile */}
      <div className="mb-4 sm:mb-6 -mx-3 px-3 sm:mx-0 sm:px-0 overflow-x-auto">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              statusFilter === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Tất cả ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter('đang cầm')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              statusFilter === 'đang cầm' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            Đang cầm
          </button>
          <button
            onClick={() => setStatusFilter('đã chuộc')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              statusFilter === 'đã chuộc' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'
            }`}
          >
            Đã chuộc
          </button>
          <button
            onClick={() => setStatusFilter('quá hạn')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              statusFilter === 'quá hạn' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'
            }`}
          >
            Quá hạn
          </button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Đang tải...</div>
        ) : services.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Chưa có dịch vụ cầm đồ nào</div>
        ) : (
          services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">{service.customer_name}</p>
                  <p className="text-sm text-gray-500">{service.customer_phone}</p>
                </div>
                <select
                  value={service.status}
                  onChange={(e) => updateStatus(service.id, e.target.value)}
                  className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(service.status)}`}
                >
                  <option value="đang cầm">Đang cầm</option>
                  <option value="đã chuộc">Đã chuộc</option>
                  <option value="quá hạn">Quá hạn</option>
                </select>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <p>Xe: {service.motorcycle_brand} {service.motorcycle_model}</p>
                <p className="font-semibold text-blue-600">{formatPrice(service.pawn_value)}</p>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
                <span>Cầm: {formatDate(service.pawn_date)}</span>
                <span>Chuộc: {formatDate(service.redemption_date)}</span>
                <button onClick={() => handleDelete(service.id)} className="p-1 text-red-600">
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
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Khách hàng</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Xe máy</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Giá trị cầm</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Ngày cầm</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Ngày chuộc</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Trạng thái</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Chưa có dịch vụ cầm đồ nào
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{service.customer_name}</p>
                      <p className="text-sm text-gray-500">{service.customer_phone}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {service.motorcycle_brand} {service.motorcycle_model}
                    </td>
                    <td className="px-4 py-3 font-medium text-blue-600">
                      {formatPrice(service.pawn_value)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(service.pawn_date)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(service.redemption_date)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={service.status}
                        onChange={(e) => updateStatus(service.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${getStatusColor(service.status)}`}
                      >
                        <option value="đang cầm">Đang cầm</option>
                        <option value="đã chuộc">Đã chuộc</option>
                        <option value="quá hạn">Quá hạn</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleDelete(service.id)}
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
