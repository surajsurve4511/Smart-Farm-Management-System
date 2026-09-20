-- ============================================
-- Smart Farm OS — Complete Database Schema
-- Execute in Supabase SQL Editor
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- 1. FARMER PROFILES (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.farmer_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    village TEXT,
    district TEXT,
    state TEXT DEFAULT 'Maharashtra',
    aadhar_last_four TEXT,
    land_holding_acres NUMERIC,
    farming_type TEXT DEFAULT 'mixed',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. FARMS & PLOTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location_lat NUMERIC,
    location_lng NUMERIC,
    total_area_acres NUMERIC,
    soil_type TEXT,
    water_source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.plots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
    farmer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    area_acres NUMERIC,
    current_crop TEXT,
    crop_stage TEXT,
    sowing_date DATE,
    expected_harvest_date DATE,
    boundary_geojson JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. DAILY LOGS (with images + vectors)
-- ============================================
CREATE TABLE IF NOT EXISTS public.daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plot_id UUID REFERENCES public.plots(id) ON DELETE CASCADE,
    farmer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date DATE DEFAULT CURRENT_DATE,
    weather_condition TEXT,
    temperature_celsius NUMERIC,
    humidity_percentage NUMERIC,
    soil_moisture_percentage NUMERIC,
    rainfall_mm NUMERIC,
    pest_observed BOOLEAN DEFAULT FALSE,
    pest_description TEXT,
    disease_observed BOOLEAN DEFAULT FALSE,
    disease_description TEXT,
    activities_performed TEXT[],
    notes TEXT,
    ai_analysis TEXT,
    ai_recommendations TEXT[],
    image_urls TEXT[],
    embedding VECTOR(768),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. LIVESTOCK
-- ============================================
CREATE TABLE IF NOT EXISTS public.livestock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    animal_type TEXT NOT NULL,
    breed TEXT,
    count INTEGER DEFAULT 1,
    age_months INTEGER,
    health_status TEXT DEFAULT 'healthy',
    purchase_price NUMERIC,
    current_market_rate NUMERIC,
    milk_yield_liters_per_day NUMERIC,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. INVENTORY
-- ============================================
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL,
    item_name TEXT NOT NULL,
    quantity NUMERIC,
    unit TEXT,
    purchase_price NUMERIC,
    storage_location TEXT,
    expiry_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. SCHEMES
-- ============================================
CREATE TABLE IF NOT EXISTS public.schemes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    scheme_type TEXT NOT NULL,
    category TEXT,
    provider TEXT,
    eligibility_criteria JSONB,
    benefit_amount TEXT,
    application_url TEXT,
    deadline DATE,
    is_active BOOLEAN DEFAULT TRUE,
    source_url TEXT,
    last_verified TIMESTAMPTZ DEFAULT NOW(),
    embedding VECTOR(768),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. CHAT
-- ============================================
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    image_urls TEXT[],
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. MARKET PRICE CACHE
-- ============================================
CREATE TABLE IF NOT EXISTS public.market_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commodity TEXT NOT NULL,
    variety TEXT,
    market_name TEXT,
    district TEXT,
    state TEXT,
    min_price NUMERIC,
    max_price NUMERIC,
    modal_price NUMERIC,
    price_date DATE,
    fetched_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RLS POLICIES
-- ============================================
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.livestock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;

-- Farmer-owned tables: users manage their own data
CREATE POLICY "farmer_profiles_policy" ON public.farmer_profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "farms_policy" ON public.farms FOR ALL USING (auth.uid() = farmer_id) WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "plots_policy" ON public.plots FOR ALL USING (auth.uid() = farmer_id) WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "daily_logs_policy" ON public.daily_logs FOR ALL USING (auth.uid() = farmer_id) WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "livestock_policy" ON public.livestock FOR ALL USING (auth.uid() = farmer_id) WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "inventory_policy" ON public.inventory FOR ALL USING (auth.uid() = farmer_id) WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "chat_sessions_policy" ON public.chat_sessions FOR ALL USING (auth.uid() = farmer_id) WITH CHECK (auth.uid() = farmer_id);

-- Chat messages: access via session ownership
CREATE POLICY "chat_messages_policy" ON public.chat_messages
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.chat_sessions WHERE id = chat_messages.session_id AND farmer_id = auth.uid())
    )
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.chat_sessions WHERE id = chat_messages.session_id AND farmer_id = auth.uid())
    );

-- Schemes: public read
CREATE POLICY "schemes_read_policy" ON public.schemes FOR SELECT USING (true);

-- ============================================
-- VECTOR SEARCH FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION match_daily_logs(
    query_embedding VECTOR(768),
    match_threshold FLOAT,
    match_count INT,
    p_farmer_id UUID
) RETURNS TABLE (
    id UUID, plot_name TEXT, notes TEXT, ai_analysis TEXT,
    log_date DATE, similarity FLOAT
) LANGUAGE sql STABLE AS $$
    SELECT dl.id, COALESCE(p.name, 'Unknown Plot') as plot_name, dl.notes, dl.ai_analysis,
           dl.log_date, 1 - (dl.embedding <=> query_embedding) as similarity
    FROM daily_logs dl
    LEFT JOIN plots p ON dl.plot_id = p.id
    WHERE dl.farmer_id = p_farmer_id
      AND dl.embedding IS NOT NULL
      AND 1 - (dl.embedding <=> query_embedding) > match_threshold
    ORDER BY dl.embedding <=> query_embedding
    LIMIT match_count;
$$;

