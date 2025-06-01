import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap, Mail, LineChart, Users, BrainCircuit, Code, Smartphone } from "lucide-react";
import { SharedTorchBackground } from "@/components/ui/animated-grid-background";

export default function ServicesPage() {
  return (
    <main className="flex flex-col min-h-screen text-white relative overflow-x-hidden">
      {/* Animated grid background to match homepage */}
      <SharedTorchBackground />
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 relative bg-transparent">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our <span className="text-red-600">Services</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-3xl">
              Comprehensive digital solutions tailored to your business needs
            </p>
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Core Services</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We offer a range of specialized services to help businesses grow their digital presence and reach their target audience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Media Press */}
            <div className="bg-transparent rounded-lg overflow-hidden border border-gray-800 hover:border-red-600 transition-colors group shadow-lg hover:shadow-[0_0_40px_10px_rgba(255,0,0,0.25)]">
              <div className="aspect-video relative">
                <Image 
                  src="https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=2070&auto=format&fit=crop" 
                  alt="Media Press" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center">
                  <Mail className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="text-xl font-semibold">Media Press</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-400 mb-4">
                  Our digital marketing services will help your business grow online and attract more customers through strategic campaigns and content.
                </p>
                <ul className="text-sm text-gray-400 space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    Content marketing and distribution
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    Public relations and media outreach
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    Press release writing and publishing
                  </li>
                </ul>
              </div>
            </div>

            {/* Talent Support */}
            <div className="bg-transparent rounded-lg overflow-hidden border border-gray-800 hover:border-red-600 transition-colors group shadow-lg hover:shadow-[0_0_40px_10px_rgba(255,0,0,0.25)]">
              <div className="aspect-video relative">
                <Image 
                  src="https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2070&auto=format&fit=crop" 
                  alt="Talent Support" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center">
                  <Users className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="text-xl font-semibold">Talent Support</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-400 mb-4">
                  Strategic marketing campaigns to grow your brand presence and reach your target audience effectively.
                </p>
                <ul className="text-sm text-gray-400 space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    Influencer partnerships and management
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    Talent discovery and development
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    Brand ambassador programs
                  </li>
                </ul>
              </div>
            </div>

            {/* Marketing Systems */}
            <div className="bg-transparent rounded-lg overflow-hidden border border-gray-800 hover:border-red-600 transition-colors group shadow-lg hover:shadow-[0_0_40px_10px_rgba(255,0,0,0.25)]">
              <div className="aspect-video relative">
                <Image 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                  alt="Marketing Systems" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center">
                  <LineChart className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="text-xl font-semibold">Marketing Systems</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-400 mb-4">
                  Connect with the best professionals in the industry to scale your team effectively and achieve your business goals.
                </p>
                <ul className="text-sm text-gray-400 space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    Marketing automation and CRM setup
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    Lead generation and nurturing systems
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    Analytics and reporting systems
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Additional Services</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Beyond our core offerings, we provide specialized services to complement your digital strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-transparent p-6 rounded-lg border border-gray-800 hover:border-red-600 transition-colors">
              <BrainCircuit className="h-10 w-10 text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI Integration</h3>
              <p className="text-gray-400 text-sm">
                Leverage artificial intelligence to enhance your business processes and customer experiences.
              </p>
            </div>
            <div className="bg-transparent p-6 rounded-lg border border-gray-800 hover:border-red-600 transition-colors">
              <Code className="h-10 w-10 text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Web Development</h3>
              <p className="text-gray-400 text-sm">
                Custom website development using the latest technologies to create engaging user experiences.
              </p>
            </div>
            <div className="bg-transparent p-6 rounded-lg border border-gray-800 hover:border-red-600 transition-colors">
              <Smartphone className="h-10 w-10 text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Mobile Apps</h3>
              <p className="text-gray-400 text-sm">
                Native and cross-platform mobile application development to reach your audience on any device.
              </p>
            </div>
            <div className="bg-transparent p-6 rounded-lg border border-gray-800 hover:border-red-600 transition-colors">
              <Zap className="h-10 w-10 text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Performance Optimization</h3>
              <p className="text-gray-400 text-sm">
                Speed up your digital platforms and improve conversion rates through data-driven optimization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Process</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We follow a proven methodology to deliver exceptional results for our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative">
              <div className="bg-transparent p-6 rounded-lg border border-gray-800 h-full">
                <div className="absolute -top-4 -left-4 bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">1</div>
                <h3 className="text-lg font-semibold mt-4 mb-3">Discovery</h3>
                <p className="text-gray-400 text-sm">
                  We start by understanding your business, goals, and challenges to develop a tailored strategy.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-transparent p-6 rounded-lg border border-gray-800 h-full">
                <div className="absolute -top-4 -left-4 bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">2</div>
                <h3 className="text-lg font-semibold mt-4 mb-3">Strategy</h3>
                <p className="text-gray-400 text-sm">
                  Based on our findings, we create a comprehensive strategy to achieve your specific objectives.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-transparent p-6 rounded-lg border border-gray-800 h-full">
                <div className="absolute -top-4 -left-4 bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">3</div>
                <h3 className="text-lg font-semibold mt-4 mb-3">Implementation</h3>
                <p className="text-gray-400 text-sm">
                  Our expert team executes the strategy with precision, keeping you informed throughout the process.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-transparent p-6 rounded-lg border border-gray-800 h-full">
                <div className="absolute -top-4 -left-4 bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">4</div>
                <h3 className="text-lg font-semibold mt-4 mb-3">Optimization</h3>
                <p className="text-gray-400 text-sm">
                  We continuously monitor, analyze, and refine our approach to maximize your results and ROI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-red-900/50 to-black/0 p-8 md:p-12 rounded-xl border border-red-900">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to elevate your digital presence?</h2>
              <p className="text-gray-400 mb-8">
                Contact us today to discuss how our services can help your business reach new heights.
              </p>
              <Link 
                href="/contact" 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg inline-flex items-center transition-colors"
              >
                Get in touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 