'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, ShoppingCart, Star, Building2, Users, Mail, Phone, Globe, MapPin, Calendar, Clock } from "lucide-react";
import { SharedTorchBackground } from "@/components/ui/animated-grid-background";

export default function ServicesPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    package: '',
    message: ''
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
            <div className="inline-flex items-center justify-center mb-6">
              <div className="h-px w-8 bg-red-600/80 mr-2"></div>
              <span className="text-red-500 text-base font-bold tracking-widest">WHAT WE DO</span>
              <div className="h-px w-8 bg-red-600/80 ml-2"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg">
              Our <span className="text-red-600">Services</span>
            </h1>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
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

      {/* Main Services Grid */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-14 justify-center items-stretch mb-16"
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
                id: "b2c",
                title: "B2C",
                subtitle: "Business To Customers",
                description: "Enjoy with Our Torch Group Services & e commerce will help your creative products & services that fit your needs",
                icon: <ShoppingCart className="h-16 w-16" />,
                buttonText: "Discover More",
                status: "coming-soon"
              },
              {
                id: "b2t", 
                title: "B2T",
                subtitle: "Business To Talents",
                description: "Our Talents membership services will help your content grow online/offline engagement & attract more audience & Followers",
                icon: <Star className="h-16 w-16" />,
                buttonText: "Get your Membership",
                status: "coming-soon"
              },
              {
                id: "b2b",
                title: "B2B",
                subtitle: "Business To Businesses", 
                description: "Our entities/brands membership services will help your business grow online/offline & attract more audience & customers",
                icon: <Building2 className="h-16 w-16" />,
                buttonText: "Get your Membership",
                status: "available"
              },
              {
                id: "b2a",
                title: "B2A",
                subtitle: "Business to All Allies",
                description: "Connect, collaborate, and grow with our network of partners, allies, and creative entities.",
                icon: <Users className="h-16 w-16" />,
                buttonText: "Learn More",
                status: "coming-soon"
              }
            ].map((service, index) => (
              <motion.div
                key={service.id}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
                }}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: '0 0 40px 8px #dc2626aa'
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative overflow-hidden rounded-3xl backdrop-blur-lg shadow-2xl transition-all duration-500 animate-fade-in flex flex-col items-center justify-between min-h-[380px] border-2 border-red-900/30 bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 hover:border-red-600 hover:shadow-red-900/40 hover:shadow-2xl"
                style={{ animationDelay: `${index * 0.08 + 0.1}s` }}
              >
                {/* Status Badge */}
                {service.status === "coming-soon" && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center gap-1 px-3 py-1 bg-red-600/20 border border-red-500/40 rounded-full">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      <span className="text-red-400 text-xs font-semibold">COMING SOON</span>
                    </div>
                  </div>
                )}

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
                  <h3 className="text-2xl font-bold mb-2 tracking-tight drop-shadow-lg transition-colors duration-300 text-white group-hover:text-red-100">
                    {service.title}
                  </h3>
                  <p className="text-red-500 text-sm font-semibold mb-3 uppercase tracking-wide">
                    {service.subtitle}
                  </p>
                  <p className="text-base leading-relaxed min-h-[80px] transition-colors duration-300 text-gray-300 group-hover:text-gray-200">
                    {service.description}
                  </p>
                </div>
                
                {/* Button */}
                <div className="p-8 pt-0 flex items-center justify-center w-full relative z-10">
                  {service.status === "coming-soon" ? (
                    <div className="flex items-center gap-2 px-6 py-3 bg-gray-800/50 border border-gray-600/40 text-gray-400 text-sm rounded-full font-semibold backdrop-blur-sm">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                      Coming Soon
                    </div>
                  ) : (
                    <a href={`#${service.id}`} className="px-8 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 border border-red-500/20 backdrop-blur-sm transform hover:scale-105 hover:from-red-500 hover:to-red-600">
                      {service.buttonText}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* B2B Detailed Section */}
      <section id="b2b" className="py-20 px-4 md:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center mb-6">
              <div className="h-px w-8 bg-red-600/80 mr-2"></div>
              <span className="text-red-500 text-base font-bold tracking-widest">BUSINESS TO BUSINESS</span>
              <div className="h-px w-8 bg-red-600/80 ml-2"></div>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-lg">
              B2B <span className="text-red-600">Packages</span>
            </h2>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
            </div>
            <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-2">
              Professional membership services to accelerate your business growth
            </p>
          </motion.div>

          {/* Company Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 backdrop-blur-lg border-2 border-red-900/30 rounded-3xl p-8 mb-16 shadow-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex items-center gap-3">
                <Globe className="h-6 w-6 text-red-500" />
                <div>
                  <p className="text-sm text-gray-400">Website</p>
                  <p className="text-white font-semibold">www.torchgroup.co</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-red-500" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white font-semibold">ask@torchgroup.co</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-6 w-6 text-red-500" />
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-white font-semibold">+966 550 848 368</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-red-500" />
                <div>
                  <p className="text-sm text-gray-400">Copyright</p>
                  <p className="text-white font-semibold">TORCH - 2024</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Service Packages */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Bronze Package */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group relative overflow-hidden rounded-3xl backdrop-blur-lg shadow-2xl transition-all duration-500 border-2 border-orange-900/30 bg-gradient-to-br from-black/90 via-orange-950/20 to-black/90 hover:border-orange-600 hover:shadow-orange-900/40 hover:shadow-2xl"
            >
              <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
              </div>
              
              <div className="p-8 relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-orange-400 mb-2">Bronze Package</h3>
                  <p className="text-gray-300">Perfect for startups</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Social Media Marketing on 2 platforms with 2 campaigns</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Content Distribution Plan (2 platforms)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Performance & Growth Reports</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Sponsorships & Partnerships (up to 15%)</span>
                  </li>
                </ul>
                
                <button 
                  onClick={() => setSelectedPackage('bronze')}
                  className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-orange-500 hover:to-orange-600 transform hover:scale-105"
                >
                  Select Bronze
                </button>
              </div>
            </motion.div>

            {/* Silver Package */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative overflow-hidden rounded-3xl backdrop-blur-lg shadow-2xl transition-all duration-500 border-2 border-gray-600/30 bg-gradient-to-br from-black/90 via-gray-800/20 to-black/90 hover:border-gray-400 hover:shadow-gray-600/40 hover:shadow-2xl transform scale-105"
            >
              <div className="absolute top-4 right-4 z-10">
                <div className="flex items-center gap-1 px-3 py-1 bg-blue-600/20 border border-blue-500/40 rounded-full">
                  <span className="text-blue-400 text-xs font-semibold">POPULAR</span>
                </div>
              </div>
              
              <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
              </div>
              
              <div className="p-8 relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-300 mb-2">Silver Package</h3>
                  <p className="text-gray-300">Best for growing businesses</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Social Media Marketing on 4 platforms with 4 campaigns</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Content Distribution & SEO Optimization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Media Exposure & Performance Reports</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">2 Business Consultations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Sponsorships & Partnerships (up to 10%)</span>
                  </li>
                </ul>
                
                <button 
                  onClick={() => setSelectedPackage('silver')}
                  className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-gray-500 hover:to-gray-600 transform hover:scale-105"
                >
                  Select Silver
                </button>
              </div>
            </motion.div>

            {/* Gold Package */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group relative overflow-hidden rounded-3xl backdrop-blur-lg shadow-2xl transition-all duration-500 border-2 border-yellow-600/30 bg-gradient-to-br from-black/90 via-yellow-900/20 to-black/90 hover:border-yellow-500 hover:shadow-yellow-600/40 hover:shadow-2xl"
            >
              <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
              </div>
              
              <div className="p-8 relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-2">Gold Package</h3>
                  <p className="text-gray-300">Premium for enterprises</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Social Media Marketing on 6 platforms with 6 campaigns</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Full Content Distribution & SEO Optimization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Media Exposure & Complete Reports</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Legal & 4 Business Consultations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Special Offers & Partnerships (up to 10%)</span>
                  </li>
                </ul>
                
                <button 
                  onClick={() => setSelectedPackage('gold')}
                  className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-yellow-500 hover:to-yellow-600 transform hover:scale-105"
                >
                  Select Gold
                </button>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          {selectedPackage && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 backdrop-blur-lg border-2 border-red-900/30 rounded-3xl p-8 shadow-2xl"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Get Started with {selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1)} Package</h3>
                <p className="text-gray-400">Fill out the form below and we'll get back to you within 24 hours</p>
              </div>
              
              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company Name *</label>
                  <input 
                    type="text" 
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="Enter your company name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Selected Package</label>
                  <input 
                    type="text" 
                    value={selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1) + ' Package'}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Additional Message</label>
                  <textarea 
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your project requirements..."
                  />
                </div>
                <div className="md:col-span-2 flex gap-4">
                  <button 
                    type="submit"
                    className="flex-1 px-8 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-red-500 hover:to-red-600 transform hover:scale-105"
                  >
                    Submit Request
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSelectedPackage(null)}
                    className="px-8 py-3 rounded-full border border-gray-600 text-gray-300 font-bold hover:bg-gray-800 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </section>

      {/* Coming Soon Sections */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* B2C Coming Soon */}
            <div id="b2c" className="bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 backdrop-blur-lg border-2 border-red-900/30 rounded-3xl p-8 text-center shadow-2xl">
              <ShoppingCart className="h-16 w-16 text-red-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">B2C Services</h3>
              <p className="text-gray-400 mb-6">Our customer-focused solutions are being developed to help you connect directly with your audience.</p>
              <div className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600/20 border border-red-500/40 rounded-full">
                <Clock className="h-4 w-4 text-red-400" />
                <span className="text-red-400 text-sm font-semibold">Coming Soon</span>
              </div>
            </div>

            {/* B2T Coming Soon */}
            <div id="b2t" className="bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 backdrop-blur-lg border-2 border-red-900/30 rounded-3xl p-8 text-center shadow-2xl">
              <Star className="h-16 w-16 text-red-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">B2T Services</h3>
              <p className="text-gray-400 mb-6">Specialized talent management services to help creators and influencers grow their reach and engagement.</p>
              <div className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600/20 border border-red-500/40 rounded-full">
                <Clock className="h-4 w-4 text-red-400" />
                <span className="text-red-400 text-sm font-semibold">Coming Soon</span>
              </div>
            </div>

            {/* B2A Coming Soon */}
            <div id="b2a" className="bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 backdrop-blur-lg border-2 border-red-900/30 rounded-3xl p-8 text-center shadow-2xl">
              <Users className="h-16 w-16 text-red-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">B2A Services</h3>
              <p className="text-gray-400 mb-6">Alliance and partnership services to expand your network and create collaborative opportunities.</p>
              <div className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600/20 border border-red-500/40 rounded-full">
                <Clock className="h-4 w-4 text-red-400" />
                <span className="text-red-400 text-sm font-semibold">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 backdrop-blur-lg border-2 border-red-900/30 rounded-3xl p-8 md:p-12 shadow-2xl text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Ready to elevate your business?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join the growing number of businesses that trust TORCH Group to ignite their digital transformation and accelerate their growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="px-8 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-red-500 hover:to-red-600 transform hover:scale-105 inline-flex items-center justify-center"
              >
                Get in touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link 
                href="/about" 
                className="px-8 py-3 rounded-full border border-red-600 text-red-400 font-bold hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
              >
                Learn More About Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 