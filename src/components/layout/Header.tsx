"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoClicked, setIsLogoClicked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Enhanced logo click handler for smooth scrolling
  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Visual feedback on click
    setIsLogoClicked(true);
    setTimeout(() => setIsLogoClicked(false), 400);
    
    if (pathname === '/') {
      // If already on homepage, smoothly scroll to hero section
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        // Calculate the offset for the fixed header
        const headerHeight = 80; // Height of the fixed header
        const elementPosition = heroSection.offsetTop;
        const offsetPosition = elementPosition - headerHeight;
        
        // Add a small delay for the click animation
        setTimeout(() => {
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 150);
      } else {
        // Fallback: scroll to top with smooth behavior
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }, 150);
      }
    } else {
      // If on different page, navigate to homepage
      setTimeout(() => {
        router.push('/');
      }, 150);
    }
  }, [pathname, router]);

  // Enhanced home navigation handler for consistency
  const handleHomeNavigation = useCallback((e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      handleLogoClick(e);
    }
    // If not on homepage, let the default Link behavior handle navigation
  }, [pathname, handleLogoClick]);

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setIsScrolled(scrollY > 0);
  }, []);

  useEffect(() => {
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, [handleScroll]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle escape key and prevent body scroll when mobile menu is open
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300 border-b border-transparent",
          "bg-black/30 backdrop-blur-md"
        )}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between relative">
            {/* Centered content wrapper - restored original design */}
            <div className="absolute left-1/2 top-0 transform -translate-x-1/2 h-full flex items-center gap-8">
              {isScrolled && (
                <a 
                  href="/" 
                  onClick={handleLogoClick}
                  className={cn(
                    "flex items-center group cursor-pointer",
                    isLogoClicked && "animate-pulse"
                  )}
                  aria-label="Torch Group Home"
                >
                  <div className="relative">
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-r from-orange-500/30 to-red-600/30 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500",
                      isLogoClicked && "opacity-100 scale-125"
                    )}></div>
                    <div className="relative w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                      <Image
                        src="/images/logo.png"
                        alt="Torch Logo"
                        width={128}
                        height={128}
                        priority
                        className={cn(
                          "object-contain mx-auto drop-shadow-lg group-hover:scale-110 transition-all duration-500 relative z-10 w-full h-full group-hover:drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]",
                          isLogoClicked && "scale-95"
                        )}
                        style={{ aspectRatio: '1/1' }}
                      />
                    </div>
                  </div>
                  <span className={cn(
                    "ml-3 text-2xl font-black tracking-tight text-white hidden sm:inline-block drop-shadow-lg group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-red-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500",
                    isLogoClicked && "bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent"
                  )}>
                    Torch
                  </span>
                </a>
              )}
              <div className="hidden md:flex items-center space-x-8 ml-8">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const isHomeLink = item.href === '/';
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={isHomeLink ? handleHomeNavigation : undefined}
                      className={cn(
                        "relative px-4 py-2 text-lg font-bold rounded-md transition-all duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                        isActive ? "torch-text-accent" : "text-gray-200 hover:text-white"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span>{item.name}</span>
                      <span
                        className={cn(
                          "absolute left-1/2 -bottom-1.5 w-2/3 h-0.5 rounded-full transition-all duration-300 -translate-x-1/2",
                          isActive 
                            ? "bg-red-500 scale-x-100" 
                            : "bg-red-500/60 scale-x-0 group-hover:scale-x-100"
                        )}
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile menu button stays right */}
            <div className="flex md:hidden ml-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                className="text-white hover:bg-red-700/20 focus:ring-red-500"
              >
                {isMobileMenuOpen ? (
                  <X className="h-7 w-7" />
                ) : (
                  <Menu className="h-7 w-7" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile menu - improved version but keeping original style */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex flex-col md:hidden animate-fade-in"
              aria-hidden={!isMobileMenuOpen}
            >
              <div 
                id="mobile-menu"
                className="w-full bg-gradient-to-b from-black/95 via-black/90 to-red-950/80 shadow-lg border-b border-transparent animate-slide-down"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation menu"
              >
                <div className="space-y-2 px-6 py-4 flex flex-col items-center">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const isHomeLink = item.href === '/';
                    
                    const handleMobileClick = (e: React.MouseEvent) => {
                      setIsMobileMenuOpen(false);
                      if (isHomeLink) {
                        handleHomeNavigation(e);
                      }
                    };
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "block w-full text-center rounded-md px-4 py-4 text-xl font-extrabold tracking-wide transition-all duration-200",
                          "focus:outline-none focus:ring-2 focus:ring-red-500/50",
                          isActive ? "torch-text-accent" : "text-gray-200 hover:text-white"
                        )}
                        onClick={handleMobileClick}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
              {/* Click outside to close */}
              <div 
                className="flex-1" 
                onClick={() => setIsMobileMenuOpen(false)}
                aria-hidden="true"
              />
            </div>
          )}
        </nav>

        {/* Custom header styles */}
        <style jsx global>{`
          @keyframes slide-down {
            0% { transform: translateY(-100%); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-slide-down {
            animation: slide-down 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
        `}</style>
      </header>
    </>
  );
} 