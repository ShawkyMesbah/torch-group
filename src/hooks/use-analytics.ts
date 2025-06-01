import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "@/components/ui/use-toast";

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  averageTimeOnSite: number;
  topPages: { path: string; views: number }[];
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (dateRange?: DateRange) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (dateRange?.from) {
        params.append("from", dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        params.append("to", dateRange.to.toISOString());
      }

      const response = await fetch(`/api/analytics/stats?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      const analyticsData: AnalyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async (dateRange?: DateRange) => {
    try {
      const params = new URLSearchParams();
      if (dateRange?.from) {
        params.append("from", dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        params.append("to", dateRange.to.toISOString());
      }

      window.location.href = `/api/analytics/export?${params.toString()}`;
      toast({
        title: "Export Started",
        description: "Your data export has started",
      });
    } catch (err) {
      toast({
        title: "Export Failed",
        description: "Failed to export analytics data",
        variant: "destructive",
      });
    }
  };

  const syncData = async () => {
    try {
      const response = await fetch("/api/analytics/sync", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to sync analytics data");
      }

      const result = await response.json();
      toast({
        title: "Sync Complete",
        description: result.message,
      });

      // Refresh the data after sync
      await fetchAnalytics();
    } catch (err) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync analytics data",
        variant: "destructive",
      });
    }
  };

  return {
    data,
    isLoading,
    error,
    fetchAnalytics,
    exportData,
    syncData,
  };
} 