"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { SharedTorchBackground } from "@/components/ui/animated-grid-background";

export default function B2APage() {
  return (
    <main className="flex flex-col min-h-screen text-white relative overflow-x-hidden">
      <SharedTorchBackground />
      
      {/* Back button */}
      <div className="torch-container-wide mx-auto pt-8">
        <Link href="/services" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Services
        </Link>
      </div>

      {/* Coming Soon Section */}
      <section className="torch-section-standard relative bg-transparent flex-grow flex items-center justify-center">
        <div className="torch-container-wide mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-red-600/50 blur-[40px] rounded-full"></div>
              <Users className="w-24 h-24 torch-text-primary relative z-10" />
            </div>
            <div className="torch-section-header mb-8">
              <span className="torch-section-title">B2A SERVICES</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white drop-shadow-lg">
              Coming <span className="torch-text-accent">Soon</span>
            </h1>
            <div className="flex justify-center mb-6">
              <div className="torch-divider"></div>
            </div>
            <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-6">
              Business to All Allies
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              We're working on something exciting! Soon you'll be able to connect, collaborate, and grow with our network of partners, allies, and creative entities. Stay tuned for updates.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 