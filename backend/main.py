import os
import json
import base64
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import asyncio
from google import genai
from google.genai import types
from google.oauth2 import service_account
import firebase_admin
from firebase_admin import credentials as firebase_creds
from firebase_admin import storage
from google.cloud import firestore as google_firestore

# Cloud Config
PROJECT_ID = os.environ.get("PROJECT_ID", "agri-sage-live-agent-2026")
LOCATION = os.environ.get("LOCATION", "us-central1")
AUTH_FILE = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "/Users/narayanababuraju/Documents/Learnings/CareerBuilding/Hackathon-GeminiLiveAgent/vertex-auth.json")

# Load credentials object with required scopes
credentials = None
if os.path.exists(AUTH_FILE):
    try:
        credentials = service_account.Credentials.from_service_account_file(
            AUTH_FILE, 
            scopes=["https://www.googleapis.com/auth/cloud-platform"]
        )
    except Exception as e:
        print(f"Warning: Failed to load credentials from {AUTH_FILE}: {e}")

client = genai.Client(
    vertexai=True,
    project=PROJECT_ID,
    location=LOCATION,
    credentials=credentials
)

# Initialize Firebase Admin
if not firebase_admin._apps:
    try:
        if credentials:
            fb_cred = firebase_creds.Certificate(AUTH_FILE)
            firebase_admin.initialize_app(fb_cred, {
                'storageBucket': os.environ.get("GCS_BUCKET", f"{PROJECT_ID}-storage")
            })
        else:
            firebase_admin.initialize_app(options={
                'storageBucket': os.environ.get("GCS_BUCKET", f"{PROJECT_ID}-storage")
            })
    except Exception as e:
        print(f"Warning: Firebase Admin initialization error: {e}")

db = google_firestore.Client(project=PROJECT_ID, database="live-agri-advisor-history", credentials=credentials)
bucket = storage.bucket()

# Use /tmp for generated images to stay compatible with read-only Cloud Run filesystems
GENERATED_IMAGE_FILENAME = "generated_infographic.png"
GENERATED_IMAGE_PATH = os.path.join("/tmp", GENERATED_IMAGE_FILENAME)

app = FastAPI(title="Navratna GCM-Simulator")

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Persistence Constants
DATA_DIR = "data"
STATE_FILE = os.path.join(DATA_DIR, "cultivation_state.json")

if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

CROP_MODELS = {
    "Rice": {
        "stages": ["Land Preparation", "Nursery Management", "Transplantation", "Nutrient/Pest Management", "Water Management", "Harvesting"],
        "subStages": {
            "Land Preparation": ["Ploughing", "Flooding", "Puddling & Levelling"],
            "Nursery Management": ["Seed Treatment", "Bed Preparation", "Sowing"],
            "Transplantation": ["Pulling Seedlings", "Spacing Control", "Water Depth Adj"],
            "Nutrient/Pest Management": ["Urea Basal Dose", "Zinc Application", "Weed Control"],
            "Water Management": ["Intermittent Irrigation", "Drainage Flow", "Pest Check"],
            "Harvesting": ["Threshing", "Drying", "Transport"]
        }
    },
    "Wheat": {
        "stages": ["Field Prep & Sowing", "First Irrigation (CRI)", "Tillering & Jointing", "Flowering & Grain Filling", "Maturity", "Harvesting"],
        "subStages": {
            "Field Prep & Sowing": ["Land Levelling", "Pre-sowing Irrigation", "Sowing & Seed Treatment"],
            "First Irrigation (CRI)": ["Irrigation at 21 Days", "First Urea Application", "Weed Control"],
            "Tillering & Jointing": ["Second Irrigation", "Second Urea Dose", "Stem Elongation Check"],
            "Flowering & Grain Filling": ["Third Irrigation", "Rust Monitoring", "Irrigation at Anthesis"],
            "Maturity": ["Forth Irrigation", "Grain Hardening Check", "Straw Moisture Check"],
            "Harvesting": ["Combine Harvesting", "Grain Storage", "Post-Harvest Handling"]
        }
    },
    "Cotton": {
        "stages": ["Field Selection", "Sowing & Germination", "Square & Flowering", "Boll Development", "Boll Bursting", "Picking"],
        "subStages": {
            "Field Selection": ["Soil Testing", "Deep Ploughing", "Basal Fertilizer"],
            "Sowing & Germination": ["Sowing Technique", "Thinning", "Gap Filling"],
            "Square & Flowering": ["Growth Regulator Use", "Pest Scouting", "Side-dressing Urea"],
            "Boll Development": ["Irrigation Management", "Bollworm Control", "Foliar Spray"],
            "Boll Bursting": ["Defoliation (Optional)", "Locking Monitoring", "Picking Prep"],
            "Picking": ["First Picking", "Second Picking", "Storage & Cleaning"]
        }
    }
}

# --- FIREBASE PERSISTENCE HELPERS ---

async def store_advice_session(session_data: dict):
    """
    Persists advice metadata to Firestore for historical tracking.
    """
    try:
        doc_ref = db.collection("advice_sessions").document()
        session_data["timestamp"] = google_firestore.SERVER_TIMESTAMP
        doc_ref.set(session_data)
        return doc_ref.id
    except Exception as e:
        print(f"Firestore Persistence Error: {e}")
        return None

