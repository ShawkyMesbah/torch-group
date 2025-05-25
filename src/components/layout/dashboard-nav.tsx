"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  MessageSquare,
  Home,
  Upload,
  Shield,
  PenTool,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Talents",
    href: "/dashboard/talents",
    icon: Users,
  },
  {
    title: "Blog",
    href: "/dashboard/blog",
    icon: FileText,
  },
  {
    title: "New Post",
    href: "/dashboard/blog/new",
    icon: PenTool,
    parent: "/dashboard/blog",
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    title: "Uploads",
    href: "/dashboard/upload-demo",
    icon: Upload,
  },
  {
    title: "Email Templates",
    href: "/dashboard/settings/email-templates",
    icon: Mail,
    parent: "/dashboard/settings",
  },
  {
    title: "Permissions",
    href: "/dashboard/settings/permissions",
    icon: Shield,
    parent: "/dashboard/settings",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardNav() {
  const pathname = usePathname();

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Filter items - hide child items unless their parent is active
  const filteredItems = navigationItems.filter(item => {
    // Always show items without a parent
    if (!item.parent) return true;
    
    // Show child items only when the parent path is active
    return pathname.startsWith(item.parent);
  });

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto">
        <nav className="flex flex-wrap items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-1">
            {filteredItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(item.href, item.exact)
                    ? "bg-red-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.title}</span>
              </Link>
            ))}
          </div>
          <div>
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2">
              <Home className="h-4 w-4" />
              <span className="hidden md:inline">View Site</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
} 