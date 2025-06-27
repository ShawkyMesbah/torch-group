"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  MousePointer, 
  Clock, 
  ArrowUpRight, 
  Zap, 
  Shield,
  X
} from 'lucide-react';

interface FeatureShowcaseProps {
  isVisible: boolean;
  onClose: () => void;
}

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({ isVisible, onClose }) => {
  const features = [
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Reading Progress",
      description: "Visual progress indicator at the top of the page shows reading completion",
      color: "text-blue-400"
    },
    {
      icon: <MousePointer className="w-5 h-5" />,
      title: "Enhanced Hover Effects",
      description: "Interactive section titles with smooth animations and glow effects",
      color: "text-purple-400"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Reading Time",
      description: "Blog posts now show estimated reading time for better planning",
      color: "text-green-400"
    },
    {
      icon: <ArrowUpRight className="w-5 h-5" />,
      title: "Quick Start CTA",
      description: "Smart floating action button appears after 30% scroll progress",
      color: "text-orange-400"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Performance Optimization",
      description: "Reduced animations on older devices for better performance",
      color: "text-yellow-400"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Accessibility Enhanced",
      description: "Improved focus management, screen reader support, and keyboard navigation",
      color: "text-red-400"
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[300] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-700 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  🎉 Enhanced Homepage Features
                </h2>
                <p className="text-gray-400">
                  Your homepage has been upgraded with new engagement and accessibility features
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Close feature showcase"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/70 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className={`${feature.color} bg-current/10 p-3 rounded-xl`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="text-center">
                <p className="text-gray-400 mb-4">
                  Try hovering over section titles, scrolling to see the progress bar, and notice the improved focus states!
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full font-semibold hover:from-red-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105"
                >
                  Explore the Features
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 