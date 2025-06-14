import React from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { SharedTorchBackground } from "@/components/ui/animated-grid-background";
import { ContactForm } from "@/components/forms/contact-form";

// Section component with consistent styling
const Section = ({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`py-24 md:py-32 lg:py-40 relative ${className || ''}`}>
    {children}
  </section>
);

export default function ContactPage() {
  return (
    <main className="flex flex-col min-h-screen text-white relative overflow-x-hidden">
      {/* Animated grid background to match homepage */}
      <SharedTorchBackground />
      
      {/* Hero Section */}
      <Section id="hero" className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 animate-fade-in">
          {/* Animated red glow background */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            <div className="w-[700px] h-[320px] md:w-[900px] md:h-[400px] bg-red-600/20 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
          </div>
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="h-px w-8 bg-red-600/80 mr-2"></div>
              <span className="text-red-500 text-base font-bold tracking-widest">GET IN TOUCH</span>
              <div className="h-px w-8 bg-red-600/80 ml-2"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg animate-slide-up animation-delay-300">
              Contact <span className="text-red-600">Us</span>
            </h1>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
            </div>
            <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-2 animate-fade-in animation-delay-500">
              Ready to ignite your digital transformation? Let's start the conversation.
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed animate-fade-in animation-delay-700">
              We're here to help you achieve your business goals with innovative digital solutions.
            </p>
          </div>
        </div>
      </Section>

      {/* Contact Form and Info Section */}
      <Section id="contact-form">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 animate-fade-in">
          {/* Animated red glow background */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[300px] bg-red-600/15 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-slide-up animation-delay-300">
              <div className="border-2 border-black bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-white">Send us a message</h2>
                <ContactForm />
              </div>
            </div>

            {/* Contact Information */}
            <div className="animate-slide-up animation-delay-500">
              <div className="border-2 border-black bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl p-8 h-full">
                <h2 className="text-3xl font-bold mb-6 text-white">Get in touch</h2>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                        <Mail className="h-6 w-6 text-red-500" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                      <p className="text-gray-300">hello@torchgroup.com</p>
                      <p className="text-gray-300">support@torchgroup.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                        <Phone className="h-6 w-6 text-red-500" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Phone</h3>
                      <p className="text-gray-300">+1 (555) 123-4567</p>
                      <p className="text-gray-300">+1 (555) 987-6543</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-red-500" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Office</h3>
                      <p className="text-gray-300">123 Innovation Drive</p>
                      <p className="text-gray-300">Tech City, TC 12345</p>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Follow us</h3>
                  <div className="flex space-x-4">
                    {[
                      { icon: Facebook, href: "#", label: "Facebook" },
                      { icon: Twitter, href: "#", label: "Twitter" },
                      { icon: Instagram, href: "#", label: "Instagram" },
                      { icon: Linkedin, href: "#", label: "LinkedIn" }
                    ].map(({ icon: Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors duration-300 group"
                        aria-label={label}
                      >
                        <Icon className="h-5 w-5 text-red-500 group-hover:text-white transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section id="faq">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 animate-fade-in">
          {/* Animated red glow background */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            <div className="w-[700px] h-[320px] md:w-[900px] md:h-[400px] bg-red-600/15 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
          </div>
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="h-px w-8 bg-red-600/80 mr-2"></div>
              <span className="text-red-500 text-base font-bold tracking-widest">FREQUENTLY ASKED</span>
              <div className="h-px w-8 bg-red-600/80 ml-2"></div>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg">
              Common <span className="text-red-600">Questions</span>
            </h2>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "How long does a typical project take?",
                answer: "Project timelines vary depending on scope and complexity. Most projects range from 4-12 weeks, with larger enterprise solutions taking 3-6 months."
              },
              {
                question: "Do you offer ongoing support?",
                answer: "Yes, we provide comprehensive support and maintenance packages to ensure your digital solutions continue to perform optimally."
              },
              {
                question: "What industries do you work with?",
                answer: "We work with businesses across all industries, from startups to Fortune 500 companies, adapting our solutions to meet specific industry needs."
              },
              {
                question: "Can you help with existing projects?",
                answer: "Absolutely! We can audit, optimize, and enhance existing digital solutions, or provide consultation on ongoing projects."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className={`border-2 border-black bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl p-6 hover:border-red-600 transition-all duration-300 animate-slide-up`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <h3 className="text-xl font-bold mb-3 text-white">{faq.question}</h3>
                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section id="cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 animate-fade-in">
          {/* Animated red glow background */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            <div className="w-[700px] h-[320px] md:w-[900px] md:h-[400px] bg-red-600/20 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
          </div>
          
          <div className="bg-gradient-to-r from-red-900/50 to-black/0 p-8 md:p-12 rounded-xl border border-red-900">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg">
                Ready to Start Your <span className="text-red-600">Project?</span>
              </h2>
              <div className="flex justify-center mb-4">
                <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
              </div>
              <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-8">
                Let's discuss your vision and create something amazing together.
              </p>
              <div className="animate-slide-up animation-delay-300">
                <Link 
                  href="/services" 
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg inline-flex items-center transition-all duration-300 font-bold text-lg hover:scale-105 hover:shadow-lg hover:shadow-red-600/30"
                >
                  View our services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
} 