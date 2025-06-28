"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Send, User, Phone, MessageSquare, Globe, Award, Shield, Target, Headphones, TrendingUp, Building2, BarChart3, Users, Zap } from "lucide-react";
import { SharedTorchBackground } from "@/components/ui/animated-grid-background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTiltEffect } from "@/hooks/useTiltEffect";
import { SectionWrapper } from "@/components/ui/section-wrapper";

export default function B2BServicesPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    message: '',
    selectedPackage: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const tiltRefs = [
    useTiltEffect({ max: 10, scale: 1.02 }),
    useTiltEffect({ max: 10, scale: 1.02 }),
    useTiltEffect({ max: 10, scale: 1.02 }),
    useTiltEffect({ max: 10, scale: 1.02 })
  ];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Add form submission logic here
    setTimeout(() => {
      setIsSubmitting(false);
      // Reset form or show success message
    }, 2000);
  };

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

  const benefits = [
    {
      icon: <TrendingUp className="h-12 w-12" />,
      title: "Growth Acceleration",
      description: "Scale your business with our proven marketing strategies and industry expertise."
    },
    {
      icon: <Target className="h-12 w-12" />,
      title: "Targeted Marketing",
      description: "Reach your ideal customers with precision-targeted campaigns across multiple channels."
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: "Brand Protection",
      description: "Safeguard your brand reputation with our comprehensive monitoring and management services."
    },
    {
      icon: <Award className="h-12 w-12" />,
      title: "Industry Recognition",
      description: "Gain credibility and recognition through our extensive network and media partnerships."
    }
  ];

  return (
    <main className="flex flex-col min-h-screen text-white relative overflow-x-hidden pt-20 md:pt-24">
      {/* Animated grid background to match homepage */}
      <SharedTorchBackground />
      
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-5rem)] md:min-h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden">
        <div className="relative z-20 flex flex-1 flex-col items-center justify-center w-full h-full px-4 text-center">
          <motion.div 
            className="flex flex-col items-center justify-center w-full h-full text-center z-20 flex-1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
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
              Comprehensive membership services to help your business grow online and offline.
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Attract more audiences and customers with our proven business growth strategies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="torch-section-standard bg-transparent">
        <div className="torch-container-wide mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Why Choose Our <span className="torch-text-primary">B2B Services</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Partner with Torch Group to unlock your business potential and achieve sustainable growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-generous lg:gap-grand mb-16">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                ref={tiltRefs[index]}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                className="group relative overflow-hidden rounded-3xl backdrop-blur-lg shadow-2xl transition-all duration-500 flex flex-col items-center justify-center min-h-[280px] border-2 border-red-900/30 bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 hover:border-red-600 hover:shadow-red-900/40 hover:shadow-2xl p-8 text-center"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 opacity-5">
                  <div className="w-full h-full bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  {/* Icon with glow */}
                  <div className="mb-6 relative flex items-center justify-center">
                    <div className="absolute inset-0 w-20 h-20 bg-red-600/50 blur-[40px] rounded-full transition-all duration-500 group-hover:blur-[60px] group-hover:bg-red-500/60"></div>
                    <div className="w-20 h-20 flex items-center justify-center relative z-10">
                      <div className="torch-text-primary drop-shadow-2xl transition-all duration-500 group-hover:scale-110">
                        {benefit.icon}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight text-white group-hover:text-red-100 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="torch-section-standard bg-transparent">
        <div className="torch-container-wide mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Choose Your <span className="torch-text-primary">Membership Package</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Select the perfect package that aligns with your business goals and growth objectives.
            </p>
          </motion.div>

          {/* Service Packages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative rounded-3xl p-8 ${
                  pkg.highlighted 
                    ? 'border-2 border-red-500 bg-gradient-to-br from-red-950/30 via-black/90 to-red-950/30' 
                    : 'border-2 border-red-900/30 bg-gradient-to-br from-black/90 via-red-950/20 to-black/90'
                } backdrop-blur-lg shadow-2xl hover:shadow-red-900/40 transition-all duration-500`}
              >
                {pkg.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="text-gray-400 mb-4">{pkg.description}</p>
                  <div className="torch-text-primary text-xl font-bold">{pkg.price}</div>
                </div>

                <ul className="space-y-comfortable mb-generous">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 torch-text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => setFormData(prev => ({ ...prev, selectedPackage: pkg.name }))}
                  className={`w-full py-3 rounded-full font-bold transition-all duration-300 ${
                    pkg.highlighted
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black shadow-[0_0_20px_rgba(255,193,7,0.3)] hover:shadow-[0_0_30px_rgba(255,193,7,0.5)]'
                      : 'border-2 border-red-600 text-red-600 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 hover:text-white hover:border-orange-500'
                  }`}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="torch-section-standard bg-transparent">
        <div className="torch-container-content mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 backdrop-blur-lg border-2 border-red-900/30 rounded-3xl p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Get Your Business Membership</h3>
              <p className="text-gray-400">Fill out the form below and we'll get back to you with a customized solution.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-spacious">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Company Name *</label>
                  <Input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleFormChange}
                    className="bg-black/50 border-red-900/30 text-white focus:border-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Contact Name *</label>
                  <Input
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleFormChange}
                    className="bg-black/50 border-red-900/30 text-white focus:border-red-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Email *</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="bg-black/50 border-red-900/30 text-white focus:border-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Phone</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="bg-black/50 border-red-900/30 text-white focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Selected Package</label>
                <select
                  name="selectedPackage"
                  value={formData.selectedPackage}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-black/50 border border-red-900/30 text-white rounded-md focus:border-red-500 focus:outline-none"
                >
                  <option value="">Select a package</option>
                  {packages.map(pkg => (
                    <option key={pkg.name} value={pkg.name}>{pkg.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Message *</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  placeholder="Tell us about your business and goals..."
                  className="bg-black/50 border-red-900/30 text-white focus:border-red-500 min-h-[120px]"
                  required
                />
              </div>

              <div className="text-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-12 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Send Message
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="torch-section-standard bg-transparent">
        <div className="torch-container-wide mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to <span className="torch-text-primary">Grow Your Business?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Join hundreds of successful businesses that trust Torch Group for their growth and marketing needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" className="px-8 py-3 border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-full">
                  View All Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 