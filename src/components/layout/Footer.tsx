"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Flame, ArrowRight, Mail, MapPin, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnimatedFadeIn } from "@/components/ui/animated-fade-in";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { siteConfig } from "@/config/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <footer className="bg-transparent text-white relative mt-8 sm:mt-12">
      {/* Email subscription section */}
      <AnimatedFadeIn animation="slide-up" delay={0.1}>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 md:py-12 relative">
          <div className="border border-red-900/30 bg-gradient-to-r from-red-950/30 via-black to-red-950/30 p-4 sm:p-6 md:p-10 relative overflow-hidden rounded-md">
            {/* Animated glow effect */}
            <div className="absolute -top-1/2 left-1/4 w-1/2 h-60 bg-red-600/10 blur-[100px] animate-pulse-slow"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 relative z-10">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">Stay Connected</h3>
                <p className="text-gray-200 mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
                  Subscribe to our newsletter to receive the latest updates, industry insights, and exclusive offers.
                </p>
                
                <div className="max-w-md">
                  <NewsletterForm variant="inline" />
                </div>
              </div>
              
              <div className="border-t md:border-t-0 md:border-l border-gray-800/30 pt-4 md:pt-0 md:pl-8 hidden md:block">
                <div className="flex items-center mb-4">
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 mr-3">
                    <div className="absolute inset-0 bg-red-600/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Image 
                      src="/images/torch_group_logo.png"
                      alt="Torch Group"
                      fill
                      sizes="2.5rem"
                      className="object-contain"
                    />
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold text-white">Torch Group</h4>
                </div>
                <p className="text-gray-200 text-sm sm:text-base">
                  Empowering businesses through innovative digital solutions and strategic partnerships. 
                  We are committed to helping you achieve your business goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedFadeIn>
      
      {/* Main footer content with improved grid layout */}
      <div className="max-w-7xl mx-auto px-4">
        <div 
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 sm:gap-x-8 sm:gap-y-10 border border-gray-800/30 rounded-md p-4 sm:p-6 md:p-8 transition-all duration-1000 bg-black/40 footer-grid",
            mounted ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Company Info */}
          <AnimatedFadeIn animation="fade-in" delay={0.2}>
            <div className="mb-3 sm:mb-5">
              <div className="relative w-12 sm:w-14 h-12 sm:h-14 group mb-3 sm:mb-4">
                <div className="absolute inset-0 bg-red-600/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Image 
                  src="/images/torch_group_logo.png"
                  alt="Torch Group"
                  fill
                  sizes="(max-width: 640px) 3rem, 3.5rem"
                  className="object-contain relative z-10"
                />
              </div>
              <h4 className="text-lg font-bold mb-3 text-white">Torch Group</h4>
            </div>
            <p className="text-gray-200 text-sm sm:text-base mb-5 sm:mb-6 max-w-xs">
              Empowering businesses through innovative digital solutions and strategic partnerships.
            </p>
            <div className="flex flex-wrap gap-3">
              {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="bg-gray-900/60 hover:bg-gray-800 p-2 rounded-md flex items-center justify-center 
                           w-8 h-8 sm:w-9 sm:h-9 transition-colors border border-gray-800 hover:border-gray-700 touch-manipulation"
                  aria-label={`Visit our ${social} page`}
                >
                  <svg className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    {social === 'facebook' && <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />}
                    {social === 'twitter' && <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />}
                    {social === 'linkedin' && <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />}
                    {social === 'instagram' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />}
                  </svg>
                </a>
              ))}
            </div>
          </AnimatedFadeIn>

          {/* Quick Links */}
          <AnimatedFadeIn animation="fade-in" delay={0.3}>
            <h4 className="text-base font-semibold text-white mb-3 sm:mb-6 flex items-center footer-heading">
              <div className="w-4 h-0.5 bg-red-600 mr-2"></div>
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-4">
              {[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                { label: 'Services', href: '/services' },
                { label: 'Projects', href: '/projects' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/contact' }
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-200 hover:text-red-400 transition-colors text-sm sm:text-base flex items-center group min-h-[32px] sm:min-h-[36px] touch-manipulation"
                  >
                    <span className="h-0.5 w-0 bg-red-600 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </AnimatedFadeIn>

          {/* Contact Info */}
          <AnimatedFadeIn animation="fade-in" delay={0.4}>
            <h4 className="text-base font-semibold text-white mb-3 sm:mb-6 flex items-center footer-heading">
              <div className="w-4 h-0.5 bg-red-600 mr-2"></div>
              Contact Us
            </h4>
            <address className="not-italic text-gray-200 text-sm sm:text-base">
              <div className="flex items-start mb-4 sm:mb-6">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="mb-1">{siteConfig.contactInfo.address}</p>
                </div>
              </div>
              <div className="flex items-center mb-4 sm:mb-6">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2 sm:mr-3 flex-shrink-0" />
                <a href={`mailto:${siteConfig.contactInfo.email}`} className="text-red-400 hover:text-red-300 transition-colors">
                  {siteConfig.contactInfo.email}
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2 sm:mr-3 flex-shrink-0" />
                <p>(123) 456-7890</p>
              </div>
            </address>
          </AnimatedFadeIn>
          
          {/* Legal Links */}
          <AnimatedFadeIn animation="fade-in" delay={0.5}>
            <h4 className="text-base font-semibold text-white mb-3 sm:mb-6 flex items-center footer-heading">
              <div className="w-4 h-0.5 bg-red-600 mr-2"></div>
              Legal
            </h4>
            <ul className="space-y-2 sm:space-y-4">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Cookie Policy', href: '/cookies' },
                { label: 'Disclaimer', href: '/disclaimer' }
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-200 hover:text-red-400 transition-colors text-sm sm:text-base flex items-center group min-h-[32px] sm:min-h-[36px] touch-manipulation"
                  >
                    <span className="h-0.5 w-0 bg-red-600 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </AnimatedFadeIn>
        </div>
        
        {/* Copyright section */}
        <AnimatedFadeIn animation="slide-up" delay={0.6}>
          <div 
            className={cn(
              "mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12 border-t border-gray-800/30 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4",
              "transition-all duration-1000 animation-delay-200",
              mounted ? "opacity-100" : "opacity-0"
            )}
          >
            <p className="text-gray-300 text-xs sm:text-sm text-center md:text-left">© {currentYear} Torch Group. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8">
              <Link href="/privacy" className="text-gray-400 hover:text-gray-200 text-xs sm:text-sm whitespace-nowrap">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-gray-200 text-xs sm:text-sm whitespace-nowrap">
                Terms
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-gray-200 text-xs sm:text-sm whitespace-nowrap">
                Cookies
              </Link>
            </div>
          </div>
        </AnimatedFadeIn>
      </div>
    </footer>
  );
} 