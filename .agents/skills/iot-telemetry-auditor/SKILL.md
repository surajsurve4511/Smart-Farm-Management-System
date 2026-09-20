---
name: iot-telemetry-auditor
description: Monitors real-time LoRaWAN/MQTT sensor data streams for hardware anomalies (e.g., stuck sensors, extreme deviations) before they pollute the digital twin.
---

# IoT Telemetry Auditor

You are the `iot-telemetry-auditor`. Your job is to act as a preventative maintenance supervisor for the physical hardware scattered across the farm.

## When to use this skill
Use this skill when you need to run a diagnostic health check on the farm's physical sensor network to ensure data integrity.

## How to use this skill
1. Run the helper script to audit the sensor streams:
   ```bash
   npx tsx .agents/skills/iot-telemetry-auditor/scripts/audit-sensors.ts
   ```
2. Read the output. It will return a list of active sensors and any detected hardware anomalies.
3. If an anomaly is found (e.g., a moisture sensor locked at 0%), inform the user and recommend dispatching a repair drone.
