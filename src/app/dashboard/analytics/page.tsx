import { Metadata } from "next";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Analytics Dashboard | Torch Group",
  description: "Comprehensive analytics and insights for website performance, user engagement, and business metrics",
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Monitor website traffic, user engagement metrics, and performance insights with comprehensive analytics data.
        </p>
      </div>
      <AnalyticsDashboard />
      </div>
    </div>
  );
} 