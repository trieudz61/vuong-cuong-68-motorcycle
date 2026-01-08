// Core data types for the motorcycle marketplace

export interface Motorcycle {
  id: string;
  display_id?: number; // Số thứ tự hiển thị (ID:0001)
  title: string;
  brand: string;
  model: string;
  year: number;
  condition: string;
  mileage: number;
  engine_capacity: number;
  fuel_type: string;
  color: string;
  price: number;
  description?: string;
  images: string[]; // Base64 encoded images
  contact_phone: string;
  contact_address: string;
  is_sold: boolean;
  created_at: string;
  updated_at: string;
}

export interface PawnService {
  id: string;
  customer_name: string;
  customer_phone: string;
  motorcycle_brand: string;
  motorcycle_model: string;
  pawn_value: number;
  pawn_date: string;
  redemption_date: string;
  status: 'đang cầm' | 'đã chuộc' | 'quá hạn';
  notes?: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

// Form types
export interface CreateMotorcycleRequest {
  title: string;
  brand: string;
  model: string;
  year: number;
  condition: string;
  mileage: number;
  engine_capacity: number;
  fuel_type: string;
  color: string;
  price: number;
  description?: string;
  images: string[];
  contact_phone: string;
  contact_address: string;
}

export interface UpdateMotorcycleRequest extends Partial<CreateMotorcycleRequest> {
  id: string;
  is_sold?: boolean;
}

export interface CreatePawnServiceRequest {
  customer_name: string;
  customer_phone: string;
  motorcycle_brand: string;
  motorcycle_model: string;
  pawn_value: number;
  pawn_date: string;
  redemption_date: string;
  notes?: string;
}

export interface UpdatePawnServiceRequest {
  id: string;
  status?: 'đang cầm' | 'đã chuộc' | 'quá hạn';
  notes?: string;
}

// API response types
export interface MotorcycleListResponse {
  motorcycles: Motorcycle[];
  totalCount: number;
  hasMore: boolean;
}

export interface PawnServiceListResponse {
  services: PawnService[];
  totalCount: number;
}

// Search and filter types
export interface MotorcycleFilters {
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  year?: number;
  search?: string;
  page?: number;
  limit?: number;
}

// Image processing types
export interface ImageUploadState {
  files: File[];
  previews: string[];
  base64Images: string[];
  isProcessing: boolean;
  errors: string[];
}

// Common brands for Vietnam motorcycle market
export const MOTORCYCLE_BRANDS = [
  'Honda',
  'Yamaha',
  'Suzuki',
  'Piaggio',
  'SYM',
  'Kawasaki',
  'Ducati',
  'BMW',
  'Harley-Davidson',
  'Khác'
] as const;

export const FUEL_TYPES = [
  'Xăng',
  'Điện',
  'Hybrid'
] as const;

export const MOTORCYCLE_CONDITIONS = [
  'Mới',
  'Cũ - Tốt',
  'Cũ - Khá',
  'Cũ - Trung bình',
  'Đã sửa chữa'
] as const;