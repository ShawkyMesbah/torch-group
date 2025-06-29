'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ServiceFormData {
  title: string;
  slug: string;
  description: string;
  content: string;
  category: 'B2C' | 'B2B' | 'B2T' | 'B2A';
  isPublished: boolean;
  isFeatured: boolean;
  order?: number;
}

export default function NewServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    slug: '',
    description: '',
    content: '',
    category: 'B2B',
    isPublished: false,
    isFeatured: false,
    order: 0
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/dashboard/services');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create service');
      }
    } catch (error) {
      console.error('Error creating service:', error);
      alert('Error creating service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/services">
          <button className="p-2 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800/70 transition-colors">
            <ArrowLeft className="h-4 w-4 text-gray-400" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Create New Service</h1>
          <p className="text-gray-400">Add a new service to your portfolio.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Service Details</h2>
          
          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              placeholder="Enter service title"
              required
            />
          </div>

          {/* Slug */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              placeholder="service-slug"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              URL-friendly version of the title
            </p>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                category: e.target.value as ServiceFormData['category']
              }))}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
              required
            >
              <option value="B2B">B2B - Business to Business</option>
              <option value="B2C">B2C - Business to Consumer</option>
              <option value="B2T">B2T - Business to Talent</option>
              <option value="B2A">B2A - Business to Alliance</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              placeholder="Brief description of the service"
              required
            />
          </div>

          {/* Content */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={8}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              placeholder="Detailed content about the service (supports markdown)"
            />
          </div>

          {/* Order */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={formData.order || 0}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                order: parseInt(e.target.value) || 0 
              }))}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              placeholder="0"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Lower numbers appear first
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Options</h2>
          
          <div className="space-y-4">
            {/* Published */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  isPublished: e.target.checked 
                }))}
                className="h-4 w-4 text-red-600 bg-gray-900 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
              />
              <label htmlFor="isPublished" className="ml-2 text-sm text-gray-300">
                Publish service immediately
              </label>
            </div>

            {/* Featured */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  isFeatured: e.target.checked 
                }))}
                className="h-4 w-4 text-red-600 bg-gray-900 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
              />
              <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-300">
                Mark as featured service
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard/services">
            <button
              type="button"
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800/70 transition-colors"
            >
              Cancel
            </button>
          </Link>
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Service
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 