-- =============================================
-- BẢNG THEO DÕI LƯỢT TRUY CẬP (VISITORS)
-- Chạy trong Supabase SQL Editor
-- =============================================

-- 1. Tạo bảng visitors
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id VARCHAR(64) NOT NULL, -- Hash của IP + User Agent
  ip_address VARCHAR(45), -- IPv4 hoặc IPv6
  user_agent TEXT,
  device_type VARCHAR(20), -- mobile, tablet, desktop
  browser VARCHAR(50),
  os VARCHAR(50),
  country VARCHAR(100),
  city VARCHAR(100),
  page_url TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tạo indexes
CREATE INDEX IF NOT EXISTS idx_visitors_visitor_id ON visitors(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitors_created_at ON visitors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_device_type ON visitors(device_type);

-- 3. Bật RLS
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- 4. Policy cho phép insert từ anonymous
CREATE POLICY "Anyone can insert visitor" ON visitors
  FOR INSERT WITH CHECK (true);

-- 5. Policy cho admin xem tất cả
CREATE POLICY "Admin can view all visitors" ON visitors
  FOR SELECT USING (true);

-- 6. Function lấy thống kê visitor
CREATE OR REPLACE FUNCTION get_visitor_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'today', (SELECT COUNT(DISTINCT visitor_id) FROM visitors WHERE created_at >= CURRENT_DATE),
    'yesterday', (SELECT COUNT(DISTINCT visitor_id) FROM visitors WHERE created_at >= CURRENT_DATE - INTERVAL '1 day' AND created_at < CURRENT_DATE),
    'this_week', (SELECT COUNT(DISTINCT visitor_id) FROM visitors WHERE created_at >= date_trunc('week', CURRENT_DATE)),
    'this_month', (SELECT COUNT(DISTINCT visitor_id) FROM visitors WHERE created_at >= date_trunc('month', CURRENT_DATE)),
    'total_unique', (SELECT COUNT(DISTINCT visitor_id) FROM visitors),
    'total_views', (SELECT COUNT(*) FROM visitors),
    'today_views', (SELECT COUNT(*) FROM visitors WHERE created_at >= CURRENT_DATE),
    'devices', (
      SELECT json_object_agg(device_type, cnt)
      FROM (
        SELECT COALESCE(device_type, 'unknown') as device_type, COUNT(DISTINCT visitor_id) as cnt
        FROM visitors
        GROUP BY device_type
      ) d
    ),
    'recent_visitors', (
      SELECT json_agg(row_to_json(r))
      FROM (
        SELECT visitor_id, device_type, browser, os, city, country, created_at
        FROM visitors
        ORDER BY created_at DESC
        LIMIT 10
      ) r
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 7. Kiểm tra
SELECT get_visitor_stats();