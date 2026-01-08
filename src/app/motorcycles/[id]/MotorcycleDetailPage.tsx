'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';

interface MotorcycleData {
  id: string;
  display_id?: number;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: string;
  engine_capacity: number;
  color: string;
  description: string;
  images: string[];
  contact_phone: string;
  contact_address: string;
  is_sold: boolean;
}

const PHONE_PRIMARY = '0941231619';
const PHONE_SECONDARY = '0975965678zxczxczxczz';

interface Props {
  id: string;
}

function MotorcycleDetailPage({ id }: Props) {
  const router = useRouter();
  const [motorcycle, setMotorcycle] = useState<MotorcycleData | null>(null);
  const [relatedMotorcycles, setRelatedMotorcycles] = useState<MotorcycleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [modal, setModal] = useState(false);
  const [fadeClass, setFadeClass] = useState('opacity-100');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/motorcycles/${id}`);
        if (!res.ok) {
          setError('Không tìm thấy xe máy');
          return;
        }
        const data = await res.json();
        setMotorcycle(data);
        
        // Fetch related motorcycles
        const allRes = await fetch('/api/motorcycles?showAll=true');
        if (allRes.ok) {
          const allData = await allRes.json();
          const motorcycles = allData.motorcycles || allData || [];
          
          // Filter related: same brand or similar price (±30%)
          const related = motorcycles.filter((m: MotorcycleData) => {
            if (m.id === id) return false;
            const sameBrand = m.brand === data.brand;
            const priceDiff = data.price > 0 ? Math.abs(m.price - data.price) / data.price : 0;
            const similarPrice = data.price > 0 && m.price > 0 && priceDiff <= 0.3;
            return sameBrand || similarPrice;
          }).slice(0, 6);
          
          setRelatedMotorcycles(related);
        }
      } catch {
        setError('Lỗi tải dữ liệu');
      } finally {
        setIsLoading(false);
      }
    }
    if (id) {
      setImgIdx(0);
      fetchData();
    }
  }, [id]);

  // Auto-slide with fade effect
  const goToSlide = useCallback((newIdx: number) => {
    setFadeClass('opacity-0');
    setTimeout(() => {
      setImgIdx(newIdx);
      setFadeClass('opacity-100');
    }, 300);
  }, []);

  useEffect(() => {
    const images = motorcycle?.images || [];
    if (images.length <= 1 || modal || isHovered) return;
    
    const interval = setInterval(() => {
      const nextIdx = (imgIdx + 1) % images.length;
      goToSlide(nextIdx);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [motorcycle?.images, imgIdx, modal, isHovered, goToSlide]);

  function formatPrice(p: number) {
    if (!p || p === 0) return 'Liên hệ';
    return p.toLocaleString('vi-VN') + ' đ';
  }

  function goPrev() {
    if (motorcycle?.images?.length) {
      const newIdx = imgIdx === 0 ? motorcycle.images.length - 1 : imgIdx - 1;
      goToSlide(newIdx);
    }
  }

  function goNext() {
    if (motorcycle?.images?.length) {
      const newIdx = (imgIdx + 1) % motorcycle.images.length;
      goToSlide(newIdx);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header activePage="motorcycles" />
        <div className="max-w-6xl mx-auto p-4">
          <div className="h-64 md:h-96 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="mt-4 h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !motorcycle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header activePage="motorcycles" />
        <div className="p-8 text-center">
          <p className="text-gray-700 text-xl mb-4">{error || 'Không tìm thấy'}</p>
          <button onClick={() => router.push('/motorcycles')} className="bg-amber-500 text-stone-900 font-bold py-3 px-6 rounded-xl">Quay lại</button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = motorcycle.images || [];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header activePage="motorcycles" />
      
      <main className="max-w-6xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-6 p-6">
          {/* Left: Images */}
          <div 
            className="space-y-3"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative bg-white rounded-xl overflow-hidden shadow-lg aspect-[4/3]">
              {images.length > 0 ? (
                <>
                  <img 
                    src={images[imgIdx]} 
                    alt={motorcycle.title} 
                    className={`w-full h-full object-contain cursor-pointer transition-opacity duration-300 ${fadeClass} ${motorcycle.is_sold ? 'grayscale' : ''}`}
                    onClick={() => setModal(true)} 
                  />
                  {/* Watermark Logo */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <img 
                      src="/logo.png" 
                      alt=""
                      className={`w-24 h-24 object-contain opacity-25 ${motorcycle.is_sold ? 'grayscale' : ''}`}
                    />
                  </div>
                  {/* Sold overlay */}
                  {motorcycle.is_sold && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-xl shadow-lg transform rotate-12">
                        ĐÃ BÁN
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">Không có ảnh</div>
              )}
              {images.length > 1 && (
                <>
                  <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full text-white text-xl flex items-center justify-center transition-colors">‹</button>
                  <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full text-white text-xl flex items-center justify-center transition-colors">›</button>
                  <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">{imgIdx + 1}/{images.length}</span>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => goToSlide(i)} 
                    className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all relative ${i === imgIdx ? 'border-amber-500 shadow-md' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className={`w-full h-full object-cover ${motorcycle.is_sold ? 'grayscale' : ''}`} />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <img src="/logo.png" alt="" className={`w-6 h-6 object-contain opacity-25 ${motorcycle.is_sold ? 'grayscale' : ''}`} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${motorcycle.condition === 'Mới' ? 'bg-green-500 text-white' : 'bg-amber-500 text-stone-900'}`}>{motorcycle.condition}</span>
              <span className="px-3 py-1 rounded-full text-sm font-bold bg-gray-200 text-gray-700">{motorcycle.brand}</span>
              <span className="px-3 py-1 rounded-full text-sm font-bold bg-gray-200 text-gray-700">{motorcycle.year}</span>
              {motorcycle.display_id && (
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-stone-800 text-amber-500">ID:{String(motorcycle.display_id).padStart(4, '0')}</span>
              )}
              {motorcycle.is_sold && (
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-600 text-white">ĐÃ BÁN</span>
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900">
              {motorcycle.title}
            </h1>
            
            {/* Mã Xe - hiển thị rõ ràng */}
            {motorcycle.display_id && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-amber-800 font-bold text-lg">
                  🏷️ Mã Xe: #{String(motorcycle.display_id).padStart(4, '0')}
                </p>
                <p className="text-amber-600 text-sm">Báo mã này khi liên hệ để được hỗ trợ nhanh chóng</p>
              </div>
            )}
            
            <div className="bg-gradient-to-r from-amber-500 to-amber-400 rounded-xl p-4 shadow-md">
              <p className="text-amber-900 text-sm font-medium">Giá bán</p>
              <p className="text-3xl font-black text-stone-900">{formatPrice(motorcycle.price)}</p>
            </div>

            {/* Specs */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-gray-900 font-bold mb-3 flex items-center gap-2">
                <span className="text-amber-500">⚡</span> Thông số kỹ thuật
              </h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500">Hãng: </span><span className="text-gray-900 font-medium">{motorcycle.brand}</span></div>
                <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500">Model: </span><span className="text-gray-900 font-medium">{motorcycle.model}</span></div>
                <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500">Năm SX: </span><span className="text-gray-900 font-medium">{motorcycle.year}</span></div>
                <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500">Số km: </span><span className="text-gray-900 font-medium">{motorcycle.mileage?.toLocaleString()}</span></div>
                <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500">Dung tích: </span><span className="text-gray-900 font-medium">{motorcycle.engine_capacity}cc</span></div>
                <div className="bg-gray-50 p-3 rounded-lg"><span className="text-gray-500">Màu sắc: </span><span className="text-gray-900 font-medium">{motorcycle.color}</span></div>
              </div>
            </div>

            {/* Contact Buttons */}
            {!motorcycle.is_sold && (
              <div className="grid grid-cols-2 gap-3">
                <a href={`tel:${PHONE_PRIMARY}`} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-center transition-colors flex items-center justify-center gap-2">
                  <span>📞</span> {PHONE_PRIMARY.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}
                </a>
                <a href={`tel:${PHONE_SECONDARY}`} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-center transition-colors flex items-center justify-center gap-2">
                  <span>📞</span> {PHONE_SECONDARY.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}
                </a>
                <a href={`https://zalo.me/${PHONE_PRIMARY}`} target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-center transition-colors">💬 Zalo 1</a>
                <a href={`https://zalo.me/${PHONE_SECONDARY}`} target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-center transition-colors">💬 Zalo 2</a>
              </div>
            )}

            {/* Sold message */}
            {motorcycle.is_sold && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <div className="text-red-600 font-bold text-lg mb-2">🚫 Xe này đã được bán</div>
                <p className="text-red-500 text-sm">Cảm ơn quý khách đã quan tâm. Vui lòng xem các xe khác.</p>
              </div>
            )}

            {/* Address */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-gray-900 font-bold mb-2 flex items-center gap-2">
                <span className="text-amber-500">📍</span> Địa chỉ xem xe
              </h2>
              <p className="text-gray-600">{motorcycle.contact_address}</p>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Image Gallery */}
          <div 
            className="bg-white"
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setTimeout(() => setIsHovered(false), 5000)}
          >
            <div className="relative aspect-square">
              {images.length > 0 ? (
                <>
                  <img 
                    src={images[imgIdx]} 
                    alt={motorcycle.title} 
                    className={`w-full h-full object-contain cursor-pointer transition-opacity duration-300 ${fadeClass} ${motorcycle.is_sold ? 'grayscale' : ''}`}
                    onClick={() => setModal(true)} 
                  />
                  {/* Watermark Logo */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <img 
                      src="/logo.png" 
                      alt=""
                      className={`w-20 h-20 object-contain opacity-25 ${motorcycle.is_sold ? 'grayscale' : ''}`}
                    />
                  </div>
                  {/* Sold overlay */}
                  {motorcycle.is_sold && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg transform rotate-12">
                        ĐÃ BÁN
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">Không có ảnh</div>
              )}
              {images.length > 1 && (
                <>
                  <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full text-white text-2xl flex items-center justify-center">‹</button>
                  <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full text-white text-2xl flex items-center justify-center">›</button>
                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">{imgIdx + 1}/{images.length}</span>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-1 p-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button key={i} onClick={() => goToSlide(i)} className={`w-14 h-14 flex-shrink-0 rounded overflow-hidden border-2 relative ${i === imgIdx ? 'border-amber-500' : 'border-transparent opacity-50'}`}>
                    <img src={img} alt="" className={`w-full h-full object-cover ${motorcycle.is_sold ? 'grayscale' : ''}`} />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <img src="/logo.png" alt="" className={`w-5 h-5 object-contain opacity-25 ${motorcycle.is_sold ? 'grayscale' : ''}`} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${motorcycle.condition === 'Mới' ? 'bg-green-500 text-white' : 'bg-amber-500 text-stone-900'}`}>{motorcycle.condition}</span>
              <span className="px-3 py-1 rounded-full text-sm font-bold bg-gray-200 text-gray-700">{motorcycle.brand}</span>
              {motorcycle.display_id && (
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-stone-800 text-amber-500">ID:{String(motorcycle.display_id).padStart(4, '0')}</span>
              )}
              {motorcycle.is_sold && (
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-600 text-white">ĐÃ BÁN</span>
              )}
            </div>
            
            <h1 className="text-xl font-bold text-gray-900">
              {motorcycle.title}
            </h1>
            
            {/* Mã Xe - hiển thị rõ ràng cho mobile */}
            {motorcycle.display_id && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-amber-800 font-bold">
                  🏷️ Mã Xe: #{String(motorcycle.display_id).padStart(4, '0')}
                </p>
                <p className="text-amber-600 text-xs">Báo mã này khi liên hệ</p>
              </div>
            )}
            
            <div className="bg-gradient-to-r from-amber-500 to-amber-400 rounded-xl p-4">
              <p className="text-amber-900 text-sm">Giá bán</p>
              <p className="text-3xl font-black text-stone-900">{formatPrice(motorcycle.price)}</p>
            </div>

            {/* Specs */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-gray-900 font-bold mb-3">⚡ Thông số</h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 p-2 rounded"><span className="text-gray-500">Hãng: </span><span className="text-gray-900">{motorcycle.brand}</span></div>
                <div className="bg-gray-50 p-2 rounded"><span className="text-gray-500">Model: </span><span className="text-gray-900">{motorcycle.model}</span></div>
                <div className="bg-gray-50 p-2 rounded"><span className="text-gray-500">Năm: </span><span className="text-gray-900">{motorcycle.year}</span></div>
                <div className="bg-gray-50 p-2 rounded"><span className="text-gray-500">Km: </span><span className="text-gray-900">{motorcycle.mileage?.toLocaleString()}</span></div>
                <div className="bg-gray-50 p-2 rounded"><span className="text-gray-500">CC: </span><span className="text-gray-900">{motorcycle.engine_capacity}</span></div>
                <div className="bg-gray-50 p-2 rounded"><span className="text-gray-500">Màu: </span><span className="text-gray-900">{motorcycle.color}</span></div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-gray-900 font-bold mb-2">📍 Địa chỉ</h2>
              <p className="text-gray-600 text-sm">{motorcycle.contact_address}</p>
            </div>

            {/* Description */}
            {motorcycle.description && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h2 className="text-gray-900 font-bold mb-2">📝 Mô tả</h2>
                <p className="text-gray-600 text-sm whitespace-pre-wrap">{motorcycle.description}</p>
              </div>
            )}

            <button onClick={() => router.push('/motorcycles')} className="text-amber-600 text-sm font-medium">← Xem xe khác</button>
          </div>
        </div>

        {/* Description for Desktop */}
        {motorcycle.description && (
          <div className="hidden md:block px-6 pb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-gray-900 font-bold mb-3 flex items-center gap-2">
                <span className="text-amber-500">📝</span> Mô tả chi tiết
              </h2>
              <p className="text-gray-600 whitespace-pre-wrap">{motorcycle.description}</p>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedMotorcycles.length > 0 && (
          <div className="px-4 md:px-6 pb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🔥 Xe máy liên quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {relatedMotorcycles.map((m) => (
                <Link 
                  key={m.id} 
                  href={`/motorcycles/${m.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[4/3] bg-gray-100 relative">
                    {m.images?.[0] ? (
                      <>
                        <img src={m.images[0]} alt={m.title} className={`w-full h-full object-cover ${m.is_sold ? 'grayscale' : ''}`} />
                        {/* Watermark Logo */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <img src="/logo.png" alt="" className={`w-12 h-12 object-contain opacity-25 ${m.is_sold ? 'grayscale' : ''}`} />
                        </div>
                        {/* Sold overlay */}
                        {m.is_sold && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                              ĐÃ BÁN
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-500 mb-1">{m.brand} • {m.year}</p>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2">{m.title}</h3>
                    <p className="text-amber-600 font-bold text-sm">{formatPrice(m.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back button for Desktop */}
        <div className="hidden md:block px-6 pb-6">
          <button onClick={() => router.push('/motorcycles')} className="text-amber-600 font-medium hover:text-amber-700">← Quay lại danh sách xe</button>
        </div>
      </main>

      {/* Fixed Bottom Bar - Mobile */}
      {!motorcycle.is_sold && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 grid grid-cols-4 gap-2 md:hidden z-40 shadow-lg">
          <a href={`tel:${PHONE_PRIMARY}`} className="bg-green-500 text-white font-bold py-3 rounded-xl text-center text-xs">📞 Gọi 1</a>
          <a href={`tel:${PHONE_SECONDARY}`} className="bg-green-500 text-white font-bold py-3 rounded-xl text-center text-xs">📞 Gọi 2</a>
          <a href={`https://zalo.me/${PHONE_PRIMARY}`} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white font-bold py-3 rounded-xl text-center text-xs">💬 Zalo</a>
          <a href="https://www.facebook.com/bommobile.net" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white font-bold py-3 rounded-xl text-center text-xs">FB</a>
        </div>
      )}
      <div className="h-20 md:h-0"></div>

      {/* Modal */}
      {modal && images.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={() => setModal(false)}>
          <button className="absolute top-4 right-4 text-white text-3xl z-10 hover:text-amber-500" onClick={() => setModal(false)}>×</button>
          <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
            <img src={images[imgIdx]} alt={motorcycle.title} className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${fadeClass} ${motorcycle.is_sold ? 'grayscale' : ''}`} />
            {/* Watermark Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <img src="/logo.png" alt="" className={`w-32 h-32 object-contain opacity-25 ${motorcycle.is_sold ? 'grayscale' : ''}`} />
            </div>
            {/* Sold overlay */}
            {motorcycle.is_sold && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-2xl shadow-lg transform rotate-12">
                  ĐÃ BÁN
                </div>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-amber-500">‹</button>
              <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-amber-500">›</button>
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded">{imgIdx + 1} / {images.length}</span>
            </>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}

export default MotorcycleDetailPage;