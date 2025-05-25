"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  TooltipProps,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  BarChart3Icon, 
  PieChartIcon, 
  LineChartIcon, 
  RefreshCw 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";

interface DataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface AnalyticsChartProps {
  title: string;
  description?: string;
  data: DataPoint[];
  color?: string;
  chartType?: "area" | "bar" | "pie" | "line" | "radar";
  showLegend?: boolean;
  height?: number;
  isLoading?: boolean;
  onRefresh?: () => void;
  valueFormatter?: (value: number) => string;
  showControls?: boolean;
  multiSeries?: boolean;
  series?: { name: string; key: string; color: string }[];
  emptyMessage?: string;
}

const DEFAULT_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#0ea5e9', 
  '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#84cc16'
];

export function AnalyticsChart({ 
  title, 
  description,
  data, 
  color = "#ef4444",
  chartType: initialChartType = "area",
  showLegend = false,
  height = 300,
  isLoading = false,
  onRefresh,
  valueFormatter = (value) => value.toString(),
  showControls = false,
  multiSeries = false,
  series = [],
  emptyMessage = "No data available"
}: AnalyticsChartProps) {
  const [chartType, setChartType] = useState(initialChartType);
  
  // Generate colors for multi-series charts
  const colors = useMemo(() => {
    if (series.length > 0) {
      return series.map(s => s.color);
    }
    return DEFAULT_COLORS;
  }, [series]);
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-md p-3 shadow-md">
          <p className="text-gray-300 font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={`tooltip-${index}`} className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-300">
                {entry.name}: {valueFormatter(entry.value as number)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Empty state
  if (!isLoading && (!data || data.length === 0)) {
    return (
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-gray-200">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center" style={{ height: `${height}px` }}>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{emptyMessage}</p>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Loading state
  if (isLoading) {
    return (
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-gray-200">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-600" />
        </CardContent>
      </Card>
    );
  }
  
  // Function to render different chart types
  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="name" 
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tick={{ fill: "#9CA3AF" }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tick={{ fill: "#9CA3AF" }}
                tickFormatter={valueFormatter}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              
              {multiSeries && series.length > 0 ? (
                series.map((s, index) => (
                  <Bar 
                    key={s.key} 
                    dataKey={s.key} 
                    name={s.name} 
                    fill={s.color} 
                    radius={[4, 4, 0, 0]} 
                  />
                ))
              ) : (
                <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case "pie":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              {showLegend && <Legend />}
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );
        
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="name" 
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tick={{ fill: "#9CA3AF" }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tick={{ fill: "#9CA3AF" }}
                tickFormatter={valueFormatter}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              
              {multiSeries && series.length > 0 ? (
                series.map((s, index) => (
                  <Line 
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    name={s.name}
                    stroke={s.color}
                    activeDot={{ r: 6 }}
                    strokeWidth={2}
                  />
                ))
              ) : (
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case "radar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="name" tick={{ fill: "#9CA3AF" }} />
              <PolarRadiusAxis tick={{ fill: "#9CA3AF" }} />
              <Tooltip content={<CustomTooltip />} />
              {multiSeries && series.length > 0 ? (
                series.map((s, index) => (
                  <Radar
                    key={s.key}
                    name={s.name}
                    dataKey={s.key}
                    stroke={s.color}
                    fill={s.color}
                    fillOpacity={0.2}
                  />
                ))
              ) : (
                <Radar
                  name="Value"
                  dataKey="value"
                  stroke={color}
                  fill={color}
                  fillOpacity={0.2}
                />
              )}
              {showLegend && <Legend />}
            </RadarChart>
          </ResponsiveContainer>
        );
        
      default: // area chart
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="name" 
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tick={{ fill: "#9CA3AF" }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tick={{ fill: "#9CA3AF" }}
                tickFormatter={valueFormatter}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              
              {multiSeries && series.length > 0 ? (
                series.map((s, index) => (
                  <Area
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    name={s.name}
                    stroke={s.color}
                    fill={s.color}
                    fillOpacity={0.2}
                  />
                ))
              ) : (
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  fill={color}
                  fillOpacity={0.2}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-gray-800 dark:text-gray-200">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        
        {showControls && (
          <div className="flex items-center space-x-2">
            <Button 
              size="icon" 
              variant={chartType === "area" ? "default" : "outline"}
              className="h-8 w-8"
              onClick={() => setChartType("area")}
            >
              <LineChartIcon className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant={chartType === "bar" ? "default" : "outline"}
              className="h-8 w-8"
              onClick={() => setChartType("bar")}
            >
              <BarChart3Icon className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant={chartType === "pie" ? "default" : "outline"}
              className="h-8 w-8"
              onClick={() => setChartType("pie")}
            >
              <PieChartIcon className="h-4 w-4" />
            </Button>
            {onRefresh && (
              <Button 
                size="icon" 
                variant="outline"
                className="h-8 w-8"
                onClick={onRefresh}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px`, width: "100%" }}>
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
} 