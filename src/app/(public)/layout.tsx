import { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Torch Group</h3>
              <p className="mb-4 text-gray-300">
                Professional services and solutions for businesses.
              </p>
              <div className="flex space-x-4">
                <a href={siteConfig.links.twitter} className="text-gray-300 hover:text-white">
                  Twitter
                </a>
                <a href={siteConfig.links.linkedin} className="text-gray-300 hover:text-white">
                  LinkedIn
                </a>
                <a href={siteConfig.links.github} className="text-gray-300 hover:text-white">
                  GitHub
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2">
                {siteConfig.footerNav.services.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-gray-300 hover:text-white">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                {siteConfig.footerNav.company.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-gray-300 hover:text-white">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <address className="not-italic text-gray-300">
                <p>{siteConfig.contactInfo.address}</p>
                <p className="mt-2">{siteConfig.contactInfo.email}</p>
                <p>{siteConfig.contactInfo.phone}</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300">&copy; {new Date().getFullYear()} Torch Group. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {siteConfig.footerNav.legal.map((item) => (
                <Link key={item.href} href={item.href} className="text-gray-300 hover:text-white">
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 