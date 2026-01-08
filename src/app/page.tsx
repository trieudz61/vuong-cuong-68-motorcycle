'use client'

import { useState, useEffect, useCallback } from 'react'
import { Header } from '@/components/public/Header'
import { MotorcycleCard } from '@/components/public/MotorcycleCard'
import type { Motorcycle } from '@/types'

// Shop gallery images - thêm ảnh cửa hàng vào đây
const SHOP_IMAGES = [
  '/shop/shop-1.jpg',
  '/shop/shop-2.jpg',
  '/shop/shop-3.jpg',
  '/shop/shop-4.jpg',
  '/shop/shop-5.jpg',
]

export default function Home() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [shopImgIdx, setShopImgIdx] = useState(0)
  const [shopFade, setShopFade] = useState('opacity-100')
  const [isShopHovered, setIsShopHovered] = useState(false)

  // Auto-slide shop images with fade
  const autoSlide = useCallback(() => {
    setShopFade('opacity-0')
    setTimeout(() => {
      setShopImgIdx(prev => (prev + 1) % SHOP_IMAGES.length)
      setShopFade('opacity-100')
    }, 300)
  }, [])

  // Direct click - no fade, instant change
  const goToSlide = (idx: number) => {
    setShopImgIdx(idx)
  }

  useEffect(() => {
    if (SHOP_IMAGES.length <= 1 || isShopHovered) return
    const interval = setInterval(autoSlide, 4000)
    return () => clearInterval(interval)
  }, [isShopHovered, autoSlide])

  useEffect(() => {
    fetchMotorcycles()
  }, [])

  const fetchMotorcycles = async () => {
    try {
      const response = await fetch(`/api/motorcycles?limit=8&showAll=true`)
      if (response.ok) {
        const data = await response.json()
        setMotorcycles(data.motorcycles || [])
      }
    } catch (error) {
      console.error('Error fetching motorcycles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <Header activePage="home" />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/hero-bg.jpg" 
            alt="" 
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay gradients for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/80 to-stone-900/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-900/50"></div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              {/* Overlapping Typography */}
              <div className="relative mb-6">
                <span className="absolute -top-8 -left-4 text-[8rem] sm:text-[12rem] font-black text-amber-500/10 select-none leading-none hidden sm:block">
                  68
                </span>
                <div className="relative">
                  <p className="text-amber-500 font-bold text-sm sm:text-base uppercase tracking-[0.3em] mb-2">
                    Uy tín • Chất lượng • Nhanh chóng
                  </p>
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight drop-shadow-lg">
                    VƯƠNG<br/>
                    <span className="text-amber-500">CƯỜNG</span>
                    <span className="text-white ml-2 sm:ml-4">68</span>
                  </h1>
                </div>
              </div>
              
              <p className="text-xl sm:text-2xl text-stone-200 font-medium mb-4 uppercase tracking-wider drop-shadow-md">
                Xe Máy Cũ
              </p>
              
              {/* Glassmorphism Card */}
              <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-2xl p-6 mb-8 max-w-md mx-auto lg:mx-0 shadow-xl">
                <p className="text-stone-200 text-lg leading-relaxed">
                  Chuyên mua bán xe máy cũ uy tín tại 06 Lý Thường Kiệt - Phường Thành Vinh - Nghệ An. Dịch vụ cầm đồ xe máy nhanh chóng, lãi suất thấp.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="/motorcycles" className="group bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold py-4 px-8 rounded-xl transition-all duration-300 text-center uppercase tracking-wide shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-1">
                  Xem xe máy
                  <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
                </a>
                <a href="/pawn-services" className="backdrop-blur-sm bg-white/10 border border-white/20 text-white hover:bg-white/20 font-bold py-4 px-8 rounded-xl transition-all duration-300 text-center uppercase tracking-wide hover:-translate-y-1">
                  Dịch vụ cầm đồ
                </a>
              </div>
            </div>
            
            {/* Right - Logo with Glassmorphism */}
            <div className="relative order-1 lg:order-2 flex justify-center">
              {/* Glow Effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 sm:w-80 sm:h-80 bg-amber-500/20 rounded-full blur-3xl"></div>
              </div>
              
              {/* Glass Card with Logo */}
              <div className="relative backdrop-blur-xl bg-black/20 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
                <img 
                  src="/logo.png" 
                  alt="Vương Cường 68" 
                  className="h-48 sm:h-64 lg:h-80 w-auto relative z-10 drop-shadow-2xl"
                />
                
                {/* Decorative corners */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-500/50 rounded-tl-lg"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-500/50 rounded-tr-lg"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-500/50 rounded-bl-lg"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-500/50 rounded-br-lg"></div>
              </div>
            </div>
          </div>
          
          {/* Bottom Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0">
            <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl sm:text-3xl font-black text-amber-500">10+</p>
              <p className="text-stone-300 text-sm uppercase tracking-wide">Năm kinh nghiệm</p>
            </div>
            <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl sm:text-3xl font-black text-amber-500">500+</p>
              <p className="text-stone-300 text-sm uppercase tracking-wide">Xe đã bán</p>
            </div>
            <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl sm:text-3xl font-black text-amber-500">100%</p>
              <p className="text-stone-300 text-sm uppercase tracking-wide">Hài lòng</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 mb-4 uppercase tracking-tight">
              Tại sao chọn chúng tôi?
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
          </div>

          {/* Shop Gallery Album */}
          <div 
            className="relative mb-12 rounded-2xl overflow-hidden shadow-2xl group"
            onMouseEnter={() => setIsShopHovered(true)}
            onMouseLeave={() => setIsShopHovered(false)}
          >
            {/* Main Image - Fixed aspect ratio */}
            <div className="relative h-[250px] sm:h-[350px] md:h-[400px] lg:h-[450px] bg-stone-900 overflow-hidden">
              <img 
                src={SHOP_IMAGES[shopImgIdx]} 
                alt="Cửa hàng Vương Cường 68"
                className={`w-full h-full object-cover transition-opacity duration-300 ${shopFade}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/hero-bg.jpg'
                }}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-stone-900/20"></div>
              
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-amber-500 font-bold text-xs sm:text-sm uppercase tracking-wider mb-1">Hình ảnh cửa hàng</p>
                    <h3 className="text-white text-xl sm:text-2xl font-black uppercase">Vương Cường 68</h3>
                    <p className="text-stone-300 text-sm mt-1">06 Lý Thường Kiệt - Phường Thành Vinh - Nghệ An</p>
                  </div>
                  {/* Slide Counter */}
                  <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-amber-500 font-bold text-sm">{shopImgIdx + 1}</span>
                    <span className="text-stone-400 text-sm">/</span>
                    <span className="text-stone-400 text-sm">{SHOP_IMAGES.length}</span>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button 
                onClick={() => goToSlide(shopImgIdx === 0 ? SHOP_IMAGES.length - 1 : shopImgIdx - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-amber-500 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-stone-900 transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => goToSlide((shopImgIdx + 1) % SHOP_IMAGES.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-amber-500 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-stone-900 transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div className="bg-stone-900 p-2 sm:p-3">
              <div className="flex gap-2 justify-center">
                {SHOP_IMAGES.map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={`relative flex-shrink-0 w-16 h-12 sm:w-24 sm:h-16 md:w-28 md:h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                      i === shopImgIdx 
                        ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-stone-900' 
                        : 'opacity-40 hover:opacity-70'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Ảnh ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/hero-bg.jpg'
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-stone-50 border-2 border-stone-200 rounded-xl p-6 sm:p-8 text-center hover:border-amber-500 transition-colors">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2 uppercase">Uy tín đảm bảo</h3>
              <p className="text-stone-600">
                Tất cả xe máy được kiểm tra kỹ lưỡng, giấy tờ đầy đủ, rõ ràng
              </p>
            </div>
            
            <div className="bg-stone-50 border-2 border-stone-200 rounded-xl p-6 sm:p-8 text-center hover:border-amber-500 transition-colors">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2 uppercase">Giá cả hợp lý</h3>
              <p className="text-stone-600">
                Giá cả minh bạch, cạnh tranh nhất thị trường, không phát sinh
              </p>
            </div>
            
            <div className="bg-stone-50 border-2 border-stone-200 rounded-xl p-6 sm:p-8 text-center hover:border-amber-500 transition-colors">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2 uppercase">Dịch vụ nhanh</h3>
              <p className="text-stone-600">
                Cầm đồ xe máy nhanh chóng trong ngày, thủ tục đơn giản
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 mb-4 uppercase tracking-tight">
              Xe máy đang bán
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto mb-4"></div>
            <p className="text-stone-600 text-lg">Các xe máy chất lượng, giá tốt đang chờ bạn</p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
                  <div className="aspect-[4/3] bg-stone-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-stone-200 rounded w-3/4" />
                    <div className="h-6 bg-stone-200 rounded w-1/2" />
                    <div className="h-3 bg-stone-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : motorcycles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {motorcycles.map((motorcycle) => (
                  <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />
                ))}
              </div>
              <div className="text-center mt-10">
                <a 
                  href="/motorcycles" 
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-3 px-8 rounded-lg transition-all duration-200 uppercase tracking-wide shadow-lg hover:shadow-xl"
                >
                  Xem tất cả xe máy
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-stone-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-stone-500 text-lg">Chưa có xe máy nào đang bán</p>
              <p className="text-stone-400 mt-2">Hãy quay lại sau nhé!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-stone-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 uppercase">
            Bạn cần bán xe hoặc cầm đồ?
          </h2>
          <p className="text-stone-400 mb-8 text-lg">
            Liên hệ ngay với chúng tôi để được tư vấn và báo giá tốt nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:0941231619" className="inline-flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-4 px-8 rounded-lg transition-all duration-200 text-xl shadow-lg hover:shadow-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              0941 231 619
            </a>
            <a href="tel:0975965678" className="inline-flex items-center justify-center gap-3 bg-stone-700 hover:bg-stone-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 text-xl shadow-lg hover:shadow-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              0975 965 678
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-stone-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <img src="/logo.png" alt="Vương Cường 68" className="h-28 w-auto mb-4" />
              <p className="text-stone-400">
                Chuyên mua bán xe máy cũ uy tín, dịch vụ cầm đồ nhanh chóng tại 06 Lý Thường Kiệt - Phường Thành Vinh - Nghệ An
              </p>
              {/* Social Links */}
              <div className="flex gap-3 mt-4">
                <a href="https://www.facebook.com/bommobile.net" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-stone-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://zalo.me/0975965678" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-stone-800 hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors">
                  <span className="font-bold text-sm">Z</span>
                </a>
                <a href="https://www.facebook.com/groups/305902860342012" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-stone-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49-.09-.79-.17-2.01.04-2.87.19-.78 1.25-5.33 1.25-5.33s-.32-.64-.32-1.58c0-1.48.86-2.59 1.93-2.59.91 0 1.35.68 1.35 1.5 0 .91-.58 2.28-.88 3.55-.25 1.06.53 1.92 1.57 1.92 1.89 0 3.34-1.99 3.34-4.86 0-2.54-1.83-4.32-4.43-4.32-3.02 0-4.79 2.26-4.79 4.6 0 .91.35 1.89.79 2.42.09.11.1.2.07.31-.08.33-.26 1.06-.3 1.21-.05.19-.16.23-.37.14-1.4-.65-2.27-2.69-2.27-4.33 0-3.53 2.56-6.77 7.39-6.77 3.88 0 6.89 2.76 6.89 6.46 0 3.85-2.43 6.95-5.81 6.95-1.13 0-2.2-.59-2.57-1.29l-.7 2.66c-.25.98-.94 2.21-1.4 2.96 1.05.33 2.17.5 3.33.5 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h5 className="text-lg font-bold mb-4 text-amber-500 uppercase">Dịch vụ</h5>
              <ul className="space-y-2 text-stone-400">
                <li><a href="/motorcycles" className="hover:text-amber-500 transition-colors">Mua bán xe máy</a></li>
                <li><a href="/pawn-services" className="hover:text-amber-500 transition-colors">Cầm đồ xe máy</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Định giá xe</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-bold mb-4 text-amber-500 uppercase">Hỗ trợ</h5>
              <ul className="space-y-2 text-stone-400">
                <li><a href="#" className="hover:text-amber-500 transition-colors">Hướng dẫn mua xe</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Chính sách bảo hành</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Câu hỏi thường gặp</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-bold mb-4 text-amber-500 uppercase">Liên hệ</h5>
              <div className="space-y-2 text-stone-400">
                {/* Phone Numbers */}
                <a href="tel:0941231619" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  SĐT 1: 0941 231 619
                </a>
                <a href="tel:0975965678" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  SĐT 2: 0975 965 678
                </a>
                {/* Zalo */}
                <a href="https://zalo.me/0941231619" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                  <span className="w-4 h-4 bg-blue-500 rounded text-white text-[10px] font-bold flex items-center justify-center">Z</span>
                  Zalo 1: 0941 231 619
                </a>
                <a href="https://zalo.me/0975965678" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                  <span className="w-4 h-4 bg-blue-500 rounded text-white text-[10px] font-bold flex items-center justify-center">Z</span>
                  Zalo 2: 0975 965 678
                </a>
                {/* Facebook */}
                <a href="https://www.facebook.com/bommobile.net" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </a>
                <a href="https://www.facebook.com/groups/305902860342012" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49-.09-.79-.17-2.01.04-2.87.19-.78 1.25-5.33 1.25-5.33s-.32-.64-.32-1.58c0-1.48.86-2.59 1.93-2.59.91 0 1.35.68 1.35 1.5 0 .91-.58 2.28-.88 3.55-.25 1.06.53 1.92 1.57 1.92 1.89 0 3.34-1.99 3.34-4.86 0-2.54-1.83-4.32-4.43-4.32-3.02 0-4.79 2.26-4.79 4.6 0 .91.35 1.89.79 2.42.09.11.1.2.07.31-.08.33-.26 1.06-.3 1.21-.05.19-.16.23-.37.14-1.4-.65-2.27-2.69-2.27-4.33 0-3.53 2.56-6.77 7.39-6.77 3.88 0 6.89 2.76 6.89 6.46 0 3.85-2.43 6.95-5.81 6.95-1.13 0-2.2-.59-2.57-1.29l-.7 2.66c-.25.98-.94 2.21-1.4 2.96 1.05.33 2.17.5 3.33.5 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
                  Group Facebook
                </a>
                {/* Address */}
                <p className="flex items-start gap-2 pt-1">
                  <svg className="w-4 h-4 text-amber-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  06 Lý Thường Kiệt - Phường Thành Vinh - Nghệ An
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-stone-500">
            <p>&copy; 2026 Vương Cường 68 - Xe Máy Cũ. Tất cả quyền được bảo lưu.</p>
            <a href="/login" className="text-stone-600 hover:text-amber-500 text-sm transition-colors">
              Quản trị viên
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
