import React from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { AnimatedGridBackground } from "@/components/ui/animated-grid-background";
import { SectionWrapper } from "@/components/ui/section-wrapper"; // Assuming SectionWrapper is a common layout component
import { ContactForm } from "@/components/forms/contact-form";
import { SharedTorchBackground } from "@/components/ui/animated-grid-background";

// Assuming a ContactForm component exists at this path
// import ContactForm from "@/components/forms/contact-form";

export default function ContactPage() {
  return (
    <main className="flex flex-col min-h-screen text-white relative overflow-x-hidden">
      {/* Animated grid background */}
      <SharedTorchBackground />

      {/* Hero/Header Section */}
      <SectionWrapper animation="fade-in" className="py-20 px-4 md:px-6 lg:px-8 relative bg-transparent">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Get In <span className="text-red-600">Touch</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            We'd love to hear from you. Whether you have a question about our services,
            want to partner, or just want to say hello, feel free to reach out.
          </p>
        </div>
      </SectionWrapper>

      {/* Contact Details and Form Section */}
      {/* Using a simple grid layout for details and potentially a form */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-transparent relative">
                    {/* Perfectly fitted form glow - matches contact form dimensions exactly */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
              <div className="w-full max-w-4xl h-[700px] sm:h-[800px] md:h-[900px] bg-gradient-to-br from-red-600/30 via-red-500/20 to-red-700/25 blur-[100px] rounded-3xl animate-pulse-slow mx-3 sm:mx-6 md:mx-8 lg:mx-12"></div>
            </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          {/* Contact Details */}
          <div className="flex flex-col space-y-6 p-8 bg-gradient-to-br from-black/95 via-black/90 to-black/95 backdrop-blur-2xl rounded-3xl border border-red-600/30 hover:border-red-500/50 hover:shadow-red-500/40 transition-all duration-700 relative group">
            {/* Subtle inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-red-500/8 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Cool edge highlight */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-50 blur-sm"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 text-white">Contact Information</h2>
              <div className="flex items-center text-white">
                <Mail className="h-6 w-6 text-red-600 mr-3" />
                <span>info@torchgroup.com</span> {/* Replace with actual email */}
              </div>
              <div className="flex items-center text-white">
                <Phone className="h-6 w-6 text-red-600 mr-3" />
                <span>+1 (123) 456-7890</span> {/* Replace with actual phone */}
              </div>
              <div className="flex items-start text-white">
                <MapPin className="h-6 w-6 text-red-600 mr-3 mt-1" />
                <span>
                  123 Digital Way<br/>
                  Innovation City, IC 98765<br/>
                  Country
                </span> {/* Replace with actual address */}
              </div>

              {/* Social Media Links */}
              <div className="flex space-x-6 pt-4 border-t border-red-600">
                {[ /* Define social links here */
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
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-red-600 hover:text-white transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form - Placeholder or Component */}
          <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-black/95 via-black/90 to-black/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-red-600/30 border border-red-600/30 hover:border-red-500/50 hover:shadow-red-500/40 transition-all duration-700 relative group">
            {/* Subtle inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-red-500/8 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Cool edge highlight */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-50 blur-sm"></div>
            
            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">Send us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Optional: Map Section */}
      {/* <section className="py-16 px-4 md:px-6 lg:px-8 bg-transparent"> */}
        {/* Add map component or iframe here if desired */}
      {/* </section> */}

      {/* Optional: Quick Links/CTA at bottom */}
      {/* <section className="py-16 px-4 md:px-6 lg:px-8 bg-transparent"> */}
        {/* Add a small CTA or links back to Services/About */} 
      {/* </section> */}

    </main>
  );
} 