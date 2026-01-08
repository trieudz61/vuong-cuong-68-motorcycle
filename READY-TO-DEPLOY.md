# 🎉 SẴN SÀNG DEPLOY - VƯƠNG CƯỜNG 68

## ✅ HOÀN THÀNH
- [x] Code đã push lên GitHub
- [x] Environment variables đã chuẩn bị
- [x] NEXTAUTH_SECRET đã generate
- [x] Tất cả files cần thiết đã có

---

## 🚀 DEPLOY NGAY BÂY GIỜ

### 🔗 GitHub Repository
**https://github.com/trieudz61/vuong-cuong-68-motorcycle**

### 📋 Các bước deploy (5 phút):

#### 1. Vào Render.com
- Đăng ký/Đăng nhập: https://render.com
- Click "New +" → "Web Service"

#### 2. Connect GitHub
- Chọn "Connect a repository"
- Authorize GitHub
- Chọn: `trieudz61/vuong-cuong-68-motorcycle`

#### 3. Cấu hình Service
```
Name: vuong-cuong-68-motorcycle
Environment: Node
Region: Singapore
Branch: main
Build Command: npm ci && npm run build
Start Command: npm start
Plan: Free
```

#### 4. Environment Variables
Copy paste từng dòng vào Render:

```
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://jvxdampmfxukmddyknxj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_m_XjtH2A0NByAyyxdu0qjw_vgCGJwOh
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXTAUTH_SECRET=ycp26kcD15urt8ovbnQJXmLTevGEDcXh
NEXTAUTH_URL=https://vuong-cuong-68-motorcycle.onrender.com
NEXT_PUBLIC_SITE_URL=https://vuong-cuong-68-motorcycle.onrender.com
```

**⚠️ LƯU Ý:** Cần lấy `SUPABASE_SERVICE_ROLE_KEY` từ Supabase Dashboard

#### 5. Deploy
- Click "Create Web Service"
- Đợi 5-10 phút build
- Website live tại: **https://vuong-cuong-68-motorcycle.onrender.com**

---

## 🗄️ SUPABASE SETUP

### Tạo Supabase Project:
1. Vào https://supabase.com/dashboard
2. "New project"
3. Chọn region Singapore
4. Đặt tên: `vuong-cuong-68-motorcycle`

### Chạy SQL Files (quan trọng!):
Vào SQL Editor, chạy theo thứ tự:

1. **schema.sql** - Tạo bảng
2. **add-display-id.sql** - Display ID
3. **fix-price-constraint.sql** - Giá = 0
4. **fix-rls-all.sql** - ⭐ **QUAN TRỌNG** - Hiển thị xe đã bán
5. **create-admin-user.sql** - 👤 **TẠO ADMIN USER**

### Tạo Admin User:
1. **Authentication** → **Users** → **Add user**
2. Email: `admin@gmail.com`
3. Password: `admin123`
4. Email Confirm: ✓
5. Chạy SQL: `SELECT create_admin_user();`

### Lấy API Keys:
Settings → API → Copy:
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- service_role → `SUPABASE_SERVICE_ROLE_KEY`

---

## 🎯 KẾT QUẢ

### Website sẽ có:
- **URL**: https://vuong-cuong-68-motorcycle.onrender.com
- **Admin**: https://vuong-cuong-68-motorcycle.onrender.com/admin
- **API**: https://vuong-cuong-68-motorcycle.onrender.com/api

### Tính năng hoạt động:
- ✅ Trang chủ với gallery cửa hàng
- ✅ Danh sách xe máy (có lọc, tìm kiếm)
- ✅ Chi tiết xe với watermark logo
- ✅ Social sharing (Facebook, Zalo preview)
- ✅ Admin panel quản lý xe
- ✅ Upload ảnh với watermark tự động
- ✅ Hiển thị xe đã bán (ảnh trắng đen)
- ✅ Page transitions với Harley animation
- ✅ Mobile responsive

---

## 📞 THÔNG TIN LIÊN HỆ TRÊN WEBSITE

- **Địa chỉ**: 06 Lý Thường Kiệt - Phường Thành Vinh - Nghệ An
- **SĐT 1**: 0941 231 619
- **SĐT 2**: 0975 965 678
- **Facebook**: https://www.facebook.com/bommobile.net
- **Zalo**: 0941 231 619 / 0975 965 678
- **Group FB**: https://www.facebook.com/groups/305902860342012

---

## 🎊 CHÚC MỪNG!

**Vương Cường 68 sắp có website chuyên nghiệp!**

Sau khi deploy xong, website sẽ giúp:
- Khách hàng xem xe 24/7
- Chia sẻ link xe lên mạng xã hội
- Quản lý xe máy dễ dàng
- Tăng uy tín và doanh số

**Hãy deploy ngay để bắt đầu bán xe online! 🏍️**