async def upload_generated_image(local_path: str, user_id: str, session_id: str):
    """
    Uploads the generated infographic to GCS for permanent storage and makes it public.
    """
    try:
        remote_path = f"users/{user_id}/sessions/{session_id}/infographic.png"
        blob = bucket.blob(remote_path)
        blob.upload_from_filename(local_path)
        
        # Explicitly make the object public via ACLs
        blob.make_public()
        
        return blob.public_url
    except Exception as e:
        print(f"GCS Upload & ACL Error: {e}")
        return None

# Global lock for file writes
write_lock = asyncio.Lock()

class FieldActivity(BaseModel):
    model_config = {"extra": "ignore"}
    crop: Optional[str] = None
    stage: str
    subStage: str
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    isLocked: bool = False

class CultivationState(BaseModel):
    model_config = {"extra": "ignore"}
    crop: str = "Rice"
    currentStage: str = "Land Preparation"
    activities: List[FieldActivity] = []

def load_state(user_id: str = "farmer_demo") -> CultivationState:
    """
    Loads cultivation state from Firestore with fallback to local file for migration.
    """
    try:
        doc_ref = db.collection("app_state").document(user_id)
        doc = doc_ref.get()
        if doc.exists:
            data = doc.to_dict()
            return CultivationState(**data)
    except Exception as e:
        print(f"Firestore Load Error: {e}")
    
    # Migration Fallback: load from local file if it exists
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, "r") as f:
                data = json.load(f)
                state = CultivationState(**data)
                save_state(state, user_id) # Migrate to DB
                return state
        except Exception as e:
            print(f"Migration Error: {e}")
            
    return CultivationState()

def save_state(state: CultivationState, user_id: str = "farmer_demo"):
    """
    Persists cultivation state to Firestore for cross-instance reliability.
    """
    try:
        doc_ref = db.collection("app_state").document(user_id)
        doc_ref.set(state.model_dump())
    except Exception as e:
        print(f"Firestore Save Error: {e}")

@app.get("/api/cultivation-state", response_model=CultivationState)
async def get_state():
    return load_state()

@app.post("/api/cultivation-state")
async def update_state(state: CultivationState):
    async with write_lock:
        save_state(state)
    return {"status": "success", "message": "State persisted."}

@app.get("/api/advice-history")
async def get_advice_history(user_id: str = "farmer_demo"):
    """
    Retrieves historical advice sessions from Firestore.
    """
    try:
        sessions_ref = db.collection("advice_sessions")
        # Use google_firestore.FieldFilter to match the client
        query = sessions_ref.where(filter=google_firestore.FieldFilter("userId", "==", user_id)).order_by("timestamp", direction=google_firestore.Query.DESCENDING).limit(20)
        docs = query.stream()
        
        history = []
        for doc in docs:
            data = doc.to_dict()
            # Convert timestamp to string if it exists
            if "timestamp" in data and data["timestamp"]:
                data["timestamp"] = data["timestamp"].isoformat()
            data["id"] = doc.id
            history.append(data)
            
        print(f"Successfully retrieved {len(history)} historical sessions.")
        return {"status": "success", "history": history}
    except Exception as e:
        print(f"Firestore Fetch Error: {e}")
        return {"status": "error", "message": str(e), "history": []}

from fastapi.responses import FileResponse

@app.get("/api/generated-image")
async def get_generated_image():
    """
    Serves the locally generated infographic image.
    """
    if os.path.exists(GENERATED_IMAGE_PATH):
        return FileResponse(GENERATED_IMAGE_PATH, media_type="image/png")
    return {"status": "error", "message": "Image not found"}

def create_infographic_prompt(visual_brief: str) -> str:
    """
    Uses the 'Prompt Translation Pattern': Translates a visual brief into a technical 
    background-only prompt for the hybrid infographic engine.
    """
    try:
        design_prompt = (
            f"Act as a Creative Director for an agricultural AI app. "
            f"Technical Context: '{visual_brief}'. "
            f"Goal: Design a detailed prompt for Imagen 3 to create a 'Background Illustration' for an infographic. "
            f"Aesthetic: Marker-sketch / hand-drawn doodle style on a clean, slightly textured paper-white background. Professional and empathetic. "
            f"Layout Requirement: Leave significant NEGATIVE SPACE (empty canvas) on the RIGHT SIDE for text overlays. "
            f"Art focus: Focus only on 1-2 key visual metaphors (e.g., a healthy rice plant, a water drop, or a stylized sun). "
            f"CRITICAL: DO NOT INCLUDE ANY TEXT, LABELS, OR ALPHABETICAL CHARACTERS. The image must be purely visual/artistic. No letters. "
            f"Produce ONLY the final Imagen prompt, optimizing for minimalism and clarity."
        )
        
        response = client.models.generate_content(
            model="gemini-2.0-flash-001", 
            contents=design_prompt
        )
        return response.text
    except Exception as e:
        print(f"Prompt Synthesis Error: {e}")
        return f"A minimalist marker-style agricultural doodle with negative space on the right, representing: {visual_brief}. No text."

