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
      className={`fixed top-0 z-50 w-full transition-all duration-300 shadow-lg ${
        isScrolled
          ? "bg-black/60 backdrop-blur-md shadow-red-900/30 border-b-2 border-red-700/60"
          : "bg-transparent shadow-none border-b border-transparent"
      }`}
      style={{ boxShadow: isScrolled ? '0 4px 32px 0 rgba(220,38,38,0.10)' : undefined }}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between relative">
          {/* Centered content wrapper */}
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 h-full flex items-center gap-8">
            {isScrolled && (
              <Link href="/" className="flex items-center group">
                <Image
                  src="/images/logo.png"
                  alt="Torch Logo"
                  width={48}
                  height={48}
                  priority
                  className="h-10 w-auto drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                <span className="ml-3 text-2xl font-black tracking-tight text-white hidden sm:inline-block drop-shadow-lg">Torch</span>
              </Link>
            )}
            <div className="hidden md:flex items-center space-x-6 ml-8">
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
          {/* Mobile menu button stays right */}
          <div className="flex md:hidden ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className="text-white hover:bg-red-700/20 focus:ring-red-500"
            >
              <Menu className="h-7 w-7" />
            </Button>
          </div>
        </div>

        {/* Mobile menu with backdrop and slide-down */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex flex-col md:hidden animate-fade-in">
            <div className="w-full bg-gradient-to-b from-black/95 via-black/90 to-red-950/80 shadow-lg border-b-2 border-red-700/60 animate-slide-down">
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
      `}</style>
    </header>
  );
} 