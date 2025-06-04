"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink, FileText, Flame, ChevronRight, BarChart3, Users, ArrowUp, Check, X, User, Mail, Phone, MessageSquare, Send, Loader2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedGridBackground } from "@/components/ui/animated-grid-background";
import { FeatureCard } from "@/components/ui/feature-card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { ContactForm } from "@/components/forms/contact-form";
import useSWR from "swr";

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
  <section id={id} className={cn("py-24 relative", className)}>
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

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    const handleMouseMove = (event: MouseEvent) => {
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
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
      {mounted && (
        <Head>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-phone-input-2/2.15.1/style.css" />
        </Head>
      )}
      
      {/* Smooth scroll button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-800 transition-all duration-300 animate-fade-in"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
      
      {/* HERO SECTION WITH ANIMATION */}
      <section id="hero" className="relative flex flex-col items-center justify-center min-h-[80vh] py-40 px-4 md:px-12 z-10 overflow-hidden animate-fade-in duration-1000 ease-in-out">
        {/* Animated gradient background placeholder (can be removed later if not needed) */}
        {/* Reverted: Removed AnimatedGridBackground, black overlay, and red glow from hero section */}
        <div className="absolute inset-0 -z-10" />

        {/* Hero content */}
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto text-center z-20">
          <Image src="/images/logo.png" alt="Torch Logo" width={220} height={220} 
            className="mb-16 hero-logo animate-hero-logo w-[180px] h-[180px] sm:w-[220px] sm:h-[220px]"
            style={{ zIndex: 2 }}
            onClick={handleLogoClick}
            ref={logoImgRefDesktop}
          />
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 text-white tracking-tight hero-heading animate-hero-headline">
            Welcome to <span className="relative inline-block text-red-600">Torch
              <svg className="absolute left-0 -bottom-2 w-full h-3" viewBox="0 0 160 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 10C40 2 120 2 155 6" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <animate attributeName="stroke-dasharray" from="0,160" to="160,0" dur="1.2s" fill="freeze" />
                </path>
              </svg>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 hero-description animate-hero-fadein">
            <span className="font-semibold text-white">Empowering businesses through </span>
            <span className="text-red-500 font-bold">
              {useTypewriter({
                words: ['Media', 'Marketing', 'Talent', 'Innovation', 'Strategy', 'Growth'],
                loop: true,
                delaySpeed: 1800,
                typeSpeed: 80,
                deleteSpeed: 40,
              })[0]}
              <Cursor cursorColor="#dc2626" />
            </span>
            <span className="font-semibold text-white"> solutions and strategic partnerships.</span>
          </p>
            <button
            onClick={() => scrollToSection('torch-group')}
            className="hero-button rounded-full bg-red-600 px-12 py-5 text-lg font-bold text-white shadow-xl transition-all duration-500 hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 z-20 flex items-center justify-center gap-3 animate-hero-fadein mb-4"
          >
            Explore Torch <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
      </section>
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
              className="max-w-7xl mx-auto px-4 md:px-12 relative"
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
                <h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-lg">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 mt-16">
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px 8px #dc2626aa' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                <FeatureCard
                  title="Media Press"
                  description="Our digital marketing services will help your business grow online and attract more customers."
                    icon={<BarChart3 className="h-10 w-10 text-red-600 group-hover:text-white transition-colors duration-300" />}
                    className="w-full max-w-sm mx-auto border-2 border-black bg-gradient-to-br from-black/80 via-black/60 to-black/80 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-red-700/30 hover:border-red-600 transition-all duration-300 group hover:scale-105"
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px 8px #dc2626aa' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                <FeatureCard
                  title="Talent Support"
                  description="Strategic marketing campaigns to grow your brand presence and reach your target audience."
                    icon={<Users className="h-10 w-10 text-red-600 group-hover:text-white transition-colors duration-300" />}
                    className="w-full max-w-sm mx-auto border-2 border-black bg-gradient-to-br from-black/80 via-black/60 to-black/80 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-red-700/30 hover:border-red-600 transition-all duration-300 group hover:scale-105"
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px 8px #dc2626aa' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                <FeatureCard
                  title="Marketing Systems"
                  description="Connect with the best professionals in the industry to scale your team effectively."
                    icon={<Flame className="h-10 w-10 text-red-600 group-hover:text-white transition-colors duration-300" />}
                    className="w-full max-w-sm mx-auto border-2 border-black bg-gradient-to-br from-black/80 via-black/60 to-black/80 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-red-700/30 hover:border-red-600 transition-all duration-300 group hover:scale-105"
                />
                </motion.div>
              </div>
            </motion.div>
          </Section>
        )}

        {isSectionEnabled('torch-group') && (
          <Section id="torch-group" className="py-32 md:py-40">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="max-w-7xl mx-auto px-4 md:px-12 relative z-10"
            >
              {/* Animated red glow background */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                <div className="w-[700px] h-[320px] md:w-[900px] md:h-[400px] bg-red-600/20 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
            </div>
              <div className="flex flex-col items-center text-center mb-20 md:mb-24">
                <div className="inline-flex items-center justify-center mb-8">
                  <div className="h-px w-8 bg-red-600/80 mr-2"></div>
                  <span className="text-red-500 text-base font-bold tracking-widest">ABOUT US</span>
                  <div className="h-px w-8 bg-red-600/80 ml-2"></div>
                </div>
                <h2 className="text-5xl md:text-6xl font-black mb-6 text-white text-shadow tracking-tight drop-shadow-lg">
                  About <span className="text-red-600">Torch Group</span>
                </h2>
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
                </div>
                <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-3">
                  Igniting creativity and empowering talent to shape the future of digital content.
                </p>
                <p className="text-gray-400 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
                  We're more than just a creative agency – we're a catalyst for innovation, a platform for exceptional talent, and a driving force in the evolving media landscape.
                </p>
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-14 justify-center items-stretch mb-16"
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
        <motion.section
          id="blog"
          className="relative py-32 md:py-40 overflow-hidden border-t border-black/50"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Animated red glow background */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            <div className="w-[700px] h-[320px] md:w-[900px] md:h-[400px] bg-red-600/20 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 md:px-12 relative">
            <div className="text-center mb-16">
              <div className="text-red-500 font-semibold uppercase tracking-wider mb-6 flex items-center justify-center gap-4">
                <span className="h-px bg-red-500 w-8"></span>
                <span>STAY INFORMED</span>
                <span className="h-px bg-red-500 w-8"></span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-white drop-shadow-lg">Our Blog</h2>
              <div className="flex justify-center mb-6">
                <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
              </div>
              <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-3">
                Discover the latest insights, trends, and strategies in digital marketing, technology, and business growth.
              </p>
              <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                We share what matters most for your brand's growth.
              </p>
            </div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 justify-center items-stretch mt-12 mb-12"
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
              {blogLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 40 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
                    }}
                    className="bg-black/30 border border-black/50 rounded-xl overflow-hidden hover:border-red-500/50 transition-all duration-300 group min-h-[340px]"
                  >
                    <div className="h-48 bg-black/50 animate-pulse"></div>
                    <div className="p-6">
                      <div className="h-6 w-3/4 bg-black/50 animate-pulse mb-3"></div>
                      <div className="h-20 bg-black/50 animate-pulse mb-4"></div>
                      <div className="h-8 w-1/3 bg-black/50 animate-pulse"></div>
                    </div>
                  </motion.div>
                ))
              ) : blogPosts.length > 0 ? (
                blogPosts.map((post, i) => (
                  <motion.div
                    key={post.id} 
                    variants={{
                      hidden: { opacity: 0, y: 40 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
                    }}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px 8px #dc2626aa' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="bg-black/30 border border-black/50 rounded-xl overflow-hidden hover:border-red-500/50 transition-all duration-300 group min-h-[340px] flex flex-col"
                    style={{ animationDelay: `${i * 0.08 + 0.1}s` }}
                  >
                    <Link href={`/blog/${post.slug}`} className="flex-1 flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      {post.coverImage ? (
                        <Image 
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                          <div className="absolute inset-0 bg-gradient-to-r from-black to-black flex items-center justify-center">
                          <FileText className="h-16 w-16 text-gray-700" />
                        </div>
                      )}
                    </div>
                      <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-red-500 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                        <p className="text-gray-400 mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-auto">
                        <Calendar className="h-3 w-3 mr-2" />
                        <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </Link>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
                  }}
                  className="col-span-1 md:col-span-3 p-8 text-center bg-black/30 border border-black/50 rounded-xl min-h-[340px] flex flex-col items-center justify-center"
                >
                  <FileText className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Blog Posts Yet</h3>
                  <p className="text-gray-400 mb-4">Check back soon for articles and insights.</p>
                </motion.div>
              )}
            </motion.div>
            <div className="text-center mt-12">
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/blog">
                  View All Articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.section>

        {isSectionEnabled('torch-talents') && (
          <motion.section
            id="torch-talents"
            className="py-32 md:py-40 relative"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {/* Animated red glow background */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
              <div className="w-[700px] h-[320px] md:w-[900px] md:h-[400px] bg-red-600/20 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
            </div>
            <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10">
              <div className="text-center mb-20 md:mb-24">
                <div className="inline-flex items-center justify-center mb-8">
                  <div className="h-px w-8 bg-red-600/80 mr-2"></div>
                  <span className="text-red-500 text-base font-bold tracking-widest">FEATURED TALENT</span>
                  <div className="h-px w-8 bg-red-600/80 ml-2"></div>
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 text-white drop-shadow-lg">
                  <span className="text-white">Torch</span> <span className="text-red-600">Talents</span>
                </h2>
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
                </div>
                <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-3">
                    Projects and talents in various creative fields, raising the quality of creative life & audience awareness & engagement.
                  </p>
                <p className="text-gray-400 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
                  Discover the next generation of creative leaders and visionaries.
                </p>
                </div>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 justify-center items-stretch mb-16"
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
                {talentSilhouettes.map((talent, idx) => (
                  <motion.div
                    key={talent.id}
                    variants={{
                      hidden: { opacity: 0, y: 40 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
                    }}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px 8px #dc2626aa' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="flex items-center justify-center animate-fade-in"
                    style={{ animationDelay: `${idx * 0.08 + 0.1}s` }}
                  >
                    <div className="relative w-full max-w-[160px] h-[160px] md:max-w-[220px] md:h-[220px] talent-card group flex flex-col items-center justify-center">
                      {/* Animated red diamond background */}
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-red-700 via-red-500 to-red-700 rotate-45 transform-gpu shadow-2xl shadow-red-900/40 group-hover:scale-105 group-hover:shadow-red-600/40 transition-all duration-500 animate-pulse-slow"></div>
                      {/* White square frame */}
                      <div className="absolute inset-0 m-auto w-[90px] h-[90px] md:w-[130px] md:h-[130px] border-2 border-white/90 z-10 rounded-lg"></div>
                      {/* Black background inside frame */}
                      <div className="absolute inset-0 m-auto w-[90px] h-[90px] md:w-[130px] md:h-[130px] bg-black z-10 rounded-lg"></div>
                      {/* Person silhouette */}
                      <div className="absolute inset-0 m-auto z-20 flex flex-col items-center justify-center">
                        <div className="w-full h-[70px] md:h-[110px] flex items-center justify-center">
                          {/* Actual silhouette */}
                          <div className="w-14 h-14 md:w-24 md:h-24 mt-2 md:mt-4 relative">
                            {/* Head */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-7 h-7 md:w-12 md:h-12 bg-black rounded-full"></div>
                            {/* Shoulders */}
                            <div className="absolute top-7 md:top-12 left-1/2 transform -translate-x-1/2 w-14 h-7 md:w-24 md:h-10 bg-black rounded-b-full"></div>
                          </div>
                        </div>
                        {/* SOON text */}
                        <div className="w-full text-center mt-auto">
                          <p className="text-white text-lg md:text-2xl font-black tracking-widest animate-pulse-slow">SOON</p>
                        </div>
                      </div>
                      {/* Decorative glowing dots */}
                      <div className="absolute top-[15%] left-[15%] w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full z-30 animate-pulse-slow"></div>
                      <div className="absolute top-[15%] right-[15%] w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full z-30 animate-pulse-slow"></div>
                      <div className="absolute bottom-[15%] left-[15%] w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full z-30 animate-pulse-slow"></div>
                      <div className="absolute bottom-[15%] right-[15%] w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full z-30 animate-pulse-slow"></div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              </div>
          </motion.section>
        )}

        {isSectionEnabled('contact') && (
          <motion.section
            id="contact"
            className="py-32 md:py-40 relative"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {/* Animated red glow background */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
              <div className="w-[700px] h-[320px] md:w-[900px] md:h-[400px] bg-red-600/20 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
            </div>
            <div className="max-w-3xl mx-auto px-4 relative z-10">
              <div className="text-center mb-20 md:mb-24">
                <div className="inline-flex items-center justify-center mb-8">
                  <div className="h-px w-8 bg-red-600/80 mr-2"></div>
                  <span className="text-red-500 text-base font-bold tracking-widest">CONTACT US</span>
                  <div className="h-px w-8 bg-red-600/80 ml-2"></div>
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 text-white drop-shadow-lg">Get in Touch</h2>
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
                </div>
                <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-3">
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
            </div>
          </motion.section>
        )}
        {/* TOP PARTNERS SECTION */}
        <motion.section
          id="top-partners"
          className="relative py-32 md:py-40 overflow-hidden"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* (Removed radial glow background) */}
          <div className="max-w-7xl mx-auto px-4 md:px-12 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white tracking-tight">TOP PARTNERS</h2>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-0.5 bg-red-600 rounded-full"></div>
              </div>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-center items-stretch mb-8"
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
                    scale: 1.03,
                    boxShadow: '0 0 32px 4px #dc2626aa',
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  className="relative w-full aspect-video rounded-2xl overflow-hidden flex items-center justify-center shadow-lg group transition-transform duration-500 border border-gray-800 bg-black/90 hover:border-red-600"
                >
                  {/* Faint Torch logo background watermark */}
                  <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                    <Image src="/images/logo.png" alt="Torch Logo Watermark" width={120} height={120} className="opacity-10 object-contain" />
                  </div>
                  
                  {/* Placeholder for Video/GIF */}
                  {/* Replace this div with actual video/gif element when ready */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden flex items-center justify-center bg-black z-10">
                    {/* Placeholder Play Icon */}
                    <svg className="w-16 h-16 text-red-600 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>

                  {/* Partner logo (Torch logo image) - Keep as placeholder */}                  
                  <div className="absolute top-5 left-5 z-20 w-12 h-12 flex items-center justify-center bg-black/50 rounded-full p-1 border border-red-700">
                    <Image src="/images/logo.png" alt="Torch Logo" width={36} height={36} className="object-contain" />
                  </div>
                  
                  {/* Original banner image removed */}
                  {/* <Image src={`/images/partner-banner-${i}.jpg`} alt={`Partner Banner ${i}`} fill className="object-cover opacity-90 rounded-2xl group-hover:opacity-100 transition-all duration-500 z-10" /> */}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      </div>
    </>
  );
}
