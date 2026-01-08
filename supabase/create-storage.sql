-- =============================================
-- TẠO STORAGE BUCKET CHO HÌNH ẢNH
-- Chạy trong Supabase SQL Editor
-- =============================================

-- 1. Tạo bucket "images" (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Policy cho phép ai cũng có thể xem ảnh
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- 3. Policy cho phép user đã đăng nhập upload ảnh
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- 4. Policy cho phép user đã đăng nhập xóa ảnh
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);
