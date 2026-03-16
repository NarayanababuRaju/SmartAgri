import WebSocket from 'ws';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const HOST = 'generativelanguage.googleapis.com';
const MODEL = 'models/gemini-2.0-flash'; // Stable model

async function testRawSocket() {
    // Testing v1beta
    const url = `wss://${HOST}/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${API_KEY}`;

    console.log(`Connecting to: wss://${HOST}/ws/...v1beta...BidiGenerateContent`);

    const ws = new WebSocket(url);

    ws.on('open', () => {
        console.log('✅ Socket connected successfully!');

        // Send the setup message
        const setupMessage = {
            setup: {
                model: MODEL,
                generationConfig: {
                    responseModalities: ["AUDIO"]
                }
            }
        };

        console.log('Sending setup message...');
        ws.send(JSON.stringify(setupMessage));
    });

    ws.on('message', (data) => {
        const response = JSON.parse(data.toString());
        console.log('📩 Received message:', JSON.stringify(response, null, 2));
        if (response.setupComplete) {
            console.log("🎉 The raw WebSocket connection worked securely on v1beta!");
            ws.close();
        }
    });

    ws.on('close', (code, reason) => {
        console.log(`❌ Socket closed: Code ${code}, Reason: ${reason.toString()}`);
    });

    ws.on('error', (err) => {
        console.error('WebSocket Error:', err);
    });
}

testRawSocket();
