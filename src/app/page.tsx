"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowDownIcon, ExternalLink, FileText, Flame, ChevronRight, BarChart3, Users, ArrowUp, Check, X, User, Mail, Phone, MessageSquare, Send, Loader2, Calendar, SkipForward, BookOpen, ShoppingCart, Star, Building2, Zap, TrendingUp, Clock, Bookmark, ArrowUpRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedGridBackground } from "@/components/ui/animated-grid-background";
import { FeatureCard } from "@/components/ui/feature-card";
import { Input } from "@/components/ui/input";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { ContactForm } from "@/components/forms/contact-form";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import useSWR from "swr";
import BlurText from '@/components/animations/BlurText';
import { GlareHover } from "@/components/animations";
import { Orbitron, Share_Tech_Mono, Russo_One, Oswald, Merriweather } from "next/font/google";
import TiltedCard from '@/components/animations/TiltedCard';
import Particles from '@/components/animations/Particles';
import { useTiltEffect } from "@/hooks/useTiltEffect";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"] });
const shareTechMono = Share_Tech_Mono({ subsets: ["latin"], weight: "400" });
const russoOne = Russo_One({ subsets: ["latin"], weight: "400" });
const oswald = Oswald({ subsets: ["latin"], weight: ["400", "700"] });
const merriweather = Merriweather({ subsets: ["latin"], weight: ["400", "700"] });

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
      <section id={id} className={cn("torch-section-standard", className)}>
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
  const [logoClickTrigger, setLogoClickTrigger] = useState(0);

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

  // Tilt effect refs for blog cards
  const blogTiltRefs = [
    useTiltEffect({ max: 8, scale: 1.03 }),
    useTiltEffect({ max: 8, scale: 1.03 }),
    useTiltEffect({ max: 8, scale: 1.03 })
  ];

  // Performance: Optimized event handlers with useCallback
  const handleScroll = useCallback(() => {
    setShowScrollTop(window.scrollY > 500);
  }, []);

  // Handle mouse movement with optimized tracking
  useEffect(() => {
    if (!mounted) return;
    
    // Initialize mouse position to logo center on mount
    const initializeMousePosition = () => {
      if (typeof window !== 'undefined') {
        // Calculate logo position more accurately
        // Logo is centered horizontally and positioned in the hero section
        const initialX = window.innerWidth / 2;
        // Logo is positioned in the upper part of the hero section (not exactly center)
        // Hero section is min-h-screen with py-20, logo has mb-20
        // Approximate logo position: top 20% of screen height + logo height/2
        const initialY = window.innerHeight * 0.35; // Approximately where the logo center would be
        setMousePosition({ x: initialX, y: initialY });
      }
    };

    initializeMousePosition();

    const throttledMouseMove = throttle((event: MouseEvent) => {
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
    }, 16); // ~60fps throttling

    window.addEventListener('mousemove', throttledMouseMove);

    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
    };
  }, [mounted, prefersReducedMotion]);

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
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      observer.disconnect();
      if (scrollTimeout) clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleScroll, handleKeyDown]);

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
      link: "https://torchshop.co",
      isComingSoon: false,
    },
    {
      name: "Torch Loop",
      description: "Community and networking hub",
      link: "https://torchloop.co",
      isComingSoon: false,
    },
    {
      name: "Torch Star",
      description: "Media and entertainment platform",
      link: "#",
      isComingSoon: true,
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

  // Enhanced logo click handler with smooth easing animation
  const handleLogoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Trigger the enhanced ripple animation effect that spreads across the site
    setLogoClickTrigger(prev => prev + 1);
    
    // Apply CSS animation to logo with smooth easing
    if (logoImgRefDesktop.current) {
      // Remove any existing animation classes
      logoImgRefDesktop.current.classList.remove('animate-pulse', 'logo-click-animation');
      
      // Force reflow to ensure class removal takes effect
      void logoImgRefDesktop.current.offsetWidth;
      
      // Add the new smooth logo animation class
      logoImgRefDesktop.current.classList.add('logo-click-animation');
      
      // Remove the animation class after it completes to allow for re-triggering
      setTimeout(() => {
        if (logoImgRefDesktop.current) {
          logoImgRefDesktop.current.classList.remove('logo-click-animation');
        }
      }, 4000);
    }
    
    // Also apply to mobile logo if it exists
    if (logoImgRefMobile.current) {
      logoImgRefMobile.current.classList.remove('animate-pulse', 'logo-click-animation');
      void logoImgRefMobile.current.offsetWidth;
      logoImgRefMobile.current.classList.add('logo-click-animation');
      
      setTimeout(() => {
        if (logoImgRefMobile.current) {
          logoImgRefMobile.current.classList.remove('logo-click-animation');
        }
      }, 4000);
    }
  };

  // Function to remove focus from buttons after click
  const handleButtonClick = (callback: () => void) => {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      callback();
      // Remove focus from the button after click to prevent white outline
      (e.target as HTMLButtonElement).blur();
    };
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

  // Initialize mouse position to logo center on mount
  const initializeMousePosition = () => {
    if (typeof window !== 'undefined') {
      // Calculate logo position more accurately
      // Logo is centered horizontally and positioned in the hero section
      const initialX = window.innerWidth / 2;
      // Logo is positioned in the upper part of the hero section (not exactly center)
      // Hero section is min-h-screen with py-20, logo has mb-20
      // Approximate logo position: top 20% of screen height + logo height/2
      const initialY = window.innerHeight * 0.35; // Approximately where the logo center would be
      setMousePosition({ x: initialX, y: initialY });
    }
  };

  useEffect(() => {
    initializeMousePosition();
  }, []);

  // Enhanced engagement states
  const [readingProgress, setReadingProgress] = useState(0);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    reduceMotion: false,
    highContrast: false
  });

  // Performance optimization: Detect older devices
  const [isOlderDevice, setIsOlderDevice] = useState(false);
  
  // Reading time calculation for blog posts
  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  // Enhanced scroll progress tracking
  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(progress);
      
      // Show quick start CTA after 30% scroll but before contact section (85%)
      const shouldShowQuickStart = progress > 30 && progress < 85;
      setShowQuickStart(shouldShowQuickStart);
      
      // Debug logging (remove in production)
      if (process.env.NODE_ENV === 'development') {
        console.log(`Scroll Progress: ${progress.toFixed(1)}% | Quick Start: ${shouldShowQuickStart} | Scroll Top: ${showScrollTop}`);
      }
    };

    const throttledUpdate = throttle(updateReadingProgress, 16); // ~60fps
    window.addEventListener('scroll', throttledUpdate);
    return () => window.removeEventListener('scroll', throttledUpdate);
  }, [showScrollTop]);

  // Performance: Detect device capabilities
  useEffect(() => {
    const detectDeviceCapabilities = () => {
      // Detect older devices based on various factors
      const connection = (navigator as any).connection;
      const isSlowConnection = connection && connection.effectiveType && 
        ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
      
      const isOlderDevice = 
        isSlowConnection ||
        navigator.hardwareConcurrency < 4 ||
        window.devicePixelRatio < 2 ||
        /Android [1-6]|iPhone OS [1-9]/.test(navigator.userAgent);
      
      setIsOlderDevice(isOlderDevice);
    };

    detectDeviceCapabilities();
  }, []);

  // Accessibility: Enhanced focus management
  const [lastFocusedElement, setLastFocusedElement] = useState<HTMLElement | null>(null);
  
  const handleFocusCapture = useCallback((element: HTMLElement) => {
    setLastFocusedElement(element);
  }, []);

  return (
    <>
      {/* SEO: Enhanced Head with structured data */}
      {mounted && (
        <Head>
          <title>Torch Group - Premier Creative Agency & Digital Talent Platform | B2B, B2T, B2C Solutions</title>
          <meta name="description" content="Transform your creative vision with Torch Group's comprehensive digital solutions. We empower talents, brands, and businesses through innovative content creation, strategic partnerships, and cutting-edge technology. Join 100+ successful clients worldwide." />
          <meta name="keywords" content="creative agency, digital talent platform, content creation, brand development, creative services, talent management, digital marketing, creative partnerships, B2B solutions, B2T platform, creative technology, media production, brand strategy, creative consulting" />
          <meta name="author" content="Torch Group" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://torchgroup.com/" />
          <meta property="og:title" content="Torch Group - Premier Creative Agency & Digital Talent Platform" />
          <meta property="og:description" content="Transform your creative vision with comprehensive digital solutions. We empower talents, brands, and businesses through innovative content creation and strategic partnerships." />
          <meta property="og:image" content="https://torchgroup.com/images/logo.png" />
          <meta property="og:site_name" content="Torch Group" />
          
          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://torchgroup.com/" />
          <meta property="twitter:title" content="Torch Group - Premier Creative Agency & Digital Talent Platform" />
          <meta property="twitter:description" content="Transform your creative vision with comprehensive digital solutions. We empower talents, brands, and businesses through innovative content creation and strategic partnerships." />
          <meta property="twitter:image" content="https://torchgroup.com/images/logo.png" />
          
          {/* Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Torch Group",
                "description": "Premier creative agency and digital talent platform empowering brands, talents, and businesses through innovative content creation, strategic partnerships, and cutting-edge technology solutions.",
                "url": "https://torchgroup.com",
                "logo": "https://torchgroup.com/images/logo.png",
                "foundingDate": "2024",
                "industry": "Creative Services",
                "keywords": "creative agency, digital talent platform, content creation, brand development, creative services",
                "sameAs": [
                  "https://twitter.com/torchgroup",
                  "https://linkedin.com/company/torchgroup"
                ],
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "customer service",
                  "url": "https://torchgroup.com/contact",
                  "availableLanguage": "English"
                },
                "offers": [
                  {
                    "@type": "Service",
                    "name": "B2B Creative Solutions",
                    "description": "Comprehensive membership services for businesses to grow online and offline presence"
                  },
                  {
                    "@type": "Service", 
                    "name": "B2T Talent Platform",
                    "description": "Talent membership services to grow content engagement and attract audiences"
                  },
                  {
                    "@type": "Service",
                    "name": "B2C Creative Services",
                    "description": "Creative products and services tailored to individual needs"
                  }
                ]
              })
            }}
          />
          
                  {/* Performance: DNS prefetch for external resources */}
          
          {/* Performance: DNS prefetch for external resources */}
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//images.unsplash.com" />
          
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-phone-input-2/2.15.1/style.css" />
        </Head>
      )}

      {/* Enhanced Accessibility: Skip Navigation */}
      <div className="sr-only focus-within:not-sr-only fixed top-4 left-4 z-[200] bg-red-600 text-white px-4 py-2 rounded-md shadow-lg focus-within:ring-2 focus-within:ring-white">
          <a 
            href="#main-content" 
            className="text-sm font-medium focus:outline-none"
          onFocus={() => setShowSkipNav(true)}
            onBlur={() => setShowSkipNav(false)}
          >
            Skip to main content
          </a>
        </div>

      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-900/50 z-[150] backdrop-blur-sm">
        <motion.div 
                        className="h-full bg-gradient-to-r from-red-600 to-red-500 origin-left"
          style={{ scaleX: readingProgress / 100 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: readingProgress / 100 }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Quick Start Floating CTA */}
      <AnimatePresence>
        {showQuickStart && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed right-8 z-[100] ${showScrollTop ? 'bottom-32' : 'bottom-8'}`}
            style={{ 
              transition: 'bottom 0.3s ease-out',
            }}
          >
            <Link href="/contact">
              <button 
                className="group relative flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black backdrop-blur-md border border-red-500/20 animate-pulse"
                onFocus={(e) => handleFocusCapture(e.target as HTMLElement)}
                aria-label="Quick start - Get in touch"
              >
                {/* Subtle ring animation */}
                <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping"></div>
                <div className="relative z-10 flex items-center gap-3">
                  <span className="font-semibold">Quick Start</span>
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Accessibility: Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {activeSection && `Now viewing ${sections.find((s: HomepageSection) => s.id === activeSection)?.title || activeSection} section`}
      </div>

      {/* Accessibility: Focus trap for modals/overlays */}
      <div id="modal-root" role="dialog" aria-hidden="true" />

      {/* Accessibility: Landmark regions */}
      <div className="sr-only">
        <h1>Torch Group - Premier Creative Agency & Digital Talent Platform</h1>
        <nav aria-label="Page sections">
          <ul>
            {sections.filter((s: HomepageSection) => s.enabled).map((section: HomepageSection) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Smooth scroll button */}
      {showScrollTop && (
        <button 
          onClick={handleButtonClick(scrollToTop)}
          className="fixed bottom-8 right-8 z-50 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-800 transition-all duration-300 animate-fade-in focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label="Scroll to top of page"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* Main content wrapper for accessibility */}
      <main id="main-content" role="main">
        {/* ENHANCED HERO SECTION */}
        <section 
          id="hero" 
          className="relative flex flex-col justify-center items-center min-h-screen z-10 overflow-hidden pt-comfortable pb-spacious px-comfortable"
          aria-label="Hero section - Welcome to Torch Group"
          style={{ willChange: prefersReducedMotion ? 'auto' : 'transform, opacity' }}
        >
          {/* Enhanced Background Effects - Refined for Better Symmetry */}
          <div className="absolute inset-0 -z-10">
            {/* Primary central glow - Enhanced intensity and better centering */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[700px] bg-gradient-to-br from-red-500/25 via-red-600/40 to-red-700/30 blur-[160px] rounded-full animate-pulse-slow"></div>
            
            {/* Symmetrical accent glows - Balanced positioning and intensity */}
            <div className="absolute top-[20%] left-[15%] w-[450px] h-[450px] bg-gradient-to-br from-red-500/20 to-red-500/15 blur-[110px] rounded-full animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-[20%] right-[15%] w-[450px] h-[450px] bg-gradient-to-br from-red-600/20 to-red-600/15 blur-[110px] rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            
            {/* Additional symmetrical corner glows for depth */}
            <div className="absolute top-[30%] right-[25%] w-[300px] h-[300px] bg-red-400/10 blur-[80px] rounded-full animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute bottom-[30%] left-[25%] w-[300px] h-[300px] bg-red-500/10 blur-[80px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            
            {/* Subtle grid overlay */}
            <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>

          {/* Hero content */}
          <motion.div 
            className="torch-container-content flex flex-col items-center justify-center w-full mx-auto text-center z-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
                         {/* Enhanced Logo Section */}
             <motion.div 
               className="mt-10 mb-2 relative group flex flex-col items-center"
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
             >
               {/* Main logo container with refined glow */}
               <div className="relative flex items-center justify-center w-[320px] h-[320px] sm:w-[380px] sm:h-[380px]">
                 {/* Refined single-layer glow */}
                 <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-red-600/40 to-red-700/30 blur-[80px] rounded-full transition-all duration-500 group-hover:blur-[100px] group-hover:from-red-400/40 group-hover:via-red-500/50 group-hover:to-red-600/40 animate-pulse-slow"></div>
                 
                 {/* Logo */}
                 <Image 
                   src="/images/logo.png"
                   alt="Torch Logo"
                   width={320}
                   height={320}
                   priority
                   className="object-contain relative z-10 drop-shadow-2xl group-hover:scale-105 group-hover:drop-shadow-[0_0_70px_#dc2626dd] transition-all duration-500 cursor-pointer w-[260px] h-[260px] sm:w-[320px] sm:h-[320px]"
                   style={{ aspectRatio: '1/1', willChange: prefersReducedMotion ? 'auto' : 'transform' }}
                   onClick={handleLogoClick}
                   ref={logoImgRefDesktop}
                 />
               </div>
             </motion.div>

                         {/* Enhanced Main Heading */}
             <motion.h1 
               className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 text-white tracking-tight leading-tight text-center flex flex-col items-center justify-center -mt-8 sm:-mt-10"
               style={{ position: 'relative', zIndex: 20 }}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
             >
               <span className="block mb-1 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl text-center">
                 Welcome to
               </span>
               <span className="relative block torch-text-primary drop-shadow-2xl text-center">
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
             </motion.h1>

            {/* Enhanced Tagline */}
            <motion.div 
              className="mt-2 mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9, ease: 'easeOut' }}
            >
              <BlurText
                text="Every Idea Starts With A Torch"
                className={cn("block text-lg md:text-xl lg:text-2xl text-gray-100 font-bold drop-shadow-lg tracking-wide", merriweather.className)}
                animateBy="words"
                direction="top"
                delay={1000}
                stepDuration={0.4}
                shiny={true}
              />
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-compact sm:gap-comfortable mt-comfortable"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
            >
              <button
                onClick={handleButtonClick(() => scrollToSection('about-torch'))}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-12 py-4 text-lg font-bold text-white shadow-2xl transition-all duration-500 hover:scale-105 hover:from-orange-400 hover:to-red-500 hover:shadow-[0_0_40px_rgba(255,87,34,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black z-20 flex items-center justify-center gap-2 w-full sm:w-auto min-w-[180px] backdrop-blur-md border border-orange-400/20"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Torch 
                  <ArrowDownIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
              
              <a
                href="/contact"
                className="group relative overflow-hidden rounded-full border-2 border-red-500/60 px-12 py-4 text-lg font-bold text-red-400 bg-black/40 shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-gradient-to-r hover:from-red-600/30 hover:to-red-500/30 hover:text-red-300 hover:border-red-400/80 hover:shadow-[0_0_40px_rgba(220,38,38,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black z-20 flex items-center justify-center gap-2 w-full sm:w-auto min-w-[180px] backdrop-blur-md"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Contact Us 
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </a>
                         </motion.div>
           </motion.div>
        </section>

        {/* About Torch Group block moved here */}
        <Section id="about-torch" className="py-16 md:py-24 relative overflow-hidden">
          {/* Enhanced background with multiple glow effects */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600/15 blur-[120px] rounded-full animate-pulse-slow"></div>
            <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-red-500/10 blur-[80px] rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[200px] bg-red-700/10 blur-[100px] rounded-full"></div>
          </div>
          
          <div className="torch-container-wide mx-auto relative z-10">
            <div className="flex flex-col items-center text-center">
              {/* Section Label */}
              <div className="inline-flex items-center justify-center mb-8">
                <span className="torch-section-title">About Us</span>
              </div>

              {/* Enhanced Main Title with Hover Effects */}
              <motion.h2 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-12 text-white tracking-tight group cursor-default"
                whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                } : {}}
              >
                <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                  About
                </span>{" "}
                <span className="torch-text-accent relative group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)] transition-all duration-300">
                  Torch
                  <motion.div 
                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full"
                    initial={{ width: "0%" }}
                    whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                      width: "100%",
                      transition: { duration: 0.5, ease: "easeOut" }
                    } : {}}
                  />
                </span>
              </motion.h2>

              {/* Improved Typewriter Section */}
              <motion.div 
                className="mb-8 max-w-4xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="text-center space-y-comfortable">
                  <span className="block text-xl md:text-2xl lg:text-3xl font-bold text-white leading-relaxed">
                    Empowering Creative Entities & Talents
                  </span>
                  <span className="block text-lg md:text-xl font-semibold text-gray-100 leading-relaxed">
                    Through{' '}
                    <span className="torch-text-primary font-bold">
                      <span className="inline-block">
                        <span className="typewriter">
                          {typewriterText}
                        </span>
                        <Cursor />
                      </span>
                    </span>
                    {' '}solutions & Strategic Partnerships
                  </span>
                </div>
              </motion.div>

              {/* Enhanced Decorative Divider */}
              <motion.div 
                className="flex justify-center mb-16"
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                <div className="relative">
                  <div className="w-40 h-1 bg-gradient-to-r from-red-600 via-white/80 to-red-600 rounded-full"></div>
                  <div className="absolute inset-0 w-40 h-1 bg-gradient-to-r from-red-600 via-white/80 to-red-600 rounded-full animate-pulse-slow opacity-60"></div>
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full shadow-lg shadow-red-600/50"></div>
                </div>
              </motion.div>
              
              {/* Enhanced Content Cards */}
                              <div className="torch-container-wide mx-auto space-y-generous">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="relative"
                >
                  {/* Main Statement Card - Improved */}
                  <div className="relative bg-gradient-to-br from-black/70 via-black/50 to-black/70 backdrop-blur-xl border border-red-600/30 rounded-3xl p-8 md:p-12 mb-8 shadow-2xl shadow-red-900/30 hover:shadow-red-600/40 transition-all duration-700 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/8 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute top-4 right-4 w-16 h-16 bg-red-600/10 rounded-full blur-xl"></div>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-8 leading-tight relative z-10 text-center">
                      Igniting creativity and empowering talent to shape{' '}
                      <span className="torch-text-primary relative">
                        the future of digital content
                        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-600/0 via-red-600/80 to-red-600/0 rounded-full"></div>
                      </span>
                    </h3>
                  </div>

                  {/* Enhanced Description Card */}
                  <div className="relative bg-gradient-to-br from-black/50 via-black/30 to-black/50 backdrop-blur-xl border border-white/20 rounded-2xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-700 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute top-6 left-6 w-12 h-12 bg-white/5 rounded-full blur-lg"></div>
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                      <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-medium mb-6">
                        We're more than just a creative agency – we're a{' '}
                                        <span className="torch-text-primary font-semibold">catalyst for innovation</span>, a{' '}
                <span className="torch-text-primary font-semibold">platform for exceptional talent</span>, and a{' '}
                <span className="torch-text-primary font-semibold">driving force</span> in the evolving media landscape.
                      </p>
                      <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-generous md:gap-expansive mt-generous"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={{
                          hidden: {},
                          visible: {
                            transition: {
                              staggerChildren: 0.2,
                            },
                          },
                        }}
                      >
                        {[
                          {
                            icon: <Zap className="h-12 w-12" />,
                            title: "Innovation",
                            subtitle: "Cutting-edge solutions",
                            description: "We push the boundaries of what's possible, creating groundbreaking digital experiences that set new industry standards."
                          },
                          {
                            icon: <Star className="h-12 w-12" />,
                            title: "Talent",
                            subtitle: "Exceptional creativity",
                            description: "Our diverse network of creative professionals brings unique perspectives and world-class expertise to every project."
                          },
                          {
                            icon: <TrendingUp className="h-12 w-12" />,
                            title: "Growth",
                            subtitle: "Strategic partnerships",
                            description: "We forge meaningful alliances that drive sustainable growth and create lasting value for all stakeholders."
                          }
                        ].map((feature, idx) => (
                          <motion.div
                            key={feature.title}
                            variants={{
                              hidden: { opacity: 0, y: 40 },
                              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', delay: idx * 0.2 } },
                            }}
                            className="group relative overflow-hidden rounded-3xl backdrop-blur-lg shadow-2xl transition-all duration-700 ease-out bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 border-2 border-red-900/30 hover:border-red-600/60 hover:shadow-red-900/40 hover:shadow-2xl p-8 min-h-[320px] flex flex-col items-center justify-center text-center
                                       hover:scale-[1.02] hover:-translate-y-1
                                       active:scale-[0.98] active:translate-y-0
                                       md:hover:scale-105 md:hover:-translate-y-2"
                          >
                            {/* Subtle background pattern - static to avoid flickering */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                              <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:20px_20px]"></div>
                            </div>
                            
                            {/* Gentle glow overlay on hover - CSS only */}
                            <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 via-red-600/0 to-red-600/0 rounded-3xl opacity-0 group-hover:from-red-600/5 group-hover:via-red-600/10 group-hover:to-red-600/5 group-hover:opacity-100 transition-all duration-700 pointer-events-none"></div>
                            
                            {/* Content wrapper */}
                            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                              {/* Icon container */}
                              <div className="mb-6 relative flex items-center justify-center">
                                <div className="absolute inset-0 w-20 h-20 bg-red-600/30 blur-[30px] rounded-full group-hover:bg-red-500/40 group-hover:blur-[40px] transition-all duration-700"></div>
                                <div className="w-20 h-20 flex items-center justify-center relative z-10 torch-text-primary group-hover:torch-text-accent transition-colors duration-500">
                                  {feature.icon}
                                </div>
                              </div>
                              
                              {/* Title */}
                              <h3 className="text-2xl font-bold mb-3 tracking-tight text-white group-hover:text-red-100 transition-colors duration-500">
                                {feature.title}
                              </h3>
                              
                              {/* Subtitle */}
                              <div className="text-base font-semibold mb-4 torch-text-primary group-hover:torch-text-accent transition-colors duration-500">
                                {feature.subtitle}
                              </div>
                              
                              {/* Description */}
                              <p className="text-gray-300 text-base leading-relaxed group-hover:text-gray-200 transition-colors duration-500">
                                {feature.description}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
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
            logoClickTrigger={logoClickTrigger}
          />

          {/* Added: Pure black overlay for all pages */}
          <div className="fixed inset-0 -z-10 bg-black opacity-90"></div>

          {/* Added: Cursor following red glow */}
          {mounted && (
            <div
              className="fixed w-64 h-64 bg-red-600/40 blur-[100px] rounded-full pointer-events-none -z-10 transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${mousePosition.x}px`, top: `${mousePosition.y}px`, mixBlendMode: 'screen' }}
            ></div>
          )}

          {/* Conditionally render other sections based on their enabled status and in order */}
          {isSectionEnabled('services') && (
            <Section id="services">
              <div className="torch-container-wide mx-auto relative">
                {/* Animated red glow background */}
                <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                  <div className="w-[600px] h-[300px] bg-red-600/20 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
                </div>
                <div className="text-center mb-16">
                  <div className="torch-section-header mb-8">
                    <span className="torch-section-title">WHAT WE DO</span>
                  </div>
                  <motion.h2 
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg group cursor-default"
                    whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                      scale: 1.02,
                      transition: { duration: 0.3, ease: "easeOut" }
                    } : {}}
                  >
                    <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                      Our
                    </span>{" "}
                    <span className="torch-text-accent relative group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)] transition-all duration-300">
                      Services
                      <motion.div 
                        className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full"
                        initial={{ width: "0%" }}
                        whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                          width: "100%",
                          transition: { duration: 0.5, ease: "easeOut" }
                        } : {}}
                      />
                    </span>
                  </motion.h2>
                  <div className="flex justify-center mb-4">
                    <div className="torch-divider"></div>
                  </div>
                  <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-2">
                    Comprehensive digital solutions to ignite your brand and accelerate growth.
                  </p>
                  <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                    We offer everything you need to succeed in the digital landscape.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-generous md:gap-expansive justify-center items-stretch mt-grand">
                  {[
                    {
                      title: "B2C",
                      description: "Enjoy with Our Torch Group Services & e commerce will help your creative products & services that fit your needs",
                      icon: <ShoppingCart className="h-16 w-16" />
                    },
                    {
                      title: "B2T", 
                      description: "Our Talents membership services will help your content grow online/offline engagement & attract more audience & Followers",
                      icon: <Star className="h-16 w-16" />
                    },
                    {
                      title: "B2B",
                      description: "Our entities/brands membership services will help your business grow online/offline & attract more audience & customers", 
                      icon: <Building2 className="h-16 w-16" />
                    },
                    {
                      title: "B2A",
                      description: "Business to All Allies Connect, collaborate, and grow with our network of partners, allies, and creative entities.",
                      icon: <Users className="h-16 w-16" />
                    }
                  ].map((service, index) => (
                    <motion.div
                      key={service.title}
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
                              <div className="torch-text-primary drop-shadow-2xl transition-all duration-500 group-hover:scale-110 relative z-10">
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
                          {service.title === "B2C" ? (
                            <button 
                              onClick={() => scrollToSection('torch-group')}
                              className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 border border-orange-500/20 backdrop-blur-sm transform hover:scale-105 hover:from-orange-400 hover:to-red-500 hover:shadow-[0_0_25px_rgba(255,87,34,0.4)]"
                            >
                              Discover More
                            </button>
                          ) : service.title === "B2T" || service.title === "B2B" ? (
                            <Link href="/services">
                              <button className="px-8 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 border border-yellow-500/20 backdrop-blur-sm transform hover:scale-105 hover:from-yellow-400 hover:to-orange-400 hover:shadow-[0_0_25px_rgba(255,193,7,0.4)]">
                                Get your Membership
                              </button>
                            </Link>
                          ) : (
                            <Link href="/services">
                              <button className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 border border-orange-500/20 backdrop-blur-sm transform hover:scale-105 hover:from-orange-400 hover:to-red-500 hover:shadow-[0_0_25px_rgba(255,87,34,0.4)]">
                                Learn More
                              </button>
                            </Link>
                          )}
                        </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Section>
          )}

          {isSectionEnabled('torch-group') && (
            <Section id="torch-group">
              <div className="torch-container-wide mx-auto relative z-10">
                {/* Animated red glow background */}
                <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                  <div className="w-[700px] h-[320px] md:w-[900px] md:h-[400px] bg-red-600/20 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
                </div>
                <div className="text-center mb-16">
                  <div className="torch-section-header mb-8">
                    <span className="torch-section-title">OUR BRANDS</span>
                  </div>
                  <motion.h2 
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg tracking-tight group cursor-default"
                    whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                      scale: 1.02,
                      transition: { duration: 0.3, ease: "easeOut" }
                    } : {}}
                  >
                    <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                      Torch
                    </span>{" "}
                    <span className="torch-text-accent relative group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)] transition-all duration-300">
                      Group
                      <motion.div 
                        className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full"
                        initial={{ width: "0%" }}
                        whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                          width: "100%",
                          transition: { duration: 0.5, ease: "easeOut" }
                        } : {}}
                      />
                    </span>
                  </motion.h2>
                  <div className="flex justify-center mb-4">
                    <div className="torch-divider"></div>
                  </div>
                  <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-2">
                    Explore our family of brands, each dedicated to excellence in their specialized fields.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-14 justify-center items-stretch mb-16">
                  {torchBrands.map((brand, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: brand.isComingSoon 
                          ? '0 0 40px 8px #6b7280aa'
                          : brand.name === "Torch Shop"
                          ? '0 0 40px 8px #a855f7aa'
                          : brand.name === "Torch Loop"
                          ? '0 0 40px 8px #14b8a6aa'
                          : '0 0 40px 8px #dc2626aa'
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`group relative overflow-hidden rounded-3xl backdrop-blur-lg shadow-2xl transition-all duration-500 animate-fade-in flex flex-col items-center justify-between min-h-[320px] ${
                        brand.isComingSoon 
                          ? "border-2 border-gray-700/50 bg-gradient-to-br from-gray-900/60 via-black/80 to-gray-900/60 hover:border-gray-600/70 hover:shadow-gray-900/30" 
                          : brand.name === "Torch Shop" 
                            ? "border-2 border-purple-900/30 bg-gradient-to-br from-black/90 via-purple-950/20 to-black/90 hover:border-purple-600 hover:shadow-purple-900/40 hover:shadow-2xl"
                            : brand.name === "Torch Loop"
                            ? "border-2 border-teal-900/30 bg-gradient-to-br from-black/90 via-teal-950/20 to-black/90 hover:border-teal-600 hover:shadow-teal-900/40 hover:shadow-2xl"
                            : "border-2 border-red-900/30 bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 hover:border-red-600 hover:shadow-red-900/40 hover:shadow-2xl"
                      }`}
                      style={{ animationDelay: `${index * 0.08 + 0.1}s` }}
                    >
                      {/* Status Badge */}
                      {!brand.isComingSoon && (
                        <div className="absolute top-4 right-4 z-10">
                          <div className="flex items-center gap-1 px-3 py-1 bg-green-600/20 border border-green-500/40 rounded-full">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-400 text-xs font-semibold">LIVE</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Subtle grid pattern overlay */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="w-full h-full bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                      </div>

                      {/* Content area (flex-grow to push button down) */}
                      <div className="p-8 pt-12 flex flex-col items-center text-center w-full flex-grow relative z-10">
                        {/* Icon with glow */}
                        <div className="mb-6 relative flex items-center justify-center">
                          <div className={`absolute inset-0 w-20 h-20 blur-[40px] rounded-full transition-all duration-500 ${
                            brand.isComingSoon 
                              ? "bg-gray-600/30 group-hover:blur-[50px]" 
                              : brand.name === "Torch Shop"
                                ? "bg-purple-600/50 group-hover:blur-[60px] group-hover:bg-purple-500/60"
                                : brand.name === "Torch Loop"
                                ? "bg-teal-600/50 group-hover:blur-[60px] group-hover:bg-teal-500/60"
                                : "bg-red-600/50 group-hover:blur-[60px] group-hover:bg-red-500/60"
                          }`}></div>
                          {/* Logo container with consistent sizing */}
                          <div className="w-20 h-20 flex items-center justify-center relative z-10">
                          {brand.name === "Torch Shop" ? (
                            <Image 
                              src="/images/torch-shop.PNG" 
                              alt="Torch Shop Logo" 
                              width={80} 
                              height={80} 
                              className="object-contain drop-shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_32px_#a855f7cc]" 
                            />
                          ) : brand.name === "Torch Loop" ? (
                            <Image 
                              src="/images/torch-loop.PNG" 
                              alt="Torch Loop Logo" 
                              width={120} 
                              height={120} 
                              className="object-contain drop-shadow-2xl transition-all duration-500 group-hover:scale-[1.485] group-hover:drop-shadow-[0_0_32px_#14b8a6cc] scale-[1.35]" 
                            />
                          ) : (
                            <Flame className={`h-16 w-16 drop-shadow-2xl transition-all duration-500 group-hover:scale-110 relative z-10 ${
                              brand.isComingSoon ? "text-gray-500" : "text-red-600"
                            }`} />
                          )}
                          </div>
                        </div>
                        <h3 className={`text-2xl font-bold mb-3 tracking-tight drop-shadow-lg transition-colors duration-300 ${
                          brand.isComingSoon 
                            ? "text-gray-300" 
                            : brand.name === "Torch Shop"
                            ? "text-white group-hover:text-purple-100"
                            : brand.name === "Torch Loop"
                            ? "text-white group-hover:text-teal-100"
                            : "text-white group-hover:text-red-100"
                        }`}>{brand.name}</h3>
                        <p className={`text-base leading-relaxed min-h-[60px] transition-colors duration-300 ${
                          brand.isComingSoon 
                            ? "text-gray-500" 
                            : brand.name === "Torch Shop"
                            ? "text-gray-300 group-hover:text-purple-200"
                            : brand.name === "Torch Loop"
                            ? "text-gray-300 group-hover:text-teal-200"
                            : "text-gray-300 group-hover:text-gray-200"
                        }`}>{brand.description}</p>
                      </div>
                      
                      {/* Button or Coming Soon */}
                      <div className="p-8 pt-0 flex items-center justify-center w-full relative z-10">
                        {brand.isComingSoon ? (
                          <div className="flex items-center gap-2 px-6 py-3 bg-gray-800/50 border border-gray-600/40 text-gray-400 text-sm rounded-full font-semibold backdrop-blur-sm">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                            Coming Soon
                          </div>
                        ) : (
                          <Link href={brand.link} target="_blank" rel="noopener noreferrer">
                            <button className={`px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transform hover:scale-105 backdrop-blur-sm ${
                              brand.name === "Torch Shop"
                                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-500 hover:to-purple-600 focus-visible:ring-purple-400 border border-purple-500/20"
                                : brand.name === "Torch Loop"
                                ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-500 hover:to-teal-600 focus-visible:ring-teal-400 border border-teal-500/20"
                                : "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 focus-visible:ring-red-400 border border-red-500/20"
                            }`}>
                              Visit Website
                            </button>
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Section>
          )}

          {/* Blog Section */}
          {isSectionEnabled('blog') && (
            <Section id="blog">
              <div className="torch-container-wide mx-auto relative">
                {/* Animated red glow background */}
                <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                  <div className="w-[600px] h-[300px] bg-red-600/20 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
                </div>
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center mb-8">
                    <div className="h-px w-8 bg-red-600/80 mr-2"></div>
                    <span className="torch-section-title">INSIGHTS</span>
                    <div className="h-px w-8 bg-red-600/80 ml-2"></div>
                  </div>
                                  <motion.h2 
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg group cursor-default"
                  whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" }
                  } : {}}
                >
                  <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    Our
                  </span>{" "}
                  <span className="torch-text-accent relative group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)] transition-all duration-300">
                    Blog
                    <motion.div 
                      className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full"
                      initial={{ width: "0%" }}
                      whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                        width: "100%",
                        transition: { duration: 0.5, ease: "easeOut" }
                      } : {}}
                    />
                  </span>
                </motion.h2>
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
                  </div>
                  <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-2">
                    Discover the latest insights, Talents News, Top Talents Lists, Creative Entities, Creative Broken Records & Creative Content
                  </p>
                </div>
                {blogPosts && blogPosts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-spacious sm:gap-generous lg:gap-expansive">
                    {blogPosts.slice(0, 3).map((post, index) => (
                      <motion.div
                        key={post.id}
                        ref={blogTiltRefs[index]}
                        whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                          scale: 1.05, 
                          boxShadow: '0 0 40px 8px #dc2626aa',
                          transition: { type: 'spring', stiffness: 300, damping: 20 }
                        } : {}}
                        className="group relative overflow-hidden rounded-3xl backdrop-blur-lg shadow-2xl transition-all duration-500 animate-fade-in flex flex-col min-h-[320px] border-2 border-red-900/30 bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 hover:border-red-600 hover:shadow-red-900/40 hover:shadow-2xl focus-within:ring-2 focus-within:ring-red-500/50"
                        style={{ 
                          animationDelay: isOlderDevice ? '0s' : `${index * 0.08 + 0.1}s`,
                          animationDuration: isOlderDevice ? '0s' : '0.6s',
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        {/* Subtle grid pattern overlay */}
                        <div className="absolute inset-0 opacity-5">
                          <div className="w-full h-full bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                        </div>

                        {/* Content area */}
                        <div className="p-8 flex flex-col flex-grow relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <span className="torch-text-primary text-sm font-semibold uppercase tracking-wide">
                              {post.category || 'Blog'}
                            </span>
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                              <Clock className="w-3 h-3" />
                              <span>{calculateReadingTime(post.excerpt || post.content || '')} min</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                            <span>By {post.author || 'Torch Team'}</span>
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-100 transition-colors duration-300 tracking-tight drop-shadow-lg">
                            {post.title}
                          </h3>
                          <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3 group-hover:text-gray-200 transition-colors duration-300 flex-grow">
                            {post.excerpt || post.content?.substring(0, 120) + '...'}
                          </p>
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2">
                              <Bookmark className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-400 text-xs">
                                {post.tags || 'Article'}
                            </span>
                            </div>
                            <Link href={`/blog/${post.slug}`}>
                              <button 
                                className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold text-sm hover:from-orange-400 hover:to-red-500 transition-all duration-300 flex items-center gap-1 shadow-lg hover:shadow-xl hover:shadow-[0_0_20px_rgba(255,87,34,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black border border-orange-500/20 backdrop-blur-sm transform hover:scale-105 group-hover:translate-x-1"
                                aria-label={`Read more about ${post.title}`}
                                onFocus={(e) => handleFocusCapture(e.target as HTMLElement)}
                              >
                                <span>Read More</span>
                                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
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
                          <BookOpen className="h-8 w-8 torch-text-primary" />
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
                      <button className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold shadow-lg hover:from-orange-400 hover:to-red-500 hover:shadow-[0_0_25px_rgba(255,87,34,0.4)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 transform hover:scale-105">
                        View All Posts
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </Section>
          )}

          {isSectionEnabled('torch-talents') && (
            <Section id="torch-talents">
              <div className="torch-container-wide mx-auto relative">
                {/* Animated red glow background */}
                <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                  <div className="w-[600px] h-[300px] bg-red-600/20 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
                </div>
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center mb-8">
                    <div className="h-px w-8 bg-red-600/80 mr-2"></div>
                    <span className="torch-section-title">OUR TALENTS</span>
                    <div className="h-px w-8 bg-red-600/80 ml-2"></div>
                  </div>
                  <motion.h2 
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg tracking-tight group cursor-default"
                    whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                      scale: 1.02,
                      transition: { duration: 0.3, ease: "easeOut" }
                    } : {}}
                  >
                    <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                      Top Torch
                    </span>{" "}
                    <span className="torch-text-accent relative group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)] transition-all duration-300">
                      Talents
                      <motion.div 
                        className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full"
                        initial={{ width: "0%" }}
                        whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                          width: "100%",
                          transition: { duration: 0.5, ease: "easeOut" }
                        } : {}}
                      />
                    </span>
                  </motion.h2>
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
                  </div>

                </div>
                {activeTalents && activeTalents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-spacious sm:gap-generous lg:gap-expansive">
                    {displayTalents.map((talent, index) => (
                      <motion.div
                        key={talent.id || `placeholder-${index}`}
                        whileHover={{ scale: 1.05, boxShadow: '0 0 40px 8px #dc2626aa' }}
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
                          {/* Avatar with glow */}
                          <div className="mb-6 relative flex items-center justify-center">
                            <div className="absolute inset-0 w-20 h-20 bg-red-600/50 blur-[40px] rounded-full transition-all duration-500 group-hover:blur-[60px] group-hover:bg-red-500/60"></div>
                            <div className="w-20 h-20 flex items-center justify-center relative z-10">
                              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600/20 to-red-800/20 flex items-center justify-center border-2 border-red-600/30 group-hover:border-red-500 transition-colors duration-300 drop-shadow-2xl group-hover:scale-110">
                                {talent.isPlaceholder ? (
                                  <User className="h-10 w-10 torch-text-primary" />
                                ) : (
                                                                      <span className="text-2xl font-bold torch-text-primary">
                                    {talent.name?.charAt(0) || 'T'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold mb-3 tracking-tight drop-shadow-lg transition-colors duration-300 text-white group-hover:text-red-100">
                            {talent.name || 'Coming Soon'}
                          </h3>
                          <p className="torch-text-primary text-sm font-semibold mb-3 uppercase tracking-wide">
                            {talent.specialty || 'New Talent'}
                          </p>
                          <p className="text-base leading-relaxed min-h-[60px] transition-colors duration-300 text-gray-300 group-hover:text-gray-200">
                            {talent.bio || 'Exciting new talent joining our team soon. Stay tuned for updates!'}
                          </p>
                        </div>
                        
                        {/* Badge */}
                        <div className="p-8 pt-0 flex items-center justify-center w-full relative z-10">
                          {talent.isPlaceholder ? (
                            <div className="flex items-center gap-2 px-6 py-3 bg-red-800/50 border border-red-600/40 text-red-400 text-sm rounded-full font-semibold backdrop-blur-sm">
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                              Coming Soon
                            </div>
                          ) : (
                            <div className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 border border-red-500/20 backdrop-blur-sm transform hover:scale-105">
                              Active Talent
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
                          <Users className="h-8 w-8 torch-text-primary" />
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
              </div>
            </Section>
          )}

          {/* TOP TORCH ALLIES SECTION */}
          <Section id="top-partners">
            <div className="torch-container-wide mx-auto relative">
              {/* Enhanced background with glow effects */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                <div className="w-[700px] h-[320px] md:w-[900px] md:h-[400px] bg-red-600/15 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
              </div>
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center mb-8">
                  <div className="h-px w-8 bg-red-600/80 mr-2"></div>
                                      <span className="torch-section-title">ALLIES</span>
                  <div className="h-px w-8 bg-red-600/80 ml-2"></div>
                </div>
                <motion.h2 
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg tracking-tight group cursor-default"
                  whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" }
                  } : {}}
                >
                  <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    Top Torch
                  </span>{" "}
                  <span className="torch-text-accent relative group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)] transition-all duration-300">
                    Allies
                    <motion.div 
                      className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full"
                      initial={{ width: "0%" }}
                      whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                        width: "100%",
                        transition: { duration: 0.5, ease: "easeOut" }
                      } : {}}
                    />
                  </span>
                </motion.h2>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 justify-center items-stretch mb-16">
                {[1,2,3].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={{
                      scale: 1.08,
                      boxShadow: '0 25px 50px -12px rgba(220, 38, 38, 0.4), 0 0 60px 12px rgba(220, 38, 38, 0.25)',
                      y: -12,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl group transition-all duration-700 border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.02] to-white/5 hover:border-red-500/40 backdrop-blur-2xl hover:backdrop-blur-3xl min-h-[280px] cursor-pointer hover:bg-gradient-to-br hover:from-red-600/10 hover:via-white/[0.03] hover:to-red-600/10"
                  >
                    {/* Enhanced multi-layer background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/8 via-transparent to-red-600/12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                    
                    {/* Animated dot pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-700">
                      <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:24px_24px] group-hover:animate-pulse"></div>
                    </div>
                    
                    {/* Enhanced Torch logo watermark with glow */}
                    <div className="absolute inset-0 flex items-center justify-center z-5 pointer-events-none">
                      <div className="relative">
                        <Image 
                          src="/images/logo.png" 
                          alt="Torch Logo Watermark" 
                          width={140} 
                          height={140} 
                          loading="lazy"
                          className="opacity-15 object-contain mx-auto group-hover:opacity-25 transition-all duration-700 scale-90 group-hover:scale-100" 
                          style={{aspectRatio: '1/1', willChange: prefersReducedMotion ? 'auto' : 'opacity, transform'}} 
                        />
                        {/* Subtle glow behind logo */}
                        <div className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
                      </div>
                    </div>
                    
                    {/* Main content area with enhanced layout */}
                    <div className="absolute inset-0 rounded-3xl overflow-hidden flex flex-col items-center justify-center z-20 p-8">
                      {/* Professional Play Button */}
                      <div className="relative mb-6 group-hover:scale-110 transition-all duration-500">
                        {/* Outer glow ring */}
                        <div className="absolute inset-0 w-20 h-20 bg-red-600/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                        
                        {/* Main play button */}
                        <div className="relative w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-2xl border-2 border-red-400/50 group-hover:border-red-300/80 group-hover:shadow-red-500/50 transition-all duration-500">
                          {/* Inner play icon */}
                          <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1 drop-shadow-sm"></div>
                          
                          {/* Ripple effect */}
                          <div className="absolute inset-0 rounded-full border-2 border-red-400/30 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700"></div>
                          
                          {/* Pulse ring */}
                          <div className="absolute inset-0 rounded-full bg-red-500/20 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 animate-ping"></div>
                        </div>
                      </div>
                      
                      {/* Enhanced typography */}
                      <div className="text-center space-y-4">
                        {/* Professional "Coming Soon" badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-900/30 to-red-800/30 backdrop-blur-md border border-red-500/30 rounded-full group-hover:border-red-400/50 group-hover:bg-gradient-to-r group-hover:from-red-800/40 group-hover:to-red-700/40 transition-all duration-500 shadow-lg">
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse group-hover:bg-red-300"></div>
                          <span className="text-red-300 text-base font-semibold tracking-wide group-hover:text-red-200 transition-colors duration-300">
                            Coming Soon
                          </span>
                        </div>
                        
                        {/* Subtitle that appears on hover */}
                        <p className="text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 max-w-[220px] leading-relaxed">
                          Exclusive content collaboration launching soon
                        </p>
                      </div>
                    </div>

                                         {/* Enhanced Partner logo with glassy design */}
                     <div className="absolute top-4 left-4 z-30">
                       <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center group-hover:border-red-400/60 group-hover:bg-white/15 transition-all duration-500 group-hover:scale-105 shadow-lg">
                         <Image 
                           src="/images/logo.png" 
                           alt="Torch Logo" 
                           width={28} 
                           height={28} 
                           loading="lazy"
                           className="object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
                         />
                       </div>
                     </div>
                    
                    
                    
                    {/* Enhanced gradient overlay for better text contrast */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-15 opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Section>

          {isSectionEnabled('contact') && (
            <Section id="contact">
              <div className="torch-container-content mx-auto relative">
                {/* Perfectly fitted form glow - matches contact form dimensions exactly */}
                <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                  <div className="w-full max-w-4xl h-[600px] sm:h-[700px] md:h-[800px] bg-gradient-to-br from-red-600/30 via-red-500/20 to-red-700/25 blur-[100px] rounded-3xl animate-pulse-slow mx-3 sm:mx-6 md:mx-8 lg:mx-12"></div>
                </div>
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                  <div className="inline-flex items-center justify-center mb-6">
                    <div className="h-px w-6 sm:w-8 bg-red-600/80 mr-2"></div>
                    <span className="torch-section-title">CONTACT US</span>
                    <div className="h-px w-6 sm:w-8 bg-red-600/80 ml-2"></div>
                  </div>
                  <motion.h2 
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-3 sm:mb-4 text-white drop-shadow-lg leading-tight group cursor-default"
                    whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                      scale: 1.02,
                      transition: { duration: 0.3, ease: "easeOut" }
                    } : {}}
                  >
                    <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                      Get in
                    </span>{" "}
                    <span className="torch-text-accent relative group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)] transition-all duration-300">
                      Touch
                      <motion.div 
                        className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full"
                        initial={{ width: "0%" }}
                        whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                          width: "100%",
                          transition: { duration: 0.5, ease: "easeOut" }
                        } : {}}
                      />
                    </span>
                  </motion.h2>
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
                  </div>
                  <p className="text-base sm:text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-2 px-2">
                    Let's discuss your next project.
                  </p>
                  <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed px-2">
                    Fill out the form and our team will get back to you as soon as possible.
                  </p>
                </div>
                <div className="p-6 md:p-8 lg:p-10 bg-gradient-to-br from-black/95 via-black/90 to-black/95 backdrop-blur-2xl rounded-3xl relative z-20 shadow-2xl shadow-red-600/30 contact-form-card mb-8 sm:mb-12 border border-red-600/30 hover:border-red-500/50 hover:shadow-red-500/40 transition-all duration-700 group">
                  {/* Subtle inner glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-red-500/8 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Cool edge highlight */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-50 blur-sm"></div>
                  
                  <div className="relative z-10">
                    <ContactForm />
                  </div>
                </div>

                {/* Newsletter Subscription Section */}
                <div className="p-6 sm:p-8 md:p-10 bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-2xl rounded-3xl relative z-20 shadow-2xl shadow-red-600/20 border border-red-600/30 hover:border-red-500/50 hover:shadow-red-500/30 transition-all duration-700 group">
                  {/* Subtle inner glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-red-400/8 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Cool edge highlight */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-50 blur-sm"></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                        <Mail className="w-4 h-4 text-red-400" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white">Stay Updated</h3>
                    </div>
                    <p className="text-gray-300 mb-6 text-sm md:text-base max-w-md mx-auto">
                      Subscribe to our newsletter and get the latest insights, updates, and exclusive content delivered to your inbox.
                    </p>
                    <div className="max-w-md mx-auto">
                      <NewsletterForm />
                    </div>
                    <p className="text-gray-500 text-xs mt-3">No spam, unsubscribe at any time</p>
                  </div>
                </div>
              </div>
            </Section>
          )}
        </div>
      </main>
    </>
  );
}