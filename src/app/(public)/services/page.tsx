"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap, Mail, LineChart, Users, BrainCircuit, Code, Smartphone, BarChart3, Flame, ShoppingCart, Star, Building2, Check, Send, User, Phone, MessageSquare, Globe, Award, Shield, Target, Headphones, TrendingUp } from "lucide-react";
import { SharedTorchBackground } from "@/components/ui/animated-grid-background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ServicesPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    message: '',
    selectedPackage: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <main className="flex flex-col min-h-screen text-white relative overflow-x-hidden">
      {/* Animated grid background to match homepage */}
      <SharedTorchBackground />
      
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 relative bg-transparent">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center mb-12"
          >
            <div className="torch-section-header mb-6">
              <span className="torch-section-title">WHAT WE DO</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg">
              Our <span className="torch-text-accent">Services</span>
            </h1>
            <div className="flex justify-center mb-4">
              <div className="torch-divider"></div>
            </div>
            <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-2">
              Comprehensive digital solutions to ignite your brand and accelerate growth.
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              We offer everything you need to succeed in the digital landscape.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services Section - Same cards as homepage */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-14 justify-center items-stretch"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
          >
            {[
              {
                title: "B2C",
                description: "Enjoy with Our Torch Group Services & e commerce will help your creative products & services that fit your needs",
                icon: <ShoppingCart className="h-16 w-16" />,
                link: "#b2c"
              },
              {
                title: "B2T", 
                description: "Our Talents membership services will help your content grow online/offline engagement & attract more audience & Followers",
                icon: <Star className="h-16 w-16" />,
                link: "#b2t"
              },
              {
                title: "B2B",
                description: "Our entities/brands membership services will help your business grow online/offline & attract more audience & customers", 
                icon: <Building2 className="h-16 w-16" />,
                link: "#b2b"
              },
              {
                title: "B2A",
                description: "Business to All Allies Connect, collaborate, and grow with our network of partners, allies, and creative entities.",
                icon: <Users className="h-16 w-16" />,
                link: "#b2a"
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
                }}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: '0 0 40px 8px #dc2626aa'
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative overflow-hidden rounded-3xl backdrop-blur-lg shadow-2xl transition-all duration-500 animate-fade-in flex flex-col items-center justify-between min-h-[320px] border-2 border-red-900/30 bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 hover:border-red-600 hover:shadow-red-900/40 hover:shadow-2xl"
                style={{ animationDelay: `${index * 0.08 + 0.1}s` }}
              >
                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 opacity-5">
                  <div className="w-full h-full bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                </div>

                {/* Content area */}
                <div className="p-8 pt-12 flex flex-col items-center text-center w-full flex-grow relative z-10">
                  {/* Icon with glow */}
                  <div className="mb-6 relative flex items-center justify-center">
                    <div className="absolute inset-0 w-20 h-20 bg-red-600/50 blur-[40px] rounded-full transition-all duration-500 group-hover:blur-[60px] group-hover:bg-red-500/60"></div>
                    <div className="w-20 h-20 flex items-center justify-center relative z-10">
                      <div className="text-red-600 drop-shadow-2xl transition-all duration-500 group-hover:scale-110 relative z-10">
                        {service.icon}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight drop-shadow-lg transition-colors duration-300 text-white group-hover:text-red-100">
                    {service.title}
                  </h3>
                  <p className="text-base leading-relaxed min-h-[60px] transition-colors duration-300 text-gray-300 group-hover:text-gray-200">
                    {service.description}
                  </p>
                </div>
                
                {/* Button */}
                <div className="p-8 pt-0 flex items-center justify-center w-full relative z-10">
                  <a href={service.link}>
                    <button className="px-8 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 border border-red-500/20 backdrop-blur-sm transform hover:scale-105 hover:from-red-500 hover:to-red-600">
                      {service.title === "B2T" ? "Get your Membership" : service.title === "B2B" ? "Get your Membership" : service.title === "B2A" ? "Join Alliance" : "Discover More"}
                    </button>
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* B2C Section */}
      <section id="b2c" className="py-16 px-4 md:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Business to <span className="text-red-600">Customers</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover our Torch Group brands and e-commerce solutions designed for your creative products and services.
            </p>
          </div>
          <div className="text-center">
            <Link href="/#torch-group">
              <button className="px-8 py-4 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 border border-red-500/20 backdrop-blur-sm transform hover:scale-105 hover:from-red-500 hover:to-red-600">
                Explore Torch Group Brands
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* B2B Section - Detailed Packages */}
      <section id="b2b" className="py-16 px-4 md:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Business to <span className="text-red-600">Business</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Our entities/brands membership services will help your business grow online/offline & attract more audience & customers.
            </p>
          </div>

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
                  <div className="text-red-500 text-xl font-bold">{pkg.price}</div>
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => setFormData(prev => ({ ...prev, selectedPackage: pkg.name }))}
                  className={`w-full py-3 rounded-full font-bold transition-all duration-300 ${
                    pkg.highlighted
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
                  }`}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>

          {/* B2B Contact Form */}
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

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  <label className="block text-white font-semibold mb-2">Phone *</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="bg-black/50 border-red-900/30 text-white focus:border-red-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Package Interest</label>
                <select
                  name="selectedPackage"
                  value={formData.selectedPackage}
                  onChange={handleFormChange}
                  className="w-full bg-black/50 border border-red-900/30 text-white rounded-lg px-4 py-3 focus:border-red-500 focus:outline-none"
                >
                  <option value="">Select a package</option>
                  <option value="Bronze Package">Bronze Package</option>
                  <option value="Silver Package">Silver Package</option>
                  <option value="Gold Package">Gold Package</option>
                  <option value="Custom Solution">Custom Solution</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Message</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  rows={4}
                  className="bg-black/50 border-red-900/30 text-white focus:border-red-500"
                  placeholder="Tell us about your business needs..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-4 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                {isSubmitting ? "Submitting..." : "Get Started"}
                {!isSubmitting && <Send className="ml-2 h-5 w-5" />}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* B2T Section - Coming Soon */}
      <section id="b2t" className="py-16 px-4 md:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 backdrop-blur-lg border-2 border-red-900/30 rounded-3xl p-12"
          >
            <Star className="h-20 w-20 text-red-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Business to <span className="text-red-600">Talents</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Our Talents membership services will help your content grow online/offline engagement & attract more audience & Followers.
            </p>
            <div className="flex items-center justify-center gap-2 px-6 py-3 bg-red-800/50 border border-red-600/40 text-red-400 text-lg rounded-full font-semibold backdrop-blur-sm max-w-fit mx-auto">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              Coming Soon
            </div>
          </motion.div>
        </div>
      </section>

      {/* B2A Section - Coming Soon */}
      <section id="b2a" className="py-16 px-4 md:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 backdrop-blur-lg border-2 border-red-900/30 rounded-3xl p-12"
          >
            <Users className="h-20 w-20 text-red-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Business to <span className="text-red-600">All Allies</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Connect, collaborate, and grow with our network of partners, allies, and creative entities. Join our alliance for mutual growth and success.
            </p>
            <div className="flex items-center justify-center gap-2 px-6 py-3 bg-red-800/50 border border-red-600/40 text-red-400 text-lg rounded-full font-semibold backdrop-blur-sm max-w-fit mx-auto">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              Coming Soon
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-red-950/30 via-black/90 to-red-950/30 backdrop-blur-lg border-2 border-red-900/30 p-8 md:p-12 rounded-3xl"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Ready to elevate your digital presence?</h2>
              <p className="text-gray-400 mb-8">
                Contact us today to discuss how our services can help your business reach new heights.
              </p>
              <Link href="/contact">
                <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-8 py-4 rounded-full inline-flex items-center transition-all duration-300 transform hover:scale-105 font-bold shadow-lg hover:shadow-xl">
                  Get in touch
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 