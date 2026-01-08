'use client'

import { useState } from 'react'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { MOTORCYCLE_BRANDS, FUEL_TYPES, MOTORCYCLE_CONDITIONS } from '@/types'
import type { Motorcycle, CreateMotorcycleRequest } from '@/types'

// Danh sách số điện thoại liên hệ
const CONTACT_PHONES = [
  { value: '0941231619', label: '0941 231 619 (SĐT 1)' },
  { value: '0975965678', label: '0975 965 678 (SĐT 2)' },
] as const

interface MotorcycleFormProps {
  initialData?: Motorcycle
  onSubmit: (data: CreateMotorcycleRequest) => Promise<void>
  isSubmitting: boolean
}

export function MotorcycleForm({ initialData, onSubmit, isSubmitting }: MotorcycleFormProps) {
  const [formData, setFormData] = useState<CreateMotorcycleRequest>({
    title: initialData?.title || '',
    brand: initialData?.brand || '',
    model: initialData?.model || '',
    year: initialData?.year || new Date().getFullYear(),
    condition: initialData?.condition || '',
    mileage: initialData?.mileage || 0,
    engine_capacity: initialData?.engine_capacity || 110,
    fuel_type: initialData?.fuel_type || 'Xăng',
    color: initialData?.color || '',
    price: initialData?.price || 0,
    description: initialData?.description || '',
    images: initialData?.images || [],
    contact_phone: initialData?.contact_phone || '0941231619',
    contact_address: initialData?.contact_address || '06 Lý Thường Kiệt - Phường Thành Vinh - Nghệ An',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = 'Vui lòng nhập tiêu đề'
    if (!formData.brand) newErrors.brand = 'Vui lòng chọn hãng xe'
    if (!formData.model.trim()) newErrors.model = 'Vui lòng nhập model'
    if (!formData.year || formData.year < 1900) newErrors.year = 'Năm không hợp lệ'
    if (!formData.condition) newErrors.condition = 'Vui lòng chọn tình trạng'
    if (formData.mileage < 0) newErrors.mileage = 'Số km không hợp lệ'
    if (!formData.engine_capacity || formData.engine_capacity <= 0) newErrors.engine_capacity = 'Dung tích không hợp lệ'
    if (!formData.color.trim()) newErrors.color = 'Vui lòng nhập màu sắc'
    if (!formData.price && formData.price !== 0) newErrors.price = 'Vui lòng nhập giá hoặc chọn Liên hệ'
    if (!formData.contact_phone.trim()) newErrors.contact_phone = 'Vui lòng nhập số điện thoại'
    if (!formData.contact_address.trim()) newErrors.contact_address = 'Vui lòng nhập địa chỉ'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    await onSubmit(formData)
  }

  const handleChange = (field: keyof CreateMotorcycleRequest, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const formatPrice = (value: number) => {
    return value.toLocaleString('vi-VN')
  }

  const parsePrice = (value: string) => {
    return parseInt(value.replace(/\D/g, '')) || 0
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-900 mb-1">Tiêu đề *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`form-input ${errors.title ? 'border-red-500' : ''}`}
            placeholder="VD: Honda Vision 2022 - Như mới"
          />
          {errors.title && <p className="form-error">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Hãng xe *</label>
          <select
            value={formData.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            className={`form-input ${errors.brand ? 'border-red-500' : ''}`}
          >
            <option value="">Chọn hãng xe</option>
            {MOTORCYCLE_BRANDS.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
          {errors.brand && <p className="form-error">{errors.brand}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Model *</label>
          <input
            type="text"
            value={formData.model}
            onChange={(e) => handleChange('model', e.target.value)}
            className={`form-input ${errors.model ? 'border-red-500' : ''}`}
            placeholder="VD: Vision, Exciter, SH..."
          />
          {errors.model && <p className="form-error">{errors.model}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Năm sản xuất *</label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => handleChange('year', parseInt(e.target.value))}
            className={`form-input ${errors.year ? 'border-red-500' : ''}`}
            min={1900}
            max={new Date().getFullYear() + 1}
          />
          {errors.year && <p className="form-error">{errors.year}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Tình trạng *</label>
          <select
            value={formData.condition}
            onChange={(e) => handleChange('condition', e.target.value)}
            className={`form-input ${errors.condition ? 'border-red-500' : ''}`}
          >
            <option value="">Chọn tình trạng</option>
            {MOTORCYCLE_CONDITIONS.map((condition) => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>
          {errors.condition && <p className="form-error">{errors.condition}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Số km đã đi *</label>
          <input
            type="number"
            value={formData.mileage}
            onChange={(e) => handleChange('mileage', parseInt(e.target.value) || 0)}
            className={`form-input ${errors.mileage ? 'border-red-500' : ''}`}
            min={0}
          />
          {errors.mileage && <p className="form-error">{errors.mileage}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Dung tích (cc) *</label>
          <input
            type="number"
            value={formData.engine_capacity}
            onChange={(e) => handleChange('engine_capacity', parseInt(e.target.value) || 0)}
            className={`form-input ${errors.engine_capacity ? 'border-red-500' : ''}`}
            min={1}
          />
          {errors.engine_capacity && <p className="form-error">{errors.engine_capacity}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Nhiên liệu *</label>
          <select
            value={formData.fuel_type}
            onChange={(e) => handleChange('fuel_type', e.target.value)}
            className="form-input"
          >
            {FUEL_TYPES.map((fuel) => (
              <option key={fuel} value={fuel}>{fuel}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Màu sắc *</label>
          <input
            type="text"
            value={formData.color}
            onChange={(e) => handleChange('color', e.target.value)}
            className={`form-input ${errors.color ? 'border-red-500' : ''}`}
            placeholder="VD: Đen, Trắng, Đỏ..."
          />
          {errors.color && <p className="form-error">{errors.color}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Giá bán (VNĐ) *</label>
          <div className="flex gap-2 items-center mb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.price === 0}
                onChange={(e) => handleChange('price', e.target.checked ? 0 : 1000000)}
                className="w-4 h-4 text-amber-500 rounded"
              />
              <span className="text-sm text-gray-600">Giá: Liên hệ</span>
            </label>
          </div>
          {formData.price > 0 && (
            <input
              type="text"
              value={formatPrice(formData.price)}
              onChange={(e) => handleChange('price', parsePrice(e.target.value))}
              className={`form-input ${errors.price ? 'border-red-500' : ''}`}
              placeholder="VD: 30,000,000"
            />
          )}
          {formData.price === 0 && (
            <div className="form-input bg-gray-100 text-gray-500">Liên hệ để biết giá</div>
          )}
          {errors.price && <p className="form-error">{errors.price}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-1">Mô tả chi tiết</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="form-input min-h-[120px]"
          placeholder="Mô tả chi tiết về xe máy..."
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-1">Hình ảnh</label>
        <ImageUpload
          images={formData.images}
          onChange={(images) => handleChange('images', images)}
        />
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Số điện thoại liên hệ *</label>
          <select
            value={formData.contact_phone}
            onChange={(e) => handleChange('contact_phone', e.target.value)}
            className={`form-input ${errors.contact_phone ? 'border-red-500' : ''}`}
          >
            {CONTACT_PHONES.map((phone) => (
              <option key={phone.value} value={phone.value}>
                {phone.label}
              </option>
            ))}
          </select>
          {errors.contact_phone && <p className="form-error">{errors.contact_phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Địa chỉ *</label>
          <input
            type="text"
            value={formData.contact_address}
            onChange={(e) => handleChange('contact_address', e.target.value)}
            className={`form-input ${errors.contact_address ? 'border-red-500' : ''}`}
            placeholder="VD: 06 Lý Thường Kiệt - Phường Thành Vinh - Nghệ An"
          />
          {errors.contact_address && <p className="form-error">{errors.contact_address}</p>}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary px-8 disabled:opacity-50"
        >
          {isSubmitting ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Tạo mới'}
        </button>
        <a href="/admin/motorcycles" className="btn-secondary px-8">
          Hủy
        </a>
      </div>
    </form>
  )
}
