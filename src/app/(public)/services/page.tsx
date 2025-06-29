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
import { useTiltEffect } from "@/hooks/useTiltEffect";

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

  // Tilt effects for interactive cards
  const serviceTiltRefs = [
    useTiltEffect({ max: 8, scale: 1.03 }),
    useTiltEffect({ max: 8, scale: 1.03 }),
    useTiltEffect({ max: 8, scale: 1.03 }),
    useTiltEffect({ max: 8, scale: 1.03 }),
  ];

  const processTiltRefs = [
    useTiltEffect({ max: 8, scale: 1.03 }),
    useTiltEffect({ max: 8, scale: 1.03 }),
    useTiltEffect({ max: 8, scale: 1.03 }),
    useTiltEffect({ max: 8, scale: 1.03 }),
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

  return (
    <main className="flex flex-col min-h-screen text-white relative overflow-x-hidden pt-20 md:pt-24">
      {/* Animated grid background to match homepage */}
      <SharedTorchBackground />
      
      {/* Hero Section */}
      <section className="torch-section-standard relative bg-transparent pt-8 md:pt-12">
        <div className="torch-container-wide mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center mb-16"
          >
            <div className="torch-section-header mb-8">
              <span className="torch-section-title">WHAT WE DO</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white drop-shadow-lg">
              Our <span className="torch-text-accent">Services</span>
            </h1>
            <div className="flex justify-center mb-6">
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
      <section className="torch-section-standard bg-transparent">
        <div className="torch-container-wide mx-auto">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-generous lg:gap-grand justify-center items-stretch"
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
                description: "Discover our consumer-focused services and e-commerce solutions designed to showcase your creative products and services.",
                icon: <ShoppingCart className="h-16 w-16" />,
                buttonText: "Discover Products",
                href: "/#torch-group"
              },
              {
                title: "B2T", 
                description: "Join our talent network to amplify your online presence, engage with your audience, and grow your professional following.",
                icon: <Star className="h-16 w-16" />,
                buttonText: "Join as Talent",
                href: "/services/b2t"
              },
              {
                title: "B2B",
                description: "Transform your business with our comprehensive membership services designed to expand your market reach and customer base.", 
                icon: <Building2 className="h-16 w-16" />,
                buttonText: "Partner with Us",
                href: "/services/b2b"
              },
              {
                title: "B2A",
                description: "Join our alliance network to collaborate with partners, allies, and creative entities in building innovative digital solutions.",
                icon: <Users className="h-16 w-16" />,
                buttonText: "Join Alliance",
                href: "/services/b2a"
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                ref={serviceTiltRefs[index]}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
                }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="group relative overflow-hidden rounded-2xl bg-black/40 border border-red-900/20 hover:border-red-600/40 transition-all duration-300 flex flex-col items-center justify-between p-8 text-center"
              >
                {/* Icon */}
                <div className="mb-6 text-red-500 group-hover:text-red-400 transition-colors duration-300">
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-red-50 transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mb-6">
                  {service.description}
                </p>

                {/* Button */}
                <Link href={service.href} className="w-full">
                  <button className="w-full bg-red-600/10 hover:bg-red-600/20 border border-red-600/40 hover:border-red-500 text-red-500 hover:text-red-400 py-3 px-6 rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-2">
                    {service.buttonText}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Need Something Specific Section */}
          <div className="mt-grand relative overflow-hidden rounded-3xl bg-gradient-to-br from-black/60 via-red-950/20 to-black/60 border border-red-900/30 p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1),transparent_70%)]" />
            
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="w-full h-full bg-[linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
            </div>

            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Need Something Specific?
                </h2>
                <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                  Don't see exactly what you're looking for? Let's discuss your unique requirements and create a custom solution that perfectly fits your needs.
                </p>
                <Link href="/contact">
                  <button className="group relative inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl transition-all duration-300 overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2 font-medium">
                      Discuss Custom Solutions
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-red-600/20 rounded-full blur-3xl" />
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-600/20 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-comfortable text-white">
              Our <span className="torch-text-primary">Process</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We follow a proven methodology to ensure your project's success from concept to completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Discovery",
                description: "We analyze your business needs, goals, and target audience to create a tailored strategy.",
                icon: <Target className="h-12 w-12" />
              },
              {
                step: "02",
                title: "Strategy",
                description: "Our experts develop a comprehensive plan with clear milestones and deliverables.",
                icon: <BrainCircuit className="h-12 w-12" />
              },
              {
                step: "03",
                title: "Execution",
                description: "We implement the strategy with precision, keeping you informed every step of the way.",
                icon: <Code className="h-12 w-12" />
              },
              {
                step: "04",
                title: "Growth",
                description: "We monitor performance, optimize results, and scale your success continuously.",
                icon: <TrendingUp className="h-12 w-12" />
              }
            ].map((process, index) => (
              <motion.div
                key={process.step}
                ref={processTiltRefs[index]}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative group"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 backdrop-blur-lg border-2 border-red-900/30 rounded-3xl p-8 h-full hover:border-red-600 transition-all duration-500 hover:shadow-red-900/40 hover:shadow-2xl">
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {process.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 w-16 h-16 bg-red-600/30 blur-[20px] rounded-full"></div>
                    <div className="torch-text-primary relative z-10 group-hover:scale-110 transition-transform duration-300">
                      {process.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-comfortable">{process.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{process.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-comfortable text-white">
              Additional <span className="torch-text-primary">Services</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive solutions to support your digital transformation journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Digital Analytics",
                description: "Advanced analytics and reporting to track your digital performance and ROI.",
                icon: <BarChart3 className="h-12 w-12" />,
                features: ["Real-time dashboards", "Custom reporting", "Performance insights", "Data visualization"]
              },
              {
                title: "Technical Support",
                description: "24/7 technical support and maintenance for all your digital assets.",
                icon: <Headphones className="h-12 w-12" />,
                features: ["24/7 availability", "Expert technicians", "Proactive monitoring", "Quick resolution"]
              },
              {
                title: "Training & Consulting",
                description: "Expert guidance and training to help your team maximize digital tools.",
                icon: <Award className="h-12 w-12" />,
                features: ["Team training", "Best practices", "Strategic consulting", "Ongoing support"]
              },
              {
                title: "Security Solutions",
                description: "Comprehensive security measures to protect your digital presence.",
                icon: <Shield className="h-12 w-12" />,
                features: ["Security audits", "Data protection", "Compliance support", "Risk assessment"]
              },
              {
                title: "Mobile Solutions",
                description: "Native and web-based mobile applications for enhanced user experience.",
                icon: <Smartphone className="h-12 w-12" />,
                features: ["iOS & Android apps", "Progressive web apps", "Mobile optimization", "App store deployment"]
              },
              {
                title: "Global Reach",
                description: "International expansion support and multi-language solutions.",
                icon: <Globe className="h-12 w-12" />,
                features: ["Multi-language support", "Global SEO", "Cultural adaptation", "International marketing"]
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 backdrop-blur-lg border-2 border-red-900/30 rounded-3xl p-8 h-full hover:border-red-600 transition-all duration-500 hover:shadow-red-900/40 hover:shadow-2xl">
                  {/* Icon */}
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 w-16 h-16 bg-red-600/30 blur-[20px] rounded-full"></div>
                    <div className="torch-text-primary relative z-10 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-comfortable">{service.title}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{service.description}</p>
                  
                  {/* Features List */}
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-300">
                        <Check className="h-4 w-4 torch-text-primary mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
} 