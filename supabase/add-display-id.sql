-- =============================================
-- THÊM DISPLAY_ID CHO XE MÁY
-- Chạy trong Supabase SQL Editor
-- =============================================

-- 1. Tạo sequence cho display_id
CREATE SEQUENCE IF NOT EXISTS motorcycles_display_id_seq START 1;

-- 2. Thêm cột display_id
ALTER TABLE motorcycles 
ADD COLUMN IF NOT EXISTS display_id INTEGER UNIQUE DEFAULT nextval('motorcycles_display_id_seq');

-- 3. Cập nhật display_id cho các xe đã có (theo thứ tự created_at)
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM motorcycles
  WHERE display_id IS NULL OR display_id = 0
)
UPDATE motorcycles m
SET display_id = n.rn
FROM numbered n
WHERE m.id = n.id;

-- 4. Reset sequence về giá trị lớn nhất + 1
SELECT setval('motorcycles_display_id_seq', COALESCE((SELECT MAX(display_id) FROM motorcycles), 0) + 1, false);

-- 5. Tạo index cho display_id
CREATE INDEX IF NOT EXISTS idx_motorcycles_display_id ON motorcycles(display_id);
