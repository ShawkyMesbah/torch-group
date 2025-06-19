"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

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
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 border-b border-transparent bg-black/30 backdrop-blur-md`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between relative">
          
          {/* Mobile Layout */}
          <div className="flex md:hidden items-center justify-between w-full mobile-header-container">
            {/* Mobile Logo - Always visible */}
            <Link href="/" className="flex items-center group mobile-header-logo">
              <Image
                src="/images/logo.png"
                alt="Torch Logo"
                width={40}
                height={40}
                priority
                className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                style={{aspectRatio: '1/1'}}
              />
              <span className="ml-2 text-xl font-black tracking-tight text-white drop-shadow-lg">Torch</span>
            </Link>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className="text-white mobile-menu-button focus:ring-red-500"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Desktop Layout - Centered content wrapper */}
          <div className="hidden md:block absolute left-1/2 top-0 transform -translate-x-1/2 h-full">
            <div className="flex items-center gap-8 h-full">
              {isScrolled && (
                <Link href="/" className="flex items-center group">
                  <Image
                    src="/images/logo.png"
                    alt="Torch Logo"
                    width={48}
                    height={48}
                    priority
                    className="object-contain mx-auto drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                    style={{aspectRatio: '1/1'}}
                  />
                  <span className="ml-3 text-2xl font-black tracking-tight text-white drop-shadow-lg">Torch</span>
                </Link>
              )}
              <div className="flex items-center space-x-6 ml-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-4 py-2 text-lg font-bold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                      ${pathname === item.href ? "text-red-500" : "text-gray-200 hover:text-white"}
                    `}
                  >
                    <span>{item.name}</span>
                    <span
                      className={`absolute left-1/2 -bottom-1.5 w-2/3 h-0.5 rounded-full transition-all duration-300 -translate-x-1/2
                        ${pathname === item.href ? "bg-red-500 scale-x-100" : "bg-red-500/60 scale-x-0 group-hover:scale-x-100"}
                      `}
                    ></span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu with backdrop and slide-down */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex flex-col md:hidden animate-fade-in">
            <div className="w-full bg-gradient-to-b from-black/95 via-black/90 to-red-950/80 shadow-lg border-b border-transparent animate-slide-down">
              <div className="space-y-2 px-6 py-8 flex flex-col items-center">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block w-full text-center rounded-md px-4 py-4 text-xl font-extrabold tracking-wide transition-all duration-200
                      ${pathname === item.href ? "text-red-500" : "text-gray-200 hover:text-white"}
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            {/* Click outside to close */}
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
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
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </header>
  );
} 