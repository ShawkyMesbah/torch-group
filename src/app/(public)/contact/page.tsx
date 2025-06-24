import React from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, MapPin, Users, MessageCircle, Zap, CheckCircle, Send } from 'lucide-react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { AnimatedGridBackground } from "@/components/ui/animated-grid-background";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { ContactForm } from "@/components/forms/contact-form";
import { SharedTorchBackground } from "@/components/ui/animated-grid-background";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <main className="flex flex-col min-h-screen text-white relative overflow-x-hidden">
      {/* Animated grid background */}
      <SharedTorchBackground />

      {/* Enhanced Hero Section */}
      <SectionWrapper animation="fade-in" className="py-16 md:py-24 px-4 md:px-6 lg:px-8 relative bg-transparent">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Animated badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/60 border torch-border-accent-30 rounded-full mb-8 backdrop-blur-sm">
            <MessageCircle className="w-4 h-4 torch-text-accent" />
            <span className="text-sm font-medium text-gray-300">Ready to start your project?</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 text-white">
            Let's Create Something
            <span className="block torch-text-accent">
              Amazing Together
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Whether you have a groundbreaking idea, need expert consultation, or want to discuss partnership opportunities – 
            we're here to transform your vision into extraordinary digital experiences.
          </p>
          
          {/* Quick response promise */}
          <div className="flex items-center justify-center gap-2 mt-8 text-sm text-gray-400">
            <CheckCircle className="w-4 h-4 torch-text-accent" />
            <span>We typically respond within 2-4 hours</span>
          </div>
        </div>
      </SectionWrapper>

      {/* Enhanced Contact Details and Form Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-transparent relative">
        {/* Improved background glow effect */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
          <div className="w-full max-w-6xl h-[800px] bg-gradient-to-br from-red-600/20 via-red-500/10 to-red-700/15 blur-[120px] rounded-3xl animate-pulse-slow"></div>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 relative z-10">
                     {/* Enhanced Contact Details */}
           <div className="space-y-8">
            {/* Main Contact Card */}
            <div className="p-8 bg-gradient-to-br from-black/95 via-black/90 to-black/95 backdrop-blur-2xl rounded-3xl border torch-border-accent-30 hover:border-red-500/50 hover:shadow-red-500/20 transition-all duration-700 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-red-500/8 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full torch-bg-accent/20 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 torch-text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Contact Information</h2>
                </div>
                
                                 {/* Company Info */}
                 <div className="mb-8 p-6 bg-gradient-to-r from-red-600/10 to-transparent rounded-xl border-l-4 torch-border-accent">
                   <h3 className="text-xl font-bold torch-text-accent mb-2">TORCH Group</h3>
                   <p className="text-gray-300 mb-3">Creative Digital Solutions</p>
                   <p className="text-sm text-gray-400 leading-relaxed">
                     We specialize in transforming ambitious ideas into powerful digital experiences through innovative design, cutting-edge technology, and strategic thinking.
                   </p>
                 </div>

                {/* Contact Methods */}
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-black/40 rounded-xl hover:bg-black/60 transition-colors group/item">
                    <div className="w-10 h-10 rounded-lg torch-bg-accent/20 flex items-center justify-center mr-4">
                      <Mail className="h-5 w-5 torch-text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <a href="mailto:ask@torchgroup.co" className="text-white hover:torch-text-accent transition-colors">
                        ask@torchgroup.co
                      </a>
                    </div>
                  </div>
                  
                                     <div className="flex items-center p-4 bg-black/40 rounded-xl hover:bg-black/60 transition-colors group/item">
                     <div className="w-10 h-10 rounded-lg torch-bg-accent/20 flex items-center justify-center mr-4">
                       <MapPin className="h-5 w-5 torch-text-accent" />
                     </div>
                     <div>
                       <p className="text-sm text-gray-400">Location</p>
                       <span className="text-white">Riyadh, Saudi Arabia</span>
                     </div>
                   </div>
                  
                  
                </div>

                                 {/* Social Media */}
                 <div className="mt-8 pt-6 border-t border-red-600/30">
                   <p className="text-sm text-gray-400 mb-6">Connect with us</p>
                   <div className="grid grid-cols-2 gap-4">
                     {[
                       { name: "Facebook", href: "https://facebook.com/torchgroup", icon: Facebook },
                       { name: "Instagram", href: "https://instagram.com/torchgroup", icon: Instagram },
                       { name: "Twitter", href: "https://twitter.com/torchgroup", icon: Twitter },
                       { name: "LinkedIn", href: "https://linkedin.com/company/torchgroup", icon: Linkedin },
                     ].map((item) => (
                       <Link
                         key={item.name}
                         href={item.href}
                         className="flex items-center gap-3 p-3 rounded-lg bg-black/40 hover:torch-bg-accent/20 hover:border-red-500/30 border border-transparent text-gray-400 hover:text-white transition-all duration-300 group"
                         target="_blank"
                         rel="noopener noreferrer"
                       >
                         <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                         <span className="text-sm font-medium">{item.name}</span>
                       </Link>
                     ))}
                   </div>
                 </div>
              </div>
            </div>

            
          </div>

          {/* Enhanced Contact Form */}
          <div className="p-6 md:p-8 bg-gradient-to-br from-black/95 via-black/90 to-black/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-red-600/20 border border-red-600/30 hover:border-red-500/50 hover:shadow-red-500/30 transition-all duration-700 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-red-500/8 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full torch-bg-accent/20 flex items-center justify-center">
                  <Send className="w-5 h-5 torch-text-accent" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Send us a Message</h2>
              </div>
              
                             <p className="text-gray-400 mb-6 text-sm">
                 Share your project details with us and we'll get back to you within 24 hours. For urgent inquiries, please call us directly.
               </p>
              
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-transparent relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
              Why Work With <span className="torch-text-accent">TORCH</span>?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We're not just another digital agency. We're your strategic partner in digital transformation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
                             {
                 icon: Zap,
                 title: "Lightning Fast Response",
                 description: "We respond to all inquiries within 2-4 hours, ensuring your project maintains momentum from day one."
               },
               {
                 icon: Users,
                 title: "Expert Team",
                 description: "Our diverse team of designers, developers, and strategists brings deep expertise and fresh perspectives to every project."
               },
              {
                icon: CheckCircle,
                title: "Proven Results",
                                 description: "Our diverse portfolio spans industries and technologies, with a proven track record of turning ambitious visions into successful realities."
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 bg-black/60 backdrop-blur-sm rounded-2xl border border-red-600/20 hover:border-red-500/40 hover:shadow-red-500/20 transition-all duration-500 group">
                <div className="w-12 h-12 rounded-xl torch-bg-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 torch-text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-transparent relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 md:p-12 bg-gradient-to-br from-red-600/20 via-red-500/10 to-red-700/20 backdrop-blur-xl rounded-3xl border border-red-600/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-red-500/10 to-red-600/5 animate-pulse-slow"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                Ready to Get Started?
              </h2>
                             <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                 Let's discuss your project and explore how we can help you achieve your digital goals. 
                 No commitment required – just an insightful conversation about your vision and possibilities.
               </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  className="torch-btn-primary px-8 py-3 text-lg font-semibold"
                >
                  <Link href="#contact-form">
                    Start Your Project
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  className="torch-btn-outline px-8 py-3 text-lg font-semibold"
                >
                  <Link href="/services">
                    View Our Services
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 