import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jvxdampmfxukmddyknxj.supabase.co'
const supabaseKey = 'sb_publishable_m_XjtH2A0NByAyyxdu0qjw_vgCGJwOh'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDelete() {
  console.log('=== TEST DELETE MOTORCYCLE ===\n')

  // 1. Lấy danh sách xe
  console.log('1. Lấy danh sách xe...')
  const { data: motorcycles, error: listError } = await supabase
    .from('motorcycles')
    .select('id, title')
    .limit(5)

  if (listError) {
    console.log('Lỗi lấy danh sách:', listError.message)
    return
  }

  console.log('Danh sách xe:', motorcycles)

  if (!motorcycles || motorcycles.length === 0) {
    console.log('Không có xe nào để test')
    return
  }

  const testId = motorcycles[0].id
  console.log(`\n2. Thử xóa xe ID: ${testId}`)

  // 2. Thử xóa không đăng nhập
  const { error: deleteError, count } = await supabase
    .from('motorcycles')
    .delete()
    .eq('id', testId)

  console.log('Kết quả xóa (không đăng nhập):')
  console.log('- Error:', deleteError?.message || 'Không có lỗi')
  console.log('- Count:', count)

  // 3. Kiểm tra xe còn tồn tại không
  const { data: checkData } = await supabase
    .from('motorcycles')
    .select('id')
    .eq('id', testId)
    .single()

  console.log('\n3. Kiểm tra xe còn tồn tại:', checkData ? 'CÒN' : 'ĐÃ XÓA')

  // 4. Thử đăng nhập admin và xóa
  console.log('\n4. Đăng nhập admin...')
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@choxemaycu.com',
    password: 'Admin@123456'
  })

  if (authError) {
    console.log('Lỗi đăng nhập:', authError.message)
    return
  }

  console.log('Đăng nhập thành công:', authData.user?.email)

  // 5. Kiểm tra user trong bảng users
  console.log('\n5. Kiểm tra role trong bảng users...')
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user?.id)
    .single()

  console.log('User data:', userData)
  console.log('User error:', userError?.message)

  // 6. Thử xóa sau khi đăng nhập
  if (motorcycles.length > 1) {
    const testId2 = motorcycles[1].id
    console.log(`\n6. Thử xóa xe ID: ${testId2} (sau khi đăng nhập)`)

    const { error: deleteError2 } = await supabase
      .from('motorcycles')
      .delete()
      .eq('id', testId2)

    console.log('Kết quả xóa (đã đăng nhập):')
    console.log('- Error:', deleteError2?.message || 'Không có lỗi')

    // Kiểm tra lại
    const { data: checkData2 } = await supabase
      .from('motorcycles')
      .select('id')
      .eq('id', testId2)
      .single()

    console.log('Xe còn tồn tại:', checkData2 ? 'CÒN (XÓA THẤT BẠI)' : 'ĐÃ XÓA (THÀNH CÔNG)')
  }

  await supabase.auth.signOut()
}

testDelete().catch(console.error)
