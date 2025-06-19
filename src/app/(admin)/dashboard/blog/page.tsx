"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { BlogEditor } from "@/components/dashboard/blog/BlogEditor";
import { Loader2, Edit, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionLoading } from "@/components/ui/unified-loading";

const PAGE_SIZE = 10;

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editPost, setEditPost] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [author, setAuthor] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/blog");
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      const data = await res.json();
      setPosts(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = (post: any) => {
    setEditPost(post);
    setShowEditor(true);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/blog/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
      fetchPosts();
    } catch (err) {
      alert("Error deleting post");
    }
  };

  const handleCreate = () => {
    setEditPost(null);
    setShowEditor(true);
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    setEditPost(null);
    fetchPosts();
  };

  // Unique authors for filter dropdown
  const authors = useMemo(() => {
    const names = posts.map((p) => p.author?.name).filter(Boolean);
    return Array.from(new Set(names));
  }, [posts]);

  // Filtered and searched posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.slug.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        !status || (status === "published" && post.isPublished) || (status === "draft" && !post.isPublished);
      const matchesAuthor = !author || post.author?.name === author;
      return matchesSearch && matchesStatus && matchesAuthor;
    });
  }, [posts, search, status, author]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const paginatedPosts = filteredPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1); // Reset to first page on filter/search change
  }, [search, status, author]);

  // Bulk actions
  const allVisibleSlugs = paginatedPosts.map((p) => p.slug);
  const allSelected = allVisibleSlugs.every((slug) => selected.includes(slug)) && allVisibleSlugs.length > 0;
  const toggleAll = () => {
    if (allSelected) {
      setSelected(selected.filter((slug) => !allVisibleSlugs.includes(slug)));
    } else {
      setSelected([...new Set([...selected, ...allVisibleSlugs])]);
    }
  };
  const toggleOne = (slug: string) => {
    setSelected((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]);
  };
  const clearSelected = () => setSelected([]);

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} selected post(s)?`)) return;
    for (const slug of selected) {
      await fetch(`/api/blog/${slug}`, { method: "DELETE" });
    }
    clearSelected();
    fetchPosts();
  };
  const handleBulkPublish = async (publish: boolean) => {
    for (const slug of selected) {
      await fetch(`/api/blog/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: publish }),
      });
    }
    clearSelected();
    fetchPosts();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <Button onClick={handleCreate} className="flex items-center gap-2"><Plus className="w-4 h-4" /> New Post</Button>
      </div>
      {/* Search & Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label className="block text-xs font-semibold mb-1">Search</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or slug"
            className="px-3 py-2 rounded-md border border-zinc-700 bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="px-3 py-2 rounded-md border border-zinc-700 bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Author</label>
          <select
            value={author}
            onChange={e => setAuthor(e.target.value)}
            className="px-3 py-2 rounded-md border border-zinc-700 bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="">All</option>
            {authors.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>
      {showEditor && (
        <div className="mb-8">
          <BlogEditor post={editPost} onClose={handleEditorClose} />
        </div>
      )}
      {/* Bulk Actions Bar */}
      {selected.length > 0 && (
        <div className="mb-4 flex items-center gap-4 bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-2">
          <span className="text-sm">{selected.length} selected</span>
          <Button size="sm" variant="destructive" onClick={handleBulkDelete}>Delete</Button>
          <Button size="sm" variant="outline" onClick={() => handleBulkPublish(true)}>Publish</Button>
          <Button size="sm" variant="outline" onClick={() => handleBulkPublish(false)}>Unpublish</Button>
          <Button size="sm" variant="ghost" onClick={clearSelected}>Clear</Button>
        </div>
      )}
      {loading ? (
        <SectionLoading text="Loading blog posts..." />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-zinc-400">No blog posts found.</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-black/40">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-zinc-900 text-zinc-300">
                  <th className="px-2 py-2 text-left w-8">
                    <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
                  </th>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Author</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPosts.map((post) => (
                  <tr key={post.slug} className="border-t border-zinc-800 hover:bg-zinc-900/40">
                    <td className="px-2 py-2">
                      <Checkbox checked={selected.includes(post.slug)} onCheckedChange={() => toggleOne(post.slug)} aria-label={`Select ${post.title}`} />
                    </td>
                    <td className="px-4 py-2 font-medium">{post.title}</td>
                    <td className="px-4 py-2">{post.isPublished ? <span className="text-green-500">Published</span> : <span className="text-yellow-400">Draft</span>}</td>
                    <td className="px-4 py-2">{post.author?.name || "-"}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(post)}><Edit className="w-4 h-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(post.slug)}><Trash2 className="w-4 h-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-zinc-400">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="w-4 h-4" /></Button>
              <Button size="sm" variant="outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 