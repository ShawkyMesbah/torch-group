"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  FilePlus,
  Search, 
  Pencil, 
  Trash, 
  Filter, 
  Eye, 
  MoreHorizontal, 
  RefreshCw, 
  Check, 
  X,
  FileText,
  Calendar, 
  BarChart, 
  ArrowUpDown,
  ExternalLink,
  Globe 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Post Types
type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: PostStatus;
  publishedAt?: string;
  updatedAt?: string;
  createdAt: string;
  author: string;
  views?: number;
  excerpt: string;
  tags: string[];
}

// Sample data for demonstration
const samplePosts: Post[] = [
  {
    id: "1",
    title: "Getting Started with Torch Group",
    slug: "getting-started-with-torch-group",
    status: "PUBLISHED",
    publishedAt: "2023-05-15T08:00:00Z",
    updatedAt: "2023-05-15T08:00:00Z",
    createdAt: "2023-05-14T14:30:00Z",
    author: "Admin User",
    views: 1240,
    excerpt: "Learn how to get started with Torch Group's services and offerings.",
    tags: ["guide", "introduction"]
  },
  {
    id: "2",
    title: "New Features Coming Soon",
    slug: "new-features-coming-soon",
    status: "PUBLISHED",
    publishedAt: "2023-04-20T10:15:00Z",
    updatedAt: "2023-04-22T09:30:00Z",
    createdAt: "2023-04-18T16:45:00Z",
    author: "Marketing Team",
    views: 856,
    excerpt: "Exciting new features coming to our platform in the next update.",
    tags: ["updates", "features"]
  },
  {
    id: "3",
    title: "Draft Blog Post",
    slug: "draft-blog-post",
    status: "DRAFT",
    createdAt: "2023-05-20T12:00:00Z",
    updatedAt: "2023-05-20T14:30:00Z",
    author: "Content Writer",
    excerpt: "This is a draft post that is still being worked on.",
    tags: ["draft"]
  },
  {
    id: "4",
    title: "Archived Content",
    slug: "archived-content",
    status: "ARCHIVED",
    publishedAt: "2023-01-10T09:00:00Z",
    updatedAt: "2023-03-15T11:20:00Z",
    createdAt: "2023-01-05T15:30:00Z",
    author: "Former Employee",
    views: 320,
    excerpt: "This content has been archived and is no longer relevant.",
    tags: ["archived"]
  },
  {
    id: "5",
    title: "How to Optimize Your Website",
    slug: "how-to-optimize-your-website",
    status: "PUBLISHED",
    publishedAt: "2023-05-01T13:45:00Z",
    updatedAt: "2023-05-01T13:45:00Z",
    createdAt: "2023-04-28T10:15:00Z",
    author: "SEO Specialist",
    views: 945,
    excerpt: "Tips and tricks to optimize your website for better performance and SEO.",
    tags: ["seo", "website", "optimization"]
  }
];

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(samplePosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof Post>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();
  
  // Filter and sort posts when dependencies change
  useEffect(() => {
    let result = [...posts];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter(post => post.status === statusFilter);
    }
    
    // Sort posts
    result.sort((a, b) => {
      // Handle undefined dates by treating them as oldest
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
      
      // Default case
      return 0;
    });
    
    setFilteredPosts(result);
  }, [posts, searchQuery, statusFilter, sortField, sortDirection]);
  
  // Handle sorting
  const handleSort = (field: keyof Post) => {
    setSortField(field);
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  // Delete a post
  const handleDeletePost = async () => {
    if (!selectedPost) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove post from state
      setPosts(prev => prev.filter(post => post.id !== selectedPost.id));
      
      toast({
        title: "Post deleted",
        description: `"${selectedPost.title}" has been deleted.`,
      });
      
      setShowDeleteDialog(false);
      setSelectedPost(null);
    } catch (error) {
      console.error("Error deleting post:", error);
      
      toast({
        title: "Delete failed",
        description: "There was an error deleting the post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Change post status
  const handleChangeStatus = async (post: Post, newStatus: PostStatus) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update post in state
      setPosts(prev => prev.map(p => 
        p.id === post.id 
          ? { 
              ...p, 
              status: newStatus,
              updatedAt: new Date().toISOString(),
              ...(newStatus === 'PUBLISHED' && !p.publishedAt ? { publishedAt: new Date().toISOString() } : {})
            } 
          : p
      ));
      
      toast({
        title: "Status updated",
        description: `The post status has been changed to ${newStatus.toLowerCase()}.`,
      });
    } catch (error) {
      console.error("Error updating post status:", error);
      
      toast({
        title: "Update failed",
        description: "There was an error updating the post status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // View post analytics
  const handleViewAnalytics = (post: Post) => {
    toast({
      title: "Analytics",
      description: `Viewing analytics for "${post.title}" would open a dedicated analytics view.`,
    });
  };
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get status badge variant
  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge variant="success">Published</Badge>;
      case "DRAFT":
        return <Badge variant="secondary">Draft</Badge>;
      case "ARCHIVED":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return null;
    }
  };
  
  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortField("updatedAt");
    setSortDirection("desc");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Blog Management</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Create, edit, and manage your blog posts
          </p>
        </div>
        
        <Link href="/dashboard/blog/new" passHref>
          <Button>
            <FilePlus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Drafts</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={clearFilters}
              disabled={!searchQuery && statusFilter === "all" && sortField === "updatedAt" && sortDirection === "desc"}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Posts Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Blog Posts</CardTitle>
            <CardDescription>
              {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"} found
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No posts found</h3>
              <p className="text-gray-500 max-w-md mx-auto mt-2">
                {searchQuery || statusFilter !== "all" 
                  ? "Try changing your search terms or filters."
                  : "Start creating your first blog post by clicking the 'New Post' button."}
              </p>
              {(searchQuery || statusFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort('title')}
                      >
                        Title
                        {sortField === 'title' && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort('updatedAt')}
                      >
                        Last Updated
                        {sortField === 'updatedAt' && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort('views')}
                      >
                        Views
                        {sortField === 'views' && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-sm text-gray-500 truncate">{post.excerpt}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(post.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          <span>{formatDate(post.updatedAt || post.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {post.views !== undefined ? post.views.toLocaleString() : "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/blog/edit/${post.id}`)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              onClick={() => {
                                // In a real app, this would navigate to the post
                                toast({
                                  title: "Preview",
                                  description: "Viewing post preview.",
                                });
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            
                            {post.status === "PUBLISHED" && (
                              <DropdownMenuItem 
                                onClick={() => {
                                  // In a real app, this would open in a new tab
                                  toast({
                                    title: "View Live",
                                    description: "Opening published post in new tab.",
                                  });
                                }}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Live
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuItem onClick={() => handleViewAnalytics(post)}>
                              <BarChart className="h-4 w-4 mr-2" />
                              Analytics
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            
                            {post.status !== "PUBLISHED" && (
                              <DropdownMenuItem onClick={() => handleChangeStatus(post, "PUBLISHED")}>
                                <Globe className="h-4 w-4 mr-2 text-green-500" />
                                Publish
                              </DropdownMenuItem>
                            )}
                            
                            {post.status !== "DRAFT" && (
                              <DropdownMenuItem onClick={() => handleChangeStatus(post, "DRAFT")}>
                                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                                Move to Draft
                              </DropdownMenuItem>
                            )}
                            
                            {post.status !== "ARCHIVED" && (
                              <DropdownMenuItem onClick={() => handleChangeStatus(post, "ARCHIVED")}>
                                <X className="h-4 w-4 mr-2 text-gray-500" />
                                Archive
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-700" 
                              onClick={() => {
                                setSelectedPost(post);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the post{" "}
              <span className="font-medium">
                {selectedPost?.title}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePost} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash className="mr-2 h-4 w-4" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 