-- Affiliate Tracking Database Schema
-- Migration: 001_affiliate_tracking
-- Created: 2024-01-15
-- Description: Sets up tables for affiliate link management, click tracking, and conversion attribution

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- AFFILIATE PROGRAMS TABLE
-- Stores configuration for each affiliate program
-- ============================================================================
CREATE TABLE IF NOT EXISTS affiliate_programs (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    base_url VARCHAR(500) NOT NULL,
    tracking_param VARCHAR(100) NOT NULL,
    commission_type VARCHAR(20) NOT NULL CHECK (commission_type IN ('percentage', 'fixed')),
    commission_rate DECIMAL(10, 2) NOT NULL,
    cookie_duration_days INTEGER NOT NULL DEFAULT 30,
    enabled BOOLEAN NOT NULL DEFAULT true,
    api_key_encrypted TEXT,
    affiliate_id VARCHAR(255),
    merchant_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default affiliate programs
INSERT INTO affiliate_programs (id, name, base_url, tracking_param, commission_type, commission_rate, cookie_duration_days, enabled) VALUES
    ('amazon', 'Amazon Associates', 'https://www.amazon.com', 'tag', 'percentage', 4.00, 1, true),
    ('shareasale', 'ShareASale', 'https://www.shareasale.com', 'afftrack', 'percentage', 10.00, 30, true),
    ('publisher-rocket', 'Publisher Rocket', 'https://publisherrocket.com', 'ref', 'percentage', 30.00, 60, true),
    ('helium10', 'Helium 10', 'https://helium10.com', 'referral', 'percentage', 25.00, 30, true),
    ('canva', 'Canva', 'https://www.canva.com', 'ref', 'fixed', 36.00, 30, true),
    ('bookbolt', 'BookBolt', 'https://bookbolt.io', 'ref', 'percentage', 30.00, 30, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- AFFILIATE LINKS TABLE
-- Stores individual affiliate links with metadata
-- ============================================================================
CREATE TABLE IF NOT EXISTS affiliate_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id VARCHAR(50) NOT NULL REFERENCES affiliate_programs(id),
    original_url VARCHAR(2000) NOT NULL,
    affiliate_url VARCHAR(2000) NOT NULL,
    product_name VARCHAR(500) NOT NULL,
    product_description TEXT,
    category VARCHAR(100),
    asin VARCHAR(20), -- Amazon-specific
    marketplace VARCHAR(10) DEFAULT 'US', -- Amazon marketplace
    image_url VARCHAR(2000),
    price_display VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT true,
    click_count INTEGER NOT NULL DEFAULT 0,
    conversion_count INTEGER NOT NULL DEFAULT 0,
    total_revenue DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_clicked_at TIMESTAMP WITH TIME ZONE
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_affiliate_links_program ON affiliate_links(program_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_category ON affiliate_links(category);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_active ON affiliate_links(is_active);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_asin ON affiliate_links(asin) WHERE asin IS NOT NULL;

-- ============================================================================
-- CLICK EVENTS TABLE
-- Records every click on an affiliate link for analytics
-- ============================================================================
CREATE TABLE IF NOT EXISTS affiliate_click_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    link_id UUID REFERENCES affiliate_links(id),
    program_id VARCHAR(50) NOT NULL REFERENCES affiliate_programs(id),
    session_id VARCHAR(100) NOT NULL,
    ip_hash VARCHAR(64) NOT NULL, -- SHA-256 hash for privacy
    user_agent TEXT,
    referrer VARCHAR(2000),
    page_url VARCHAR(2000),
    country_code VARCHAR(5),
    device_type VARCHAR(20), -- mobile, tablet, desktop
    browser VARCHAR(50),
    os VARCHAR(50),
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    converted BOOLEAN NOT NULL DEFAULT false,
    conversion_id UUID
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_click_events_link ON affiliate_click_events(link_id);
CREATE INDEX IF NOT EXISTS idx_click_events_program ON affiliate_click_events(program_id);
CREATE INDEX IF NOT EXISTS idx_click_events_session ON affiliate_click_events(session_id);
CREATE INDEX IF NOT EXISTS idx_click_events_date ON affiliate_click_events(clicked_at);
CREATE INDEX IF NOT EXISTS idx_click_events_converted ON affiliate_click_events(converted);

-- Partition by month for better performance (optional for high-traffic)
-- CREATE TABLE affiliate_click_events_2024_01 PARTITION OF affiliate_click_events
--     FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- ============================================================================
-- CONVERSIONS TABLE
-- Records successful conversions/sales from affiliate links
-- ============================================================================
CREATE TABLE IF NOT EXISTS affiliate_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    link_id UUID REFERENCES affiliate_links(id),
    click_event_id UUID REFERENCES affiliate_click_events(id),
    program_id VARCHAR(50) NOT NULL REFERENCES affiliate_programs(id),
    session_id VARCHAR(100) NOT NULL,
    order_id VARCHAR(255), -- External order ID from affiliate network
    order_amount DECIMAL(12, 2),
    commission_amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
    converted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conversions_link ON affiliate_conversions(link_id);
CREATE INDEX IF NOT EXISTS idx_conversions_program ON affiliate_conversions(program_id);
CREATE INDEX IF NOT EXISTS idx_conversions_status ON affiliate_conversions(status);
CREATE INDEX IF NOT EXISTS idx_conversions_date ON affiliate_conversions(converted_at);
CREATE INDEX IF NOT EXISTS idx_conversions_order ON affiliate_conversions(order_id);

-- ============================================================================
-- DAILY STATS TABLE
-- Aggregated daily statistics for faster dashboard queries
-- ============================================================================
CREATE TABLE IF NOT EXISTS affiliate_daily_stats (
    id SERIAL PRIMARY KEY,
    stat_date DATE NOT NULL,
    program_id VARCHAR(50) NOT NULL REFERENCES affiliate_programs(id),
    link_id UUID REFERENCES affiliate_links(id),
    impressions INTEGER NOT NULL DEFAULT 0,
    clicks INTEGER NOT NULL DEFAULT 0,
    conversions INTEGER NOT NULL DEFAULT 0,
    revenue DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    unique_visitors INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(stat_date, program_id, link_id)
);

-- Index for date-range queries
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON affiliate_daily_stats(stat_date);
CREATE INDEX IF NOT EXISTS idx_daily_stats_program ON affiliate_daily_stats(program_id);

-- ============================================================================
-- SESSIONS TABLE
-- Tracks user sessions for attribution
-- ============================================================================
CREATE TABLE IF NOT EXISTS affiliate_sessions (
    id VARCHAR(100) PRIMARY KEY,
    ip_hash VARCHAR(64) NOT NULL,
    first_click_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    first_referrer VARCHAR(2000),
    landing_page VARCHAR(2000),
    total_clicks INTEGER NOT NULL DEFAULT 0,
    converted BOOLEAN NOT NULL DEFAULT false,
    attributed_program_id VARCHAR(50) REFERENCES affiliate_programs(id),
    attributed_link_id UUID REFERENCES affiliate_links(id)
);

-- Index for session lookups
CREATE INDEX IF NOT EXISTS idx_sessions_ip ON affiliate_sessions(ip_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_activity ON affiliate_sessions(last_activity_at);

-- ============================================================================
-- WEBHOOK LOGS TABLE
-- Stores incoming webhooks from affiliate networks for debugging
-- ============================================================================
CREATE TABLE IF NOT EXISTS affiliate_webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id VARCHAR(50) NOT NULL,
    event_type VARCHAR(100),
    payload JSONB NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT false,
    error_message TEXT,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Index for unprocessed webhooks
CREATE INDEX IF NOT EXISTS idx_webhook_logs_unprocessed ON affiliate_webhook_logs(processed) WHERE NOT processed;

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_affiliate_programs_updated_at
    BEFORE UPDATE ON affiliate_programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_links_updated_at
    BEFORE UPDATE ON affiliate_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment click count on links
CREATE OR REPLACE FUNCTION increment_link_click_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE affiliate_links
    SET click_count = click_count + 1,
        last_clicked_at = NEW.clicked_at
    WHERE id = NEW.link_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER after_click_event_insert
    AFTER INSERT ON affiliate_click_events
    FOR EACH ROW
    WHEN (NEW.link_id IS NOT NULL)
    EXECUTE FUNCTION increment_link_click_count();

-- Function to update link stats on conversion
CREATE OR REPLACE FUNCTION update_link_conversion_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' THEN
        UPDATE affiliate_links
        SET conversion_count = conversion_count + 1,
            total_revenue = total_revenue + NEW.commission_amount
        WHERE id = NEW.link_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER after_conversion_update
    AFTER INSERT OR UPDATE OF status ON affiliate_conversions
    FOR EACH ROW
    WHEN (NEW.link_id IS NOT NULL AND NEW.status = 'approved')
    EXECUTE FUNCTION update_link_conversion_stats();

-- ============================================================================
-- VIEWS FOR REPORTING
-- ============================================================================

-- View for program performance summary
CREATE OR REPLACE VIEW v_program_performance AS
SELECT
    p.id AS program_id,
    p.name AS program_name,
    COUNT(DISTINCT l.id) AS total_links,
    COALESCE(SUM(l.click_count), 0) AS total_clicks,
    COALESCE(SUM(l.conversion_count), 0) AS total_conversions,
    COALESCE(SUM(l.total_revenue), 0) AS total_revenue,
    CASE
        WHEN SUM(l.click_count) > 0 THEN
            ROUND((SUM(l.conversion_count)::DECIMAL / SUM(l.click_count)) * 100, 2)
        ELSE 0
    END AS conversion_rate
FROM affiliate_programs p
LEFT JOIN affiliate_links l ON l.program_id = p.id AND l.is_active = true
GROUP BY p.id, p.name;

-- View for recent click activity
CREATE OR REPLACE VIEW v_recent_clicks AS
SELECT
    c.id,
    c.clicked_at,
    c.session_id,
    c.country_code,
    c.device_type,
    l.product_name,
    p.name AS program_name,
    c.converted
FROM affiliate_click_events c
JOIN affiliate_programs p ON p.id = c.program_id
LEFT JOIN affiliate_links l ON l.id = c.link_id
ORDER BY c.clicked_at DESC
LIMIT 100;

-- ============================================================================
-- GRANTS (adjust for your database user)
-- ============================================================================
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE affiliate_programs IS 'Configuration for each affiliate program/network';
COMMENT ON TABLE affiliate_links IS 'Individual affiliate links with performance metrics';
COMMENT ON TABLE affiliate_click_events IS 'Raw click tracking data for all affiliate links';
COMMENT ON TABLE affiliate_conversions IS 'Conversion/sale records with commission tracking';
COMMENT ON TABLE affiliate_daily_stats IS 'Pre-aggregated daily statistics for dashboard performance';
COMMENT ON TABLE affiliate_sessions IS 'User session tracking for conversion attribution';
COMMENT ON TABLE affiliate_webhook_logs IS 'Audit log for incoming webhooks from affiliate networks';
