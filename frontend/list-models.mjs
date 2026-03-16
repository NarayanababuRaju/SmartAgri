import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

async function listModels() {
    try {
        console.log("Fetching available models...");
        const response = await ai.models.list();
        for await (const model of response) {
            console.log(`- ${model.name} (Supported methods: ${model.supportedGenerationMethods?.join(', ') || 'none'})`);
        }
        console.log("Done fetching models.");
    } catch (e) {
        console.error("Error listing models:", e);
    }
}

listModels();
