import { FileText, Users, MessageSquare, Star } from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import prisma from '@/lib/prisma';

async function getStats() {
  const [blogPosts, users, messages, talents] = await Promise.all([
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.user.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.talent.count({ where: { status: 'ACTIVE' } })
  ]);

  return {
    blogPosts,
    users,
    messages,
    talents
  };
}

export async function DashboardStats() {
  const stats = await getStats();

  const cards = [
    {
      title: 'Blog Posts',
      value: stats.blogPosts,
      icon: FileText,
      href: '/dashboard/blog'
    },
    {
      title: 'Users',
      value: stats.users,
      icon: Users,
      href: '/dashboard/settings/users'
    },
    {
      title: 'Messages',
      value: stats.messages,
      icon: MessageSquare,
      href: '/dashboard/messages'
    },
    {
      title: 'Active Talents',
      value: stats.talents,
      icon: Star,
      href: '/dashboard/talents'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-comfortable">
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