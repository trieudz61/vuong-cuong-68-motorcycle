-- =============================================
-- TẠO ADMIN USER - VƯƠNG CƯỜNG 68
-- Chạy sau khi đã deploy website và có thể đăng ký
-- =============================================

-- Cách 1: Tạo user qua Supabase Auth Dashboard (Khuyến nghị)
-- 1. Vào Supabase Dashboard → Authentication → Users
-- 2. Click "Add user" 
-- 3. Email: admin@gmail.com
-- 4. Password: admin123
-- 5. Email Confirm: true
-- 6. Sau khi tạo, copy User ID và chạy SQL dưới đây

-- Cách 2: Nếu đã có user, cập nhật role thành admin
-- Thay 'USER_ID_HERE' bằng ID thật của user admin@gmail.com

-- UPDATE users SET role = 'admin' 
-- WHERE email = 'admin@gmail.com';

-- Cách 3: Insert trực tiếp (nếu user đã tồn tại trong auth.users)
-- INSERT INTO public.users (id, email, role)
-- SELECT id, email, 'admin'
-- FROM auth.users 
-- WHERE email = 'admin@gmail.com'
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- =============================================
-- KIỂM TRA ADMIN USER
-- =============================================

-- Xem tất cả users và role
SELECT 
  u.id,
  u.email,
  pu.role,
  u.created_at
FROM auth.users u
LEFT JOIN public.users pu ON u.id = pu.id
ORDER BY u.created_at DESC;

-- =============================================
-- TẠO ADMIN USER BẰNG FUNCTION (Tự động)
-- =============================================

-- Function tạo admin user tự động
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Tìm user admin@gmail.com trong auth.users
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@gmail.com';
  
  -- Nếu tìm thấy, cập nhật role thành admin
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.users (id, email, role)
    VALUES (admin_user_id, 'admin@gmail.com', 'admin')
    ON CONFLICT (id) 
    DO UPDATE SET role = 'admin';
    
    RAISE NOTICE 'Admin user created/updated successfully!';
  ELSE
    RAISE NOTICE 'User admin@gmail.com not found in auth.users. Please create user first.';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Chạy function (sau khi đã tạo user admin@gmail.com)
-- SELECT create_admin_user();

-- =============================================
-- HƯỚNG DẪN THỰC HIỆN
-- =============================================

/*
BƯỚC 1: Tạo user trong Supabase Auth
1. Vào Supabase Dashboard
2. Authentication → Users → Add user
3. Email: admin@gmail.com
4. Password: admin123
5. Email Confirm: ✓ (check)
6. Click "Create user"

BƯỚC 2: Chạy function tạo admin
SELECT create_admin_user();

BƯỚC 3: Kiểm tra
SELECT * FROM public.users WHERE email = 'admin@gmail.com';

BƯỚC 4: Test đăng nhập
1. Vào website/login
2. Email: admin@gmail.com
3. Password: admin123
4. Vào /admin để kiểm tra quyền
*/