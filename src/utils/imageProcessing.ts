// Image processing utilities for base64 conversion and optimization

export const MAX_IMAGES = 10
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const TARGET_WIDTH = 1200 // Max width for optimization
export const JPEG_QUALITY = 0.8

export interface ImageProcessingResult {
  success: boolean
  base64?: string
  error?: string
}

export interface ImageValidationResult {
  valid: boolean
  errors: string[]
}

/**
 * Validate image file before processing
 */
export function validateImageFile(file: File): ImageValidationResult {
  const errors: string[] = []

  if (!ALLOWED_TYPES.includes(file.type)) {
    errors.push(`Định dạng không hỗ trợ: ${file.type}. Chỉ chấp nhận JPEG, PNG, WebP`)
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File quá lớn: ${(file.size / 1024 / 1024).toFixed(2)}MB. Tối đa 5MB`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Validate multiple image files
 */
export function validateImageFiles(files: File[]): ImageValidationResult {
  const errors: string[] = []

  if (files.length > MAX_IMAGES) {
    errors.push(`Tối đa ${MAX_IMAGES} hình ảnh`)
  }

  files.forEach((file, index) => {
    const result = validateImageFile(file)
    if (!result.valid) {
      errors.push(`Hình ${index + 1}: ${result.errors.join(', ')}`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Convert File to base64 string using FileReader API
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result)
    }
    reader.onerror = () => {
      reject(new Error('Không thể đọc file'))
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Compress and resize image using Canvas API
 */
export function compressImage(
  base64: string,
  maxWidth: number = TARGET_WIDTH,
  quality: number = JPEG_QUALITY
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      // Calculate new dimensions
      let width = img.width
      let height = img.height

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      // Create canvas and draw resized image
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Không thể tạo canvas context'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      // Convert to base64 with compression
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedBase64)
    }
    img.onerror = () => {
      reject(new Error('Không thể load hình ảnh'))
    }
    img.src = base64
  })
}

/**
 * Process single image: validate, convert to base64, and compress
 */
export async function processImage(file: File): Promise<ImageProcessingResult> {
  // Validate
  const validation = validateImageFile(file)
  if (!validation.valid) {
    return { success: false, error: validation.errors.join(', ') }
  }

  try {
    // Convert to base64
    const base64 = await fileToBase64(file)
    
    // Compress
    const compressed = await compressImage(base64)
    
    return { success: true, base64: compressed }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Lỗi xử lý hình ảnh' 
    }
  }
}

/**
 * Process multiple images
 */
export async function processImages(files: File[]): Promise<{
  success: boolean
  images: string[]
  errors: string[]
}> {
  const errors: string[] = []
  const images: string[] = []

  // Validate total count
  if (files.length > MAX_IMAGES) {
    return {
      success: false,
      images: [],
      errors: [`Tối đa ${MAX_IMAGES} hình ảnh`],
    }
  }

  // Process each file
  for (let i = 0; i < files.length; i++) {
    const result = await processImage(files[i])
    if (result.success && result.base64) {
      images.push(result.base64)
    } else {
      errors.push(`Hình ${i + 1}: ${result.error}`)
    }
  }

  return {
    success: errors.length === 0,
    images,
    errors,
  }
}

/**
 * Get image dimensions from base64 string
 */
export function getImageDimensions(base64: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = () => {
      reject(new Error('Không thể load hình ảnh'))
    }
    img.src = base64
  })
}

/**
 * Calculate base64 string size in bytes
 */
export function getBase64Size(base64: string): number {
  // Remove data URL prefix if present
  const base64Data = base64.split(',')[1] || base64
  // Calculate size: base64 is ~4/3 of original size
  return Math.ceil((base64Data.length * 3) / 4)
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
