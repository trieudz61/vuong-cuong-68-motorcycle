'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { MotorcycleForm } from '@/components/admin/MotorcycleForm'
import type { CreateMotorcycleRequest } from '@/types'

export default function NewMotorcyclePage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleSubmit = async (data: CreateMotorcycleRequest) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/motorcycles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || result.message || 'Đã xảy ra lỗi khi tạo xe máy')
        return
      }

      router.push('/admin/motorcycles')
    } catch (err) {
      console.error('Error:', err)
      setError('Đã xảy ra lỗi khi tạo xe máy')
    } finally {
      setIsSubmitting(false)
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
    <AdminLayout title="Thêm xe máy mới">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}
      
      <div className="card p-6">
        <MotorcycleForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </AdminLayout>
  )
}
