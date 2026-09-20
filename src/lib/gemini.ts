'use server'

import { GoogleGenAI } from '@google/genai'
import { GEMINI_MODELS, EMBEDDING_DIMENSIONS } from '@/lib/constants'

let genaiInstance: GoogleGenAI | null = null

function getGenAI(): GoogleGenAI {
  if (!genaiInstance) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error('GEMINI_API_KEY is not configured in environment variables')
    genaiInstance = new GoogleGenAI({ apiKey })
  }
  return genaiInstance
}

/**
 * Generate text content using Gemini
 */
export async function generateContent(prompt: string, systemInstruction?: string) {
  const ai = getGenAI()
  const response = await ai.models.generateContent({
    model: GEMINI_MODELS.CHAT,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: systemInstruction ? { systemInstruction } : undefined,
  })
  return response.text || ''
}

/**
 * Generate content with image analysis (Gemini Vision)
 */
export async function analyzeImageWithAI(
  imageBase64: string,
  mimeType: string,
  prompt: string,
  systemInstruction?: string
) {
  const ai = getGenAI()
  const response = await ai.models.generateContent({
    model: GEMINI_MODELS.VISION,
    contents: [
      {
        role: 'user',
        parts: [
          { inlineData: { data: imageBase64, mimeType } },
          { text: prompt },
        ],
      },
    ],
    config: systemInstruction ? { systemInstruction } : undefined,
  })
  return response.text || ''
}

/**
 * Generate vector embedding for text
 */
export async function embedText(text: string): Promise<number[]> {
  const ai = getGenAI()
  const response = await ai.models.embedContent({
    model: GEMINI_MODELS.EMBEDDING,
    contents: text,
  })
  const embedding = response.embeddings?.[0]?.values
  if (!embedding || embedding.length !== EMBEDDING_DIMENSIONS) {
    throw new Error(`Expected ${EMBEDDING_DIMENSIONS}-dim embedding, got ${embedding?.length ?? 0}`)
  }
  return embedding
}

/**
 * Generate a comprehensive daily log analysis using Gemini
 */
export async function generateDailyLogAnalysis(context: {
  plotName: string
  crop: string | null
  cropStage: string | null
  moisture: number | null
  temperature: number | null
  humidity: number | null
  rainfall: number | null
  notes: string
  pestObserved: boolean
  diseaseObserved: boolean
  activities: string[]
  imageDescriptions?: string[]
}) {
  const prompt = `Analyze this daily farm log and provide actionable recommendations:

Plot: ${context.plotName}
Crop: ${context.crop || 'Not specified'} (Stage: ${context.cropStage || 'Unknown'})
Soil Moisture: ${context.moisture ?? 'N/A'}%
Temperature: ${context.temperature ?? 'N/A'}°C
Humidity: ${context.humidity ?? 'N/A'}%
Rainfall: ${context.rainfall ?? 'N/A'} mm
Pest Observed: ${context.pestObserved ? 'Yes' : 'No'}
Disease Observed: ${context.diseaseObserved ? 'Yes' : 'No'}
Activities: ${context.activities.join(', ') || 'None recorded'}
Notes: ${context.notes}
${context.imageDescriptions?.length ? `Image Observations: ${context.imageDescriptions.join('; ')}` : ''}

Provide:
1. Overall health assessment (1-2 sentences)
2. Key concerns if any
3. 3-5 specific, actionable recommendations for an Indian farmer
4. Any immediate actions needed

Format your response clearly with headers.`

  return generateContent(prompt, 
    'You are an expert Indian agronomist AI. Provide practical, region-specific advice for Indian farming conditions. Be precise and actionable. Consider monsoon patterns, local crop varieties, and affordable solutions available in Indian markets.'
  )
}

/**
 * Generate yield prediction using RAG context
 */
export async function generateYieldPrediction(context: {
  plotName: string
  crop: string
  area: number
  cropStage: string
  historicalLogs: string
}) {
  const prompt = `Based on the following farm data, predict the yield for this season:

Plot: ${context.plotName}
Crop: ${context.crop}
Area: ${context.area} acres
Current Stage: ${context.cropStage}

Historical Logs from Vector Database:
${context.historicalLogs}

Provide:
1. Estimated yield in quintals per acre
2. Total estimated yield for the plot
3. Confidence level (low/medium/high)
4. Key factors affecting the prediction
5. Estimated revenue range based on current market prices
6. Comparison with average Indian yield for this crop

Format as structured JSON with keys: predicted_yield_per_acre, total_yield, confidence, factors, revenue_range, comparison`

  return generateContent(prompt,
    'You are an agricultural data scientist. Provide realistic yield predictions based on Indian agricultural benchmarks. Use ICAR/state agriculture department standards for comparison. Return valid JSON only.'
  )
}

/**
 * Consult a crop-specific AI specialist powered by RAG context
 */
export async function consultCropSpecialist(params: {
  question: string
  cropName: string
  specialistPersona: {
    name: string
    title: string
    institution: string
    region: string
    expertise: string
  }
  researchContext: string
  farmerProfile: {
    state: string
    district?: string
    soilType?: string
    farmingType?: string
  }
  ragContext: string
  farmLogContext: string
}) {
  const {
    question, cropName, specialistPersona, researchContext,
    farmerProfile, ragContext, farmLogContext
  } = params

  const systemInstruction = `You are ${specialistPersona.name}, ${specialistPersona.title} at ${specialistPersona.institution}, a leading ${cropName} specialist with 25+ years of field research experience in ${specialistPersona.region}.

Your expertise: ${specialistPersona.expertise}

You speak with authority drawn from decades of ICAR field trials, state agricultural university research, and hands-on work with thousands of Indian farmers. You blend scientific precision with practical farmer-friendly advice.

FARMER PROFILE:
- State: ${farmerProfile.state}
- District: ${farmerProfile.district || 'Not specified'}
- Soil Type: ${farmerProfile.soilType || 'Not specified'}
- Farming Type: ${farmerProfile.farmingType || 'Not specified'}

RESEARCH KNOWLEDGE BASE (from ICAR/SAU publications):
${researchContext}

${ragContext ? `RELEVANT RESEARCH SNIPPETS (from vector database):
${ragContext}` : ''}

${farmLogContext ? `THIS FARMER'S RECENT FIELD DATA:
${farmLogContext}` : ''}

INSTRUCTIONS:
1. Always personalize advice to the farmer's state, soil, and conditions
2. Reference specific research findings and ICAR recommendations when relevant
3. Provide actionable, practical advice — mention product names, doses, timing
4. Suggest affordable solutions available at local Krishi Kendra or agriculture centers
5. If the farmer's data shows concerning patterns, proactively flag them
6. Use Indian units (quintals, acres, kg/hectare) and local terminology
7. Be warm, encouraging, and supportive — many farmers face difficult conditions
8. Format responses with clear headers and bullet points for easy reading`

  return generateContent(question, systemInstruction)
}
