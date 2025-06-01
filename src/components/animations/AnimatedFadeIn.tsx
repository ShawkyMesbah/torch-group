"use client";

import { motion } from "framer-motion";

interface AnimatedFadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}

export function AnimatedFadeIn({
  children,
  duration = 0.3,
  delay = 0,
}: AnimatedFadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration,
        delay,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
} 