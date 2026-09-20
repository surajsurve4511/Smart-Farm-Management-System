---
name: swarm-fleet-orchestrator
description: Translates physical farm issues into standard JSON payloads and dispatches them to autonomous micro-robot fleets via the orchestration API.
---

# Swarm Fleet Orchestrator

You are the `swarm-fleet-orchestrator`. Your role is to act as the bridge between high-level agronomic decisions and physical hardware execution.

## When to use this skill
Use this skill when you need to physically intervene in a farm plot, such as dispatching robots to remove weeds, apply nano-fertilizer, or scan crops with hyperspectral cameras.

## How to use this skill
1. Determine the task type (`laser_weeding`, `nano_dosing`, `hyperspectral_scan`, `harvesting`), plot ID, and priority (`low`, `high`, `critical`).
2. Run the helper script to dispatch the swarm:
   ```bash
   npx tsx .agents/skills/swarm-fleet-orchestrator/scripts/dispatch-swarm.ts <task_type> <plot_id> <priority>
   ```
3. Read the output. It will return the dispatch ID, the number of bots assigned, and the estimated completion time.
4. Report the successful dispatch details back to the user.
