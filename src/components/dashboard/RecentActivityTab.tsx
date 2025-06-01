"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataLoader } from "@/components/ui/data-loader";
import { Activity, Users, Newspaper, MessageSquare } from "lucide-react";
import React from "react";

interface ActivityItem {
  id: string;
  action: string;
  description: string;
  relativeTime: string;
  type: "talent" | "blog" | "message";
}

interface RecentActivityTabProps {
  activities: ActivityItem[];
  activitiesLoading: boolean;
  activitiesError: any;
  fetchActivities: () => void;
}

function getActivityIcon(type: string) {
  switch (type) {
    case "talent":
      return Users;
    case "blog":
      return Newspaper;
    case "message":
      return MessageSquare;
    default:
      return Activity;
  }
}

export function RecentActivityTab({ activities, activitiesLoading, activitiesError, fetchActivities }: RecentActivityTabProps) {
  return (
    <Card className="dashboard-card border border-gray-800 bg-gray-900/70 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Activity className="mr-2 h-5 w-5 text-red-500" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest actions on your site</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <DataLoader
          isLoading={activitiesLoading}
          error={activitiesError}
          data={activities}
          onRetry={fetchActivities}
          emptyMessage="No recent activities found"
        >
          {() => (
            <>
              {!activities || activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent activities available</p>
                </div>
              ) : (
                <>
                  {activities.map((activity) => {
                    const ActivityIcon = getActivityIcon(activity.type);
                    return (
                      <div key={activity.id} className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div className="p-2 rounded-full bg-gray-800 border border-gray-700">
                            <ActivityIcon className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-white">{activity.action}</p>
                          <p className="text-xs text-gray-400">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.relativeTime}</p>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </>
          )}
        </DataLoader>
      </CardContent>
    </Card>
  );
} 