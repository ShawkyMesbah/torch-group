"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users, Target, Lightbulb, Heart, Zap, Award } from "lucide-react";
import { SharedTorchBackground } from "@/components/ui/animated-grid-background";

// Section component with consistent styling
const Section = ({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`py-24 md:py-32 lg:py-40 relative ${className || ''}`}>
    {children}
  </section>
);

export default function AboutPage() {
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
              <span className="text-red-500 text-base font-bold tracking-widest">WHO WE ARE</span>
              <div className="h-px w-8 bg-red-600/80 ml-2"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg animate-slide-up animation-delay-300">
              About <span className="text-red-600">Torch</span>
            </h1>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
            </div>
            <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-2 animate-fade-in animation-delay-500">
              Igniting digital transformation through innovative solutions and strategic allies.
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed animate-fade-in animation-delay-700">
              Empowering businesses to thrive in the digital landscape since 2015.
            </p>
          </div>
        </div>
      </Section>

      {/* Our Story Section */}
      <Section id="story">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 animate-fade-in">
          {/* Animated red glow background */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[300px] bg-red-600/15 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
          </div>
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="h-px w-8 bg-red-600/80 mr-2"></div>
              <span className="text-red-500 text-base font-bold tracking-widest">OUR JOURNEY</span>
              <div className="h-px w-8 bg-red-600/80 ml-2"></div>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg">
              Our <span className="text-red-600">Story</span>
            </h2>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-6">
                Founded in 2015, Torch Group began with a simple vision: to help businesses navigate the 
                increasingly complex digital landscape.
              </p>
              <p className="text-gray-400 mb-6 text-base md:text-lg leading-relaxed">
                What started as a small team of passionate professionals has grown into a full-service digital agency with a global client base. Throughout our journey, we've remained committed to our core values of innovation, excellence, and client success.
              </p>
              <p className="text-gray-400 mb-6 text-base md:text-lg leading-relaxed">
                We've evolved with the changing technological landscape, but our mission has remained constant: to illuminate the path to digital success for our clients.
              </p>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                Today, we're proud to work with businesses of all sizes, from startups to established enterprises, helping them harness the power of digital to achieve their goals.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-red-600/20 rounded-xl blur-xl"></div>
              <div className="relative rounded-xl overflow-hidden border-2 border-black bg-gradient-to-br from-black/80 via-black/60 to-black/80 hover:border-red-600 transition-all duration-300">
                <Image 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop" 
                  alt="Torch Group Team" 
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Core Values Section */}
      <Section id="values">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 animate-fade-in">
          {/* Animated red glow background */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            <div className="w-[700px] h-[320px] md:w-[900px] md:h-[400px] bg-red-600/15 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
          </div>
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="h-px w-8 bg-red-600/80 mr-2"></div>
              <span className="text-red-500 text-base font-bold tracking-widest">OUR PRINCIPLES</span>
              <div className="h-px w-8 bg-red-600/80 ml-2"></div>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg">
              Core <span className="text-red-600">Values</span>
            </h2>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
            </div>
            <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-2">
              The principles that guide everything we do.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {[
              {
                title: "Innovation",
                desc: "We constantly seek new and better ways to solve problems and deliver value. Innovation is at the heart of everything we do.",
                icon: <Lightbulb className="h-10 w-10 text-red-600 group-hover:text-white transition-colors duration-300" />
              },
              {
                title: "Excellence",
                desc: "We are committed to excellence in our work, our relationships, and our results. We never settle for 'good enough.'",
                icon: <Award className="h-10 w-10 text-red-600 group-hover:text-white transition-colors duration-300" />
              },
              {
                title: "Integrity",
                desc: "We build trust through honest communication, transparency in our processes, and always doing what's right for our clients.",
                icon: <Heart className="h-10 w-10 text-red-600 group-hover:text-white transition-colors duration-300" />
              },
              {
                title: "Collaboration",
                desc: "We believe in the power of teamwork and collaboration. We work closely with our clients and each other to achieve shared goals.",
                icon: <Users className="h-10 w-10 text-red-600 group-hover:text-white transition-colors duration-300" />
              },
              {
                title: "Adaptability",
                desc: "We embrace change and are quick to adapt to new technologies, methodologies, and market dynamics.",
                icon: <Zap className="h-10 w-10 text-red-600 group-hover:text-white transition-colors duration-300" />
              },
              {
                title: "Impact",
                desc: "We measure our success by the positive impact we create for our clients, their customers, and the broader community.",
                icon: <Target className="h-10 w-10 text-red-600 group-hover:text-white transition-colors duration-300" />
              }
            ].map((value, index) => (
              <div
                key={value.title}
                className={`group border-2 border-black bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/40 hover:border-red-600 hover:scale-105 p-8 animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon with glow */}
                <div className="mb-6 relative flex items-center justify-center">
                  <div className="absolute inset-0 w-16 h-16 bg-red-600/40 blur-[32px] rounded-full group-hover:blur-[48px] transition-all"></div>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-white tracking-tight drop-shadow-lg">{value.title}</h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Team Section */}
      <Section id="team">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 animate-fade-in">
          {/* Animated red glow background */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[300px] bg-red-600/15 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
          </div>
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="h-px w-8 bg-red-600/80 mr-2"></div>
              <span className="text-red-500 text-base font-bold tracking-widest">OUR TEAM</span>
              <div className="h-px w-8 bg-red-600/80 ml-2"></div>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg">
              Meet Our <span className="text-red-600">Leadership</span>
            </h2>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
            </div>
            <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-2">
              Our team of experienced professionals is passionate about driving results.
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Meet the leaders who guide our vision and deliver exceptional service to our clients.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {[
              {
                name: "Robert Chen",
                position: "Founder & CEO",
                bio: "With over 15 years of experience in digital innovation, Robert leads our company with a focus on strategic growth and technological excellence.",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop"
              },
              {
                name: "Sarah Johnson",
                position: "Chief Operations Officer",
                bio: "Sarah ensures our operations run smoothly and efficiently, bringing her extensive background in business management to drive operational excellence.",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"
              },
              {
                name: "Michael Lee",
                position: "Chief Technology Officer",
                bio: "Michael leads our technology strategy, keeping us at the cutting edge of digital innovation and ensuring our solutions are robust and future-proof.",
                image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop"
              },
              {
                name: "Emily Martinez",
                position: "Creative Director",
                bio: "Emily brings her artistic vision and creative expertise to every project, ensuring our solutions are not only functional but beautifully designed.",
                image: "https://images.unsplash.com/photo-1598550880863-4e8aa3d0edb4?q=80&w=1974&auto=format&fit=crop"
              }
            ].map((member, index) => (
              <div
                key={member.name}
                className={`group border-2 border-black bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/40 hover:border-red-600 hover:scale-105 animate-slide-up`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="h-64 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill 
                    className="object-cover transform transition-transform group-hover:scale-105 duration-700"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-white">{member.name}</h3>
                  <p className="text-red-500 text-sm mb-3 font-semibold">{member.position}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
                </div>
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
                Ready to Transform Your Digital <span className="text-red-600">Presence?</span>
              </h2>
              <div className="flex justify-center mb-4">
                <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
              </div>
              <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-8">
                Ally with us to ignite your business growth with innovative digital solutions.
              </p>
              <div className="animate-slide-up animation-delay-300">
                <Link 
                  href="/contact" 
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg inline-flex items-center transition-all duration-300 font-bold text-lg hover:scale-105 hover:shadow-lg hover:shadow-red-600/30"
                >
                  Get in touch with us
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