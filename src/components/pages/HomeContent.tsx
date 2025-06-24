"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowDownIcon, ExternalLink, FileText, Flame, ChevronRight, BarChart3, Users, ArrowUp, Check, X, User, Mail, Phone, MessageSquare, Send, Loader2, Calendar, SkipForward, BookOpen, ShoppingCart, Star, Building2, Zap, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedGridBackground } from "@/components/ui/animated-grid-background";
import { Input } from "@/components/ui/input";
import { motion, useReducedMotion } from "framer-motion";
import { Typewriter } from 'react-simple-typewriter';
import { NewsletterForm } from "@/components/forms/newsletter-form";
import useSWR from "swr";
import BlurText from '@/components/animations/BlurText';
import { GlareHover } from "@/components/animations";
import { Suspense } from "react";
import { Loading } from "@/components/ui/unified-loading";

// Simple throttle function
const throttle = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  return (...args: any[]) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

// Define homepage section type
interface HomepageSection {
  id: string;
  title: string;
  order: number;
  enabled: boolean;
  showInNav?: boolean;
}

interface GlowProps {
  className?: string;
  variant?: "top" | "left" | "right" | "bottom" | "center";
}

// Modern Glow component
const Glow = ({ className, variant = "top" }: GlowProps) => {
  // Mapping of style variants
  const variantStyles = {
    top: "top-0 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] torch-bg-accent-10",
    left: "top-1/2 left-0 -translate-y-1/2 w-[30rem] h-[30rem] torch-bg-accent-10",
    right: "top-1/2 right-0 -translate-y-1/2 w-[30rem] h-[30rem] torch-bg-accent-10",
    bottom: "bottom-0 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] torch-bg-accent-10",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] torch-bg-accent-10",
  };

  return (
    <div
      className={cn(
        "absolute blur-[100px] rounded-full opacity-50",
        variantStyles[variant],
        className
      )}
    />
  );
};

interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

// Section component with consistent styling
const Section = ({ id, children, className }: SectionProps) => (
  <section id={id} className={cn("torch-section-py relative", className)}>
    {children}
  </section>
);

// MediaPreview component for hero section
function MediaPreview() {
  const [imgError, setImgError] = useState(false);
  return imgError ? (
    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="14" fill="#fff" fillOpacity="0.7"/>
        <polygon points="11,9 20,14 11,19" fill="#dc2626" />
      </svg>
    </div>
  ) : (
    <Image
      src="/images/logo.png"
      alt="Media preview"
      fill
      className="object-cover opacity-80"
      onError={() => setImgError(true)}
    />
  );
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function HomeContent() {
  const { data: swrSections } = useSWR('/api/settings/homepage-sections', fetcher);
  const { data: blogPosts } = useSWR('/api/blog?published=true&limit=3', fetcher);
  const [mounted, setMounted] = useState(false);
  
  // Performance: Reduced motion preference
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loading variant="spinner" size="lg" />
      </div>
    );
  }

  return (
    <>
      {/* Animated Grid Background */}
      <AnimatedGridBackground />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="relative z-20 flex flex-1 flex-col items-center justify-center w-full h-full px-4 text-center min-h-screen">
          <motion.div 
            className="flex flex-col items-center justify-center w-full h-full text-center z-20 flex-1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            {/* Enhanced Logo Section */}
            <motion.div 
              className="mb-8 mt-0 relative group flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            >
              {/* Logo */}
              <div className="relative flex items-center justify-center w-[280px] h-[280px]">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/15 via-red-600/20 to-red-700/15 blur-[60px] rounded-full transition-all duration-500 group-hover:blur-[80px] group-hover:from-red-500/20 group-hover:via-red-500/25 group-hover:to-red-600/20 animate-pulse-slow"></div>
                
                <Image 
                  src="/images/logo.png"
                  alt="Torch Logo"
                  width={280}
                  height={280}
                  priority
                  className="object-contain relative z-10 drop-shadow-2xl group-hover:scale-105 group-hover:drop-shadow-[0_0_50px_#dc2626dd] transition-all duration-500 cursor-pointer w-[280px] h-[280px]"
                  style={{ aspectRatio: '1/1' }}
                />
              </div>
            </motion.div>

            {/* Enhanced Main Heading */}
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
            >
              <div className="flex flex-col items-center">
                <span className="block mb-2 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl text-center">
                  Welcome to
                </span>
                <div className="flex justify-center w-full">
                  <span className="relative text-red-500 drop-shadow-2xl">
                    Torch
                    <svg className="absolute left-1/2 transform -translate-x-1/2 -bottom-3 w-full h-4 max-w-[200px]" viewBox="0 0 200 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 12C50 3 150 3 192 8" stroke="url(#gradient)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                        <animate attributeName="stroke-dasharray" from="0,200" to="200,0" dur="1.5s" fill="freeze" begin="0.8s" />
                      </path>
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f97316" />
                          <stop offset="50%" stopColor="#dc2626" />
                          <stop offset="100%" stopColor="#b91c1c" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </div>
              </div>
            </motion.h1>

            {/* Enhanced Tagline */}
            <motion.div 
              className="mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9, ease: 'easeOut' }}
            >
              <BlurText
                text="Every Idea Starts With A Torch"
                className="block text-2xl md:text-3xl lg:text-4xl text-gray-100 font-bold drop-shadow-lg tracking-wide"
                animateBy="words"
                direction="top"
                delay={1000}
                stepDuration={0.4}
                shiny={true}
              />
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
            >
              <Link
                href="#services"
                className="torch-btn torch-btn-cta group z-20 w-full sm:w-auto px-12 py-4 text-lg font-bold rounded-full"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Explore Torch 
                  <ArrowDownIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-1" />
                </span>
              </Link>
              
              <Link
                href="/contact"
                className="torch-btn torch-btn-outline z-20 w-full sm:w-auto px-12 py-4 text-lg font-bold rounded-full"
              >
                Contact Us
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              We offer comprehensive digital solutions to help your business thrive in the modern world.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "B2C Solutions",
                description: "Direct-to-consumer digital experiences that engage and convert.",
                icon: Users,
                href: "/services/b2c"
              },
              {
                title: "B2B Platforms", 
                description: "Enterprise solutions that streamline business operations.",
                icon: Building2,
                href: "/services/b2b"
              },
              {
                title: "B2T Networks",
                description: "Talent-focused platforms connecting skills with opportunities.",
                icon: Star,
                href: "/services/b2t"
              },
              {
                title: "B2A Ecosystems",
                description: "Alliance platforms fostering collaborative partnerships.",
                icon: Zap,
                href: "/services/b2a"
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-6 bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-xl border border-gray-800 rounded-xl shadow-xl hover:shadow-2xl hover:shadow-red-900/20 transition-all duration-300 hover:scale-105"
              >
                <div className="mb-4">
                  <service.icon className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400 mb-4">{service.description}</p>
                <Link 
                  href={service.href}
                  className="inline-flex items-center text-red-400 hover:text-red-300 transition-colors"
                >
                  Learn More <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Blog</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Insights, trends, and thought leadership from our team of experts.
            </p>
          </div>
          
          {blogPosts?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.slice(0, 3).map((post: any, index: number) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative p-6 bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-xl border border-gray-800 rounded-xl shadow-xl hover:shadow-2xl hover:shadow-red-900/20 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-red-400 hover:text-red-300 transition-colors"
                  >
                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-400">Loading blog posts...</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <Suspense fallback={<div className="h-screen bg-black" />}>
        {/* ContactSection /> */}
      </Suspense>
    </>
  );
} 