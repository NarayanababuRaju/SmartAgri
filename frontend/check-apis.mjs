import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// The project ID we saw in the screenshot
const PROJECT_ID = 'agri-sage-live-agent-2026';

async function checkApisEnabled() {
    console.log(`Checking API enablement for project: ${PROJECT_ID}...`);

    // We cannot reliably check service usage purely with an AIza key because that requires 
    // OAuth2 tokens and the Service Usage API enabled. 
    // However, we can try a basic test against Vertex AI endpoints just to cross-check.

    const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/gemini-2.0-flash-exp:streamGenerateContent?key=${API_KEY}`;

    try {
        const res = await fetch(vertexUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: "ping" }] }]
            })
        });

        const data = await res.json();
        console.log("Vertex AI Endpoint Test Result:");
        console.log(JSON.stringify(data, null, 2));

        if (data.error && data.error.message.includes("API has not been used in project")) {
            console.log("\n❌ VETEX AI API IS NOT ENABLED.");
        }

    } catch (e) {
        console.error("Test failed:", e);
    }
}

checkApisEnabled();
