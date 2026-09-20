import dotenv from 'dotenv'
import path from 'path'
import { GoogleGenAI } from '@google/genai'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const scenario = process.argv[2]
const days = parseInt(process.argv[3]) || 14

if (!scenario) {
  console.error('Usage: npx tsx run-sim.ts <scenario> [days]')
  process.exit(1)
}

async function run() {
  try {
    console.log(`[Digital Twin Simulator] Running ${days}-day physics simulation for scenario: ${scenario}...`)
    
    const geminiKey = process.env.GEMINI_API_KEY
    if (!geminiKey) throw new Error('GEMINI_API_KEY missing in .env.local')

    const ai = new GoogleGenAI({ apiKey: geminiKey })

    const prompt = `
You are the central Physics Engine for an Agriculture 4.0 Digital Twin simulation.
Simulate a farm plot for ${days} days under the scenario: "${scenario}".

Provide a JSON array containing precisely ${days} objects.
Format: { "day": <number>, "healthScore": <0-100>, "soilMoisture": <0-100>, "events": [<string array>] }
Only return valid JSON starting with [ and ending with ].
`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    })

    const rawOutput = response.text || '[]'
    let jsonString = rawOutput
    const jsonMatch = rawOutput.match(/\[[\s\S]*\]/)
    if (jsonMatch) jsonString = jsonMatch[0]

    const results = JSON.parse(jsonString)

    console.log('\n[Simulation Results]')
    const startState = results[0]
    const endState = results[results.length - 1]
    
    console.log(`Start Health: ${startState.healthScore}% | End Health: ${endState.healthScore}%`)
    
    const allEvents = results.flatMap((r: any) => r.events.map((e: string) => `Day ${r.day}: ${e}`))
    if (allEvents.length > 0) {
      console.log('\nSignificant Events:')
      allEvents.forEach((e: string) => console.log(`- ${e}`))
    }

  } catch (err: any) {
    console.error('Simulation Error:', err.message)
    process.exit(1)
  }
}

run()
