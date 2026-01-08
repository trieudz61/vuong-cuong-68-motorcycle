# 🗄️ Database Setup - Supabase SQL Files

## 📋 Các file SQL cần chạy

Chạy các file SQL sau trong Supabase SQL Editor theo thứ tự:

1. **schema.sql** - Tạo bảng và cấu trúc cơ sở dữ liệu
2. **add-display-id.sql** - Thêm trường display_id cho xe máy  
3. **fix-price-constraint.sql** - Sửa constraint cho phép giá = 0
4. **fix-rls-all.sql** - ⭐ **MỚI** - Cập nhật RLS để hiển thị tất cả xe (bao gồm xe đã bán)

### 🚨 Chạy ngay file fix-rls-all.sql

Để hiển thị xe đã bán trên trang khách, cần chạy file này:

```sql
-- Copy và paste vào Supabase SQL Editor
-- Xóa policy cũ chỉ cho phép xem xe chưa bán
DROP POLICY IF EXISTS "Public can view available motorcycles" ON motorcycles;

-- Tạo policy mới cho phép public xem tất cả xe
CREATE POLICY "Public can view all motorcycles" ON motorcycles
  FOR SELECT USING (true);
```

## 📝 Mô tả các file

- **schema.sql**: Tạo toàn bộ cấu trúc database ban đầu
- **add-display-id.sql**: Thêm cột display_id để hiển thị ID dạng #0001
- **fix-price-constraint.sql**: Cho phép giá = 0 (nghĩa là "Liên hệ")
- **fix-rls-all.sql**: Cập nhật Row Level Security để hiển thị tất cả xe máy

## 🔧 Cách chạy

1. Mở Supabase Dashboard
2. Vào SQL Editor
3. Copy nội dung file SQL
4. Paste và chạy (Run)
5. Kiểm tra kết quả

## ⚠️ Lưu ý

- Chạy theo đúng thứ tự
- Kiểm tra không có lỗi sau mỗi lần chạy
- File fix-rls-all.sql là quan trọng nhất để hiển thị xe đã bán