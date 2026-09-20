// ============================================
// Smart Farm OS — Crop Guidance Type Definitions
// ============================================

/** Season classification for Indian crops */
export type CropSeason = 'kharif' | 'rabi' | 'zaid' | 'perennial'

/** Broad category of the crop */
export type CropCategory =
  | 'cereal'
  | 'pulse'
  | 'oilseed'
  | 'cashcrop'
  | 'vegetable'
  | 'spice'
  | 'fruit'
  | 'plantation'

/** A single step in the crop lifecycle */
export interface LifecycleStage {
  stage: string
  title: string
  icon: string          // Lucide icon name
  durationDays: string  // e.g. "15-20 days"
  description: string
  keyActions: string[]
  proTips: string[]
}

/** Pest entry with control measures */
export interface PestEntry {
  name: string
  affectedStage: string
  symptoms: string[]
  chemicalControl: string[]
  organicControl: string[]
  severity: 'low' | 'medium' | 'high'
}

/** Disease entry with control measures */
export interface DiseaseEntry {
  name: string
  causalAgent: string
  affectedStage: string
  symptoms: string[]
  chemicalControl: string[]
  organicControl: string[]
  severity: 'low' | 'medium' | 'high'
}

/** AI Specialist persona for each crop */
export interface SpecialistPersona {
  name: string
  title: string
  institution: string
  region: string
  expertise: string
  avatarInitials: string
}

/** Color scheme for visual differentiation */
export interface CropColorScheme {
  primary: string    // Tailwind color class e.g. 'amber'
  gradient: string   // Tailwind gradient classes
  glow: string       // Custom box-shadow glow
  badge: string      // Badge CSS class
  iconBg: string     // Icon background class
  iconColor: string  // Icon color class
}

/** Fertilizer schedule entry */
export interface FertilizerSchedule {
  stage: string
  timing: string
  fertilizer: string
  dosePerAcre: string
  method: string
}

/** Irrigation schedule entry */
export interface IrrigationSchedule {
  stage: string
  frequency: string
  waterPerAcre: string
  criticalNote: string
}

/** Complete crop entry with all agronomic details */
export interface CropEntry {
  // Identity
  slug: string
  name: string
  hindiName: string
  emoji: string
  category: CropCategory
  season: CropSeason
  seasonLabel: string  // Display string: "Kharif (June–October)"

  // Quick stats
  durationDays: [number, number]
  suitableStates: string[]
  suitableSoils: string[]
  temperatureRange: string   // e.g. "20–25°C"
  waterRequirement: string   // e.g. "450–650 mm"
  seedRatePerAcre: string    // e.g. "40–50 kg"
  spacing: string            // e.g. "22.5 cm × 10 cm"
  expectedYield: { min: number; max: number; unit: string }
  msp2024: number | null     // Minimum Support Price in ₹/quintal

  // Visuals
  colorScheme: CropColorScheme

  // Detailed agronomic data
  varieties: { name: string; type: string; note: string }[]
  lifecycle: LifecycleStage[]
  fertilizerSchedule: FertilizerSchedule[]
  irrigationSchedule: IrrigationSchedule[]
  pests: PestEntry[]
  diseases: DiseaseEntry[]

  // AI specialist
  specialistPersona: SpecialistPersona
  researchContext: string   // Rich text injected into Gemini system instruction

  // Citations
  icarRef: string
  sources: string[]
}

/** Filter state for the crop catalog */
export interface CropFilters {
  search: string
  season: CropSeason | 'all'
  category: CropCategory | 'all'
}

/** Props for the specialist chat widget */
export interface CropChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  ragSourceCount?: number
}
