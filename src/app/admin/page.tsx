'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ totalMotorcycles: 0, totalPawnServices: 0 })

  useEffect(() => {
    checkAuth()
  }, [])

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
