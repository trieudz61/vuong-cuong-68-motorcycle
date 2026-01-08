import Link from 'next/link'

export function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h5 className="text-lg font-semibold mb-4">Chợ Xe Máy Cũ</h5>
            <p className="text-gray-400">
              Nền tảng mua bán xe máy cũ uy tín hàng đầu Việt Nam
            </p>
          </div>
          <div>
            <h5 className="text-lg font-semibold mb-4">Dịch vụ</h5>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/motorcycles" className="hover:text-white transition-colors">Mua bán xe máy</Link></li>
              <li><Link href="/pawn-services" className="hover:text-white transition-colors">Cầm đồ xe máy</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-semibold mb-4">Hỗ trợ</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn sử dụng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a></li>
            </ul>
          </div>
          <ContactInfo />
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Chợ Xe Máy Cũ. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}


function ContactInfo() {
  return (
    <div>
      <h5 className="text-lg font-semibold mb-4">Liên hệ</h5>
      <div className="space-y-3 text-gray-400">
        <a href="tel:1900xxxx" className="flex items-center gap-2 hover:text-white transition-colors">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>1900-xxxx</span>
        </a>
        <a href="mailto:info@choxemaycu.com" className="flex items-center gap-2 hover:text-white transition-colors">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>info@choxemaycu.com</span>
        </a>
        <p className="flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Hà Nội, Việt Nam</span>
        </p>
      </div>
    </div>
  )
}
