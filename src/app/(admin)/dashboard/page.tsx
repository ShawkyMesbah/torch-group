import { Suspense } from 'react';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import { UnifiedLoading } from '@/components/loading/UnifiedLoading';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Manage your content, monitor performance, and control your site settings.
        </p>
      </div>

      <Suspense fallback={<UnifiedLoading />}>
        <DashboardOverview />
      </Suspense>
    </div>
  );
} 