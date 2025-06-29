'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Filter } from 'lucide-react';
import Link from 'next/link';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'B2C' | 'B2B' | 'B2T' | 'B2A';
  isPublished: boolean;
  isFeatured: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [publishedFilter, setPublishedFilter] = useState<string>('all');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setServices(services.filter(service => service.id !== id));
      } else {
        alert('Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Error deleting service');
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      if (response.ok) {
        setServices(services.map(service => 
          service.id === id 
            ? { ...service, isPublished: !currentStatus }
            : service
        ));
      }
    } catch (error) {
      console.error('Error toggling service status:', error);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    const matchesPublished = publishedFilter === 'all' || 
                            (publishedFilter === 'published' && service.isPublished) ||
                            (publishedFilter === 'draft' && !service.isPublished);
    
    return matchesSearch && matchesCategory && matchesPublished;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'B2C': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'B2B': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'B2T': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'B2A': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-700 rounded w-16"></div>
                <div className="h-6 bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Services</h1>
          <p className="text-gray-400">Manage your service offerings and categories.</p>
        </div>
        <Link href="/dashboard/services/new">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="h-4 w-4" />
            Add Service
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
            >
              <option value="all">All Categories</option>
              <option value="B2C">B2C</option>
              <option value="B2B">B2B</option>
              <option value="B2T">B2T</option>
              <option value="B2A">B2A</option>
            </select>
          </div>

          {/* Published Filter */}
          <div>
            <select
              value={publishedFilter}
              onChange={(e) => setPublishedFilter(e.target.value)}
              className="bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {filteredServices.length === 0 ? (
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-12 text-center">
            <div className="text-gray-400 mb-4">
              {services.length === 0 ? 'No services found' : 'No services match your filters'}
            </div>
            {services.length === 0 && (
              <Link href="/dashboard/services/new">
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Create Your First Service
                </button>
              </Link>
            )}
          </div>
        ) : (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(service.category)}`}>
                      {service.category}
                    </span>
                    {service.isFeatured && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 mb-3">{service.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Slug: /{service.slug}</span>
                    <span>•</span>
                    <span>Updated: {new Date(service.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublished(service.id, service.isPublished)}
                    className={`p-2 rounded-lg transition-colors ${
                      service.isPublished
                        ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                        : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'
                    }`}
                    title={service.isPublished ? 'Published' : 'Draft'}
                  >
                    {service.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  
                  <Link href={`/dashboard/services/${service.id}/edit`}>
                    <button className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
        <div className="flex flex-wrap gap-6 text-sm text-gray-400">
          <span>Total: {services.length}</span>
          <span>Published: {services.filter(s => s.isPublished).length}</span>
          <span>Drafts: {services.filter(s => !s.isPublished).length}</span>
          <span>Featured: {services.filter(s => s.isFeatured).length}</span>
        </div>
      </div>
    </div>
  );
} 