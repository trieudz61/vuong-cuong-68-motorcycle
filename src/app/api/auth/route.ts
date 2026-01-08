import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function createSupabaseClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookieStore).getAll()
        },
        async setAll(cookiesToSet) {
          try {
            const store = await cookieStore
            cookiesToSet.forEach(({ name, value, options }) => {
              store.set(name, value, options)
            })
          } catch {
            // Ignore errors in Server Components
          }
        },
      },
    }
  )
}

// GET /api/auth - Lấy thông tin user hiện tại
export async function GET() {
  try {
    const supabase = createSupabaseClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json({ user: null })
    }

    // Lấy role từ bảng users
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: userData?.role || 'user',
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/auth - Đăng nhập
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email và mật khẩu không được để trống' }, { status: 400 })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    if (!data.user) {
      return NextResponse.json({ error: 'Đăng nhập thất bại' }, { status: 401 })
    }

    // Lấy role từ bảng users
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single()

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        role: userData?.role || 'user',
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/auth - Đăng xuất
export async function DELETE() {
  try {
    const supabase = createSupabaseClient()
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