CREATE OR REPLACE FUNCTION match_schemes(
    query_embedding VECTOR(768),
    match_count INT
) RETURNS TABLE (
    id UUID, title TEXT, description TEXT, scheme_type TEXT,
    provider TEXT, benefit_amount TEXT, similarity FLOAT
) LANGUAGE sql STABLE AS $$
    SELECT s.id, s.title, s.description, s.scheme_type,
           s.provider, s.benefit_amount,
           1 - (s.embedding <=> query_embedding) as similarity
    FROM schemes s
    WHERE s.is_active = true
      AND s.embedding IS NOT NULL
    ORDER BY s.embedding <=> query_embedding
    LIMIT match_count;
$$;

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_daily_logs_farmer ON public.daily_logs(farmer_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_plot ON public.daily_logs(plot_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON public.daily_logs(log_date DESC);
CREATE INDEX IF NOT EXISTS idx_plots_farm ON public.plots(farm_id);
CREATE INDEX IF NOT EXISTS idx_plots_farmer ON public.plots(farmer_id);
CREATE INDEX IF NOT EXISTS idx_farms_farmer ON public.farms(farmer_id);
CREATE INDEX IF NOT EXISTS idx_livestock_farmer ON public.livestock(farmer_id);
CREATE INDEX IF NOT EXISTS idx_inventory_farmer ON public.inventory(farmer_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_farmer ON public.chat_sessions(farmer_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_schemes_active ON public.schemes(is_active) WHERE is_active = true;

-- Vector indexes (IVFFlat for faster similarity search)
-- Note: These require at least some data in the table to build
-- CREATE INDEX IF NOT EXISTS idx_daily_logs_embedding ON public.daily_logs USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
-- CREATE INDEX IF NOT EXISTS idx_schemes_embedding ON public.schemes USING ivfflat (embedding vector_cosine_ops) WITH (lists = 50);

-- ============================================
-- 9. CROP KNOWLEDGE BASE
-- ============================================
CREATE TABLE IF NOT EXISTS public.crop_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    hindi_name TEXT,
    regional_names JSONB DEFAULT '{}',
    season TEXT NOT NULL,  -- kharif, rabi, zaid, perennial
    category TEXT NOT NULL,  -- cereal, pulse, oilseed, cashcrop, vegetable, spice, fruit
    duration_days_min INTEGER,
    duration_days_max INTEGER,
    suitable_states TEXT[],
    suitable_soils TEXT[],
    climate_zone TEXT,
    temperature_range TEXT,
    water_requirement TEXT,
    seed_rate_per_acre TEXT,
    spacing TEXT,
    expected_yield_min NUMERIC,
    expected_yield_max NUMERIC,
    yield_unit TEXT DEFAULT 'qtl/acre',
    msp_2024 NUMERIC,
    varieties JSONB DEFAULT '[]',
    lifecycle JSONB DEFAULT '[]',
    fertilizer_schedule JSONB DEFAULT '[]',
    irrigation_schedule JSONB DEFAULT '[]',
    common_pests JSONB DEFAULT '[]',
    common_diseases JSONB DEFAULT '[]',
    specialist_persona JSONB,
    research_context TEXT,
    icar_ref TEXT,
    sources TEXT[],
    embedding VECTOR(768),
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. CROP RESEARCH EMBEDDINGS (chunked research snippets for RAG)
-- ============================================
CREATE TABLE IF NOT EXISTS public.crop_research_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_slug TEXT NOT NULL REFERENCES public.crop_knowledge(slug) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,
    source TEXT,  -- e.g. "ICAR Bulletin 2023", "PAU Field Trial Report"
    embedding VECTOR(768) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for crop tables
ALTER TABLE public.crop_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_research_embeddings ENABLE ROW LEVEL SECURITY;

-- Public read access for all authenticated users
CREATE POLICY "crop_knowledge_read_policy" ON public.crop_knowledge
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "crop_research_read_policy" ON public.crop_research_embeddings
    FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================
-- CROP RESEARCH VECTOR SEARCH
-- ============================================
CREATE OR REPLACE FUNCTION match_crop_research(
    query_embedding VECTOR(768),
    p_crop_slug TEXT,
    match_count INT
) RETURNS TABLE (
    id UUID, chunk_text TEXT, source TEXT, similarity FLOAT
) LANGUAGE sql STABLE AS $$
    SELECT cre.id, cre.chunk_text, cre.source,
           1 - (cre.embedding <=> query_embedding) as similarity
    FROM crop_research_embeddings cre
    WHERE cre.crop_slug = p_crop_slug
      AND cre.embedding IS NOT NULL
    ORDER BY cre.embedding <=> query_embedding
    LIMIT match_count;
$$;

-- Indexes for crop tables
CREATE INDEX IF NOT EXISTS idx_crop_knowledge_slug ON public.crop_knowledge(slug);
CREATE INDEX IF NOT EXISTS idx_crop_knowledge_season ON public.crop_knowledge(season);
CREATE INDEX IF NOT EXISTS idx_crop_knowledge_category ON public.crop_knowledge(category);
CREATE INDEX IF NOT EXISTS idx_crop_research_slug ON public.crop_research_embeddings(crop_slug);

-- Vector index for crop research (requires data)
-- CREATE INDEX IF NOT EXISTS idx_crop_research_embedding ON public.crop_research_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 50);
-- CREATE INDEX IF NOT EXISTS idx_crop_knowledge_embedding ON public.crop_knowledge USING ivfflat (embedding vector_cosine_ops) WITH (lists = 20);
