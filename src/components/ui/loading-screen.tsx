"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLoading } from "@/components/providers/loading-provider";

export function LoadingScreen() {
  const { isLoading, isInitialPageLoad } = useLoading();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Only show loading screen on initial page load
  if (!isInitialPageLoad) return null;

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.5, ease: "easeInOut" } 
          }}
        >
          {/* Red pulsing glow behind logo */}
          <div className="absolute w-40 h-40 rounded-full bg-red-600/30 blur-[80px] animate-pulse-slow"></div>
          
          {/* Dot pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,40,40,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,40,40,0.15)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
          
          {/* Logo container with animation */}
          <motion.div 
            className="relative mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="w-24 h-24 md:w-32 md:h-32 relative">
              <Image 
                src="/images/torch_group_logo.png" 
                alt="Torch Group Logo" 
                fill
                sizes="(max-width: 768px) 100vw, 128px"
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
          
          {/* Loading text and animated dots */}
          <motion.div
            className="text-white flex items-center font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="mr-2 text-lg">LOADING</span>
            <span className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="inline-block w-2 h-2 bg-red-500 rounded-full"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1, 0] 
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </span>
          </motion.div>
          
          {/* Loading progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-red-600"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 2,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
} 