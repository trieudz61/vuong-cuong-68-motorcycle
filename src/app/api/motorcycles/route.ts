import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { CreateMotorcycleRequest, MotorcycleFilters } from '@/types'

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

// GET /api/motorcycles - Lấy danh sách xe máy
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClient()
    const { searchParams } = new URL(request.url)
    
    const filters: MotorcycleFilters = {
      brand: searchParams.get('brand') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      year: searchParams.get('year') ? Number(searchParams.get('year')) : undefined,
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
    }

    const showAll = searchParams.get('showAll') === 'true'
    
    let query = supabase
      .from('motorcycles')
      .select('*', { count: 'exact' })

    // Chỉ hiển thị xe chưa bán cho public
    if (!showAll) {
      query = query.eq('is_sold', false)
    }

    // Apply filters
    if (filters.brand) {
      query = query.eq('brand', filters.brand)
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice)
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice)
    }
    if (filters.year) {
      query = query.eq('year', filters.year)
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,model.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    // Pagination
    const page = filters.page || 1
    const limit = filters.limit || 12
    const from = (page - 1) * limit
    const to = from + limit - 1

    query = query.order('created_at', { ascending: false }).range(from, to)

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      motorcycles: data || [],
      totalCount: count || 0,
      hasMore: (count || 0) > to + 1,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/motorcycles - Tạo xe máy mới (Admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          async getAll() {
            return []
          },
          async setAll() {
            // No-op for service role
          },
        },
      }
    )

    const body: CreateMotorcycleRequest = await request.json()

    // Validation
    const errors = validateMotorcycleData(body)
    if (errors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('motorcycles')
      .insert({
        title: body.title,
        brand: body.brand,
        model: body.model,
        year: body.year,
        condition: body.condition,
        mileage: body.mileage,
        engine_capacity: body.engine_capacity,
        fuel_type: body.fuel_type,
        color: body.color,
        price: body.price,
        description: body.description || null,
        images: body.images || [],
        contact_phone: body.contact_phone,
        contact_address: body.contact_address,
        is_sold: false,
        // Không set display_id, để database tự động tạo
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('API create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function validateMotorcycleData(data: CreateMotorcycleRequest): string[] {
  const errors: string[] = []

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Tiêu đề không được để trống')
  }
  if (!data.brand || data.brand.trim().length === 0) {
    errors.push('Hãng xe không được để trống')
  }
  if (!data.model || data.model.trim().length === 0) {
    errors.push('Model không được để trống')
  }
  if (!data.year || data.year < 1900 || data.year > new Date().getFullYear() + 1) {
    errors.push('Năm sản xuất không hợp lệ')
  }
  if (!data.condition) {
    errors.push('Tình trạng xe không được để trống')
  }
  if (data.mileage === undefined || data.mileage < 0) {
    errors.push('Số km đã đi không hợp lệ')
  }
  if (!data.engine_capacity || data.engine_capacity <= 0) {
    errors.push('Dung tích động cơ không hợp lệ')
  }
  if (!data.fuel_type) {
    errors.push('Loại nhiên liệu không được để trống')
  }
  if (!data.color) {
    errors.push('Màu sắc không được để trống')
  }
  // Price = 0 is allowed (means "Liên hệ")
  if (data.price === undefined || data.price === null || data.price < 0) {
    errors.push('Giá xe không hợp lệ')
  }
  if (!data.contact_phone || data.contact_phone.trim().length === 0) {
    errors.push('Số điện thoại liên hệ không được để trống')
  }
  if (!data.contact_address || data.contact_address.trim().length === 0) {
    errors.push('Địa chỉ không được để trống')
  }
  if (data.images && data.images.length > 10) {
    errors.push('Tối đa 10 hình ảnh')
  }

  return errors
}
