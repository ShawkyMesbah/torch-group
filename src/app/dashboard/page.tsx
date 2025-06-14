import { Metadata } from "next";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Analytics | Torch Group Dashboard",
  description: "View and analyze website traffic and user engagement metrics",
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor website traffic and user engagement metrics
        </p>
      </div>
      <AnalyticsDashboard />
    </div>
  );
} 