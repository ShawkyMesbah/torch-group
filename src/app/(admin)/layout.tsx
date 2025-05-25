import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import AdminLayoutClient from './admin-layout-client';
import { cookies } from 'next/headers';

// Server Component to handle authentication
export default async function AdminLayout({ children }: { children: ReactNode }) {
  try {
    // Simply check for the presence of session cookies
    const cookieStore = await cookies();
    const cookieNames = cookieStore.getAll().map((c: { name: string }) => c.name);
    
    const hasSessionCookie = 
      cookieNames.includes("next-auth.session-token") || 
      cookieNames.includes("__Secure-next-auth.session-token");
    
    // If no auth cookie found, redirect to unauthorized
    if (!hasSessionCookie) {
      console.log("No auth cookie found, redirecting to unauthorized");
      return redirect("/unauthorized");
    }
    
    // If auth cookie exists, create default user info for the client
    const userInfo = {
      name: "Admin User",
      email: "admin@torchgroup.co",
      role: "ADMIN",
      isAdmin: true
    };
    
    return <AdminLayoutClient userInfo={userInfo}>{children}</AdminLayoutClient>;
  } catch (error) {
    console.error("Error in AdminLayout:", error);
    return redirect("/unauthorized");
  }
} 