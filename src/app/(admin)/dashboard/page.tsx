"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAPI } from "@/hooks/useAPI";
import { DataLoader } from "@/components/ui/data-loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Newspaper, MessageSquare, Users, ArrowUpRight, Activity, Clock } from "lucide-react";

// Activity item type
interface ActivityItem {
  id: string;
  action: string;
  description: string;
  relativeTime: string;
  type: "talent" | "blog" | "message";
}

export default function DashboardPage() {
  const { 
    data: stats, 
    loading, 
    error, 
    fetch: fetchStats 
  } = useAPI<{
    talents: number;
    blogPosts: number;
    messages: number;
  }>({
    url: "/api/dashboard/stats",
    initialData: null,
  });
  
  const {
    data: activities,
    loading: activitiesLoading,
    error: activitiesError,
    fetch: fetchActivities
  } = useAPI<ActivityItem[]>({
    url: "/api/dashboard/activity",
    initialData: [],
  });
  
  // Fetch stats and activities on component mount
  useEffect(() => {
    fetchStats();
    fetchActivities();
  }, [fetchStats, fetchActivities]);

  // Dashboard cards data
  const dashboardCards = [
    {
      title: "Total Talents",
      value: stats?.talents || 0,
      description: "Active talent profiles",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-900/30",
      borderColor: "border-blue-700",
    },
    {
      title: "Blog Posts",
      value: stats?.blogPosts || 0,
      description: "Published articles",
      icon: Newspaper,
      color: "text-purple-500",
      bgColor: "bg-purple-900/30",
      borderColor: "border-purple-700",
    },
    {
      title: "Recent Messages",
      value: stats?.messages || 0,
      description: "Unread messages",
      icon: MessageSquare,
      color: "text-amber-500",
      bgColor: "bg-amber-900/30",
      borderColor: "border-amber-700",
    },
  ];
  
  // Function to get the appropriate icon for an activity type
  const getActivityIcon = (type: string) => {
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
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
        <p className="text-gray-400">Overview of your Torch Group site activity</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-gray-900 border border-gray-800 p-1">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white data-[state=active]:shadow-none rounded-md"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white data-[state=active]:shadow-none rounded-md"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="activity" 
            className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white data-[state=active]:shadow-none rounded-md"
          >
            Recent Activity
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <DataLoader
            isLoading={loading}
            error={error}
            data={stats ? [stats] : []}
            onRetry={fetchStats}
            emptyMessage="Could not load dashboard statistics"
          >
            {() => (
              <>
                <div className="grid gap-5 md:grid-cols-3">
                  {dashboardCards.map((card, i) => (
                    <Card 
                      key={i} 
                      className={`dashboard-card border ${card.borderColor} bg-gray-900/70 backdrop-blur-sm shadow-lg`}
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white">
                          {card.title}
                        </CardTitle>
                        <div className={`${card.bgColor} p-2 rounded-full backdrop-blur-md border border-opacity-50 ${card.borderColor}`}>
                          <card.icon className={`h-5 w-5 ${card.color}`} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-1 text-white">{card.value}</div>
                        <p className="text-xs text-gray-400 flex items-center">
                          {card.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Quick Actions Card */}
                  <Card className="dashboard-card border border-gray-800 bg-gray-900/70 backdrop-blur-sm shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center">
                        <Activity className="mr-2 h-5 w-5 text-red-500" />
                        Quick Actions
                      </CardTitle>
                      <CardDescription>Common tasks you might want to perform</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: "New Blog Post", icon: Newspaper, href: "/dashboard/blog/new" },
                        { label: "Add Talent", icon: Users, href: "/dashboard/talents/new" },
                        { label: "View Messages", icon: MessageSquare, href: "/dashboard/messages" },
                      ].map((action, i) => (
                        <a 
                          key={i}
                          href={action.href}
                          className="flex items-center justify-between p-3 rounded-md border border-gray-800 bg-gray-800/50 hover:bg-gray-800 transition-colors group"
                        >
                          <div className="flex items-center">
                            <action.icon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-white" />
                            <span className="text-sm font-medium text-gray-200">{action.label}</span>
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-white" />
                        </a>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Recent Activity Card */}
                  <Card className="dashboard-card border border-gray-800 bg-gray-900/70 backdrop-blur-sm shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-red-500" />
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
                </div>
              </>
            )}
          </DataLoader>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="dashboard-card border border-gray-800 bg-gray-900/70 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Analytics Overview</CardTitle>
              <CardDescription>Detailed statistics and metrics</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[300px]">
              <div className="text-center text-gray-400">
                <BarChart className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <p className="mb-2">Analytics dashboard coming soon</p>
                <p className="text-sm text-gray-500">Visit the Analytics page for detailed reports</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="dashboard-card border border-gray-800 bg-gray-900/70 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Activity Log</CardTitle>
              <CardDescription>Recent changes and updates</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[300px]">
              <div className="text-center text-gray-400">
                <Activity className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <p className="mb-2">Detailed activity log coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 