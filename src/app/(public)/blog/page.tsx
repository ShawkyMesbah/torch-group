"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, Calendar, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogPost } from "@/generated/prisma";
import { SharedTorchBackground } from "@/components/ui/animated-grid-background";
import { GlareHover } from "@/components/animations";
import { useTiltEffect } from "@/hooks/useTiltEffect";
import Head from "next/head";

// Interface for blog posts with author information
interface BlogPostWithAuthor extends BlogPost {
  author?: {
    name: string | null;
    image?: string | null;
  };
  category?: string | null;
  featuredImage?: string | null;
}

// Default categories for filtering - Updated with new content structure
const categories = [
  "All",
  "Latest Insights",
  "Creative Content", 
  "Top Talents List",
  "Creative Broken Records",
  "Talents News",
  "Creative Entities News"
];

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

  // Tilt effect refs for blog cards
  const blogTiltRefs = filteredPosts.map(() => useTiltEffect({ max: 8, scale: 1.03 }));

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
      <>
        {/* Enhanced SEO Meta Tags */}
        <Head>
          <title>Torch Group Blog - Creative Insights & Digital Innovation Stories | Latest Updates</title>
          <meta name="description" content="Discover the latest insights, creative content, talent spotlights, and industry news from Torch Group. Stay updated with digital innovation trends and creative industry developments." />
          <meta name="keywords" content="torch group blog, creative insights, digital innovation, talent news, creative industry, digital marketing blog, creative content, industry trends" />
          <meta property="og:title" content="Torch Group Blog - Creative Insights & Digital Innovation Stories" />
          <meta property="og:description" content="Discover the latest insights, creative content, talent spotlights, and industry news from Torch Group." />
          <meta property="og:type" content="blog" />
          <meta property="twitter:title" content="Torch Group Blog - Creative Insights & Digital Innovation Stories" />
          <meta property="twitter:description" content="Discover the latest insights, creative content, talent spotlights, and industry news from Torch Group." />
        </Head>

      <div className="min-h-screen pt-0 pb-20 relative overflow-x-hidden">
        {/* Animated grid background to match homepage */}
        <SharedTorchBackground />
        {/* Hero Section with loading state */}
        <section className="torch-section-standard relative bg-transparent border-b border-gray-800/50 overflow-hidden">
          <div className="torch-container-wide mx-auto relative z-10">
            <div className="torch-container-content mx-auto text-center mb-grand">
              <div className="text-red-500 font-semibold uppercase tracking-wider mb-8 flex items-center justify-center gap-x-4 gap-y-2 flex-wrap">
                <span className="h-px bg-red-500 w-8"></span>
                <span>INSIGHTS AND INSPIRATION</span>
                <span className="h-px bg-red-500 w-8"></span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 text-white">
                Torch <span className="text-red-500 relative inline-block">
                  Blog
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-red-500"></span>
                </span>
              </h1>
              <div className="flex justify-center items-center mt-12">
                <Loader2 className="h-8 w-8 text-red-500 animate-spin mr-3" />
                <p className="text-xl text-gray-300">Loading blog posts...</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        {/* Enhanced SEO Meta Tags */}
        <Head>
          <title>Torch Group Blog - Error Loading Content</title>
          <meta name="description" content="There was an error loading the Torch Group blog content. Please try again later." />
        </Head>

      <div className="min-h-screen pt-0 pb-20 relative overflow-x-hidden">
        {/* Animated grid background to match homepage */}
        <SharedTorchBackground />
        <section className="torch-section-standard relative bg-transparent border-b border-gray-800/50 overflow-hidden">
          <div className="torch-container-wide mx-auto relative z-10">
            <div className="torch-container-content mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 text-white">
                Torch <span className="text-red-500 relative inline-block">Blog</span>
              </h1>
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 mt-8">
                <p className="text-red-500 text-lg mb-4">Error loading blog posts</p>
                <p className="text-gray-300 mb-6 text-base sm:text-lg md:text-xl">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-red-600 hover:bg-red-700 min-h-10 px-4 py-2"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      </>
    );
  }

  // If no posts found
  if (filteredPosts.length === 0) {
    return (
      <>
        {/* Enhanced SEO Meta Tags */}
        <Head>
          <title>Torch Group Blog - No Posts Found | Creative Insights & Digital Innovation</title>
          <meta name="description" content="No blog posts found matching your search criteria. Explore Torch Group's insights on creative content, digital innovation, and industry trends." />
        </Head>

      <div className="min-h-screen pt-0 pb-20 relative overflow-x-hidden">
          {/* Animated grid background to match homepage */}
          <SharedTorchBackground />
          {/* Hero Section */}
          <section className="torch-section-standard relative bg-transparent border-b border-gray-800/50 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-red-600/10 blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-red-600/5 blur-3xl animate-pulse-slow animation-delay-1000"></div>
            
            <div className="torch-container-wide mx-auto relative z-10">
              <div className="torch-container-content mx-auto text-center mb-grand">
                <div className="text-red-500 font-semibold uppercase tracking-wider mb-8 flex items-center justify-center gap-x-4 gap-y-2 flex-wrap animate-fade-in animation-delay-300 overflow-x-auto">
                  <span className="h-px bg-red-500 w-8"></span>
                  <span>INSIGHTS AND INSPIRATION</span>
                  <span className="h-px bg-red-500 w-8"></span>
                </div>
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 text-white animate-fade-in animation-delay-500 tracking-tight group cursor-default"
                  whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" }
                  } : {}}
                >
                  <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    Torch
                  </span>{" "}
                  <span className="text-red-500 relative inline-block group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)]">
                    Blog
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-full transition-all duration-500 ease-out"></span>
                  </span>
                </motion.h1>
                <p className="text-xl text-gray-300 mb-10 animate-fade-in animation-delay-700 text-base sm:text-lg md:text-xl">
                  Discover the latest insights, creative content, talent spotlights, and industry news from the creative world
                </p>
                <p className="text-xl text-gray-300 mt-8 text-base sm:text-lg md:text-xl">No blog posts found matching your criteria.</p>
                {searchQuery && (
                  <Button 
                    onClick={() => setSearchQuery("")}
                    className="mt-4 bg-red-600 hover:bg-red-700"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Enhanced SEO Meta Tags */}
      <Head>
        <title>Torch Group Blog - Creative Insights & Digital Innovation Stories | Latest Updates</title>
        <meta name="description" content="Discover the latest insights, creative content, talent spotlights, and industry news from Torch Group. Stay updated with digital innovation trends and creative industry developments." />
        <meta name="keywords" content="torch group blog, creative insights, digital innovation, talent news, creative industry, digital marketing blog, creative content, industry trends" />
        <meta property="og:title" content="Torch Group Blog - Creative Insights & Digital Innovation Stories" />
        <meta property="og:description" content="Discover the latest insights, creative content, talent spotlights, and industry news from Torch Group." />
        <meta property="og:type" content="blog" />
        <meta property="twitter:title" content="Torch Group Blog - Creative Insights & Digital Innovation Stories" />
        <meta property="twitter:description" content="Discover the latest insights, creative content, talent spotlights, and industry news from Torch Group." />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "Torch Group Blog",
              "description": "Creative insights, digital innovation stories, and industry news from Torch Group",
              "url": "https://torchgroup.com/blog",
              "publisher": {
                "@type": "Organization",
                "name": "Torch Group",
                "logo": "https://torchgroup.com/images/logo.png"
              },
              "blogPost": filteredPosts.slice(0, 10).map(post => ({
                "@type": "BlogPosting",
                "headline": post.title,
                "description": post.excerpt,
                "datePublished": post.createdAt,
                "author": {
                  "@type": "Person",
                  "name": post.author?.name || "Torch Group"
                }
              }))
            })
          }}
        />
      </Head>

      <main className="min-h-screen pt-20 md:pt-24 pb-20 relative overflow-x-hidden">
        {/* Accessibility: Landmark regions */}
        <div className="sr-only">
          <h1>Torch Group Blog - Creative Insights & Digital Innovation Stories</h1>
          <nav aria-label="Page sections">
            <ul>
              <li><a href="#hero">Blog Introduction</a></li>
              <li><a href="#search-filters">Search and Filters</a></li>
              <li><a href="#blog-posts">Blog Posts</a></li>
            </ul>
          </nav>
        </div>

        {/* Animated grid background to match homepage */}
        <SharedTorchBackground />
        
        {/* Hero Section */}
        <section className="torch-section-standard relative bg-transparent pt-8 md:pt-12 border-b border-gray-800/50 overflow-hidden" id="hero">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-red-600/10 blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-red-600/5 blur-3xl animate-pulse-slow animation-delay-1000"></div>
          
          <div className="torch-container-wide mx-auto relative z-10">
            <div className="torch-container-content mx-auto text-center mb-grand">
              <div className="text-red-500 font-semibold uppercase tracking-wider mb-8 flex items-center justify-center gap-x-4 gap-y-2 flex-wrap animate-fade-in animation-delay-300 overflow-x-auto">
                <span className="h-px bg-red-500 w-8"></span>
                <span>INSIGHTS AND INSPIRATION</span>
                <span className="h-px bg-red-500 w-8"></span>
              </div>
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 text-white animate-fade-in animation-delay-500 tracking-tight group cursor-default"
                whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                } : {}}
              >
                <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                  Torch
                </span>{" "}
                <span className="text-red-500 relative inline-block group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)]">
                  Blog
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-full transition-all duration-500 ease-out"></span>
                </span>
              </motion.h1>
              <p className="text-xl text-gray-300 mb-10 animate-fade-in animation-delay-700 text-base sm:text-lg md:text-xl">
                Discover the latest insights, creative content, talent spotlights, and industry news from the creative world
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="torch-section-comfortable bg-transparent relative" id="search-filters">
          <div className="torch-container-wide mx-auto">
            <div className="bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-lg p-6 md:p-8 rounded-3xl border border-gray-800">
              <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search Bar */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                    placeholder="Search articles, topics, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-black/40 border-gray-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
                    aria-label="Search blog posts"
                  />
                </div>
                
                {/* Category Filter */}
                <div className="w-full lg:w-auto">
                  <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 bg-black/40 border border-gray-700">
                      {categories.map((category) => (
                        <TabsTrigger 
                          key={category} 
                          value={category}
                          className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 text-xs lg:text-sm"
                        >
                          {category}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              
              {/* Results count */}
              <div className="mt-4 text-sm text-gray-400">
                {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="torch-section-standard bg-transparent relative" id="blog-posts">
          <div className="torch-container-wide mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-generous lg:gap-grand">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  ref={blogTiltRefs[index]}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index % 3) }}
                  className="group relative overflow-hidden rounded-3xl backdrop-blur-lg shadow-2xl transition-all duration-500 animate-fade-in flex flex-col min-h-[400px] border-2 border-red-900/30 bg-gradient-to-br from-black/90 via-red-950/20 to-black/90 hover:border-red-600 hover:shadow-red-900/40 hover:shadow-2xl min-h-10 px-4 py-2"
                  style={{ 
                    animationDelay: `${index * 0.08 + 0.1}s`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Featured Image */}
                  {post.featuredImage && (
                    <div className="relative h-48 overflow-hidden rounded-t-2xl">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col">
                    {/* Category & Date */}
                    <div className="flex items-center justify-between mb-3 text-sm">
                      {post.category && (
                        <span className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                      )}
                      <div className="flex items-center text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        <time dateTime={post.createdAt.toString()}>
                          {formatDate(post.createdAt)}
                        </time>
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-red-400 transition-colors">
                      {post.title}
                    </h2>
                    
                    {/* Excerpt */}
                    <p className="text-gray-300 text-sm leading-relaxed mb-comfortable line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    
                    {/* Author & Read More */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center mr-3">
                          {post.author?.image ? (
                            <Image
                              src={getAuthorImage(post.author)}
                              alt={post.author?.name || 'Author'}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          ) : (
                            <User className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                        <span className="text-sm text-gray-400">
                          {post.author?.name || 'Torch Group'}
                        </span>
                      </div>
                      
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-red-400 hover:text-red-300 transition-colors text-sm font-medium group/link"
                        aria-label={`Read article: ${post.title}`}
                      >
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
        </div>
      </section>

        {/* Newsletter CTA */}
        <section className="torch-section-standard bg-transparent relative">
          <div className="torch-container-content mx-auto text-center">
            <div className="p-8 md:p-12 bg-gradient-to-br from-red-600/20 via-red-500/10 to-red-700/20 backdrop-blur-xl rounded-3xl border border-red-600/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-red-500/10 to-red-600/5 animate-pulse-slow"></div>
              
              <div className="relative z-10">
                <motion.h2 
                  className="text-2xl md:text-3xl font-bold mb-comfortable text-white tracking-tight group cursor-default"
                  whileHover={!isOlderDevice && !prefersReducedMotion ? { 
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" }
                  } : {}}
                >
                  <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    Stay Updated with
                  </span>{" "}
                  <span className="torch-text-accent relative group-hover:drop-shadow-[0_0_25px_rgba(220,38,38,0.8)]">
                    Torch Insights
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-full transition-all duration-500 ease-out"></span>
                  </span>
                </motion.h2>
                <p className="text-gray-300 mb-generous max-w-2xl mx-auto">
                  Get the latest insights, creative content, and industry news delivered directly to your inbox. 
                  Join our community of creative professionals and digital innovators.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <Link
                    href="/contact"
                    className="torch-bg-primary hover:torch-bg-primary-hover text-white px-8 py-3 text-lg font-bold rounded-full inline-flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    aria-label="Contact us to subscribe to newsletter"
                  >
                    Subscribe to Newsletter
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/services"
                    className="border-2 border-red-500/50 hover:border-red-400 text-white px-8 py-3 text-lg font-bold rounded-full inline-flex items-center transition-colors hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    aria-label="View our services"
                  >
                    Explore Our Services
                  </Link>
                </div>
              </div>
            </div>
        </div>
      </section>
      </main>
    </>
  );
} 