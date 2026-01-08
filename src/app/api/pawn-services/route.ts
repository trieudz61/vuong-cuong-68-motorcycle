import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { CreatePawnServiceRequest } from '@/types'

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

// GET /api/pawn-services - Lấy danh sách dịch vụ cầm đồ (Admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    
    // Kiểm tra authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', services: [], totalCount: 0 }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 20

    let query = supabase
      .from('pawn_services')
      .select('*', { count: 'exact' })

    if (status) {
      query = query.eq('status', status)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    query = query.order('created_at', { ascending: false }).range(from, to)

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message, services: [], totalCount: 0 }, { status: 500 })
    }

    return NextResponse.json({
      services: data || [],
      totalCount: count || 0,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', services: [], totalCount: 0 }, { status: 500 })
  }
}

// POST /api/pawn-services - Tạo yêu cầu cầm đồ mới (Public)
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    const body: CreatePawnServiceRequest = await request.json()

    // Validation
    const errors = validatePawnServiceData(body)
    if (errors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 })
    }

    // Kiểm tra ngày chuộc phải sau ngày cầm
    const pawnDate = new Date(body.pawn_date)
    const redemptionDate = new Date(body.redemption_date)
    if (redemptionDate <= pawnDate) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: ['Ngày chuộc phải sau ngày cầm'] 
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('pawn_services')
      .insert({
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        motorcycle_brand: body.motorcycle_brand,
        motorcycle_model: body.motorcycle_model,
        pawn_value: body.pawn_value,
        pawn_date: body.pawn_date,
        redemption_date: body.redemption_date,
        status: 'đang cầm',
        notes: body.notes || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function validatePawnServiceData(data: CreatePawnServiceRequest): string[] {
  const errors: string[] = []

  if (!data.customer_name || data.customer_name.trim().length === 0) {
    errors.push('Tên khách hàng không được để trống')
  }
  if (!data.customer_phone || data.customer_phone.trim().length === 0) {
    errors.push('Số điện thoại không được để trống')
  }
  if (!data.motorcycle_brand || data.motorcycle_brand.trim().length === 0) {
    errors.push('Hãng xe không được để trống')
  }
  if (!data.motorcycle_model || data.motorcycle_model.trim().length === 0) {
    errors.push('Model xe không được để trống')
  }
  if (!data.pawn_value || data.pawn_value <= 0) {
    errors.push('Giá trị cầm không hợp lệ')
  }
  if (!data.pawn_date) {
    errors.push('Ngày cầm không được để trống')
  }
  if (!data.redemption_date) {
    errors.push('Ngày chuộc không được để trống')
  }

  return errors
}
