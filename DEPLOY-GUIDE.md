# 🚀 Hướng dẫn Deploy Render - Vương Cường 68

## 📋 Chuẩn bị trước khi deploy

### ✅ Checklist
- [x] Git repository đã được khởi tạo
- [x] Code đã được commit
- [x] Code đã push lên GitHub: https://github.com/trieudz61/vuong-cuong-68-motorcycle
- [ ] Tài khoản Render đã tạo
- [ ] Supabase database đã setup
- [ ] Environment variables đã chuẩn bị

---

## 🌐 Deploy qua GitHub (Repository đã sẵn sàng)

### ✅ GitHub Repository
**Link:** https://github.com/trieudz61/vuong-cuong-68-motorcycle

Code đã được push thành công! Bây giờ có thể deploy trực tiếp.

### Bước 1: Deploy trên Render
1. Vào [Render.com](https://render.com)
2. Đăng ký/Đăng nhập (có thể dùng GitHub account)
3. Click "New +" → "Web Service"
4. Chọn "Connect a repository"
5. Authorize GitHub và chọn repository: `trieudz61/vuong-cuong-68-motorcycle`
6. Cấu hình service:

```
Name: vuong-cuong-68-motorcycle
Environment: Node
Region: Singapore (gần Việt Nam nhất)
Branch: main
Build Command: npm ci && npm run build
Start Command: npm start
Plan: Free (có thể upgrade sau)
```

---

## 🌐 Option 2: Deploy trực tiếp (Không cần GitHub)

### Bước 1: Tạo file zip
1. Nén toàn bộ thư mục `motorcycle-marketplace` thành file ZIP
2. Đảm bảo không bao gồm:
   - `node_modules/`
   - `.env.local`
   - `.git/` (nếu muốn)

### Bước 2: Upload lên Render
1. Vào [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Chọn "Deploy an existing image or build and deploy from a Git repository"
4. Chọn "Public Git repository" và nhập: `https://github.com/render-examples/nextjs`
5. Sau khi tạo service, vào "Settings" → "Build & Deploy"
6. Upload file ZIP của bạn

---

## ⚙️ Cấu hình Environment Variables

Trong Render Dashboard → Service → Environment, thêm:

```
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://jvxdampmfxukmddyknxj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_m_XjtH2A0NByAyyxdu0qjw_vgCGJwOh
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_from_supabase
NEXTAUTH_SECRET=your_random_32_character_string
NEXTAUTH_URL=https://vuong-cuong-68-motorcycle.onrender.com
NEXT_PUBLIC_SITE_URL=https://vuong-cuong-68-motorcycle.onrender.com
```

### Tạo NEXTAUTH_SECRET:
```bash
# Trên Windows PowerShell:
[System.Web.Security.Membership]::GeneratePassword(32, 0)

# Hoặc online: https://generate-secret.vercel.app/32
```

---

## 🗄️ Setup Supabase Database

### Bước 1: Tạo Supabase Project
1. Vào [Supabase.com](https://supabase.com)
2. Tạo tài khoản/Đăng nhập
3. "New project"
4. Chọn organization và đặt tên project
5. Chọn region gần Việt Nam (Singapore)
6. Đặt database password mạnh

### Bước 2: Chạy SQL Scripts
Vào Supabase Dashboard → SQL Editor, chạy theo thứ tự:

1. **schema.sql** - Tạo bảng và cấu trúc
2. **add-display-id.sql** - Thêm display ID
3. **fix-price-constraint.sql** - Sửa constraint giá
4. **fix-rls-all.sql** - ⭐ **QUAN TRỌNG** - Hiển thị xe đã bán

### Bước 3: Lấy API Keys
1. Vào Settings → API
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

---

## 🚀 Deploy Process

### Sau khi cấu hình xong:
1. Click "Create Web Service" (hoặc "Deploy")
2. Đợi build process (5-10 phút)
3. Kiểm tra logs nếu có lỗi
4. Website sẽ live tại: `https://vuong-cuong-68-motorcycle.onrender.com`

---

## ✅ Kiểm tra sau deploy

### Test các tính năng:
- [ ] Trang chủ load được
- [ ] Danh sách xe máy hiển thị
- [ ] Trang chi tiết xe hoạt động
- [ ] Admin login được (nếu đã tạo user)
- [ ] Upload ảnh hoạt động
- [ ] Social sharing preview đúng

### Test social sharing:
- [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

---

## 🔧 Troubleshooting

### Lỗi thường gặp:

**Build failed:**
- Kiểm tra Node.js version trong logs
- Đảm bảo `package.json` có đúng dependencies

**Database connection error:**
- Kiểm tra Supabase URL và keys
- Đảm bảo RLS policies đã chạy

**Images not loading:**
- Kiểm tra file paths
- Đảm bảo images trong `/public` folder

**Social sharing không hoạt động:**
- Kiểm tra `NEXT_PUBLIC_SITE_URL`
- Test với Facebook Debugger

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra Render logs
2. Kiểm tra Supabase logs
3. Test local trước khi deploy
4. Đọc documentation:
   - [Render Docs](https://render.com/docs)
   - [Supabase Docs](https://supabase.com/docs)
   - [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 🎉 Thành công!

Website của bạn sẽ có địa chỉ:
**https://vuong-cuong-68-motorcycle.onrender.com**

Chia sẻ link này để khách hàng có thể xem và mua xe máy! 🏍️

---

**Chúc mừng Vương Cường 68 đã có website chuyên nghiệp!** 🎊