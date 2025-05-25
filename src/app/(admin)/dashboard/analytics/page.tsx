"use client";

import { useAnalytics } from "@/hooks/use-analytics";
import { StatsCard } from "@/components/ui/stats-card";
import { AnalyticsChart } from "@/components/ui/analytics-chart";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { ExportButton } from "@/components/ui/export-button";
import { DateRange } from "react-day-picker";
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Star, 
  Briefcase,
  AlertCircle,
  Eye,
  FileCheck,
  PhoneCall,
  MousePointer,
  Database,
  File,
  PieChart,
  BarChart3,
  LineChart,
  PieChart as PieChart2,
  LayoutDashboard,
  Activity,
  BarChart,
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  RefreshCw,
  Calendar,
  Download
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subDays, subMonths, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Define preset date ranges
const datePresets = [
  { 
    label: "Last 7 days", 
    value: "7days",
    range: () => ({
      from: subDays(new Date(), 6),
      to: new Date()
    })
  },
  { 
    label: "Last 30 days", 
    value: "30days",
    range: () => ({
      from: subDays(new Date(), 29),
      to: new Date()
    })
  },
  { 
    label: "This month", 
    value: "thisMonth",
    range: () => {
      const now = new Date();
      return {
        from: startOfMonth(now),
        to: now
      };
    }
  },
  { 
    label: "Last month", 
    value: "lastMonth",
    range: () => {
      const now = new Date();
      const lastMonth = subMonths(now, 1);
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth)
      };
    }
  },
  { 
    label: "Year to date", 
    value: "ytd",
    range: () => {
      const now = new Date();
      return {
        from: startOfYear(now),
        to: now
      };
    }
  },
  { 
    label: "All time", 
    value: "allTime",
    range: () => ({
      from: new Date(2023, 0, 1), // Start of project
      to: new Date()
    })
  }
];

