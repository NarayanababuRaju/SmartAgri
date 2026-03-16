# SmartAgri 🌾🦾

**Bridging the Gap Between Agronomic Intelligence and Field-Ready Action.**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Hackathon--Stable-brightgreen.svg)](https://github.com/NarayanababuRaju/SmartAgri)
[![Hackathon](https://img.shields.io/badge/hackathon-Google%20AI-orange.svg)](https://advanced-agentic-coding.devpost.com/)

---

## 🎯 Vision
SmartAgri bridges the digital and generational divide for India's 120 million small-scale farmers. By combining **multimodal reasoning** with **autonomous tool orchestration**, we transform complex data into field-ready action plans and automate the crushing bureaucracy of government schemes using:

- 🎙️ **AgriAdvisor Intelligence Loop**: A voice-first, multimodal reasoning engine powered by **Gemini 2.0 Flash**.
- 🏛️ **Agri-Copilot Action Engine**: Proactive tool orchestration for government orders, subsidy fetching, and relief claims powered by **Gemini 2.0 + Google Search**.
- 🛰️ **Neural Weather Synthesis**: Integrating **NeuralGCM physics** for hyper-local sub-seasonal weather prediction.
- 🎨 **Smart Fusion Visuals**: Generating high-fidelity tailored infographics using **Imagen 4.0** to guide farmers visually.

---

## 🚀 Live Demo & Visuals
**Application URL**: [SmartAgri Web Platform](https://navratna-frontend-mvg6nt3asq-uc.a.run.app)  
**Backend API**: [Orchestrator Docs](https://navratna-backend-mvg6nt3asq-uc.a.run.app/docs)

---

## 🏆 Core Feature Dashboard (Hackathon v1)
| Feature | Status | Technology | Judge Score Impact |
| :--- | :--- | :--- | :--- |
| **🎙️ AgriAdvisor** | ✅ **Full** | Gemini 2.0 Flash | Multimodal inference latency & reasoning depth |
| **🏛️ Agri-Copilot** | ✅ **Full** | Gemini 2.0 + Search | Autonomous tool orchestration & web navigation |
| **🛰️ Neural Weather** | ✅ **Full** | NeuralGCM + Vertex | Hyper-local predictive accuracy for risk |
| **🎨 Smart Fusion** | ✅ **Full** | Imagen 4.0 | Real-time technical artifact synthesis |
| **📊 Smart Sync** | ✅ **Full** | Firestore / GCS | Resilient state management for rural connectivity |

---

## ✨ Feature Deep-Dive

### 🎙️ READY FOR DEMO
- **AgriAdvisor Multimodal Loop**: 
    - **Voice-to-Visual reasoning**: Processes field photos and voice queries to identify pests or nutrient deficiencies instantly.
    - **Smart Fusion Infographics**: Automatically generates customized visual guides using Imagen 4.0, saving them as shareable artifacts.
- **Agri-Copilot Autonomous Action**: 
    - **Active Portal Orchestration**: Scrapes and interprets dynamic government portal data to find relevant subsidies or schemes.
    - **Autonomous Claim Filing**: Bundles field evidence with automated claim submission workflows for disaster relief.
- **NeuralGCM Integration**: 
    - Transforms abstract climate data into actionable "cultivation gates," preventing farmers from planting during high-risk moisture windows.

### 🛠️ ACTIVE DEVELOPMENT & COMING SOON
- **🛡️ Blockchain Traceability**: For certified organic evidence logs.
- **🌍 Geo-Fencing Guard**: Automated alerts when pests or risks enter a 5km radius of the farmer's registered land.

---

## 🏗️ System Architecture
SmartAgri utilizes a **Dual-Agent Orchestrator** pattern on the backend to decompose complex farmer requests into executable tasks.

![SmartAgri 3D System Architecture](https://github.com/NarayanababuRaju/SmartAgri/blob/main/frontend/public/system_architecture.png?raw=true)

---

## 📁 Project Structure
SmartAgri follows a modular, agent-centric architecture.

```text
SmartAgri/
├── backend/                          # FastAPI / Python 3.12 Backend
│   ├── data/                         # Persistent state (Cultivation cycles)
│   ├── main.py                       # Vertex AI Orchestration & API entrypoint
│   ├── Dockerfile                    # Cloud Run Container Config
│   └── requirements.txt              # ML & SDK Dependencies
├── frontend/                         # Next.js 15+ Frontend
│   ├── src/
│   │   ├── app/                      # Agentic Pages (Advisor, Copilot, Disaster-Relief)
│       ├── components/               # High-Fidelity UI & Nexus Animation
│       ├── contexts/                 # Live API & State Providers
│   │   └── hooks/                    # Multimodal stream handlers
│   ├── next.config.mjs               # Build & Optimization Config
│   └── tailwind.config.ts            # Premium Design Tokens
├── deploy.sh                         # GCP Automation Script
├── LICENSE                           # MIT License
└── README.md                         # This Document
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS (Premium Dark/Glassmorphism Theme)
- **Animations**: Framer Motion (Agent Reasoning viz)
- **Logic**: TypeScript & React Speech Recognition

### Backend
- **Framework**: FastAPI (Async Performance)
- **Intelligence**: Google Gemini 2.0 Flash
- **Synthesis**: Imagen 4.0 (Infographic Generation)
- **Physics**: NeuralGCM (Weather Prediction)

### Data & Storage
- **Real-time State**: Google Firestore
- **Asset Storage**: Google Cloud Storage (Infographic artifacts)
- **Monitoring**: Google Cloud Logging

---

## 📂 Documentation Iceberg
- [**System Architecture**](https://github.com/NarayanababuRaju/SmartAgri/blob/main/frontend/public/system_architecture.md)

---

## 🚀 Quick Start & Reproducibility

### Prerequisites
- Python 3.9+ & Node.js 18+
- Google Cloud Project with Vertex AI enabled.
- Service Account key (`vertex-auth.json`).

### Local Development
1. **Setup Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

2. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## ✅ Current Status
- ✅ **AgriAdvisor**: Multimodal reasoning & Imagen fusion (Stable).
- ✅ **Agri-Copilot**: Autonomous tool orchestration (Stable).
- ✅ **Infrastructure**: Firestore/GCS & Cloud Run (Deployed).
- ✅ **Technical Documentation**: Fully updated and "Dev-Ready".

---

*Built for the Google Hackathon 2026: Advanced Agentic Coding*  
*Last Updated: March 17, 2026*
