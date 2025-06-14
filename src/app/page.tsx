"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowDownIcon, ExternalLink, FileText, Flame, ChevronRight, BarChart3, Users, ArrowUp, Check, X, User, Mail, Phone, MessageSquare, Send, Loader2, Calendar, SkipForward, BookOpen, ShoppingCart, Star, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedGridBackground } from "@/components/ui/animated-grid-background";
import { FeatureCard } from "@/components/ui/feature-card";
import { Input } from "@/components/ui/input";
import { motion, useReducedMotion } from "framer-motion";
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { ContactForm } from "@/components/forms/contact-form";
import useSWR from "swr";
import BlurText from '@/components/animations/BlurText';
import { GlareHover } from "@/components/animations";

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
    top: "top-0 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] bg-red-600/10",
    left: "top-1/2 left-0 -translate-y-1/2 w-[30rem] h-[30rem] bg-red-600/10",
    right: "top-1/2 right-0 -translate-y-1/2 w-[30rem] h-[30rem] bg-red-600/10",
    bottom: "bottom-0 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] bg-red-600/10",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-red-600/10",
  };

  return (
    <div
      className={cn(
        "absolute blur-[100px] rounded-full opacity-60",
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
  <section id={id} className={cn("py-24 md:py-32 lg:py-40 relative", className)}>
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

export default function Home() {
  const { data: swrSections, error: sectionsError, isLoading: sectionsLoading } = useSWR('/api/settings/homepage-sections', fetcher);
  const [mounted, setMounted] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false); // For admin toggle
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showSkipNav, setShowSkipNav] = useState(false);
  
  // Performance: Reduced motion preference
  const prefersReducedMotion = useReducedMotion();
  
  // Performance: Intersection Observer for animations
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sections = swrSections || [
    { id: 'hero', title: 'Hero', order: 0, enabled: true },
    { id: 'torch-group', title: 'Torch Group', order: 1, enabled: true },
    { id: 'services', title: 'Services', order: 2, enabled: true },
    { id: 'blog', title: 'Our Blog', order: 3, enabled: true },
    { id: 'torch-talents', title: 'Torch Talents', order: 4, enabled: true },
    { id: 'contact', title: 'Contact', order: 5, enabled: true }
  ];
  const loading = sectionsLoading;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    privacy: false
  });
  
  const [phoneVerificationState, setPhoneVerificationState] = useState({
    isVerifying: false,
    sentCode: false,
    verificationCode: "",
    isVerified: false,
    error: "",
    code: ""
  });
  
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    privacy: ""
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const logoImgRefDesktop = useRef<HTMLImageElement>(null);
  const logoImgRefMobile = useRef<HTMLImageElement>(null);
  const [navbarPulsing, setNavbarPulsing] = useState(false);
  const [logoGlowActive, setLogoGlowActive] = useState(false);
  const [logoGlowTransition, setLogoGlowTransition] = useState('filter 0.25s cubic-bezier(.4,0,.2,1)');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cornerGlowOpacities, setCornerGlowOpacities] = useState({ topLeft: 0, topRight: 0, bottomLeft: 0 });

  // Typewriter effect for About Torch section
  const [typewriterText] = useTypewriter({
    words: [
      'innovative',
      'digital',
      'media',
      'branding',
      'technology',
      'creative',
      'growth',
      'impactful',
    ],
    loop: true,
    delaySpeed: 1800,
    typeSpeed: 90,
    deleteSpeed: 60,
  });

  // Performance: Optimized event handlers with useCallback
  const handleScroll = useCallback(() => {
    setShowScrollTop(window.scrollY > 500);
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    // Skip mouse tracking if reduced motion is preferred
    if (prefersReducedMotion) return;
    
    setMousePosition({ x: event.clientX, y: event.clientY });
    // Calculate opacity based on distance to each corner glow
    const glowSize = 320; // w-80 and h-80 are 320px
    const translateOffset = 0.4; // 40% translation

    // Top-Left Glow Center (relative to viewport: 0,0 + translation + half size)
    const centerXTopLeft = 0 + (-glowSize * translateOffset) + (glowSize / 2);
    const centerYTopLeft = 0 + (-glowSize * translateOffset) + (glowSize / 2);
    const distTopLeft = Math.sqrt((event.clientX - centerXTopLeft)**2 + (event.clientY - centerYTopLeft)**2);
    const opacityTopLeft = Math.max(0, 1 - distTopLeft / 300) * 0.7; // Adjusted falloff and max opacity

    // Top-Right Glow Center (relative to viewport: window.innerWidth, 0 + translation + half size)
    const centerXTopRight = window.innerWidth + (glowSize * translateOffset) - (glowSize / 2);
    const centerYTopRight = 0 + (-glowSize * translateOffset) + (glowSize / 2);
    const distTopRight = Math.sqrt((event.clientX - centerXTopRight)**2 + (event.clientY - centerYTopRight)**2);
    const opacityTopRight = Math.max(0, 1 - distTopRight / 300) * 0.7; // Adjusted falloff and max opacity

    // Bottom-Left Glow Center (relative to viewport: 0, window.innerHeight + translation + half size)
    const centerXBottomLeft = 0 + (-glowSize * translateOffset) + (glowSize / 2);
    const centerYBottomLeft = window.innerHeight + (glowSize * translateOffset) - (glowSize / 2);
    const distBottomLeft = Math.sqrt((event.clientX - centerXBottomLeft)**2 + (event.clientY - centerYBottomLeft)**2);
    const opacityBottomLeft = Math.max(0, 1 - distBottomLeft / 300) * 0.7; // Adjusted falloff and max opacity

    setCornerGlowOpacities({
      topLeft: opacityTopLeft,
      topRight: opacityTopRight,
      bottomLeft: opacityBottomLeft,
    });
  }, [prefersReducedMotion]);

  // Performance: Keyboard navigation handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Tab' && !showSkipNav) {
      setShowSkipNav(true);
    }
    if (event.key === 'Escape') {
      setShowSkipNav(false);
    }
  }, [showSkipNav]);

  useEffect(() => {
    setMounted(true);

    // Performance: Intersection Observer for lazy animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '50px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set([...prev, entry.target.id]));
        }
      });
    }, observerOptions);

    // Observe all sections
    const sectionElements = document.querySelectorAll('section[id]');
    sectionElements.forEach(section => observer.observe(section));

    // Performance: Throttled scroll listener only (keep mouse instant for cursor glow)
    let scrollTimeout: NodeJS.Timeout;
    const throttledScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 16); // ~60fps
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true }); // Keep instant for cursor glow
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      observer.disconnect();
      if (scrollTimeout) clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleScroll, handleMouseMove, handleKeyDown]);

  // Function to check if a section is enabled
  const isSectionEnabled = (id: string) => {
    if (loading) return true; // Show all sections while loading
    if (sections.length === 0) return true; // Show all sections if config failed to load
    
    const section = sections.find((s: HomepageSection) => s.id === id);
    return section ? section.enabled : true; // Default to enabled if not found
  };

  // Sort sections by order
  const getSectionOrder = (id: string) => {
    const section = sections.find((s: HomepageSection) => s.id === id);
    return section ? section.order : 999; // Default to end if not found
  };

  const scrollToTop = () => {
    // Smooth scroll to top with a small delay for better animation
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 50);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  
  // Handle focus and blur
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocusedField(e.target.name);
  };
  
  const handleBlur = () => {
    setFocusedField(null);
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    
    // Clear error when user checks the box
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...formErrors };
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }
    
    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      valid = false;
    }
    
    // Validate privacy policy
    if (!formData.privacy) {
      newErrors.privacy = "You must agree to the privacy policy";
      valid = false;
    }
    
    setFormErrors(newErrors);
    return valid;
  };
  
  // Generate a random 6-digit code
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  // Send verification code
  const sendVerificationCode = () => {
    // Validate phone number
    if (!formData.phone || formData.phone.length < 10) {
      setFormErrors(prev => ({ ...prev, phone: "Please enter a valid phone number" }));
      return;
    }
    
    // Clear any previous errors
    setFormErrors(prev => ({ ...prev, phone: "" }));
    
    // Send verification code
    setPhoneVerificationState(prev => ({
      ...prev,
      isVerifying: true,
      sentCode: true,
      error: "",
      // In a real app, the code would be sent to the user's phone and not stored in the state
      // This is just for demonstration purposes
      code: generateVerificationCode()
    }));
    
    // Show success message
    alert(`Verification code sent! (Demo code: ${generateVerificationCode()})`);
  };
  
  // Verify code
  const verifyCode = () => {
    // In a real app, you would verify the code with your backend
    // For demo purposes, we'll simulate a successful verification
    
    if (phoneVerificationState.verificationCode.length !== 6) {
      setPhoneVerificationState(prev => ({
        ...prev,
        error: "Please enter a valid 6-digit code"
      }));
      return;
    }
    
    // Simulate code verification (always successful for demo)
    setPhoneVerificationState(prev => ({
      ...prev,
      isVerifying: false,
      isVerified: true,
      error: ""
    }));
  };
  
  // Cancel verification
  const cancelVerification = () => {
    setPhoneVerificationState({
      isVerifying: false,
      sentCode: false,
      verificationCode: "",
      isVerified: false,
      error: "",
      code: ""
    });
  };
  
  // Handle verification code input
  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setPhoneVerificationState(prev => ({
      ...prev,
      verificationCode: code,
      error: ""
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Temporarily remove phone verification check
    // if (formData.phone && !phoneVerificationState.isVerified) {
    //   setFormErrors(prev => ({ ...prev, phone: "Please verify your phone number before submitting" }));
    //   return;
    // }
    
    if (validateForm()) {
      setFormSubmitting(true);
      
      // Simulate form submission
      setTimeout(() => {
        setFormSubmitting(false);
        setFormSubmitted(true);
        
        // Reset form after submission
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          privacy: false
        });
        
        // Reset verification state
        setPhoneVerificationState({
          isVerifying: false,
          sentCode: false,
          verificationCode: "",
          isVerified: false,
          error: "",
          code: ""
        });
        
        // Reset submission state after a delay
        setTimeout(() => {
          setFormSubmitted(false);
        }, 5000);
      }, 1500);
    }
  };

  // Fetch blog posts for preview section
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const response = await fetch('/api/blog?published=true&limit=3');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        setBlogPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        // Fallback to empty array if fetch fails
        setBlogPosts([]);
      } finally {
        setBlogLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  // Torch Group brands data
  const torchBrands = [
    {
      name: "Torch Shop",
      description: "E-commerce solutions and digital marketplace",
      link: "https://shop.torchgroup.co",
      isComingSoon: false,
    },
    {
      name: "Torch Star",
      description: "Media and entertainment platform",
      link: "https://star.torchgroup.co",
      isComingSoon: false,
    },
    {
      name: "Torch Loop",
      description: "Community and networking hub",
      link: "https://loop.torchgroup.co",
      isComingSoon: false,
    },
    {
      name: "Torch Auto",
      description: "Automotive technology solutions",
      link: "#",
      isComingSoon: true,
    },
  ];

  // Talent silhouettes data
  const talentSilhouettes = [
    { 
      id: 1,
      label: "SOON",
    },
    { 
      id: 2,
      label: "SOON",
    },
    { 
      id: 3,
      label: "SOON",
    }
  ];

  // Create placeholder talents for display
  const activeTalents: any[] = []; // Empty array for now
  const displayTalents = Array(3).fill(null).map((_, index) => ({
    id: `placeholder-${index}`,
    name: 'Coming Soon',
    specialty: 'New Talent',
    bio: 'Exciting new talent joining our team soon. Stay tuned for updates!',
    isPlaceholder: true
  }));

  // Function to handle smooth scrolling to sections
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Get the header height for offset
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      
      // Calculate the target position with offset for header
      const targetPosition = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      // Smooth scroll to the section with a small delay for animations
      setTimeout(() => {
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Rearranged navSections to match homepage order, excluding 'torch-talents'
  const orderedNavSections = sections
    .filter((section: HomepageSection) => section.enabled && section.id !== 'hero' && section.id !== 'torch-talents' && (section.showInNav !== false))
    .sort((a: HomepageSection, b: HomepageSection) => getSectionOrder(a.id) - getSectionOrder(b.id));

  // Split nav links for left/right (symmetry)
  const leftNav = orderedNavSections.slice(0, Math.floor(orderedNavSections.length / 2));
  const rightNav = orderedNavSections.slice(Math.floor(orderedNavSections.length / 2));

  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (!isNavbarCollapsed && y > 120) {
        setIsNavbarCollapsed(true);
      } else if (isNavbarCollapsed && y < 40) {
        setIsNavbarCollapsed(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isNavbarCollapsed]);

  // Scrollspy effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // Offset for sticky nav
      let currentSection = "";
      orderedNavSections.forEach((section: HomepageSection) => {
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= scrollPosition) {
          currentSection = section.id;
        }
      });
      setActiveSection(currentSection);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [orderedNavSections]);

  // Add a function to handle logo click
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    [logoImgRefDesktop.current, logoImgRefMobile.current].forEach(img => {
      if (img) {
        img.classList.remove('animate-logo-bounce');
        void img.offsetWidth;
        img.classList.add('animate-logo-bounce');
      }
    });
    setNavbarPulsing(true);
    setLogoGlowTransition('filter 0.22s cubic-bezier(.4,0,.2,1)'); // Fast expand
    setLogoGlowActive(true);
    setTimeout(() => {
      setNavbarPulsing(false);
      setLogoGlowTransition('filter 0.7s cubic-bezier(.4,0,.2,1)'); // Slow fade
      setLogoGlowActive(false);
    }, 220); // Match expand duration
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsNavbarCollapsed(false);
  };

  // Remove animation class after animation ends for both images
  useEffect(() => {
    const handleAnimationEnd = (e: AnimationEvent) => {
      (e.target as HTMLElement).classList.remove('animate-logo-bounce');
    };
    const desktopImg = logoImgRefDesktop.current;
    const mobileImg = logoImgRefMobile.current;
    if (desktopImg) desktopImg.addEventListener('animationend', handleAnimationEnd);
    if (mobileImg) mobileImg.addEventListener('animationend', handleAnimationEnd);
    return () => {
      if (desktopImg) desktopImg.removeEventListener('animationend', handleAnimationEnd);
      if (mobileImg) mobileImg.removeEventListener('animationend', handleAnimationEnd);
    };
  }, []);

  return (
    <>
      {/* SEO: Enhanced Head with structured data */}
      {mounted && (
        <Head>
          <title>Torch Group - Igniting Creativity & Empowering Digital Talent</title>
          <meta name="description" content="Torch Group empowers creative entities and talents through innovative digital solutions, strategic allies, and comprehensive media services. Discover our B2C, B2T, and B2B offerings." />
          <meta name="keywords" content="creative agency, digital content, talent management, media services, branding, technology solutions, creative allies" />
          <meta name="author" content="Torch Group" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://torchgroup.com/" />
          <meta property="og:title" content="Torch Group - Igniting Creativity & Empowering Digital Talent" />
          <meta property="og:description" content="Empowering creative entities and talents through innovative digital solutions and strategic allies." />
          <meta property="og:image" content="https://torchgroup.com/images/logo.png" />
          <meta property="og:site_name" content="Torch Group" />
          
          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://torchgroup.com/" />
          <meta property="twitter:title" content="Torch Group - Igniting Creativity & Empowering Digital Talent" />
          <meta property="twitter:description" content="Empowering creative entities and talents through innovative digital solutions and strategic allies." />
          <meta property="twitter:image" content="https://torchgroup.com/images/logo.png" />
          
          {/* Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Torch Group",
                "description": "Creative agency empowering talents through innovative digital solutions",
                "url": "https://torchgroup.com",
                "logo": "https://torchgroup.com/images/logo.png",
                "sameAs": [
                  "https://twitter.com/torchgroup",
                  "https://linkedin.com/company/torchgroup"
                ],
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "customer service",
                  "url": "https://torchgroup.com/contact"
                }
              })
            }}
          />
          
          {/* Performance: Preload critical fonts */}
          <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
          
          {/* Performance: DNS prefetch for external resources */}
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//images.unsplash.com" />
          
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-phone-input-2/2.15.1/style.css" />
        </Head>
      )}

      {/* Accessibility: Skip Navigation */}
      {showSkipNav && (
        <div className="fixed top-4 left-4 z-[100] bg-red-600 text-white px-4 py-2 rounded-md shadow-lg focus-within:ring-2 focus-within:ring-white">
          <a 
            href="#main-content" 
            className="text-sm font-medium focus:outline-none"
            onBlur={() => setShowSkipNav(false)}
          >
            Skip to main content
          </a>
        </div>
      )}

      {/* Accessibility: Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {activeSection && `Now viewing ${activeSection} section`}
      </div>

      {/* Smooth scroll button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-800 transition-all duration-300 animate-fade-in focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          aria-label="Scroll to top of page"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* Main content wrapper for accessibility */}
      <main id="main-content" role="main">
        {/* HERO SECTION WITH ANIMATION */}
        <section 
          id="hero" 
          className="relative flex flex-col items-center justify-center min-h-screen py-20 px-4 sm:px-6 md:px-8 lg:px-12 z-10 overflow-hidden animate-fade-in duration-1000 ease-in-out"
          aria-label="Hero section - Welcome to Torch Group"
          style={{ willChange: prefersReducedMotion ? 'auto' : 'transform, opacity' }}
        >
          {/* Animated gradient background placeholder (can be removed later if not needed) */}
          {/* Reverted: Removed AnimatedGridBackground, black overlay, and red glow from hero section */}
          <div className="absolute inset-0 -z-10" />

          {/* Hero content */}
          <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto text-center z-20 absolute inset-0">
            <div className="mb-20 relative group flex flex-col items-center animate-fade-in">
              <div className="absolute -inset-4 md:-inset-8 rounded-full bg-red-600/20 blur-[100px] opacity-80 group-hover:opacity-100 transition-all duration-300 z-0 animate-pulse-slow animate-[spin_8s_linear_infinite]" />
              <Image 
                src="/images/logo.png"
                alt="Torch Logo"
                width={300}
                height={300}
                priority
                className="object-contain mx-auto relative z-10 drop-shadow-lg group-hover:scale-105 group-hover:drop-shadow-[0_0_32px_#dc2626cc] transition-transform duration-300 cursor-pointer w-[220px] h-[220px] sm:w-[300px] sm:h-[300px]"
                style={{ aspectRatio: '1/1', willChange: prefersReducedMotion ? 'auto' : 'transform' }}
                onClick={handleLogoClick}
                ref={logoImgRefDesktop}
              />
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-12 text-white tracking-tight hero-heading animate-hero-headline">
              Welcome to <span className="relative inline-block text-red-600">Torch
                <svg className="absolute left-0 -bottom-2 w-full h-3" viewBox="0 0 160 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 10C40 2 120 2 155 6" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <animate attributeName="stroke-dasharray" from="0,160" to="160,0" dur="1.2s" fill="freeze" />
                  </path>
                </svg>
              </span>
            </h1>
            <div className="mb-14 text-center font-semibold">
              <BlurText
                text="Every Idea Starts With A Torch"
                className="block text-2xl md:text-3xl text-white font-extrabold"
                animateBy="words"
                direction="top"
                delay={60}
                stepDuration={0.35}
                shiny={true}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-2 animate-hero-fadein">
              <button
                onClick={() => scrollToSection('about-torch')}
                className="hero-button rounded-full bg-red-600 px-12 py-5 text-lg font-bold text-white shadow-xl transition-all duration-500 hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 z-20 flex items-center justify-center gap-3 mb-0"
              >
                Explore Torch <ArrowDownIcon className="h-5 w-5 ml-2" />
              </button>
              <a
                href="/contact"
                className="hero-button rounded-full border-2 border-red-600 px-12 py-5 text-lg font-bold text-red-600 bg-transparent shadow-xl transition-all duration-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 z-20 flex items-center justify-center gap-3"
              >
                Contact Us <ArrowRight className="h-5 w-5 ml-2" />
              </a>
            </div>
          </div>
        </section>

        {/* About Torch Group block moved here */}
        <Section id="about-torch" className="relative overflow-hidden">
          {/* Enhanced background with multiple glow effects */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600/15 blur-[120px] rounded-full animate-pulse-slow"></div>
            <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-red-500/10 blur-[80px] rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[200px] bg-red-700/10 blur-[100px] rounded-full"></div>
          </div>
          
          <motion.div 
            className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 60 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={prefersReducedMotion ? {} : { duration: 1, ease: 'easeOut' }}
          >
            <div className="flex flex-col items-center text-center">
              {/* Section Label */}
              <motion.div 
                className="inline-flex items-center justify-center mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-600/80 mr-3"></div>
                <span className="text-red-500 text-sm md:text-base font-bold tracking-[0.2em] uppercase">About Us</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-600/80 ml-3"></div>
              </motion.div>

              {/* Main Title */}
              <motion.h2 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-white tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                About <span className="text-red-600 relative">
                  Torch
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-full opacity-60"></div>
                </span>
              </motion.h2>

              {/* Typewriter Section */}
              <motion.div 
                className="mb-12 max-w-5xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <span className="block text-xl md:text-2xl font-semibold text-gray-100 leading-relaxed">
                  Empowering Creative Entities & Talents through{' '}
                  <span className="text-red-500 font-bold">
                    <span className="inline-block">
                      <span className="typewriter">
                        {typewriterText}
                      </span>
                      <Cursor />
                    </span>
                  </span>
                  {' '}solutions & Strategic Sponsor/Allies
                </span>
              </motion.div>

              {/* Decorative Divider */}
              <motion.div 
                className="flex justify-center mb-12"
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                <div className="relative">
                  <div className="w-32 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full"></div>
                  <div className="absolute inset-0 w-32 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow opacity-50"></div>
                </div>
              </motion.div>
              
              {/* Enhanced Content Cards */}
              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="relative"
                >
                  {/* Main Statement Card */}
                  <div className="relative bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-lg border border-red-600/20 rounded-3xl p-8 md:p-12 mb-8 shadow-2xl shadow-red-900/20 hover:shadow-red-600/30 transition-all duration-500 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight relative z-10">
                      Igniting creativity and empowering talent to shape the future of{' '}
                      <span className="text-red-500 relative">
                        digital content
                        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-red-500/60 rounded-full"></div>
                      </span>
                    </h3>
                  </div>

                  {/* Description Card */}
                  <div className="relative bg-gradient-to-br from-black/40 via-black/20 to-black/40 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed relative z-10 font-medium">
                      We're more than just a creative agency – we're a{' '}
                      <span className="text-red-400 font-semibold">catalyst for innovation</span>, a{' '}
                      <span className="text-red-400 font-semibold">platform for exceptional talent</span>, and a{' '}
                      <span className="text-red-400 font-semibold">driving force</span> in the evolving media landscape.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </Section>

        {/* Page content starts here */}
        <div
          className="w-full min-h-screen text-white relative"
        >
          {/* Added: Animated grid background for all pages */}
          <AnimatedGridBackground 
            className="fixed inset-0 -z-20" 
            dotColor="rgba(255, 40, 40, 0.3)"
            dotSize={1.2}
            dotSpacing={24}
            animationSpeed={0.4}
            interactive={true}
            mousePosition={mounted ? mousePosition : { x: 0, y: 0 }}
          />

          {/* Added: Pure black overlay for all pages */}
          <div className="fixed inset-0 -z-10 bg-black opacity-80"></div>

          {/* Added: Cursor following red glow */}
          {mounted && (
            <div
              className="fixed w-64 h-64 bg-red-600/40 blur-[100px] rounded-full pointer-events-none -z-10 transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${mousePosition.x}px`, top: `${mousePosition.y}px`, mixBlendMode: 'screen' }}
            ></div>
          )}

          {/* Conditionally render other sections based on their enabled status and in order */}
          {isSectionEnabled('services') && (
            <Section id="services" className="py-32 md:py-40">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative"
              >
                {/* Animated red glow background */}
                <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                  <div className="w-[600px] h-[300px] bg-red-600/20 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
                </div>
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center mb-6">
                    <div className="h-px w-8 bg-red-600/80 mr-2"></div>
                    <span className="text-red-500 text-base font-bold tracking-widest">WHAT WE DO</span>
                    <div className="h-px w-8 bg-red-600/80 ml-2"></div>
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg">
                    Our Services
                  </h2>
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
                  </div>
                  <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-2">
                    Comprehensive digital solutions to ignite your brand and accelerate growth.
                  </p>
                  <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                    We offer everything you need to succeed in the digital landscape.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mt-16">
                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px 8px #dc2626aa' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <FeatureCard
                      title="B2C"
                      description={
                        `Enjoy with Our Torch Group\nServices & e commerce will\nhelp your creative products &\nservices that fit your needs`
                      }
                      icon={<ShoppingCart className="h-10 w-10 text-red-600 group-hover:text-white transition-colors duration-300" />}
                      className="w-full max-w-sm mx-auto border-2 border-black bg-gradient-to-br from-black/80 via-black/60 to-black/80 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-red-700/30 hover:border-red-600 transition-all duration-300 group hover:scale-105"
                    />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px 8px #dc2626aa' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <FeatureCard
                      title="B2T"
                      description={
                        `Our Talents membership\nservices will help your content\ngrow online/offline engagement\n& attract more audience &\nFollowers`
                      }
                      icon={<Star className="h-10 w-10 text-red-600 group-hover:text-white transition-colors duration-300" />}
                      className="w-full max-w-sm mx-auto border-2 border-black bg-gradient-to-br from-black/80 via-black/60 to-black/80 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-red-700/30 hover:border-red-600 transition-all duration-300 group hover:scale-105"
                    />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px 8px #dc2626aa' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <FeatureCard
                      title="B2B"
                      description={
                        `Our entities/brands\nmembership services will help\nyour business grow online/\noffline & attract more audience\n& customers`
                      }
                      icon={<Building2 className="h-10 w-10 text-red-600 group-hover:text-white transition-colors duration-300" />}
                      className="w-full max-w-sm mx-auto border-2 border-black bg-gradient-to-br from-black/80 via-black/60 to-black/80 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-red-700/30 hover:border-red-600 transition-all duration-300 group hover:scale-105"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </Section>
          )}

          {isSectionEnabled('torch-group') && (
            <Section id="torch-group">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10"
              >
                {/* Animated red glow background */}
                <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                  <div className="w-[700px] h-[320px] md:w-[900px] md:h-[400px] bg-red-600/20 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
                </div>
                <div className="text-center mb-20 mt-16">
                  <div className="inline-flex items-center justify-center mb-4">
                    <div className="h-px w-8 bg-red-600 mr-2"></div>
                    <span className="text-red-600 text-base font-bold tracking-widest">OUR BRANDS</span>
                    <div className="h-px w-8 bg-red-600 ml-2"></div>
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white drop-shadow-lg">Torch Group Brands</h3>
                  <p className="text-gray-300 max-w-3xl mx-auto text-lg">
                    Explore our family of brands, each dedicated to excellence in their specialized fields.
                  </p>
                </div>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-14 justify-center items-stretch mb-16"
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
                  {torchBrands.map((brand, index) => (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 40 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
                      }}
                      whileHover={{ scale: 1.05, boxShadow: '0 0 40px 8px #dc2626aa' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="group border-2 border-black bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/40 hover:border-red-600 hover:scale-[1.05] relative animate-fade-in flex flex-col items-center justify-between"
                      style={{ animationDelay: `${index * 0.08 + 0.1}s` }}
                    >
                      {/* Content area (flex-grow to push button down) */}
                      <div className="p-10 flex flex-col items-center text-center w-full flex-grow">
                        {/* Icon with glow */}
                        <div className="mb-8 relative flex items-center justify-center">
                          <div className="absolute inset-0 w-16 h-16 bg-red-600/40 blur-[32px] rounded-full group-hover:blur-[48px] transition-all"></div>
                          <Flame className="h-12 w-12 text-red-600 drop-shadow-lg" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-white tracking-tight drop-shadow-lg">{brand.name}</h3>
                        <p className="text-gray-300 mb-6 text-base min-h-[48px]">{brand.description}</p>
                      </div>
                      
                      {/* Button or Coming Soon */}
                      <div className="p-10 pt-0 flex items-center justify-center w-full">
                        {brand.isComingSoon ? (
                          <span className="px-4 py-1 bg-black/70 border border-red-600 text-red-600 text-xs rounded-full font-semibold animate-pulse-slow">Coming Soon</span>
                        ) : (
                          <Link href={brand.link} target="_blank" rel="noopener noreferrer">
                            <button className="px-6 py-2 rounded-full bg-red-600 text-white font-bold shadow hover:bg-red-700 transition-colors text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                              Visit Website
                            </button>
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </Section>
          )}

          {/* Blog Section */}
          {isSectionEnabled('blog') && (
            <Section id="blog">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative"
              >
                {/* Animated red glow background */}
                <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                  <div className="w-[600px] h-[300px] bg-red-600/20 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
                </div>
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center mb-6">
                    <div className="h-px w-8 bg-red-600/80 mr-2"></div>
                    <span className="text-red-500 text-base font-bold tracking-widest">INSIGHTS</span>
                    <div className="h-px w-8 bg-red-600/80 ml-2"></div>
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg">
                    Our Blog
                  </h2>
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
                  </div>
                  <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-2">
                    Discover the latest insights, Talents News, Top Talents Lists, Creative Entities, Creative Broken Records & Creative Content
                  </p>
                </div>
                {blogPosts && blogPosts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                    {blogPosts.slice(0, 3).map((post) => (
                      <motion.div
                        key={post.id}
                        whileHover={{ scale: 1.05, boxShadow: '0 0 40px 8px #dc2626aa' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="group border-2 border-black bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/40 hover:border-red-600"
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-red-500 text-sm font-semibold uppercase tracking-wide">
                              {post.category || 'Blog'}
                            </span>
                            <span className="text-gray-400 text-sm">
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors duration-300">
                            {post.title}
                          </h3>
                          <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                            {post.excerpt || post.content?.substring(0, 120) + '...'}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-xs">
                              By {post.author || 'Torch Team'}
                            </span>
                            <Link href={`/blog/${post.slug}`}>
                              <button className="text-red-500 hover:text-red-400 font-semibold text-sm transition-colors duration-300 flex items-center gap-1">
                                Read More <ArrowRight className="h-3 w-3" />
                              </button>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                      <div className="mb-6">
                        <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BookOpen className="h-8 w-8 text-red-500" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">No Blog Posts Yet</h3>
                      <p className="text-gray-400 mb-6">
                        We're working on bringing you amazing content. Check back soon!
                      </p>
                      <div className="flex justify-center">
                        <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
                      </div>
                    </div>
                  </div>
                )}
                {blogPosts && blogPosts.length > 3 && (
                  <div className="text-center mt-12">
                    <Link href="/blog">
                      <button className="px-8 py-3 rounded-full bg-red-600 text-white font-bold shadow-lg hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                        View All Posts
                      </button>
                    </Link>
                  </div>
                )}
              </motion.div>
            </Section>
          )}

          {isSectionEnabled('torch-talents') && (
            <Section id="torch-talents">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative"
              >
                {/* Animated red glow background */}
                <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                  <div className="w-[600px] h-[300px] bg-red-600/20 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
                </div>
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center mb-6">
                    <div className="h-px w-8 bg-red-600/80 mr-2"></div>
                    <span className="text-red-500 text-base font-bold tracking-widest">OUR TALENTS</span>
                    <div className="h-px w-8 bg-red-600/80 ml-2"></div>
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg">
                    Top Torch Talents
                  </h2>
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
                  </div>

                </div>
                {activeTalents && activeTalents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                    {displayTalents.map((talent, index) => (
                      <motion.div
                        key={talent.id || `placeholder-${index}`}
                        whileHover={{ scale: 1.05, boxShadow: '0 0 40px 8px #dc2626aa' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="group border-2 border-black bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/40 hover:border-red-600"
                      >
                        <div className="p-6 text-center">
                          <div className="mb-6 relative">
                            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-red-600/20 to-red-800/20 flex items-center justify-center border-2 border-red-600/30 group-hover:border-red-500 transition-colors duration-300">
                              {talent.isPlaceholder ? (
                                <User className="h-10 w-10 text-red-500" />
                              ) : (
                                <span className="text-2xl font-bold text-red-500">
                                  {talent.name?.charAt(0) || 'T'}
                                </span>
                              )}
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors duration-300">
                            {talent.name || 'Coming Soon'}
                          </h3>
                          <p className="text-red-500 text-sm font-semibold mb-3 uppercase tracking-wide">
                            {talent.specialty || 'New Talent'}
                          </p>
                          <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            {talent.bio || 'Exciting new talent joining our team soon. Stay tuned for updates!'}
                          </p>
                          {talent.isPlaceholder ? (
                            <span className="inline-block px-3 py-1 bg-black/70 border border-red-600 text-red-600 text-xs rounded-full font-semibold animate-pulse-slow">
                              Coming Soon
                            </span>
                          ) : (
                            <div className="flex items-center justify-center">
                              <span className="inline-block px-3 py-1 bg-red-600/20 border border-red-600 text-red-500 text-xs rounded-full font-semibold">
                                Active
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                      <div className="mb-6">
                        <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="h-8 w-8 text-red-500" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">No Active Talents Yet</h3>
                      <p className="text-gray-400 mb-6">
                        We're building an amazing team of talents. Check back soon to meet them!
                      </p>
                      <div className="flex justify-center">
                        <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </Section>
          )}

          {/* TOP TORCH ALLIES SECTION */}
          <Section id="top-partners">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="max-w-7xl mx-auto px-4 md:px-12 relative"
            >
              {/* Enhanced background with glow effects */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                <div className="w-[700px] h-[320px] md:w-[900px] md:h-[400px] bg-red-600/15 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
              </div>
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center mb-6">
                  <div className="h-px w-8 bg-red-600/80 mr-2"></div>
                  <span className="text-red-500 text-base font-bold tracking-widest">ALLIES</span>
                  <div className="h-px w-8 bg-red-600/80 ml-2"></div>
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg">
                  Top Torch <span className="text-red-600">Allies</span>
                </h2>
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
                </div>
                <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-2">
                  Collaborating with industry leaders to drive innovation.
                </p>
                <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                  Discover our strategic allies and collaborations.
                </p>
              </div>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 justify-center items-stretch mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.14,
                    },
                  },
                }}
              >
                {[1,2,3].map((i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 40 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0 0 40px 8px #dc2626aa',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl group transition-all duration-500 border-2 border-red-600/30 bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 hover:border-red-600/80 backdrop-blur-lg min-h-[200px]"
                  >
                    {/* Enhanced background with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-red-600/15 z-0"></div>
                    
                    {/* Faint Torch logo background watermark */}
                    <div className="absolute inset-0 flex items-center justify-center z-5 pointer-events-none">
                      <Image 
                        src="/images/logo.png" 
                        alt="Torch Logo Watermark" 
                        width={120} 
                        height={120} 
                        loading="lazy"
                        className="opacity-20 object-contain mx-auto group-hover:opacity-30 transition-opacity duration-500" 
                        style={{aspectRatio: '1/1', willChange: prefersReducedMotion ? 'auto' : 'opacity'}} 
                      />
                    </div>
                    
                    {/* Main content area */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden flex items-center justify-center z-10">
                      {/* Placeholder content */}
                      <div className="text-center p-6">
                        {/* Placeholder Play Icon */}
                        <div className="mb-4">
                          <svg className="w-16 h-16 text-red-500 opacity-80 mx-auto group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <div className="text-white text-sm font-semibold">
                          Partner Video {i}
                        </div>
                        <div className="text-red-400 text-xs mt-2 font-medium">
                          Coming Soon
                        </div>
                      </div>
                    </div>

                    {/* Partner logo (Torch logo image) - Enhanced */}                  
                    <div className="absolute top-4 left-4 z-20 w-14 h-14 flex items-center justify-center bg-black/70 rounded-full p-2 border-2 border-red-600/60 group-hover:border-red-500 transition-all duration-300 group-hover:scale-110">
                      <Image 
                        src="/images/logo.png" 
                        alt="Torch Logo" 
                        width={32} 
                        height={32} 
                        className="object-contain mx-auto drop-shadow-lg" 
                        style={{aspectRatio: '1/1'}} 
                      />
                    </div>

                    {/* Hover overlay effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-15"></div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </Section>

          {isSectionEnabled('contact') && (
            <Section id="contact">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative"
              >
                {/* Animated red glow background */}
                <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                  <div className="w-[700px] h-[320px] md:w-[900px] md:h-[400px] bg-red-600/20 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
                </div>
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center mb-6">
                    <div className="h-px w-8 bg-red-600/80 mr-2"></div>
                    <span className="text-red-500 text-base font-bold tracking-widest">CONTACT US</span>
                    <div className="h-px w-8 bg-red-600/80 ml-2"></div>
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg">Get in Touch</h2>
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
                  </div>
                  <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-2">
                    Let's discuss your next project.
                  </p>
                  <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                    Fill out the form and our team will get back to you as soon as possible.
                  </p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                  className="p-8 bg-black rounded-lg border border-white relative z-20 shadow-2xl shadow-red-900/30 contact-form-card mb-12"
                >
                  <ContactForm />
                </motion.div>
              </motion.div>
            </Section>
          )}
        </div>
      </main>
    </>
  );
}