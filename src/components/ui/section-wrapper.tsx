"use client";

import { ReactNode } from "react";
import { AnimatedFadeIn } from "@/components/ui/animated-fade-in";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  animation?: "fade-in" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "zoom-in" | "zoom-out" | "none";
  delay?: number;
  threshold?: number;
  darkBg?: boolean;
}

export function SectionWrapper({
  children,
  className,
  id,
  animation = "fade-in",
  delay = 0,
  threshold = 0.1,
  darkBg = false,
}: SectionWrapperProps) {
  return (
    <section 
      id={id}
      className={cn(
        "relative py-16 md:py-24", 
        darkBg ? "bg-black/40" : "",
        className
      )}
    >
      <AnimatedFadeIn 
        animation={animation}
        delay={delay}
        threshold={threshold}
        className="w-full"
      >
        {children}
      </AnimatedFadeIn>
    </section>
  );
} 