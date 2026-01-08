/**
 * Image processing utilities for base64 conversion and optimization
 */

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

/**
 * Convert a File to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix to get just the base64 string
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Resize and compress an image file
 */
export const resizeImage = (
  file: File,
  options: ImageProcessingOptions = {}
): Promise<File> => {
  const {
    maxWidth = 1200,
    maxHeight = 800,
    quality = 0.8,
    maxSizeKB = 500
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Check if the compressed image is still too large
            if (blob.size > maxSizeKB * 1024 && quality > 0.1) {
              // Recursively compress with lower quality
              const newFile = new File([blob], file.name, { type: file.type });
              resizeImage(newFile, { ...options, quality: quality - 0.1 })
                .then(resolve)
                .catch(reject);
            } else {
              const compressedFile = new File([blob], file.name, { type: file.type });
              resolve(compressedFile);
            }
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Validate image file type and size
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSizeMB = 10;

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Chỉ chấp nhận file ảnh định dạng JPEG, PNG, hoặc WebP'
    };
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      isValid: false,
      error: `Kích thước file không được vượt quá ${maxSizeMB}MB`
    };
  }

  return { isValid: true };
};

/**
 * Process multiple image files for upload
 */
export const processImageFiles = async (
  files: File[],
  options?: ImageProcessingOptions
): Promise<string[]> => {
  const maxImages = 10;
  
  if (files.length > maxImages) {
    throw new Error(`Chỉ được upload tối đa ${maxImages} ảnh`);
  }

  const processedImages: string[] = [];

  for (const file of files) {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    try {
      const resizedFile = await resizeImage(file, options);
      const base64 = await fileToBase64(resizedFile);
      processedImages.push(base64);
    } catch (error) {
      throw new Error(`Lỗi xử lý ảnh ${file.name}: ${error}`);
    }
  }

  return processedImages;
};

/**
 * Create data URI from base64 string
 */
export const base64ToDataUri = (base64: string, mimeType: string = 'image/jpeg'): string => {
  return `data:${mimeType};base64,${base64}`;
};