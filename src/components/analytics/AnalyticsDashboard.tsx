"use client";

import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Clock, 
  MousePointer,
  Activity,
  BarChart3,
  Globe,
  Smartphone,
  RefreshCw,
  Calendar,
  Filter
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import useSWR from 'swr';
import {
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import {
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  averageTimeOnSite: number;
  bounceRate: number;
  topPages: { path: string; views: number; change?: number }[];
  trafficSources: { source: string; visitors: number; percentage: number }[];
  deviceTypes: { device: string; sessions: number; percentage: number }[];
  dailyStats: { date: string; pageViews: number; visitors: number; conversions: number }[];
  conversionRate: number;
  totalSessions: number;
  newVsReturning: { new: number; returning: number };
  topCountries: { country: string; visitors: number; percentage: number }[];
  performance: {
    avgLoadTime: number;
    performanceScore: number;
    errorRate: number;
  };
}

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
});

// Custom metric card component
function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend,
  format = "number",
  className = ""
}: {
  title: string;
  value: number | string;
  change?: number;
  icon: any;
  trend?: "up" | "down" | "neutral";
  format?: "number" | "percent" | "time" | "currency";
  className?: string;
}) {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case "percent":
        return `${val.toFixed(1)}%`;
      case "time":
        return `${val}m`;
      case "currency":
        return `$${val.toLocaleString()}`;
      default:
        return val.toLocaleString();
    }
  };

  const getTrendIcon = () => {
    if (!change) return null;
    return change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (!change) return "text-gray-500";
    return change > 0 ? "text-green-600" : "torch-text-error";
  };

  return (
    <Card className={`relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
            <Icon className="h-5 w-5 torch-text-primary" />
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{Math.abs(change).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatValue(value)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced loading skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border animate-pulse">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        ))}
      </div>

      {/* Metrics skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="col-span-full p-6 animate-pulse">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
        </Card>
        
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  const [exportDataType, setExportDataType] = useState('overview');
  const [exportFormat, setExportFormat] = useState('csv');
  const [selectedTab, setSelectedTab] = useState('overview');

  // Build the SWR key based on date range
  const analyticsKey = dateRange?.from && dateRange?.to
    ? `/api/analytics/stats?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`
    : null;

  const { data, error, isValidating, mutate } = useSWR<AnalyticsData>(analyticsKey, fetcher, {
    refreshInterval: 60000, // Refresh every minute
    revalidateOnFocus: true
  });

  // Mock data for demonstration (remove when real API is ready)
  const mockData: AnalyticsData = useMemo(() => ({
    pageViews: 45623,
    uniqueVisitors: 8742,
    averageTimeOnSite: 3.4,
    bounceRate: 42.3,
    conversionRate: 3.8,
    totalSessions: 12456,
    newVsReturning: { new: 65, returning: 35 },
    topPages: [
      { path: '/', views: 15234, change: 12.3 },
      { path: '/about', views: 8456, change: -2.1 },
      { path: '/services', views: 6789, change: 8.7 },
      { path: '/contact', views: 4321, change: 15.2 },
      { path: '/blog', views: 3456, change: -5.4 }
    ],
    trafficSources: [
      { source: 'Organic Search', visitors: 4521, percentage: 51.7 },
      { source: 'Direct', visitors: 2134, percentage: 24.4 },
      { source: 'Social Media', visitors: 1345, percentage: 15.4 },
      { source: 'Referral', visitors: 742, percentage: 8.5 }
    ],
    deviceTypes: [
      { device: 'Desktop', sessions: 6234, percentage: 50.1 },
      { device: 'Mobile', sessions: 4567, percentage: 36.7 },
      { device: 'Tablet', sessions: 1655, percentage: 13.2 }
    ],
    dailyStats: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pageViews: Math.floor(Math.random() * 2000) + 1000,
      visitors: Math.floor(Math.random() * 500) + 200,
      conversions: Math.floor(Math.random() * 50) + 10
    })),
    topCountries: [
      { country: 'United States', visitors: 3456, percentage: 39.5 },
      { country: 'United Kingdom', visitors: 1234, percentage: 14.1 },
      { country: 'Canada', visitors: 987, percentage: 11.3 },
      { country: 'Australia', visitors: 654, percentage: 7.5 },
      { country: 'Germany', visitors: 543, percentage: 6.2 }
    ],
    performance: {
      avgLoadTime: 1.8,
      performanceScore: 92,
      errorRate: 0.3
    }
  }), []);

  const displayData = data || mockData;

  const fetchAnalytics = () => {
    mutate();
  };

  const exportData = async () => {
    if (!dateRange?.from || !dateRange?.to) {
       toast({
        title: "Selection Required",
        description: "Please select a date range to export data.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const exportUrl = `/api/analytics/export?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}&type=${exportDataType}&format=${exportFormat}`;
      
      const response = await fetch(exportUrl);
      
      if (!response.ok) {
         const errorText = await response.text();
         throw new Error(errorText || 'Failed to export data');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const fileExtension = exportFormat === 'csv' ? 'csv' : 'xlsx';
      a.download = `analytics-${exportDataType}-${dateRange.from.toLocaleDateString()}-${dateRange.to.toLocaleDateString()}.${fileExtension}`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export Successful",
        description: "Analytics data exported successfully.",
      });

    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "An error occurred during data export.",
        variant: "destructive",
      });
    }
  };

  const COLORS = ['#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d'];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="p-4 rounded-full bg-red-50 dark:bg-red-900/20 mb-4">
          <Activity className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Failed to load analytics data
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          We're having trouble fetching your analytics data. Please check your connection and try again.
        </p>
        <Button onClick={fetchAnalytics} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-xl p-6 border border-red-100 dark:border-red-900/20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30">
              <BarChart3 className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics Overview</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {dateRange?.from && dateRange?.to 
                  ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                  : 'Select a date range to view analytics'
                }
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          onApply={fetchAnalytics}
        />

        <div className="flex items-center gap-2">
              <Select value={exportDataType} onValueChange={setExportDataType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Data type" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="daily">Daily Stats</SelectItem>
                  <SelectItem value="sources">Traffic Sources</SelectItem>
                  <SelectItem value="devices">Device Types</SelectItem>
                  <SelectItem value="pages">Top Pages</SelectItem>
               </SelectContent>
             </Select>
              
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Format" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="csv">CSV</SelectItem>
                 <SelectItem value="excel">Excel</SelectItem>
               </SelectContent>
             </Select>
              
          <Button
            variant="outline"
            onClick={exportData}
            disabled={isValidating || !dateRange?.from || !dateRange?.to}
                className="gap-2"
          >
                <Download className="h-4 w-4" />
            Export
          </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={fetchAnalytics}
                disabled={isValidating}
                className={isValidating ? "animate-spin" : ""}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isValidating ? (
        <LoadingSkeleton />
      ) : (
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total Page Views"
                value={displayData.pageViews}
                change={12.3}
                icon={Eye}
                className="border-l-4 border-l-red-500"
              />
              <MetricCard
                title="Unique Visitors"
                value={displayData.uniqueVisitors}
                change={8.7}
                icon={Users}
                className="border-l-4 border-l-orange-500"
              />
              <MetricCard
                title="Avg. Session Duration"
                value={displayData.averageTimeOnSite}
                change={-2.1}
                icon={Clock}
                format="time"
                className="border-l-4 border-l-yellow-500"
              />
              <MetricCard
                title="Conversion Rate"
                value={displayData.conversionRate}
                change={5.4}
                icon={TrendingUp}
                format="percent"
                className="border-l-4 border-l-green-500"
              />
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Daily Trends */}
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-red-600" />
                    Daily Analytics Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={displayData.dailyStats}>
                      <defs>
                        <linearGradient id="pageViewsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6b7280" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#6b7280" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="pageViews"
                        stroke="#dc2626"
                        strokeWidth={2}
                        fill="url(#pageViewsGradient)"
                        name="Page Views"
                      />
                      <Area
                        type="monotone"
                        dataKey="visitors"
                        stroke="#ea580c"
                        strokeWidth={2}
                        fill="url(#visitorsGradient)"
                        name="Visitors"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
            </Card>

              {/* Top Pages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-red-600" />
                    Top Performing Pages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {displayData.topPages.slice(0, 5).map((page, index) => (
                      <div key={page.path} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-xs font-semibold text-red-600 dark:text-red-400">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{page.path}</p>
                            <p className="text-sm text-gray-500">{page.views.toLocaleString()} views</p>
                          </div>
                        </div>
                        {page.change && (
                          <Badge variant={page.change > 0 ? "default" : "secondary"} className="gap-1">
                            {page.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {Math.abs(page.change).toFixed(1)}%
                          </Badge>
                        )}
                      </div>
          ))}
        </div>
                </CardContent>
            </Card>

              {/* Device Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-red-600" />
                    Device Breakdown
                  </CardTitle>
              </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={displayData.deviceTypes}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="sessions"
                      >
                        {displayData.deviceTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any, name) => [
                          `${value.toLocaleString()} sessions`,
                          name
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
              {/* Traffic Sources */}
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {displayData.trafficSources.map((source, index) => (
                      <div key={source.source} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{source.source}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{source.visitors.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{source.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Countries */}
            <Card>
              <CardHeader>
                  <CardTitle>Top Countries</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                    {displayData.topCountries.map((country, index) => (
                      <div key={country.country} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-semibold">
                            {index + 1}
                          </div>
                          <span className="font-medium">{country.country}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{country.visitors.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{country.percentage}%</p>
                        </div>
                      </div>
                    ))}
                   </div>
              </CardContent>
            </Card>
          </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard
                title="Bounce Rate"
                value={displayData.bounceRate}
                change={-3.2}
                icon={MousePointer}
                format="percent"
              />
              <MetricCard
                title="Total Sessions"
                value={displayData.totalSessions}
                change={15.7}
                icon={Activity}
              />
              <MetricCard
                title="New vs Returning"
                value={`${displayData.newVsReturning.new}% / ${displayData.newVsReturning.returning}%`}
                icon={Users}
              />
        </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard
                title="Avg Load Time"
                value={`${displayData.performance.avgLoadTime}s`}
                change={-8.3}
                icon={Clock}
              />
              <MetricCard
                title="Performance Score"
                value={displayData.performance.performanceScore}
                change={4.2}
                icon={TrendingUp}
              />
              <MetricCard
                title="Error Rate"
                value={displayData.performance.errorRate}
                change={-12.5}
                icon={Activity}
                format="percent"
              />
          </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
} 