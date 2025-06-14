import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap, Mail, LineChart, Users, BrainCircuit, Code, Smartphone, BarChart3, ShoppingCart, Star, Building2 } from "lucide-react";
import { SharedTorchBackground } from "@/components/ui/animated-grid-background";
import { FeatureCard } from "@/components/ui/feature-card";

// Section component with consistent styling
const Section = ({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`py-24 md:py-32 lg:py-40 relative ${className || ''}`}>
    {children}
  </section>
);

export default function ServicesPage() {
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
              <span className="text-red-500 text-base font-bold tracking-widest">WHAT WE OFFER</span>
              <div className="h-px w-8 bg-red-600/80 ml-2"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg animate-slide-up animation-delay-300">
              Our <span className="text-red-600">Services</span>
            </h1>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
            </div>
            <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-2 animate-fade-in animation-delay-500">
              Comprehensive digital solutions to ignite your business growth.
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed animate-fade-in animation-delay-700">
              From strategy to execution, we provide end-to-end services that drive results.
            </p>
          </div>
        </div>
      </Section>

      {/* Main Services Section */}
      <Section id="main-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 animate-fade-in">
          {/* Animated red glow background */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[300px] bg-red-600/15 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
          </div>
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="h-px w-8 bg-red-600/80 mr-2"></div>
              <span className="text-red-500 text-base font-bold tracking-widest">CORE OFFERINGS</span>
              <div className="h-px w-8 bg-red-600/80 ml-2"></div>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg">
              Service <span className="text-red-600">Categories</span>
            </h2>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {[
              {
                title: "B2C Solutions",
                description: "Direct-to-consumer digital experiences that drive engagement and sales.",
                icon: <ShoppingCart className="h-10 w-10 text-red-600 group-hover:text-white transition-colors duration-300" />,
                features: ["E-commerce Platforms", "Mobile Apps", "Customer Portals", "Social Commerce"]
              },
              {
                title: "B2T (Business to Talent)",
                description: "Specialized platforms connecting businesses with top-tier talent.",
                icon: <Star className="h-10 w-10 text-red-600 group-hover:text-white transition-colors duration-300" />,
                features: ["Talent Marketplaces", "Recruitment Platforms", "Freelancer Networks", "Skill Assessment Tools"]
              },
              {
                title: "B2B Solutions",
                description: "Enterprise-grade solutions that streamline business operations.",
                icon: <Building2 className="h-10 w-10 text-red-600 group-hover:text-white transition-colors duration-300" />,
                features: ["CRM Systems", "ERP Solutions", "Business Intelligence", "Workflow Automation"]
              }
            ].map((service, index) => (
              <div
                key={service.title}
                className={`group border-2 border-black bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/40 hover:border-red-600 hover:scale-105 p-8 animate-slide-up`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Icon with glow */}
                <div className="mb-6 relative flex items-center justify-center">
                  <div className="absolute inset-0 w-16 h-16 bg-red-600/40 blur-[32px] rounded-full group-hover:blur-[48px] transition-all"></div>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-white tracking-tight drop-shadow-lg">{service.title}</h3>
                <p className="text-gray-300 text-base leading-relaxed mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Detailed Services Section */}
      <Section id="detailed-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 animate-fade-in">
          {/* Animated red glow background */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            <div className="w-[700px] h-[320px] md:w-[900px] md:h-[400px] bg-red-600/15 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
          </div>
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="h-px w-8 bg-red-600/80 mr-2"></div>
              <span className="text-red-500 text-base font-bold tracking-widest">COMPREHENSIVE SOLUTIONS</span>
              <div className="h-px w-8 bg-red-600/80 ml-2"></div>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg">
              Detailed <span className="text-red-600">Services</span>
            </h2>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {[
              {
                title: "Web Development",
                description: "Custom websites and web applications built with modern technologies.",
                icon: <Code className="h-8 w-8 text-red-600 group-hover:text-white transition-colors duration-300" />
              },
              {
                title: "Mobile Development",
                description: "Native and cross-platform mobile apps for iOS and Android.",
                icon: <Smartphone className="h-8 w-8 text-red-600 group-hover:text-white transition-colors duration-300" />
              },
              {
                title: "Digital Marketing",
                description: "Comprehensive digital marketing strategies to grow your online presence.",
                icon: <BarChart3 className="h-8 w-8 text-red-600 group-hover:text-white transition-colors duration-300" />
              },
              {
                title: "UI/UX Design",
                description: "User-centered design that creates engaging and intuitive experiences.",
                icon: <BrainCircuit className="h-8 w-8 text-red-600 group-hover:text-white transition-colors duration-300" />
              },
              {
                title: "Analytics & Insights",
                description: "Data-driven insights to optimize performance and drive growth.",
                icon: <LineChart className="h-8 w-8 text-red-600 group-hover:text-white transition-colors duration-300" />
              },
              {
                title: "Consulting",
                description: "Strategic guidance to help you navigate digital transformation.",
                icon: <Users className="h-8 w-8 text-red-600 group-hover:text-white transition-colors duration-300" />
              }
            ].map((service, index) => (
              <div
                key={service.title}
                className={`group border-2 border-black bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/40 hover:border-red-600 hover:scale-105 p-6 animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon with glow */}
                <div className="mb-4 relative flex items-center justify-center w-12 h-12">
                  <div className="absolute inset-0 w-12 h-12 bg-red-600/40 blur-[24px] rounded-full group-hover:blur-[32px] transition-all"></div>
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold mb-3 text-white tracking-tight drop-shadow-lg">{service.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Process Section */}
      <Section id="process">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 animate-fade-in">
          {/* Animated red glow background */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[300px] bg-red-600/15 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
          </div>
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="h-px w-8 bg-red-600/80 mr-2"></div>
              <span className="text-red-500 text-base font-bold tracking-widest">HOW WE WORK</span>
              <div className="h-px w-8 bg-red-600/80 ml-2"></div>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg">
              Our <span className="text-red-600">Process</span>
            </h2>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
            </div>
            <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-2">
              A proven methodology that delivers exceptional results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {[
              {
                step: "01",
                title: "Discovery",
                description: "We start by understanding your business, goals, and challenges through comprehensive research and analysis."
              },
              {
                step: "02",
                title: "Strategy",
                description: "Based on our findings, we develop a tailored strategy that aligns with your objectives and market opportunities."
              },
              {
                step: "03",
                title: "Execution",
                description: "Our expert team brings the strategy to life with cutting-edge technology and best practices."
              },
              {
                step: "04",
                title: "Optimization",
                description: "We continuously monitor, analyze, and optimize performance to ensure sustained success and growth."
              }
            ].map((step, index) => (
              <div
                key={step.step}
                className={`group border-2 border-black bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/40 hover:border-red-600 hover:scale-105 p-6 text-center animate-slide-up`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="mb-4 relative flex items-center justify-center">
                  <div className="absolute inset-0 w-16 h-16 bg-red-600/40 blur-[32px] rounded-full group-hover:blur-[48px] transition-all"></div>
                  <div className="relative w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center border-2 border-red-600/50 group-hover:border-red-600 transition-all">
                    <span className="text-2xl font-bold text-red-600 group-hover:text-white transition-colors">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white tracking-tight drop-shadow-lg">{step.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {step.description}
                </p>
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
                Ready to Transform Your <span className="text-red-600">Business?</span>
              </h2>
              <div className="flex justify-center mb-4">
                <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
              </div>
              <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-8">
                Let's discuss your project and create a custom solution that drives results.
              </p>
              <div className="animate-slide-up animation-delay-300">
                <Link 
                  href="/contact" 
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg inline-flex items-center transition-all duration-300 font-bold text-lg hover:scale-105 hover:shadow-lg hover:shadow-red-600/30"
                >
                  Get started today
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