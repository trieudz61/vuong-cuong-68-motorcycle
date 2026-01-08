// Utility functions for formatting data

/**
 * Format display_id to show as #0001, #0002, etc.
 */
export function formatDisplayId(displayId: number | undefined | null): string {
  if (!displayId) return '';
  return `#${String(displayId).padStart(4, '0')}`;
}

/**
 * Format price in Vietnamese currency
 */
export function formatPrice(price: number): string {
  if (!price || price <= 0) return 'Liên hệ';
  return price.toLocaleString('vi-VN') + ' đ';
}

/**
 * Format date in Vietnamese format
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN');
}

/**
 * Format phone number with spaces
 */
export function formatPhone(phone: string): string {
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}

/**
 * Get display text for motorcycle ID (for customer reference)
 */
export function getMotorcycleIdText(displayId: number | undefined | null): string {
  if (!displayId) return '';
  return `Mã Xe: ${formatDisplayId(displayId)}`;
}