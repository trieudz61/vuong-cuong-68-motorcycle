'use client'

import { useState } from 'react'
import { Header } from '@/components/public/Header'
import { Footer } from '@/components/public/Footer'
import { MOTORCYCLE_BRANDS } from '@/types'

export default function PawnServicesPage() {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    motorcycle_brand: '',
    motorcycle_model: '',
    pawn_value: '',
    pawn_date: '',
    redemption_date: '',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.customer_name.trim()) newErrors.customer_name = 'Vui lòng nhập họ tên'
    if (!formData.customer_phone.trim()) newErrors.customer_phone = 'Vui lòng nhập số điện thoại'
    if (!formData.motorcycle_brand) newErrors.motorcycle_brand = 'Vui lòng chọn hãng xe'
    if (!formData.motorcycle_model.trim()) newErrors.motorcycle_model = 'Vui lòng nhập model xe'
    if (!formData.pawn_value || parseInt(formData.pawn_value) <= 0) newErrors.pawn_value = 'Vui lòng nhập giá trị cầm'
    if (!formData.pawn_date) newErrors.pawn_date = 'Vui lòng chọn ngày cầm'
    if (!formData.redemption_date) newErrors.redemption_date = 'Vui lòng chọn ngày chuộc'
    
    if (formData.pawn_date && formData.redemption_date) {
      if (new Date(formData.redemption_date) <= new Date(formData.pawn_date)) {
        newErrors.redemption_date = 'Ngày chuộc phải sau ngày cầm'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const response = await fetch('/api/pawn-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pawn_value: parseInt(formData.pawn_value.replace(/\D/g, '')),
        }),
      })

      if (response.ok) {
        setSubmitResult({ success: true, message: 'Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ với bạn sớm.' })
        setFormData({
          customer_name: '',
          customer_phone: '',
          motorcycle_brand: '',
          motorcycle_model: '',
          pawn_value: '',
          pawn_date: '',
          redemption_date: '',
          notes: '',
        })
      } else {
        const data = await response.json()
        setSubmitResult({ success: false, message: data.error || 'Đã xảy ra lỗi' })
      }
    } catch (error) {
      setSubmitResult({ success: false, message: 'Đã xảy ra lỗi khi gửi yêu cầu' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const formatPrice = (value: string) => {
    const num = parseInt(value.replace(/\D/g, ''))
    return isNaN(num) ? '' : num.toLocaleString('vi-VN')
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <Header activePage="pawn-services" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mb-4 uppercase">Dịch vụ cầm đồ xe máy</h1>
          <p className="text-lg text-stone-600">
            Cầm xe máy nhanh chóng, lãi suất thấp, thủ tục đơn giản
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="text-center p-4 bg-white rounded-xl border-2 border-stone-200">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-stone-900 mb-1">Giải ngân nhanh</h3>
            <p className="text-sm text-stone-600">Nhận tiền trong 30 phút</p>
          </div>
          <div className="text-center p-4 bg-white rounded-xl border-2 border-stone-200">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="font-bold text-stone-900 mb-1">Lãi suất thấp</h3>
            <p className="text-sm text-stone-600">Chỉ từ 1.5%/tháng</p>
          </div>
          <div className="text-center p-4 bg-white rounded-xl border-2 border-stone-200">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-bold text-stone-900 mb-1">An toàn</h3>
            <p className="text-sm text-stone-600">Bảo quản xe cẩn thận</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-stone-200">
          <h2 className="text-xl font-bold text-stone-900 mb-6 uppercase">Đăng ký cầm xe</h2>

          {submitResult && (
            <div className={`mb-6 p-4 rounded-lg ${
              submitResult.success 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {submitResult.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Họ và tên *</label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => handleChange('customer_name', e.target.value)}
                  className={`form-input ${errors.customer_name ? 'border-red-500' : ''}`}
                  placeholder="Nguyễn Văn A"
                />
                {errors.customer_name && <p className="form-error">{errors.customer_name}</p>}
              </div>

              <div>
                <label className="form-label">Số điện thoại *</label>
                <input
                  type="tel"
                  value={formData.customer_phone}
                  onChange={(e) => handleChange('customer_phone', e.target.value)}
                  className={`form-input ${errors.customer_phone ? 'border-red-500' : ''}`}
                  placeholder="0901234567"
                />
                {errors.customer_phone && <p className="form-error">{errors.customer_phone}</p>}
              </div>

              <div>
                <label className="form-label">Hãng xe *</label>
                <select
                  value={formData.motorcycle_brand}
                  onChange={(e) => handleChange('motorcycle_brand', e.target.value)}
                  className={`form-input ${errors.motorcycle_brand ? 'border-red-500' : ''}`}
                >
                  <option value="">Chọn hãng xe</option>
                  {MOTORCYCLE_BRANDS.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                {errors.motorcycle_brand && <p className="form-error">{errors.motorcycle_brand}</p>}
              </div>

              <div>
                <label className="form-label">Model xe *</label>
                <input
                  type="text"
                  value={formData.motorcycle_model}
                  onChange={(e) => handleChange('motorcycle_model', e.target.value)}
                  className={`form-input ${errors.motorcycle_model ? 'border-red-500' : ''}`}
                  placeholder="Vision, Exciter, SH..."
                />
                {errors.motorcycle_model && <p className="form-error">{errors.motorcycle_model}</p>}
              </div>

              <div>
                <label className="form-label">Giá trị muốn cầm (VNĐ) *</label>
                <input
                  type="text"
                  value={formatPrice(formData.pawn_value)}
                  onChange={(e) => handleChange('pawn_value', e.target.value)}
                  className={`form-input ${errors.pawn_value ? 'border-red-500' : ''}`}
                  placeholder="10,000,000"
                />
                {errors.pawn_value && <p className="form-error">{errors.pawn_value}</p>}
              </div>

              <div>
                <label className="form-label">Ngày cầm *</label>
                <input
                  type="date"
                  value={formData.pawn_date}
                  onChange={(e) => handleChange('pawn_date', e.target.value)}
                  className={`form-input ${errors.pawn_date ? 'border-red-500' : ''}`}
                />
                {errors.pawn_date && <p className="form-error">{errors.pawn_date}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="form-label">Ngày dự kiến chuộc *</label>
                <input
                  type="date"
                  value={formData.redemption_date}
                  onChange={(e) => handleChange('redemption_date', e.target.value)}
                  className={`form-input ${errors.redemption_date ? 'border-red-500' : ''}`}
                />
                {errors.redemption_date && <p className="form-error">{errors.redemption_date}</p>}
              </div>
            </div>

            <div>
              <label className="form-label">Ghi chú</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="form-input min-h-[100px]"
                placeholder="Thông tin thêm về xe hoặc yêu cầu đặc biệt..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-3 rounded-lg transition-colors disabled:opacity-50 uppercase tracking-wide"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </button>
          </form>
        </div>

        {/* Contact info */}
        <div className="mt-8 text-center text-stone-600">
          <p className="mb-2">Cần hỗ trợ? Gọi ngay:</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <a href="tel:0941231619" className="text-amber-600 font-bold hover:text-amber-700">📞 0941 231 619</a>
            <span className="hidden sm:inline text-stone-400">|</span>
            <a href="tel:0975965678" className="text-amber-600 font-bold hover:text-amber-700">📞 0975 965 678</a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
