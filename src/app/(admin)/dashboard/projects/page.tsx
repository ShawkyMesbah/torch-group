'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Calendar, User } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage?: string;
  clientName?: string;
  completionDate?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<string>('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjects(projects.filter(project => project.id !== id));
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      if (response.ok) {
        setProjects(projects.map(project => 
          project.id === id 
            ? { ...project, isPublished: !currentStatus }
            : project
        ));
      }
    } catch (error) {
      console.error('Error toggling project status:', error);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.clientName && project.clientName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPublished = publishedFilter === 'all' || 
                            (publishedFilter === 'published' && project.isPublished) ||
                            (publishedFilter === 'draft' && !project.isPublished);
    
    return matchesSearch && matchesPublished;
  });

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
              <div className="h-32 bg-gray-700 rounded mb-4"></div>
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
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Showcase your work and client projects.</p>
        </div>
        <Link href="/dashboard/projects/new">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="h-4 w-4" />
            Add Project
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
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              />
            </div>
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full bg-gray-800/30 border border-gray-700 rounded-xl p-12 text-center">
            <div className="text-gray-400 mb-4">
              {projects.length === 0 ? 'No projects found' : 'No projects match your filters'}
            </div>
            {projects.length === 0 && (
              <Link href="/dashboard/projects/new">
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Create Your First Project
                </button>
              </Link>
            )}
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300 group"
            >
              {/* Project Cover Image */}
              <div className="h-32 bg-gray-900/50 border-b border-gray-600 relative overflow-hidden">
                {project.coverImage ? (
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-gray-500 text-4xl font-bold">
                      {project.title.charAt(0)}
                    </div>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.isPublished 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                  }`}>
                    {project.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
                </div>

                {/* Project Meta */}
                <div className="space-y-2 mb-4">
                  {project.clientName && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-3 w-3" />
                      <span>{project.clientName}</span>
                    </div>
                  )}
                  
                  {project.completionDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(project.completionDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Slug: /{project.slug}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                  <button
                    onClick={() => togglePublished(project.id, project.isPublished)}
                    className={`p-2 rounded-lg transition-colors ${
                      project.isPublished
                        ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                        : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'
                    }`}
                    title={project.isPublished ? 'Published' : 'Draft'}
                  >
                    {project.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>

                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/projects/${project.id}/edit`}>
                      <button className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Updated Date */}
                <div className="mt-3 text-xs text-gray-500">
                  Updated: {new Date(project.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
        <div className="flex flex-wrap gap-6 text-sm text-gray-400">
          <span>Total: {projects.length}</span>
          <span>Published: {projects.filter(p => p.isPublished).length}</span>
          <span>Drafts: {projects.filter(p => !p.isPublished).length}</span>
          <span>With Clients: {projects.filter(p => p.clientName).length}</span>
        </div>
      </div>
    </div>
  );
} 