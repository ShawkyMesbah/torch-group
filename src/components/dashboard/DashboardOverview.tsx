'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  MessageSquare, 
  Star, 
  Briefcase, 
  Settings,
  Plus,
  Eye,
  TrendingUp,
  Building2,
  Palette
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  blogPosts: { total: number; published: number };
  teamMembers: { total: number; published: number };
  contactMessages: { total: number; unread: number };
  talents: { total: number; active: number };
  projects: { total: number; published: number };
  services: { total: number; published: number };
  brands: { total: number; active: number };
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          blogResponse,
          teamResponse,
          contactResponse,
          talentsResponse,
          projectsResponse,
          servicesResponse,
          brandsResponse
        ] = await Promise.all([
          fetch('/api/blog/count'),
          fetch('/api/team-members/count'),
          fetch('/api/contact/count'),
          fetch('/api/talents/count'),
          fetch('/api/projects/count'),
          fetch('/api/services/count'),
          fetch('/api/brands/count')
        ]);

        const [
          blogData,
          teamData,
          contactData,
          talentsData,
          projectsData,
          servicesData,
          brandsData
        ] = await Promise.all([
          blogResponse.ok ? blogResponse.json() : { total: 0, published: 0 },
          teamResponse.ok ? teamResponse.json() : { total: 0, published: 0 },
          contactResponse.ok ? contactResponse.json() : { total: 0, unread: 0 },
          talentsResponse.ok ? talentsResponse.json() : { total: 0, active: 0 },
          projectsResponse.ok ? projectsResponse.json() : { total: 0, published: 0 },
          servicesResponse.ok ? servicesResponse.json() : { total: 0, published: 0 },
          brandsResponse.ok ? brandsResponse.json() : { total: 0, active: 0 }
        ]);

        setStats({
          blogPosts: blogData,
          teamMembers: teamData,
          contactMessages: contactData,
          talents: talentsData,
          projects: projectsData,
          services: servicesData,
          brands: brandsData
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Blog Posts',
      total: stats?.blogPosts.total || 0,
      subtitle: `${stats?.blogPosts.published || 0} published`,
      icon: FileText,
      href: '/dashboard/blog',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Team Members',
      total: stats?.teamMembers.total || 0,
      subtitle: `${stats?.teamMembers.published || 0} published`,
      icon: Users,
      href: '/dashboard/team',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Contact Messages',
      total: stats?.contactMessages.total || 0,
      subtitle: `${stats?.contactMessages.unread || 0} unread`,
      icon: MessageSquare,
      href: '/dashboard/messages',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    {
      title: 'Talents',
      total: stats?.talents.total || 0,
      subtitle: `${stats?.talents.active || 0} active`,
      icon: Star,
      href: '/dashboard/talents',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Projects',
      total: stats?.projects.total || 0,
      subtitle: `${stats?.projects.published || 0} published`,
      icon: Briefcase,
      href: '/dashboard/projects',
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10'
    },
    {
      title: 'Services',
      total: stats?.services.total || 0,
      subtitle: `${stats?.services.published || 0} published`,
      icon: Building2,
      href: '/dashboard/services',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10'
    },
    {
      title: 'Brands',
      total: stats?.brands.total || 0,
      subtitle: `${stats?.brands.active || 0} active`,
      icon: Palette,
      href: '/dashboard/brands',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10'
    },
    {
      title: 'Settings',
      total: 0,
      subtitle: 'Site configuration',
      icon: Settings,
      href: '/dashboard/settings',
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/10'
    }
  ];

  const quickActions = [
    { title: 'New Blog Post', href: '/dashboard/blog/new', icon: FileText },
    { title: 'Add Team Member', href: '/dashboard/team/new', icon: Users },
    { title: 'Create Service', href: '/dashboard/services/new', icon: Building2 },
    { title: 'Add Brand', href: '/dashboard/brands/new', icon: Palette },
    { title: 'New Project', href: '/dashboard/projects/new', icon: Briefcase },
    { title: 'View Analytics', href: '/dashboard/analytics', icon: TrendingUp }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={card.title}
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
          >
            <Link href={card.href}>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:border-gray-600 group cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                  <Eye className="h-4 w-4 text-gray-500 group-hover:text-gray-400 transition-colors" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {card.total}
                  </h3>
                  <p className="text-sm font-medium text-gray-300 mb-1">
                    {card.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <div
              key={action.title}
              className="opacity-0 animate-fade-in-left"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <Link href={action.href}>
                <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/50 transition-all duration-300 hover:border-gray-600 group cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                      <action.icon className="h-5 w-5 text-red-400" />
                    </div>
                    <span className="text-white font-medium group-hover:text-red-400 transition-colors">
                      {action.title}
                    </span>
                    <Plus className="h-4 w-4 text-gray-500 group-hover:text-red-400 transition-colors ml-auto" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity (placeholder for now) */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">Recent activity will appear here</p>
            <p className="text-sm text-gray-500 mt-2">
              Content updates, user actions, and system events
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.4s ease-out;
        }
      `}</style>
    </div>
  );
} 