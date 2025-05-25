"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AnimatedFadeIn } from "@/components/ui/animated-fade-in";

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen bg-black text-white">
      {/* Hero Section */}
      <SectionWrapper animation="fade-in" className="py-20 px-4 md:px-6 lg:px-8 relative">
        <div className="absolute inset-0 z-0 opacity-20 bg-grid-pattern"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              About <span className="text-red-500">Torch Group</span>
            </h1>
            <p className="text-lg text-gray-200 max-w-3xl">
              Igniting digital transformation through innovative solutions and strategic partnerships.
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* Our Story Section */}
      <SectionWrapper animation="slide-up" className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">Our Story</h2>
              <p className="text-gray-200 mb-6">
                Founded in 2015, Torch Group began with a simple vision: to help businesses navigate the 
                increasingly complex digital landscape. What started as a small team of passionate 
                professionals has grown into a full-service digital agency with a global client base.
              </p>
              <p className="text-gray-200 mb-6">
                Throughout our journey, we've remained committed to our core values of innovation, 
                excellence, and client success. We've evolved with the changing technological landscape, 
                but our mission has remained constant: to illuminate the path to digital success for our clients.
              </p>
              <p className="text-gray-200">
                Today, we're proud to work with businesses of all sizes, from startups to established 
                enterprises, helping them harness the power of digital to achieve their goals.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-red-600/10 rounded-xl blur-xl"></div>
              <div className="relative rounded-xl overflow-hidden border border-gray-800">
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
      </SectionWrapper>

      {/* Core Values Section */}
      <SectionWrapper animation="fade-in" darkBg={true} className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation",
                desc: "We constantly seek new and better ways to solve problems and deliver value. Innovation is at the heart of everything we do."
              },
              {
                title: "Excellence",
                desc: "We are committed to excellence in our work, our relationships, and our results. We never settle for 'good enough.'"
              },
              {
                title: "Integrity",
                desc: "We build trust through honest communication, transparency in our processes, and always doing what's right for our clients."
              },
              {
                title: "Collaboration",
                desc: "We believe in the power of teamwork and partnership. We work closely with our clients and each other to achieve shared goals."
              },
              {
                title: "Adaptability",
                desc: "We embrace change and are quick to adapt to new technologies, methodologies, and market dynamics."
              },
              {
                title: "Impact",
                desc: "We measure our success by the positive impact we create for our clients, their customers, and the broader community."
              }
            ].map((value, index) => (
              <AnimatedFadeIn 
                key={value.title}
                animation="slide-up" 
                delay={0.1 * index}
                className="bg-gray-900/70 p-8 rounded-lg border border-gray-800 hover:border-red-600 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-4 text-white">{value.title}</h3>
                <p className="text-gray-200">
                  {value.desc}
                </p>
              </AnimatedFadeIn>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Team Section */}
      <SectionWrapper animation="slide-up" className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">Meet Our Leadership</h2>
            <p className="text-gray-200 max-w-3xl mx-auto">
              Our team of experienced professionals is passionate about driving results and 
              delivering exceptional service to our clients.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              <AnimatedFadeIn
                key={member.name}
                animation="fade-in"
                delay={0.15 * index}
                className="bg-black p-6 rounded-lg border border-gray-800 hover:border-red-600 transition-colors"
              >
                <div className="h-64 rounded-lg overflow-hidden mb-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill 
                    className="object-cover transform transition-transform hover:scale-105 duration-700"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1 text-white">{member.name}</h3>
                <p className="text-red-500 text-sm mb-3">{member.position}</p>
                <p className="text-gray-200 text-sm">{member.bio}</p>
              </AnimatedFadeIn>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper animation="fade-in" className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-red-900/50 to-black p-8 md:p-12 rounded-xl border border-red-900">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Ready to transform your digital presence?</h2>
              <p className="text-gray-200 mb-8">
                Partner with us to ignite your business growth with innovative digital solutions.
              </p>
              <AnimatedFadeIn animation="slide-up" delay={0.3}>
                <Link 
                  href="/contact" 
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg inline-flex items-center transition-colors"
                >
                  Get in touch with us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </AnimatedFadeIn>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </main>
  );
} 