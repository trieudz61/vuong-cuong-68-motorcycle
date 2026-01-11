'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface VisitorStats {
  today: number
  yesterday: number
  this_week: number
  this_month: number
  total_views: number
  today_views: number
  new_customers: {
    today: number
    yesterday: number
    this_week: number
    this_month: number
    total: number
  }
  devices: Record<string, number>
  recent_visitors: Array<{
    visitor_id: string
    device_type: string
    browser: string
    os: string
    page_url: string
    created_at: string
  }>
  hourly_stats: number[]
}

export default function AdminDashboard() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ totalMotorcycles: 0, totalPawnServices: 0 })
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null)
  const [visitorLoading, setVisitorLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchVisitorStats()
  }, [])

  async function fetchVisitorStats() {
    try {
      const res = await fetch('/api/visitors')
      if (res.ok) {
        const data = await res.json()
        setVisitorStats(data)
      }
    } catch (error) {
      console.error('Error fetching visitor stats:', error)
    } finally {
      setVisitorLoading(false)
    }
  }

  async function checkAuth() {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) {
      setUser({ email: authUser.email || '' })
      const { count: motoCount } = await supabase.from('motorcycles').select('*', { count: 'exact', head: true })
      const { count: pawnCount } = await supabase.from('pawn_services').select('*', { count: 'exact', head: true })
      setStats({ totalMotorcycles: motoCount || 0, totalPawnServices: pawnCount || 0 })
    }
    setIsLoading(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-amber-500 text-lg">Đang tải...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-stone-300">Bạn chưa đăng nhập</p>
          <a href="/login" className="bg-amber-500 text-black font-bold px-6 py-2 rounded-lg">Đăng nhập</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-900">
      {/* Header */}
      <header className="bg-stone-950 border-b border-stone-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
            </a>
            <div className="hidden sm:block">
              <h1 className="text-amber-500 font-bold text-lg">Admin Panel</h1>
              <p className="text-stone-500 text-xs">Quản lý hệ thống</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-stone-400">{user.email}</span>
            <button onClick={handleSignOut} className="text-sm text-red-400 hover:text-red-300 font-medium">
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-stone-950/50 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          <a href="/admin" className="px-4 py-3 text-amber-500 border-b-2 border-amber-500 font-medium text-sm">
            Dashboard
          </a>
          <a href="/admin/motorcycles" className="px-4 py-3 text-stone-400 hover:text-white font-medium text-sm transition-colors">
            Xe máy
          </a>
          <a href="/admin/pawn-services" className="px-4 py-3 text-stone-400 hover:text-white font-medium text-sm transition-colors">
            Cầm đồ
          </a>
          <a href="/" className="px-4 py-3 text-stone-400 hover:text-white font-medium text-sm transition-colors ml-auto">
            ← Về trang chủ
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Tổng quan</h2>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-stone-800 rounded-xl p-6 border border-stone-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏍️</span>
              </div>
              <div>
                <p className="text-stone-400 text-sm">Tổng xe máy</p>
                <p className="text-3xl font-bold text-white">{stats.totalMotorcycles}</p>
              </div>
            </div>
          </div>
          <div className="bg-stone-800 rounded-xl p-6 border border-stone-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-stone-400 text-sm">Yêu cầu cầm đồ</p>
                <p className="text-3xl font-bold text-white">{stats.totalPawnServices}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visitor Statistics */}
        <h3 className="text-lg font-bold text-white mb-4">📊 Thống kê truy cập</h3>
        {visitorLoading ? (
          <div className="text-stone-400 mb-8">Đang tải thống kê...</div>
        ) : visitorStats ? (
          <>
            {/* New Customers by IP */}
            <h4 className="text-md font-semibold text-amber-400 mb-3">🆕 Khách hàng mới (theo IP)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl p-4 border border-amber-500/30">
                <p className="text-amber-300 text-xs mb-1">Hôm nay</p>
                <p className="text-2xl font-bold text-amber-400">{visitorStats.new_customers?.today || 0}</p>
                <p className="text-amber-500/60 text-xs">IP mới</p>
              </div>
              <div className="bg-stone-800 rounded-xl p-4 border border-stone-700">
                <p className="text-stone-400 text-xs mb-1">Hôm qua</p>
                <p className="text-2xl font-bold text-white">{visitorStats.new_customers?.yesterday || 0}</p>
                <p className="text-stone-500 text-xs">IP mới</p>
              </div>
              <div className="bg-stone-800 rounded-xl p-4 border border-stone-700">
                <p className="text-stone-400 text-xs mb-1">Tuần này</p>
                <p className="text-2xl font-bold text-blue-400">{visitorStats.new_customers?.this_week || 0}</p>
                <p className="text-stone-500 text-xs">IP mới</p>
              </div>
              <div className="bg-stone-800 rounded-xl p-4 border border-stone-700">
                <p className="text-stone-400 text-xs mb-1">Tháng này</p>
                <p className="text-2xl font-bold text-green-400">{visitorStats.new_customers?.this_month || 0}</p>
                <p className="text-stone-500 text-xs">IP mới</p>
              </div>
              <div className="bg-stone-800 rounded-xl p-4 border border-stone-700">
                <p className="text-stone-400 text-xs mb-1">Tổng cộng</p>
                <p className="text-2xl font-bold text-pink-400">{visitorStats.new_customers?.total || 0}</p>
                <p className="text-stone-500 text-xs">IP duy nhất</p>
              </div>
            </div>

            {/* Page Views */}
            <h4 className="text-md font-semibold text-blue-400 mb-3">👁️ Lượt xem trang</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <div className="bg-stone-800 rounded-xl p-4 border border-stone-700">
                <p className="text-stone-400 text-xs mb-1">Hôm nay</p>
                <p className="text-2xl font-bold text-amber-500">{visitorStats.today}</p>
                <p className="text-stone-500 text-xs">khách</p>
              </div>
              <div className="bg-stone-800 rounded-xl p-4 border border-stone-700">
                <p className="text-stone-400 text-xs mb-1">Hôm qua</p>
                <p className="text-2xl font-bold text-white">{visitorStats.yesterday}</p>
                <p className="text-stone-500 text-xs">khách</p>
              </div>
              <div className="bg-stone-800 rounded-xl p-4 border border-stone-700">
                <p className="text-stone-400 text-xs mb-1">Tuần này</p>
                <p className="text-2xl font-bold text-blue-400">{visitorStats.this_week}</p>
                <p className="text-stone-500 text-xs">khách</p>
              </div>
              <div className="bg-stone-800 rounded-xl p-4 border border-stone-700">
                <p className="text-stone-400 text-xs mb-1">Tháng này</p>
                <p className="text-2xl font-bold text-green-400">{visitorStats.this_month}</p>
                <p className="text-stone-500 text-xs">khách</p>
              </div>
              <div className="bg-stone-800 rounded-xl p-4 border border-stone-700">
                <p className="text-stone-400 text-xs mb-1">Lượt xem hôm nay</p>
                <p className="text-2xl font-bold text-purple-400">{visitorStats.today_views}</p>
                <p className="text-stone-500 text-xs">lượt</p>
              </div>
              <div className="bg-stone-800 rounded-xl p-4 border border-stone-700">
                <p className="text-stone-400 text-xs mb-1">Tổng lượt xem</p>
                <p className="text-2xl font-bold text-pink-400">{visitorStats.total_views}</p>
                <p className="text-stone-500 text-xs">lượt</p>
              </div>
            </div>

            {/* Device breakdown & Recent visitors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              {/* Device breakdown */}
              <div className="bg-stone-800 rounded-xl p-5 border border-stone-700">
                <h4 className="text-white font-semibold mb-4">📱 Thiết bị truy cập</h4>
                <div className="space-y-3">
                  {Object.entries(visitorStats.devices || {}).map(([device, count]) => {
                    const total = Object.values(visitorStats.devices || {}).reduce((a, b) => a + b, 0)
                    const percent = total > 0 ? Math.round((count / total) * 100) : 0
                    const icon = device === 'mobile' ? '📱' : device === 'tablet' ? '📲' : '💻'
                    const label = device === 'mobile' ? 'Di động' : device === 'tablet' ? 'Máy tính bảng' : 'Máy tính'
                    return (
                      <div key={device}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-stone-300">{icon} {label}</span>
                          <span className="text-stone-400">{count} ({percent}%)</span>
                        </div>
                        <div className="h-2 bg-stone-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                  {Object.keys(visitorStats.devices || {}).length === 0 && (
                    <p className="text-stone-500 text-sm">Chưa có dữ liệu</p>
                  )}
                </div>
              </div>

              {/* Recent visitors */}
              <div className="bg-stone-800 rounded-xl p-5 border border-stone-700">
                <h4 className="text-white font-semibold mb-4">👥 Truy cập gần đây</h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {(visitorStats.recent_visitors || []).slice(0, 10).map((visitor, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm py-2 border-b border-stone-700 last:border-0">
                      <div className="flex items-center gap-2">
                        <span>{visitor.device_type === 'mobile' ? '📱' : visitor.device_type === 'tablet' ? '📲' : '💻'}</span>
                        <span className="text-stone-300">{visitor.browser} / {visitor.os}</span>
                      </div>
                      <span className="text-stone-500 text-xs">
                        {new Date(visitor.created_at).toLocaleString('vi-VN', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit'
                        })}
                      </span>
                    </div>
                  ))}
                  {(visitorStats.recent_visitors || []).length === 0 && (
                    <p className="text-stone-500 text-sm">Chưa có dữ liệu</p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-stone-800 rounded-xl p-5 border border-amber-500/50 mb-8">
            <p className="text-amber-400 text-sm">
              ⚠️ Chưa có dữ liệu thống kê. Hãy chạy file <code className="bg-stone-700 px-2 py-1 rounded">supabase/visitors-table.sql</code> trong Supabase SQL Editor.
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <h3 className="text-lg font-bold text-white mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a href="/admin/motorcycles/new" className="bg-stone-800 hover:bg-stone-750 border border-stone-700 hover:border-amber-500/50 rounded-xl p-5 flex items-center gap-4 transition-all group">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-black text-2xl font-bold group-hover:scale-110 transition-transform">+</div>
            <div>
              <p className="font-bold text-white">Thêm xe máy mới</p>
              <p className="text-stone-500 text-sm">Đăng tin bán xe</p>
            </div>
          </a>
          <a href="/admin/motorcycles" className="bg-stone-800 hover:bg-stone-750 border border-stone-700 hover:border-amber-500/50 rounded-xl p-5 flex items-center gap-4 transition-all group">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📋</div>
            <div>
              <p className="font-bold text-white">Quản lý xe máy</p>
              <p className="text-stone-500 text-sm">Xem, sửa, xóa xe</p>
            </div>
          </a>
          <a href="/admin/pawn-services" className="bg-stone-800 hover:bg-stone-750 border border-stone-700 hover:border-amber-500/50 rounded-xl p-5 flex items-center gap-4 transition-all group">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">💰</div>
            <div>
              <p className="font-bold text-white">Quản lý cầm đồ</p>
              <p className="text-stone-500 text-sm">Xử lý yêu cầu</p>
            </div>
          </a>
        </div>
      </main>
    </div>
  )
}