def build_nano_banana_prompt(context: str, style: str) -> str:
    """
    Constructs a sophisticated prompt for the Gemini Image Generator (Nano Banana).
    """
    base_prompt = (
        f"A premium, hand-drawn educational infographic for a village farmer, following the 'Smart Farming Intelligence Loop' design. "
        f"The style is warm, illustrative, and highly legible. Use soft earth tones and vibrant green accents. "
        f"The infographic must feature 4 clear circular phases connected by flowing arrows. "
    )
    
    if "moisture" in context.lower() or "rice" in context.lower():
        return (
            f"{base_prompt} "
            f"Title: 'INTELLIGENCE LOOP'. "
            f"Step 1: illustration of a farmer talking into a smartphone with text 'TRANSCRIPTION: {context}'. "
            f"Step 2: illustration of NeuralGCM weather radar indicating moisture patterns. "
            f"Step 3: illustration of a digital brain icon with text 'SYSTEM CHECK'. "
            f"Step 4: illustration of a healthy rice field with a checkmark and text 'RECOMMENDATION: Delay Irrigation/Transplantation'. "
            f"Avoid any text spelling errors. Ensure the design feels premium and state-of-the-art but accessible to rural communities."
        )
    
    return f"{base_prompt} Theme: {context}. Ensure clear headers and farmer-friendly illustrations."

class NanoBananaRequest(BaseModel):
    prompt_context: str
    # panel_count removed in Phase 72 (Hybrid Layout)
    style: str = "Farmer-Friendly"
    simulation_mode: bool = False

@app.post("/api/nano-banana/generate")
async def generate_visual(request: NanoBananaRequest):
    """
    Invokes Imagen 3.0 using the optimized visual brief.
    """
    # 1. Creative Director: Design the visual prompt using the brief
    try:
        # If the prompt is already highly detailed (like our hard-coded demo prompt), use it directly.
        # Otherwise, use the Creative Director pass to expand it.
        if len(request.prompt_context) > 100:
            artist_prompt = request.prompt_context
        else:
            artist_prompt = create_infographic_prompt(request.prompt_context)
            
        print(f"\n--- [EDUCATIVE INFOGRAPHIC PROMPT] ---")
        print(artist_prompt)
        print(f"----------------------------------\n")
    except Exception as e:
        print(f"Infographic Prompt Synthesis Error: {e}")
        artist_prompt = request.prompt_context # Fallback to original

    # 2. Simulation Mode Check
    if request.simulation_mode:
        import time
        return {
            "status": "success",
            "engine": "Imagen 4.0 (Simulated)",
            "asset_url": f"http://localhost:8000/api/generated-image?v={int(time.time())}",
            "blueprint": {
                "template_url": "/nano_banana_loop_template_1772205940335.png",
                "overlay_data": {
                    "transcription": request.prompt_context,
                    "system_status": "NeuralGCM Verified",
                    "recommendation_headline": "Proceed with Caution"
                }
            }
        }

    # 3. Real Imagen Call (GenAI SDK)
    try:
        # Step A: Perform the generation
        print(f"Executing Imagen 3.0 generation via GenAI SDK...")
        
        # NOTE: Using a try-except specifically for the Imagen call to handle whitelisting issues gracefully
        try:
            # Correct method name is generate_images (plural)
            # Using full path from list() output
            # Using Full Vertex Path for Imagen 4
            print(f"Executing Imagen 4.0 generation via Vertex AI SDK...")
            response = client.models.generate_images(
                model="imagen-3.0-generate-001", # Note: SDK uses this ID for Imagen 3/4 in Vertex
                prompt=artist_prompt,
                config=types.GenerateImagesConfig(
                    number_of_images=1,
                    aspect_ratio="1:1"
                )
            )
            
            # Save the raw bytes to the public directory
            if response.generated_images and response.generated_images[0].image:
                image_obj = response.generated_images[0].image
                if hasattr(image_obj, 'image_bytes') and image_obj.image_bytes:
                    with open(GENERATED_IMAGE_PATH, "wb") as f:
                        f.write(image_obj.image_bytes)
                    import time
                    generated_url = f"http://localhost:8000/api/generated-image?t={int(time.time())}"
                    engine_status = "Imagen 4.0 Live"
                else:
                    # Try using the .save() method if available (SDK feature)
                    image_obj.save(GENERATED_IMAGE_PATH)
                    import time
                    generated_url = f"/{GENERATED_IMAGE_FILENAME}?t={int(time.time())}"
                    engine_status = "Imagen 4.0 Live"
            else:
                generated_url = "http://localhost:8000/api/generated-image" # Fallback to whatever is in public
                engine_status = "Fallback (Layout Only)"
        except Exception as img_e:
            print(f"Imagen Call Failed (Likely Whitelisting/Quota): {img_e}")
            generated_url = "http://localhost:8000/api/generated-image"
            engine_status = "Fallback (Visual Only)"

        return {
            "status": "success",
            "engine": engine_status,
            "constructed_prompt": artist_prompt,
            "asset_url": generated_url,
            "blueprint": {
                "template_url": "/nano_banana_loop_template_1772205940335.png",
                "generated_bg_url": generated_url, 
                "overlay_data": {
                    "transcription": request.prompt_context,
                    "system_status": "NeuralGCM: High Confidence",
                    "recommendation_headline": "Optimal Window" if "harvest" in request.prompt_context.lower() else "Monitor Closely"
                }
            },
            "metadata": {
                "api": "GenAI-SDK-v1",
                "model_used": "imagen-3.0-generate-001"
            }
        }
    except Exception as e:
        print(f"Imagen Generation Failed: {e}")
        return {"status": "error", "message": str(e), "fallback_url": "/nano_banana_loop_template_1772205940335.png"}

