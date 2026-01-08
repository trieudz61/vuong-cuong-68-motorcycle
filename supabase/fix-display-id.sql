-- =============================================
-- SỬA DISPLAY_ID CHO TẤT CẢ XE MÁY
-- Chạy trong Supabase SQL Editor
-- =============================================

-- 1. Đảm bảo sequence tồn tại và bắt đầu từ 1
DROP SEQUENCE IF EXISTS motorcycles_display_id_seq CASCADE;
CREATE SEQUENCE motorcycles_display_id_seq START 1;

-- 2. Xóa cột display_id cũ nếu có và tạo lại
ALTER TABLE motorcycles DROP COLUMN IF EXISTS display_id;
ALTER TABLE motorcycles ADD COLUMN display_id INTEGER UNIQUE DEFAULT nextval('motorcycles_display_id_seq');

-- 3. Cập nhật display_id cho tất cả xe hiện có theo thứ tự created_at
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM motorcycles
  ORDER BY created_at ASC
)
UPDATE motorcycles m
SET display_id = n.rn
FROM numbered n
WHERE m.id = n.id;

-- 4. Reset sequence về giá trị tiếp theo
SELECT setval('motorcycles_display_id_seq', COALESCE((SELECT MAX(display_id) FROM motorcycles), 0) + 1, false);

-- 5. Tạo index
CREATE INDEX IF NOT EXISTS idx_motorcycles_display_id ON motorcycles(display_id);

-- 6. Kiểm tra kết quả
SELECT 
  COUNT(*) as total_motorcycles,
  COUNT(display_id) as motorcycles_with_display_id,
  MIN(display_id) as min_display_id,
  MAX(display_id) as max_display_id
FROM motorcycles;

-- 7. Hiển thị 5 xe đầu tiên để kiểm tra
SELECT id, title, display_id, created_at 
FROM motorcycles 
ORDER BY display_id ASC 
LIMIT 5;