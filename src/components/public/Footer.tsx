export function Footer() {
  return (
    <footer className="bg-stone-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <img src="/logo.png" alt="Vương Cường 68" className="h-24 w-auto mb-4" />
            <p className="text-stone-400">
              Chuyên mua bán xe máy cũ uy tín, dịch vụ cầm đồ nhanh chóng tại 06 Lý Thường Kiệt - Phường Thành Vinh - Nghệ An
            </p>
            {/* Social Links */}
            <div className="flex gap-3 mt-4">
              <a href="https://www.facebook.com/bommobile.net" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-stone-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://zalo.me/0941231619" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-stone-800 hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors">
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
  )
}