class WeatherRiskRequest(BaseModel):
    lat: float
    lon: float
    activity: str

@app.post("/api/weather-risk")
async def get_weather_risk(request: WeatherRiskRequest, active_alerts: List[dict] = []):
    """
    Simulates high-fidelity NeuralGCM weather risks, synthesized with real govt alerts.
    """
    activity = request.activity.lower()
    
    # Check if any live alerts match this activity
    matching_alerts = []
    if active_alerts:
        for alert in active_alerts:
            summary_lower = alert.get('summary', '').lower()
            if any(kw in summary_lower or kw in alert.get('disasterType', '').lower() for kw in activity.split()):
                matching_alerts.append(alert)

    govt_context = f"Govt Alerts ({len(matching_alerts)}): " + "; ".join([a['summary'] for a in matching_alerts]) if matching_alerts else "No direct govt warnings for this specific activity yet."

    if "fertiliz" in activity or "urea" in activity:
        return {
            "baseline": "Light rain expected at 3 PM according to standard APIs.",
            "neural_gcm_insight": f"CRITICAL SYNTESIS: {govt_context}. NeuralGCM confirms high probability of localized high-intensity downpour starting tonight.",
            "agronomic_impact": {
                "urea_runoff_risk": "Critical (75% loss expected)",
                "foliar_uptake": "Low",
                "soil_compaction_risk": "Medium"
            },
            "recommendation": "Delay application until Thursday sunrise. Applying today will result in severe economic loss and environmental runoff.",
            "multimodal_viz_required": True,
            "visual_prompt_hint": "Urea runoff risk infographic with rainy weather forecast"
        }
    elif "harvest" in activity:
        return {
            "baseline": "Clear skies.",
            "neural_gcm_insight": f"SYNC ALERT: {govt_context}. Atmospheric models predict unseasonal squalls/wind gusts exceeding 40km/h tonight.",
            "agronomic_impact": {
                "yield_loss_risk": "High if left in field",
                "moisture_level": "Optimal for harvesting today"
            },
            "recommendation": "Accelerate harvest immediately. Secure harvested crop before 6 PM."
        }
    elif "irrigation" in activity or "water" in activity:
        return {
            "baseline": "Sunny, 34°C. Soil surface appears dry.",
            "neural_gcm_insight": f"GCM UPDATE: {govt_context}. Physics models indicate unseasonal moisture inflow. ET rates will drop by 40%.",
            "agronomic_impact": {
                "water_waste_risk": "Medium-High",
                "root_asphyxiation_risk": "Low",
                "natural_recharge_potential": "Excellent"
            },
            "recommendation": "HOLD IRRIGATION. While the surface is dry, NeuralGCM predicts a natural recharge event (rain) within 6 hours. Save water and electricity costs today."
        }
    else:
        return {
            "baseline": "Normal seasonal conditions.",
            "neural_gcm_insight": f"STABILITY CHECK: {govt_context}. Stability indices remain high for your coordinates.",
            "agronomic_impact": {
                "general_risk": "Low",
                "activity_suitability": "Good"
            },
            "recommendation": f"Conditions are favorable for {activity}. Proceed but monitor live updates.",
            "multimodal_viz_required": "rice" in activity or "transplant" in activity
        }

# --- UNIFIED AUDIO ORCHESTRATOR ---

class AudioProcessRequest(BaseModel):
    audio_base64: Optional[str] = None
    text_query: Optional[str] = None
    image_base64: Optional[str] = None
    mime_type: str = "audio/webm"
    crop: str
    current_stage: str
    sub_stage: Optional[str] = None
    current_activities: List[FieldActivity] = []
    simulation_mode: bool = False
    location_context: Optional[dict] = None

