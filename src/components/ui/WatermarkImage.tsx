'use client'

interface WatermarkImageProps {
  src: string
  alt: string
  className?: string
  watermarkOpacity?: number
  watermarkSize?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export function WatermarkImage({ 
  src, 
  alt, 
  className = '', 
  watermarkOpacity = 0.3,
  watermarkSize = 'md',
  onClick 
}: WatermarkImageProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  }

  return (
    <div className={`relative ${className}`} onClick={onClick}>
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {/* Watermark Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img 
          src="/logo.png" 
          alt="Watermark"
          className={`${sizeClasses[watermarkSize]} object-contain`}
          style={{ opacity: watermarkOpacity }}
        />
      </div>
    </div>
  )
}

export default WatermarkImage
