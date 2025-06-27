"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { SharedTorchBackground } from "@/components/ui/animated-grid-background";
import { Button } from "@/components/ui/button";

export default function B2BPage() {
  const packages = [
    {
      name: "Bronze Package",
      price: "Contact for Pricing",
      description: "Perfect for small businesses getting started",
      features: [
        "Social Media Marketing on 2 platforms",
        "2 marketing campaigns included",
        "Content Distribution Plan (2 platforms)",
        "Performance Reports (2 platforms)",
        "Growth Reports with data analysis",
        "Sponsorships & Partnerships (up to 15%)",
      ],
      highlighted: false
    },
    {
      name: "Silver Package", 
      price: "Contact for Pricing",
      description: "Ideal for growing businesses",
      features: [
        "Social Media Marketing on 4 platforms",
        "4 marketing campaigns included",
        "Content Distribution Plan (4 platforms)",
        "Google & Wikipedia optimization",
        "Media Exposure (programs & podcasts)",
        "Performance Reports (4 platforms)",
        "Growth Reports with data analysis",
        "Sponsorships & Partnerships (up to 10%)",
        "2 business consultations included"
      ],
      highlighted: true
    },
    {
      name: "Gold Package",
      price: "Contact for Pricing",
      description: "Complete solution for established enterprises",
      features: [
        "Social Media Marketing on 6 platforms",
        "6 marketing campaigns included",
        "Content Distribution Plan (6 platforms)",
        "Google & Wikipedia optimization",
        "Media Exposure (programs & podcasts)",
        "Performance Reports (6 platforms)",
        "Growth Reports with data analysis",
        "Legal consultations with expert lawyers",
        "4 business consultations included",
        "Sponsorships & Partnerships (up to 10%)",
        "Special offers & discounts access"
      ],
      highlighted: false
    }
  ];

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

      {/* Hero Section */}
      <section className="torch-section-standard relative bg-transparent">
        <div className="torch-container-wide mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center mb-16"
          >
            <div className="torch-section-header mb-8">
              <span className="torch-section-title">B2B SERVICES</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white drop-shadow-lg">
              Business to <span className="torch-text-accent">Business</span>
            </h1>
            <div className="flex justify-center mb-6">
              <div className="torch-divider"></div>
            </div>
            <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-2">
              Comprehensive solutions to help your business grow online and offline
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Our entities/brands membership services will help attract more audience & customers
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="torch-section-standard bg-transparent">
        <div className="torch-container-wide mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative p-8 rounded-3xl backdrop-blur-sm border-2 ${
                  pkg.highlighted 
                    ? "border-red-500 bg-gradient-to-br from-red-950/40 via-black/90 to-red-950/40" 
                    : "border-gray-800 bg-gradient-to-br from-black/90 via-gray-950/20 to-black/90"
                }`}
              >
                {pkg.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-4">{pkg.name}</h3>
                <p className="text-xl font-semibold mb-4 torch-text-accent">{pkg.price}</p>
                <p className="text-gray-400 mb-6">{pkg.description}</p>
                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  onClick={() => window.location.href = '/contact'}
                >
                  Get Started
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
} 