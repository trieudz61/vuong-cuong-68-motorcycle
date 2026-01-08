'use client'

import { useState, useRef, useCallback } from 'react'
import { uploadImages } from '@/utils/uploadImage'

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  disabled?: boolean
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function ImageUpload({ 
  images, 
  onChange, 
  maxImages = 10,
  disabled = false 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [currentFile, setCurrentFile] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef(false)

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    
    // Reset abort flag
    abortRef.current = false
    
    // Check max images
    const remainingSlots = maxImages - images.length
    if (remainingSlots <= 0) {
      setError(`Đã đạt tối đa ${maxImages} hình ảnh`)
      return
    }

    // Limit files to remaining slots
    const filesToUpload = fileArray.slice(0, remainingSlots)
    
    // Validate files
    const validFiles: File[] = []
    for (const file of filesToUpload) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`"${file.name}" không phải định dạng hỗ trợ (JPEG, PNG, WebP)`)
        continue
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`"${file.name}" quá lớn (tối đa 5MB)`)
        continue
      }
      validFiles.push(file)
    }

    if (validFiles.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      const { urls, failed } = await uploadImages(
        validFiles,
        (current, total, fileName) => {
          if (abortRef.current) return
          setUploadProgress(`${current}/${total}`)
          setCurrentFile(fileName)
        }
      )
      
      // Check if aborted
      if (abortRef.current) {
        setIsUploading(false)
        setUploadProgress('')
        setCurrentFile('')
        return
      }
      
      // Update images
      if (urls.length > 0) {
        onChange([...images, ...urls])
      }
      
      // Show error for failed files
      if (failed.length > 0) {
        if (failed.length === validFiles.length) {
          setError(`Không thể tải ảnh. Vui lòng kiểm tra kết nối mạng và thử lại.`)
        } else {
          setError(`Không thể tải: ${failed.join(', ')}`)
        }
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError('Lỗi tải ảnh. Vui lòng thử lại.')
    } finally {
      setIsUploading(false)
      setUploadProgress('')
      setCurrentFile('')
    }
  }, [images, maxImages, onChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled && !isUploading) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (disabled || isUploading) return
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const cancelUpload = () => {
    abortRef.current = true
    setIsUploading(false)
    setUploadProgress('')
    setCurrentFile('')
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return
    const newImages = [...images]
    const [removed] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, removed)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors
          ${isDragging ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled || isUploading ? 'opacity-50' : 'cursor-pointer'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled || isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-gray-700 font-medium mb-1">
              Đang tải ảnh {uploadProgress}
            </p>
            {currentFile && (
              <p className="text-gray-500 text-sm mb-3 truncate max-w-[200px]">
                {currentFile}
              </p>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                cancelUpload()
              }}
              className="text-red-500 hover:text-red-600 text-sm font-medium"
            >
              Hủy
            </button>
          </div>
        ) : (
          <>
            <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-700 mb-1 text-sm sm:text-base">
              Kéo thả hoặc click để chọn ảnh
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              JPEG, PNG, WebP • Tối đa 5MB/ảnh • Còn {maxImages - images.length} slot
            </p>
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-red-600 text-sm">{error}</p>
            <button 
              type="button"
              onClick={() => setError(null)}
              className="text-red-500 text-xs hover:underline mt-1"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Image count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {images.length}/{maxImages} hình ảnh
        </p>
        {images.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-red-500 text-sm hover:underline"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Image previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={image}
                  alt={`Hình ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f3f4f6" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12">Lỗi</text></svg>'
                  }}
                />
              </div>

              {/* Controls */}
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="w-6 h-6 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100"
                    title="Di chuyển sang trái"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    className="w-6 h-6 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100"
                    title="Di chuyển sang phải"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="w-6 h-6 bg-red-500 text-white rounded-full shadow flex items-center justify-center hover:bg-red-600"
                  title="Xóa ảnh"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* First image badge */}
              {index === 0 && (
                <div className="absolute top-1 left-1 bg-amber-500 text-stone-900 text-xs px-2 py-0.5 rounded font-medium">
                  Ảnh chính
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
