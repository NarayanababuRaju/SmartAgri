"use client";
import React from "react";
import { LiveAPIProvider } from "@/contexts/LiveAPIContext";

export default function AgriAdvisorLayout({ children }: { children: React.ReactNode }) {
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;

    return (
        <LiveAPIProvider options={{ apiKey: API_KEY, apiVersion: "v1alpha", httpOptions: { apiVersion: "v1alpha" } }}>
            {children}
        </LiveAPIProvider>
    );
}
