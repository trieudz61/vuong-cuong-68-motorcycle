import { supabase } from './supabase'

export interface AuthUser {
  id: string
  email: string
  role: 'admin' | 'user'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResult {
  success: boolean
  user?: AuthUser
  error?: string
}

// Đăng nhập
export async function signIn(credentials: LoginCredentials): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: 'Không thể đăng nhập' }
    }

    // Lấy thông tin role từ bảng users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (userError) {
      return { success: false, error: 'Không thể lấy thông tin người dùng' }
    }

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email!,
        role: userData.role,
      },
    }
  } catch (err) {
    return { success: false, error: 'Đã xảy ra lỗi khi đăng nhập' }
  }
}

// Đăng xuất
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (err) {
    return { success: false, error: 'Đã xảy ra lỗi khi đăng xuất' }
  }
}

// Lấy session hiện tại
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error || !session) {
    return null
  }
  return session
}

// Lấy user hiện tại với role
export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  return {
    id: user.id,
    email: user.email!,
    role: userData?.role || 'user',
  }
}

// Kiểm tra có phải admin không
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === 'admin'
}
