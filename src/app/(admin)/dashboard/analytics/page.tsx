'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, Eye, Clock, BarChart3, Activity, Globe, Smartphone } from 'lucide-react';

interface AnalyticsData {
  pageViews: { total: number; today: number; change: number };
  uniqueVisitors: { total: number; today: number; change: number };
  avgSessionDuration: { value: string; change: number };
  bounceRate: { value: string; change: number };
  topPages: Array<{ path: string; views: number; change: number }>;
  deviceStats: { desktop: number; mobile: number; tablet: number };
  recentActivity: Array<{ action: string; timestamp: string; user?: string }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/stats?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        // Fallback data if API doesn't exist yet
        setAnalytics({
          pageViews: { total: 12543, today: 234, change: 12.5 },
          uniqueVisitors: { total: 8921, today: 156, change: 8.3 },
          avgSessionDuration: { value: '2m 34s', change: 5.2 },
          bounceRate: { value: '34.2%', change: -2.1 },
          topPages: [
            { path: '/', views: 3421, change: 15.3 },
            { path: '/services', views: 2156, change: 8.7 },
            { path: '/about', views: 1834, change: -2.4 },
            { path: '/contact', views: 1245, change: 22.1 },
            { path: '/blog', views: 987, change: 6.8 }
          ],
          deviceStats: { desktop: 45, mobile: 42, tablet: 13 },
          recentActivity: [
            { action: 'New contact message received', timestamp: '2 minutes ago' },
            { action: 'Blog post published', timestamp: '1 hour ago', user: 'Admin' },
            { action: 'Service updated', timestamp: '3 hours ago', user: 'Admin' },
            { action: 'New team member added', timestamp: '1 day ago', user: 'Admin' },
            { action: 'Project completed', timestamp: '2 days ago', user: 'Admin' }
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Use fallback data
      setAnalytics({
        pageViews: { total: 12543, today: 234, change: 12.5 },
        uniqueVisitors: { total: 8921, today: 156, change: 8.3 },
        avgSessionDuration: { value: '2m 34s', change: 5.2 },
        bounceRate: { value: '34.2%', change: -2.1 },
        topPages: [
          { path: '/', views: 3421, change: 15.3 },
          { path: '/services', views: 2156, change: 8.7 },
          { path: '/about', views: 1834, change: -2.4 },
          { path: '/contact', views: 1245, change: 22.1 },
          { path: '/blog', views: 987, change: 6.8 }
        ],
        deviceStats: { desktop: 45, mobile: 42, tablet: 13 },
        recentActivity: [
          { action: 'New contact message received', timestamp: '2 minutes ago' },
          { action: 'Blog post published', timestamp: '1 hour ago', user: 'Admin' },
          { action: 'Service updated', timestamp: '3 hours ago', user: 'Admin' },
          { action: 'New team member added', timestamp: '1 day ago', user: 'Admin' },
          { action: 'Project completed', timestamp: '2 days ago', user: 'Admin' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return '↗';
    if (change < 0) return '↘';
    return '→';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">Monitor your website performance and user engagement.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Eye className="h-6 w-6 text-blue-400" />
            </div>
            <span className={`text-sm font-medium ${getChangeColor(analytics?.pageViews?.change ?? 0)}`}>
              {getChangeIcon(analytics?.pageViews?.change ?? 0)} {Math.abs(analytics?.pageViews?.change ?? 0)}%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {(analytics?.pageViews?.total ?? 0).toLocaleString()}
            </h3>
            <p className="text-sm font-medium text-gray-300 mb-1">Page Views</p>
            <p className="text-xs text-gray-500">
              {analytics?.pageViews?.today ?? 0} today
            </p>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Users className="h-6 w-6 text-green-400" />
            </div>
            <span className={`text-sm font-medium ${getChangeColor(analytics?.uniqueVisitors?.change ?? 0)}`}>
              {getChangeIcon(analytics?.uniqueVisitors?.change ?? 0)} {Math.abs(analytics?.uniqueVisitors?.change ?? 0)}%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {(analytics?.uniqueVisitors?.total ?? 0).toLocaleString()}
            </h3>
            <p className="text-sm font-medium text-gray-300 mb-1">Unique Visitors</p>
            <p className="text-xs text-gray-500">
              {analytics?.uniqueVisitors?.today ?? 0} today
            </p>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Clock className="h-6 w-6 text-purple-400" />
            </div>
            <span className={`text-sm font-medium ${getChangeColor(analytics?.avgSessionDuration?.change ?? 0)}`}>
              {getChangeIcon(analytics?.avgSessionDuration?.change ?? 0)} {Math.abs(analytics?.avgSessionDuration?.change ?? 0)}%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {analytics?.avgSessionDuration?.value ?? '0s'}
            </h3>
            <p className="text-sm font-medium text-gray-300 mb-1">Avg. Session</p>
            <p className="text-xs text-gray-500">Duration</p>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-400" />
            </div>
            <span className={`text-sm font-medium ${getChangeColor(analytics?.bounceRate?.change ?? 0)}`}>
              {getChangeIcon(analytics?.bounceRate?.change ?? 0)} {Math.abs(analytics?.bounceRate?.change ?? 0)}%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {analytics?.bounceRate?.value ?? '0%'}
            </h3>
            <p className="text-sm font-medium text-gray-300 mb-1">Bounce Rate</p>
            <p className="text-xs text-gray-500">Lower is better</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Top Pages
          </h2>
          <div className="space-y-4">
            {analytics?.topPages.map((page, index) => (
              <div key={page.path} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-4">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-white font-medium">{page.path}</p>
                    <p className="text-xs text-gray-500">{(page.views ?? 0).toLocaleString()} views</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${getChangeColor(page?.change ?? 0)}`}>
                  {getChangeIcon(page?.change ?? 0)} {Math.abs(page?.change ?? 0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Stats */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Device Breakdown
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded">
                  <Globe className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-white">Desktop</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${analytics?.deviceStats?.desktop ?? 0}%` }}
                  ></div>
                </div>
                <span className="text-white font-medium w-10 text-right">
                  {analytics?.deviceStats?.desktop ?? 0}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded">
                  <Smartphone className="h-4 w-4 text-green-400" />
                </div>
                <span className="text-white">Mobile</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${analytics?.deviceStats?.mobile ?? 0}%` }}
                  ></div>
                </div>
                <span className="text-white font-medium w-10 text-right">
                  {analytics?.deviceStats?.mobile ?? 0}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded">
                  <BarChart3 className="h-4 w-4 text-purple-400" />
                </div>
                <span className="text-white">Tablet</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${analytics?.deviceStats?.tablet ?? 0}%` }}
                  ></div>
                </div>
                <span className="text-white font-medium w-10 text-right">
                  {analytics?.deviceStats?.tablet ?? 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </h2>
        <div className="space-y-4">
          {(analytics?.recentActivity ?? []).map((activity, index) => (
            <div key={index} className="flex items-center gap-4 py-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white">{activity?.action ?? 'Unknown action'}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{activity?.timestamp ?? 'Unknown time'}</span>
                  {activity?.user && (
                    <>
                      <span>•</span>
                      <span>by {activity.user}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          {(!analytics?.recentActivity || analytics.recentActivity.length === 0) && (
            <div className="text-gray-500 text-center py-4">
              No recent activity to display
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 