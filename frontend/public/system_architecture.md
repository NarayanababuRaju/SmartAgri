# SmartAgri System Architecture: Foundational Layout

This diagram illustrates the dual-track operation of the **AgriAdvisor** and **Agri-Copilot**, built upon a unified **Shared Infrastructure** foundation.

```mermaid
graph TD
    %% Entry Layer
    subgraph Users ["Farmer Interaction Layer"]
        Voice["Voice/Photo Query (AgriAdvisor)"]
        Back["Background Monitoring (Agri-Copilot)"]
    end

    %% Gateway
    GW["FastAPI Gateway & Auth Orchestrator"]

    %% The Agents Layer (Parallel Tracks)
    subgraph Agents ["Agent Execution Layer"]
        direction LR
        
        subgraph AdvisorTrack ["AgriAdvisor"]
            direction TB
            AA["Advisor Loop"]
            SF["Smart Fusion Engine"]
            IM["Imagen 4.0 Visuals"]
            AA --> SF
            SF --> IM
        end

        subgraph CopilotTrack ["Agri-Copilot: Action Engine"]
            direction TB
            AC["Copilot Orchestrator"]
            AG["Agronomic Guard"]
            AF["Form Automation"]
            AC --> AG
            AC --> AF
        end
    end

    %% The Foundation Layer (Shared Infrastructure) - Positioned Below
    subgraph SharedFoundation ["Shared Infra & Vertex AI"]
        direction LR
        G2["Gemini 2.0 Flash"]
        NG["NeuralGCM Physics"]
        FS["Firestore (State)"]
        GCS["Cloud Storage (Assets)"]
        EX["External APIs (Govt/Weather)"]
    end

    %% Primary Flow
    Voice --> GW
    Back --> GW
    
    GW --> AdvisorTrack
    GW --> CopilotTrack
    
    %% Foundation Connections (Flowing Downwards)
    AdvisorTrack ----> SharedFoundation
    CopilotTrack ----> SharedFoundation

    %% Specific Logic Bindings
    AA -.-> G2
    AA -.-> NG
    AC -.-> G2
    AG -.-> FS
    AF -.-> EX
    IM -.-> GCS

    %% Styling
    classDef advisor fill:#ede9fe,stroke:#8b5cf6,stroke-width:2px;
    classDef copilot fill:#e0f2fe,stroke:#3b82f6,stroke-width:2px;
    classDef shared fill:#f8fafc,stroke:#64748b,stroke-width:2px,stroke-dasharray: 5 5;
    classDef entry fill:#fff7ed,stroke:#f97316,stroke-width:2px;
    classDef gateway fill:#f1f5f9,stroke:#475569,stroke-width:2px;

    class AdvisorTrack advisor;
    class CopilotTrack copilot;
    class SharedFoundation shared;
    class Voice,Back entry;
    class GW gateway;
```

### Strategic Layout
1.  **Entry Layer**: Captures both active (voice) and passive (background) triggers.
2.  **FastAPI Gateway**: The central dispatcher for the entire ecosystem.
3.  **Agent Execution Layer**: Where the **AgriAdvisor** (Reasoning) and **Agri-Copilot** (Action) operate in parallel.
4.  **Foundation Layer**: The "bedrock" of the system, housing the **Vertex AI Models** and **Cloud Infrastructure** that both agents rely on for intelligence and persistence.
