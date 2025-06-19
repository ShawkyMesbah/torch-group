"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AnimatedFadeIn } from "@/components/ui/animated-fade-in";
import { SharedTorchBackground } from "@/components/ui/animated-grid-background";

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen text-white relative overflow-x-hidden">
      {/* Animated grid background to match homepage */}
      <SharedTorchBackground />
      {/* Hero Section */}
      <SectionWrapper animation="fade-in" className="py-20 px-4 md:px-6 lg:px-8 relative bg-transparent">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              About <span className="torch-text-accent">Torch Group</span>
            </h1>
            <p className="text-lg text-gray-200 max-w-3xl">
              Igniting digital transformation through innovative solutions and strategic allies.
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* Our Story Section */}
      <SectionWrapper animation="slide-up" className="py-16 px-4 md:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">Our Story</h2>
              <p className="text-gray-200 mb-6">
                Founded in 2020, Torch began with a simple vision: creating a creative environment in the cultural, 
                scientific, sports and tourism fields and helping companies and creative talents navigate the 
                increasingly complex digital landscape. What started as a small team of enthusiastic professionals 
                has grown into a full-service digital system with a global customer base.
              </p>
              <p className="text-gray-200 mb-6">
                Throughout our journey, we have remained committed to our core values of innovation, excellence 
                and customer success. We have evolved with the changing technological landscape, but our mission 
                has remained constant: to shed light on the path to the digital success of our customers, achieving 
                the creative goals in Vision 2030 and Vision After 2030, raising the creative quality of life.
              </p>
              <p className="text-gray-200">
                Today, we are proud to work with companies, cultural, scientific, sports and tourist entities 
                and talents of all sizes, from startups to established enterprises & talents, which helps them 
                harness digital power to achieving their goals.
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

      {/* Mission & Goals Section */}
      <SectionWrapper animation="fade-in" className="py-16 px-4 md:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">Our Mission & Goals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                className="bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 backdrop-blur-lg border-2 border-red-900/30 p-8 rounded-3xl hover:border-red-600 transition-all duration-500 hover:shadow-red-900/40 hover:shadow-xl"
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
      <SectionWrapper animation="slide-up" className="py-16 px-4 md:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">Areas of Expertise</h2>
            <p className="text-gray-200 max-w-2xl mx-auto">
              Our specialized knowledge and skills across multiple domains enable us to deliver comprehensive solutions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Project Management",
                desc: "Strategic planning and execution of creative projects with precision and efficiency."
              },
              {
                title: "Marketing & Media",
                desc: "Comprehensive marketing strategies and media management to amplify your brand presence."
              },
              {
                title: "Talent Management",
                desc: "Nurturing and developing creative talents to achieve their full potential in the digital landscape."
              }
            ].map((expertise, index) => (
              <AnimatedFadeIn 
                key={expertise.title}
                animation="fade-in" 
                delay={0.15 * index}
                className="bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 backdrop-blur-lg border-2 border-red-900/30 p-8 rounded-3xl hover:border-red-600 transition-all duration-500 hover:shadow-red-900/40 hover:shadow-xl text-center"
              >
                <h3 className="text-xl font-semibold mb-4 text-white">{expertise.title}</h3>
                <p className="text-gray-200">
                  {expertise.desc}
                </p>
              </AnimatedFadeIn>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Core Values Section */}
      <SectionWrapper animation="fade-in" className="py-16 px-4 md:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                className="bg-transparent p-8 rounded-lg border border-gray-800 hover:border-red-600 transition-colors"
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
      <SectionWrapper animation="slide-up" className="py-16 px-4 md:px-6 lg:px-8 bg-transparent">
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
                className="bg-transparent p-6 rounded-lg border border-gray-800 hover:border-red-600 transition-colors"
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
      <SectionWrapper animation="fade-in" className="py-16 px-4 md:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-red-900/50 to-black/0 p-8 md:p-12 rounded-xl border border-red-900">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Ready to transform your digital presence?</h2>
              <p className="text-gray-200 mb-8">
                Ally with us to ignite your business growth with innovative digital solutions.
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