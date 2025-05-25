"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AnimatedGridBackgroundProps {
  className?: string;
  dotColor?: string;
  dotSize?: number;
  dotSpacing?: number;
  animationSpeed?: number;
  interactive?: boolean;
}

export function AnimatedGridBackground({
  className,
  dotColor = "rgba(220, 38, 38, 0.15)",
  dotSize = 1,
  dotSpacing = 24,
  animationSpeed = 0.5,
  interactive = true,
}: AnimatedGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);
  const dots = useRef<Array<{ x: number; y: number; baseY: number; baseX: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Setup canvas
    const context = canvas.getContext("2d");
    if (!context) return;
    contextRef.current = context;

    // Handle resize
    const handleResize = () => {
      // Limit to actual viewport size
      canvas.width = Math.min(window.innerWidth, document.documentElement.clientWidth);
      canvas.height = window.innerHeight;
      initDots();
    };

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    // Initialize dots
    const initDots = () => {
      dots.current = [];
      const numCols = Math.ceil(canvas.width / dotSpacing);
      const numRows = Math.ceil(canvas.height / dotSpacing);

      for (let i = 0; i < numCols; i++) {
        for (let j = 0; j < numRows; j++) {
          const x = i * dotSpacing;
          const y = j * dotSpacing;
          dots.current.push({
            x,
            y,
            baseX: x,
            baseY: y,
          });
        }
      }
    };

    // Animation function
    const animate = () => {
      if (!contextRef.current) return;
      const ctx = contextRef.current;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw dots
      ctx.fillStyle = dotColor;
      
      dots.current.forEach((dot) => {
        // Only draw dots within the viewport
        if (dot.baseX >= 0 && dot.baseX <= canvas.width && dot.baseY >= 0 && dot.baseY <= canvas.height) {
          if (interactive) {
            // Calculate distance from mouse
            const dx = mousePos.current.x - dot.baseX;
            const dy = mousePos.current.y - dot.baseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 150; // Max distance for effect
            
            if (distance < maxDistance) {
              // Move dots away from mouse
              const intensity = 1 - distance / maxDistance;
              const angle = Math.atan2(dy, dx);
              const force = intensity * 15; // Force multiplier
              
              dot.x = dot.baseX - Math.cos(angle) * force;
              dot.y = dot.baseY - Math.sin(angle) * force;
            } else {
              // Return to original position
              dot.x = dot.baseX;
              dot.y = dot.baseY;
            }
          } else {
            // Simple floating animation
            dot.y = dot.baseY + Math.sin(Date.now() * 0.001 * animationSpeed + dot.baseX) * 2;
          }
          
          // Draw dot
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Initialize and start animation
    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    handleResize();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [dotColor, dotSize, dotSpacing, animationSpeed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 z-0 pointer-events-none overflow-hidden", className)}
    />
  );
} 