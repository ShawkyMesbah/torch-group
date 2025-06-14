"use client";

import { useState } from "react";
import { UserRoleManager } from "@/components/dashboard/settings/UserRoleManager";
import { PermissionsMatrix, Permission, UserRole } from "@/components/dashboard/settings/PermissionsMatrix";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, ShieldAlert, ShieldCheck, Shield, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define permission sets
const permissions: Permission[] = [
  {
    name: "View Dashboard",
    description: "Access to view the admin dashboard",
    admin: true,
    editor: true,
    viewer: true
  },
  {
    name: "Manage Users",
    description: "Create, update, and delete user accounts",
    admin: true,
    editor: false,
    viewer: false
  },
  {
    name: "Manage Settings",
    description: "Configure site settings and preferences",
    admin: true,
    editor: false,
    viewer: false
  },
  {
    name: "Edit Content",
    description: "Create and modify blog posts, pages, and other content",
    admin: true,
    editor: true,
    viewer: false
  },
  {
    name: "Publish Content",
    description: "Publish or unpublish content items",
    admin: true,
    editor: true,
    viewer: false
  },
  {
    name: "Delete Content",
    description: "Permanently remove content items",
    admin: true,
    editor: false,
    viewer: false
  },
  {
    name: "View Analytics",
    description: "Access to analytics and reporting data",
    admin: true,
    editor: true,
    viewer: true
  },
  {
    name: "Manage Talents",
    description: "Create, edit, and delete talent profiles",
    admin: true,
    editor: true,
    viewer: false
  },
  {
    name: "Manage Files",
    description: "Upload, edit, and delete files and media",
    admin: true,
    editor: true,
    viewer: false
  },
  {
    name: "Manage Email Templates",
    description: "Edit email notification templates",
    admin: true,
    editor: false,
    viewer: false
  },
  {
    name: "View Contact Messages",
    description: "Access contact form submissions",
    admin: true,
    editor: true,
    viewer: true
  },
  {
    name: "Export Data",
    description: "Export data from the system",
    admin: true,
    editor: false,
    viewer: false
  }
];

export default function PermissionsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("users");

  const handleRoleUpdate = async (userId: string, newRole: UserRole): Promise<boolean> => {
    // In a real application, this would call an API endpoint
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Role Updated",
        description: `User role has been updated to ${newRole}.`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
      
      return false;
    }
  };
  
  const handleUserActivation = async (userId: string, activate: boolean): Promise<boolean> => {
    // In a real application, this would call an API endpoint
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: activate ? "User Activated" : "User Deactivated",
        description: `User has been ${activate ? "activated" : "deactivated"}.`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${activate ? "activate" : "deactivate"} user.`,
        variant: "destructive",
      });
      
      return false;
    }
  };
  
  const handleUserDelete = async (userId: string): Promise<boolean> => {
    // In a real application, this would call an API endpoint
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "User Deleted",
        description: "User has been permanently deleted.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive",
      });
      
      return false;
    }
  };
  
  const handleUserInvite = async (email: string, name: string, role: UserRole): Promise<boolean> => {
    // In a real application, this would call an API endpoint
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Invitation Sent",
        description: `Invitation has been sent to ${email} for the ${role} role.`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation.",
        variant: "destructive",
      });
      
      return false;
    }
  };
  
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      case 'EDITOR':
        return <ShieldCheck className="h-5 w-5 text-blue-500" />;
      case 'VIEWER':
        return <Shield className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Permissions & Access Control</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage user roles and permissions
        </p>
      </div>
      
      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="roles">Role Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-6">
          <UserRoleManager 
            onRoleUpdate={handleRoleUpdate}
            onUserActivation={handleUserActivation}
            onUserDelete={handleUserDelete}
            onUserInvite={handleUserInvite}
          />
        </TabsContent>
        
        <TabsContent value="roles" className="mt-6">
          <PermissionsMatrix permissions={permissions} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 