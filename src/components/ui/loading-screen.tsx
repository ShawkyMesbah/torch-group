"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import logo from '@/app/images/logo.png';
import LiquidChrome from "@/components/animations/LiquidChrome";
// TODO: Restore loading-provider context if reintroduced. For now, use local fallback.

export function LoadingScreen({ isLoading = false }: { isLoading?: boolean }) {
  // Fallback: always not loading, always initial page load
  // const isLoading = false;
  const isInitialPageLoad = true;
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
          {/* Liquid Chrome animated background */}
          <LiquidChrome baseColor={[0.1, 0, 0]} speed={0.3} amplitude={0.1} interactive={true} />
          
          {/* Logo with glow, matching footer style */}
          <div className="mb-8 relative flex flex-col items-center animate-fade-in z-20">
            {/* Animated red pulsing glow behind logo */}
          <motion.div
              className="absolute w-56 h-56 rounded-full torch-bg-accent/40 blur-[100px] z-0"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.7, 1, 0.7],
              boxShadow: [
                '0 0 80px 40px rgba(255,0,64,0.25)',
                '0 0 120px 60px rgba(255,0,64,0.45)',
                '0 0 80px 40px rgba(255,0,64,0.25)'
              ]
            }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
            <motion.div
              className="relative z-10"
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src={logo}
                alt="Torch Logo"
                width={160}
                height={160}
                className="object-contain mx-auto drop-shadow-lg transition-transform duration-300"
                style={{aspectRatio: '1/1'}}
                placeholder="blur"
              />
            </motion.div>
          </div>
          
          {/* Loading text and animated dots */}
          <motion.div
            className="text-white flex items-center font-medium z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="mr-2 text-lg">LOADING</span>
            <span className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="inline-block w-2 h-2 torch-bg-accent rounded-full"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1, 0] 
                  }}
                  transition={{
                    duration: 1.8,
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
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-600 via-red-400 to-red-700 shadow-lg z-20"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 3,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
} 