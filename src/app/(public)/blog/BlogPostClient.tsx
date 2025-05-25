"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Facebook, Twitter, Linkedin, Copy, Check, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// RelatedPosts component
const RelatedPosts = ({ currentPostId, category, blogPosts }: { currentPostId: string, category: string, blogPosts: any[] }) => {
  const related = blogPosts.filter(post => post.id !== currentPostId && post.category === category).slice(0, 3);
  if (related.length === 0) return null;
  return (
    <div className="mt-16 border-t border-gray-800/50 pt-12">
      <h3 className="text-2xl font-bold mb-8 text-white">Related Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map(post => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="group block transform transition-all duration-500 hover:-translate-y-1">
            <article className="bg-gray-900/30 border border-gray-800/50 rounded-xl overflow-hidden hover:border-red-600/50 transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(0,0,0,0.3)]">
              <div className="relative h-40 overflow-hidden">
                <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="inline-block px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full border border-gray-700/50">{post.category}</span>
                </div>
              </div>
              <div className="p-5">
                <h4 className="text-lg font-bold mb-2 text-white group-hover:text-red-500 transition-colors line-clamp-2">{post.title}</h4>
                <p className="text-gray-400 text-sm line-clamp-2">{post.excerpt}</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};

// SocialShare component
const SocialShare = ({ url, title }: { url: string, title: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-gray-400">Share:</span>
      <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/70 text-gray-300 hover:bg-blue-600 hover:text-white transition-colors" aria-label="Share on Twitter"><Twitter size={16} /></a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/70 text-gray-300 hover:bg-blue-600 hover:text-white transition-colors" aria-label="Share on Facebook"><Facebook size={16} /></a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/70 text-gray-300 hover:bg-blue-600 hover:text-white transition-colors" aria-label="Share on LinkedIn"><Linkedin size={16} /></a>
      <button onClick={handleCopyLink} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/70 text-gray-300 hover:bg-red-600 hover:text-white transition-colors" aria-label="Copy Link">{copied ? <Check size={16} /> : <Copy size={16} />}</button>
    </div>
  );
};

export default function BlogPostClient({ post, blogPosts }: { post: any, blogPosts?: any[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  if (!post) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-gray-400 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link href="/blog">
            <Button className="bg-red-600 hover:bg-red-700 text-white">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }
  const postUrl = typeof window !== "undefined" ? window.location.href : "";
  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      {/* Background elements - absolute positioned */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,40,40,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,40,40,0.03)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
        <div className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-red-600/5 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-red-600/10 blur-3xl animate-pulse-slow animation-delay-1000"></div>
      </div>
      {/* Article Header */}
      <header className="relative mb-16">
        <div className="absolute inset-0 h-[50vh] sm:h-[60vh] overflow-hidden">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        </div>
        <div className="relative pt-16 sm:pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-3xl">
            <Link href="/blog" className="inline-flex items-center text-gray-400 hover:text-white mb-8 group transition-colors border border-gray-800/50 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />Back to Blog
            </Link>
            <div className="animate-fade-in animation-delay-300">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-red-600/90 backdrop-blur-sm text-white text-sm rounded-full">{post.category}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-8">{post.title}</h1>
              <div className="flex flex-wrap items-center text-gray-300 mb-8 gap-y-4">
                <div className="flex items-center mr-8">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 border-2 border-red-500/50">
                    <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-medium">{post.author.name}</div>
                    <div className="text-sm text-gray-400">{post.author.role}</div>
                  </div>
                </div>
                <div className="flex items-center mr-8">
                  <Calendar className="h-5 w-5 mr-2 text-red-500" />
                  <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Article Content */}
      <article className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 animate-fade-in animation-delay-500">
            <div className="prose prose-lg prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} className="prose-headings:text-white prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-red-500 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-strong:font-semibold prose-ul:text-gray-300 prose-li:my-1 prose-img:rounded-lg prose-h2:border-b prose-h2:border-gray-800/50 prose-h2:pb-2" />
            </div>
            {/* Tags */}
            <div className="mt-12 border-t border-gray-800/50 pt-8">
              <div className="flex flex-wrap gap-2">
                <span className="text-gray-400 mr-2">Tags:</span>
                <span className="px-3 py-1 bg-gray-800/70 text-gray-300 rounded-md text-sm">Digital Marketing</span>
                <span className="px-3 py-1 bg-gray-800/70 text-gray-300 rounded-md text-sm">Strategy</span>
                <span className="px-3 py-1 bg-gray-800/70 text-gray-300 rounded-md text-sm">Business</span>
              </div>
            </div>
            {/* Share */}
            <div className="mt-8 flex justify-end">
              <SocialShare url={postUrl} title={post.title} />
            </div>
            {/* Author Bio */}
            <div className="mt-12 border-t border-gray-800/50 pt-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gray-900/30 border border-gray-800/50 rounded-xl p-6">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 border-red-500/30">
                  <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold text-white mb-2">About {post.author.name}</h3>
                  <p className="text-gray-400 mb-4">{post.author.role} at Torch Group with expertise in digital strategies and content creation. Passionate about helping businesses grow their online presence.</p>
                  <div className="flex justify-center sm:justify-start space-x-3">
                    <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/70 text-gray-300 hover:bg-blue-600 hover:text-white transition-colors"><Twitter size={16} /></a>
                    <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/70 text-gray-300 hover:bg-blue-600 hover:text-white transition-colors"><Linkedin size={16} /></a>
                  </div>
                </div>
              </div>
            </div>
            {/* Related Posts */}
            {blogPosts && <RelatedPosts currentPostId={post.id} category={post.category} blogPosts={blogPosts} />}
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-4 animate-fade-in animation-delay-700">
            <div className="lg:sticky lg:top-32 space-y-8">
              {/* Table of Contents */}
              <div className="bg-gray-900/30 border border-gray-800/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Table of Contents</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="pl-4 border-l-2 border-red-500"><a href="#" className="hover:text-red-500 transition-colors">Introduction</a></li>
                  <li className="pl-4 border-l-2 border-gray-700 hover:border-red-500"><a href="#" className="hover:text-red-500 transition-colors">First Major Section</a></li>
                  <li className="pl-4 border-l-2 border-gray-700 hover:border-red-500"><a href="#" className="hover:text-red-500 transition-colors">Second Major Section</a></li>
                  <li className="pl-4 border-l-2 border-gray-700 hover:border-red-500"><a href="#" className="hover:text-red-500 transition-colors">Third Major Section</a></li>
                  <li className="pl-4 border-l-2 border-gray-700 hover:border-red-500"><a href="#" className="hover:text-red-500 transition-colors">Conclusion</a></li>
                </ul>
              </div>
              {/* Newsletter Signup */}
              <div className="bg-gray-900/30 border border-gray-800/50 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-tl from-red-600/20 to-transparent rounded-full blur-xl"></div>
                <h3 className="text-xl font-bold text-white mb-3">Subscribe to Our Newsletter</h3>
                <p className="text-gray-400 text-sm mb-4">Get the latest articles and insights delivered to your inbox.</p>
                <div className="space-y-3">
                  <input type="email" placeholder="Your email address" className="w-full bg-gray-800/50 border border-gray-700/50 rounded-md py-2 px-3 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500/20" />
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-medium transition-colors relative overflow-hidden group">
                    <span className="relative z-10">Subscribe</span>
                    <span className="absolute inset-0 h-full w-[40%] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000"></span>
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-3 text-center">No spam, unsubscribe at any time</p>
              </div>
              {/* Popular Posts */}
              <div className="bg-gray-900/30 border border-gray-800/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Popular Posts</h3>
                <div className="space-y-4">
                  {blogPosts && blogPosts.slice(0, 3).map(popularPost => (
                    <Link key={popularPost.id} href={`/blog/${popularPost.slug}`} className="group flex items-start gap-3">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image src={popularPost.coverImage} alt={popularPost.title} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white group-hover:text-red-500 transition-colors line-clamp-2">{popularPost.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{new Date(popularPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              {/* Categories */}
              <div className="bg-gray-900/30 border border-gray-800/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  <Link href="/blog?category=Marketing" className="px-3 py-1 bg-gray-800/70 text-gray-300 hover:bg-red-600/80 hover:text-white rounded-md text-sm transition-colors">Marketing</Link>
                  <Link href="/blog?category=Technology" className="px-3 py-1 bg-gray-800/70 text-gray-300 hover:bg-red-600/80 hover:text-white rounded-md text-sm transition-colors">Technology</Link>
                  <Link href="/blog?category=Branding" className="px-3 py-1 bg-gray-800/70 text-gray-300 hover:bg-red-600/80 hover:text-white rounded-md text-sm transition-colors">Branding</Link>
                  <Link href="/blog?category=E-commerce" className="px-3 py-1 bg-gray-800/70 text-gray-300 hover:bg-red-600/80 hover:text-white rounded-md text-sm transition-colors">E-commerce</Link>
                  <Link href="/blog?category=Social-Media" className="px-3 py-1 bg-gray-800/70 text-gray-300 hover:bg-red-600/80 hover:text-white rounded-md text-sm transition-colors">Social Media</Link>
                  <Link href="/blog?category=SEO" className="px-3 py-1 bg-gray-800/70 text-gray-300 hover:bg-red-600/80 hover:text-white rounded-md text-sm transition-colors">SEO</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
} 