import { ReactNode } from 'react';
import Link from 'next/link';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-primary-600">Torch Admin</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-100">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/dashboard/pages" className="block p-2 rounded hover:bg-gray-100">
                Pages
              </Link>
            </li>
            <li>
              <Link href="/dashboard/blog" className="block p-2 rounded hover:bg-gray-100">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/dashboard/projects" className="block p-2 rounded hover:bg-gray-100">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/dashboard/team" className="block p-2 rounded hover:bg-gray-100">
                Team
              </Link>
            </li>
            <li>
              <Link href="/dashboard/messages" className="block p-2 rounded hover:bg-gray-100">
                Messages
              </Link>
            </li>
            <li>
              <Link href="/dashboard/users" className="block p-2 rounded hover:bg-gray-100">
                Users
              </Link>
            </li>
            <li>
              <Link href="/dashboard/settings" className="block p-2 rounded hover:bg-gray-100">
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900">
              Notifications
            </button>
            <div className="relative">
              <button className="flex items-center space-x-2">
                <span>Admin User</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 