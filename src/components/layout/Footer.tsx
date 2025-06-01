"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";

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
    <footer className="relative bg-gradient-to-t from-black via-black to-red-900/20 overflow-hidden">
      {/* Static thin red line at the top */}
      <div className="w-full h-px bg-red-600 absolute top-0 left-0" />
      <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col items-center justify-center gap-8 relative z-10">
        {/* Torch logo */}
        <div className="mb-2">
          <Image src="/images/logo.png" alt="Torch Logo" width={48} height={48} className="mx-auto" />
        </div>
        {/* Nav links */}
        <nav className="flex flex-wrap justify-center gap-8 mb-4" aria-label="Footer">
          {navigation.main.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-base font-bold text-white hover:text-red-600 transition-colors duration-200 underline-offset-4 hover:underline"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        {/* Social icons */}
        <div className="flex justify-center gap-8 mb-4">
          {navigation.social.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-white hover:text-red-600 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-8 w-8 transition-transform duration-200 group-hover:scale-110 hover:scale-110" aria-hidden="true" />
            </Link>
          ))}
        </div>
        {/* Copyright */}
        <p className="text-center text-xs leading-5 text-gray-400">
          &copy; {new Date().getFullYear()} Torch Group. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 