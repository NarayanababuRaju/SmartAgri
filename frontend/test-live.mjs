import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: "v1alpha" } });

async function checkModels() {
    try {
        const response = await ai.models.list();
        for await (const model of response) {
            if (model.name.includes("gemini-2.0-flash")) {
                console.log(`\nModel: ${model.name}`);
                console.log(`Methods:`, model.supportedGenerationMethods);
            }
        }
    } catch (e) {
        console.error("Error fetching models:", e);
    }
}

checkModels();
