import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import crypto from 'crypto'

function createSupabaseAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        async getAll() { return [] },
        async setAll() {},
      },
    }
  )
}

function parseUserAgent(ua: string) {
  const result = {
    device_type: 'desktop',
    browser: 'Unknown',
    os: 'Unknown'
  }

  // Device type
  if (/Mobile|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    result.device_type = /iPad|Tablet/i.test(ua) ? 'tablet' : 'mobile'
  }

  // Browser
  if (ua.includes('Firefox')) result.browser = 'Firefox'
  else if (ua.includes('SamsungBrowser')) result.browser = 'Samsung Browser'
  else if (ua.includes('Opera') || ua.includes('OPR')) result.browser = 'Opera'
  else if (ua.includes('Edge')) result.browser = 'Edge'
  else if (ua.includes('Chrome')) result.browser = 'Chrome'
  else if (ua.includes('Safari')) result.browser = 'Safari'
  else if (ua.includes('MSIE') || ua.includes('Trident')) result.browser = 'IE'

  // OS
  if (ua.includes('Windows')) result.os = 'Windows'
  else if (ua.includes('Mac OS')) result.os = 'macOS'
  else if (ua.includes('Linux')) result.os = 'Linux'
  else if (ua.includes('Android')) result.os = 'Android'
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) result.os = 'iOS'

  return result
}

// POST /api/visitors - Track visitor
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient()
    
    // Get IP address
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    // Get User Agent
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Create visitor ID (hash of IP + User Agent + Date)
    const today = new Date().toISOString().split('T')[0]
    const visitorId = crypto
      .createHash('sha256')
      .update(`${ip}-${userAgent}-${today}`)
      .digest('hex')
      .substring(0, 32)

    // Parse user agent
    const { device_type, browser, os } = parseUserAgent(userAgent)

    // Get body data
    const body = await request.json().catch(() => ({}))

    // Insert visitor record
    const { error } = await supabase
      .from('visitors')
      .insert({
        visitor_id: visitorId,
        ip_address: ip.substring(0, 45),
        user_agent: userAgent.substring(0, 500),
        device_type,
        browser,
        os,
        page_url: body.page_url || null,
        referrer: body.referrer || null,
      })

    if (error) {
      console.error('Error tracking visitor:', error)
    }

    return NextResponse.json({ success: true, visitor_id: visitorId })
  } catch (error) {
    console.error('Visitor tracking error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

// GET /api/visitors - Get visitor stats (admin only)
export async function GET() {
  try {
    const supabase = createSupabaseAdminClient()

    // Get stats using raw queries
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const weekStart = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // Today unique visitors
    const { count: todayUnique } = await supabase
      .from('visitors')
      .select('visitor_id', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())

    // Yesterday unique visitors  
    const { count: yesterdayUnique } = await supabase
      .from('visitors')
      .select('visitor_id', { count: 'exact', head: true })
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', today.toISOString())

    // This week unique visitors
    const { count: weekUnique } = await supabase
      .from('visitors')
      .select('visitor_id', { count: 'exact', head: true })
      .gte('created_at', weekStart.toISOString())

    // This month unique visitors
    const { count: monthUnique } = await supabase
      .from('visitors')
      .select('visitor_id', { count: 'exact', head: true })
      .gte('created_at', monthStart.toISOString())

    // Total views
    const { count: totalViews } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true })

    // New customers (unique IPs) - today
    const { data: todayNewIPs } = await supabase
      .from('visitors')
      .select('ip_address')
      .gte('created_at', today.toISOString())
    const todayUniqueIPs = new Set((todayNewIPs || []).map(r => r.ip_address)).size

    // New customers - yesterday
    const { data: yesterdayIPs } = await supabase
      .from('visitors')
      .select('ip_address')
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', today.toISOString())
    const yesterdayUniqueIPs = new Set((yesterdayIPs || []).map(r => r.ip_address)).size

    // New customers - this week
    const { data: weekIPs } = await supabase
      .from('visitors')
      .select('ip_address')
      .gte('created_at', weekStart.toISOString())
    const weekUniqueIPs = new Set((weekIPs || []).map(r => r.ip_address)).size

    // New customers - this month
    const { data: monthIPs } = await supabase
      .from('visitors')
      .select('ip_address')
      .gte('created_at', monthStart.toISOString())
    const monthUniqueIPs = new Set((monthIPs || []).map(r => r.ip_address)).size

    // Total unique IPs (all time)
    const { data: allIPs } = await supabase
      .from('visitors')
      .select('ip_address')
    const totalUniqueIPs = new Set((allIPs || []).map(r => r.ip_address)).size

    // Today views
    const { count: todayViews } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())

    // Device breakdown
    const { data: deviceData } = await supabase
      .from('visitors')
      .select('device_type')
    
    const devices = (deviceData || []).reduce((acc: Record<string, number>, row) => {
      const type = row.device_type || 'unknown'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    // Recent visitors
    const { data: recentVisitors } = await supabase
      .from('visitors')
      .select('visitor_id, device_type, browser, os, page_url, created_at')
      .order('created_at', { ascending: false })
      .limit(20)

    // Hourly stats for today
    const { data: hourlyData } = await supabase
      .from('visitors')
      .select('created_at')
      .gte('created_at', today.toISOString())

    const hourlyStats = Array(24).fill(0)
    ;(hourlyData || []).forEach(row => {
      const hour = new Date(row.created_at).getHours()
      hourlyStats[hour]++
    })

    return NextResponse.json({
      today: todayUnique || 0,
      yesterday: yesterdayUnique || 0,
      this_week: weekUnique || 0,
      this_month: monthUnique || 0,
      total_views: totalViews || 0,
      today_views: todayViews || 0,
      // New customers by unique IP
      new_customers: {
        today: todayUniqueIPs,
        yesterday: yesterdayUniqueIPs,
        this_week: weekUniqueIPs,
        this_month: monthUniqueIPs,
        total: totalUniqueIPs,
      },
      devices,
      recent_visitors: recentVisitors || [],
      hourly_stats: hourlyStats,
    })
  } catch (error) {
    console.error('Get visitor stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}