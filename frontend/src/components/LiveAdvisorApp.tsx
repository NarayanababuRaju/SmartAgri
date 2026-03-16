"use client";
import React from "react";
import { LiveAPIProvider } from "@/contexts/LiveAPIContext";
import LiveAdvisorUI from "@/components/LiveAdvisorUI";

export default function LiveAdvisorApp() {
    return (
        <LiveAdvisorUI />
    );
}
