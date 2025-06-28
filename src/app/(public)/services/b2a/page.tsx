"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Users, Clock, Bell, Globe, Handshake, Award, Network } from "lucide-react";
import { SharedTorchBackground } from "@/components/ui/animated-grid-background";
import { Button } from "@/components/ui/button";

export default function B2AServicesPage() {
  const features = [
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Network",
      description: "Connect with a worldwide network of creative entities, brands, and industry leaders."
    },
    {
      icon: <Handshake className="h-8 w-8" />,
      title: "Strategic Partnerships",
      description: "Form meaningful alliances that drive mutual growth and create lasting value."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Recognition Platform",
      description: "Showcase successful collaborations and celebrate partnership achievements."
    },
    {
      icon: <Network className="h-8 w-8" />,
      title: "Collaborative Hub",
      description: "Access tools and resources designed to facilitate seamless collaboration."
    }
  ];

  const benefits = [
    "Access to exclusive partnership opportunities",
    "Global network of verified creative entities",
    "Collaborative project management tools",
    "Shared marketing and promotional resources",
    "Cross-industry networking events",
    "Partnership success analytics and insights"
  ];

  return (
    <main className="flex flex-col min-h-screen text-white relative overflow-x-hidden">
      {/* Animated grid background to match homepage */}
      <SharedTorchBackground />
      
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
              <span className="torch-section-title">B2A SERVICES</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white drop-shadow-lg">
              Business to <span className="torch-text-accent">All Allies</span>
            </h1>
            <div className="flex justify-center mb-6">
              <div className="torch-divider"></div>
            </div>
            <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-2">
              Connect, collaborate, and grow with our network of partners, allies, and creative entities.
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Building bridges between creative minds and fostering successful global partnerships.
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
                    <Users className="h-12 w-12 torch-text-primary" />
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
                Building <span className="torch-text-primary">Global Alliances</span>
              </motion.h2>

              {/* Description */}
              <motion.p 
                className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                We're creating a revolutionary platform that connects creative entities, brands, 
                and industry leaders worldwide. Our B2A network will facilitate meaningful partnerships, 
                collaborative projects, and mutual growth opportunities across all creative industries.
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

              {/* Benefits List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="mb-8"
              >
                <h3 className="text-xl font-bold text-white mb-6">What to Expect</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.6 + (index * 0.1) }}
                      className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-red-900/20 hover:border-red-600/40 transition-all duration-300"
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-300 text-sm">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Newsletter Signup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.8 }}
                className="mb-8"
              >
                <h3 className="text-xl font-bold text-white mb-4">Join the Alliance Network</h3>
                <p className="text-gray-400 mb-6">Be among the first to join our global partnership platform.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-black/50 border border-red-900/30 text-white rounded-lg focus:border-red-500 focus:outline-none"
                  />
                  <Button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap">
                    <Bell className="w-4 h-4 mr-2" />
                    Join Waitlist
                  </Button>
                </div>
              </motion.div>

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.0 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link href="/contact">
                  <Button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                    Partner With Us
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

      {/* Vision Section */}
      <section className="torch-section-standard bg-transparent">
        <div className="torch-container-wide mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Our <span className="torch-text-primary">Partnership Vision</span>
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto mb-8">
              Torch Group envisions a world where creative entities, regardless of size or location, 
              can easily connect, collaborate, and create extraordinary projects together. Our B2A platform 
              will break down barriers and foster a truly global creative ecosystem.
            </p>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Preview Section */}
      <section className="torch-section-standard bg-transparent">
        <div className="torch-container-wide mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div className="bg-black/40 border border-red-900/20 rounded-2xl p-8 hover:border-red-600/40 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-black torch-text-primary mb-2">100+</div>
              <div className="text-gray-400">Potential Partners</div>
            </div>
            <div className="bg-black/40 border border-red-900/20 rounded-2xl p-8 hover:border-red-600/40 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-black torch-text-primary mb-2">25+</div>
              <div className="text-gray-400">Countries Interested</div>
            </div>
            <div className="bg-black/40 border border-red-900/20 rounded-2xl p-8 hover:border-red-600/40 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-black torch-text-primary mb-2">50+</div>
              <div className="text-gray-400">Creative Industries</div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 