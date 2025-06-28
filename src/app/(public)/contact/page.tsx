"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, MapPin, Users, MessageCircle, Zap, CheckCircle, Send } from 'lucide-react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { motion } from "framer-motion";
import { AnimatedGridBackground } from "@/components/ui/animated-grid-background";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { ContactForm } from "@/components/forms/contact-form";
import { SharedTorchBackground } from "@/components/ui/animated-grid-background";
import { Button } from "@/components/ui/button";
import { useTiltEffect } from "@/hooks/useTiltEffect";
import Head from "next/head";

export default function ContactPage() {
  // Performance optimizations from homepage
  const [isOlderDevice, setIsOlderDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for older devices or reduced motion preferences
    const checkDeviceCapabilities = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isOlder = /android [1-4]|iphone os [1-9]_|cpu os [1-9]_/.test(userAgent);
      setIsOlderDevice(isOlder);
      
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setPrefersReducedMotion(prefersReduced);
    };

    checkDeviceCapabilities();
  }, []);

  // Tilt effects for interactive cards
  const featureTiltRefs = [
    useTiltEffect({ max: 8, scale: 1.03 }),
    useTiltEffect({ max: 8, scale: 1.03 }),
    useTiltEffect({ max: 8, scale: 1.03 }),
  ];

  return (
    <>
      {/* Enhanced SEO Meta Tags */}
      <Head>
        <title>Contact Torch Group - Get in Touch with Creative Digital Experts | Free Consultation</title>
        <meta name="description" content="Ready to transform your digital presence? Contact Torch Group for expert consultation. We respond within 2-4 hours. Located in Riyadh, serving clients globally with innovative digital solutions." />
        <meta name="keywords" content="contact torch group, digital agency consultation, creative services riyadh, digital transformation contact, torch group email, creative agency contact" />
        <meta property="og:title" content="Contact Torch Group - Get in Touch with Creative Digital Experts" />
        <meta property="og:description" content="Ready to transform your digital presence? Contact Torch Group for expert consultation. We respond within 2-4 hours." />
        <meta property="og:type" content="website" />
        <meta property="twitter:title" content="Contact Torch Group - Get in Touch with Creative Digital Experts" />
        <meta property="twitter:description" content="Ready to transform your digital presence? Contact Torch Group for expert consultation. We respond within 2-4 hours." />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              "mainEntity": {
                "@type": "Organization",
                "name": "Torch Group",
                "email": "ask@torchgroup.co",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Riyadh",
                  "addressCountry": "Saudi Arabia"
                },
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "customer service",
                  "email": "ask@torchgroup.co",
                  "availableLanguage": ["English", "Arabic"]
                }
              }
            })
          }}
        />
      </Head>

    <main className="flex flex-col min-h-screen text-white relative overflow-x-hidden pt-20 md:pt-24">
        {/* Accessibility: Landmark regions */}
        <div className="sr-only">
          <h1>Contact Torch Group - Get in Touch with Creative Digital Experts</h1>
          <nav aria-label="Page sections">
            <ul>
              <li><a href="#hero">Contact Introduction</a></li>
              <li><a href="#contact-details">Contact Information</a></li>
              <li><a href="#contact-form">Contact Form</a></li>
              <li><a href="#why-choose-us">Why Choose Us</a></li>
              <li><a href="#cta">Call to Action</a></li>
            </ul>
          </nav>
        </div>

      {/* Animated grid background */}
      <SharedTorchBackground />

      {/* Enhanced Hero Section */}
      <section className="torch-section-standard relative bg-transparent pt-8 md:pt-12">
        <div className="torch-container-wide mx-auto relative z-10 text-center">
          {/* Animated badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/60 border torch-border-accent-30 rounded-full mb-8 backdrop-blur-sm">
            <MessageCircle className="w-4 h-4 torch-text-accent" />
            <span className="text-sm font-medium text-gray-300">Ready to start your project?</span>
          </div>
          
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 text-white tracking-tight group cursor-default"
              whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
              } : {}}
            >
              <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
            Let's Create Something
              </span>
              <span className="block torch-text-accent relative group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)]">
              Amazing Together
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-full transition-all duration-500 ease-out"></span>
            </span>
            </motion.h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Whether you have a groundbreaking idea, need expert consultation, or want to discuss partnership opportunities – 
            we're here to transform your vision into extraordinary digital experiences.
          </p>
          
          {/* Quick response promise */}
          <div className="flex items-center justify-center gap-2 mt-8 text-sm text-gray-400">
            <CheckCircle className="w-4 h-4 torch-text-accent" />
            <span>We typically respond within 2-4 hours</span>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Details and Form Section */}
        <section className="torch-section-standard bg-transparent relative" id="contact-details">
        {/* Improved background glow effect */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
          <div className="w-full max-w-6xl h-[800px] bg-gradient-to-br from-red-600/20 via-red-500/10 to-red-700/15 blur-[120px] rounded-3xl animate-pulse-slow"></div>
        </div>
        
        <div className="torch-container-wide mx-auto grid grid-cols-1 lg:grid-cols-2 gap-spacious lg:gap-grand relative z-10">
                     {/* Enhanced Contact Details */}
           <div className="space-y-generous">
            {/* Main Contact Card */}
            <div className="p-8 bg-gradient-to-br from-black/95 via-black/90 to-black/95 backdrop-blur-2xl rounded-3xl border torch-border-accent-30 hover:border-red-500/50 hover:shadow-red-500/20 transition-all duration-700 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-red-500/8 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full torch-bg-accent/20 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 torch-text-accent" />
                  </div>
                    <motion.h2 
                      className="text-2xl font-bold text-white tracking-tight group cursor-default"
                      whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                        scale: 1.02,
                        transition: { duration: 0.3, ease: "easeOut" }
                      } : {}}
                    >
                      <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                        Contact
                      </span>{" "}
                      <span className="torch-text-accent relative group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)]">
                        Information
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-full transition-all duration-500 ease-out"></span>
                      </span>
                    </motion.h2>
                </div>
                
                                 {/* Company Info */}
                 <div className="mb-8 p-6 bg-gradient-to-r from-red-600/10 to-transparent rounded-xl border-l-4 torch-border-accent">
                   <h3 className="text-xl font-bold torch-text-accent mb-2">TORCH Group</h3>
                   <p className="text-gray-300 mb-3">Creative Digital Solutions</p>
                   <p className="text-sm text-gray-400 leading-relaxed">
                     We specialize in transforming ambitious ideas into powerful digital experiences through innovative design, cutting-edge technology, and strategic thinking.
                   </p>
                 </div>

                {/* Contact Methods */}
                <div className="space-y-comfortable">
                  <div className="flex items-center p-4 bg-black/40 rounded-xl hover:bg-black/60 transition-colors group/item">
                    <div className="w-10 h-10 rounded-lg torch-bg-accent/20 flex items-center justify-center mr-4">
                      <Mail className="h-5 w-5 torch-text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <a href="mailto:ask@torchgroup.co" className="text-white hover:torch-text-accent transition-colors">
                        ask@torchgroup.co
                      </a>
                    </div>
                  </div>
                  
                                     <div className="flex items-center p-4 bg-black/40 rounded-xl hover:bg-black/60 transition-colors group/item">
                     <div className="w-10 h-10 rounded-lg torch-bg-accent/20 flex items-center justify-center mr-4">
                       <MapPin className="h-5 w-5 torch-text-accent" />
                     </div>
                     <div>
                       <p className="text-sm text-gray-400">Location</p>
                       <span className="text-white">Riyadh, Saudi Arabia</span>
                     </div>
                   </div>
                </div>

                                 {/* Social Media */}
                 <div className="mt-8 pt-6 border-t border-red-600/30">
                   <p className="text-sm text-gray-400 mb-6">Connect with us</p>
                   <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                     {[
                       { name: "Facebook", href: "https://facebook.com/torchgroup", icon: Facebook },
                       { name: "Instagram", href: "https://instagram.com/torchgroup", icon: Instagram },
                       { name: "Twitter", href: "https://twitter.com/torchgroup", icon: Twitter },
                       { name: "LinkedIn", href: "https://linkedin.com/company/torchgroup", icon: Linkedin },
                     ].map((item) => (
                       <Link
                         key={item.name}
                         href={item.href}
                         className="flex items-center gap-3 p-3 rounded-lg bg-black/40 hover:torch-bg-accent/20 hover:border-red-500/30 border border-transparent text-gray-400 hover:text-white transition-all duration-300 group min-h-10 px-4 py-2"
                         target="_blank"
                         rel="noopener noreferrer"
                          aria-label={`Follow Torch Group on ${item.name}`}
                       >
                         <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                         <span className="text-sm font-medium">{item.name}</span>
                       </Link>
                     ))}
                   </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Enhanced Contact Form */}
            <div className="p-6 md:p-8 bg-gradient-to-br from-black/95 via-black/90 to-black/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-red-600/20 border border-red-600/30 hover:border-red-500/50 hover:shadow-red-500/30 transition-all duration-700 relative group" id="contact-form">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-red-500/8 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full torch-bg-accent/20 flex items-center justify-center">
                  <Send className="w-5 h-5 torch-text-accent" />
                </div>
                  <motion.h2 
                    className="text-xl md:text-2xl font-bold text-white tracking-tight group cursor-default"
                    whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                      scale: 1.02,
                      transition: { duration: 0.3, ease: "easeOut" }
                    } : {}}
                  >
                    <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                      Send us a
                    </span>{" "}
                    <span className="torch-text-accent relative group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)]">
                      Message
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-full transition-all duration-500 ease-out"></span>
                    </span>
                  </motion.h2>
              </div>
              
                             <p className="text-gray-400 mb-6 text-sm">
                 Share your project details with us and we'll get back to you within 24 hours. For urgent inquiries, please call us directly.
               </p>
              
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
        <section className="torch-section-standard bg-transparent relative" id="why-choose-us">
        <div className="torch-container-wide mx-auto">
          <div className="text-center mb-grand">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-generous text-white tracking-tight group cursor-default"
                whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                } : {}}
              >
                <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                  Why Work With
                </span>{" "}
                <span className="torch-text-accent relative group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)]">
                  TORCH?
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-full transition-all duration-500 ease-out"></span>
                </span>
              </motion.h2>
            <p className="text-gray-400 torch-container-content mx-auto">
              We're not just another digital agency. We're your strategic partner in digital transformation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-generous lg:gap-grand">
            {[
                             {
                 icon: Zap,
                 title: "Lightning Fast Response",
                 description: "We respond to all inquiries within 2-4 hours, ensuring your project maintains momentum from day one."
               },
               {
                 icon: Users,
                 title: "Expert Team",
                 description: "Our diverse team of designers, developers, and strategists brings deep expertise and fresh perspectives to every project."
               },
              {
                icon: CheckCircle,
                title: "Proven Results",
                                 description: "Our diverse portfolio spans industries and technologies, with a proven track record of turning ambitious visions into successful realities."
              }
            ].map((feature, index) => (
                <motion.div 
                  key={index} 
                  ref={featureTiltRefs[index]}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="p-6 bg-black/60 backdrop-blur-sm rounded-2xl border border-red-600/20 hover:border-red-500/40 hover:shadow-red-500/20 transition-all duration-500 group min-h-10 px-4 py-2"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="w-12 h-12 rounded-xl torch-bg-accent/20 flex items-center justify-center mb-comfortable group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 torch-text-accent" />
                </div>
                  <h3 className="text-lg font-semibold text-white mb-cozy">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed text-base sm:text-lg md:text-xl">{feature.description}</p>
                </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
        <section className="torch-section-standard bg-transparent relative" id="cta">
        <div className="torch-container-content mx-auto text-center">
          <div className="p-8 md:p-12 bg-gradient-to-br from-red-600/20 via-red-500/10 to-red-700/20 backdrop-blur-xl rounded-3xl border border-red-600/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-red-500/10 to-red-600/5 animate-pulse-slow"></div>
            
            <div className="relative z-10">
                <motion.h2 
                  className="text-2xl md:text-3xl font-bold mb-comfortable text-white tracking-tight group cursor-default"
                  whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" }
                  } : {}}
                >
                  <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    Ready to start your
                  </span>{" "}
                  <span className="torch-text-accent relative group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)]">
                    project?
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-full transition-all duration-500 ease-out"></span>
                  </span>
                </motion.h2>
                <p className="text-gray-300 mb-generous max-w-2xl mx-auto">
                  Join hundreds of satisfied clients who have transformed their digital presence with Torch Group. 
                  Let's create something extraordinary together.
               </p>
              
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <Link
                    href="#contact-form"
                    className="torch-bg-primary hover:torch-bg-primary-hover text-white px-8 py-3 text-lg font-bold rounded-full inline-flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    aria-label="Go to contact form"
                  >
                    Start Your Project
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="mailto:ask@torchgroup.co"
                    className="border-2 border-red-500/50 hover:border-red-400 text-white px-8 py-3 text-lg font-bold rounded-full inline-flex items-center transition-colors hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    aria-label="Send email to Torch Group"
                  >
                    Email Us Directly
                    <Mail className="ml-2 h-5 w-5" />
                  </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  );
} 