# 🌾 AGRI-OS (Smart Farm Management System) — Next-Gen AI Agricultural Operating System

> Cyber-physical agricultural operating system and farm digital twin powered by Next.js 16, React 19, Google Gemini 2.5 AI, Google Maps satellite GIS, and Supabase IoT telemetry.

---

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Client Layer (Next.js 16 + React 19)        │
│  ┌──────────────────┐  ┌────────────────┐  ┌──────────────┐ │
│  │ Farm Digital     │  │ Google Maps    │  │ Crop Vision  │ │
│  │ Twin Simulator   │  │ Satellite GIS  │  │ Diagnostic   │ │
│  └─────────┬────────┘  └───────┬────────┘  └──────┬───────┘ │
└────────────┼───────────────────┼──────────────────┼─────────┘
             │                   │                  │
             ▼                   ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                 Cognitive AI & Agronomy RAG Tier            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Google GenAI Gemini 2.5 SDK (`@google/genai`)         │  │
│  │ • Agronomy RAG Consultant (`agronomy-rag-analyst`)    │  │
│  │ • Multimodal Leaf Pathology & Pest Diagnosis          │  │
│  │ • Micro-Climate Yield Optimization & Weather Impact   │  │
│  └─────────────────────────────┬─────────────────────────┘  │
└────────────────────────────────┼────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                 IoT Telemetry & Cloud Tier (Supabase)       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ PostgreSQL Database (`supabase_schema.sql`):          │  │
│  │ • `farms`, `plots`, `crops`, `soil_metrics`           │  │
│  │ • LoRaWAN sensor streams (Moisture, NPK, Temperature) │  │
│  │ • Automated anomaly alerts & drone dispatch triggers  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

- **Interactive Farm Digital Twin**: Real-time 2.5D visual simulation representing soil moisture gradients, crop maturation stages, and sensor node health.
- **Multimodal Crop Pathology AI**: Direct leaf photo upload analyzed by Google Gemini AI, returning disease classification, infection stage, and targeted bio-pesticide treatment recommendations.
- **Satellite GIS Boundary Mapping**: Powered by `@vis.gl/react-google-maps` allowing farmers to draw geofenced agricultural plots and monitor satellite vegetation indices.
- **IoT Telemetry Streaming**: Ingests high-frequency soil moisture, electrical conductivity (EC), NPK levels, and ambient temperature via Supabase.
- **Automated Weather & Risk Forecasting**: Monte Carlo weather risk simulations predicting crop hydration needs and frost vulnerability.

---

## 💻 Tech Stack

| Category | Technology | Description |
|---|---|---|
| **Frontend Framework** | Next.js 16.2.1 & React 19.2.4 | Server components and streaming SSR |
| **Styling & Animation** | Tailwind CSS 4 & Framer Motion | Fluid digital twin physics and glassmorphism |
| **Generative AI** | Google GenAI SDK (`@google/genai` v1.52) | Vision diagnostics and agronomic reasoning |
| **GIS & Mapping** | `@vis.gl/react-google-maps` | High-resolution satellite overlays and vector polygons |
| **Database & Auth** | Supabase (`@supabase/ssr`, `supabase-js`) | Relational database, sensor telemetry, and RLS |
| **Icons** | Lucide React | Clean, scalable UI icons |

---

## 📋 Prerequisites & System Requirements

- **Node.js**: v18.18.0 or higher
- **Package Manager**: `npm` or `pnpm`
- **Google Gemini API Key**: From Google AI Studio
- **Google Maps JavaScript API Key**: Configured with Map ID and Satellite tiles
- **Supabase Project**: Active Supabase instance with PostgreSQL

---

## 🚀 Installation & Quickstart

```bash
# 1. Navigate to the project directory
cd "/home/suraj/Suraj/MY_OS/Smart-Farm-Management-System"

# 2. Install dependencies
npm install

# 3. Configure environment variables (.env.local)
cp .env.local.example .env.local
# Add your NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# GEMINI_API_KEY, and NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# 4. Initialize Database Schema
# Execute supabase_schema.sql in your Supabase SQL editor to create:
# farms, plots, sensor_readings, diagnostic_logs, and alert tables

# 5. Launch development server
npm run dev

# 6. Build production bundle
npm run build
```

Open `http://localhost:3000` to view the AGRI-OS command center.

---

## 📂 Directory Structure

```
Smart-Farm-Management-System/
├── AGRI-OS_SRS_v1.0.docx    # Full Software Requirements Specification
├── goal.md                  # Cyber-physical business strategy & AI skills manifesto
├── supabase_schema.sql      # PostgreSQL database DDL (farms, sensors, telemetry)
├── public/                  # Static satellite tiles, icons, and diagrams
├── src/
│   ├── app/
│   │   ├── api/             # Gemini AI diagnostic routes & sensor webhooks
│   │   ├── dashboard/       # Digital Twin, Crop Disease, Weather, Telemetry
│   │   ├── layout.tsx       # Root layout & providers
│   │   └── page.tsx         # Landing hero & platform overview
│   ├── components/          # Reusable sensor cards, map views, twin canvas
│   └── lib/                 # Supabase client, Gemini API client, math utilities
└── package.json             # Next.js 16 and React 19 dependencies
```

---

## 👤 Author & Attribution

- **Author**: Suraj Prakash Surve
- **Project**: AGRI-OS (Smart Farm Management System)
- **License**: Open-Source under the [MIT License](LICENSE)
