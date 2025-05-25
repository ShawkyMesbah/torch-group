"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "@/components/ui/use-toast";
import { 
  Save, 
  Image, 
  AlignLeft, 
  FileText, 
  Tags, 
  Calendar, 
  LinkIcon, 
  Eye, 
  Settings, 
  RefreshCw, 
  Globe,
  PencilRuler,
  BarChart,
  FilePlus,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Post Status Type
export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

// Blog Post Interface
export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  status: PostStatus;
  publishedAt?: string;
  updatedAt?: string;
  authorId?: string;
  authorName?: string;
  tags: string[];
  seo: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
  };
}

// Props
interface BlogEditorProps {
  post?: BlogPost;
  onSave: (post: BlogPost) => Promise<BlogPost | undefined>;
  onPreview?: (post: BlogPost) => void;
  onPublish?: (post: BlogPost) => Promise<BlogPost | undefined>;
  isLoading?: boolean;
}

// Default empty post
const defaultPost: BlogPost = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  coverImage: "",
  status: "DRAFT",
  tags: [],
  seo: {}
};

export function BlogEditor({
  post = defaultPost,
  onSave,
  onPreview,
  onPublish,
  isLoading = false
}: BlogEditorProps) {
  const [editedPost, setEditedPost] = useState<BlogPost>(post);
  const [currentTab, setCurrentTab] = useState<string>("content");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [slugError, setSlugError] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const router = useRouter();
  
  // Reset editor when post changes
  useEffect(() => {
    setEditedPost(post);
    setHasUnsavedChanges(false);
  }, [post]);
  
  // Handle form changes
  const handleChange = (field: keyof BlogPost, value: any) => {
    setEditedPost(prev => {
      // Handle nested SEO fields
      if (field === 'seo' && typeof value === 'object') {
        return {
          ...prev,
          seo: {
            ...prev.seo,
            ...value
          }
        };
      }
      
      return {
        ...prev,
        [field]: value
      };
    });
    setHasUnsavedChanges(true);
  };
  
  // Generate slug from title
  const generateSlug = () => {
    const slug = editedPost.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
      
    handleChange('slug', slug);
    validateSlug(slug);
  };
  
  // Validate slug
  const validateSlug = (slug: string) => {
    if (!slug) {
      setSlugError("Slug cannot be empty");
      return false;
    }
    
    // Check for valid slug format (lowercase, hyphens, no spaces or special chars)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setSlugError("Slug must contain only lowercase letters, numbers, and hyphens");
      return false;
    }
    
    setSlugError("");
    return true;
  };
  
  // Handle slug change
  const handleSlugChange = (slug: string) => {
    setSlugTouched(true);
    handleChange('slug', slug);
    validateSlug(slug);
  };
  
  // Handle tag management
  const addTag = () => {
    if (!newTag.trim()) return;
    
    // Don't add duplicate tags
    if (editedPost.tags.includes(newTag.trim())) {
      toast({
        title: "Duplicate tag",
        description: "This tag already exists.",
        variant: "destructive",
      });
      return;
    }
    
    handleChange('tags', [...editedPost.tags, newTag.trim()]);
    setNewTag("");
  };
  
  const removeTag = (tagToRemove: string) => {
    handleChange('tags', editedPost.tags.filter(tag => tag !== tagToRemove));
  };
  
  // Handle cover image upload
  const handleCoverImageUpload = (url: string) => {
    handleChange('coverImage', url);
    
    // Also set it as OG image if not already set
    if (!editedPost.seo.ogImage) {
      handleChange('seo', { ogImage: url });
    }
  };
  
  // Handle file upload
  const handleFileUpload = (fileUrl: string, fileType: string) => {
    // Insert image at cursor position in content
    if (fileType.startsWith('image/')) {
      const imageMarkdown = `![Image](${fileUrl})`;
      
      // For now, we'll just append the image at the end of the content
      // In a real rich text editor, you'd insert at cursor position
      handleChange('content', editedPost.content + "\n\n" + imageMarkdown);
      
      toast({
        title: "Image Added",
        description: "The image has been inserted into your post.",
      });
    } else {
      // Insert link to file
      const fileName = fileUrl.split('/').pop() || 'file';
      const fileMarkdown = `[${fileName}](${fileUrl})`;
      
      handleChange('content', editedPost.content + "\n\n" + fileMarkdown);
      
      toast({
        title: "File Added",
        description: "A link to the file has been inserted into your post.",
      });
    }
  };
  
  // Save post
  const handleSave = async () => {
    // Validate form
    if (!editedPost.title) {
      toast({
        title: "Missing title",
        description: "Please add a title for your post.",
        variant: "destructive",
      });
      setCurrentTab("content");
      return;
    }
    
    if (!editedPost.slug || slugError) {
      toast({
        title: "Invalid slug",
        description: slugError || "Please provide a valid URL slug.",
        variant: "destructive",
      });
      setCurrentTab("content");
      return;
    }
    
    try {
      const savedPost = await onSave(editedPost);
      
      if (savedPost) {
        setEditedPost(savedPost);
        setHasUnsavedChanges(false);
        
        toast({
          title: "Post saved",
          description: "Your post has been saved successfully.",
        });
      }
    } catch (error) {
      console.error("Error saving post:", error);
      
      toast({
        title: "Save failed",
        description: "There was an error saving your post. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Preview post
  const handlePreview = () => {
    if (!onPreview) return;
    
    // Mock saving the post first
    setPreviewReady(true);
    onPreview(editedPost);
  };
  
  // Publish post
  const handlePublish = async () => {
    if (!onPublish) return;
    
    try {
      setIsPublishing(true);
      
      // Set status to published
      const postToPublish = {
        ...editedPost,
        status: "PUBLISHED" as PostStatus,
        publishedAt: new Date().toISOString()
      };
      
      const publishedPost = await onPublish(postToPublish);
      
      if (publishedPost) {
        setEditedPost(publishedPost);
        setHasUnsavedChanges(false);
        
        toast({
          title: "Post published",
          description: "Your post has been published successfully.",
        });
      }
    } catch (error) {
      console.error("Error publishing post:", error);
      
      toast({
        title: "Publish failed",
        description: "There was an error publishing your post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Word count and reading time estimate
  const getPostStats = () => {
    const text = editedPost.content;
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // Assume 200 words per minute
    
    return { wordCount, readingTime };
  };
  
  // Try to exit
  const tryExit = () => {
    if (hasUnsavedChanges) {
      setShowExitDialog(true);
    } else {
      router.push("/dashboard/blog");
    }
  };
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const stats = getPostStats();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            {editedPost.id ? "Edit Post" : "New Post"}
            {hasUnsavedChanges && (
              <Badge variant="outline" className="ml-2">Unsaved Changes</Badge>
            )}
          </h1>
          
          {editedPost.status === "PUBLISHED" && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Published on {formatDate(editedPost.publishedAt)}
              {editedPost.updatedAt && editedPost.updatedAt !== editedPost.publishedAt && (
                <> · Updated on {formatDate(editedPost.updatedAt)}</>
              )}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Post Settings</SheetTitle>
                <SheetDescription>
                  Configure settings for your blog post
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6 py-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Publishing Options</h3>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="col-span-1">Status</Label>
                    <Select 
                      value={editedPost.status}
                      onValueChange={(value) => handleChange('status', value)}
                      disabled={isPublishing}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">SEO Settings</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      <Label className="col-span-1" htmlFor="seo-title">SEO Title</Label>
                      <div className="col-span-3">
                        <Input
                          id="seo-title"
                          placeholder="SEO Title (if different from post title)"
                          value={editedPost.seo.title || ''}
                          onChange={(e) => handleChange('seo', { title: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended: 50-60 characters
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4">
                      <Label className="col-span-1" htmlFor="seo-description">SEO Description</Label>
                      <div className="col-span-3">
                        <Textarea
                          id="seo-description"
                          placeholder="Meta description for search engines"
                          value={editedPost.seo.description || ''}
                          onChange={(e) => handleChange('seo', { description: e.target.value })}
                          rows={3}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended: 150-160 characters
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4">
                      <Label className="col-span-1" htmlFor="seo-keywords">Keywords</Label>
                      <div className="col-span-3">
                        <Input
                          id="seo-keywords"
                          placeholder="Comma-separated keywords"
                          value={editedPost.seo.keywords || ''}
                          onChange={(e) => handleChange('seo', { keywords: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4">
                      <Label className="col-span-1" htmlFor="seo-og-image">
                        OpenGraph Image
                      </Label>
                      <div className="col-span-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <Input
                            id="seo-og-image"
                            placeholder="URL for social media sharing"
                            value={editedPost.seo.ogImage || ''}
                            onChange={(e) => handleChange('seo', { ogImage: e.target.value })}
                          />
                          <Button 
                            variant="outline" 
                            size="icon"
                            type="button"
                            onClick={() => handleChange('seo', { ogImage: editedPost.coverImage })}
                            disabled={!editedPost.coverImage}
                          >
                            <Image className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                          Use the same as cover image or specify a different one for social sharing
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Done</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            disabled={isLoading || !onPreview}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          
          <Button
            variant={editedPost.status === "PUBLISHED" ? "outline" : "default"}
            size="sm"
            onClick={handlePublish}
            disabled={isLoading || isPublishing || !onPublish}
          >
            {isPublishing ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Globe className="mr-2 h-4 w-4" />
            )}
            {editedPost.status === "PUBLISHED" ? "Update Published" : "Publish"}
          </Button>
          
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isLoading || !hasUnsavedChanges}
          >
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Draft
          </Button>
        </div>
      </div>
      
      {/* Editor Tabs */}
      <Tabs defaultValue="content" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="content">
            <AlignLeft className="mr-2 h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="media">
            <Image className="mr-2 h-4 w-4" />
            Cover Image
          </TabsTrigger>
          <TabsTrigger value="meta">
            <FileText className="mr-2 h-4 w-4" />
            Meta
          </TabsTrigger>
          <TabsTrigger value="tags">
            <Tags className="mr-2 h-4 w-4" />
            Tags
          </TabsTrigger>
        </TabsList>
        
        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Post Title</Label>
            <Input
              id="title"
              placeholder="Enter post title"
              value={editedPost.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="text-lg"
            />
          </div>
          
          {/* URL Slug */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="slug">URL Slug</Label>
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0"
                onClick={generateSlug}
                disabled={!editedPost.title}
                type="button"
              >
                Generate from title
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">/blog/</span>
              <Input
                id="slug"
                placeholder="url-slug"
                value={editedPost.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className={slugError && slugTouched ? "border-red-500" : ""}
              />
            </div>
            {slugError && slugTouched && (
              <p className="text-red-500 text-sm">{slugError}</p>
            )}
          </div>
          
          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              placeholder="Brief summary of your post"
              value={editedPost.summary}
              onChange={(e) => handleChange('summary', e.target.value)}
              rows={2}
            />
            <p className="text-xs text-gray-500">
              This will be displayed on the blog list and in search results.
            </p>
          </div>
          
          {/* Content Editor */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your post content here..."
              value={editedPost.content}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={16}
              className="font-mono"
            />
          </div>
          
          {/* Content Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              <span className="font-medium">{stats.wordCount}</span> words
              <span className="mx-2">·</span>
              <span className="font-medium">{stats.readingTime}</span> min read
            </div>
            <div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {editedPost.id ? (
                  <span>Last edited: {formatDate(editedPost.updatedAt) || "Just now"}</span>
                ) : (
                  <span>New draft</span>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Cover Image Tab */}
        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
              <CardDescription>
                Add a cover image to your post
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {editedPost.coverImage ? (
                  <div className="space-y-4">
                    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={editedPost.coverImage} 
                        alt="Cover" 
                        className="w-full h-[250px] object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Input
                        value={editedPost.coverImage}
                        onChange={(e) => handleCoverImageUpload(e.target.value)}
                        placeholder="Image URL"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="ml-2"
                        onClick={() => handleChange('coverImage', '')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center">
                    <div className="mx-auto flex flex-col items-center justify-center gap-1">
                      <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3">
                        <Image className="h-8 w-8 text-gray-500" />
                      </div>
                      <h3 className="mt-2 text-lg font-medium">
                        No cover image
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Upload a cover image for your post
                      </p>
                      <FileUpload 
                        folder="blog" 
                        onUploadComplete={handleCoverImageUpload} 
                        accept="image/*"
                        maxSize={4}
                      />
                    </div>
                  </div>
                )}
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Insert Media into Post</h3>
                  <FileUpload 
                    folder="blog" 
                    onUploadComplete={handleFileUpload} 
                    buttonText="Upload Image or File"
                    maxSize={10}
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Upload images or files to insert into your post content
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Meta Tab */}
        <TabsContent value="meta" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Optimize your post for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-title">SEO Title</Label>
                <Input
                  id="meta-title"
                  placeholder="Title for search engines (if different from post title)"
                  value={editedPost.seo.title || ''}
                  onChange={(e) => handleChange('seo', { title: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  Leave empty to use the post title. Recommended: 50-60 characters.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  placeholder="Description for search engines"
                  value={editedPost.seo.description || ''}
                  onChange={(e) => handleChange('seo', { description: e.target.value })}
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Leave empty to use the post summary. Recommended: 150-160 characters.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meta-keywords">Keywords</Label>
                <Input
                  id="meta-keywords"
                  placeholder="Comma-separated keywords"
                  value={editedPost.seo.keywords || ''}
                  onChange={(e) => handleChange('seo', { keywords: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meta-og-image">Social Sharing Image</Label>
                <Input
                  id="meta-og-image"
                  placeholder="URL for social media sharing"
                  value={editedPost.seo.ogImage || ''}
                  onChange={(e) => handleChange('seo', { ogImage: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  Leave empty to use the post cover image. Ideal size: 1200x630 pixels.
                </p>
              </div>
              
              <div className="flex items-center space-x-4 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleChange('seo', { 
                    title: editedPost.title,
                    description: editedPost.summary,
                    ogImage: editedPost.coverImage 
                  })}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Use Post Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Search Preview</CardTitle>
              <CardDescription>
                How your post might appear in search engine results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-white dark:bg-gray-950">
                <div className="space-y-1">
                  <div className="text-blue-600 text-xl truncate font-medium">
                    {editedPost.seo.title || editedPost.title || "Post Title"}
                  </div>
                  <div className="text-green-700 text-sm">
                    https://yoursite.com/blog/{editedPost.slug || "post-slug"}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    {(editedPost.seo.description || editedPost.summary || "Post description will appear here. Make sure to add a good description to improve search engine rankings.").substring(0, 160)}
                    {(editedPost.seo.description || editedPost.summary || "").length > 160 && "..."}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tags Tab */}
        <TabsContent value="tags" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Post Tags</CardTitle>
              <CardDescription>
                Add tags to help readers find your post
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {editedPost.tags.length > 0 ? (
                    editedPost.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-sm py-1 px-3">
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-2"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No tags added yet</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button variant="secondary" onClick={addTag}>
                    Add
                  </Button>
                </div>
                
                <p className="text-sm text-gray-500">
                  Tags help categorize your posts and make them more discoverable.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Bottom action bar */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-800">
        <Button 
          variant="ghost" 
          onClick={tryExit}
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={isLoading || !hasUnsavedChanges}
          >
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>
      
      {/* Unsaved changes dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave? Your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowExitDialog(false);
                router.push("/dashboard/blog");
              }}
            >
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 