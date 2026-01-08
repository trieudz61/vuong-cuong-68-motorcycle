'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { MotorcycleForm } from '@/components/admin/MotorcycleForm'
import type { Motorcycle, CreateMotorcycleRequest } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditMotorcyclePage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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

  useEffect(() => {
    if (!authLoading && user) {
      fetchMotorcycle()
    }
  }, [authLoading, user, id])

  const fetchMotorcycle = async () => {
    try {
      const response = await fetch(`/api/motorcycles/${id}`)
      
      if (!response.ok) {
        setError('Không tìm thấy xe máy')
        return
      }

      const data = await response.json()
      setMotorcycle(data)
    } catch (err) {
      setError('Đã xảy ra lỗi khi tải dữ liệu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (data: CreateMotorcycleRequest) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/motorcycles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || result.message || 'Đã xảy ra lỗi khi cập nhật xe máy')
        return
      }

      router.push('/admin/motorcycles')
    } catch (err) {
      setError('Đã xảy ra lỗi khi cập nhật xe máy')
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

  if (isLoading) {
    return (
      <AdminLayout title="Chỉnh sửa xe máy">
        <div className="text-center py-8 text-gray-500">Đang tải...</div>
      </AdminLayout>
    )
  }

  if (error && !motorcycle) {
    return (
      <AdminLayout title="Chỉnh sửa xe máy">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <a href="/admin/motorcycles" className="btn-primary">
            Quay lại danh sách
          </a>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Chỉnh sửa xe máy">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}
      
      <div className="card p-6">
        <MotorcycleForm
          initialData={motorcycle || undefined}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </AdminLayout>
  )
}
