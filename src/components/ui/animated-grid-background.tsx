"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import React from "react";

interface AnimatedGridBackgroundProps {
  className?: string;
  dotColor?: string;
  dotSize?: number;
  dotSpacing?: number;
  animationSpeed?: number;
  interactive?: boolean;
  mousePosition?: { x: number; y: number; };
}

export function AnimatedGridBackground({
  className,
  dotColor = "rgba(220, 38, 38, 0.3)",
  dotSize = 1.2,
  dotSpacing = 24,
  animationSpeed = 0.5,
  interactive = true,
  mousePosition,
}: AnimatedGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
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
          let size = dotSize;
          let alpha = 1;
          if (interactive && mousePosition) {
            // Calculate distance from cursor
            const dx = mousePosition.x - dot.baseX;
            const dy = mousePosition.y - dot.baseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            // If within 80px, grow and brighten
            if (dist < 80) {
              size = dotSize + (4 - dotSize) * (1 - dist / 80); // up to 4px
              alpha = 0.5 + 0.5 * (1 - dist / 80); // up to 1
            } else {
              size = dotSize;
              alpha = 1;
            }
            dot.x = dot.baseX;
            dot.y = dot.baseY;
          }
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1; // Reset after drawing
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Initialize and start animation
    window.addEventListener("resize", handleResize);
    handleResize();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [dotColor, dotSize, dotSpacing, animationSpeed, interactive, mousePosition]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 z-0 pointer-events-none overflow-hidden", className)}
      style={{ 
        display: 'block',
        width: '100%',
        height: '100%',
        opacity: 1
      }}
    />
  );
}

// Shared background for all Torch public pages
export function SharedTorchBackground({
  dotColor = "rgba(255, 40, 40, 0.3)",
  dotSize = 1.2,
  dotSpacing = 24,
  animationSpeed = 0.4,
  interactive = true,
  className = "",
}: Partial<AnimatedGridBackgroundProps> & { className?: string }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    // Touch support
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches && event.touches.length > 0) {
        setMousePosition({
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        });
      }
    };
    // On touch end, optionally reset or keep last position
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <>
      {/* Animated grid background */}
      <AnimatedGridBackground
        className={"fixed inset-0 -z-20 " + className}
        dotColor={dotColor}
        dotSize={dotSize}
        dotSpacing={dotSpacing}
        animationSpeed={animationSpeed}
        interactive={interactive}
        mousePosition={mounted ? mousePosition : { x: 0, y: 0 }}
      />
      {/* Black overlay */}
      <div className="fixed inset-0 -z-10 bg-black opacity-80 pointer-events-none" />
      {/* Cursor-following red glow */}
      {mounted && (
        <div
          className="fixed w-64 h-64 bg-red-600/40 blur-[100px] rounded-full pointer-events-none -z-10 transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${mousePosition.x}px`, top: `${mousePosition.y}px`, mixBlendMode: 'screen' }}
        />
      )}
    </>
  );
} 