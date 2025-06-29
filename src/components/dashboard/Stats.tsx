'use client';

import { FileText, Users, MessageSquare, Star } from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface StatsData {
  blogPosts: number;
  users: number;
  messages: number;
  talents: number;
}

export function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load dashboard stats');
        toast.error('Failed to load dashboard statistics');
        // Set default values on error
        setStats({
          blogPosts: 0,
          users: 0,
          messages: 0,
          talents: 0
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[140px] bg-[#1a2234] rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Blog Posts',
      value: stats?.blogPosts ?? 0,
      icon: FileText,
      href: '/dashboard/blog'
    },
    {
      title: 'Users',
      value: stats?.users ?? 0,
      icon: Users,
      href: '/dashboard/settings/users'
    },
    {
      title: 'Messages',
      value: stats?.messages ?? 0,
      icon: MessageSquare,
      href: '/dashboard/messages'
    },
    {
      title: 'Active Talents',
      value: stats?.talents ?? 0,
      icon: Star,
      href: '/dashboard/talents'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <DashboardCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          href={card.href}
        />
      ))}
    </div>
  );
} 