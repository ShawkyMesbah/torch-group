"use client";

import Link from 'next/link';
import { FileText, Users, MessageSquare, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const actions = [
  {
    title: 'New Blog Post',
    description: 'Create a new blog post',
    icon: FileText,
    href: '/dashboard/blog/new',
  },
  {
    title: 'Add Team Member',
    description: 'Add a new team member',
    icon: Users,
    href: '/dashboard/team/new',
  },
  {
    title: 'View Messages',
    description: 'Check unread messages',
    icon: MessageSquare,
    href: '/dashboard/messages',
  },
  {
    title: 'Manage Talents',
    description: 'Review talent applications',
    icon: Star,
    href: '/dashboard/talents',
  },
];

export default function QuickActions() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className={cn(
                "flex items-center p-4 rounded-lg",
                "bg-[#1e2943] hover:bg-[#252f4a]",
                "border border-gray-800",
                "transition-all duration-200 group"
              )}
            >
              <div className="p-2 bg-red-500/10 rounded-lg mr-4">
                <Icon className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-medium text-white group-hover:text-gray-200">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-400 group-hover:text-gray-300">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 