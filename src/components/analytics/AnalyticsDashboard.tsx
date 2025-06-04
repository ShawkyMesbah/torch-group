"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import useSWR from 'swr';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  averageTimeOnSite: number;
  topPages: { path: string; views: number }[];
}

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
});

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [exportDataType, setExportDataType] = useState('overview');
  const [exportFormat, setExportFormat] = useState('csv');

  // Build the SWR key based on date range
  const analyticsKey = dateRange?.from && dateRange?.to
    ? `/api/analytics/stats?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`
    : null;

  const { data, error, isValidating, mutate } = useSWR<AnalyticsData>(analyticsKey, fetcher);

  const fetchAnalytics = () => {
    // Just trigger SWR revalidation
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
      // Construct the export URL with selected type and format
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
      
      // Determine file extension based on format
      const fileExtension = exportFormat === 'csv' ? 'csv' : 'xlsx'; // Assuming backend supports xlsx for Excel
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          onApply={fetchAnalytics}
        />

        <div className="flex items-center gap-2">
           <div className="space-y-1">
             <Label htmlFor="export-data-type" className="text-xs">Data Type</Label>
             <Select value={exportDataType} onValueChange={setExportDataType}>
               <SelectTrigger id="export-data-type" className="w-[140px] h-9">
                 <SelectValue placeholder="Select type" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="overview">Overview</SelectItem>
                 <SelectItem value="daily">Daily</SelectItem>
                 <SelectItem value="events">Event Types</SelectItem>
                 <SelectItem value="sources">Sources</SelectItem>
                 <SelectItem value="devices">Devices</SelectItem>
               </SelectContent>
             </Select>
           </div>
            <div className="space-y-1">
             <Label htmlFor="export-format" className="text-xs">Format</Label>
             <Select value={exportFormat} onValueChange={setExportFormat}>
               <SelectTrigger id="export-format" className="w-[100px] h-9">
                 <SelectValue placeholder="Select format" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="csv">CSV</SelectItem>
                 <SelectItem value="excel">Excel</SelectItem>
               </SelectContent>
             </Select>
           </div>
          <Button
            variant="outline"
            size="sm"
            onClick={exportData}
            disabled={isValidating || !dateRange?.from || !dateRange?.to}
            className="h-9 mt-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {isValidating ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded mt-4"></div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <p>Failed to fetch analytics data.</p>
        </div>
      ) : data ? (
        <>
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
              <CardHeader className="p-0 pb-2">
                 <CardTitle className="text-base font-medium">Top Pages (List)</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  {data.topPages.slice(0, 5).map((page) => (
                    <li key={page.path} className="flex justify-between items-center">
                      <span className="truncate mr-2">{page.path}</span>
                      <Badge variant="secondary" className="ml-auto flex-shrink-0">{page.views} views</Badge>
                    </li>
                  ))}
                </ul>
                 {data.topPages.length === 0 && (
                   <div className="text-center text-sm text-gray-500 dark:text-gray-400">No top pages for this period.</div>
                 )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Pages by Views</CardTitle>
              </CardHeader>
              <CardContent>
                 {data.topPages && data.topPages.length > 0 ? (
                   <ResponsiveContainer width="100%" height={300}>
                     <BarChart data={data.topPages.slice(0, 10)} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                       <CartesianGrid strokeDasharray="3 3" />
                       <XAxis dataKey="path" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                       <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                       <Tooltip />
                       <Legend />
                       <Bar dataKey="views" fill="#dc2626" radius={[4, 4, 0, 0]} />
                     </BarChart>
                   </ResponsiveContainer>
                 ) : (
                   <div className="text-center py-12 text-gray-500">
                     No top pages data available for this period.
                   </div>
                 )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Select a date range to view analytics data</p>
        </div>
      )}
    </div>
  );
} 