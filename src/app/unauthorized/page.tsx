"use client";

import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

export default function UnauthorizedPage() {
  const [authStatus, setAuthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Check auth status for debugging purposes
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/check-config", { 
          credentials: "include" 
        });
        const data = await res.json();
        setAuthStatus(data);
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white">
      <div className="max-w-md w-full mx-auto text-center space-y-6">
        <div className="relative w-24 h-24 mx-auto">
          <ShieldAlert className="w-full h-full text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold">Access Denied</h1>
        
        <p className="text-gray-400">
          You don't have permission to access this page or you need to log in.
        </p>
        
        <div className="mt-4 bg-gray-900 p-4 rounded-md text-left">
          <p className="text-sm text-gray-300">
            You may need to log in with an account that has the required permissions.
          </p>
        </div>
        
        {loading ? (
          <div className="mt-4 p-4 bg-blue-900/20 rounded-md">
            <p className="text-blue-400 text-sm">Checking authentication status...</p>
          </div>
        ) : authStatus ? (
          <div className="mt-4 p-4 bg-gray-800 rounded-md text-left overflow-auto max-h-32">
            <p className="text-xs font-mono text-gray-400">
              {JSON.stringify(authStatus, null, 2)}
            </p>
          </div>
        ) : null}
        
        <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 border border-red-600 rounded-md shadow-sm text-base font-medium text-white bg-transparent hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Return to Home
          </Link>
          
          <Link
            href="/admin-login"
            className="inline-flex items-center justify-center px-4 py-2 border border-red-600 rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Admin Login
          </Link>
          
          <Link
            href="/auth-bypass"
            className="inline-flex items-center justify-center px-4 py-2 border border-blue-600 rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Auth Bypass
          </Link>
        </div>
      </div>
    </div>
  );
} 