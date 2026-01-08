import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Tạm thời cho phép tất cả - không kiểm tra auth
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
