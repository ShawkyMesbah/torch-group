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
    <footer className="relative bg-transparent overflow-hidden">
      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
      <div className="relative z-20 flex flex-col items-center justify-center px-4 py-10 md:py-14 gap-6 md:gap-8 w-full">
        {/* Logo with glow */}
        <div className="relative flex flex-col items-center group">
          <div className="absolute -inset-4 md:-inset-6 rounded-full bg-red-600/40 blur-2xl opacity-80 group-hover:opacity-100 group-hover:blur-3xl transition-all duration-300 z-0" />
          <Image 
            src="/images/logo.png" 
            alt="Torch Logo" 
            width={96} 
            height={96} 
            className="object-contain mx-auto relative z-10 drop-shadow-lg group-hover:scale-105 group-hover:drop-shadow-[0_0_32px_#dc2626cc] transition-transform duration-300"
            style={{ aspectRatio: '1/1' }}
          />
        </div>
        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-6 md:gap-10" aria-label="Footer">
          {navigation.main.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-base md:text-lg font-semibold text-white hover:text-red-400 transition-colors duration-200 underline-offset-8 hover:underline px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        {/* Social Icons */}
        <div className="flex justify-center gap-5 md:gap-8 mt-2">
          {navigation.social.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-white hover:text-red-400 transition-colors duration-200 p-2 rounded-full bg-black/30 hover:bg-black/60 shadow-md hover:shadow-red-600/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-7 w-7 md:h-8 md:w-8 transition-transform duration-200 group-hover:scale-110 hover:scale-110" aria-hidden="true" />
            </Link>
          ))}
        </div>
        {/* Copyright */}
        <p className="text-center text-xs md:text-sm leading-5 text-gray-300 animate-fade-in bg-black/40 px-4 py-2 rounded-full border border-white/10 mt-2 shadow-sm">
          &copy; {new Date().getFullYear()} Torch Group. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 