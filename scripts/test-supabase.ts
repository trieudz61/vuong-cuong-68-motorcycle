// Test Supabase Connection
// Run: npx tsx scripts/test-supabase.ts

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('\n🔍 Kiểm tra kết nối Supabase...\n')

// Check env vars
console.log('1. Kiểm tra biến môi trường:')
if (!supabaseUrl) {
  console.log('   ❌ NEXT_PUBLIC_SUPABASE_URL: Chưa cấu hình!')
} else {
  console.log(`   ✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl.substring(0, 30)}...`)
}

if (!supabaseKey) {
  console.log('   ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY: Chưa cấu hình!')
} else {
  console.log(`   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey.substring(0, 20)}...`)
}

if (!supabaseUrl || !supabaseKey) {
  console.log('\n⚠️  Vui lòng cấu hình đầy đủ biến môi trường trong .env.local')
  process.exit(1)
}

// Create client and test
const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('\n2. Test kết nối database:')
  
  try {
    // Test motorcycles table
    const { data: motorcycles, error: motoError } = await supabase
      .from('motorcycles')
      .select('count')
      .limit(1)

    if (motoError) {
      console.log(`   ❌ Bảng motorcycles: ${motoError.message}`)
      if (motoError.message.includes('does not exist')) {
        console.log('      → Cần chạy schema.sql trong Supabase SQL Editor')
      }
    } else {
      console.log('   ✅ Bảng motorcycles: OK')
    }

    // Test pawn_services table
    const { data: pawn, error: pawnError } = await supabase
      .from('pawn_services')
      .select('count')
      .limit(1)

    if (pawnError) {
      console.log(`   ❌ Bảng pawn_services: ${pawnError.message}`)
    } else {
      console.log('   ✅ Bảng pawn_services: OK')
    }

    // Test users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (usersError) {
      console.log(`   ❌ Bảng users: ${usersError.message}`)
    } else {
      console.log('   ✅ Bảng users: OK')
    }

    // Count motorcycles
    console.log('\n3. Dữ liệu hiện có:')
    const { count: motoCount } = await supabase
      .from('motorcycles')
      .select('*', { count: 'exact', head: true })
    console.log(`   📦 Số xe máy: ${motoCount || 0}`)

    const { count: pawnCount } = await supabase
      .from('pawn_services')
      .select('*', { count: 'exact', head: true })
    console.log(`   📋 Số dịch vụ cầm đồ: ${pawnCount || 0}`)

    console.log('\n✅ Kết nối Supabase thành công!\n')

  } catch (err) {
    console.log(`\n❌ Lỗi kết nối: ${err}`)
    process.exit(1)
  }
}

testConnection()
