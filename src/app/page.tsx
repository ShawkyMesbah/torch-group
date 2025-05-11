import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Welcome to <span className="text-primary-600">Torch Group</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
                Illuminating the path to excellence in digital solutions. 
                We provide innovative services to help your business thrive in today's competitive landscape.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button asChild size="lg">
                  <Link href="/services">
                    Our Services
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md h-[400px] rounded-lg overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-primary-600/10 rounded-lg"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold text-primary-600">Torch Group</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Expertise</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the wide range of services we offer to help you achieve your goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Web Development",
                description: "Custom web applications built with the latest technologies",
                icon: "🌐"
              },
              {
                title: "Digital Marketing",
                description: "Strategic marketing campaigns to grow your brand presence",
                icon: "📢"
              },
              {
                title: "Talent Management",
                description: "Connect with the best professionals in the industry",
                icon: "👥"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-8 transition-all hover:shadow-md">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to get started?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join us today and let us help you achieve your business objectives with our expert solutions
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">
              Get in Touch
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
