"use client";

import { useEffect, useState } from "react";
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

// Use dynamic import for PhoneInput component
const PhoneInput = dynamic(() => import('react-phone-input-2'), { ssr: false });

// Define homepage section type
interface HomepageSection {
  id: string;
  title: string;
  order: number;
  enabled: boolean;
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

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false); // For admin toggle
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<HomepageSection[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    privacy: false
  });
  
  // Phone verification state
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

  // Fetch homepage sections
  useEffect(() => {
    const fetchSections = async () => {
      try {
        console.log('Fetching homepage sections...');
        const response = await fetch('/api/settings/homepage-sections');
        
        if (response.ok) {
          const data = await response.json();
          console.log('Sections loaded successfully:', data);
          setSections(data);
        } else {
          console.error('Failed to fetch homepage sections', response.status, response.statusText);
          // Show an error but still allow all sections to display as fallback
          setSections([
            { id: 'hero', title: 'Hero', order: 0, enabled: true },
            { id: 'torch-group', title: 'Torch Group', order: 1, enabled: true },
            { id: 'services', title: 'Services', order: 2, enabled: true }, 
            { id: 'blog', title: 'Our Blog', order: 3, enabled: true },
            { id: 'torch-talents', title: 'Torch Talents', order: 4, enabled: true },
            { id: 'contact', title: 'Contact', order: 5, enabled: true }
          ]);
        }
      } catch (error) {
        console.error('Error fetching homepage sections:', error);
        // Use default sections as fallback on error
        setSections([
          { id: 'hero', title: 'Hero', order: 0, enabled: true },
          { id: 'torch-group', title: 'Torch Group', order: 1, enabled: true },
          { id: 'services', title: 'Services', order: 2, enabled: true }, 
          { id: 'blog', title: 'Our Blog', order: 3, enabled: true },
          { id: 'torch-talents', title: 'Torch Talents', order: 4, enabled: true },
          { id: 'contact', title: 'Contact', order: 5, enabled: true }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
    setMounted(true);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to check if a section is enabled
  const isSectionEnabled = (id: string) => {
    if (loading) return true; // Show all sections while loading
    if (sections.length === 0) return true; // Show all sections if config failed to load
    
    const section = sections.find(s => s.id === id);
    return section ? section.enabled : true; // Default to enabled if not found
  };

  // Sort sections by order
  const getSectionOrder = (id: string) => {
    const section = sections.find(s => s.id === id);
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
      
      {/* Page content starts here */}
      <div className="w-full bg-black min-h-screen text-white">
        {/* Global animated background */}
        <AnimatedGridBackground 
          className="fixed inset-0" 
          dotColor="rgba(255, 40, 40, 0.2)"
          dotSize={1.2}
          dotSpacing={24}
          animationSpeed={0.4}
          interactive={true}
        />
        
        {/* Hero section with centered logo */}
        <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 sm:py-24 z-10">
          {/* Glowing effects */}
          <Glow variant="center" className="opacity-80" />
          
          {/* Logo with pulsing effect */}
          <div className="relative mb-6 sm:mb-8">
            <Image 
              src="/images/torch_group_logo.png" 
              alt="Torch Group Logo" 
              width={180}
              height={180}
              className="relative z-10 max-w-full h-auto hero-logo"
              priority
            />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 text-center hero-heading">
            Welcome to <span className="text-red-600">Torch</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl text-center mb-6 hero-description">
            Empowering businesses through innovative digital solutions and strategic partnerships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full max-w-md mx-auto justify-center">
            <button
              onClick={() => scrollToSection('torch-group')}
              className="group rounded-md bg-red-600 px-8 py-3.5 text-base font-medium text-white shadow-md transition-all duration-300 hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 z-20 flex items-center justify-center gap-2 relative overflow-hidden hero-button w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center">
                Explore Torch <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
              {/* Shine effect on hover */}
              <span 
                className="absolute inset-0 h-full w-[40%] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000"
              ></span>
            </button>
          </div>
        </section>

        {/* Conditionally render other sections based on their enabled status and in order */}
        {isSectionEnabled('services') && (
          <Section id="services" className="py-24">
            <div className="max-w-7xl mx-auto px-4 relative">
              <Glow variant="top" className="opacity-80" />
              <Glow variant="bottom" className="opacity-80" />
              
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center mb-4">
                  <div className="h-px w-8 bg-red-600/70 mr-2"></div>
                  <span className="text-red-500 text-sm font-medium">WHAT WE DO</span>
                  <div className="h-px w-8 bg-red-600/70 ml-2"></div>
                </div>
                <h2 className="text-3xl font-bold mb-3">Our Services</h2>
                <p className="text-gray-300 max-w-3xl mx-auto">
                  We offer comprehensive solutions to help your business grow and succeed in the digital landscape.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard
                  title="Media Press"
                  description="Our digital marketing services will help your business grow online and attract more customers."
                  icon={<BarChart3 className="h-8 w-8 text-red-600" />}
                  className="w-full max-w-sm mx-auto"
                />
                
                <FeatureCard
                  title="Talent Support"
                  description="Strategic marketing campaigns to grow your brand presence and reach your target audience."
                  icon={<Users className="h-8 w-8 text-red-600" />}
                  className="w-full max-w-sm mx-auto"
                />
                
                <FeatureCard
                  title="Marketing Systems"
                  description="Connect with the best professionals in the industry to scale your team effectively."
                  icon={<Flame className="h-8 w-8 text-red-600" />}
                  className="w-full max-w-sm mx-auto"
                />
              </div>
            </div>
          </Section>
        )}

        {isSectionEnabled('torch-group') && (
          <Section id="torch-group" className="py-28 relative">
            {/* Soft radial gradient background for focus */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[500px] bg-red-600/15 blur-[120px] rounded-full"></div>
              <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[600px] h-[300px] bg-red-900/10 blur-[80px] rounded-full"></div>
            </div>
            <div className="max-w-7xl mx-auto px-4 relative z-10">
              <div className="flex flex-col items-center text-center mb-16">
                {/* Glowing, animated icon background */}
                <div className="relative flex items-center justify-center mb-8">
                  <div className="absolute inset-0 w-28 h-28 bg-red-600/30 blur-[60px] rounded-full animate-pulse-slow"></div>
                  <Flame className="h-16 w-16 text-red-600" style={{ opacity: 1 }} />
                </div>
                <h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-white text-shadow">
                  About <span className="text-red-600">Torch Group</span>
                </h2>
                <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-4">
                  At Torch Group, we ignite creativity and empower talent to shape the future of digital content.
                </p>
                {/* Stylized divider */}
                <div className="w-24 h-2 mx-auto mb-8 flex items-center justify-center">
                  <svg width="100%" height="100%" viewBox="0 0 96 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0" y="3" width="96" height="2" rx="1" fill="url(#red-gradient)" />
                    <defs>
                      <linearGradient id="red-gradient" x1="0" y1="4" x2="96" y2="4" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#dc2626" stopOpacity="0.7" />
                        <stop offset="1" stopColor="#dc2626" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <p className="text-gray-300 max-w-3xl mx-auto text-lg">
                  We're more than just a creative agency – we're a catalyst for innovation, a platform for exceptional talent, and a driving force in the evolving media landscape. Our vision is to revolutionize content creation through cutting-edge technology and unparalleled creativity.
                </p>
              </div>
              <div className="text-center mb-12 mt-20">
                <div className="inline-flex items-center justify-center mb-4">
                  <div className="h-px w-8 bg-red-600 mr-2"></div>
                  <span className="text-red-600 text-sm font-medium tracking-widest">OUR BRANDS</span>
                  <div className="h-px w-8 bg-red-600 ml-2"></div>
                </div>
                <h3 className="text-3xl font-bold mb-3 text-white">Torch Group Brands</h3>
                <p className="text-gray-300 max-w-3xl mx-auto">
                  Explore our family of brands, each dedicated to excellence in their specialized fields.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 brands-grid">
                {torchBrands.map((brand, index) => (
                  <div
                    key={index}
                    className="group border border-gray-800 bg-gradient-to-br from-gray-900/70 via-gray-800/60 to-black/70 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/30 hover:border-red-600 hover:scale-[1.04] relative animate-fade-in"
                    style={{ animationDelay: `${index * 0.08 + 0.1}s` }}
                  >
                    <div className="p-8 flex flex-col items-center text-center relative">
                      {/* Icon with glow */}
                      <div className="mb-6 relative flex items-center justify-center">
                        <div className="absolute inset-0 w-16 h-16 bg-red-600/30 blur-[32px] rounded-full group-hover:blur-[48px] transition-all"></div>
                        <Flame className="h-10 w-10 text-red-600 drop-shadow-lg" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-white tracking-tight">{brand.name}</h3>
                      <p className="text-gray-300 mb-6 text-base min-h-[48px]">{brand.description}</p>
                      {brand.isComingSoon ? (
                        <span className="px-3 py-1 bg-black/60 border border-red-600 text-red-600 text-xs rounded-full font-semibold animate-pulse-slow mb-2">Coming Soon</span>
                      ) : (
                        <Link href={brand.link}>
                          <button className="mt-2 px-5 py-2 rounded-full bg-red-600 text-white font-medium shadow hover:bg-red-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                            Visit Website
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* Blog Section */}
        <section id="blog" className="relative bg-black py-24 overflow-hidden border-t border-gray-800/50">
          {/* Background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0%,rgba(0,0,0,0)_70%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,40,40,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,40,40,0.05)_1px,transparent_1px)] bg-[size:14px_14px]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12">
              <div className="text-red-500 font-semibold uppercase tracking-wider mb-4 flex items-center justify-center gap-4">
                <span className="h-px bg-red-500 w-8"></span>
                <span>STAY INFORMED</span>
                <span className="h-px bg-red-500 w-8"></span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Blog</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Discover the latest insights, trends, and strategies in digital marketing, technology, and business growth.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {blogLoading ? (
                // Loading skeletons for blog cards
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-gray-900/30 border border-gray-800/50 rounded-xl overflow-hidden hover:border-red-500/50 transition-all duration-300 group">
                    <div className="h-48 bg-gray-800/50 animate-pulse"></div>
                    <div className="p-6">
                      <div className="h-6 w-3/4 bg-gray-800/50 animate-pulse mb-3"></div>
                      <div className="h-20 bg-gray-800/50 animate-pulse mb-4"></div>
                      <div className="h-8 w-1/3 bg-gray-800/50 animate-pulse"></div>
                    </div>
                  </div>
                ))
              ) : blogPosts.length > 0 ? (
                // Actual blog posts
                blogPosts.map((post) => (
                  <Link 
                    href={`/blog/${post.slug}`} 
                    key={post.id} 
                    className="bg-gray-900/30 border border-gray-800/50 rounded-xl overflow-hidden hover:border-red-500/50 transition-all duration-300 group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {post.coverImage ? (
                        <Image 
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center">
                          <FileText className="h-16 w-16 text-gray-700" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-red-500 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-2" />
                        <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                // No blog posts found
                <div className="col-span-1 md:col-span-3 p-8 text-center bg-gray-900/30 border border-gray-800/50 rounded-xl">
                  <FileText className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Blog Posts Yet</h3>
                  <p className="text-gray-400 mb-4">Check back soon for articles and insights.</p>
                </div>
              )}
            </div>
            
            <div className="text-center mt-12">
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/blog">
                  View All Articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {isSectionEnabled('torch-talents') && (
          <Section id="torch-talents" className="py-24 relative">
            <div className="max-w-7xl mx-auto px-4 relative z-10">
              <Glow variant="center" className="opacity-80" />
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center mb-4">
                  <div className="h-px w-8 bg-red-600/70 mr-2"></div>
                  <span className="text-red-500 text-sm font-medium">FEATURED TALENT</span>
                  <div className="h-px w-8 bg-red-600/70 ml-2"></div>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  <span className="text-white">Torch</span> <span className="text-red-600">Talents</span>
                </h2>
                <div className="max-w-4xl mx-auto">
                  <p className="text-gray-300">
                    Projects and talents in various creative fields, raising the quality of creative life & audience awareness & engagement.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mt-8 py-4 justify-center items-center">
                {talentSilhouettes.map((talent) => (
                  <div key={talent.id} className="flex items-center justify-center">
                    <div className="relative w-full max-w-[140px] h-[140px] md:max-w-[200px] md:h-[200px] talent-card">
                      {/* Red diamond background */}
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-red-700 to-red-500 rotate-45 transform-gpu shadow-lg shadow-red-900/30"></div>
                      {/* White square frame */}
                      <div className="absolute inset-0 m-auto w-[80px] h-[80px] md:w-[110px] md:h-[110px] border-2 border-white/90 z-10"></div>
                      {/* Black background inside frame */}
                      <div className="absolute inset-0 m-auto w-[80px] h-[80px] md:w-[110px] md:h-[110px] bg-black z-10"></div>
                      {/* Person silhouette */}
                      <div className="absolute inset-0 m-auto z-20 flex flex-col items-center justify-center">
                        <div className="w-full h-[60px] md:h-[90px] flex items-center justify-center">
                          {/* Actual silhouette */}
                          <div className="w-12 h-12 md:w-20 md:h-20 mt-2 md:mt-4 relative">
                            {/* Head */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 md:w-10 md:h-10 bg-black"></div>
                            {/* Shoulders */}
                            <div className="absolute top-6 md:top-10 left-1/2 transform -translate-x-1/2 w-12 h-6 md:w-20 md:h-8 bg-black"></div>
                          </div>
                        </div>
                        {/* SOON text */}
                        <div className="w-full text-center mt-auto">
                          <p className="text-white text-base md:text-xl font-bold tracking-widest">SOON</p>
                        </div>
                      </div>
                      {/* Decorative dots */}
                      <div className="absolute top-[15%] left-[15%] w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-sm z-30"></div>
                      <div className="absolute top-[15%] right-[15%] w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-sm z-30"></div>
                      <div className="absolute bottom-[15%] left-[15%] w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-sm z-30"></div>
                      <div className="absolute bottom-[15%] right-[15%] w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-sm z-30"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}

        {isSectionEnabled('contact') && (
          <Section id="contact" className="py-24 relative">
            {/* Animated grid background for lively effect, reduced opacity */}
            <AnimatedGridBackground className="z-0 opacity-60" dotColor="rgba(220,38,38,0.07)" dotSize={1.2} dotSpacing={28} animationSpeed={0.5} />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="max-w-3xl mx-auto px-4 relative z-10"
            >
              {/* Solid, sharp card with strong border and shadow */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-extrabold mb-2 tracking-tight text-white contact-form-heading">Get in Touch</h2>
                <p className="text-gray-300 font-medium">Let's discuss your next project</p>
              </div>
              <div className="bg-[#18181b] border-2 border-red-700 rounded-xl p-10 relative z-20 shadow-lg shadow-red-900/30 contact-form-card">
                <form onSubmit={handleSubmit} className="space-y-7 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><User size={18} /></span>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your name"
                        className="w-full bg-[#232326] border border-gray-700 rounded-md focus:border-red-600 focus:ring-0 text-white placeholder-gray-500 py-3 px-4 pl-10 text-base font-medium transition"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                      {formErrors.name && <p className="mt-1 text-sm text-red-500 font-semibold">{formErrors.name}</p>}
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><Mail size={18} /></span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="your@email.com"
                        className="w-full bg-[#232326] border border-gray-700 rounded-md focus:border-red-600 focus:ring-0 text-white placeholder-gray-500 py-3 px-4 pl-10 text-base font-medium transition"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      {formErrors.email && <p className="mt-1 text-sm text-red-500 font-semibold">{formErrors.email}</p>}
                    </div>
                  </div>
                  <div className="relative">
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-300 mb-1">Phone *</label>
                    <div className="flex flex-col sm:flex-row gap-2 items-stretch">
                      <div className="flex-1">
                        {mounted && (
                          <>
                            <style jsx global>{`
                              .react-phone-input-2 input {
                                width: 100% !important;
                                background: transparent !important;
                                border-bottom: 1px solid #4b5563 !important;
                                border-left: none !important;
                                border-right: none !important;
                                border-top: none !important;
                                border-radius: 0 !important;
                                color: #d1d5db !important;
                                padding-left: 48px !important;
                                padding-top: 8px !important;
                                padding-bottom: 8px !important;
                              }
                              .react-phone-input-2 .flag-dropdown {
                                background: transparent !important;
                                border: none !important;
                              }
                            `}</style>
                            <PhoneInput
                              country={'us'}
                              value={formData.phone}
                              onChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
                              inputProps={{
                                name: 'phone',
                                required: false,
                                autoFocus: false,
                                className: 'phone-input',
                              }}
                            />
                          </>
                        )}
                        {!mounted && (
                          <Input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Phone (optional)"
                            className={cn(
                              "bg-transparent border-b border-gray-500 border-0 rounded-none px-0 py-2 focus:ring-0 hover:border-white transition-colors duration-300 text-gray-300 placeholder:text-gray-500",
                              formErrors.phone ? "border-red-500" : "",
                              focusedField === "phone" ? "border-white" : ""
                            )}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-1">Message *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-4 text-gray-500"><MessageSquare size={18} /></span>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        placeholder="Tell us about your project..."
                        className="w-full bg-[#232326] border border-gray-700 rounded-md focus:border-red-600 focus:ring-0 text-white placeholder-gray-500 py-3 px-4 pl-10 resize-none text-base font-medium transition"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    {formErrors.message && <p className="mt-1 text-sm text-red-500 font-semibold">{formErrors.message}</p>}
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white py-3 px-8 rounded-md border border-red-700 shadow-lg transition-transform duration-200 flex items-center justify-center min-w-[180px] text-base font-bold focus:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
                      disabled={formSubmitting}
                    >
                      {formSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : formSubmitted ? (
                        <span className="flex items-center text-green-400">
                          <Check className="w-5 h-5 mr-2" /> Sent!
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Send className="w-5 h-5 mr-2" /> Send Message
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </Section>
        )}
      </div>
    </>
  );
}