export default function AnalyticsDashboardPage() {
  // State for data source and date range
  const [dataSourcePreference, setDataSourcePreference] = useState<string>("auto");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date()
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [isExporting, setIsExporting] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("7days");
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "json" | "pdf">("csv");
  const [exportType, setExportType] = useState("daily");
  
  // Fetch analytics data
  const analytics = useAnalytics(dataSourcePreference, dateRange);

  // Handle date preset change
  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    const selectedPreset = datePresets.find(p => p.value === preset);
    if (selectedPreset) {
      setDateRange(selectedPreset.range());
    }
  };
  
  // Format numbers with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Format percentages
  const formatPercent = (num: number): string => {
    return `${num}%`;
  };
  
  // Handle export
  const handleExport = async (format: "csv" | "excel" | "json" | "pdf", type: string = activeTab) => {
    try {
      setIsExporting(true);
      
      // Create query parameters for the export
      const params = new URLSearchParams();
      params.append('format', format);
      
      // Determine the data type based on active tab and selected chart
      let dataType = type || 'daily';
      
      params.append('type', dataType);
      
      if (dateRange?.from) {
        params.append('start', dateRange.from.toISOString());
      }
      
      if (dateRange?.to) {
        params.append('end', dateRange.to.toISOString());
      }

      if (dataSourcePreference !== 'auto') {
        params.append('source', dataSourcePreference);
      }
      
      // Create the URL for the export
      const url = `/api/analytics/export?${params.toString()}`;
      
      if (format === 'json') {
        // For JSON, we'll fetch and show a success message
        const response = await fetch(url);
        const data = await response.json();
        
        toast({
          title: "Export Successful",
          description: `Exported ${data.meta.count} records as JSON`,
        });

        // Close the dialog after successful export
        setExportDialogOpen(false);
      } else if (format === 'pdf') {
        // For PDF, we'll fetch and handle the response
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
          toast({
            title: "PDF Export Not Available",
            description: data.message || "PDF export is not available in this demo version.",
          });
        }

        // Close the dialog after export attempt
        setExportDialogOpen(false);
      } else {
        // For CSV and Excel, trigger a download
        window.location.href = url;
        
        // Close the dialog after initiating download
        setExportDialogOpen(false);

        // Show toast notification
        toast({
          title: "Export Started",
          description: `Your ${format.toUpperCase()} file is being downloaded.`,
        });
      }
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Handle refresh
  const handleRefresh = async () => {
    try {
      await analytics.refreshData();
      toast({
        title: "Data Refreshed",
        description: "Analytics data has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "There was an error refreshing the data. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Loading state
  if (analytics.loading) {
    return <AnalyticsDashboardSkeleton />;
  }
  
  // Error state
  if (analytics.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Failed to load analytics</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{analytics.error}</p>
        <Button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }
  
  // Get appropriate icon for data source
  const getDataSourceIcon = () => {
    switch (analytics.dataSource) {
      case 'database':
      case 'database_raw':
        return <Database className="h-4 w-4" />;
      case 'local_file':
        return <File className="h-4 w-4" />;
      case 'mock_data':
        return <PieChart className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track website performance and user engagement
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          {/* Date Range Presets */}
          <div className="flex items-center">
            <Select value={selectedPreset} onValueChange={handlePresetChange}>
              <SelectTrigger className="w-[160px] border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                {datePresets.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Date Range Picker */}
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
          
          {/* Advanced Export Button */}
          <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Export Analytics Data</DialogTitle>
                <DialogDescription>
                  Choose the type of data and format for your export
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label 
                    htmlFor="exportType" 
                    className="text-right font-medium col-span-1"
                  >
                    Data type
                  </label>
                  <Select 
                    value={exportType} 
                    onValueChange={setExportType}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily stats</SelectItem>
                      <SelectItem value="events">Events breakdown</SelectItem>
                      <SelectItem value="sources">Traffic sources</SelectItem>
                      <SelectItem value="devices">Device types</SelectItem>
                      <SelectItem value="pages">Top pages</SelectItem>
                      <SelectItem value="overview">Overview</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label 
                    htmlFor="exportFormat" 
                    className="text-right font-medium col-span-1"
                  >
                    Format
                  </label>
                  <Select 
                    value={exportFormat} 
                    onValueChange={(value) => setExportFormat(value as any)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-right font-medium col-span-1">Date range</div>
                  <div className="col-span-3 text-sm">
                    {dateRange?.from && dateRange?.to ? (
                      <>
                        {format(dateRange.from, "MMM d, yyyy")} to {format(dateRange.to, "MMM d, yyyy")}
                      </>
                    ) : (
                      "No date range selected"
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setExportDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  onClick={() => handleExport(exportFormat, exportType)}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Quick Export Button */}
          <ExportButton 
            onExport={(format) => handleExport(format)}
            isLoading={isExporting}
            disabled={analytics.loading}
            formats={["csv", "excel", "json"]}
            className="hidden md:flex" // Hide on mobile, use the dialog instead
          />
          
          {/* Data Source Selector */}
          <div className="flex items-center">
            <Select value={dataSourcePreference} onValueChange={setDataSourcePreference}>
              <SelectTrigger className="w-[160px] border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <SelectValue placeholder="Auto (Default)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (Default)</SelectItem>
                <SelectItem value="database">Live Database</SelectItem>
                <SelectItem value="local_file">File Storage</SelectItem>
                <SelectItem value="mock_data">Mock Data</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Date Range Indicator */}
      <div className="bg-gray-50 dark:bg-gray-900 p-2 px-4 rounded-md border border-gray-200 dark:border-gray-800 flex items-center">
        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Showing data from <strong>{dateRange?.from ? format(dateRange.from, "MMMM d, yyyy") : "unknown"}</strong> to <strong>{dateRange?.to ? format(dateRange.to, "MMMM d, yyyy") : "present"}</strong>
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-auto text-xs" 
          onClick={handleRefresh}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh
        </Button>
      </div>
      
      {/* Data Source Indicator */}
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              analytics.dataSource === 'database' || analytics.dataSource === 'database_raw' 
                ? 'bg-green-500' 
                : analytics.dataSource === 'local_file'
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
            }`}></div>
            <div className="flex items-center space-x-2">
              {getDataSourceIcon()}
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {analytics.dataSource === 'database' && 'Data source: Database (Prisma)'}
                {analytics.dataSource === 'database_raw' && 'Data source: Database (Raw SQL)'}
                {analytics.dataSource === 'local_file' && 'Data source: Local File Storage'}
                {analytics.dataSource === 'mock_data' && 'Data source: Mock Data (Demo Mode)'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:flex md:space-x-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Page Views"
              value={formatNumber(analytics.events.pageViews.total)}
              description={`${analytics.events.pageViews.growth >= 0 ? '+' : ''}${formatPercent(analytics.events.pageViews.growth)} from previous period`}
              icon={<Eye className="h-4 w-4 text-blue-500" />}
              trending={analytics.events.pageViews.growth >= 0 ? "up" : "down"}
            />
            <StatsCard
              title="Form Submissions"
              value={formatNumber(analytics.events.formSubmits.total)}
              description={`${analytics.events.formSubmits.growth >= 0 ? '+' : ''}${formatPercent(analytics.events.formSubmits.growth)} from previous period`}
              icon={<FileCheck className="h-4 w-4 text-emerald-500" />}
              trending={analytics.events.formSubmits.growth >= 0 ? "up" : "down"}
            />
            <StatsCard
              title="Phone Verifications"
              value={formatNumber(analytics.events.phoneVerified.total)}
              description={`${analytics.events.phoneVerified.growth >= 0 ? '+' : ''}${formatPercent(analytics.events.phoneVerified.growth)} from previous period`}
              icon={<PhoneCall className="h-4 w-4 text-purple-500" />}
              trending={analytics.events.phoneVerified.growth >= 0 ? "up" : "down"}
            />
            <StatsCard
              title="Talent Clicks"
              value={formatNumber(analytics.events.talentClicks.total)}
              description={`${analytics.events.talentClicks.growth >= 0 ? '+' : ''}${formatPercent(analytics.events.talentClicks.growth)} from previous period`}
              icon={<MousePointer className="h-4 w-4 text-amber-500" />}
              trending={analytics.events.talentClicks.growth >= 0 ? "up" : "down"}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl">Daily Activity</CardTitle>
                <CardDescription>Page views, form submissions and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart
                  data={analytics.dailyStats}
                  type="area"
                  xKey="date"
                  yKey="total"
                  height={300}
                />
              </CardContent>
            </Card>
            
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl">Traffic Sources</CardTitle>
                <CardDescription>Where visitors are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart
                  data={analytics.pageViewsBySource}
                  type="pie"
                  xKey="name"
                  yKey="value"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="traffic" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl">Traffic by Source</CardTitle>
                <CardDescription>Where your visitors are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart
                  data={analytics.pageViewsBySource}
                  type="pie"
                  xKey="name"
                  yKey="value"
                  height={300}
                />
              </CardContent>
            </Card>
            
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl">Traffic by Device</CardTitle>
                <CardDescription>Devices used to access the site</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart
                  data={analytics.pageViewsByDevice}
                  type="pie"
                  xKey="name"
                  yKey="value"
                  height={300}
                />
              </CardContent>
            </Card>
            
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl">Top Pages</CardTitle>
                <CardDescription>Most viewed pages on your site</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart
                  data={analytics.pageViewsByPage}
                  type="bar"
                  xKey="name"
                  yKey="value"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="engagement" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl">Daily Form Submissions</CardTitle>
                <CardDescription>Contact form and newsletter signups</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart
                  data={analytics.messagesData}
                  type="bar"
                  xKey="name"
                  yKey="value"
                  height={300}
                />
              </CardContent>
            </Card>
            
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl">Popular Talents</CardTitle>
                <CardDescription>Most viewed talent profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart
                  data={analytics.talentStats.map(item => ({
                    name: item.talentName,
                    value: item.clicks
                  }))}
                  type="bar"
                  xKey="name"
                  yKey="value"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="breakdown" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl">Daily Breakdown</CardTitle>
                <CardDescription>Detailed view of daily activity by type</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 px-4 font-medium">Date</th>
                      <th className="text-right py-2 px-4 font-medium">Page Views</th>
                      <th className="text-right py-2 px-4 font-medium">Form Submits</th>
                      <th className="text-right py-2 px-4 font-medium">Phone Verified</th>
                      <th className="text-right py-2 px-4 font-medium">Talent Clicks</th>
                      <th className="text-right py-2 px-4 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.dailyStats.map((day, index) => (
                      <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-2 px-4">{day.date}</td>
                        <td className="text-right py-2 px-4">{day.pageViews}</td>
                        <td className="text-right py-2 px-4">{day.formSubmits}</td>
                        <td className="text-right py-2 px-4">{day.phoneVerified}</td>
                        <td className="text-right py-2 px-4">{day.talentClicks}</td>
                        <td className="text-right py-2 px-4 font-medium">{day.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 px-6 py-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {analytics.dailyStats.length} days of data
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExport('csv', 'daily')}
                  disabled={isExporting}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="conversion" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl">Conversion Rates</CardTitle>
                <CardDescription>Key conversion metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart
                  data={analytics.conversionRates}
                  type="bar"
                  xKey="name"
                  yKey="value"
                  height={300}
                />
              </CardContent>
            </Card>
            
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl">Activity Comparison</CardTitle>
                <CardDescription>Page views vs conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex flex-col justify-center items-center">
                  {/* Placeholder for conversion funnel - will be implemented later */}
                  <PieChart className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-2" />
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400 max-w-xs">
                    Advanced conversion tracking will be available in the next update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AnalyticsDashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <Skeleton className="h-9 w-[240px]" />
          <Skeleton className="h-9 w-[100px]" />
          <Skeleton className="h-9 w-[160px]" />
        </div>
      </div>
      
      <Skeleton className="h-14 w-full" />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  );
} 