@app.post("/api/process-query")
async def process_audio_query(request: AudioProcessRequest):
    """
    Refactored Orchestrator: Implementation of Prompt Translation & Persistence.
    """
    try:
        activity_summary = ""
        if request.current_activities:
            activity_summary = "\nField Activity History:\n" + "\n".join([
                f"- {a.stage} ({a.subStage}): {'Locked' if a.isLocked else 'In Progress'}"
                for a in request.current_activities
            ])
        
        loc_str = f"Lat: {request.location_context['lat']}, Lon: {request.location_context['lon']}" if request.location_context else "Location Unknown"

        # LIVE INTEL FETCH (Grounding)
        live_alerts = []
        live_schemes = []
        if request.location_context:
            try:
                # Fetch alerts and schemes in parallel
                alerts_task = monitor_disasters_internal(request.location_context)
                schemes_task = get_agri_schemes_internal(location=request.location_context.get('regionName') or request.location_context.get('city'))
                live_alerts, live_schemes = await asyncio.gather(alerts_task, schemes_task)
                print(f"FETCHED {len(live_alerts)} live alerts and {len(live_schemes)} schemes for {request.location_context.get('regionName')}")
            except Exception as e:
                print(f"Error fetching live intel: {e}")

        # Format live intel for the prompt
        alerts_context = "None active."
        if live_alerts:
            alerts_context = "\n".join([f"- {a['disasterType']} ({a['severity']}): {a['summary']} (Source: {a.get('locationName', 'Govt')})" for a in live_alerts])
        
        schemes_context = "None found."
        if live_schemes:
            schemes_context = "\n".join([f"- {s['name']}: {s['description']} (Date: {s['date']})" for s in live_schemes])

        system_instruction = (
            "Identity: You are 'Navratna,' an expert virtual agronomist. "
            "Tone: Empathetic, Headlines First. "
            f"Current Crop: {request.crop}. Stage: {request.current_stage}. Location: {loc_str}. "
            "\nGOVERNMENT INTEL (ACTIVE ALERTS & ADVISORIES):\n"
            f"{alerts_context}\n"
            "\nGOVERNMENT SCHEMES & ORDERS:\n"
            f"{schemes_context}\n"
            "\nAGRONOMIC RULES:\n"
            "1. Tool-First: Always call get_weather_risk for any mentioned field activity.\n"
            "2. AGRONOMIC GUARD (STAGE GATING): You MUST check 'Field Activity History'. "
            "NEVER call update_cultivation_stage to move to the NEXT phase unless ALL sub-stages "
            "for the current phase are marked as 'Locked'.\n"
            "3. RESPONSE FORMAT: You MUST respond in a valid JSON format with the following keys:\n"
            "   - 'summary': A 1-2 sentence headline for the advice (TTS).\n"
            "   - 'action_plan': A structured guide (Nutrient Management, Pest Monitoring, Water Management, Next Steps).\n"
            "   - 'visual_blueprint': A JSON object for an infographic engine containing:\n"
            "       - 'layout_type': 'split_pane_detailed'\n"
            "       - 'theme': 'danger'|'warning'|'safe'\n"
            "       - 'typography': { 'headline': '3-4 word punchy title', 'subtext': 'Use summary here', 'action_badge': '2-3 word immediate action' }\n"
            "       - 'action_items': An array of objects { 'category', 'instruction' } where instructions are max 2 sentences.\n"
            "       - 'imagen_background_prompt': Hand-drawn watercolor sketch style on beige notebook paper with masking tape on the corners. The layout is divided into four quadrants with hand-drawn borders. Top-left illustrates a hand spraying healthy rice plants under rain clouds. Top-right shows rice leaves with ladybugs and organic spray bottles. Bottom-left is a cross-section diagram of a flooded rice paddy with a measuring ruler and drainage. Bottom-right shows a smiling farmer holding a clipboard next to a calendar. Leave ample negative space and blank banner areas in each quadrant for overlaying typography. Do not include any actual text or words in the image.\n"
            f"\nFarmer's Records:{activity_summary}"
        )

        # Gemini Multimodal Call
        parts = []
        if request.audio_base64:
            parts.append(types.Part.from_bytes(data=base64.b64decode(request.audio_base64), mime_type=request.mime_type))
        if request.text_query:
            parts.append(types.Part.from_text(text=request.text_query))
        if request.image_base64:
            try:
                img_data = request.image_base64.split(",", 1)[1] if "," in request.image_base64 else request.image_base64
                parts.append(types.Part.from_bytes(data=base64.b64decode(img_data), mime_type="image/jpeg"))
            except Exception as e:
                print(f"Image parsing error: {e}")

        contents = [types.Content(role="user", parts=parts)]
        tools = [types.Tool(function_declarations=[
            types.FunctionDeclaration(
                name="get_weather_risk",
                description="Gets weather risk.",
                parameters=types.Schema(
                    type="OBJECT",
                    properties={
                        "lat": types.Schema(type="NUMBER"),
                        "lon": types.Schema(type="NUMBER"),
                        "activity": types.Schema(type="STRING")
                    },
                    required=["lat", "lon", "activity"]
                )
            ),
            types.FunctionDeclaration(
                name="update_cultivation_stage",
                description="Updates UI stage.",
                parameters=types.Schema(
                    type="OBJECT",
                    properties={
                        "stage": types.Schema(type="STRING")
                    },
                    required=["stage"]
                )
            )
        ])]

        print(f"Calling Gemini 2.0 Flash (Vertex AI) for audio transcription/reasoning...")
        response = client.models.generate_content(
            model="gemini-2.0-flash-001",
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                tools=tools,
                response_mime_type="application/json")
        )

        tool_data = None
        updated_stage = None
        
        # Handle Tool Call loop
        if response.candidates and response.candidates[0].content.parts:
            model_content = response.candidates[0].content
            fc_parts = [p for p in model_content.parts if p.function_call]
            if fc_parts:
                contents.append(model_content)
                res_parts = []
                for p in fc_parts:
                    fc = p.function_call
                    args = fc.args or {}
                    
                    if fc.name == "get_weather_risk":
                        try:
                            # Safely extract and type-cast arguments
                            risk_request = WeatherRiskRequest(
                                lat=float(args.get("lat", 0.0)),
                                lon=float(args.get("lon", 0.0)),
                                activity=str(args.get("activity", "general"))
                            )
                            tool_data = await get_weather_risk(risk_request, active_alerts=live_alerts)
                        except Exception as te:
                            print(f"Tool Call Error (get_weather_risk): {te}")
                            tool_data = {"status": "error", "message": f"Invalid arguments for weather risk: {te}"}
                        res_parts.append(types.Part.from_function_response(name=fc.name, response=tool_data))
                        
                    elif fc.name == "update_cultivation_stage":
                        try:
                            # Backend Validation: Stage Gating
                            new_stage = str(args.get("stage", ""))
                            if not new_stage:
                                raise ValueError("Missing 'stage' argument")
                                
                            crop_cfg = CROP_MODELS.get(request.crop) or CROP_MODELS["Rice"]
                            subStages_cfg = crop_cfg.get("subStages")
                            current_subs = (subStages_cfg.get(request.current_stage) or []) if isinstance(subStages_cfg, dict) else []
                            
                            # Find locked activities for current stage
                            locked_subs = [a.subStage for a in request.current_activities if a.stage == request.current_stage and a.isLocked]
                            
                            incomplete = [str(s) for s in current_subs if s not in locked_subs]
                            
                            if incomplete:
                                err_msg = f"Cannot advance to {new_stage}. Sub-stages incomplete: {', '.join(incomplete)}"
                                tool_data = {"status": "error", "message": err_msg}
                            else:
                                updated_stage = new_stage
                                tool_data = {"status": "success", "new_stage": updated_stage}
                        except Exception as te:
                            print(f"Tool Call Error (update_cultivation_stage): {te}")
                            tool_data = {"status": "error", "message": str(te)}
                        res_parts.append(types.Part.from_function_response(name=fc.name, response=tool_data))
                
                contents.append(types.Content(role="user", parts=res_parts))
                response = client.models.generate_content(
                    model="gemini-2.0-flash-001", contents=contents,
                    config=types.GenerateContentConfig(
                        system_instruction=system_instruction,
                        tools=tools,
                        response_mime_type="application/json")
                )

        # Parse final structured JSON
        try:
            advice_json = json.loads(response.text)
            if not isinstance(advice_json, dict):
                raise ValueError("Response is not a JSON object")
        except Exception as e:
            print(f"JSON Parsing Error: {e}. Fallback to simple dict.")
            advice_json = {
                "summary": response.text, 
                "action_plan": {}, 
                "visual_blueprint": {
                    "imagen_background_prompt": f"A cinematic agricultural landscape representing: {response.text[:100]}"
                }
            }
            
        final_text = advice_json.get("summary", "")
        # Phase 63: Use the technical action plan for visual context
        action_plan = advice_json.get("action_plan", {})
        
        # 4. Generate Visual using Visual Blueprint (Option A: Single Pass)
        asset_url = None
        is_generating_image = False
        
        # Phase 72: Use the blueprint if provided, or default to generic brief
        visual_blueprint = advice_json.get("visual_blueprint")
        if not isinstance(visual_blueprint, dict):
            visual_blueprint = {}
            
        visual_prompt_context = visual_blueprint.get("imagen_background_prompt", "A cinematic agricultural landscape.")
        if (tool_data and tool_data.get("multimodal_viz_required")) or "rice" in response.text.lower() or visual_blueprint.get("imagen_background_prompt"):
            is_generating_image = True
            viz_res = await generate_visual(NanoBananaRequest(
                prompt_context=visual_prompt_context, 
                simulation_mode=request.simulation_mode
            ))
            asset_url = viz_res.get("asset_url")

        # 5. Persistence & Cloud Storage
        user_id = "farmer_demo"
        
        # Initial local URL
        final_asset_url = asset_url

        # Store session record
        session_id = await store_advice_session({
            "userId": user_id,
            "crop": request.crop,
            "current_stage": request.current_stage,
            "sub_stage": request.sub_stage,
            "input": request.text_query or "Audio Input",
            "advice": advice_json,
            "assetUrl": asset_url # Initial local path
        })

        # Upgrade to Cloud Storage if image was generated and session recorded
        if session_id and asset_url and not request.simulation_mode:
            # The local filename is GENERATED_IMAGE_PATH (data/generated_infographic.png)
            if os.path.exists(GENERATED_IMAGE_PATH):
                cloud_url = await upload_generated_image(GENERATED_IMAGE_PATH, user_id, session_id)
                if cloud_url:
                    # Sync the Cloud URL back to Firestore
                    db.collection("advice_sessions").document(session_id).update({
                        "assetUrl": cloud_url
                    })
                    final_asset_url = cloud_url
                    print(f"Cloud Storage Sync Successful: {cloud_url}")

        # Final return
        return {
            "status": "success",
            "text": final_text, 
            "detailed_plan": advice_json.get("action_plan"), 
            "visual_blueprint": advice_json.get("visual_blueprint"),
            "tool_data": tool_data,
            "updated_stage": updated_stage,
            "asset_url": final_asset_url,
            "sessionId": session_id,
            "is_generating_image": is_generating_image
        }

    except Exception as e:
        print(f"Unified Process Error: {e}")
        return {"status": "error", "message": str(e)}

