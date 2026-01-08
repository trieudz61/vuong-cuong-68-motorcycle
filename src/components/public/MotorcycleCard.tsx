'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Motorcycle } from '@/types'

interface MotorcycleCardProps {
  motorcycle: Motorcycle
}

export function MotorcycleCard({ motorcycle }: MotorcycleCardProps) {
  const [currentImg, setCurrentImg] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const images = motorcycle.images || []

  // Auto slide every 3s
  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentImg((prev) => (prev + 1) % images.length)
        setIsTransitioning(false)
      }, 300) // Fade duration
    }, 3000)

    return () => clearInterval(interval)
  }, [images.length])

  const formatPrice = (price: number) => {
    if (!price || price <= 0) return 'Liên hệ'
    return price.toLocaleString('vi-VN') + ' đ'
  }

  return (
    <Link href={`/motorcycles/${motorcycle.id}`}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-stone-100">
        {/* Image */}
        <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentImg]}
                alt={motorcycle.title}
                className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                } ${motorcycle.is_sold ? 'grayscale' : ''}`}
                loading="lazy"
              />
              {/* Watermark Logo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img 
                  src="/logo.png" 
                  alt=""
                  className={`w-16 h-16 object-contain opacity-25 ${motorcycle.is_sold ? 'grayscale' : ''}`}
                />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Sold overlay */}
          {motorcycle.is_sold && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg transform rotate-12">
                ĐÃ BÁN
              </div>
            </div>
          )}
          
          {/* Condition badge */}
          <div className={`absolute top-3 left-3 text-xs px-3 py-1.5 rounded-full font-bold shadow-lg ${
            motorcycle.condition === 'Mới' 
              ? 'bg-emerald-500 text-white' 
              : 'bg-amber-500 text-stone-900'
          }`}>
            {motorcycle.condition}
          </div>

          {/* ID badge */}
          {motorcycle.display_id && (
            <div className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-bold bg-stone-900/80 text-amber-500 shadow-lg">
              #{String(motorcycle.display_id).padStart(4, '0')}
            </div>
          )}

          {/* Image indicators */}
          {images.length > 1 && !motorcycle.is_sold && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentImg ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Image count */}
          {images.length > 1 && !motorcycle.is_sold && (
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {images.length}
            </div>
          )}
          
          {/* Quick view button */}
          {!motorcycle.is_sold && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="bg-white text-stone-900 font-bold px-4 py-2 rounded-lg shadow-lg text-sm">
                Xem chi tiết
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand & Year */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              {motorcycle.brand}
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs text-stone-500">{motorcycle.year}</span>
          </div>
          
          {/* Title */}
          <h3 className="font-bold text-stone-900 line-clamp-2 mb-3 group-hover:text-amber-600 transition-colors leading-snug">
            {motorcycle.title}
          </h3>

          {/* Specs */}
          <div className="flex items-center gap-3 text-xs text-stone-500 mb-4">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {motorcycle.engine_capacity}cc
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {motorcycle.mileage.toLocaleString('vi-VN')} km
            </span>
          </div>

          {/* Price & Location */}
          <div className="flex items-end justify-between pt-3 border-t border-stone-100">
            <div>
              <p className="text-xs text-stone-400 mb-0.5">Giá bán</p>
              <p className="text-xl font-black text-amber-600">
                {formatPrice(motorcycle.price)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-400 flex items-center gap-1 justify-end">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="truncate max-w-[100px]">{motorcycle.contact_address?.split(',')[0] || '06 Lý Thường Kiệt'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
