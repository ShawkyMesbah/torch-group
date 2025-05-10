import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary-600">
          Torch Group
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-primary-600 font-medium">
            About
          </Link>
          <Link href="/services" className="text-gray-700 hover:text-primary-600 font-medium">
            Services
          </Link>
          <Link href="/projects" className="text-gray-700 hover:text-primary-600 font-medium">
            Projects
          </Link>
          <Link href="/blog" className="text-gray-700 hover:text-primary-600 font-medium">
            Blog
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-primary-600 font-medium">
            Contact
          </Link>
        </nav>
        
        <div className="md:hidden">
          {/* Mobile menu button will go here */}
          <button className="text-gray-700">
            Menu
          </button>
        </div>
      </div>
    </header>
  );
} 