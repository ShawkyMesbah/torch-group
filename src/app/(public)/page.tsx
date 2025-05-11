import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { z } from "zod";

// Services data
const services = [
  {
    title: "Web Development",
    description: "Custom websites and web applications built with cutting-edge technologies for optimal performance and user experience.",
    icon: "code",
  },
  {
    title: "Digital Marketing",
    description: "Strategic digital marketing solutions to elevate your brand, reach your target audience, and drive meaningful conversions.",
    icon: "bar-chart",
  },
  {
    title: "UI/UX Design",
    description: "User-centered design that creates intuitive, accessible, and visually stunning digital experiences.",
    icon: "palette",
  },
  {
    title: "Business Consulting",
    description: "Expert guidance to navigate challenges, identify opportunities, and implement effective business strategies.",
    icon: "briefcase",
  },
  {
    title: "Content Creation",
    description: "Compelling content that tells your story, engages your audience, and strengthens your brand identity.",
    icon: "file-text",
  },
  {
    title: "Legal Services",
    description: "Professional legal counsel to protect your business interests and ensure compliance with relevant regulations.",
    icon: "scale",
  }
];

// Sub-brands data
const subBrands = [
  {
    name: "Torch Digital",
    description: "Digital transformation and technology solutions",
    icon: "monitor",
    color: "bg-blue-500",
  },
  {
    name: "Torch Legal",
    description: "Comprehensive legal services for businesses",
    icon: "scale-balanced",
    color: "bg-amber-500",
  },
  {
    name: "Torch Creative",
    description: "Brand identity and creative design services",
    icon: "wand-magic-sparkles",
    color: "bg-purple-500",
  },
  {
    name: "Torch Consult",
    description: "Strategic business consulting and advisory",
    icon: "lightbulb",
    color: "bg-green-500",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-28 lg:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-500">Torch</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed">
              Illuminating the path to business excellence with innovative solutions and expert guidance.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-primary-950 font-medium">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
            <div className="mt-16 flex justify-center">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all duration-300">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="animate-bounce"
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 160">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,128L48,112C96,96,192,64,288,64C384,64,480,96,576,96C672,96,768,64,864,80C960,96,1056,160,1152,160C1248,160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-gray-600">
              Comprehensive solutions tailored to help your business thrive in today's competitive landscape.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-100 text-primary-700 mb-4">
                    {service.icon === "code" && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                    )}
                    {service.icon === "bar-chart" && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
                    )}
                    {service.icon === "palette" && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="0.5"></circle><circle cx="17.5" cy="10.5" r="0.5"></circle><circle cx="8.5" cy="7.5" r="0.5"></circle><circle cx="6.5" cy="12.5" r="0.5"></circle><path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9z"></path><path d="M12 13c-4.97 0-9-4.03-9-9 0 4.97 4.03 9 9 9z"></path></svg>
                    )}
                    {service.icon === "briefcase" && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                    )}
                    {service.icon === "file-text" && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
                    )}
                    {service.icon === "scale" && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3h8a0 0 0 0 1 0 0v17H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M16 3h0a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h0"></path><line x1="10" y1="9" x2="14" y2="9"></line></svg>
                    )}
                  </div>
                  <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link 
                    href={`/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center"
                  >
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
              </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Us section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Approach</h2>
              <p className="text-lg text-gray-600 mb-6">
                At Torch Group, we believe in delivering excellence through specialized expertise. 
                Our family of service divisions allows us to provide comprehensive solutions while 
                maintaining deep specialization in each area.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Whether you need digital solutions, legal counsel, creative services, or business 
                strategy, our integrated approach ensures cohesive results that drive your business forward.
              </p>
              <Button className="bg-primary-600 hover:bg-primary-700">
                About Our Team
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {subBrands.map((brand, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full ${brand.color} text-white mb-4`}>
                    {brand.icon === "monitor" && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                    )}
                    {brand.icon === "scale-balanced" && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 8h-8a2 2 0 0 0-2 2v4"></path><path d="M4 6v10c0 1.1.9 2 2 2h3"></path><path d="M14 14a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2h-4z"></path><path d="M4 10a2 2 0 0 0 2 2h3"></path><circle cx="9" cy="12" r="2"></circle></svg>
                    )}
                    {brand.icon === "wand-magic-sparkles" && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.2 8.4-8.4 8.4a1.7 1.7 0 0 1-2.4 0 1.7 1.7 0 0 1 0-2.4L18.8 6c0 .4.8 2.4 2.4 2.4Z"></path><path d="M15 2.5 14 3l1 .5-.5 1 1 .5-.5 1 1 .5-.5 1 1 .5-.5 1"></path><path d="M11.5 7 11 8l-1-.5v1l-1 .5 1 1-.5 1 1-.5v1l.5 1 .5-1v-1l1 .5-1-1 1-.5-1-1 .5-1-1 .5v-1l-.5-1Z"></path><path d="M19.9 14.9c.7-.8-.5-2-.5-2m-13.4 7.5-3-3"></path></svg>
                    )}
                    {brand.icon === "lightbulb" && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{brand.name}</h3>
                  <p className="text-gray-600">{brand.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
              <p className="text-lg text-gray-600">
                Have a question or want to discuss how we can help your business? Reach out to us.
              </p>
            </div>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  <div className="bg-primary-700 text-white p-8 rounded-l-lg">
                    <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary-600 mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        </div>
                        <div>
                          <p className="text-white/80 text-sm">Phone</p>
                          <p className="text-lg">+1 (555) 123-4567</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary-600 mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                        </div>
                        <div>
                          <p className="text-white/80 text-sm">Email</p>
                          <p className="text-lg">contact@torchgroup.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary-600 mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        </div>
                        <div>
                          <p className="text-white/80 text-sm">Address</p>
                          <p className="text-lg">123 Business Street, Suite 100, New York, NY 10001</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-10">
                      <h4 className="text-xl font-semibold mb-4">Connect With Us</h4>
                      <div className="flex space-x-4">
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-600 hover:bg-primary-500 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                        </a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-600 hover:bg-primary-500 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-600 hover:bg-primary-500 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                        </a>
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-600 hover:bg-primary-500 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
                    <form className="space-y-6">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            placeholder="John Doe" 
                            required 
                            className="w-full p-3 border border-gray-300 rounded-md"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            placeholder="john@example.com" 
                            required 
                            className="w-full p-3 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <textarea 
                          id="message" 
                          name="message" 
                          rows={4} 
                          placeholder="How can we help you?" 
                          required 
                          className="w-full p-3 border border-gray-300 rounded-md resize-none"
                        />
                      </div>
                      
                      <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700">
                        Send Message
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
} 