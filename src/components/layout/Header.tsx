"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { href: '/#services', label: 'Services', highlight: false },
    { href: '/#torch-group', label: 'About Torch', highlight: false },
    { href: '/blog', label: 'Blog', highlight: false },
    { href: '/#torch-talents', label: 'Torch Talents', highlight: false },
    { href: '/#contact', label: 'Contact', highlight: false }
  ];

  const socialLinks = [
    { icon: "linkedin", href: "#", label: "LinkedIn" },
    { icon: "twitter", href: "#", label: "Twitter" },
    { icon: "instagram", href: "#", label: "Instagram" },
    { icon: "facebook", href: "#", label: "Facebook" },
  ];

  const scrollToSection = (sectionId: string) => {
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    
    // Small delay to ensure mobile menu is closed
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        // Get the header height for offset
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        
        // Calculate the target position with offset for header
        const targetPosition = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        // Smooth scroll to the section
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }, isMobileMenuOpen ? 300 : 0);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-black/80 backdrop-blur-md border-b border-gray-800/50 shadow-lg shadow-black/30 py-2 sm:py-3" 
          : "bg-transparent py-3 sm:py-5"
      )}
    >
      <div 
        className={cn(
          "max-w-7xl mx-auto flex items-center justify-between px-4",
          "transition-all duration-500",
          mounted ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Logo that appears on scroll */}
        <Link 
          href="/" 
          className={cn(
            "flex items-center relative group",
            "transition-all duration-300 transform",
            scrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          )}
        >
          {/* Logo with animation */}
          <div className="relative h-8 w-auto sm:h-10 flex items-center">
            <div className="absolute inset-0 bg-red-600/20 rounded-full blur-md group-hover:bg-red-600/30 transition-all duration-300"></div>
            <div className="relative flex items-center">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3">
                <Image 
                  src="/images/torch_group_logo.png"
                  alt="Torch Group"
                  fill
                  sizes="(max-width: 640px) 2rem, 2.5rem"
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white relative z-10">Torch</span>
            </div>
          </div>
        </Link>
        
        {/* Desktop Navigation - Centered with equal spacing */}
        <nav className={cn(
          "hidden md:flex items-center justify-center",
          scrolled ? "flex-1" : "mx-auto"
        )}>
          <div className="flex items-center space-x-5 lg:space-x-10">
            {navLinks.map((link, index) => (
              <div key={link.href} className={cn("relative group", mounted ? "animate-fade-in" : "opacity-0", `animation-delay-${200 * (index + 1)}`)}>
                <Link 
                  href={link.href} 
                  className={cn(
                    "py-2 px-1 flex items-center",
                    "text-white/80 hover:text-white",
                    "font-medium transition-all relative overflow-hidden"
                  )}
                  onClick={(e) => {
                    // Only handle internal anchor links
                    if (link.href.startsWith('#')) {
                      e.preventDefault();
                      scrollToSection(link.href.substring(1));
                    }
                  }}
                >
                  {link.label}
                  
                  {/* Hover effect - bottom border */}
                  <span className={cn(
                    "absolute bottom-0 left-0 w-full h-0.5",
                    "bg-red-600",
                    "transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                  )}></span>
                </Link>
              </div>
            ))}
          </div>
        </nav>
        
        {/* CTA Button - Right aligned */}
        <div className={cn(
          "hidden md:block",
          "transition-all duration-300 transform",
          scrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}>
          <Button 
            className={cn(
              "bg-red-600 text-white relative overflow-hidden group",
              "hover:bg-red-700 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-red-900/10",
              mounted ? "animate-fade-in animation-delay-700" : "opacity-0"
            )}
            id="header-cta-button"
            onClick={() => scrollToSection('contact')}
          >
            <span className="relative z-10 flex items-center">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
            
            {/* Shine effect on hover */}
            <span 
              className="absolute inset-0 h-full w-[40%] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000"
            ></span>
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className={cn(
              "text-white hover:bg-gray-800/30 hover:text-white transition-all duration-300",
              scrolled ? "bg-gray-900/20" : "bg-transparent",
              "h-9 w-9 sm:h-10 sm:w-10" // Increase touch target size
            )}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-20"
            onClick={toggleMobileMenu}
          />
        )}

        {/* Mobile Navigation */}
        <div 
          ref={mobileMenuRef}
          className={cn(
            "fixed top-0 right-0 h-full w-[85%] max-w-[350px] bg-black/95 shadow-2xl border-l border-gray-800/50 transform transition-transform duration-300 ease-in-out z-30 overflow-y-auto",
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          {/* Close Button for Mobile Menu */}
          <button 
            onClick={toggleMobileMenu}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full bg-gray-800/30 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-5 pt-14 sm:p-6 sm:pt-16">
            <div className="border-b border-gray-800/50 pb-5 mb-6">
              <div className="flex items-center mb-4">
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 mr-3">
                  <Image 
                    src="/images/torch_group_logo.png"
                    alt="Torch Group"
                    fill
                    sizes="(max-width: 640px) 2.25rem, 2.5rem"
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="text-xl font-bold text-white">Torch</span>
              </div>
              <p className="text-sm text-gray-400 pb-4">Empowering businesses through innovative digital solutions and strategic partnerships.</p>
            </div>
            
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link, index) => (
                <div key={link.href} className="flex flex-col">
                  <Link 
                    href={link.href}
                    className={cn(
                      "flex items-center p-3 text-base font-medium rounded-md border border-transparent",
                      "text-white/90 hover:text-white hover:bg-gray-800/30 hover:border-red-600/30",
                      "transition-all duration-200 touch-manipulation", // Improved touch handling
                      "min-h-[44px]" // Minimum touch target height
                    )}
                    onClick={(e) => {
                      if (link.href.startsWith('#')) {
                        e.preventDefault();
                        scrollToSection(link.href.substring(1));
                      } else {
                        toggleMobileMenu();
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
              
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button 
                  className="bg-red-600 hover:bg-red-700 rounded-md justify-center py-3 flex-1 hover:shadow-md hover:shadow-red-900/10 min-h-[44px]"
                  onClick={() => scrollToSection('contact')}
                >
                  <span className="flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
} 