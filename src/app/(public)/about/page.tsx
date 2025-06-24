"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, Megaphone, Users } from "lucide-react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AnimatedFadeIn } from "@/components/ui/animated-fade-in";
import { SharedTorchBackground } from "@/components/ui/animated-grid-background";
import TiltedCard from '@/components/animations/TiltedCard';

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen text-white relative overflow-x-hidden">
      {/* Animated grid background to match homepage */}
      <SharedTorchBackground />
      {/* Hero Section */}
      <SectionWrapper animation="fade-in" className="py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 relative bg-transparent">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white">
              About <span className="torch-text-accent">Torch Group</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl">
              Igniting digital transformation through innovative solutions and strategic allies.
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* Our Story Section */}
      <SectionWrapper animation="slide-up" className="py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-12 md:gap-x-16 md:gap-y-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Our Story</h2>
              <p className="text-gray-200 mb-6 text-base sm:text-lg md:text-xl">
                Founded in 2020, Torch began with a simple vision: creating a creative environment in the cultural, 
                scientific, sports and tourism fields and helping companies and creative talents navigate the 
                increasingly complex digital landscape. What started as a small team of enthusiastic professionals 
                has grown into a full-service digital system with a global customer base.
              </p>
              <p className="text-gray-200 mb-6 text-base sm:text-lg md:text-xl">
                Throughout our journey, we have remained committed to our core values of innovation, excellence 
                and customer success. We have evolved with the changing technological landscape, but our mission 
                has remained constant: to shed light on the path to the digital success of our customers, achieving 
                the creative goals in Vision 2030 and Vision After 2030, raising the creative quality of life.
              </p>
              <p className="text-gray-200 text-base sm:text-lg md:text-xl">
                Today, we are proud to work with companies, cultural, scientific, sports and tourist entities 
                and talents of all sizes, from startups to established enterprises & talents, which helps them 
                harness digital power to achieving their goals.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 torch-bg-accent-10 rounded-3xl blur-xl"></div>
              <div className="relative rounded-3xl overflow-hidden border border-gray-800">
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

      {/* Mission & Goals Section */}
      <SectionWrapper animation="fade-in" className="py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Our Mission & Goals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 md:gap-x-12 md:gap-y-12">
            {[
              {
                title: "Attracting Partnerships",
                desc: "Attracting partnerships and supportive sponsorships to develop and raise the efficiency of the entity."
              },
              {
                title: "Media Highlighting",
                desc: "Highlighting the media and press on creative content to raise awareness."
              },
              {
                title: "Audience Engagement",
                desc: "Attracting an audience interested in the entity's content to raise engagement on social media platforms."
              },
              {
                title: "Vision 2030 Support",
                desc: "Supporting the achievement of Vision 2030 goals in various creative sectors."
              }
            ].map((goal, index) => (
              <AnimatedFadeIn 
                key={goal.title}
                animation="slide-up" 
                delay={0.1 * index}
                className="bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 backdrop-blur-lg border-2 torch-border-accent-30 p-8 rounded-3xl hover:torch-border-primary transition-all duration-500 hover:shadow-red-900/40 hover:shadow-xl min-h-10 px-4 py-2"
              >
                <h3 className="text-xl font-semibold mb-4 text-white">{goal.title}</h3>
                <p className="text-gray-200">
                  {goal.desc}
                </p>
              </AnimatedFadeIn>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Areas of Expertise Section */}
      <SectionWrapper animation="slide-up" className="py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Areas of Expertise</h2>
            <p className="text-gray-200 max-w-2xl mx-auto">
              Our specialized knowledge and skills across multiple domains enable us to deliver comprehensive solutions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8 md:gap-x-12 md:gap-y-12">
            {[
              {
                title: "Project Management",
                desc: "Strategic planning and execution of creative projects with precision and efficiency.",
                icon: <Briefcase className="h-12 w-12 mx-auto mb-4 torch-text-primary" />,
              },
              {
                title: "Marketing & Media",
                desc: "Comprehensive marketing strategies and media management to amplify your brand presence.",
                icon: <Megaphone className="h-12 w-12 mx-auto mb-4 torch-text-primary" />,
              },
              {
                title: "Talent Management",
                desc: "Nurturing and developing creative talents to achieve their full potential in the digital landscape.",
                icon: <Users className="h-12 w-12 mx-auto mb-4 torch-text-primary" />,
              }
            ].map((expertise, index) => (
              <TiltedCard
                key={expertise.title}
                containerHeight="320px"
                containerWidth="100%"
                imageHeight="320px"
                imageWidth="100%"
                scaleOnHover={1.08}
                rotateAmplitude={12}
                showMobileWarning={false}
                showTooltip={false}
              >
                <div className="bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 backdrop-blur-lg border-2 torch-border-accent-30 p-8 rounded-3xl text-center min-h-10 px-4 py-2 flex flex-col items-center justify-center h-full w-full">
                  {expertise.icon}
                  <h3 className="text-xl font-semibold mb-2 text-white">{expertise.title}</h3>
                  <p className="text-gray-200 text-base">{expertise.desc}</p>
                </div>
              </TiltedCard>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Core Values Section */}
      <SectionWrapper animation="fade-in" className="py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-white">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 md:gap-x-12 md:gap-y-12">
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
                desc: "We believe in the power of teamwork and collaboration. We work closely with our clients and each other to achieve shared goals."
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
                className="group relative bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-lg p-8 rounded-3xl border border-gray-800 hover:torch-border-primary hover:shadow-2xl hover:shadow-red-900/30 transition-all duration-500 hover:scale-105 hover:bg-gradient-to-br hover:from-black/80 hover:via-red-950/10 hover:to-black/80 cursor-pointer overflow-hidden min-h-10 px-4 py-2"
              >
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-red-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-4 text-white group-hover:torch-text-primary transition-colors duration-300">{value.title}</h3>
                  <p className="text-gray-200 group-hover:text-gray-100 transition-colors duration-300 leading-relaxed">
                    {value.desc}
                  </p>
                </div>
                
                {/* Animated accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 torch-bg-primary group-hover:w-full transition-all duration-500 ease-out"></div>
              </AnimatedFadeIn>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Team Section */}
      <SectionWrapper animation="slide-up" className="py-16 px-4 sm:px-6 md:px-8 lg:px-12 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">Meet Our Elite Members</h2>
            <p className="text-gray-200 max-w-3xl mx-auto">
              Our elite team of professionals is passionate about driving results and 
              delivering exceptional service to our clients.
            </p>
          </div>
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">
              Elite member profiles coming soon. Stay tuned to meet our exceptional team.
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper animation="fade-in" className="py-16 px-4 sm:px-6 md:px-8 lg:px-12 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-red-900/50 to-black/0 p-8 md:p-12 rounded-3xl border torch-border-accent-30">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Ready to transform your digital presence?</h2>
              <p className="text-gray-200 mb-8">
                Ally with us to ignite your business growth with innovative digital solutions.
              </p>
              <AnimatedFadeIn animation="slide-up" delay={0.3}>
                <Link 
                  href="/contact" 
                  className="torch-bg-primary hover:torch-bg-primary-hover text-white px-8 py-3 text-lg font-bold rounded-full inline-flex items-center transition-colors"
                >
                  Get in touch with us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </AnimatedFadeIn>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </main>
  );
} 