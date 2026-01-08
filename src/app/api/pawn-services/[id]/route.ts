import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { UpdatePawnServiceRequest } from '@/types'

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

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/pawn-services/[id] - Lấy chi tiết dịch vụ cầm đồ (Admin only)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createSupabaseClient()
    const { id } = await params

    const { data, error } = await supabase
      .from('pawn_services')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Không tìm thấy dịch vụ cầm đồ' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/pawn-services/[id] - Cập nhật trạng thái dịch vụ cầm đồ (Admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createSupabaseClient()
    const { id } = await params

    const body: UpdatePawnServiceRequest = await request.json()

    // Kiểm tra dịch vụ tồn tại
    const { data: existing } = await supabase
      .from('pawn_services')
      .select('id')
      .eq('id', id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Không tìm thấy dịch vụ cầm đồ' }, { status: 404 })
    }

    // Validate status
    const validStatuses = ['đang cầm', 'đã chuộc', 'quá hạn']
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json({ 
        error: 'Trạng thái không hợp lệ. Chỉ chấp nhận: đang cầm, đã chuộc, quá hạn' 
      }, { status: 400 })
    }

    // Chuẩn bị dữ liệu update
    const updateData: Record<string, unknown> = {}
    if (body.status !== undefined) updateData.status = body.status
    if (body.notes !== undefined) updateData.notes = body.notes

    const { data, error } = await supabase
      .from('pawn_services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/pawn-services/[id] - Xóa dịch vụ cầm đồ (Admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createSupabaseClient()
    const { id } = await params

    const { error } = await supabase
      .from('pawn_services')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
