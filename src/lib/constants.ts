// ============================================
// Smart Farm OS — App-wide Constants
// ============================================

export const APP_NAME = 'Smart Farm OS'
export const APP_TAGLINE = 'The Intelligence Layer for Indian Agriculture'

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
] as const

export const CROP_TYPES = [
  // Cereals
  'Rice', 'Wheat', 'Maize', 'Bajra (Pearl Millet)', 'Jowar (Sorghum)', 'Ragi (Finger Millet)', 'Barley',
  // Pulses
  'Chana (Chickpea)', 'Tur (Pigeon Pea)', 'Moong (Green Gram)', 'Urad (Black Gram)', 'Masoor (Lentil)',
  // Oilseeds
  'Soybean', 'Groundnut', 'Mustard', 'Sunflower', 'Sesame', 'Castor',
  // Cash Crops
  'Sugarcane', 'Cotton', 'Jute', 'Tobacco',
  // Spices
  'Turmeric', 'Chili', 'Ginger', 'Coriander', 'Cumin', 'Black Pepper',
  // Fruits
  'Mango', 'Banana', 'Grape', 'Pomegranate', 'Orange', 'Apple', 'Papaya', 'Guava', 'Watermelon',
  // Vegetables
  'Tomato', 'Onion', 'Potato', 'Brinjal', 'Cauliflower', 'Cabbage', 'Okra (Bhindi)', 'Spinach',
  'Green Peas', 'Carrot', 'Bottle Gourd', 'Bitter Gourd',
  // Plantation
  'Tea', 'Coffee', 'Coconut', 'Arecanut', 'Rubber',
  // Other
  'Other'
] as const

export const CROP_STAGES = [
  { value: 'sowing', label: 'Sowing / Planting', color: 'amber' },
  { value: 'germination', label: 'Germination', color: 'lime' },
  { value: 'vegetative', label: 'Vegetative Growth', color: 'green' },
  { value: 'flowering', label: 'Flowering', color: 'pink' },
  { value: 'fruiting', label: 'Fruiting / Grain Filling', color: 'orange' },
  { value: 'harvesting', label: 'Harvesting', color: 'yellow' },
  { value: 'fallow', label: 'Fallow', color: 'slate' },
] as const

export const SOIL_TYPES = [
  'Alluvial', 'Black (Regur)', 'Red', 'Laterite', 'Desert (Arid)',
  'Mountain (Forest)', 'Saline & Alkaline', 'Peaty & Marshy', 'Clay', 'Sandy', 'Loamy', 'Silt'
] as const

export const WATER_SOURCES = [
  'Borewell', 'Open Well', 'Canal', 'River', 'Rainfed', 'Tank / Pond',
  'Drip Irrigation', 'Sprinkler', 'Check Dam', 'Other'
] as const

export const ANIMAL_TYPES = [
  { value: 'cow', label: 'Cow', emoji: '🐄' },
  { value: 'buffalo', label: 'Buffalo', emoji: '🐃' },
  { value: 'goat', label: 'Goat', emoji: '🐐' },
  { value: 'sheep', label: 'Sheep', emoji: '🐑' },
  { value: 'poultry', label: 'Poultry', emoji: '🐔' },
  { value: 'pig', label: 'Pig', emoji: '🐷' },
  { value: 'horse', label: 'Horse', emoji: '🐴' },
  { value: 'other', label: 'Other', emoji: '🐾' },
] as const

export const ANIMAL_BREEDS: Record<string, string[]> = {
  cow: ['Gir', 'Sahiwal', 'Red Sindhi', 'Tharparkar', 'Rathi', 'Kankrej', 'Ongole', 'Holstein Friesian', 'Jersey', 'Crossbred', 'Other'],
  buffalo: ['Murrah', 'Mehsana', 'Jaffarabadi', 'Surti', 'Nili-Ravi', 'Bhadawari', 'Other'],
  goat: ['Jamunapari', 'Barbari', 'Beetal', 'Sirohi', 'Osmanabadi', 'Black Bengal', 'Other'],
  sheep: ['Merino', 'Rambouillet', 'Nellore', 'Deccani', 'Marwari', 'Corriedale', 'Other'],
  poultry: ['Desi', 'Broiler', 'Layer', 'Kadaknath', 'Aseel', 'Other'],
  pig: ['Large White Yorkshire', 'Landrace', 'Hampshire', 'Desi', 'Other'],
  horse: ['Marwari', 'Kathiawari', 'Thoroughbred', 'Other'],
  other: ['Other'],
}