# --- AGRI CO-PILOT ENDPOINTS ---

class DisasterReport(BaseModel):
    userId: str = "farmer_demo"
    disasterType: str
    location: dict
    cropDetails: dict
    evidenceUrls: List[str] = []

class CopilotChatRequest(BaseModel):
    messages: List[dict]
    activeContext: str
    userId: str = "farmer_demo"
    locationContext: Optional[dict] = None

async def get_agri_schemes_internal(topic: Optional[str] = None, location: Optional[str] = None):
    """Internal helper to fetch schemes with topic and location context."""
    location_str = location if location else "India (Nation-wide)"
    topic_str = topic if topic else "government agricultural schemes or orders"
    prompt = (
        f"List the 5 most recent and relevant {topic_str} in {location_str}. "
        "Strictly prioritize Indian Government (PIB, MyGov) and State Government sources. Do NOT return international schemes. "
        f"Crucially, check for official announcements from state government X/Twitter handles and department portals (e.g., TNAU for Tamil Nadu). "
        "Respond ONLY with a JSON array of objects with keys: name, description, date, url."
    )
    response = client.models.generate_content(
        model="gemini-2.0-flash-001",
        contents=prompt,
        config=types.GenerateContentConfig(
            tools=[types.Tool(google_search=types.GoogleSearch())],
        )
    )
    # Manual extraction in case of markdown
    try:
        text = response.text
        if not text:
            return []
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        
        if "[" in text and "]" in text:
            text = text[text.find("["):text.rfind("]")+1]
        return json.loads(text)
    except Exception as je:
        print(f"JSON Parse Error in Schemes: {je}. Raw: {response.text[:200]}")
        return []

