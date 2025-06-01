'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  FileText,
  Settings,
  Users,
  MessageSquare,
  Upload,
  Briefcase,
  BookOpen,
} from 'lucide-react';

const items = [
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    title: 'Blog',
    href: '/dashboard/blog',
    icon: FileText,
  },
  {
    title: 'Team',
    href: '/dashboard/team',
    icon: Users,
  },
  {
    title: 'Messages',
    href: '/dashboard/messages',
    icon: MessageSquare,
  },
  {
    title: 'Projects',
    href: '/dashboard/projects',
    icon: Briefcase,
  },
  {
    title: 'Talents',
    href: '/dashboard/talents',
    icon: Users,
  },
  {
    title: 'API Docs',
    href: '/dashboard/api-docs',
    icon: BookOpen,
  },
  {
    title: 'Upload Demo',
    href: '/dashboard/upload-demo',
    icon: Upload,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2 p-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-red-600/10 hover:text-red-600 transition-colors',
              pathname === item.href ? 'bg-red-600/10 text-red-600' : 'text-gray-400'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
} 