"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  change?: number;
  trend?: "up" | "down" | "neutral";
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  change,
  trend = "neutral",
  isLoading = false,
}: StatsCardProps) {
  if (isLoading) {
    return (
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </CardTitle>
          {icon && (
            <div className="h-4 w-4 text-gray-500 dark:text-gray-400">{icon}</div>
          )}
        </CardHeader>
        <CardContent>
          <div className="h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          {description && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-4 w-4 text-gray-500 dark:text-gray-400">{icon}</div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {value}
        </div>
        {(change !== undefined || description) && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {change !== undefined && (
              <span
                className={`inline-flex items-center mr-2 ${
                  trend === "up"
                    ? "text-green-500"
                    : trend === "down"
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {trend === "up" ? (
                  <ArrowUpIcon className="w-3 h-3 mr-1" />
                ) : trend === "down" ? (
                  <ArrowDownIcon className="w-3 h-3 mr-1" />
                ) : null}
                {change > 0 ? "+" : ""}
                {change}%
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
} 