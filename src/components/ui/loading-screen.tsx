"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import logo from '@/app/images/logo.png';
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
          {/* Red pulsing glow behind logo */}
          <motion.div
            className="absolute w-56 h-56 rounded-full bg-red-600/40 blur-[100px]"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.7, 1, 0.7],
              boxShadow: [
                '0 0 80px 40px rgba(255,0,64,0.25)',
                '0 0 120px 60px rgba(255,0,64,0.45)',
                '0 0 80px 40px rgba(255,0,64,0.25)'
              ]
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          {/* Dot pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,40,40,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,40,40,0.15)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
          
          {/* Logo container with animation */}
          <motion.div
            className="relative mb-8"
            initial={{ scale: 0.7, rotate: -10, opacity: 0 }}
            animate={{ scale: [0.7, 1.15, 1], rotate: [0, 10, 0], opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <motion.div
              className="w-24 h-24 md:w-32 md:h-32 relative"
              animate={{ scale: [1, 1.08, 1], rotate: [0, -8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src={logo}
                alt="Torch Group Logo"
                width={120}
                height={120}
                className="mx-auto mb-6"
                placeholder="blur"
              />
            </motion.div>
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
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-600 via-red-400 to-red-700 shadow-lg"
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