"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown, Grid2X2, ShoppingCart, FileText, Users, Star, Zap, LucideIcon } from "lucide-react";

interface DropdownItem {
  name: string;
  href: string;
  description: string;
  icon?: LucideIcon;
}

interface NavigationItem {
  name: string;
  href: string;
  dropdown?: DropdownItem[];
}

const navigation: NavigationItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { 
    name: "Services", 
    href: "/services",
    dropdown: [
      { name: "All Services", href: "/services", description: "View all our services and solutions", icon: Grid2X2 },
      { name: "B2C Services", href: "/#torch-group", description: "Business to Consumer solutions", icon: ShoppingCart },
      { name: "B2B Services", href: "/services/b2b", description: "Business to Business solutions", icon: FileText },
      { name: "B2T Services", href: "/services/b2t", description: "Business to Talent platform", icon: Star },
      { name: "B2A Services", href: "/services/b2a", description: "Business to All Allies network", icon: Users },
    ]
  },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const renderDropdownItem = (dropdownItem: DropdownItem, index: number) => (
    <div key={dropdownItem.href}>
      <Link
        href={dropdownItem.href}
        className="block px-4 py-3 text-sm hover:bg-red-950/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {dropdownItem.icon && <dropdownItem.icon className="h-5 w-5 text-red-500" />}
          <div>
            <span className="block font-bold text-white">{dropdownItem.name}</span>
            <span className="block text-sm text-gray-400 mt-1">{dropdownItem.description}</span>
          </div>
        </div>
      </Link>
      {index === 0 && (
        <div className="mx-4 my-2 border-t border-red-900/30"></div>
      )}
    </div>
  );

  const renderMobileDropdownItem = (dropdownItem: DropdownItem, index: number) => (
    <div key={dropdownItem.href}>
      <Link
        href={dropdownItem.href}
        className="block px-4 py-3 text-sm rounded-md hover:bg-red-950/50 transition-colors"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div className="flex items-center gap-3">
          {dropdownItem.icon && <dropdownItem.icon className="h-5 w-5 text-red-500" />}
          <div>
            <span className="block font-bold text-white">{dropdownItem.name}</span>
            <span className="block text-sm text-gray-400 mt-1">{dropdownItem.description}</span>
          </div>
        </div>
      </Link>
      {index === 0 && (
        <div className="mx-2 my-2 border-t border-red-900/30"></div>
      )}
    </div>
  );

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 border-b border-transparent bg-black/30 backdrop-blur-md`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-center relative">
          {/* Logo and navigation wrapper */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            {isScrolled && (
              <Link href="/" className="flex items-center group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-red-600/30 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                    <Image
                      src="/images/logo.png"
                      alt="Torch Logo"
                      width={128}
                      height={128}
                      priority
                      className="object-contain mx-auto drop-shadow-lg group-hover:scale-105 transition-transform duration-300 relative z-10 w-full h-full"
                      style={{ aspectRatio: '1/1' }}
                    />
                  </div>
                </div>
                <span className="ml-3 text-2xl font-black tracking-tight text-white hidden sm:inline-block drop-shadow-lg group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-red-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">Torch</span>
              </Link>
            )}
            <div className="hidden md:flex items-center space-x-6 md:space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative" ref={item.dropdown ? dropdownRef : null}>
                  {item.dropdown ? (
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`flex items-center px-3 md:px-4 py-2 text-lg font-bold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                        ${pathname.startsWith(item.href) ? "torch-text-accent" : "text-gray-200 hover:text-white"}
                      `}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                <Link
                  href={item.href}
                      className={`relative px-3 md:px-4 py-2 text-lg font-bold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                    ${pathname === item.href ? "torch-text-accent" : "text-gray-200 hover:text-white"}
                  `}
                >
                  <span>{item.name}</span>
                  <span
                    className={`absolute left-1/2 -bottom-1.5 w-2/3 h-0.5 rounded-full transition-all duration-300 -translate-x-1/2
                      ${pathname === item.href ? "bg-red-500 scale-x-100" : "bg-red-500/60 scale-x-0 group-hover:scale-x-100"}
                    `}
                  ></span>
                </Link>
                  )}
                  {item.dropdown && activeDropdown === item.name && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-xl bg-black/90 backdrop-blur-lg border border-red-900/30 shadow-lg overflow-hidden animate-fade-in">
                      <div className="py-2">
                        {item.dropdown.map((dropdownItem, index) => renderDropdownItem(dropdownItem, index))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="absolute right-0 md:hidden">
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
            <div className="w-full bg-gradient-to-b from-black/95 via-black/90 to-red-950/80 shadow-lg border-b border-transparent animate-slide-down">
              <div className="space-y-2 px-6 py-4 flex flex-col items-center">
                {navigation.map((item) => (
                  <div key={item.name} className="w-full">
                    {item.dropdown ? (
                      <>
                        <button
                          onClick={() => toggleDropdown(item.name)}
                          className={`flex items-center justify-center w-full rounded-md px-4 py-4 text-xl font-extrabold tracking-wide transition-all duration-200
                            ${pathname.startsWith(item.href) ? "torch-text-accent" : "text-gray-200 hover:text-white"}
                          `}
                        >
                          <span>{item.name}</span>
                          <ChevronDown className={`ml-2 h-5 w-5 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                        </button>
                        {activeDropdown === item.name && (
                          <div className="mt-2 space-y-2 bg-black/50 rounded-lg p-2">
                            {item.dropdown.map((dropdownItem, index) => renderMobileDropdownItem(dropdownItem, index))}
                          </div>
                        )}
                      </>
                    ) : (
                  <Link
                    href={item.href}
                    className={`block w-full text-center rounded-md px-4 py-4 text-xl font-extrabold tracking-wide transition-all duration-200
                      ${pathname === item.href ? "torch-text-accent" : "text-gray-200 hover:text-white"}
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                    )}
                  </div>
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