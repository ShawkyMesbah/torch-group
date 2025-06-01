"use client";

import { motion } from "framer-motion";

interface AnimatedGridBackgroundProps {
  color?: string;
  opacity?: number;
  size?: number;
  spacing?: number;
}

export function AnimatedGridBackground({
  color = "#ef4444",
  opacity = 0.1,
  size = 20,
  spacing = 40,
}: AnimatedGridBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity }}
        transition={{ duration: 0.5 }}
        style={{
          background: `
            linear-gradient(90deg, ${color} ${size}px, transparent 1%) center,
            linear-gradient(${color} ${size}px, transparent 1%) center,
            ${color}
          `,
          backgroundSize: `${spacing}px ${spacing}px`,
          maskImage: "radial-gradient(circle at center, transparent 30%, black 70%)",
        }}
      />
    </div>
  );
} 