async def monitor_disasters_internal(location: dict):
    """Internal helper to monitor disasters AND provides seasonal/climate advice."""
    lat = location.get('lat')
    lon = location.get('lon')
    region = location.get('regionName') or location.get('city') or "India"
    
    # Avoid passing generic 'Current Location' to the search prompt
    if region == 'Current Location':
        region = "India"
    
    current_month = datetime.now().strftime('%B')
    loc_context = f"near {region}"
    if lat and lon:
        loc_context = f"around coordinates ({lat}, {lon}) in {region}"

    prompt = (
        f"Provide current agricultural intelligence for {region} in {current_month} (India). "
        "Identify: 1. Active high-risk disaster alerts (pests, floods, storms) {loc_context}. "
        f"2. Specific climate/seasonal risks for this stage of cultivation (Rabi/Kharif/Zaid) in {region}. "
        "3. Actionable preventative advice for dominant crops. "
        "Strictly prioritize Indian Government (ICAR, IMD, SDMA) and State Agriculture Dept sources. "
        "Respond ONLY with a JSON array of objects with keys: id, disasterType (e.g. 'Pest Alert', 'Climate Advisory', 'Flood Warning'), "
        "severity (Red/Amber/Info), summary, recommendation, locationName. If no active alerts, return []."
    )
    response = client.models.generate_content(
        model="gemini-2.0-flash-001",
        contents=prompt,
        config=types.GenerateContentConfig(
            tools=[types.Tool(google_search=types.GoogleSearch())],
        )
    )
    # Manual extraction in case of markdown
    try:
        text = response.text
        if not text or len(text.strip()) < 2:
            return []
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
            
        if "[" in text and "]" in text:
            text = text[text.find("["):text.rfind("]")+1]
        return json.loads(text)
    except Exception as je:
        print(f"JSON Parse Error in Disasters: {je}. Raw: {response.text[:200]}")
        return []

@app.get("/api/agri-copilot/schemes")
async def get_agri_schemes():
    try:
        schemes = await get_agri_schemes_internal()
        return {"status": "success", "schemes": schemes}
    except Exception as e:
        print(f"Error fetching schemes: {e}")
        mock_schemes = [
            {"name": "PM-Kisan Samman Nidhi (16th Installment)", "description": "Financial assistance to landholding farmers.", "date": "Feb 2024", "url": "https://pmkisan.gov.in/"},
            {"name": "National Mission on Edible Oils", "description": "Subsidies for oil palm cultivation.", "date": "Jan 2024", "url": "https://nfsm.gov.in/"}
        ]
        return {"status": "success", "schemes": mock_schemes, "message": "Using fallback data."}

@app.post("/api/agri-copilot/disaster/monitor")
async def monitor_disasters(location: dict):
    try:
        alerts = await monitor_disasters_internal(location)
        return {"status": "success", "alerts": alerts}
    except Exception as e:
        return {"status": "success", "alerts": []}

