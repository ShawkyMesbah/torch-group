"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, Calendar, User, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogPost } from "@/generated/prisma";
import { SharedTorchBackground } from "@/components/ui/animated-grid-background";
import { GlareHover } from "@/components/animations";

// Interface for blog posts with author information
interface BlogPostWithAuthor extends BlogPost {
  author?: {
    name: string | null;
    image?: string | null;
  };
  category?: string | null;
}

// Default categories for filtering
const categories = [
  "All",
  "Marketing",
  "Technology",
  "Branding",
  "E-commerce",
  "Social Media",
  "SEO"
];

// Section component with consistent styling
const Section = ({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`py-24 md:py-32 lg:py-40 relative ${className || ''}`}>
    {children}
  </section>
);

// Helper to safely format date
function formatDate(date: string | Date | undefined | null) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Add a helper function at the top:
function getAuthorImage(author: { image?: string | null } | undefined): string {
  if (author && typeof author.image === 'string' && author.image && author.image !== 'null') {
    return author.image;
  }
  return '/images/default-avatar.png';
}

export default function BlogPage() {
  const [mounted, setMounted] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPostWithAuthor[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPostWithAuthor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blog posts on component mount
  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const response = await fetch('/api/blog?published=true');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        setBlogPosts(data);
        setFilteredPosts(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setIsLoading(false);
      }
    }

    fetchBlogPosts();
    setMounted(true);
  }, []);

  // Filter posts based on search query and selected category
  useEffect(() => {
    if (blogPosts.length === 0) return;
    
    let filtered = blogPosts;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.category && post.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.author?.name && post.author.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory, blogPosts]);

  // Loading state
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen pt-0 pb-20 relative overflow-x-hidden">
        {/* Animated grid background to match homepage */}
        <SharedTorchBackground />
        {/* Hero Section with loading state */}
        <Section id="hero" className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 animate-fade-in">
            {/* Animated red glow background */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
              <div className="w-[700px] h-[320px] md:w-[900px] md:h-[400px] bg-red-600/20 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
            </div>
            
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center mb-6">
                <div className="h-px w-8 bg-red-600/80 mr-2"></div>
                <span className="text-red-500 text-base font-bold tracking-widest">INSIGHTS AND INSPIRATION</span>
                <div className="h-px w-8 bg-red-600/80 ml-2"></div>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg animate-slide-up animation-delay-300">
                Our <span className="text-red-600">Blog</span>
              </h1>
              <div className="flex justify-center mb-4">
                <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
              </div>
              <div className="flex justify-center items-center mt-12">
                <Loader2 className="h-8 w-8 text-red-500 animate-spin mr-3" />
                <p className="text-xl text-gray-300">Loading blog posts...</p>
              </div>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen pt-0 pb-20 relative overflow-x-hidden">
        {/* Animated grid background to match homepage */}
        <SharedTorchBackground />
        <Section id="hero" className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 animate-fade-in">
            {/* Animated red glow background */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
              <div className="w-[700px] h-[320px] md:w-[900px] md:h-[400px] bg-red-600/20 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
            </div>
            
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center mb-6">
                <div className="h-px w-8 bg-red-600/80 mr-2"></div>
                <span className="text-red-500 text-base font-bold tracking-widest">INSIGHTS AND INSPIRATION</span>
                <div className="h-px w-8 bg-red-600/80 ml-2"></div>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg">
                Our <span className="text-red-600">Blog</span>
              </h1>
              <div className="flex justify-center mb-4">
                <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 mt-8">
                <p className="text-red-500 text-lg mb-4">Error loading blog posts</p>
                <p className="text-gray-300 mb-6">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-red-600 hover:bg-red-700"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-0 pb-20 relative overflow-x-hidden">
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
              <span className="text-red-500 text-base font-bold tracking-widest">INSIGHTS AND INSPIRATION</span>
              <div className="h-px w-8 bg-red-600/80 ml-2"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-lg animate-slide-up animation-delay-300">
              Our <span className="text-red-600">Blog</span>
            </h1>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-white/60 to-red-600 rounded-full animate-pulse-slow"></div>
            </div>
            <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto leading-relaxed mb-2 animate-fade-in animation-delay-500">
              Discover the latest insights, Talents News, Top Talents Lists, Creative Entities, Creative Broken Records & Creative Content.
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed animate-fade-in animation-delay-700">
              Stay ahead with expert advice and strategies to help your business thrive in the digital world.
            </p>
          </div>
        </div>
      </Section>

      {/* Search and Filter Section */}
      <Section id="search-filter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 animate-fade-in">
          {/* Animated red glow background */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[300px] bg-red-600/15 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 w-full bg-black/50 border-2 border-gray-800 rounded-xl text-white placeholder-gray-400 focus:border-red-600 focus:ring-red-600/20 transition-all"
              />
            </div>

            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 bg-black/50 border border-gray-800 rounded-xl p-1">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-400 hover:text-white transition-all rounded-lg"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </Section>

      {/* Blog Posts Section */}
      <Section id="blog-posts">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 animate-fade-in">
          {/* Animated red glow background */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            <div className="w-[700px] h-[320px] md:w-[900px] md:h-[400px] bg-red-600/15 blur-[120px] rounded-full animate-pulse-slow mx-auto"></div>
          </div>
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-300 mb-4">No blog posts found matching your criteria.</p>
              {searchQuery && (
                <Button 
                  onClick={() => setSearchQuery("")}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {filteredPosts.map((post, index) => (
                <article
                  key={post.id}
                  className={`group border-2 border-black bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/40 hover:border-red-600 hover:scale-105 animate-slide-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <GlareHover className="w-full h-full">
                    {/* Featured Image */}
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                      <Image
                        src={post.coverImage || '/images/blog-placeholder.jpg'}
                        alt={post.title}
                        fill
                        className="object-cover transform transition-transform group-hover:scale-110 duration-700"
                      />
                      {post.category && (
                        <div className="absolute top-4 left-4 z-20">
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {post.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Meta Info */}
                      <div className="flex items-center text-gray-400 text-sm mb-3 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                        {post.author?.name && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>{post.author.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold mb-3 text-white group-hover:text-red-400 transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>

                      {/* Read More Link */}
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-red-500 hover:text-red-400 font-semibold text-sm transition-colors group-hover:translate-x-1 transform duration-300"
                      >
                        Read more
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </GlareHover>
                </article>
              ))}
            </div>
          )}
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
                Get in touch with our team to discuss your next project and see how we can help you succeed.
              </p>
              <div className="animate-slide-up animation-delay-300">
                <Link 
                  href="/contact" 
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg inline-flex items-center transition-all duration-300 font-bold text-lg hover:scale-105 hover:shadow-lg hover:shadow-red-600/30"
                >
                  Start your project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
} 