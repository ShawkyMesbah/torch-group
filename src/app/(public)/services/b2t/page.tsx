"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, Clock, Bell, Users, TrendingUp, Award, Play, ArrowLeft } from "lucide-react";
import { SharedTorchBackground } from "@/components/ui/animated-grid-background";
import { Button } from "@/components/ui/button";

export default function B2TServicesPage() {
  const features = [
    {
      icon: <Star className="h-8 w-8" />,
      title: "Talent Sponsorship",
      description: "Comprehensive sponsorship programs for emerging and established talents."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Growth Analytics",
      description: "Advanced analytics to track and optimize talent performance and engagement."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Recognition Programs",
      description: "Exclusive recognition and awards for outstanding talent achievements."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Building",
      description: "Connect with a network of talented individuals and industry professionals."
    }
  ];

  return (
    <main className="flex flex-col min-h-screen text-white relative overflow-x-hidden pt-20 md:pt-24">
      {/* Animated grid background to match homepage */}
      <SharedTorchBackground />
      
      {/* Hero Section */}
      <section className="torch-section-standard relative bg-transparent pt-8 md:pt-12">
        <div className="torch-container-wide mx-auto relative z-10">
          {/* Back to Services Button */}
          <div className="absolute top-0 left-0">
            <Link 
              href="/services"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Link>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center mb-16"
          >
            <div className="torch-section-header mb-8">
              <span className="torch-section-title">B2T SERVICES</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white drop-shadow-lg">
              Business to <span className="torch-text-accent">Talent</span>
            </h1>
            <div className="flex justify-center mb-6">
              <div className="torch-divider"></div>
            </div>
            <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-2">
              Talent membership services to help your content grow and attract more audience & followers.
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Professional development and sponsorship programs for creative talents.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="torch-section-standard bg-transparent">
        <div className="torch-container-content mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 backdrop-blur-lg border-2 border-red-900/30 rounded-3xl p-12 md:p-16 text-center shadow-2xl hover:shadow-red-900/40 transition-all duration-700 group"
          >
            {/* Subtle inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-red-500/8 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Cool edge highlight */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-50 blur-sm"></div>
            
            <div className="relative z-10">
              {/* Icon */}
              <motion.div 
                className="flex justify-center mb-8"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 w-24 h-24 bg-red-600/30 blur-[30px] rounded-full animate-pulse"></div>
                  <div className="w-24 h-24 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-full flex items-center justify-center border-2 border-red-600/30 relative z-10">
                    <Star className="h-12 w-12 torch-text-primary" />
                  </div>
                </div>
              </motion.div>

              {/* Coming Soon Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-md border border-red-500/40 rounded-full mb-8 shadow-lg"
              >
                <Clock className="w-5 h-5 text-red-400 animate-pulse" />
                <span className="text-red-300 font-semibold text-lg tracking-wide">Coming Soon</span>
              </motion.div>

              {/* Main Title */}
              <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Empowering <span className="torch-text-primary">Creative Talents</span>
              </motion.h2>

              {/* Description */}
              <motion.p 
                className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                We're building something amazing for talented creators, influencers, and artists. 
                Our B2T platform will provide comprehensive support, sponsorship opportunities, 
                and growth tools to help talents reach their full potential.
              </motion.p>

              {/* Features Preview */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 + (index * 0.1) }}
                    className="bg-black/40 border border-red-900/20 rounded-2xl p-6 hover:border-red-600/40 transition-all duration-300 group/card"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 torch-text-primary group-hover/card:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover/card:text-red-100 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-400 group-hover/card:text-gray-300 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Newsletter Signup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="mb-8"
              >
                <h3 className="text-xl font-bold text-white mb-4">Get Notified When We Launch</h3>
                <p className="text-gray-400 mb-6">Be the first to know when our B2T services go live.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-black/50 border border-red-900/30 text-white rounded-lg focus:border-red-500 focus:outline-none"
                  />
                  <Button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap">
                    <Bell className="w-4 h-4 mr-2" />
                    Notify Me
                  </Button>
                </div>
              </motion.div>

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link href="/contact">
                  <Button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                    Contact Us for Updates
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" className="px-8 py-3 border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-full">
                    View Other Services
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="torch-section-standard bg-transparent">
        <div className="torch-container-wide mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Why Talents Choose <span className="torch-text-primary">Torch Group</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              We understand the unique challenges that creative talents face in today's digital landscape. 
              Our upcoming B2T services are designed to address these challenges with innovative solutions.
            </p>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 