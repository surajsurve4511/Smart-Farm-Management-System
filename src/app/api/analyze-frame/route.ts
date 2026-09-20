import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()
    if (!image) return NextResponse.json({ error: 'No image provided' }, { status: 400 })

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'GEMINI_API_KEY missing' }, { status: 500 })

    const ai = new GoogleGenAI({ apiKey })

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: image,
            },
          },
          {
            text: 'Analyze this agricultural image. Identify: 1) Crop type and growth stage, 2) Any visible diseases, pests, or nutrient deficiencies, 3) Overall crop health (1-10), 4) Recommended immediate actions. Be concise — 3-4 sentences max.',
          },
        ],
      }],
      config: {
        systemInstruction: 'You are an expert agricultural pathologist. Analyze crop images for Indian farmers. Be practical and suggest treatments available in India. If the image does not show crops, say so briefly.',
      },
    })

    return NextResponse.json({ analysis: response.text || 'Unable to analyze frame.' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
