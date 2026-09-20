// ============================================
// Smart Farm OS — TypeScript Type Definitions
// ============================================

// Database row types (matching Supabase schema)

export interface FarmerProfile {
  id: string
  full_name: string
  phone: string | null
  village: string | null
  district: string | null
  state: string
  aadhar_last_four: string | null
  land_holding_acres: number | null
  farming_type: 'organic' | 'conventional' | 'mixed'
  created_at: string
  updated_at: string
}

export interface Farm {
  id: string
  farmer_id: string
  name: string
  location_lat: number | null
  location_lng: number | null
  total_area_acres: number | null
  soil_type: string | null
  water_source: string | null
  created_at: string
}

export interface Plot {
  id: string
  farm_id: string
  farmer_id: string
  name: string
  area_acres: number | null
  current_crop: string | null
  crop_stage: CropStage | null
  sowing_date: string | null
  expected_harvest_date: string | null
  boundary_geojson: GeoJSONPolygon | null
  created_at: string
}

export type CropStage = 'sowing' | 'germination' | 'vegetative' | 'flowering' | 'fruiting' | 'harvesting' | 'fallow'

export interface GeoJSONPolygon {
  type: 'Polygon'
  coordinates: number[][][]
}

export interface DailyLog {
  id: string
  plot_id: string
  farmer_id: string
  log_date: string
  weather_condition: string | null
  temperature_celsius: number | null
  humidity_percentage: number | null
  soil_moisture_percentage: number | null
  rainfall_mm: number | null
  pest_observed: boolean
  pest_description: string | null
  disease_observed: boolean
  disease_description: string | null
  activities_performed: string[] | null
  notes: string | null
  ai_analysis: string | null
  ai_recommendations: string[] | null
  image_urls: string[] | null
  embedding: number[] | null
  created_at: string
}

export interface Livestock {
  id: string
  farmer_id: string
  animal_type: AnimalType
  breed: string | null
  count: number
  age_months: number | null
  health_status: 'healthy' | 'sick' | 'under_treatment'
  purchase_price: number | null
  current_market_rate: number | null
  milk_yield_liters_per_day: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type AnimalType = 'cow' | 'buffalo' | 'goat' | 'sheep' | 'poultry' | 'pig' | 'horse' | 'other'

export interface InventoryItem {
  id: string
  farmer_id: string
  item_type: InventoryType
  item_name: string
  quantity: number | null
  unit: string | null
  purchase_price: number | null
  storage_location: string | null
  expiry_date: string | null
  created_at: string
}

export type InventoryType = 'seed' | 'fertilizer' | 'pesticide' | 'harvest' | 'equipment' | 'feed'

export interface Scheme {
  id: string
  title: string
  description: string | null
  scheme_type: SchemeType
  category: SchemeCategory | null
  provider: string | null
  eligibility_criteria: SchemeEligibility | null
  benefit_amount: string | null
  application_url: string | null
  deadline: string | null
  is_active: boolean
  source_url: string | null
  last_verified: string
  embedding: number[] | null
  created_at: string
}

export type SchemeType = 'government' | 'private' | 'ngo' | 'bank'
export type SchemeCategory = 'subsidy' | 'loan' | 'insurance' | 'training' | 'equipment' | 'market_access'

export interface SchemeEligibility {
  land_max_acres?: number
  states?: string[]
  farming_type?: string
  min_age?: number
  max_age?: number
  gender?: string
}

export interface ChatSession {
  id: string
  farmer_id: string
  title: string | null
  created_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  image_urls: string[] | null
  metadata: ChatMetadata | null
  created_at: string
}

export interface ChatMetadata {
  model?: string
  rag_context_used?: boolean
  tokens?: number
  sources?: { plot_name: string; log_date: string; similarity: number }[]
}

export interface MarketPrice {
  id: string
  commodity: string
  variety: string | null
  market_name: string | null
  district: string | null
  state: string | null
  min_price: number | null
  max_price: number | null
  modal_price: number | null
  price_date: string | null
  fetched_at: string
}

// API Response types

export interface MandiRecord {
  state: string
  district: string
  market: string
  commodity: string
  variety: string
  arrival_date: string
  min_price: string
  max_price: string
  modal_price: string
}

export interface WeatherData {
  temp: number
  humidity: number
  description: string
  icon: string
  wind_speed: number
  rain_mm: number
  city: string
}

export interface AIAnalysisResult {
  health_score: number
  disease_detected: boolean
  disease_name: string | null
  severity: 'none' | 'low' | 'medium' | 'high' | 'critical'
  treatment: string[]
  recommendations: string[]
  confidence: number
}

export interface YieldPrediction {
  plot_name: string
  crop: string
  predicted_yield_tonnes: number
  confidence_percentage: number
  factors: string[]
  revenue_estimate: number
  comparison_last_season: string
}

export interface VectorSearchResult {
  id: string
  plot_name: string
  notes: string
  ai_analysis: string | null
  log_date: string
  similarity: number
}
