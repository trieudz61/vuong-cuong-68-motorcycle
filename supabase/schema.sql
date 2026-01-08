-- =============================================
-- MOTORCYCLE MARKETPLACE DATABASE SCHEMA
-- Copy và chạy trong Supabase SQL Editor
-- =============================================

-- 1. Bảng motorcycles - Danh sách xe máy
CREATE TABLE IF NOT EXISTS motorcycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
  condition VARCHAR(50) NOT NULL,
  mileage INTEGER NOT NULL CHECK (mileage >= 0),
  engine_capacity INTEGER NOT NULL CHECK (engine_capacity > 0),
  fuel_type VARCHAR(50) NOT NULL,
  color VARCHAR(50) NOT NULL,
  price DECIMAL(15,2) NOT NULL CHECK (price > 0),
  description TEXT,
  images TEXT[] DEFAULT '{}',
  contact_phone VARCHAR(20) NOT NULL,
  contact_address TEXT NOT NULL,
  is_sold BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Bảng pawn_services - Dịch vụ cầm đồ
CREATE TABLE IF NOT EXISTS pawn_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  motorcycle_brand VARCHAR(100) NOT NULL,
  motorcycle_model VARCHAR(100) NOT NULL,
  pawn_value DECIMAL(15,2) NOT NULL CHECK (pawn_value > 0),
  pawn_date DATE NOT NULL,
  redemption_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'đang cầm' CHECK (status IN ('đang cầm', 'đã chuộc', 'quá hạn')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (redemption_date > pawn_date)
);

-- 3. Bảng users - Người dùng (liên kết với Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES cho tìm kiếm và lọc nhanh
-- =============================================

CREATE INDEX IF NOT EXISTS idx_motorcycles_brand ON motorcycles(brand);
CREATE INDEX IF NOT EXISTS idx_motorcycles_price ON motorcycles(price);
CREATE INDEX IF NOT EXISTS idx_motorcycles_year ON motorcycles(year);
CREATE INDEX IF NOT EXISTS idx_motorcycles_is_sold ON motorcycles(is_sold);
CREATE INDEX IF NOT EXISTS idx_motorcycles_created_at ON motorcycles(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pawn_services_status ON pawn_services(status);
CREATE INDEX IF NOT EXISTS idx_pawn_services_created_at ON pawn_services(created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Bật RLS cho tất cả bảng
ALTER TABLE motorcycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pawn_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- MOTORCYCLES POLICIES
-- Ai cũng có thể xem xe chưa bán
CREATE POLICY "Public can view available motorcycles" ON motorcycles
  FOR SELECT USING (is_sold = false);

-- Admin có thể xem tất cả xe
CREATE POLICY "Admin can view all motorcycles" ON motorcycles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Admin có thể thêm xe
CREATE POLICY "Admin can insert motorcycles" ON motorcycles
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Admin có thể sửa xe
CREATE POLICY "Admin can update motorcycles" ON motorcycles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Admin có thể xóa xe
CREATE POLICY "Admin can delete motorcycles" ON motorcycles
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- PAWN_SERVICES POLICIES
-- Ai cũng có thể tạo yêu cầu cầm đồ
CREATE POLICY "Anyone can create pawn request" ON pawn_services
  FOR INSERT WITH CHECK (true);

-- Chỉ admin xem được danh sách cầm đồ
CREATE POLICY "Admin can view pawn services" ON pawn_services
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Admin có thể cập nhật trạng thái
CREATE POLICY "Admin can update pawn services" ON pawn_services
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- USERS POLICIES
-- User chỉ xem được thông tin của mình
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Admin xem được tất cả users
CREATE POLICY "Admin can view all users" ON users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- =============================================
-- TRIGGER cập nhật updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_motorcycles_updated_at
  BEFORE UPDATE ON motorcycles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FUNCTION tự động tạo user profile khi đăng ký
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger khi có user mới đăng ký
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- DỮ LIỆU MẪU (Optional - có thể bỏ qua)
-- =============================================

-- Thêm một số xe mẫu để test
INSERT INTO motorcycles (title, brand, model, year, condition, mileage, engine_capacity, fuel_type, color, price, description, contact_phone, contact_address, is_sold)
VALUES 
  ('Honda Vision 2022 - Như mới', 'Honda', 'Vision', 2022, 'Cũ - Tốt', 5000, 110, 'Xăng', 'Trắng', 32000000, 'Xe đẹp, máy êm, bảo dưỡng định kỳ', '0901234567', 'Quận 1, TP.HCM', false),
  ('Yamaha Exciter 150 - Độ nhẹ', 'Yamaha', 'Exciter', 2021, 'Cũ - Tốt', 15000, 150, 'Xăng', 'Đen', 38000000, 'Xe độ nhẹ, pô Akrapovic, đèn LED', '0912345678', 'Quận 7, TP.HCM', false),
  ('Honda SH 150i - Chính chủ', 'Honda', 'SH', 2020, 'Cũ - Khá', 20000, 150, 'Xăng', 'Đỏ', 75000000, 'Xe chính chủ, đầy đủ giấy tờ', '0923456789', 'Quận 3, TP.HCM', false)
ON CONFLICT DO NOTHING;