'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, ExternalLink, Clock } from 'lucide-react';
import Link from 'next/link';

interface Brand {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  websiteUrl?: string;
  isActive: boolean;
  isComingSoon: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands');
      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;

    try {
      const response = await fetch(`/api/brands/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBrands(brands.filter(brand => brand.id !== id));
      } else {
        alert('Failed to delete brand');
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
      alert('Error deleting brand');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/brands/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setBrands(brands.map(brand => 
          brand.id === id 
            ? { ...brand, isActive: !currentStatus }
            : brand
        ));
      }
    } catch (error) {
      console.error('Error toggling brand status:', error);
    }
  };

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brand.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && brand.isActive) ||
                         (statusFilter === 'inactive' && !brand.isActive) ||
                         (statusFilter === 'coming-soon' && brand.isComingSoon);
    
    return matchesSearch && matchesStatus;
  });

  const getBrandStatusColor = (brand: Brand) => {
    if (brand.isComingSoon) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    if (brand.isActive) return 'bg-green-500/10 text-green-400 border-green-500/20';
    return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const getBrandStatusText = (brand: Brand) => {
    if (brand.isComingSoon) return 'Coming Soon';
    if (brand.isActive) return 'Active';
    return 'Inactive';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 animate-pulse">
              <div className="h-16 bg-gray-700 rounded mb-4"></div>
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-700 rounded w-20"></div>
                <div className="h-8 bg-gray-700 rounded w-16"></div>
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
          <h1 className="text-3xl font-bold text-white mb-2">Brands</h1>
          <p className="text-gray-400">Manage your brand portfolio and company logos.</p>
        </div>
        <Link href="/dashboard/brands/new">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="h-4 w-4" />
            Add Brand
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
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="coming-soon">Coming Soon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.length === 0 ? (
          <div className="col-span-full bg-gray-800/30 border border-gray-700 rounded-xl p-12 text-center">
            <div className="text-gray-400 mb-4">
              {brands.length === 0 ? 'No brands found' : 'No brands match your filters'}
            </div>
            {brands.length === 0 && (
              <Link href="/dashboard/brands/new">
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Create Your First Brand
                </button>
              </Link>
            )}
          </div>
        ) : (
          filteredBrands.map((brand) => (
            <div
              key={brand.id}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 group"
            >
              {/* Brand Logo/Icon */}
              <div className="flex items-center justify-center h-20 mb-4 bg-gray-900/50 rounded-lg border border-gray-600">
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={`${brand.name} logo`}
                    className="max-h-16 max-w-full object-contain"
                  />
                ) : (
                  <div className="text-gray-500 text-2xl font-bold">
                    {brand.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Brand Info */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{brand.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getBrandStatusColor(brand)}`}>
                    {getBrandStatusText(brand)}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{brand.description}</p>
                
                {brand.websiteUrl && (
                  <a
                    href={brand.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Visit Website
                  </a>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(brand.id, brand.isActive)}
                    className={`p-2 rounded-lg transition-colors ${
                      brand.isActive
                        ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                        : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'
                    }`}
                    title={brand.isActive ? 'Active' : 'Inactive'}
                  >
                    {brand.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  
                  {brand.isComingSoon && (
                    <div className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg" title="Coming Soon">
                      <Clock className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/brands/${brand.id}/edit`}>
                    <button className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Metadata */}
              <div className="mt-3 text-xs text-gray-500">
                Updated: {new Date(brand.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
        <div className="flex flex-wrap gap-6 text-sm text-gray-400">
          <span>Total: {brands.length}</span>
          <span>Active: {brands.filter(b => b.isActive).length}</span>
          <span>Inactive: {brands.filter(b => !b.isActive).length}</span>
          <span>Coming Soon: {brands.filter(b => b.isComingSoon).length}</span>
        </div>
      </div>
    </div>
  );
} 