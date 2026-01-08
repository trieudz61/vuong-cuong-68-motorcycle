import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { UpdateMotorcycleRequest } from '@/types'

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

// GET /api/motorcycles/[id] - Lấy chi tiết xe máy
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createSupabaseClient()
    const { id } = await params

    const { data, error } = await supabase
      .from('motorcycles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Không tìm thấy xe máy' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/motorcycles/[id] - Cập nhật xe máy (Admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createSupabaseClient()
    const { id } = await params

    const body: UpdateMotorcycleRequest = await request.json()

    // Kiểm tra xe tồn tại
    const { data: existing } = await supabase
      .from('motorcycles')
      .select('id')
      .eq('id', id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Không tìm thấy xe máy' }, { status: 404 })
    }

    // Chuẩn bị dữ liệu update
    const updateData: Record<string, unknown> = {}
    
    if (body.title !== undefined) updateData.title = body.title
    if (body.brand !== undefined) updateData.brand = body.brand
    if (body.model !== undefined) updateData.model = body.model
    if (body.year !== undefined) updateData.year = body.year
    if (body.condition !== undefined) updateData.condition = body.condition
    if (body.mileage !== undefined) updateData.mileage = body.mileage
    if (body.engine_capacity !== undefined) updateData.engine_capacity = body.engine_capacity
    if (body.fuel_type !== undefined) updateData.fuel_type = body.fuel_type
    if (body.color !== undefined) updateData.color = body.color
    if (body.price !== undefined) updateData.price = body.price
    if (body.description !== undefined) updateData.description = body.description
    if (body.images !== undefined) updateData.images = body.images
    if (body.contact_phone !== undefined) updateData.contact_phone = body.contact_phone
    if (body.contact_address !== undefined) updateData.contact_address = body.contact_address
    if (body.is_sold !== undefined) updateData.is_sold = body.is_sold

    const { data, error } = await supabase
      .from('motorcycles')
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

// DELETE /api/motorcycles/[id] - Xóa xe máy (Admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createSupabaseClient()
    const { id } = await params

    const { error } = await supabase
      .from('motorcycles')
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
