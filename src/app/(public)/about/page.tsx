"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, Megaphone, Users } from "lucide-react";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AnimatedFadeIn } from "@/components/ui/animated-fade-in";
import { SharedTorchBackground } from "@/components/ui/animated-grid-background";
import { useTiltEffect } from "@/hooks/useTiltEffect";
import TiltedCard from "@/components/animations/TiltedCard";
import Head from "next/head";

export default function AboutPage() {
  // Performance optimizations from homepage
  const [isOlderDevice, setIsOlderDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for older devices or reduced motion preferences
    const checkDeviceCapabilities = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isOlder = /android [1-4]|iphone os [1-9]_|cpu os [1-9]_/.test(userAgent);
      setIsOlderDevice(isOlder);
      
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setPrefersReducedMotion(prefersReduced);
    };

    checkDeviceCapabilities();
  }, []);

  // Tilt effects for interactive cards
  const goalTiltRefs = [
    useTiltEffect({ max: 8, scale: 1.03 }),
    useTiltEffect({ max: 8, scale: 1.03 }),
    useTiltEffect({ max: 8, scale: 1.03 }),
    useTiltEffect({ max: 8, scale: 1.03 }),
    useTiltEffect({ max: 8, scale: 1.03 }),
  ];

  const valueTiltRefs = [
    useTiltEffect({ max: 8, scale: 1.03 }),
    useTiltEffect({ max: 8, scale: 1.03 }),
    useTiltEffect({ max: 8, scale: 1.03 }),
    useTiltEffect({ max: 8, scale: 1.03 }),
    useTiltEffect({ max: 8, scale: 1.03 }),
    useTiltEffect({ max: 8, scale: 1.03 }),
  ];

  return (
    <>
      <Head>
        <title>About Torch Group - Leading Creative Digital Agency | Our Story & Mission</title>
        <meta name="description" content="Learn about Torch Group's journey from 2020 startup to global creative digital agency. Discover our mission, core values, and expertise in transforming brands through innovative digital solutions." />
        <meta name="keywords" content="about torch group, creative agency story, digital transformation experts, vision 2030, creative talents, brand development, digital innovation, saudi arabia agency" />
        <meta property="og:title" content="About Torch Group - Leading Creative Digital Agency | Our Story & Mission" />
        <meta property="og:description" content="Learn about Torch Group's journey from 2020 startup to global creative digital agency. Discover our mission, core values, and expertise in transforming brands." />
        <meta property="og:type" content="website" />
        <meta property="twitter:title" content="About Torch Group - Leading Creative Digital Agency | Our Story & Mission" />
        <meta property="twitter:description" content="Learn about Torch Group's journey from 2020 startup to global creative digital agency. Discover our mission, core values, and expertise in transforming brands." />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AboutPage",
              "mainEntity": {
                "@type": "Organization",
                "name": "Torch Group",
                "foundingDate": "2020",
                "description": "Creative digital agency specializing in brand transformation and digital innovation",
                "mission": "Creating a creative environment in cultural, scientific, sports and tourism fields while helping companies and creative talents navigate the digital landscape",
                "areaServed": "Global",
                "industry": "Digital Marketing and Creative Services"
              }
            })
          }}
        />
      </Head>

    <main className="flex flex-col min-h-screen text-white relative overflow-x-hidden pt-20 md:pt-24">
        {/* Accessibility: Landmark regions */}
        <div className="sr-only">
          <h1>About Torch Group - Leading Creative Digital Agency</h1>
          <nav aria-label="Page sections">
            <ul>
              <li><a href="#hero">Introduction</a></li>
              <li><a href="#story">Our Story</a></li>
              <li><a href="#mission">Mission & Goals</a></li>
              <li><a href="#expertise">Areas of Expertise</a></li>
              <li><a href="#values">Core Values</a></li>
              <li><a href="#team">Team</a></li>
              <li><a href="#cta">Contact</a></li>
            </ul>
          </nav>
        </div>

      {/* Animated grid background to match homepage */}
      <SharedTorchBackground />
        
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-5rem)] md:min-h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden">
        <div className="relative z-20 flex flex-1 flex-col items-center justify-center w-full h-full px-4 text-center">
          <motion.div 
            className="flex flex-col items-center justify-center w-full h-full text-center z-20 flex-1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white tracking-tight group cursor-default"
              whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
              } : {}}
            >
              <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                About
              </span>{" "}
              <span className="torch-text-accent relative group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)]">
                Torch Group
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-full transition-all duration-500 ease-out"></span>
              </span>
            </motion.h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl">
              Igniting digital transformation through innovative solutions and strategic allies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
        <SectionWrapper animation="slide-up" className="torch-section-standard bg-transparent" id="story">
        <div className="torch-container-wide mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-spacious lg:gap-grand items-center">
            <div>
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight group cursor-default"
                  whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" }
                  } : {}}
                >
                  <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    Our
                  </span>{" "}
                  <span className="torch-text-accent relative group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)]">
                    Story
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-full transition-all duration-500 ease-out"></span>
                  </span>
                </motion.h2>
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
                    priority
                />
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Mission & Goals Section */}
        <SectionWrapper animation="fade-in" className="torch-section-standard bg-transparent" id="mission">
        <div className="torch-container-wide mx-auto">
          <div className="text-center mb-grand">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-spacious text-white tracking-tight group cursor-default"
                whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                } : {}}
              >
                <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                  Our Mission &
                </span>{" "}
                <span className="torch-text-accent relative group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)]">
                  Goals
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-full transition-all duration-500 ease-out"></span>
                </span>
              </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-generous lg:gap-grand">
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
                <motion.div
                key={goal.title}
                  ref={goalTiltRefs[index]}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="group relative bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-lg p-generous rounded-3xl border border-gray-800 hover:torch-border-primary hover:shadow-2xl hover:shadow-red-900/30 transition-all duration-500 hover:bg-gradient-to-br hover:from-black/80 hover:via-red-950/10 hover:to-black/80 cursor-pointer overflow-hidden"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-red-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <h3 className="text-xl font-semibold mb-comfortable text-white">{goal.title}</h3>
                    <p className="text-gray-200 leading-relaxed">{goal.desc}</p>
                  </div>
                  
                  {/* Animated accent line */}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 torch-bg-primary group-hover:w-full transition-all duration-500 ease-out"></div>
                </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Areas of Expertise Section */}
        <SectionWrapper animation="slide-up" className="torch-section-standard bg-transparent" id="expertise">
        <div className="torch-container-wide mx-auto">
          <div className="text-center mb-grand">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-spacious text-white tracking-tight group cursor-default"
                whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                } : {}}
              >
                <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                  Areas of
                </span>{" "}
                <span className="torch-text-accent relative group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)]">
                  Expertise
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-full transition-all duration-500 ease-out"></span>
                </span>
              </motion.h2>
            <p className="text-gray-200 torch-container-content mx-auto">
              Our specialized knowledge and skills across multiple domains enable us to deliver comprehensive solutions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-generous lg:gap-grand">
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
              <motion.div
                key={expertise.title}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: {
                    type: "spring",
                    duration: 0.8,
                    delay: index * 0.2,
                    bounce: 0.3
                  }
                }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <TiltedCard
                  containerHeight="320px"
                  containerWidth="100%"
                  imageHeight="320px"
                  imageWidth="100%"
                  scaleOnHover={1.03}
                  rotateAmplitude={6}
                  showMobileWarning={false}
                  showTooltip={false}
                >
                  <motion.div
                    className="bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 backdrop-blur-lg border-2 torch-border-accent-30 p-generous rounded-3xl text-center h-full w-full flex flex-col items-center justify-center"
                    style={{ 
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                      willChange: 'auto'
                    }}
                  >
                    <div className="relative z-10">
                      {expertise.icon}
                      <h3 className="text-xl font-semibold mb-cozy text-white">{expertise.title}</h3>
                      <p className="text-gray-200 text-base leading-relaxed">{expertise.desc}</p>
                    </div>
                  </motion.div>
                </TiltedCard>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Core Values Section */}
        <SectionWrapper animation="fade-in" className="torch-section-standard bg-transparent" id="values">
        <div className="torch-container-wide mx-auto">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-spacious text-center text-white tracking-tight group cursor-default"
              whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
              } : {}}
            >
              <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                Our Core
              </span>{" "}
              <span className="torch-text-accent relative group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)]">
                Values
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-full transition-all duration-500 ease-out"></span>
              </span>
            </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-generous lg:gap-grand">
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
                                 <motion.div
                key={value.title}
                   ref={valueTiltRefs[index]}
                   initial={{ opacity: 0, y: 40 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.6, delay: 0.1 * index }}
                   className="group relative bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-lg p-generous rounded-3xl border border-gray-800 hover:torch-border-primary hover:shadow-2xl hover:shadow-red-900/30 transition-all duration-500 hover:bg-gradient-to-br hover:from-black/80 hover:via-red-950/10 hover:to-black/80 cursor-pointer overflow-hidden"
                   style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-red-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative z-10">
                    <h3 className="text-xl font-semibold mb-comfortable text-white group-hover:torch-text-primary transition-colors duration-300">{value.title}</h3>
                  <p className="text-gray-200 group-hover:text-gray-100 transition-colors duration-300 leading-relaxed">
                    {value.desc}
                  </p>
                </div>
                
                {/* Animated accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 torch-bg-primary group-hover:w-full transition-all duration-500 ease-out"></div>
                 </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Team Section */}
        <SectionWrapper animation="slide-up" className="py-16 px-4 sm:px-6 md:px-8 lg:px-12 bg-transparent" id="team">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
              <motion.h2 
                className="text-3xl font-bold mb-4 text-white tracking-tight group cursor-default"
                whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                } : {}}
              >
                <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                  Meet Our Elite
                </span>{" "}
                <span className="torch-text-accent relative group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)]">
                  Members
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-full transition-all duration-500 ease-out"></span>
                </span>
              </motion.h2>
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
        <SectionWrapper animation="fade-in" className="py-16 px-4 sm:px-6 md:px-8 lg:px-12 bg-transparent" id="cta">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-red-900/50 to-black/0 p-8 md:p-12 rounded-3xl border torch-border-accent-30">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-comfortable text-white">Ready to transform your digital presence?</h2>
                <p className="text-gray-200 mb-generous">
                Ally with us to ignite your business growth with innovative digital solutions.
              </p>
              <AnimatedFadeIn animation="slide-up" delay={0.3}>
                <Link 
                  href="/contact" 
                    className="torch-bg-primary hover:torch-bg-primary-hover text-white px-8 py-3 text-lg font-bold rounded-full inline-flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    aria-label="Contact Torch Group to start your digital transformation"
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
    </>
  );
} 