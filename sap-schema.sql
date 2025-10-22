-- Sustainable AI Protocol (SAP) Database Schema
-- Version: 1.0.0
-- 
-- This schema defines the database structure for tracking
-- environmental impact of AI applications.

-- Enable Row Level Security (RLS)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE payment_type AS ENUM ('stamp', 'membership', 'credits');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');

-- Global statistics table
CREATE TABLE global_stats (
    id SERIAL PRIMARY KEY,
    total_prompts BIGINT NOT NULL DEFAULT 0,
    total_energy DECIMAL(10,6) NOT NULL DEFAULT 0,
    total_co2 DECIMAL(10,6) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User payments table
CREATE TABLE user_payments (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    type payment_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    stripe_session_id VARCHAR(255) UNIQUE,
    stripe_payment_intent_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prompt tracking table
CREATE TABLE prompt_tracking (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    prompt TEXT NOT NULL,
    model VARCHAR(100),
    tokens INTEGER,
    energy DECIMAL(10,6),
    co2 DECIMAL(10,6),
    source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255),
    name VARCHAR(255),
    status user_status DEFAULT 'active',
    has_stamp BOOLEAN DEFAULT FALSE,
    has_membership BOOLEAN DEFAULT FALSE,
    credits DECIMAL(10,2) DEFAULT 0,
    total_prompts BIGINT DEFAULT 0,
    total_energy DECIMAL(10,6) DEFAULT 0,
    total_co2 DECIMAL(10,6) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI models table
CREATE TABLE ai_models (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    provider VARCHAR(100),
    energy_per_token DECIMAL(10,8),
    co2_per_token DECIMAL(10,8),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Environmental impact factors table
CREATE TABLE impact_factors (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    energy_factor DECIMAL(10,8) NOT NULL,
    co2_factor DECIMAL(10,8) NOT NULL,
    region VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Widget installations table
CREATE TABLE widget_installations (
    id SERIAL PRIMARY KEY,
    domain VARCHAR(255) NOT NULL,
    user_id VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    install_count INTEGER DEFAULT 1,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API usage tracking table
CREATE TABLE api_usage (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    endpoint VARCHAR(100) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER,
    response_time INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_global_stats_created_at ON global_stats(created_at);
CREATE INDEX idx_user_payments_user_id ON user_payments(user_id);
CREATE INDEX idx_user_payments_type ON user_payments(type);
CREATE INDEX idx_user_payments_created_at ON user_payments(created_at);
CREATE INDEX idx_prompt_tracking_user_id ON prompt_tracking(user_id);
CREATE INDEX idx_prompt_tracking_created_at ON prompt_tracking(created_at);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_ai_models_name ON ai_models(name);
CREATE INDEX idx_impact_factors_model_name ON impact_factors(model_name);
CREATE INDEX idx_widget_installations_domain ON widget_installations(domain);
CREATE INDEX idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX idx_api_usage_created_at ON api_usage(created_at);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_user_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_profiles 
    SET 
        total_prompts = total_prompts + 1,
        total_energy = total_energy + COALESCE(NEW.energy, 0),
        total_co2 = total_co2 + COALESCE(NEW.co2, 0),
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic profile updates
CREATE TRIGGER trigger_update_user_profile_stats
    AFTER INSERT ON prompt_tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_user_profile_stats();

-- Create function to update global stats
CREATE OR REPLACE FUNCTION update_global_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO global_stats (total_prompts, total_energy, total_co2)
    SELECT 
        COUNT(*) as total_prompts,
        COALESCE(SUM(energy), 0) as total_energy,
        COALESCE(SUM(co2), 0) as total_co2
    FROM prompt_tracking
    WHERE created_at >= CURRENT_DATE;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for global stats updates
CREATE TRIGGER trigger_update_global_stats
    AFTER INSERT ON prompt_tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_global_stats();

-- Insert initial data
INSERT INTO global_stats (total_prompts, total_energy, total_co2) 
VALUES (0, 0, 0);

-- Insert default AI models with energy factors
INSERT INTO ai_models (name, provider, energy_per_token, co2_per_token) VALUES
('openai/gpt-3.5-turbo', 'OpenAI', 0.000001, 0.0000005),
('openai/gpt-4', 'OpenAI', 0.000002, 0.000001),
('anthropic/claude-3-sonnet', 'Anthropic', 0.0000015, 0.00000075),
('anthropic/claude-3-opus', 'Anthropic', 0.0000025, 0.00000125),
('google/gemini-pro', 'Google', 0.0000012, 0.0000006),
('meta/llama-2-70b', 'Meta', 0.0000018, 0.0000009);

-- Insert default impact factors
INSERT INTO impact_factors (model_name, energy_factor, co2_factor, region) VALUES
('openai/gpt-3.5-turbo', 0.000001, 0.0000005, 'us-east'),
('openai/gpt-4', 0.000002, 0.000001, 'us-east'),
('anthropic/claude-3-sonnet', 0.0000015, 0.00000075, 'us-west'),
('anthropic/claude-3-opus', 0.0000025, 0.00000125, 'us-west'),
('google/gemini-pro', 0.0000012, 0.0000006, 'us-central'),
('meta/llama-2-70b', 0.0000018, 0.0000009, 'us-east');

-- Create views for easier querying
CREATE VIEW user_summary AS
SELECT 
    up.user_id,
    up.name,
    up.email,
    up.has_stamp,
    up.has_membership,
    up.credits,
    up.total_prompts,
    up.total_energy,
    up.total_co2,
    up.created_at,
    up.updated_at
FROM user_profiles up;

CREATE VIEW global_summary AS
SELECT 
    gs.total_prompts,
    gs.total_energy,
    gs.total_co2,
    gs.created_at,
    COUNT(DISTINCT up.user_id) as active_users,
    COUNT(DISTINCT wi.domain) as active_domains
FROM global_stats gs
LEFT JOIN user_profiles up ON up.status = 'active'
LEFT JOIN widget_installations wi ON wi.is_active = true
GROUP BY gs.id, gs.total_prompts, gs.total_energy, gs.total_co2, gs.created_at
ORDER BY gs.created_at DESC
LIMIT 1;

-- Create Row Level Security policies
ALTER TABLE user_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user data access
CREATE POLICY "Users can view their own payments" ON user_payments
    FOR SELECT USING (user_id = current_setting('app.current_user_id'));

CREATE POLICY "Users can view their own prompts" ON prompt_tracking
    FOR SELECT USING (user_id = current_setting('app.current_user_id'));

CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (user_id = current_setting('app.current_user_id'));

-- Create function to set current user
CREATE OR REPLACE FUNCTION set_current_user(user_id_param TEXT)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_user_id', user_id_param, true);
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create function to get latest global stats
CREATE OR REPLACE FUNCTION get_latest_global_stats()
RETURNS TABLE (
    total_prompts BIGINT,
    total_energy DECIMAL(10,6),
    total_co2 DECIMAL(10,6),
    last_updated TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        gs.total_prompts,
        gs.total_energy,
        gs.total_co2,
        gs.created_at
    FROM global_stats gs
    ORDER BY gs.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Create function to track prompt with automatic calculations
CREATE OR REPLACE FUNCTION track_prompt(
    p_user_id VARCHAR(255),
    p_prompt TEXT,
    p_model VARCHAR(100),
    p_tokens INTEGER DEFAULT NULL
)
RETURNS TABLE (
    prompt_id INTEGER,
    energy DECIMAL(10,6),
    co2 DECIMAL(10,6)
) AS $$
DECLARE
    v_energy DECIMAL(10,6);
    v_co2 DECIMAL(10,6);
    v_tokens INTEGER;
    v_energy_factor DECIMAL(10,8);
    v_co2_factor DECIMAL(10,8);
BEGIN
    -- Calculate tokens if not provided
    v_tokens := COALESCE(p_tokens, CEIL(LENGTH(p_prompt) / 4));
    
    -- Get energy and CO2 factors for the model
    SELECT energy_per_token, co2_per_token
    INTO v_energy_factor, v_co2_factor
    FROM ai_models
    WHERE name = p_model AND is_active = true
    LIMIT 1;
    
    -- Use default factors if model not found
    IF v_energy_factor IS NULL THEN
        v_energy_factor := 0.000001;
        v_co2_factor := 0.0000005;
    END IF;
    
    -- Calculate environmental impact
    v_energy := v_tokens * v_energy_factor;
    v_co2 := v_tokens * v_co2_factor;
    
    -- Insert prompt tracking record
    INSERT INTO prompt_tracking (user_id, prompt, model, tokens, energy, co2)
    VALUES (p_user_id, p_prompt, p_model, v_tokens, v_energy, v_co2)
    RETURNING id, energy, co2 INTO prompt_id, v_energy, v_co2;
    
    RETURN QUERY SELECT prompt_id, v_energy, v_co2;
END;
$$ LANGUAGE plpgsql;
