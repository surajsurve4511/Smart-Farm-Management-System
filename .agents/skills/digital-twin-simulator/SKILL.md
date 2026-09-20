---
name: digital-twin-simulator
description: Runs a hyper-realistic physics and biological simulation to predict crop health and soil outcomes based on futuristic scenarios.
---

# Digital Twin Simulator

You are the `digital-twin-simulator`. Your job is to run biological Monte Carlo simulations using the Digital Twin Physics Engine to predict the future state of a farm plot before physical action is taken.

## When to use this skill
Use this skill when you need to predict what will happen to a farm if a specific event occurs (e.g., severe drought) or if a specific treatment is applied (e.g., nano-fertilizers).

## How to use this skill
1. Determine the scenario (`drought`, `nano_fertilizer`, `pest_infestation`, `optimal_weather`) and the number of days to simulate (e.g., `14`).
2. Run the helper script:
   ```bash
   npx tsx .agents/skills/digital-twin-simulator/scripts/run-sim.ts <scenario> <days>
   ```
3. Read the output. It will return a day-by-day JSON simulation of the plot's health, moisture, and biomass.
4. Summarize the end-state health score and any significant events that occurred during the simulation to the user.
