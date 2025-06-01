"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  averageTimeOnSite: number;
  topPages: { path: string; views: number }[];
}

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);

  const fetchAnalytics = async () => {
    if (!dateRange?.from || !dateRange?.to) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/stats?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async () => {
    if (!data || !dateRange?.from || !dateRange?.to) return;
    
    try {
      const response = await fetch(`/api/analytics/export?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`);
      if (!response.ok) throw new Error('Failed to export data');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${dateRange.from.toLocaleDateString()}-${dateRange.to.toLocaleDateString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export analytics data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          onApply={fetchAnalytics}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={exportData}
          disabled={!data || isLoading}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded mt-4"></div>
            </Card>
          ))}
        </div>
      ) : data ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Page Views</h3>
            <p className="mt-2 text-3xl font-semibold">{data.pageViews}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Unique Visitors</h3>
            <p className="mt-2 text-3xl font-semibold">{data.uniqueVisitors}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Avg. Time on Site</h3>
            <p className="mt-2 text-3xl font-semibold">{data.averageTimeOnSite}m</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Top Pages</h3>
            <ul className="mt-2 space-y-1">
              {data.topPages.slice(0, 3).map((page) => (
                <li key={page.path} className="text-sm">
                  {page.path} ({page.views})
                </li>
              ))}
            </ul>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Select a date range to view analytics data</p>
        </div>
      )}
    </div>
  );
} 