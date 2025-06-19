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
        <section className="relative py-16 lg:py-20 bg-transparent border-b border-gray-800/50 overflow-hidden">
          {/* Removed conflicting background elements */}
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="text-red-500 font-semibold uppercase tracking-wider mb-4 flex items-center justify-center gap-4">
                <span className="h-px bg-red-500 w-8"></span>
                <span>INSIGHTS AND INSPIRATION</span>
                <span className="h-px bg-red-500 w-8"></span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
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
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen pt-0 pb-20 relative overflow-x-hidden">
        {/* Animated grid background to match homepage */}
        <SharedTorchBackground />
        <section className="relative py-16 lg:py-20 bg-transparent border-b border-gray-800/50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
                Torch <span className="text-red-500 relative inline-block">Blog</span>
              </h1>
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
        </section>
      </div>
    );
  }

  // If no posts found
  if (filteredPosts.length === 0) {
    return (
      <div className="min-h-screen pt-0 pb-20 relative overflow-x-hidden">
        {/* Animated grid background to match homepage */}
        <SharedTorchBackground />
        {/* Hero Section */}
        <section className="relative py-16 lg:py-20 bg-transparent border-b border-gray-800/50 overflow-hidden">
          {/* Removed conflicting background elements */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-red-600/10 blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-red-600/5 blur-3xl animate-pulse-slow animation-delay-1000"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="text-red-500 font-semibold uppercase tracking-wider mb-4 flex items-center justify-center gap-4 animate-fade-in animation-delay-300">
                <span className="h-px bg-red-500 w-8"></span>
                <span>INSIGHTS AND INSPIRATION</span>
                <span className="h-px bg-red-500 w-8"></span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white animate-fade-in animation-delay-500">
                Torch <span className="text-red-500 relative inline-block">
                  Blog
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-red-500 animate-[glow_2s_ease-in-out_infinite_alternate]"></span>
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-10 animate-fade-in animation-delay-700">
                Discover the latest insights, creative content, talent spotlights, and industry news from the creative world
              </p>
              <p className="text-xl text-gray-300 mt-8">No blog posts found matching your criteria.</p>
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
    );
  }

  // Featured post
  const [featuredPost, ...restPosts] = filteredPosts;

  return (
    <div className="min-h-screen pt-0 pb-20 relative overflow-x-hidden">
      {/* Animated grid background to match homepage */}
      <SharedTorchBackground />
      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 bg-transparent border-b border-gray-800/50 overflow-hidden">
        {/* Removed conflicting background elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-red-600/10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-red-600/5 blur-3xl animate-pulse-slow animation-delay-1000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="text-red-500 font-semibold uppercase tracking-wider mb-4 flex items-center justify-center gap-4 animate-fade-in animation-delay-300">
              <span className="h-px bg-red-500 w-8"></span>
              <span>INSIGHTS AND INSPIRATION</span>
              <span className="h-px bg-red-500 w-8"></span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white animate-fade-in animation-delay-500">
              Torch <span className="text-red-500 relative inline-block">
                Blog
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-red-500 animate-[glow_2s_ease-in-out_infinite_alternate]"></span>
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 animate-fade-in animation-delay-700">
              Discover strategies, insights, and expert advice to help your business thrive in the digital world
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto animate-fade-in animation-delay-900">
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10 pr-4 py-6 rounded-lg border border-gray-700/50 bg-black shadow-[0_0_15px_rgba(0,0,0,0.5)] text-white placeholder:text-gray-400 focus:border-red-600 focus:ring-red-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              {searchQuery && (
                <Button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 h-8 w-8 p-0 rounded-full"
                  onClick={() => setSearchQuery("")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </Button>
              )}
            </div>
          </div>

          {/* Featured Post */}
          {!searchQuery && selectedCategory === "All" && (
            <div className="mt-16 animate-fade-in animation-delay-1000">
              <Link href={`/blog/${featuredPost.slug}`} className="group block">
                <GlareHover glareColor="#fff" glareOpacity={0.18} glareAngle={-30} glareSize={200} transitionDuration={700} style={{ borderRadius: "1rem", background: "transparent" }}>
                  <div className="grid md:grid-cols-2 gap-8 bg-gray-900/30 border border-gray-800/50 rounded-xl overflow-hidden hover:border-red-500/50 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(0,0,0,0.7)]">
                    <div className="relative h-64 md:h-full overflow-hidden">
                      <Image
                        src={featuredPost.coverImage || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGJsb2clMjBwbGFjZWhvbGRlcnxlbnwwfHwwfHw%3D"}
                        alt={featuredPost.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-semibold uppercase tracking-wider rounded-full">
                          Featured
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <span className="inline-block px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full border border-gray-700/50">
                          {(featuredPost as any).category || "General"}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center text-sm text-gray-400 mb-4">
                        <div className="flex items-center mr-4">
                          <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2 border border-gray-700/50">
                            <Image
                              src={getAuthorImage(featuredPost.author)}
                              alt={featuredPost.author?.name || "Author"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span>{featuredPost.author?.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {formatDate(featuredPost.publishedAt)}
                          </span>
                        </div>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-red-500 transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-gray-300 text-base mb-6">
                        {featuredPost.excerpt}
                      </p>
                      <div className="mt-auto">
                        <span className="inline-flex items-center text-red-500 font-medium group/link">
                          Read Article 
                          <ArrowRight className="ml-2 h-4 w-4 transform group-hover/link:translate-x-2 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </GlareHover>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <Tabs defaultValue="All" value={selectedCategory} onValueChange={setSelectedCategory} className="mb-12">
            <div className="flex justify-center">
              <TabsList className="bg-gray-900/30 border border-gray-800/50 p-1 rounded-lg backdrop-blur-sm">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="px-4 py-2 rounded-md data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_10px_rgba(220,38,38,0.3)] data-[state=active]:font-medium"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {/* Content for all tabs */}
            <TabsContent value={selectedCategory} className="mt-12">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-20 bg-gray-900/20 border border-gray-800/50 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-7.43 2.52c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
                  </svg>
                  <p className="text-gray-400 text-lg">No posts found matching your criteria.</p>
                  <p className="text-gray-500 mt-2">Try adjusting your search or category filter.</p>
                  <Button 
                    onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}
                    className="mt-6 bg-red-600 hover:bg-red-700 text-white rounded-full px-6"
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(selectedCategory === "All" && !searchQuery ? restPosts : filteredPosts).map((post, index) => (
                      <Link href={`/blog/${post.slug}`} key={post.id} className="group block transform transition-all duration-500 hover:-translate-y-1">
                        <GlareHover glareColor="#fff" glareOpacity={0.13} glareAngle={-30} glareSize={180} transitionDuration={700} style={{ borderRadius: "1rem", background: "transparent" }}>
                          <article className="bg-gray-900/30 border border-gray-800/50 rounded-xl overflow-hidden hover:border-red-600/50 transition-all duration-300 h-full flex flex-col group-hover:shadow-[0_0_25px_rgba(0,0,0,0.3)]">
                            {/* Featured Image */}
                            <div className="relative h-52 overflow-hidden">
                              <Image
                                src={post.coverImage || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGJsb2clMjBwbGFjZWhvbGRlcnxlbnwwfHwwfHw%3D"}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                              <div className="absolute bottom-4 left-4">
                                <span className="inline-block px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full border border-gray-700/50">
                                  {(post as any).category || "General"}
                                </span>
                              </div>
                            </div>
                            {/* Content */}
                            <div className="p-6 flex-grow flex flex-col">
                              <h2 className="text-xl font-bold mb-3 text-white group-hover:text-red-500 transition-colors line-clamp-2">
                                {post.title}
                              </h2>
                              <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                                {post.excerpt}
                              </p>
                              {/* Meta Info */}
                              <div className="mt-auto">
                                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-800/30">
                                  <div className="flex items-center">
                                    <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2 border border-gray-700/50">
                                      <Image
                                        src={getAuthorImage(post.author)}
                                        alt={post.author?.name || "Author"}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <span>{post.author?.name}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>{formatDate(post.publishedAt)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </article>
                        </GlareHover>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
          
          {/* Pagination - For future implementation */}
          {filteredPosts.length > 0 && (
            <div className="flex justify-center mt-16">
              <div className="inline-flex rounded-md shadow-sm bg-gray-900/30 border border-gray-800/50 p-1">
                <Button variant="ghost" className="rounded-l-md border-0 text-gray-400 hover:bg-orange-500/20 hover:text-white hover:shadow-[0_0_10px_rgba(255,87,34,0.3)] transition-all duration-300">
                  Previous
                </Button>
                <Button className="rounded-none border-0 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-[0_0_15px_rgba(255,87,34,0.3)] transition-all duration-300">
                  1
                </Button>
                <Button variant="ghost" className="rounded-none border-0 text-gray-400 hover:bg-orange-500/20 hover:text-white hover:shadow-[0_0_10px_rgba(255,87,34,0.3)] transition-all duration-300">
                  2
                </Button>
                <Button variant="ghost" className="rounded-none border-0 text-gray-400 hover:bg-orange-500/20 hover:text-white hover:shadow-[0_0_10px_rgba(255,87,34,0.3)] transition-all duration-300">
                  3
                </Button>
                <Button variant="ghost" className="rounded-r-md border-0 text-gray-400 hover:bg-orange-500/20 hover:text-white hover:shadow-[0_0_10px_rgba(255,87,34,0.3)] transition-all duration-300">
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 