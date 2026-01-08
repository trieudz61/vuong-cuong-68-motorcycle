import { supabase } from '@/lib/supabase'

const UPLOAD_TIMEOUT = 30000 // 30 seconds timeout
const COMPRESS_TIMEOUT = 10000 // 10 seconds for compression

/**
 * Tạo promise với timeout
 */
function withTimeout<T>(promise: Promise<T>, ms: number, errorMessage: string): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), ms)
  })
  return Promise.race([promise, timeout])
}

/**
 * Nén ảnh trước khi upload với timeout
 */
async function compressImage(file: File, maxWidth = 1200, quality = 0.7): Promise<Blob> {
  const compressPromise = new Promise<Blob>((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl) // Clean up
      
      try {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Resize nếu quá lớn
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        // Giới hạn chiều cao
        const maxHeight = 1200
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height)
          height = maxHeight
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Cannot get canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Cannot compress image'))
            }
          },
          'image/jpeg',
          quality
        )
      } catch (e) {
        reject(e)
      }
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Cannot load image'))
    }
    
    img.src = objectUrl
  })

  return withTimeout(compressPromise, COMPRESS_TIMEOUT, 'Nén ảnh quá lâu, vui lòng thử ảnh nhỏ hơn')
}

/**
 * Upload ảnh lên Supabase Storage với retry và timeout
 */
export async function uploadImage(file: File, retries = 2): Promise<string> {
  // Nén ảnh nếu > 500KB
  let uploadFile: File | Blob = file
  if (file.size > 500 * 1024) {
    try {
      uploadFile = await compressImage(file)
      console.log(`Compressed ${file.name}: ${file.size} -> ${uploadFile.size}`)
    } catch (e) {
      console.warn('Compression failed, using original:', e)
      // Nếu file quá lớn và không nén được, báo lỗi
      if (file.size > 3 * 1024 * 1024) {
        throw new Error('Ảnh quá lớn, vui lòng chọn ảnh nhỏ hơn 3MB')
      }
    }
  }

  // Tạo tên file unique
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `motorcycles/${fileName}`

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const uploadPromise = supabase.storage
        .from('images')
        .upload(filePath, uploadFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg'
        })

      const { error: uploadError } = await withTimeout(
        uploadPromise,
        UPLOAD_TIMEOUT,
        'Upload quá lâu, vui lòng kiểm tra kết nối mạng'
      )

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      // Lấy public URL
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      lastError = error as Error
      console.warn(`Upload attempt ${attempt} failed:`, error)
      
      if (attempt < retries) {
        // Đợi trước khi retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
      }
    }
  }

  throw lastError || new Error('Upload thất bại')
}

/**
 * Upload nhiều ảnh song song (giới hạn 2 ảnh cùng lúc)
 */
export async function uploadImages(
  files: File[], 
  onProgress?: (current: number, total: number, fileName: string) => void
): Promise<{ urls: string[], failed: string[] }> {
  const urls: string[] = []
  const failed: string[] = []
  
  // Upload 2 ảnh cùng lúc để tăng tốc nhưng không quá tải
  const concurrency = 2
  
  for (let i = 0; i < files.length; i += concurrency) {
    const batch = files.slice(i, i + concurrency)
    
    const results = await Promise.allSettled(
      batch.map(async (file, batchIndex) => {
        const index = i + batchIndex
        onProgress?.(index + 1, files.length, file.name)
        return uploadImage(file)
      })
    )
    
    results.forEach((result, batchIndex) => {
      if (result.status === 'fulfilled') {
        urls.push(result.value)
      } else {
        failed.push(batch[batchIndex].name)
        console.error('Upload failed:', batch[batchIndex].name, result.reason)
      }
    })
  }
  
  return { urls, failed }
}

/**
 * Xóa ảnh từ Storage
 */
export async function deleteImage(url: string): Promise<void> {
  const match = url.match(/\/images\/(.+)$/)
  if (!match) return

  const filePath = match[1]
  
  try {
    await supabase.storage
      .from('images')
      .remove([filePath])
  } catch (e) {
    console.warn('Delete image failed:', e)
  }
}
