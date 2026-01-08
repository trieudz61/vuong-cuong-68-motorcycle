# 👤 HƯỚNG DẪN TẠO ADMIN USER

## 📋 Thông tin Admin
- **Email**: admin@gmail.com
- **Password**: admin123
- **Role**: admin

---

## 🔧 Cách 1: Tạo qua Supabase Dashboard (Khuyến nghị)

### Bước 1: Vào Supabase Dashboard
1. Mở https://supabase.com/dashboard
2. Chọn project `vuong-cuong-68-motorcycle`
3. Vào **Authentication** → **Users**

### Bước 2: Tạo Admin User
1. Click "**Add user**"
2. Điền thông tin:
   ```
   Email: admin@gmail.com
   Password: admin123
   Email Confirm: ✓ (check vào)
   ```
3. Click "**Create user**"

### Bước 3: Set Role Admin
1. Vào **SQL Editor**
2. Chạy lệnh:
   ```sql
   SELECT create_admin_user();
   ```
3. Hoặc chạy manual:
   ```sql
   INSERT INTO public.users (id, email, role)
   SELECT id, email, 'admin'
   FROM auth.users 
   WHERE email = 'admin@gmail.com'
   ON CONFLICT (id) DO UPDATE SET role = 'admin';
   ```

---

## 🔧 Cách 2: Tạo qua Website (Sau khi deploy)

### Bước 1: Đăng ký trên website
1. Vào https://vuong-cuong-68-motorcycle.onrender.com/login
2. Click "Đăng ký" (nếu có)
3. Hoặc dùng Supabase Auth UI

### Bước 2: Cập nhật role
1. Vào Supabase SQL Editor
2. Chạy:
   ```sql
   UPDATE public.users 
   SET role = 'admin' 
   WHERE email = 'admin@gmail.com';
   ```

---

## ✅ Kiểm tra Admin User

### Trong Supabase:
```sql
-- Xem tất cả users
SELECT 
  u.id,
  u.email,
  pu.role,
  u.created_at
FROM auth.users u
LEFT JOIN public.users pu ON u.id = pu.id
ORDER BY u.created_at DESC;

-- Kiểm tra admin cụ thể
SELECT * FROM public.users WHERE email = 'admin@gmail.com';
```

### Trên Website:
1. Vào https://vuong-cuong-68-motorcycle.onrender.com/login
2. Đăng nhập:
   - Email: `admin@gmail.com`
   - Password: `admin123`
3. Sau khi đăng nhập, vào `/admin`
4. Nếu thấy trang admin → Thành công! ✅

---

## 🚨 Troubleshooting

### Lỗi "User not found":
- Đảm bảo đã tạo user trong Supabase Auth
- Kiểm tra email chính xác: `admin@gmail.com`

### Lỗi "Access denied":
- Kiểm tra role trong database:
  ```sql
  SELECT role FROM public.users WHERE email = 'admin@gmail.com';
  ```
- Phải là `admin`, không phải `user`

### Lỗi đăng nhập:
- Kiểm tra password: `admin123`
- Đảm bảo Email Confirm = true trong Supabase Auth

---

## 🔐 Bảo mật

### Sau khi setup xong:
1. **Đổi password mạnh hơn**:
   - Vào Supabase Auth → Users → admin@gmail.com
   - Click "Reset password"
   - Hoặc đổi trên website

2. **Đổi email thành email thật**:
   ```sql
   UPDATE auth.users 
   SET email = 'your-real-email@gmail.com' 
   WHERE email = 'admin@gmail.com';
   
   UPDATE public.users 
   SET email = 'your-real-email@gmail.com' 
   WHERE email = 'admin@gmail.com';
   ```

3. **Tạo thêm admin backup**:
   - Tạo thêm 1-2 tài khoản admin khác
   - Phòng trường hợp mất mật khẩu

---

## 📱 Sử dụng Admin Panel

Sau khi đăng nhập admin thành công:

### Quản lý xe máy:
- **Thêm xe**: `/admin/motorcycles/new`
- **Sửa xe**: Click "Sửa" trong danh sách
- **Xóa xe**: Click "Xóa" (có confirm)
- **Đánh dấu đã bán**: Toggle switch

### Upload ảnh:
- Kéo thả nhiều ảnh cùng lúc
- Tự động nén và thêm watermark
- Preview trước khi lưu

### Quản lý cầm đồ:
- Xem danh sách yêu cầu cầm đồ
- Cập nhật trạng thái
- Thêm ghi chú

---

## 🎉 Hoàn thành!

Admin user đã sẵn sàng sử dụng:
- **URL Admin**: https://vuong-cuong-68-motorcycle.onrender.com/admin
- **Email**: admin@gmail.com  
- **Password**: admin123

**Nhớ đổi password sau khi đăng nhập lần đầu!** 🔒