export const FARM_ACTIVITIES = [
  'Irrigation', 'Fertilizer Application', 'Pesticide Spraying', 'Weeding',
  'Pruning', 'Harvesting', 'Ploughing', 'Sowing', 'Transplanting',
  'Soil Testing', 'Mulching', 'Crop Rotation', 'Inter-cropping',
  'Organic Composting', 'Livestock Feeding', 'Veterinary Visit',
  'Equipment Maintenance', 'Market Visit', 'Other'
] as const

export const INVENTORY_TYPES = [
  { value: 'seed', label: 'Seeds', icon: 'Sprout', color: 'emerald' },
  { value: 'fertilizer', label: 'Fertilizers', icon: 'FlaskConical', color: 'blue' },
  { value: 'pesticide', label: 'Pesticides', icon: 'Bug', color: 'red' },
  { value: 'harvest', label: 'Harvested Crops', icon: 'Wheat', color: 'amber' },
  { value: 'equipment', label: 'Equipment', icon: 'Wrench', color: 'slate' },
  { value: 'feed', label: 'Animal Feed', icon: 'Package', color: 'orange' },
] as const

export const SCHEME_CATEGORIES = [
  { value: 'subsidy', label: 'Subsidies', icon: 'IndianRupee', color: 'emerald' },
  { value: 'loan', label: 'Loans', icon: 'Landmark', color: 'blue' },
  { value: 'insurance', label: 'Insurance', icon: 'Shield', color: 'purple' },
  { value: 'training', label: 'Training', icon: 'GraduationCap', color: 'cyan' },
  { value: 'equipment', label: 'Equipment', icon: 'Tractor', color: 'orange' },
  { value: 'market_access', label: 'Market Access', icon: 'Store', color: 'pink' },
] as const

export const WEATHER_ICONS: Record<string, string> = {
  'clear sky': '☀️',
  'few clouds': '🌤️',
  'scattered clouds': '⛅',
  'broken clouds': '☁️',
  'overcast clouds': '☁️',
  'shower rain': '🌧️',
  'rain': '🌧️',
  'light rain': '🌦️',
  'thunderstorm': '⛈️',
  'snow': '❄️',
  'mist': '🌫️',
  'haze': '🌫️',
  'fog': '🌫️',
}

// Livestock average market rates (INR) — baseline estimates
export const LIVESTOCK_BASE_RATES: Record<string, number> = {
  cow: 45000,
  buffalo: 65000,
  goat: 8000,
  sheep: 6000,
  poultry: 250,
  pig: 12000,
  horse: 80000,
  other: 10000,
}

// API endpoints
export const API_ENDPOINTS = {
  MANDI_PRICES: 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070',
  WEATHER: 'https://api.openweathermap.org/data/2.5/weather',
} as const

// Gemini models
export const GEMINI_MODELS = {
  CHAT: 'gemini-2.5-flash',
  EMBEDDING: 'text-embedding-004',
  VISION: 'gemini-2.5-flash',
} as const

export const EMBEDDING_DIMENSIONS = 768

// Navigation items for sidebar
export const NAV_ITEMS = [
  {
    group: 'Core Modules',
    color: 'emerald',
    items: [
      { href: '/dashboard', label: 'Command Center', icon: 'LayoutDashboard' },
      { href: '/dashboard/farms', label: 'My Farms', icon: 'MapPinned' },
      { href: '/dashboard/daily-log', label: 'Daily Log', icon: 'CalendarPlus' },
      { href: '/dashboard/ai-chat', label: 'AI Agronomist', icon: 'Bot' },
    ]
  },
  {
    group: 'Intelligence',
    color: 'cyan',
    items: [
      { href: '/dashboard/market', label: 'Market Prices', icon: 'TrendingUp' },
      { href: '/dashboard/yield', label: 'Yield Prediction', icon: 'BarChart3' },
      { href: '/dashboard/crop-guidance', label: 'Crop Guidance', icon: 'Sprout' },
      { href: '/dashboard/schemes', label: 'Govt Schemes', icon: 'Landmark' },
    ]
  },
  {
    group: 'Assets',
    color: 'amber',
    items: [
      { href: '/dashboard/livestock', label: 'Livestock', icon: 'PawPrint' },
      { href: '/dashboard/inventory', label: 'Inventory', icon: 'Package' },
    ]
  },
  {
    group: 'AI Lab',
    color: 'purple',
    items: [
      { href: '/dashboard/ai-video', label: 'Video Diagnosis', icon: 'Video' },
    ]
  },
  {
    group: 'System',
    color: 'slate',
    items: [
      { href: '/dashboard/settings', label: 'Settings', icon: 'Settings' },
    ]
  },
] as const
