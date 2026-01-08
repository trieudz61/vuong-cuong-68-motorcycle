import {
  validateImageFile,
  validateImageFiles,
  getBase64Size,
  formatFileSize,
  MAX_IMAGES,
  MAX_FILE_SIZE,
  ALLOWED_TYPES,
} from '@/utils/imageProcessing'

describe('Image Processing Utils', () => {
  describe('validateImageFile', () => {
    it('should accept valid JPEG file', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }) // 1MB
      
      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should accept valid PNG file', () => {
      const file = new File([''], 'test.png', { type: 'image/png' })
      Object.defineProperty(file, 'size', { value: 1024 * 1024 })
      
      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
    })

    it('should accept valid WebP file', () => {
      const file = new File([''], 'test.webp', { type: 'image/webp' })
      Object.defineProperty(file, 'size', { value: 1024 * 1024 })
      
      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
    })

    it('should reject unsupported file type', () => {
      const file = new File([''], 'test.gif', { type: 'image/gif' })
      Object.defineProperty(file, 'size', { value: 1024 * 1024 })
      
      const result = validateImageFile(file)
      expect(result.valid).toBe(false)
      expect(result.errors[0]).toContain('Định dạng không hỗ trợ')
    })

    it('should reject file exceeding max size', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: MAX_FILE_SIZE + 1 })
      
      const result = validateImageFile(file)
      expect(result.valid).toBe(false)
      expect(result.errors[0]).toContain('File quá lớn')
    })
  })

  describe('validateImageFiles', () => {
    it('should accept valid files within limit', () => {
      const files = Array(5).fill(null).map((_, i) => {
        const file = new File([''], `test${i}.jpg`, { type: 'image/jpeg' })
        Object.defineProperty(file, 'size', { value: 1024 * 1024 })
        return file
      })
      
      const result = validateImageFiles(files)
      expect(result.valid).toBe(true)
    })

    it('should reject when exceeding max images', () => {
      const files = Array(MAX_IMAGES + 1).fill(null).map((_, i) => {
        const file = new File([''], `test${i}.jpg`, { type: 'image/jpeg' })
        Object.defineProperty(file, 'size', { value: 1024 })
        return file
      })
      
      const result = validateImageFiles(files)
      expect(result.valid).toBe(false)
      expect(result.errors[0]).toContain(`Tối đa ${MAX_IMAGES}`)
    })
  })


  describe('getBase64Size', () => {
    it('should calculate correct size for base64 string', () => {
      // Base64 string with data URL prefix
      const base64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
      const size = getBase64Size(base64)
      expect(size).toBeGreaterThan(0)
    })

    it('should handle base64 without prefix', () => {
      const base64 = '/9j/4AAQSkZJRg=='
      const size = getBase64Size(base64)
      expect(size).toBeGreaterThan(0)
    })
  })

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(500)).toBe('500 B')
    })

    it('should format kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1.0 KB')
      expect(formatFileSize(2048)).toBe('2.0 KB')
    })

    it('should format megabytes correctly', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1.00 MB')
      expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.50 MB')
    })
  })

  describe('Constants', () => {
    it('should have correct MAX_IMAGES value', () => {
      expect(MAX_IMAGES).toBe(10)
    })

    it('should have correct MAX_FILE_SIZE value (5MB)', () => {
      expect(MAX_FILE_SIZE).toBe(5 * 1024 * 1024)
    })

    it('should have correct ALLOWED_TYPES', () => {
      expect(ALLOWED_TYPES).toContain('image/jpeg')
      expect(ALLOWED_TYPES).toContain('image/png')
      expect(ALLOWED_TYPES).toContain('image/webp')
    })
  })
})
