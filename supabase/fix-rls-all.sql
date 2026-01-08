-- =============================================
-- FIX RLS POLICIES TO SHOW ALL MOTORCYCLES
-- Cập nhật policy để hiển thị tất cả xe (bao gồm xe đã bán)
-- =============================================

-- Xóa policy cũ chỉ cho phép xem xe chưa bán
DROP POLICY IF EXISTS "Public can view available motorcycles" ON motorcycles;

-- Tạo policy mới cho phép public xem tất cả xe
CREATE POLICY "Public can view all motorcycles" ON motorcycles
  FOR SELECT USING (true);

-- Giữ nguyên policy admin có thể xem tất cả xe (để đảm bảo)
-- Policy này vẫn cần thiết cho các thao tác admin khác