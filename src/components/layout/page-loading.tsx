"use client";

import { motion } from "framer-motion";

export function PageLoading() {
  return (
    <div className="absolute inset-0 bg-black/80 z-30 flex flex-col items-center justify-center backdrop-blur-sm">
      {/* Animated loading spinner with red accent */}
      <motion.div
        className="w-10 h-10 rounded-full border-2 border-gray-800 border-t-red-600"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
      
      {/* Loading text */}
      <span className="text-sm text-gray-400 mt-3">Loading...</span>
    </div>
  );
} 