'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Kiểm tra nếu đã đăng nhập thì chuyển đến admin
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        window.location.href = '/admin'
      } else {
        setCheckingAuth(false)
      }
    }
    checkAuth()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu')
      setIsLoading(false)
      return
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        setIsLoading(false)
        return
      }

      if (data.user) {
        window.location.href = '/admin'
      }
    } catch {
      setError('Đã xảy ra lỗi khi đăng nhập')
      setIsLoading(false)
    }
  }

  // Hiển thị loading khi đang kiểm tra auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-amber-500">Đang kiểm tra...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <a href="/">
            <img src="/logo.png" alt="Logo" className="h-24 w-auto mx-auto mb-4" />
          </a>
          <h2 className="text-xl text-stone-400">Đăng nhập quản trị</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-stone-800 border border-stone-700 rounded-2xl p-6 sm:p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-stone-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-stone-300 mb-2">
                  Mật khẩu
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <a href="/" className="text-stone-500 hover:text-amber-500 text-sm transition-colors">
            ← Quay về trang chủ
          </a>
        </div>
      </div>
    </div>
  )
}
