import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, ShieldAlert, ShieldCheck, Shield, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type UserRole = "ADMIN" | "EDITOR" | "VIEWER";

export interface Permission {
  name: string;
  description: string;
  admin: boolean;
  editor: boolean;
  viewer: boolean;
}

interface PermissionsMatrixProps {
  permissions: Permission[];
}

export function PermissionsMatrix({ permissions }: PermissionsMatrixProps) {
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
    <Card>
      <CardHeader>
        <CardTitle>Role Permissions Matrix</CardTitle>
        <CardDescription>
          This table shows what each role can access and modify in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Permission</TableHead>
                <TableHead className="w-[250px]">Description</TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    {getRoleIcon('ADMIN')}
                    <span>Admin</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    {getRoleIcon('EDITOR')}
                    <span>Editor</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    {getRoleIcon('VIEWER')}
                    <span>Viewer</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.name} className="transition-shadow hover:shadow-md focus-within:shadow-md">
                  <TableCell className="font-medium">{permission.name}</TableCell>
                  <TableCell>{permission.description}</TableCell>
                  <TableCell className="text-center">
                    {permission.admin ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" aria-label="Admin: allowed" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400 dark:text-gray-700 mx-auto" aria-label="Admin: denied" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {permission.editor ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" aria-label="Editor: allowed" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400 dark:text-gray-700 mx-auto" aria-label="Editor: denied" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {permission.viewer ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" aria-label="Viewer: allowed" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400 dark:text-gray-700 mx-auto" aria-label="Viewer: denied" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-100 dark:border-blue-900">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-700 dark:text-blue-300">About Roles</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                <strong>Admins</strong> have full access to all features and can manage users and system settings.
                <br />
                <strong>Editors</strong> can create and edit content, but cannot change system settings or manage users.
                <br />
                <strong>Viewers</strong> have read-only access to content and analytics.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 