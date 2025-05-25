"use client";

import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

type AnimationType = 
  | "fade-in" 
  | "slide-up" 
  | "slide-down" 
  | "slide-left" 
  | "slide-right" 
  | "zoom-in" 
  | "zoom-out"
  | "none";

interface AnimatedFadeInProps {
  children: ReactNode;
  animation?: AnimationType;
  duration?: number;
  delay?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

export function AnimatedFadeIn({
  children,
  animation = "fade-in",
  duration = 0.5,
  delay = 0,
  threshold = 0.1,
  className,
  once = true,
}: AnimatedFadeInProps) {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });
  
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return <div className={className}>{children}</div>;
  }
  
  // Define animation variants
  const variants = {
    hidden: {
      opacity: 0,
      y: animation === "slide-up" ? 20 : animation === "slide-down" ? -20 : 0,
      x: animation === "slide-left" ? 20 : animation === "slide-right" ? -20 : 0,
      scale: animation === "zoom-in" ? 0.95 : animation === "zoom-out" ? 1.05 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier for smooth entry
      },
    },
  };
  
  // If animation is none, just render children
  if (animation === "none") {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
} 