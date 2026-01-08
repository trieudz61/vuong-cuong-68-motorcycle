'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';

interface MotorcycleData {
  id: string;
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
}

function MotorcycleDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [motorcycle, setMotorcycle] = useState<MotorcycleData | null>(null);
  const [relatedBrand, setRelatedBrand] = useState<MotorcycleData[]>([]);
  const [relatedPrice, setRelatedPrice] = useState<MotorcycleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [modal, setModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/motorcycles/${id}`);
        if (!res.ok) { setError('Không tìm thấy xe máy'); return; }
        const data = await res.json();
        setMotorcycle(data);
        fetchRelated(data);
      } catch { setError('Lỗi tải dữ liệu'); }
      finally { setIsLoading(false); }
    }
    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    if (!motorcycle?.images?.length || motorcycle.images.length <= 1 || isPaused || modal) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setImgIdx((prev) => (prev + 1) % motorcycle.images.length);
        setIsTransitioning(false);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, [motorcycle?.images?.length, isPaused, modal]);

  async function fetchRelated(moto: MotorcycleData) {
    try {
      const res = await fetch('/api/motorcycles?limit=50');
      if (!res.ok) return;
      const data = await res.json();
      const all: MotorcycleData[] = data.motorcycles || data || [];
      const others = all.filter((m: MotorcycleData) => m.id !== moto.id);
      setRelatedBrand(others.filter((m: MotorcycleData) => m.brand === moto.brand).slice(0, 4));
      if (moto.price > 0) {
        const priceMin = moto.price * 0.7;
        const priceMax = moto.price * 1.3;
        setRelatedPrice(others.filter((m: MotorcycleData) => m.price >= priceMin && m.price <= priceMax && m.brand !== moto.brand).slice(0, 4));
      }
    } catch (err) { console.error('Error fetching related:', err); }
  }

  function formatPrice(p: number) {
    if (!p || p <= 0) return 'Liên hệ';
    return p.toLocaleString('vi-VN') + ' đ';
  }

  const goToSlide = useCallback((index: number) => {
    if (index === imgIdx) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setImgIdx(index);
      setIsTransitioning(false);
    }, 400);
  }, [imgIdx]);

  function goPrev() {
    if (!motorcycle?.images?.length) return;
    goToSlide(imgIdx === 0 ? motorcycle.images.length - 1 : imgIdx - 1);
  }

  function goNext() {
    if (!motorcycle?.images?.length) return;
    goToSlide((imgIdx + 1) % motorcycle.images.length);
  }

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50">
      <Header activePage="motorcycles" />
      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="h-72 lg:h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
          <div className="mt-4 lg:mt-0 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error || !motorcycle) return (
    <div className="min-h-screen bg-gray-50">
      <Header activePage="motorcycles" />
      <div className="flex flex-col items-center justify-center h-[60vh] px-4">
        <div className="text-6xl mb-4 opacity-30"></div>
        <p className="text-gray-500 text-lg mb-6">{error || 'Không tìm thấy xe'}</p>
        <button onClick={() => router.push('/motorcycles')} className="px-6 py-2.5 bg-amber-500 text-white font-bold rounded-full text-sm">Quay lại</button>
      </div>
      <Footer />
    </div>
  );

  const images = motorcycle.images || [];
  const isContactPrice = !motorcycle.price || motorcycle.price <= 0;

  const RelatedCard = ({ item }: { item: MotorcycleData }) => {
    const [relImgIdx, setRelImgIdx] = useState(0);
    const [relTransition, setRelTransition] = useState(false);
    const relImages = item.images || [];

    useEffect(() => {
      if (relImages.length <= 1) return;
      const interval = setInterval(() => {
        setRelTransition(true);
        setTimeout(() => {
          setRelImgIdx((prev) => (prev + 1) % relImages.length);
          setRelTransition(false);
        }, 300);
      }, 3000);
      return () => clearInterval(interval);
    }, [relImages.length]);

    return (
      <a href={`/motorcycles/${item.id}`} className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-100">
        <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
          {relImages.length > 0 ? (
            <img src={relImages[relImgIdx]} alt={item.title} className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${relTransition ? 'opacity-0' : 'opacity-100'}`} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl"></div>
          )}
          {relImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {relImages.slice(0, 5).map((_, idx) => (
                <div key={idx} className={`w-1 h-1 rounded-full ${idx === relImgIdx % 5 ? 'bg-amber-500' : 'bg-white/60'}`} />
              ))}
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-gray-900 font-medium text-sm line-clamp-1">{item.title}</p>
          <p className="text-gray-400 text-xs mt-0.5">{item.brand}  {item.year}</p>
          <p className="text-amber-600 font-bold mt-1">{formatPrice(item.price)}</p>
        </div>
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header activePage="motorcycles" />
      
      <div className="max-w-6xl mx-auto">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6 lg:p-6">
          
          {/* Left: Images */}
          <div className="lg:col-span-3" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            <div className="relative w-full aspect-[4/3] bg-gray-200 lg:rounded-2xl overflow-hidden shadow-lg">
              {images.length > 0 ? (
                <img 
                  src={images[imgIdx]} 
                  alt={motorcycle.title} 
                  className={`w-full h-full object-cover cursor-pointer transition-opacity duration-400 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} 
                  onClick={() => setModal(true)} 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-5xl"></div>
              )}
              
              {images.length > 1 && (
                <>
                  <button onClick={goPrev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full text-gray-700 flex items-center justify-center hover:bg-white transition-colors shadow">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button onClick={goNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full text-gray-700 flex items-center justify-center hover:bg-white transition-colors shadow">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/50 backdrop-blur rounded-full text-white text-xs">{imgIdx + 1}/{images.length}</div>
                  
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => goToSlide(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === imgIdx ? 'bg-amber-500 w-6' : 'bg-white/60 w-1.5 hover:bg-white'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto lg:p-0 lg:mt-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => goToSlide(i)} className={`w-16 h-12 lg:w-20 lg:h-14 flex-shrink-0 rounded-lg overflow-hidden transition-all shadow ${i === imgIdx ? 'ring-2 ring-amber-500' : 'opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-2 p-4 lg:p-0 space-y-4">
            <div className="flex gap-2 flex-wrap">
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${motorcycle.condition === 'Mới' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{motorcycle.condition}</span>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-600">{motorcycle.brand}</span>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-600">{motorcycle.year}</span>
            </div>
            
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">{motorcycle.title}</h1>
              <p className="text-gray-500 text-sm mt-1">{motorcycle.brand}  {motorcycle.model}</p>
            </div>
            
            {/* Price Card */}
            <div className={`rounded-xl p-4 ${isContactPrice ? 'bg-gray-100' : 'bg-amber-500'}`}>
              <span className={`text-xs font-medium block ${isContactPrice ? 'text-gray-500' : 'text-amber-900/70'}`}>GIÁ BÁN</span>
              <span className={`text-3xl font-black ${isContactPrice ? 'text-gray-700' : 'text-white'}`}>
                {formatPrice(motorcycle.price)}
              </span>
            </div>
            
            {/* Contact Buttons */}
            <div className="hidden lg:flex gap-3">
              <a href={`tel:${motorcycle.contact_phone || '0975965678'}`} className="flex-1 bg-amber-500 text-white font-bold py-3 rounded-xl text-center text-sm flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/30">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                {motorcycle.contact_phone || '0975965678'}
              </a>
              <a href={`https://zalo.me/${(motorcycle.contact_phone || '0975965678').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-xl text-center text-sm flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">
                <span className="font-bold">Z</span> Zalo
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                <div className="text-lg mb-0.5"></div>
                <div className="text-gray-900 font-bold text-sm">{motorcycle.year}</div>
                <div className="text-gray-400 text-[10px]">Năm SX</div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                <div className="text-lg mb-0.5"></div>
                <div className="text-gray-900 font-bold text-sm">{motorcycle.mileage?.toLocaleString()}</div>
                <div className="text-gray-400 text-[10px]">Km</div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                <div className="text-lg mb-0.5"></div>
                <div className="text-gray-900 font-bold text-sm">{motorcycle.engine_capacity}cc</div>
                <div className="text-gray-400 text-[10px]">Phân khối</div>
              </div>
            </div>

            {/* Specs */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50">
                <h2 className="text-gray-900 font-bold text-sm">Thông số</h2>
              </div>
              <div className="divide-y divide-gray-100 text-sm">
                <div className="flex justify-between px-4 py-2.5"><span className="text-gray-500">Hãng</span><span className="text-gray-900 font-medium">{motorcycle.brand}</span></div>
                <div className="flex justify-between px-4 py-2.5"><span className="text-gray-500">Dòng xe</span><span className="text-gray-900 font-medium">{motorcycle.model}</span></div>
                <div className="flex justify-between px-4 py-2.5"><span className="text-gray-500">Màu</span><span className="text-gray-900 font-medium">{motorcycle.color}</span></div>
                <div className="flex justify-between px-4 py-2.5"><span className="text-gray-500">Tình trạng</span><span className={motorcycle.condition === 'Mới' ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>{motorcycle.condition}</span></div>
              </div>
            </div>

            {/* Description */}
            {motorcycle.description && (
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-gray-900 font-bold text-sm">Mô tả</h2>
                </div>
                <div className="px-4 py-3">
                  <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">{motorcycle.description}</p>
                </div>
              </div>
            )}

            {/* Location */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-600 text-sm"></span>
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold text-sm mb-1">Địa chỉ xem xe</h3>
                  <p className="text-gray-500 text-sm">{motorcycle.contact_address}</p>
                </div>
              </div>
            </div>

            <button onClick={() => router.push('/motorcycles')} className="text-gray-500 hover:text-amber-600 transition-colors text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Xem xe khác
            </button>
          </div>
        </div>

        {/* Related Products */}
        <div className="px-4 lg:px-6 pb-8 space-y-8">
          {relatedBrand.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-900 font-bold text-lg flex items-center gap-2">
                  <span className="text-amber-500"></span> Xe {motorcycle.brand} khác
                </h2>
                <a href={`/motorcycles?brand=${motorcycle.brand}`} className="text-amber-600 text-sm hover:underline">Xem tất cả </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedBrand.map((item) => <RelatedCard key={item.id} item={item} />)}
              </div>
            </div>
          )}

          {relatedPrice.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-900 font-bold text-lg flex items-center gap-2">
                  <span className="text-amber-500"></span> Xe cùng tầm giá
                </h2>
                <a href="/motorcycles" className="text-amber-600 text-sm hover:underline">Xem tất cả </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedPrice.map((item) => <RelatedCard key={item.id} item={item} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 p-3 flex gap-3 lg:hidden z-40 shadow-lg">
        <a href={`tel:${motorcycle.contact_phone || '0975965678'}`} className="flex-1 bg-amber-500 text-white font-bold py-3.5 rounded-xl text-center flex items-center justify-center gap-2 shadow-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          Gọi ngay
        </a>
        <a href={`https://zalo.me/${(motorcycle.contact_phone || '0975965678').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-500 text-white font-bold py-3.5 rounded-xl text-center flex items-center justify-center gap-2 shadow-lg">
          <span className="font-bold">Z</span> Zalo
        </a>
      </div>
      
      <div className="h-24 lg:h-8"></div>

      {/* Modal */}
      {modal && images.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setModal(false)}>
          <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full text-white flex items-center justify-center z-10 hover:bg-white/30" onClick={() => setModal(false)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img src={images[imgIdx]} alt={motorcycle.title} className={`max-w-full max-h-full object-contain transition-opacity duration-400 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} onClick={(e) => e.stopPropagation()} />
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full text-white flex items-center justify-center hover:bg-white/30">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full text-white flex items-center justify-center hover:bg-white/30">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/20 rounded-full text-white text-sm">{imgIdx + 1}/{images.length}</div>
            </>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}

export default MotorcycleDetailPage;