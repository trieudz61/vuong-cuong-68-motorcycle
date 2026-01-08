/**
 * Validation utilities for form data and API inputs
 */

import { CreateMotorcycleRequest, CreatePawnServiceRequest } from '@/types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate motorcycle listing data
 */
export const validateMotorcycleData = (data: Partial<CreateMotorcycleRequest>): ValidationResult => {
  const errors: Record<string, string> = {};

  // Required fields validation
  if (!data.title?.trim()) {
    errors.title = 'Tiêu đề là bắt buộc';
  }

  if (!data.brand?.trim()) {
    errors.brand = 'Hãng xe là bắt buộc';
  }

  if (!data.model?.trim()) {
    errors.model = 'Dòng xe là bắt buộc';
  }

  if (!data.year || data.year < 1900 || data.year > new Date().getFullYear() + 1) {
    errors.year = 'Năm sản xuất không hợp lệ';
  }

  if (!data.condition?.trim()) {
    errors.condition = 'Tình trạng xe là bắt buộc';
  }

  if (data.mileage === undefined || data.mileage < 0) {
    errors.mileage = 'Số km đã đi phải là số không âm';
  }

  if (!data.engine_capacity || data.engine_capacity <= 0) {
    errors.engine_capacity = 'Phân khối phải lớn hơn 0';
  }

  if (!data.fuel_type?.trim()) {
    errors.fuel_type = 'Loại nhiên liệu là bắt buộc';
  }

  if (!data.color?.trim()) {
    errors.color = 'Màu sắc là bắt buộc';
  }

  if (!data.price || data.price <= 0) {
    errors.price = 'Giá bán phải lớn hơn 0';
  }

  if (!data.contact_phone?.trim()) {
    errors.contact_phone = 'Số điện thoại liên hệ là bắt buộc';
  } else if (!/^[0-9+\-\s()]{10,15}$/.test(data.contact_phone.trim())) {
    errors.contact_phone = 'Số điện thoại không hợp lệ';
  }

  if (!data.contact_address?.trim()) {
    errors.contact_address = 'Địa chỉ liên hệ là bắt buộc';
  }

  // Images validation
  if (!data.images || data.images.length === 0) {
    errors.images = 'Cần ít nhất 1 ảnh';
  } else if (data.images.length > 10) {
    errors.images = 'Tối đa 10 ảnh';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate pawn service data
 */
export const validatePawnServiceData = (data: Partial<CreatePawnServiceRequest>): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.customer_name?.trim()) {
    errors.customer_name = 'Tên khách hàng là bắt buộc';
  }

  if (!data.customer_phone?.trim()) {
    errors.customer_phone = 'Số điện thoại là bắt buộc';
  } else if (!/^[0-9+\-\s()]{10,15}$/.test(data.customer_phone.trim())) {
    errors.customer_phone = 'Số điện thoại không hợp lệ';
  }

  if (!data.motorcycle_brand?.trim()) {
    errors.motorcycle_brand = 'Hãng xe là bắt buộc';
  }

  if (!data.motorcycle_model?.trim()) {
    errors.motorcycle_model = 'Dòng xe là bắt buộc';
  }

  if (!data.pawn_value || data.pawn_value <= 0) {
    errors.pawn_value = 'Giá trị cầm đồ phải lớn hơn 0';
  }

  if (!data.pawn_date) {
    errors.pawn_date = 'Ngày cầm là bắt buộc';
  }

  if (!data.redemption_date) {
    errors.redemption_date = 'Hạn chuộc là bắt buộc';
  }

  // Validate date logic
  if (data.pawn_date && data.redemption_date) {
    const pawnDate = new Date(data.pawn_date);
    const redemptionDate = new Date(data.redemption_date);
    
    if (redemptionDate <= pawnDate) {
      errors.redemption_date = 'Hạn chuộc phải sau ngày cầm';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Vietnamese phone number
 */
export const validateVietnamesePhone = (phone: string): boolean => {
  // Vietnamese phone number patterns
  const phoneRegex = /^(\+84|84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Sanitize string input
 */
export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Format price for display
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

/**
 * Format date for display
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};