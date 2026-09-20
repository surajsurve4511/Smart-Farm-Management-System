// ============================================
// Smart Farm OS — Crop Database & Utility Functions
// ============================================

import type {
  CropEntry,
  CropSeason,
  CropCategory,
} from './cropTypes'

// ============================================
// 12-Crop Database — ICAR-aligned data
// ============================================

export const CROP_DATABASE: CropEntry[] = [
  // ——— KHARIF CROPS ———
  {
    slug: 'rice',
    name: 'Rice',
    hindiName: 'धान (Dhan)',
    emoji: '🌾',
    category: 'cereal',
    season: 'kharif',
    seasonLabel: 'Kharif (June–October)',
    durationDays: [120, 150],
    suitableStates: ['Punjab', 'Haryana', 'UP', 'West Bengal', 'Andhra Pradesh'],
    suitableSoils: ['Clay loam', 'Silt clay', 'Alluvial'],
    temperatureRange: '20–37°C',
    waterRequirement: '1200–1400 mm',
    seedRatePerAcre: '20–25 kg',
    spacing: '20 cm × 15 cm',
    expectedYield: { min: 20, max: 30, unit: 'qtl/acre' },
    msp2024: 2300,
    colorScheme: {
      primary: 'amber',
      gradient: 'from-amber-500/20 to-yellow-500/10',
      glow: '0 0 20px rgba(245, 158, 11, 0.15)',
      badge: 'badge-amber',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
    },
    varieties: [
      { name: 'Pusa Basmati 1121', type: 'Basmati', note: 'Extra-long grain, high export value' },
      { name: 'IR-64', type: 'Non-Basmati', note: 'High yielding, medium duration' },
      { name: 'Swarna (MTU 7029)', type: 'Non-Basmati', note: 'Widely adapted, good grain quality' },
    ],
    lifecycle: [
      { stage: '1', title: 'Nursery', icon: 'Sprout', durationDays: '20-25 days', description: 'Seed treatment and nursery bed preparation', keyActions: ['Seed treatment with Carbendazim', 'Prepare raised nursery beds', 'Maintain 2-3 cm standing water'], proTips: ['Use mat nursery for mechanical transplanting'] },
      { stage: '2', title: 'Transplanting', icon: 'ArrowDownToLine', durationDays: '1-5 days', description: 'Transplant 20-25 day old seedlings', keyActions: ['Puddle main field', 'Transplant 2-3 seedlings per hill', 'Maintain 20×15 cm spacing'], proTips: ['Transplant in evening for better survival'] },
      { stage: '3', title: 'Vegetative', icon: 'Leaf', durationDays: '40-50 days', description: 'Tillering and vegetative growth phase', keyActions: ['Apply N fertilizer in splits', 'Maintain 5 cm water level', 'Weed management at 20 DAT'], proTips: ['Use leaf color chart for N management'] },
      { stage: '4', title: 'Reproductive', icon: 'Flower2', durationDays: '30-35 days', description: 'Panicle initiation to flowering', keyActions: ['Apply final N dose', 'Monitor for blast disease', 'Maintain adequate water'], proTips: ['Drain field 15 days before harvest'] },
      { stage: '5', title: 'Harvest', icon: 'Scissors', durationDays: '5-7 days', description: 'Harvest at 80% grain maturity', keyActions: ['Harvest when grains are golden', 'Dry to 14% moisture', 'Thresh within 24 hours'], proTips: ['Use combine harvester for Basmati'] },
    ],
    fertilizerSchedule: [
      { stage: 'Basal', timing: 'At transplanting', fertilizer: 'DAP + MOP', dosePerAcre: '50 kg DAP + 25 kg MOP', method: 'Broadcasting before puddling' },
      { stage: 'First Top Dress', timing: '21 DAT', fertilizer: 'Urea', dosePerAcre: '35 kg', method: 'Broadcasting in standing water' },
      { stage: 'Second Top Dress', timing: '42 DAT', fertilizer: 'Urea', dosePerAcre: '35 kg', method: 'Broadcasting' },
    ],
    irrigationSchedule: [
      { stage: 'Transplanting', frequency: 'Continuous', waterPerAcre: '5 cm standing', criticalNote: 'Maintain thin layer for establishment' },
      { stage: 'Tillering', frequency: 'Continuous', waterPerAcre: '5 cm standing', criticalNote: 'Alternate wetting and drying possible' },
      { stage: 'Flowering', frequency: 'Continuous', waterPerAcre: '5 cm standing', criticalNote: 'Most critical — never let field dry' },
    ],
    pests: [
      { name: 'Stem Borer', affectedStage: 'Vegetative-Reproductive', symptoms: ['Dead hearts in vegetative stage', 'White ears at flowering'], chemicalControl: ['Cartap Hydrochloride 4G'], organicControl: ['Trichogramma egg parasitoid release'], severity: 'high' },
      { name: 'Brown Plant Hopper', affectedStage: 'Reproductive', symptoms: ['Hopper burn', 'Circular drying patches'], chemicalControl: ['Pymetrozine 50 WG'], organicControl: ['Conserve spider predators'], severity: 'high' },
    ],
    diseases: [
      { name: 'Blast', causalAgent: 'Magnaporthe oryzae', affectedStage: 'All stages', symptoms: ['Diamond-shaped lesions on leaves', 'Neck rot'], chemicalControl: ['Tricyclazole 75 WP'], organicControl: ['Use resistant varieties', 'Avoid excess nitrogen'], severity: 'high' },
    ],
    specialistPersona: {
      name: 'Dr. Ananya Sharma',
      title: 'Senior Rice Scientist',
      institution: 'ICAR-IRRI, Hyderabad',
      region: 'Telangana & Andhra Pradesh',
      expertise: 'Basmati cultivation, water-saving technologies',
      avatarInitials: 'AS',
    },
    researchContext: 'Expert in System of Rice Intensification (SRI) and Direct Seeded Rice (DSR).',
    icarRef: 'ICAR-IIRR Technical Bulletin No. 89',
    sources: ['ICAR-Indian Institute of Rice Research', 'DRR Annual Report 2024'],
  },
  {
    slug: 'cotton',
    name: 'Cotton',
    hindiName: 'कपास (Kapas)',
    emoji: '🏵️',
    category: 'cashcrop',
    season: 'kharif',
    seasonLabel: 'Kharif (June–October)',
    durationDays: [150, 180],
    suitableStates: ['Gujarat', 'Maharashtra', 'Telangana', 'Rajasthan', 'MP'],
    suitableSoils: ['Black cotton soil', 'Deep clay loam', 'Alluvial'],
    temperatureRange: '21–35°C',
    waterRequirement: '700–1200 mm',
    seedRatePerAcre: '1.5–2.0 kg (Bt hybrid)',
    spacing: '90 cm × 60 cm',
    expectedYield: { min: 8, max: 12, unit: 'qtl/acre' },
    msp2024: 7121,
    colorScheme: {
      primary: 'pink',
      gradient: 'from-pink-500/20 to-rose-500/10',
      glow: '0 0 20px rgba(236, 72, 153, 0.15)',
      badge: 'badge-amber',
      iconBg: 'bg-pink-500/10',
      iconColor: 'text-pink-400',
    },
    varieties: [
      { name: 'Bt Cotton (Bollgard II)', type: 'Hybrid', note: 'Bollworm resistant, 90% adoption' },
      { name: 'Suraj', type: 'Non-Bt', note: 'Organic farming suitable' },
      { name: 'NH-615', type: 'Hybrid', note: 'High ginning percentage' },
    ],
    lifecycle: [
      { stage: '1', title: 'Sowing', icon: 'Sprout', durationDays: '1-5 days', description: 'Sow Bt cotton with onset of monsoon', keyActions: ['Sow on raised beds', 'Use treated seeds', 'Maintain 90×60 cm spacing'], proTips: ['Sow refuge rows (non-Bt) for resistance management'] },
      { stage: '2', title: 'Vegetative', icon: 'Leaf', durationDays: '45-60 days', description: 'Vigorous vegetative growth phase', keyActions: ['Thinning at 15 days', 'First N dose at 30 days', 'Inter-cultivation'], proTips: ['Nip terminal growing point at 90 days'] },
      { stage: '3', title: 'Flowering', icon: 'Flower2', durationDays: '30-40 days', description: 'Square and boll formation', keyActions: ['Apply K fertilizer', 'Monitor for bollworms', 'Spray growth regulators'], proTips: ['Use pheromone traps for bollworm monitoring'] },
      { stage: '4', title: 'Boll Development', icon: 'Circle', durationDays: '40-50 days', description: 'Boll maturation and opening', keyActions: ['Last irrigation before harvest', 'Defoliant spray if needed', 'Monitor whitefly'], proTips: ['Pick bolls in 3-4 rounds'] },
      { stage: '5', title: 'Harvest', icon: 'Scissors', durationDays: '20-30 days', description: 'Pick opened bolls in multiple rounds', keyActions: ['Pick only fully opened bolls', 'Grade by quality', 'Store at <10% moisture'], proTips: ['Early morning picking gives cleaner lint'] },
    ],
    fertilizerSchedule: [
      { stage: 'Basal', timing: 'At sowing', fertilizer: 'DAP + SSP', dosePerAcre: '50 kg DAP', method: 'Band placement' },
      { stage: 'Top Dress 1', timing: '30 DAS', fertilizer: 'Urea', dosePerAcre: '40 kg', method: 'Side dressing' },
      { stage: 'Top Dress 2', timing: '60 DAS', fertilizer: 'Urea + MOP', dosePerAcre: '30 kg + 25 kg', method: 'Side dressing' },
    ],
    irrigationSchedule: [
      { stage: 'Sowing', frequency: 'Pre-sowing', waterPerAcre: 'Soil saturation', criticalNote: 'Sow on residual moisture after rain' },
      { stage: 'Flowering', frequency: 'Every 12-15 days', waterPerAcre: '5 cm', criticalNote: 'Most critical period for irrigation' },
      { stage: 'Boll Development', frequency: 'Every 15-20 days', waterPerAcre: '5 cm', criticalNote: 'Stop 15 days before last picking' },
    ],
    pests: [
      { name: 'Pink Bollworm', affectedStage: 'Flowering-Boll', symptoms: ['Rosetted flowers', 'Damaged bolls with pink larvae'], chemicalControl: ['Profenophos 50 EC'], organicControl: ['Pheromone traps', 'Mass trapping'], severity: 'high' },
      { name: 'Whitefly', affectedStage: 'All stages', symptoms: ['Sooty mould on leaves', 'Leaf curl'], chemicalControl: ['Diafenthiuron 50 WP'], organicControl: ['Neem oil spray', 'Yellow sticky traps'], severity: 'medium' },
    ],
    diseases: [
      { name: 'Bacterial Blight', causalAgent: 'Xanthomonas citri pv. malvacearum', affectedStage: 'Vegetative', symptoms: ['Angular leaf spots', 'Black arm on stems'], chemicalControl: ['Streptocycline + Copper oxychloride'], organicControl: ['Use resistant varieties'], severity: 'medium' },
    ],
    specialistPersona: {
      name: 'Dr. Rajesh Patel',
      title: 'Principal Cotton Scientist',
      institution: 'CICR, Nagpur',
      region: 'Maharashtra & Gujarat',
      expertise: 'Bt cotton management, IPM in cotton',
      avatarInitials: 'RP',
    },
    researchContext: 'Expert in High-Density Planting System (HDPS) and organic cotton production.',
    icarRef: 'ICAR-CICR Technical Bulletin 2024',
    sources: ['Central Institute for Cotton Research', 'Cotton Advisory Board Reports'],
  },
  {
    slug: 'soybean',
    name: 'Soybean',
    hindiName: 'सोयाबीन (Soyabean)',
    emoji: '🫘',
    category: 'oilseed',
    season: 'kharif',
    seasonLabel: 'Kharif (June–October)',
    durationDays: [90, 120],
    suitableStates: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Karnataka'],
    suitableSoils: ['Black soil', 'Sandy loam', 'Clay loam'],
    temperatureRange: '26–30°C',
    waterRequirement: '450–700 mm',
    seedRatePerAcre: '30–35 kg',
    spacing: '30 cm × 10 cm',
    expectedYield: { min: 8, max: 12, unit: 'qtl/acre' },
    msp2024: 4892,
    colorScheme: {
      primary: 'lime',
      gradient: 'from-lime-500/20 to-green-500/10',
      glow: '0 0 20px rgba(132, 204, 22, 0.15)',
      badge: 'badge-amber',
      iconBg: 'bg-lime-500/10',
      iconColor: 'text-lime-400',
    },
    varieties: [
      { name: 'JS 9560', type: 'Medium duration', note: 'Most popular in MP' },
      { name: 'NRC 142', type: 'Early maturity', note: 'Rust resistant' },
      { name: 'MACS 1407', type: 'High yield', note: 'Good oil content' },
    ],
    lifecycle: [
      { stage: '1', title: 'Sowing', icon: 'Sprout', durationDays: '5-7 days', description: 'Sow with first monsoon rains', keyActions: ['Rhizobium seed inoculation', 'Sow at 3-4 cm depth', 'Row spacing 30 cm'], proTips: ['Treat seeds with Thiram + Carbendazim'] },
      { stage: '2', title: 'Vegetative', icon: 'Leaf', durationDays: '30-35 days', description: 'Rapid canopy development', keyActions: ['Weed management at 15-20 DAS', 'Inter-cultivation at 30 DAS'], proTips: ['One hand weeding saves 20% yield loss'] },
      { stage: '3', title: 'Flowering', icon: 'Flower2', durationDays: '15-20 days', description: 'Flowering and early pod formation', keyActions: ['Monitor for girdle beetle', 'Foliar spray of DAP 2%'], proTips: ['No irrigation during active flowering'] },
      { stage: '4', title: 'Pod Filling', icon: 'Circle', durationDays: '20-25 days', description: 'Pod filling and seed maturation', keyActions: ['Monitor for pod borer', 'One protective spray'], proTips: ['Harvest at physiological maturity for best quality'] },
      { stage: '5', title: 'Harvest', icon: 'Scissors', durationDays: '5-7 days', description: 'Harvest when 95% pods turn brown', keyActions: ['Harvest in morning hours', 'Thresh after drying', 'Grade seeds'], proTips: ['Delay of 1 week can reduce yield 5-10%'] },
    ],
    fertilizerSchedule: [
      { stage: 'Basal', timing: 'At sowing', fertilizer: 'DAP + SSP', dosePerAcre: '100 kg SSP + 20 kg Urea', method: 'Drill placement' },
      { stage: 'Foliar', timing: '45 DAS', fertilizer: 'DAP 2% spray', dosePerAcre: '2 kg in 100L water', method: 'Foliar spray' },
    ],
    irrigationSchedule: [
      { stage: 'Germination', frequency: 'At sowing', waterPerAcre: 'Soil moisture', criticalNote: 'Mostly rainfed crop' },
      { stage: 'Pod Filling', frequency: 'If dry spell >15 days', waterPerAcre: '4 cm', criticalNote: 'Critical stage for irrigation' },
    ],
    pests: [
      { name: 'Girdle Beetle', affectedStage: 'Vegetative', symptoms: ['Girdled stems', 'Drying of upper plant parts'], chemicalControl: ['Triazophos 40 EC'], organicControl: ['Deep summer ploughing', 'Crop rotation'], severity: 'medium' },
    ],
    diseases: [
      { name: 'Rust', causalAgent: 'Phakopsora pachyrhizi', affectedStage: 'Reproductive', symptoms: ['Tan to brown pustules on lower leaf surface'], chemicalControl: ['Hexaconazole 5 EC'], organicControl: ['Early sowing', 'Resistant varieties'], severity: 'high' },
    ],
    specialistPersona: {
      name: 'Dr. Meena Verma',
      title: 'Soybean Agronomist',
      institution: 'ICAR-IISR, Indore',
      region: 'Madhya Pradesh',
      expertise: 'Soybean agronomy, integrated nutrient management',
      avatarInitials: 'MV',
    },
    researchContext: 'Specialist in soybean-wheat cropping systems and climate-resilient varieties.',
    icarRef: 'ICAR-IISR Soybean Production Technology Bulletin',
    sources: ['Indian Institute of Soybean Research', 'SOPA Reports'],
  },
  // ——— RABI CROPS ———
  {
    slug: 'wheat',
    name: 'Wheat',
    hindiName: 'गेहूँ (Gehun)',
    emoji: '🌿',
    category: 'cereal',
    season: 'rabi',
    seasonLabel: 'Rabi (October–March)',
    durationDays: [120, 150],
    suitableStates: ['Punjab', 'Haryana', 'UP', 'MP', 'Rajasthan'],
    suitableSoils: ['Loamy', 'Clay loam', 'Alluvial'],
    temperatureRange: '15–25°C',
    waterRequirement: '450–650 mm',
    seedRatePerAcre: '40–50 kg',
    spacing: '22.5 cm × 10 cm',
    expectedYield: { min: 15, max: 20, unit: 'qtl/acre' },
    msp2024: 2275,
    colorScheme: {
      primary: 'cyan',
      gradient: 'from-cyan-500/20 to-blue-500/10',
      glow: '0 0 20px rgba(6, 182, 212, 0.15)',
      badge: 'badge-cyan',
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-400',
    },
    varieties: [
      { name: 'HD 3226', type: 'Bread wheat', note: 'High yield, timely sown' },
      { name: 'PBW 725', type: 'Bread wheat', note: 'Rust resistant, Punjab recommended' },
      { name: 'DBW 187', type: 'Bread wheat', note: 'Heat tolerant, late sowing' },
    ],
    lifecycle: [
      { stage: '1', title: 'Land Prep & Sowing', icon: 'Shovel', durationDays: '5-10 days', description: 'Fine seedbed preparation and sowing', keyActions: ['2-3 deep ploughings', 'Seed treatment with Vitavax', 'Sow at 5 cm depth'], proTips: ['Happy Seeder for zero-till in rice-wheat system'] },
      { stage: '2', title: 'Crown Root Init.', icon: 'Sprout', durationDays: '20-25 days', description: 'Crown root initiation — first critical stage', keyActions: ['First irrigation at 21 DAS', 'Weed control with Sulfosulfuron'], proTips: ['Do not delay first irrigation beyond 25 DAS'] },
      { stage: '3', title: 'Tillering', icon: 'Leaf', durationDays: '25-30 days', description: 'Active tillering phase', keyActions: ['Second irrigation', 'First N top dressing', 'Scout for aphids'], proTips: ['Light irrigation promotes more tillers'] },
      { stage: '4', title: 'Heading & Flowering', icon: 'Flower2', durationDays: '15-20 days', description: 'Ear emergence and grain setting', keyActions: ['Critical irrigation at heading', 'Monitor for Yellow Rust', 'Foliar spray of ZnSO4'], proTips: ['Terminal heat stress management with light irrigation'] },
      { stage: '5', title: 'Harvest', icon: 'Scissors', durationDays: '5-7 days', description: 'Harvest at golden maturity', keyActions: ['Harvest when grain moisture <14%', 'Combine harvest preferred', 'Store in clean godowns'], proTips: ['Avoid grain shattering by timely harvest'] },
    ],
    fertilizerSchedule: [
      { stage: 'Basal', timing: 'At sowing', fertilizer: 'DAP + MOP + ZnSO4', dosePerAcre: '55 kg DAP + 20 kg MOP + 10 kg ZnSO4', method: 'Drill placement' },
      { stage: 'First Top Dress', timing: '21 DAS', fertilizer: 'Urea', dosePerAcre: '55 kg', method: 'Broadcasting before irrigation' },
      { stage: 'Second Top Dress', timing: '42 DAS', fertilizer: 'Urea', dosePerAcre: '35 kg', method: 'Broadcasting before irrigation' },
    ],
    irrigationSchedule: [
      { stage: 'CRI', frequency: '21 DAS', waterPerAcre: '6 cm', criticalNote: 'Most critical — skipping reduces yield 30-40%' },
      { stage: 'Tillering', frequency: '40-45 DAS', waterPerAcre: '6 cm', criticalNote: 'Important for tiller survival' },
      { stage: 'Heading', frequency: '75-80 DAS', waterPerAcre: '6 cm', criticalNote: 'Critical for grain number' },
      { stage: 'Dough', frequency: '100-105 DAS', waterPerAcre: '6 cm', criticalNote: 'For grain filling' },
    ],
    pests: [
      { name: 'Aphid', affectedStage: 'Heading', symptoms: ['Honeydew on leaves', 'Sooty mould', 'Shrivelled grains'], chemicalControl: ['Dimethoate 30 EC'], organicControl: ['Ladybird beetles', 'Neem oil spray'], severity: 'medium' },
    ],
    diseases: [
      { name: 'Yellow Rust', causalAgent: 'Puccinia striiformis', affectedStage: 'Tillering-Heading', symptoms: ['Yellow stripes on leaves', 'Pustules in rows'], chemicalControl: ['Propiconazole 25 EC'], organicControl: ['Use resistant varieties like PBW 725'], severity: 'high' },
    ],
    specialistPersona: {
      name: 'Dr. Vikram Singh',
      title: 'Wheat Breeder',
      institution: 'ICAR-IIWBR, Karnal',
      region: 'Punjab & Haryana',
      expertise: 'Wheat breeding, rust resistance, climate adaptation',
      avatarInitials: 'VS',
    },
    researchContext: 'Leading wheat improvement for heat tolerance and conservation agriculture.',
    icarRef: 'ICAR-IIWBR Wheat Cultivation Guide 2024',
    sources: ['Indian Institute of Wheat & Barley Research', 'Progress Report of AICW&BIP'],
  },
  {
    slug: 'chickpea',
    name: 'Chickpea',
    hindiName: 'चना (Chana)',
    emoji: '🫛',
    category: 'pulse',
    season: 'rabi',
    seasonLabel: 'Rabi (October–March)',
    durationDays: [90, 120],
    suitableStates: ['MP', 'Rajasthan', 'Maharashtra', 'UP', 'Karnataka'],
    suitableSoils: ['Sandy loam', 'Loam', 'Black soil'],
    temperatureRange: '15–30°C',
    waterRequirement: '300–400 mm',
    seedRatePerAcre: '30–40 kg',
    spacing: '30 cm × 10 cm',
    expectedYield: { min: 6, max: 10, unit: 'qtl/acre' },
    msp2024: 5440,
    colorScheme: {
      primary: 'orange',
      gradient: 'from-orange-500/20 to-amber-500/10',
      glow: '0 0 20px rgba(249, 115, 22, 0.15)',
      badge: 'badge-cyan',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
    },
    varieties: [
      { name: 'JG 14', type: 'Desi', note: 'Fusarium wilt resistant' },
      { name: 'Pusa 372', type: 'Desi', note: 'Bold seeded, widely adapted' },
      { name: 'KWR 108', type: 'Kabuli', note: 'Large seeded, high market price' },
    ],
    lifecycle: [
      { stage: '1', title: 'Sowing', icon: 'Sprout', durationDays: '7-10 days', description: 'Sow in October-November on residual moisture', keyActions: ['Rhizobium + PSB seed treatment', 'Sow at 5 cm depth', 'Row spacing 30 cm'], proTips: ['Ridge sowing improves drainage'] },
      { stage: '2', title: 'Vegetative', icon: 'Leaf', durationDays: '30-40 days', description: 'Branching and canopy development', keyActions: ['One hand weeding at 25-30 DAS', 'Pendimethalin pre-emergence'], proTips: ['Nipping terminal buds at 35 DAS increases branching'] },
      { stage: '3', title: 'Flowering', icon: 'Flower2', durationDays: '15-20 days', description: 'Flowering and pod initiation', keyActions: ['Protective irrigation if dry', 'Monitor for pod borer', 'Spray NPV for Helicoverpa'], proTips: ['Install pheromone traps at flowering'] },
      { stage: '4', title: 'Pod Filling', icon: 'Circle', durationDays: '15-20 days', description: 'Pod development and maturation', keyActions: ['One light irrigation', 'Monitor for wilt'], proTips: ['Over-irrigation causes wilt spread'] },
      { stage: '5', title: 'Harvest', icon: 'Scissors', durationDays: '5-7 days', description: 'Harvest at physiological maturity', keyActions: ['Harvest when leaves turn yellow', 'Sun dry for 3-4 days', 'Thresh and grade'], proTips: ['Kabuli types need careful handling to avoid cracking'] },
    ],
    fertilizerSchedule: [
      { stage: 'Basal', timing: 'At sowing', fertilizer: 'DAP + Sulphur', dosePerAcre: '40 kg DAP + 10 kg Sulphur', method: 'Drill placement' },
    ],
    irrigationSchedule: [
      { stage: 'Pre-flowering', frequency: '40-45 DAS', waterPerAcre: '3-4 cm', criticalNote: 'Only if no winter rains received' },
      { stage: 'Pod Filling', frequency: '65-70 DAS', waterPerAcre: '3-4 cm', criticalNote: 'Light irrigation — excess causes wilt' },
    ],
    pests: [
      { name: 'Pod Borer (Helicoverpa)', affectedStage: 'Flowering-Pod', symptoms: ['Bored pods', 'Frass on pods', 'Larva inside pods'], chemicalControl: ['Emamectin Benzoate 5 SG'], organicControl: ['Ha-NPV 250 LE/acre', 'Bird perches'], severity: 'high' },
    ],
    diseases: [
      { name: 'Fusarium Wilt', causalAgent: 'Fusarium oxysporum f.sp. ciceri', affectedStage: 'Vegetative-Reproductive', symptoms: ['Yellowing from lower leaves', 'Drying of entire plant', 'Brown discoloration of vascular tissue'], chemicalControl: ['Carbendazim seed treatment'], organicControl: ['Trichoderma viride seed treatment', 'Crop rotation'], severity: 'high' },
    ],
    specialistPersona: {
      name: 'Dr. Priya Kumari',
      title: 'Pulse Scientist',
      institution: 'IIPR, Kanpur',
      region: 'Central India',
      expertise: 'Pulse production, wilt management, biofortification',
      avatarInitials: 'PK',
    },
    researchContext: 'Expert in integrated wilt management and high-yielding Kabuli types.',
    icarRef: 'IIPR Chickpea Production Technology 2024',
    sources: ['Indian Institute of Pulses Research', 'All India Coordinated Research Project on Chickpea'],
  },
  {
    slug: 'mustard',
    name: 'Mustard',
    hindiName: 'सरसों (Sarson)',
    emoji: '🌼',
    category: 'oilseed',
    season: 'rabi',
    seasonLabel: 'Rabi (October–March)',
    durationDays: [110, 140],
    suitableStates: ['Rajasthan', 'MP', 'UP', 'Haryana', 'Gujarat'],
    suitableSoils: ['Sandy loam', 'Loam', 'Alluvial'],
    temperatureRange: '10–25°C',
    waterRequirement: '250–400 mm',
    seedRatePerAcre: '2–2.5 kg',
    spacing: '45 cm × 15 cm',
    expectedYield: { min: 6, max: 10, unit: 'qtl/acre' },
    msp2024: 5650,
    colorScheme: {
      primary: 'yellow',
      gradient: 'from-yellow-500/20 to-amber-500/10',
      glow: '0 0 20px rgba(234, 179, 8, 0.15)',
      badge: 'badge-cyan',
      iconBg: 'bg-yellow-500/10',
      iconColor: 'text-yellow-400',
    },
    varieties: [
      { name: 'Pusa Bold', type: 'Indian mustard', note: 'Bold seeded, high oil' },
      { name: 'RH 725', type: 'Indian mustard', note: 'White rust tolerant' },
      { name: 'NRCHB 101', type: 'Canola type', note: 'Low erucic acid' },
    ],
    lifecycle: [
      { stage: '1', title: 'Sowing', icon: 'Sprout', durationDays: '5-7 days', description: 'October sowing on irrigated land', keyActions: ['Seed treatment with Metalaxyl', 'Sow at 1.5 cm depth', 'Maintain 45 cm row spacing'], proTips: ['Timely sowing (Oct 15-25) increases yield by 15%'] },
      { stage: '2', title: 'Vegetative', icon: 'Leaf', durationDays: '35-45 days', description: 'Rosette to stem elongation', keyActions: ['Thinning at 15-20 DAS', 'First irrigation at 25-30 DAS', 'Weed control'], proTips: ['Maintain optimal plant population 15-18 plants/m²'] },
      { stage: '3', title: 'Flowering', icon: 'Flower2', durationDays: '20-25 days', description: 'Bright yellow flowering phase', keyActions: ['Bee keeping for pollination', 'Monitor for aphids', 'Irrigation at flowering'], proTips: ['2-3 bee hives/acre increases yield 20-30%'] },
      { stage: '4', title: 'Siliqua Development', icon: 'Circle', durationDays: '25-30 days', description: 'Seed development in siliquae', keyActions: ['Monitor for white rust', 'Last irrigation if needed'], proTips: ['Avoid lodging by not irrigating heavily'] },
      { stage: '5', title: 'Harvest', icon: 'Scissors', durationDays: '5-7 days', description: 'Harvest when 75% siliquae turn yellow', keyActions: ['Early morning harvest to reduce shattering', 'Stack and dry for 5 days', 'Thresh by beating'], proTips: ['Harvest delay causes 20-30% shattering loss'] },
    ],
    fertilizerSchedule: [
      { stage: 'Basal', timing: 'At sowing', fertilizer: 'DAP + Sulphur', dosePerAcre: '50 kg DAP + 20 kg Sulphur', method: 'Drill placement' },
      { stage: 'Top Dress', timing: '25-30 DAS', fertilizer: 'Urea', dosePerAcre: '25 kg', method: 'Broadcasting before irrigation' },
    ],
    irrigationSchedule: [
      { stage: 'Vegetative', frequency: '25-30 DAS', waterPerAcre: '5 cm', criticalNote: 'First critical irrigation' },
      { stage: 'Flowering', frequency: '55-60 DAS', waterPerAcre: '5 cm', criticalNote: 'Most critical stage' },
    ],
    pests: [
      { name: 'Mustard Aphid', affectedStage: 'Flowering', symptoms: ['Curling of inflorescence', 'Honeydew secretion', 'Sooty mould'], chemicalControl: ['Dimethoate 30 EC'], organicControl: ['Neem seed kernel extract', 'Syrphid flies'], severity: 'high' },
    ],
    diseases: [
      { name: 'White Rust', causalAgent: 'Albugo candida', affectedStage: 'Flowering', symptoms: ['White pustules on leaves', 'Staghead deformation of inflorescence'], chemicalControl: ['Mancozeb 75 WP', 'Metalaxyl + Mancozeb'], organicControl: ['Resistant varieties', 'Crop rotation'], severity: 'medium' },
    ],
    specialistPersona: {
      name: 'Dr. Kavita Tanwar',
      title: 'Oilseed Scientist',
      institution: 'DRMR, Bharatpur',
      region: 'Rajasthan',
      expertise: 'Mustard agronomy, pollination biology, oil quality',
      avatarInitials: 'KT',
    },
    researchContext: 'Expert in bee-mediated pollination and sulphur nutrition of mustard.',
    icarRef: 'DRMR Mustard Production Guide 2024',
    sources: ['Directorate of Rapeseed-Mustard Research', 'AICRP on Rapeseed-Mustard'],
  },
  // ——— ZAID CROP ———
  {
    slug: 'watermelon',
    name: 'Watermelon',
    hindiName: 'तरबूज (Tarbooj)',
    emoji: '🍉',
    category: 'vegetable',
    season: 'zaid',
    seasonLabel: 'Zaid (March–June)',
    durationDays: [75, 95],
    suitableStates: ['UP', 'Rajasthan', 'Karnataka', 'MP', 'Andhra Pradesh'],
    suitableSoils: ['Sandy loam', 'Riverbed sandy', 'Well-drained loam'],
    temperatureRange: '25–35°C',
    waterRequirement: '400–600 mm',
    seedRatePerAcre: '1.5–2.0 kg',
    spacing: '300 cm × 90 cm',
    expectedYield: { min: 80, max: 120, unit: 'qtl/acre' },
    msp2024: null,
    colorScheme: {
      primary: 'emerald',
      gradient: 'from-emerald-500/20 to-green-500/10',
      glow: '0 0 20px rgba(16, 185, 129, 0.15)',
      badge: 'badge-emerald',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
    },
    varieties: [
      { name: 'Sugar Baby', type: 'Small fruited', note: 'Dark green, very sweet, 3-5 kg' },
      { name: 'Arka Manik', type: 'Medium', note: 'Oblong, crimson flesh, 6-8 kg' },
      { name: 'Pusa Bedana', type: 'Seedless', note: 'Triploid hybrid, premium market' },
    ],
    lifecycle: [
      { stage: '1', title: 'Sowing', icon: 'Sprout', durationDays: '7-10 days', description: 'Sow on channel ridges or pits', keyActions: ['Prepare pits 60×60×45 cm', 'Mix FYM in pits', 'Sow 3-4 seeds per pit'], proTips: ['Riverbed cultivation gives earliest harvest'] },
      { stage: '2', title: 'Vegetative', icon: 'Leaf', durationDays: '25-30 days', description: 'Vine growth and canopy spread', keyActions: ['Thin to 2 plants per pit', 'Train vines in one direction', 'Mulch with straw'], proTips: ['Pinch secondary vines to control growth'] },
      { stage: '3', title: 'Flowering', icon: 'Flower2', durationDays: '10-15 days', description: 'Male and female flower production', keyActions: ['Support bee pollination', 'Hand pollination in greenhouse', 'Reduce irrigation slightly'], proTips: ['Early morning hand pollination 6-9 AM'] },
      { stage: '4', title: 'Fruit Development', icon: 'Circle', durationDays: '20-25 days', description: 'Rapid fruit enlargement', keyActions: ['Regular irrigation', 'Support heavy fruits on straw bed', 'Turn fruits weekly'], proTips: ['Reduce watering 5-7 days before harvest for sweetness'] },
      { stage: '5', title: 'Harvest', icon: 'Scissors', durationDays: '5-10 days', description: 'Harvest at full maturity', keyActions: ['Check tendril drying near fruit', 'Thump test for hollow sound', 'Cut with 5 cm stem'], proTips: ['Ground spot turning yellow = ripe'] },
    ],
    fertilizerSchedule: [
      { stage: 'Basal', timing: 'At pit preparation', fertilizer: 'FYM + DAP', dosePerAcre: '4 tonnes FYM + 50 kg DAP', method: 'Pit mixing' },
      { stage: 'Top Dress 1', timing: 'At vine running', fertilizer: 'Urea + MOP', dosePerAcre: '25 kg + 20 kg', method: 'Ring application' },
      { stage: 'Top Dress 2', timing: 'At fruit set', fertilizer: 'Urea', dosePerAcre: '25 kg', method: 'Fertigation' },
    ],
    irrigationSchedule: [
      { stage: 'Germination', frequency: 'Alternate days', waterPerAcre: '3 cm', criticalNote: 'Keep soil moist not waterlogged' },
      { stage: 'Fruit Development', frequency: 'Every 3-4 days', waterPerAcre: '5 cm', criticalNote: 'Most water needed during enlargement' },
      { stage: 'Pre-Harvest', frequency: 'Stop 5-7 days before', waterPerAcre: 'None', criticalNote: 'Withholding increases TSS (sweetness)' },
    ],
    pests: [
      { name: 'Fruit Fly', affectedStage: 'Fruiting', symptoms: ['Sting marks on fruits', 'Maggots inside fruit', 'Fruit rotting'], chemicalControl: ['Malathion bait trap'], organicControl: ['Cue-lure traps', 'Bagging young fruits'], severity: 'high' },
    ],
    diseases: [
      { name: 'Fusarium Wilt', causalAgent: 'Fusarium oxysporum f.sp. niveum', affectedStage: 'All stages', symptoms: ['Sudden wilting', 'Brown vascular tissue', 'Vine collapse'], chemicalControl: ['Carbendazim drench'], organicControl: ['Grafting on resistant rootstock', 'Trichoderma'], severity: 'high' },
    ],
    specialistPersona: {
      name: 'Dr. Suresh Babu',
      title: 'Cucurbit Specialist',
      institution: 'ICAR-IIVR, Varanasi',
      region: 'Eastern UP & Bihar',
      expertise: 'Cucurbit cultivation, riverbed farming, grafting technology',
      avatarInitials: 'SB',
    },
    researchContext: 'Pioneer in seedless watermelon technology and riverbed cultivation.',
    icarRef: 'ICAR-IIVR Cucurbit Production Manual',
    sources: ['Indian Institute of Vegetable Research', 'AICRP on Vegetable Crops'],
  },
  {
    slug: 'moong',
    name: 'Green Gram (Moong)',
    hindiName: 'मूँग (Moong)',
    emoji: '🌱',
    category: 'pulse',
    season: 'zaid',
    seasonLabel: 'Zaid (March–June)',
    durationDays: [60, 75],
    suitableStates: ['Rajasthan', 'Maharashtra', 'MP', 'AP', 'Tamil Nadu'],
    suitableSoils: ['Sandy loam', 'Loam', 'Well-drained alluvial'],
    temperatureRange: '25–35°C',
    waterRequirement: '250–350 mm',
    seedRatePerAcre: '8–10 kg',
    spacing: '30 cm × 10 cm',
    expectedYield: { min: 4, max: 6, unit: 'qtl/acre' },
    msp2024: 8558,
    colorScheme: {
      primary: 'green',
      gradient: 'from-green-500/20 to-emerald-500/10',
      glow: '0 0 20px rgba(34, 197, 94, 0.15)',
      badge: 'badge-emerald',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-400',
    },
    varieties: [
      { name: 'IPM 02-3', type: 'Short duration', note: 'MYMV resistant, 60-65 days' },
      { name: 'Virat', type: 'High yield', note: 'Synchronous maturity' },
      { name: 'SML 668', type: 'Early', note: 'Suitable for summer cultivation' },
    ],
    lifecycle: [
      { stage: '1', title: 'Sowing', icon: 'Sprout', durationDays: '5-7 days', description: 'Sow in March for zaid season', keyActions: ['Rhizobium seed inoculation', 'Sow at 3-4 cm depth', 'Pre-sowing irrigation'], proTips: ['Seed priming for 6 hours improves germination'] },
      { stage: '2', title: 'Vegetative', icon: 'Leaf', durationDays: '20-25 days', description: 'Rapid vegetative growth', keyActions: ['Weed management at 20 DAS', 'Light irrigation every 10-12 days'], proTips: ['Moong is sensitive to waterlogging'] },
      { stage: '3', title: 'Flowering', icon: 'Flower2', durationDays: '10-15 days', description: 'Yellow flower production', keyActions: ['Monitor for yellow mosaic virus', 'Control whitefly vector'], proTips: ['MYMV-resistant varieties are essential'] },
      { stage: '4', title: 'Pod Maturity', icon: 'Circle', durationDays: '15-20 days', description: 'Pod filling and maturation', keyActions: ['Multiple pickings of mature pods', 'Pick when pods turn black'], proTips: ['Pick in 2-3 rounds for uniform quality'] },
      { stage: '5', title: 'Harvest', icon: 'Scissors', durationDays: '5-10 days', description: 'Final harvest and processing', keyActions: ['Sun dry pods for 2-3 days', 'Thresh and clean', 'Store at 10% moisture'], proTips: ['Early harvest prevents shattering losses'] },
    ],
    fertilizerSchedule: [
      { stage: 'Basal', timing: 'At sowing', fertilizer: 'DAP', dosePerAcre: '40 kg DAP', method: 'Drill placement' },
    ],
    irrigationSchedule: [
      { stage: 'Pre-sowing', frequency: 'Once', waterPerAcre: '5 cm', criticalNote: 'Essential for summer crop' },
      { stage: 'Flowering', frequency: 'Every 10-12 days', waterPerAcre: '4 cm', criticalNote: 'Critical for pod setting' },
    ],
    pests: [
      { name: 'Whitefly', affectedStage: 'Vegetative', symptoms: ['Yellowing of leaves', 'MYMV transmission'], chemicalControl: ['Thiamethoxam 25 WG'], organicControl: ['Yellow sticky traps', 'Neem oil'], severity: 'high' },
    ],
    diseases: [
      { name: 'Yellow Mosaic Virus', causalAgent: 'Mungbean Yellow Mosaic Virus', affectedStage: 'All stages', symptoms: ['Yellow mosaic pattern on leaves', 'Stunted growth', 'Reduced pods'], chemicalControl: ['Control whitefly vector'], organicControl: ['Use resistant varieties IPM 02-3'], severity: 'high' },
    ],
    specialistPersona: {
      name: 'Dr. Renu Agrawal',
      title: 'Pulse Pathologist',
      institution: 'IIPR, Kanpur',
      region: 'North India',
      expertise: 'Pulse disease management, MYMV resistance breeding',
      avatarInitials: 'RA',
    },
    researchContext: 'Expert in zaid moong cultivation and integrated disease management.',
    icarRef: 'IIPR Mungbean Production Bulletin 2024',
    sources: ['Indian Institute of Pulses Research', 'AICRP on MULLaRP'],
  },
  // ——— PERENNIAL CROPS ———
  {
    slug: 'sugarcane',
    name: 'Sugarcane',
    hindiName: 'गन्ना (Ganna)',
    emoji: '🎋',
    category: 'cashcrop',
    season: 'perennial',
    seasonLabel: 'Perennial (12–18 months)',
    durationDays: [300, 365],
    suitableStates: ['UP', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat'],
    suitableSoils: ['Loamy', 'Clay loam', 'Deep alluvial'],
    temperatureRange: '20–35°C',
    waterRequirement: '1500–2500 mm',
    seedRatePerAcre: '25,000–30,000 setts',
    spacing: '90 cm × 30 cm',
    expectedYield: { min: 300, max: 450, unit: 'qtl/acre' },
    msp2024: 340,
    colorScheme: {
      primary: 'purple',
      gradient: 'from-purple-500/20 to-violet-500/10',
      glow: '0 0 20px rgba(168, 85, 247, 0.15)',
      badge: 'badge-purple',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
    },
    varieties: [
      { name: 'CoJ 64', type: 'Early', note: 'High sucrose, Punjab' },
      { name: 'Co 0238', type: 'Mid-late', note: 'Red rot resistant, most popular' },
      { name: 'CoM 0265', type: 'Mid-late', note: 'High yield Maharashtra' },
    ],
    lifecycle: [
      { stage: '1', title: 'Planting', icon: 'Sprout', durationDays: '30-45 days', description: 'Sett planting and germination', keyActions: ['Use 3-bud setts', 'Treat with Carbendazim', 'Plant in furrows at 90 cm'], proTips: ['Trench planting reduces lodging'] },
      { stage: '2', title: 'Tillering', icon: 'Leaf', durationDays: '60-90 days', description: 'Active tillering phase', keyActions: ['Earthing up at 45 and 90 days', 'Gap filling at 30 days', 'Interculture operations'], proTips: ['Remove excess tillers for better cane weight'] },
      { stage: '3', title: 'Grand Growth', icon: 'TrendingUp', durationDays: '120-150 days', description: 'Maximum cane elongation period', keyActions: ['Heavy irrigation', 'Nitrogen application', 'Propping to prevent lodging'], proTips: ['Drip irrigation saves 30-40% water'] },
      { stage: '4', title: 'Maturation', icon: 'Circle', durationDays: '60-90 days', description: 'Sugar accumulation phase', keyActions: ['Withhold nitrogen', 'Reduce irrigation', 'Monitor sucrose content'], proTips: ['Ethephon spray hastens maturity'] },
      { stage: '5', title: 'Harvest', icon: 'Scissors', durationDays: '30-45 days', description: 'Harvest at peak sucrose', keyActions: ['Harvest close to ground', 'Remove trash leaves', 'Mill within 24 hours'], proTips: ['Ratoon management starts immediately after harvest'] },
    ],
    fertilizerSchedule: [
      { stage: 'Basal', timing: 'At planting', fertilizer: 'DAP + MOP + FYM', dosePerAcre: '50 kg DAP + 40 kg MOP + 5 tonnes FYM', method: 'Furrow placement' },
      { stage: 'Top Dress 1', timing: '45 days', fertilizer: 'Urea', dosePerAcre: '65 kg', method: 'Side dressing + earthing' },
      { stage: 'Top Dress 2', timing: '90 days', fertilizer: 'Urea', dosePerAcre: '65 kg', method: 'Side dressing + earthing' },
    ],
    irrigationSchedule: [
      { stage: 'Germination', frequency: 'Every 7 days', waterPerAcre: '5 cm', criticalNote: 'Keep soil moist for bud sprouting' },
      { stage: 'Grand Growth', frequency: 'Every 10-12 days', waterPerAcre: '6 cm', criticalNote: 'Maximum water demand period' },
      { stage: 'Maturation', frequency: 'Every 20-25 days', waterPerAcre: '4 cm', criticalNote: 'Reduce water for sugar accumulation' },
    ],
    pests: [
      { name: 'Shoot Borer', affectedStage: 'Tillering', symptoms: ['Dead hearts', 'Bore holes in young shoots'], chemicalControl: ['Carbofuran 3G'], organicControl: ['Trichogramma chilonis release'], severity: 'high' },
    ],
    diseases: [
      { name: 'Red Rot', causalAgent: 'Colletotrichum falcatum', affectedStage: 'Grand Growth', symptoms: ['Red discoloration of internal tissue', 'White patches', 'Alcohol smell'], chemicalControl: ['Use healthy setts', 'Carbendazim dip'], organicControl: ['Resistant varieties Co 0238'], severity: 'high' },
    ],
    specialistPersona: {
      name: 'Dr. Arun Mishra',
      title: 'Sugarcane Technologist',
      institution: 'IISR, Lucknow',
      region: 'Uttar Pradesh',
      expertise: 'Sugarcane agronomy, ratoon management, drip fertigation',
      avatarInitials: 'AM',
    },
    researchContext: 'Pioneer in sustainable sugarcane initiative and precision water management.',
    icarRef: 'IISR Sugarcane Production Manual 2024',
    sources: ['Indian Institute of Sugarcane Research', 'VSI Pune Reports'],
  },
  {
    slug: 'turmeric',
    name: 'Turmeric',
    hindiName: 'हल्दी (Haldi)',
    emoji: '🟡',
    category: 'spice',
    season: 'perennial',
    seasonLabel: 'Perennial (7–9 months)',
    durationDays: [210, 270],
    suitableStates: ['Telangana', 'Maharashtra', 'Tamil Nadu', 'Karnataka', 'AP'],
    suitableSoils: ['Red soil', 'Sandy loam', 'Clay loam with good drainage'],
    temperatureRange: '20–30°C',
    waterRequirement: '1500–2500 mm',
    seedRatePerAcre: '800–1000 kg (mother rhizomes)',
    spacing: '45 cm × 25 cm',
    expectedYield: { min: 80, max: 120, unit: 'qtl/acre (fresh)' },
    msp2024: null,
    colorScheme: {
      primary: 'amber',
      gradient: 'from-amber-500/20 to-orange-500/10',
      glow: '0 0 20px rgba(245, 158, 11, 0.15)',
      badge: 'badge-amber',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
    },
    varieties: [
      { name: 'Salem', type: 'Long duration', note: 'High curcumin 5.1%' },
      { name: 'Erode Local', type: 'Medium', note: 'Most traded variety' },
      { name: 'Prabha', type: 'IISR bred', note: 'High curing % and yield' },
    ],
    lifecycle: [
      { stage: '1', title: 'Planting', icon: 'Sprout', durationDays: '15-20 days', description: 'Plant mother rhizomes with onset of monsoon', keyActions: ['Select healthy mother rhizomes 25-30g', 'Treat with Mancozeb + Carbendazim', 'Plant in raised beds'], proTips: ['Sprouted rhizomes give 15% better stand'] },
      { stage: '2', title: 'Vegetative', icon: 'Leaf', durationDays: '80-100 days', description: 'Leaf growth and pseudo-stem development', keyActions: ['Mulch with green leaves 12 tonnes/acre', 'First earthing up at 45 days', 'Weed management'], proTips: ['Mulching is essential — reduces water and weed'] },
      { stage: '3', title: 'Rhizome Init.', icon: 'Circle', durationDays: '40-50 days', description: 'Active rhizome bulking phase', keyActions: ['Second earthing up at 90 days', 'Potash application', 'Regular irrigation'], proTips: ['Shade-grown turmeric has higher curcumin'] },
      { stage: '4', title: 'Maturation', icon: 'Circle', durationDays: '60-70 days', description: 'Rhizome maturation and drying of leaves', keyActions: ['Reduce irrigation gradually', 'Monitor for rhizome rot', 'Check curcumin content'], proTips: ['Harvest 7-9 months after planting'] },
      { stage: '5', title: 'Harvest & Curing', icon: 'Scissors', durationDays: '10-15 days', description: 'Dig, cure, and process rhizomes', keyActions: ['Dig carefully to avoid damage', 'Boil in water for 45-60 min', 'Sun dry for 10-15 days', 'Polish by tumbling'], proTips: ['Curing ratio: 5:1 fresh to dry'] },
    ],
    fertilizerSchedule: [
      { stage: 'Basal', timing: 'At planting', fertilizer: 'FYM + DAP', dosePerAcre: '8 tonnes FYM + 50 kg DAP', method: 'Bed preparation' },
      { stage: 'Top Dress 1', timing: '45 days', fertilizer: 'Urea + MOP', dosePerAcre: '20 kg + 20 kg', method: 'Side dressing + earthing' },
      { stage: 'Top Dress 2', timing: '90 days', fertilizer: 'Urea + MOP', dosePerAcre: '20 kg + 20 kg', method: 'Side dressing + earthing' },
    ],
    irrigationSchedule: [
      { stage: 'Establishment', frequency: 'Every 5-7 days', waterPerAcre: '3 cm', criticalNote: 'Avoid waterlogging — causes rot' },
      { stage: 'Bulking', frequency: 'Every 7-10 days', waterPerAcre: '4 cm', criticalNote: 'Regular moisture essential' },
      { stage: 'Maturation', frequency: 'Reduce gradually', waterPerAcre: '2 cm', criticalNote: 'Stop 1 month before harvest' },
    ],
    pests: [
      { name: 'Shoot Borer', affectedStage: 'Vegetative', symptoms: ['Central leaf drying', 'Bore holes in pseudo-stem'], chemicalControl: ['Quinalphos 0.05%'], organicControl: ['Beauveria bassiana', 'Light traps'], severity: 'medium' },
    ],
    diseases: [
      { name: 'Rhizome Rot', causalAgent: 'Pythium aphanidermatum', affectedStage: 'Vegetative-Bulking', symptoms: ['Yellowing of lower leaves', 'Rotting of rhizomes', 'Foul smell'], chemicalControl: ['Metalaxyl + Mancozeb drench'], organicControl: ['Trichoderma harzianum', 'Proper drainage'], severity: 'high' },
    ],
    specialistPersona: {
      name: 'Dr. Lakshmi Naidu',
      title: 'Spice Agronomist',
      institution: 'IISR, Kozhikode',
      region: 'South India',
      expertise: 'Turmeric agronomy, curcumin enhancement, post-harvest processing',
      avatarInitials: 'LN',
    },
    researchContext: 'Expert in high-curcumin varieties and organic spice production.',
    icarRef: 'IISR Turmeric Extension Pamphlet',
    sources: ['Indian Institute of Spices Research', 'Spices Board of India'],
  },
  {
    slug: 'mango',
    name: 'Mango',
    hindiName: 'आम (Aam)',
    emoji: '🥭',
    category: 'fruit',
    season: 'perennial',
    seasonLabel: 'Perennial (Tree crop)',
    durationDays: [120, 150],
    suitableStates: ['UP', 'AP', 'Karnataka', 'Bihar', 'Gujarat'],
    suitableSoils: ['Deep alluvial', 'Laterite', 'Well-drained loam'],
    temperatureRange: '24–30°C',
    waterRequirement: '1000–1500 mm',
    seedRatePerAcre: '40 grafts (10m spacing)',
    spacing: '10 m × 10 m',
    expectedYield: { min: 40, max: 80, unit: 'qtl/acre (bearing)' },
    msp2024: null,
    colorScheme: {
      primary: 'orange',
      gradient: 'from-orange-500/20 to-yellow-500/10',
      glow: '0 0 20px rgba(249, 115, 22, 0.15)',
      badge: 'badge-purple',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
    },
    varieties: [
      { name: 'Alphonso', type: 'Table', note: 'King of mangoes, Konkan specialty' },
      { name: 'Dasheri', type: 'Table', note: 'Fibre-less, aromatic, North India' },
      { name: 'Totapuri', type: 'Processing', note: 'Pulp industry, South India' },
    ],
    lifecycle: [
      { stage: '1', title: 'Vegetative Flush', icon: 'Sprout', durationDays: '30-45 days', description: 'New leaf flush after harvest', keyActions: ['Prune dead/crowded branches', 'Apply FYM after harvest', 'Ensure adequate irrigation'], proTips: ['Pruning opens canopy for uniform fruiting'] },
      { stage: '2', title: 'Flower Induction', icon: 'Flower2', durationDays: '15-20 days', description: 'Panicle emergence in winter', keyActions: ['Control mango hopper', 'Spray Planofix for fruit set', 'Monitor for powdery mildew'], proTips: ['Stress from October = better flowering'] },
      { stage: '3', title: 'Fruit Set', icon: 'Circle', durationDays: '20-30 days', description: 'Fruit set and marble stage', keyActions: ['NAA spray to reduce drop', 'Spray Carbaryl for hopper', 'Irrigation at fruit set'], proTips: ['Only 0.1% flowers set fruit — this is normal'] },
      { stage: '4', title: 'Fruit Development', icon: 'Circle', durationDays: '45-60 days', description: 'Fruit growth to full size', keyActions: ['Regular irrigation every 15 days', 'Fruit fly management', 'Bagging premium fruits'], proTips: ['Paper bagging improves fruit quality and colour'] },
      { stage: '5', title: 'Harvest', icon: 'Scissors', durationDays: '20-30 days', description: 'Harvest mature fruits', keyActions: ['Harvest with stalk attached', 'Hot water treatment for export', 'Grade by size and colour'], proTips: ['Ethylene ripening at 20-22°C gives uniform colour'] },
    ],
    fertilizerSchedule: [
      { stage: 'Post Harvest', timing: 'July-August', fertilizer: 'FYM + NPK', dosePerAcre: '20 kg FYM + 1 kg Urea + 0.5 kg SSP per tree', method: 'Trench application' },
      { stage: 'Pre-Flowering', timing: 'October', fertilizer: 'MOP', dosePerAcre: '0.5 kg per tree', method: 'Ring application' },
    ],
    irrigationSchedule: [
      { stage: 'Fruit Set', frequency: 'Every 15 days', waterPerAcre: '200L per tree', criticalNote: 'Critical for fruit retention' },
      { stage: 'Fruit Development', frequency: 'Every 10-15 days', waterPerAcre: '200L per tree', criticalNote: 'Regular for fruit sizing' },
    ],
    pests: [
      { name: 'Mango Hopper', affectedStage: 'Flowering', symptoms: ['Honeydew on panicles', 'Sooty mould', 'Flower drying'], chemicalControl: ['Imidacloprid 17.8 SL'], organicControl: ['Neem oil spray', 'Maintain orchard hygiene'], severity: 'high' },
    ],
    diseases: [
      { name: 'Powdery Mildew', causalAgent: 'Oidium mangiferae', affectedStage: 'Flowering', symptoms: ['White powdery coating on panicles', 'Flower drop', 'Small fruit drop'], chemicalControl: ['Wettable Sulphur 80 WP'], organicControl: ['Potassium bicarbonate spray'], severity: 'medium' },
    ],
    specialistPersona: {
      name: 'Dr. Deepak Nayak',
      title: 'Mango Horticulturist',
      institution: 'CISH, Lucknow',
      region: 'North India & Konkan',
      expertise: 'Mango production, post-harvest management, export quality',
      avatarInitials: 'DN',
    },
    researchContext: 'Expert in high-density mango orchards and canopy management.',
    icarRef: 'CISH Mango Production Technology Bulletin',
    sources: ['Central Institute for Subtropical Horticulture', 'NHB Reports'],
  },
  {
    slug: 'onion',
    name: 'Onion',
    hindiName: 'प्याज (Pyaaz)',
    emoji: '🧅',
    category: 'vegetable',
    season: 'rabi',
    seasonLabel: 'Rabi (November–May)',
    durationDays: [130, 150],
    suitableStates: ['Maharashtra', 'Karnataka', 'MP', 'Rajasthan', 'Gujarat'],
    suitableSoils: ['Sandy loam', 'Loam', 'Well-drained alluvial'],
    temperatureRange: '13–24°C',
    waterRequirement: '350–550 mm',
    seedRatePerAcre: '4–5 kg (for nursery)',
    spacing: '15 cm × 10 cm',
    expectedYield: { min: 80, max: 120, unit: 'qtl/acre' },
    msp2024: null,
    colorScheme: {
      primary: 'rose',
      gradient: 'from-rose-500/20 to-red-500/10',
      glow: '0 0 20px rgba(244, 63, 94, 0.15)',
      badge: 'badge-cyan',
      iconBg: 'bg-rose-500/10',
      iconColor: 'text-rose-400',
    },
    varieties: [
      { name: 'N-53 (Nashik Red)', type: 'Red', note: 'Most popular, good storage' },
      { name: 'Bhima Shakti', type: 'Red', note: 'Kharif/Late Kharif adapted' },
      { name: 'Pusa Ridhi', type: 'Light Red', note: 'Early maturity, ICAR bred' },
    ],
    lifecycle: [
      { stage: '1', title: 'Nursery', icon: 'Sprout', durationDays: '40-45 days', description: 'Raise seedlings in raised nursery beds', keyActions: ['Sow seeds thinly on raised beds', 'Apply Carbendazim drench', 'Irrigate daily with rose can'], proTips: ['Hardening 7 days before transplanting'] },
      { stage: '2', title: 'Transplanting', icon: 'ArrowDownToLine', durationDays: '7-10 days', description: 'Transplant 45-day old seedlings', keyActions: ['Transplant in evening', 'Maintain 15×10 cm spacing', 'Light irrigation after transplanting'], proTips: ['Trim tops and roots before planting'] },
      { stage: '3', title: 'Vegetative', icon: 'Leaf', durationDays: '30-40 days', description: 'Leaf growth and bulb initiation', keyActions: ['Weed at 20 and 40 DAT', 'Apply N top dress at 30 DAT', 'Regular irrigation'], proTips: ['Avoid earthing up — it causes thick necks'] },
      { stage: '4', title: 'Bulb Development', icon: 'Circle', durationDays: '30-35 days', description: 'Bulb enlargement and maturation', keyActions: ['Stop nitrogen after bulb initiation', 'Apply MOP', 'Monitor for purple blotch'], proTips: ['Excess N delays maturity and reduces storage life'] },
      { stage: '5', title: 'Harvest & Curing', icon: 'Scissors', durationDays: '10-15 days', description: 'Harvest when 50% tops fall', keyActions: ['Harvest when neck falls naturally', 'Cure in shade for 7-10 days', 'Grade and store'], proTips: ['Bottom-ventilated storage extends shelf life to 4-5 months'] },
    ],
    fertilizerSchedule: [
      { stage: 'Basal', timing: 'Before transplanting', fertilizer: 'FYM + DAP + MOP', dosePerAcre: '8 tonnes FYM + 55 kg DAP + 25 kg MOP', method: 'Broadcasting and mixing' },
      { stage: 'Top Dress', timing: '30 DAT', fertilizer: 'Urea', dosePerAcre: '30 kg', method: 'Side dressing' },
    ],
    irrigationSchedule: [
      { stage: 'After Transplanting', frequency: 'Every 3-4 days', waterPerAcre: '2-3 cm', criticalNote: 'Light and frequent for establishment' },
      { stage: 'Bulb Development', frequency: 'Every 7-8 days', waterPerAcre: '4 cm', criticalNote: 'Regular but not excessive' },
      { stage: 'Pre-Harvest', frequency: 'Stop 10 days before', waterPerAcre: 'None', criticalNote: 'Stopping irrigation ensures good curing' },
    ],
    pests: [
      { name: 'Thrips', affectedStage: 'Vegetative-Bulbing', symptoms: ['Silver streaks on leaves', 'Curling and drying of leaf tips', 'Reduced bulb size'], chemicalControl: ['Fipronil 5 SC'], organicControl: ['Blue sticky traps', 'Neem oil + garlic extract'], severity: 'high' },
    ],
    diseases: [
      { name: 'Purple Blotch', causalAgent: 'Alternaria porri', affectedStage: 'Bulb Development', symptoms: ['Purple lesions with concentric rings on leaves', 'Tip dieback', 'Reduced bulb size'], chemicalControl: ['Mancozeb 75 WP + Carbendazim'], organicControl: ['Trichoderma viride', 'Wide spacing for air circulation'], severity: 'medium' },
    ],
    specialistPersona: {
      name: 'Dr. Sanjay Bhosle',
      title: 'Onion Scientist',
      institution: 'DOGR, Pune',
      region: 'Maharashtra & Karnataka',
      expertise: 'Onion production, storage technology, export quality',
      avatarInitials: 'SB',
    },
    researchContext: 'Expert in onion storage technology and Kharif onion production.',
    icarRef: 'DOGR Onion Production Technology Bulletin',
    sources: ['Directorate of Onion & Garlic Research', 'NHRDF Reports'],
  },
]

// ============================================
// Utility Functions
// ============================================

/** Get a single crop by its URL slug */
export function getCropBySlug(slug: string): CropEntry | undefined {
  return CROP_DATABASE.find((crop) => crop.slug === slug)
}

/** Get all crops for a given season */
export function getCropsBySeason(season: CropSeason): CropEntry[] {
  return CROP_DATABASE.filter((crop) => crop.season === season)
}

/** Get all crops for a given category */
export function getCropsByCategory(category: CropCategory): CropEntry[] {
  return CROP_DATABASE.filter((crop) => crop.category === category)
}

/** Search crops by name, hindi name, or slug */
export function searchCrops(query: string): CropEntry[] {
  const q = query.toLowerCase().trim()
  if (!q) return CROP_DATABASE
  return CROP_DATABASE.filter(
    (crop) =>
      crop.name.toLowerCase().includes(q) ||
      crop.hindiName.toLowerCase().includes(q) ||
      crop.slug.includes(q) ||
      crop.category.includes(q) ||
      crop.suitableStates.some((s) => s.toLowerCase().includes(q))
  )
}

/** Get all unique seasons present in the database */
export function getAllSeasons(): CropSeason[] {
  return [...new Set(CROP_DATABASE.map((c) => c.season))]
}

/** Get all unique categories present in the database */
export function getAllCategories(): CropCategory[] {
  return [...new Set(CROP_DATABASE.map((c) => c.category))]
}
