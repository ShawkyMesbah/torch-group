"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { FileUpload } from "@/components/ui/file-upload";
import { Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  published: boolean;
  tags?: string[];
  category?: string;
}

export function BlogEditor({ post, onClose }: { post?: any; onClose?: () => void }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<BlogPost>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    coverImage: undefined,
    published: false,
    tags: [],
    category: "",
  });
  const [showPreview, setShowPreview] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: form.content,
    onUpdate: ({ editor }) => {
      setForm((prev) => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class: 'min-h-[200px] bg-white rounded-md p-3 text-black',
      },
    },
  });

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title || "",
        slug: post.slug || "",
        content: post.content || "",
        excerpt: post.excerpt || "",
        coverImage: post.coverImage,
        published: post.isPublished || false,
        tags: post.tags || [],
        category: post.category || "",
      });
    }
  }, [post]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    }));
  };

  const handleImageUpload = (url: string) => {
    setForm((prev) => ({ ...prev, coverImage: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let response;
      const payload = {
        ...form,
        isPublished: form.published,
        tags: form.tags,
        category: form.category,
      };
      if (post) {
        response = await fetch(`/api/blog/${post.slug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch("/api/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!response.ok) {
        throw new Error(post ? "Failed to update blog post" : "Failed to create blog post");
      }
      toast({
        title: "Success",
        description: post ? "Blog post updated successfully" : "Blog post created successfully",
      });
      if (onClose) onClose();
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: post ? "Failed to update blog post" : "Failed to create blog post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8 bg-black/60 p-6 rounded-xl border border-zinc-800">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={handleTitleChange}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
            required
            disabled={isLoading || !!post}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={form.excerpt}
            onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <div className="bg-white rounded-md overflow-hidden">
            {editor && (
              <div className="mb-2 flex flex-wrap gap-2 p-2 bg-zinc-100 rounded-t-md border-b border-zinc-200">
                <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'font-bold text-red-600' : ''}>B</button>
                <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'italic text-red-600' : ''}>I</button>
                <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'underline text-red-600' : ''}>U</button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'text-red-600' : ''}>H1</button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'text-red-600' : ''}>H2</button>
                <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'text-red-600' : ''}>• List</button>
                <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'text-red-600' : ''}>1. List</button>
                <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'text-red-600' : ''}>Left</button>
                <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'text-red-600' : ''}>Center</button>
                <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'text-red-600' : ''}>Right</button>
                <button type="button" onClick={() => {
                  const url = prompt('Enter image URL');
                  if (url) editor.chain().focus().setImage({ src: url }).run();
                }}>Image</button>
                <button type="button" onClick={() => {
                  const url = prompt('Enter link URL');
                  if (url) editor.chain().focus().setLink({ href: url }).run();
                }}>Link</button>
                <button type="button" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>Clear</button>
              </div>
            )}
            <EditorContent editor={editor} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Cover Image</Label>
          <FileUpload
            endpoint="blogImage"
            onUploadComplete={(res) => {
              handleImageUpload(res[0].url);
            }}
            aria-label="Upload cover image"
          />
          {form.coverImage && (
            <img src={form.coverImage} alt="Cover" className="mt-2 rounded-lg max-h-40" />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={form.category}
            onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
            placeholder="e.g. News, Updates"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={form.tags?.join(", ")}
            onChange={e => setForm(prev => ({ ...prev, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) }))}
            placeholder="Comma separated (e.g. tech, ai, startup)"
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="published"
            checked={form.published}
            onChange={(e) => setForm((prev) => ({ ...prev, published: e.target.checked }))}
            disabled={isLoading}
          />
          <Label htmlFor="published">Publish immediately</Label>
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isLoading}
            aria-label={post ? "Update blog post" : "Create blog post"}
            className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? (post ? "Updating..." : "Creating...") : post ? "Update Post" : "Create Post"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => setShowPreview(true)} disabled={isLoading}>Preview</Button>
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          )}
        </div>
      </form>
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative bg-zinc-900 rounded-xl shadow-xl max-w-2xl w-full p-8 text-white">
            <button className="absolute top-4 right-4 text-zinc-400 hover:text-red-400" onClick={() => setShowPreview(false)}><X className="w-6 h-6" /></button>
            <h2 className="text-3xl font-bold mb-2">{form.title}</h2>
            {form.category && <div className="mb-2 text-sm text-red-400 font-semibold">{form.category}</div>}
            {form.tags && form.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="bg-zinc-800 text-xs px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            )}
            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: form.content }} />
          </div>
        </div>
      )}
    </>
  );
} 