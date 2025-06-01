"use client";

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function SimpleDashboardContent() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get user info from cookies
    const sessionData = document.cookie
      .split(';')
      .find(row => row.trim().startsWith('session='));
    
    if (sessionData) {
      try {
        const token = sessionData.split('=')[1];
        const decodedData = JSON.parse(atob(token));
        setUser(decodedData);
      } catch (error) {
        console.error('Failed to parse session data', error);
      }
    }
    
    setLoading(false);
  }, []);

  const handleLogout = () => {
    // Clear cookies
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Redirect to login
    window.location.href = '/login';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Simple Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Welcome to Your Dashboard</h2>
          
          {user ? (
            <div className="space-y-2">
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <Button 
                onClick={handleLogout}
                className="mt-4 bg-red-500 hover:bg-red-600"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-red-500">No user session found. Please log in again.</p>
              <Button 
                onClick={() => window.location.href = '/login'} 
                className="mt-4"
              >
                Go to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>Total Projects: 12</li>
              <li>Active Talents: 8</li>
              <li>Blog Posts: 24</li>
              <li>Team Members: 6</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li><a href="/dashboard/projects" className="text-blue-500 hover:underline">Manage Projects</a></li>
              <li><a href="/dashboard/team" className="text-blue-500 hover:underline">Manage Team Members</a></li>
              <li><a href="/dashboard/blog" className="text-blue-500 hover:underline">Manage Blog Posts</a></li>
              <li><a href="/dashboard/talents" className="text-blue-500 hover:underline">Manage Talents</a></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SimpleDashboard() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        <span className="ml-3 text-lg">Loading dashboard...</span>
      </div>
    }>
      <SimpleDashboardContent />
    </Suspense>
  );
} 