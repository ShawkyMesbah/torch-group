import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Innovative Solutions for Forward-Thinking Businesses
            </h1>
            <p className="text-xl mb-8">
              We help businesses transform, grow, and succeed in today's digital landscape.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/contact" 
                className="bg-white text-primary-700 hover:bg-gray-100 px-6 py-3 rounded-md font-medium"
              >
                Get in Touch
              </Link>
              <Link 
                href="/services" 
                className="bg-transparent border border-white text-white hover:bg-white/10 px-6 py-3 rounded-md font-medium"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service cards will go here */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Web Development</h3>
              <p className="text-gray-600 mb-4">Custom websites and applications built with modern technologies.</p>
              <Link href="/services/web-development" className="text-primary-600 font-medium">
                Learn more →
              </Link>
            </div>
            {/* More service cards */}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project cards will go here */}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="max-w-3xl mx-auto">
            {/* Testimonials will go here */}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us today to discuss how we can help you achieve your business goals.
          </p>
          <Link 
            href="/contact" 
            className="bg-white text-primary-700 hover:bg-gray-100 px-6 py-3 rounded-md font-medium inline-block"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
} 