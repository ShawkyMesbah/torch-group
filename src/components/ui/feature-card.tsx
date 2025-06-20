"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { GlareHover } from "@/components/animations";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <GlareHover className={className} style={{ width: "100%", height: "100%", background: "transparent", borderRadius: "1rem", borderColor: "#dc2626" }} glareColor="#fff" glareOpacity={0.18} glareAngle={-30} glareSize={180} transitionDuration={700}>
      <div
        className={cn(
          "relative group flex flex-col items-center justify-start p-8 rounded-2xl border border-gray-800 overflow-hidden",
          "bg-black/60 backdrop-blur-md shadow-lg",
          "transition-all duration-400",
          "hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_0_40px_8px_rgba(255,0,60,0.18)] hover:border-red-600",
          "w-full h-full",
        )}
      >
        {/* Icon */}
        <div className="z-10 mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-red-900/10 group-hover:bg-red-900/30 transition-all duration-400">
                      <span className="torch-text-accent group-hover:torch-text-accent-hover text-3xl transition-colors duration-300 group-hover:scale-110 transform">{icon}</span>
        </div>
        {/* Title */}
        <h3 className="z-10 text-2xl font-bold text-white mb-2 text-center">{title}</h3>
        {/* Description */}
        <p className="z-10 text-gray-300 text-base text-center">{description}</p>
      </div>
    </GlareHover>
  );
} 