@app.post("/api/agri-copilot/chat")
async def copilot_chat(request: CopilotChatRequest):
    """
    Context-aware orchestration with function calling and search grounding.
    """
    try:
        system_instruction = (
            "You are Agri-Copilot (Sahayak), an advanced autonomous agricultural agent. "
            f"CURRENT CONTEXT: User is on '{request.activeContext}'. "
            f"LOCATION: {request.locationContext or 'Unknown'}. "
            "YOUR CAPABILITIES:\n"
            "1. Tool Usage: Use 'get_agri_schemes' (specifying 'topic' and 'location' if known) if the user asks for government orders, subsidies, or local schemes.\n"
            "2. Disaster Monitor: Use 'check_disaster_alerts' if they ask about floods, weather threats, or alerts.\n"
            "3. Search Grounding: You have Google Search capability. Use it for general agricultural queries.\n"
            "TONE: Headlines First, highly supportive, and technical yet accessible."
        )

        gemini_messages = []
        for msg in request.messages:
            role = "user" if msg["role"] == "user" else "model"
            gemini_messages.append(types.Content(role=role, parts=[types.Part.from_text(text=msg["content"])]))

        # Phase 1: Function Calling Pass
        function_tools = [types.Tool(function_declarations=[
            types.FunctionDeclaration(
                name="get_agri_schemes",
                description="Fetches latest 5 government agricultural schemes based on topic and location context.",
                parameters=types.Schema(
                    type="OBJECT",
                    properties={
                        "topic": types.Schema(type="STRING", description="Specific topic like 'Soil Health' or 'Subsidies'"),
                        "location": types.Schema(type="STRING", description="State or District name")
                    }
                )
            ),
            types.FunctionDeclaration(
                name="check_disaster_alerts",
                description="Checks for active disasters in the user region.",
                parameters=types.Schema(
                    type="OBJECT",
                    properties={"location": types.Schema(type="STRING")},
                    required=["location"]
                )
            )
        ])]

        # Initial call with ONLY function declarations
        response = client.models.generate_content(
            model="gemini-2.0-flash-001",
            contents=gemini_messages,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                tools=function_tools
            )
        )
        triggered_tools = []
        # Handle Function Calling Loop
        if response.candidates and response.candidates[0].content.parts:
            model_content = response.candidates[0].content
            fc_parts = [p for p in model_content.parts if p.function_call]
            
            if fc_parts:
                gemini_messages.append(model_content)
                res_parts = []
                for p in fc_parts:
                    fc = p.function_call
                    triggered_tools.append(fc.name)
                    if fc.name == "get_agri_schemes":
                        data = await get_agri_schemes_internal(
                            topic=fc.args.get("topic"), 
                            location=fc.args.get("location")
                        )
                        res_parts.append(types.Part.from_function_response(name=fc.name, response={"result": data}))
                    elif fc.name == "check_disaster_alerts":
                        data = await monitor_disasters_internal({"regionName": fc.args.get("location")})
                        res_parts.append(types.Part.from_function_response(name=fc.name, response={"result": data}))
                
                gemini_messages.append(types.Content(role="user", parts=res_parts))
                response = client.models.generate_content(
                    model="gemini-2.0-flash-001",
                    contents=gemini_messages,
                    config=types.GenerateContentConfig(
                        system_instruction=system_instruction,
                        tools=function_tools
                    )
                )

        # Phase 2: Search Grounding Pass (optional, if no tools were used)
        if not triggered_tools:
            search_tools = [types.Tool(google_search=types.GoogleSearch())]
            response = client.models.generate_content(
                model="gemini-2.0-flash-001",
                contents=gemini_messages,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    tools=search_tools
                )
            )

        try:
            final_response_text = response.text
        except ValueError:
            # Handle cases where response.text is not available (e.g. prompt blocked)
            final_response_text = "I apologize, but I encountered a restriction while processing your request. Please try a different query."

        # Phase 3: Summarization Pass (Grounded)
        summary_prompt = f"Summarize the following agricultural intelligence report in exactly one concise sentence for a dashboard overlay: {final_response_text}"
        try:
            search_tools = [types.Tool(google_search=types.GoogleSearch())]
            summary_res = client.models.generate_content(
                model="gemini-2.0-flash-001",
                contents=summary_prompt,
                config=types.GenerateContentConfig(
                    system_instruction="You are a helpful agricultural assistant. Provide a single-sentence summary only.",
                    tools=search_tools
                )
            )
            final_summary = summary_res.text.strip()
        except Exception as se:
            print(f"Summarization error: {se}")
            final_summary = final_response_text[:150] + "..."

        # Phase 4: Identify Actionable Links
        link_prompt = (
            f"Identify all specific government schemes, subsidies, or disaster alerts mentioned in this text: {final_response_text}. "
            "Return ONLY a JSON list of objects with keys: 'title' (short name) and 'type' (must be one of: 'scheme', 'subsidy', 'disaster'). "
            "If none, return empty list []."
        )
        try:
            link_res = client.models.generate_content(
                model="gemini-2.0-flash-001",
                contents=link_prompt,
                config=types.GenerateContentConfig(
                    system_instruction="Extract actionable agricultural items. Respond with valid JSON array only.",
                )
            )
            link_text = link_res.text.strip()
            if "```json" in link_text:
                link_text = link_text.split("```json")[1].split("```")[0].strip()
            elif "```" in link_text:
                link_text = link_text.split("```")[1].split("```")[0].strip()
            final_links = json.loads(link_text)
        except Exception as le:
            print(f"Link extraction error: {le}")
            final_links = []

        return {
            "status": "success", 
            "summary": final_summary,
            "response": final_response_text,
            "links": final_links,
            "triggered_tools": triggered_tools
        }
    except Exception as e:
        print(f"Copilot Orchestration Error: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
