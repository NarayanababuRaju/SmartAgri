# SmartAgri: The Agentic Agronomist Ecosystem 🌾🦾

> **"Bridging the Gap Between Agronomic Intelligence and Field-Ready Action."**

SmartAgri is a state-of-the-art dual-agent ecosystem powered by Google’s Gemini 2.0. It integrates multimodal reasoning with autonomous tool orchestration to restore soil health and empower farmers with resilient, data-driven action plans.

---

## 🤖 The Dual-Agent Ecosystem

### 1. AgriAdvisor: The Intelligence Loop
A voice-first, multimodal reasoning engine for immediate field queries.
- **Multimodal Fusion**: Processes voice, photos, and field data simultaneously using **Gemini 2.0 Flash**.
- **Neural Weather Synthesis**: Integrates **NeuralGCM physics** for hyper-local sub-seasonal weather prediction.
- **Smart Fusion Visuals**: Generates high-fidelity tailored infographics using **Imagen 4.0** to guide farmers visually.

### 2. Agri-Copilot: The Action Engine
A proactive, background agent that orchestrates tools and handles bureaucracy.
- **Autonomous Filing**: Scrapes government portals and autonomously fills subsidy/disaster-relief applications.
- **Agronomic Guard**: A lifecycle-aware gating system that protects soil health by enforcing strict cultivation milestones.
- **Proactive Risk Management**: Continuously monitors for localized risks (e.g., runoff, frost) and alerts farmers before they strike.

## 🏗️ Technical Architecture
SmartAgri is built on a multi-layered stack designed for resilience and scalability:
- **Frontend**: Next.js 15+ (App Router, TypeScript), Tailwind CSS, Framer Motion.
- **Backend**: Python FastAPI Orchestrator.
- **AI Foundation**: Google Vertex AI (Gemini 2.0 Flash, Imagen 4.0, NeuralGCM).
- **Persistence**: Firestore (Real-time state) & Google Cloud Storage (Asset persistence).

## 📊 Deployment
The ecosystem is optimized for high-performance deployment:
- **Google Cloud Run**: Both frontend and backend are containerized and deployed as scalable serverless services.
- **Smart Sync**: Built-in local caching for resilient operation in low-connectivity rural environments.

## 🚀 Quick Start & Reproducibility

Follow these steps to spin up the entire SmartAgri ecosystem locally.

### 1. Prerequisites
- **Python 3.9+** & **Node.js 18+**
- **Google Cloud Project**: Enabled with Vertex AI API.
- **Service Account**: A `vertex-auth.json` file with `Vertex AI User` and `Storage Object Viewer` permissions.

### 2. Environment Setup
```bash
# Clone the repository
git clone https://github.com/NarayanababuRaju/SmartAgri.git
cd SmartAgri

# Place your credentials in the root
# (Strictly protected by .gitignore)
cp /path/to/your/vertex-auth.json ./vertex-auth.json
```

### 3. Spin up the Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
*The backend will start at `http://localhost:8080`.*

### 4. Spin up the Frontend (Next.js)
```bash
# Open a new terminal
cd frontend
npm install
npm run dev
```
*The dashboard will be available at `http://localhost:3000`.*

### 5. Google Cloud Deployment (Optional)
To deploy the "Hackathon-Ready" version live to Cloud Run:
```bash
chmod +x deploy.sh
./deploy.sh
```

## ☁️ Proof of Google Cloud Deployment

This project is fully deployed on **Google Cloud Platform** using Cloud Run, Vertex AI, and Cloud Storage.

### 1. Live Production Services
- **Frontend (Web Dashboard)**: [https://navratna-frontend-mvg6nt3asq-uc.a.run.app](https://navratna-frontend-mvg6nt3asq-uc.a.run.app)
- **Backend (Agent Orchestrator)**: [https://navratna-backend-mvg6nt3asq-uc.a.run.app/docs](https://navratna-backend-mvg6nt3asq-uc.a.run.app/docs)

### 2. Code Evidence (Vertex AI & GCP APIs)
The codebase demonstrates deep integration with Google Cloud services:
- **Vertex AI (Gemini 2.0 Flash)**: Initialized with `vertexai=True` in [backend/main.py:L34-L39](https://github.com/NarayanababuRaju/SmartAgri/blob/main/backend/main.py#L34-L39).
- **Imagen 4.0 (Visual Synthesis)**: Real-time generation via Vertex AI in [backend/main.py:L354-L361](https://github.com/NarayanababuRaju/SmartAgri/blob/main/backend/main.py#L354-L361).
- **Google Search Grounding**: Live fact-checking via Vertex AI tools in [backend/main.py:L781-L782](https://github.com/NarayanababuRaju/SmartAgri/blob/main/backend/main.py#L781-L782).
- **Cloud Run Deployment**: Automated container build and service routing in [deploy.sh](https://github.com/NarayanababuRaju/SmartAgri/blob/main/deploy.sh).


---
*Built for the Google Hackathon: Advanced Agentic Coding.*
