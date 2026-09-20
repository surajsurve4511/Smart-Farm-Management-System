async function run() {
  console.log('[IoT Auditor] Scanning LoRaWAN gateway for physical sensor anomalies...\n')
  
  // Simulate fetching data from thousands of sensors
  const sensors = [
    { id: 'SEN-M-01', type: 'Moisture', location: 'Sector Alpha', status: 'OK', reading: '42%' },
    { id: 'SEN-M-02', type: 'Moisture', location: 'Sector Beta', status: 'OK', reading: '39%' },
    { id: 'SEN-N-01', type: 'Nitrogen', location: 'Sector Alpha', status: 'OK', reading: '12ppm' },
    { id: 'SEN-M-09', type: 'Moisture', location: 'Sector Delta', status: 'ANOMALY', reading: '0%' },
    { id: 'SEN-W-01', type: 'Wind', location: 'Hub Central', status: 'OK', reading: '12 km/h' },
  ]

  let anomalyCount = 0

  sensors.forEach(s => {
    if (s.status === 'ANOMALY') {
      anomalyCount++
      console.log(`[WARNING] HARDWARE FAULT DETECTED:`)
      console.log(`  Sensor ID: ${s.id}`)
      console.log(`  Location:  ${s.location}`)
      console.log(`  Type:      ${s.type}`)
      console.log(`  Error:     Reading flatlined at ${s.reading} for 12 hours. Probable physical damage.\n`)
    }
  })

  if (anomalyCount === 0) {
    console.log('[OK] All 5,420 sensors reporting healthy telemetry streams.')
  } else {
    console.log(`[ALERT] ${anomalyCount} sensor(s) require physical maintenance.`)
    console.log(`Recommendation: Dispatch diagnostic drone to affected coordinates to verify hardware integrity.`)
  }
}

run()
