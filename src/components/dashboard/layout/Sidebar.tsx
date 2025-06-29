"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  MessageSquare, 
  BarChart, 
  Image as ImageIcon,
  Star,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { 
    name: 'Content', 
    href: '/dashboard/content',
    icon: Layers,
    children: [
      { name: 'Homepage', href: '/dashboard/content/homepage' },
      { name: 'Services', href: '/dashboard/content/services' },
      { name: 'About', href: '/dashboard/content/about' },
    ]
  },
  { name: 'Blog', href: '/dashboard/blog', icon: FileText },
  { name: 'Talents', href: '/dashboard/talents', icon: Star },
  { name: 'Media', href: '/dashboard/media', icon: ImageIcon },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
  { name: 'Users', href: '/dashboard/settings/users', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-[#1a2234] border-r border-gray-800">
      <nav className="h-full flex flex-col">
        <div className="space-y-1 p-4">
          {navigation.map((item) => (
            <div key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-lg",
                  "transition-colors duration-200",
                  isActive(item.href)
                    ? "bg-red-500/10 text-red-500"
                    : "text-gray-400 hover:text-white hover:bg-[#1e2943]"
                )}
              >
                <item.icon className={cn(
                  "mr-3 h-5 w-5",
                  isActive(item.href)
                    ? "text-red-500"
                    : "text-gray-400 group-hover:text-white"
                )} />
                {item.name}
              </Link>
              
              {item.children && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={cn(
                        "flex items-center px-4 py-2 text-sm font-medium rounded-lg",
                        "transition-colors duration-200",
                        isActive(child.href)
                          ? "bg-red-500/10 text-red-500"
                          : "text-gray-400 hover:text-white hover:bg-[#1e2943]"
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
} 