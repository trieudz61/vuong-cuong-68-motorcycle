-- =============================================
-- SỬA CONSTRAINT GIÁ XE (cho phép price = 0 = "Liên hệ")
-- Chạy trong Supabase SQL Editor
-- =============================================

-- Xóa constraint cũ
ALTER TABLE motorcycles DROP CONSTRAINT IF EXISTS motorcycles_price_check;

-- Thêm constraint mới cho phép price >= 0
ALTER TABLE motorcycles ADD CONSTRAINT motorcycles_price_check CHECK (price >= 0);
