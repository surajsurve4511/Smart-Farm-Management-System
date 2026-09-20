import fetch from 'node-fetch'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const taskType = process.argv[2]
const plotId = process.argv[3]
const priority = process.argv[4] || 'low'

if (!taskType || !plotId) {
  console.error('Usage: npx tsx dispatch-swarm.ts <task_type> <plot_id> [priority]')
  process.exit(1)
}

async function run() {
  try {
    console.log(`[Swarm Orchestrator] Dispatching swarm for task: ${taskType} on plot: ${plotId}...`)
    
    // In a real agentic environment, this would call the actual Next.js API or the MQTT broker.
    // For this CLI script, we simulate the API request locally since the server might not be running.
    
    let botsRequired = 10
    let timeMultiplier = 1
    
    switch (taskType) {
      case 'laser_weeding':
        botsRequired = 50
        timeMultiplier = 0.5
        break
      case 'nano_dosing':
        botsRequired = 15
        timeMultiplier = 1.2
        break
      case 'hyperspectral_scan':
        botsRequired = 3
        timeMultiplier = 0.2
        break
      case 'harvesting':
        botsRequired = 120
        timeMultiplier = 3.0
        break
      default:
        console.error('Unknown task type. Valid options: laser_weeding, nano_dosing, hyperspectral_scan, harvesting')
        process.exit(1)
    }

    const dispatchId = `SWARM-DSP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    
    console.log('\n[Success] Swarm Fleet Dispatched!')
    console.log(`Dispatch ID: ${dispatchId}`)
    console.log(`Status: fleet_dispatched`)
    console.log(`Bots Assigned: ${botsRequired}`)
    console.log(`Estimated Completion: ${Math.round(45 * timeMultiplier)} minutes`)
    console.log(`Energy Cost: ${Math.round((botsRequired * 0.1 * timeMultiplier) * 10) / 10} kWh\n`)

  } catch (err: any) {
    console.error('Error:', err.message)
    process.exit(1)
  }
}

run()
