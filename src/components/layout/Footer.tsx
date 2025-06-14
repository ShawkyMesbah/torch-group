"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import BlurText from "@/components/animations/BlurText";

const navigation = {
  main: [
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  social: [
    {
      name: "Facebook",
      href: "https://facebook.com/torchgroup",
      icon: Facebook,
    },
    {
      name: "Instagram",
      href: "https://instagram.com/torchgroup",
      icon: Instagram,
    },
    {
      name: "Twitter",
      href: "https://twitter.com/torchgroup",
      icon: Twitter,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/torchgroup",
      icon: Linkedin,
    },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-t from-black/90 via-black/80 to-red-900/20 overflow-hidden">
      {/* Static thin red line at the top */}
      <div className="w-full h-px bg-red-600 absolute top-0 left-0" />
      <div className="mx-auto max-w-7xl px-6 py-16 flex flex-col items-center justify-center gap-10 relative z-10">
        {/* Logo with glow and hover effect */}
        <div className="mb-2 relative group flex flex-col items-center animate-fade-in">
          <div className="absolute -inset-2 md:-inset-4 rounded-full bg-red-600/20 blur-2xl opacity-80 group-hover:opacity-100 group-hover:blur-3xl transition-all duration-300 z-0" />
          <Image 
            src="/images/logo.png" 
            alt="Torch Logo" 
            width={96} 
            height={96} 
            className="object-contain mx-auto relative z-10 drop-shadow-lg group-hover:scale-105 group-hover:drop-shadow-[0_0_32px_#dc2626cc] transition-transform duration-300"
            style={{ aspectRatio: '1/1' }}
          />
        </div>
        {/* Nav links */}
        <nav className="flex flex-wrap justify-center gap-10 mb-4 animate-fade-in" aria-label="Footer">
          {navigation.main.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-lg font-bold text-white hover:text-red-500 transition-colors duration-200 underline-offset-8 hover:underline px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        {/* Divider */}
        <div className="w-full max-w-2xl border-t border-red-900/40 my-2 animate-fade-in" />
        {/* Social icons */}
        <div className="flex justify-center gap-10 mb-4 animate-fade-in">
          {navigation.social.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-white hover:text-red-500 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-9 w-9 transition-transform duration-200 group-hover:scale-110 hover:scale-110" aria-hidden="true" />
            </Link>
          ))}
        </div>
        {/* Copyright */}
        <p className="text-center text-xs leading-5 text-gray-500 animate-fade-in">
          &copy; {new Date().getFullYear()} Torch Group. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 