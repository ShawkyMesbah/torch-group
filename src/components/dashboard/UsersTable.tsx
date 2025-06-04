"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus, Users, Loader2, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileUpload } from "@/components/ui/file-upload";
import { format } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { useAuthorization } from '@/hooks/useAuthorization';

// Match the form type from the page
export type FormValues = {
  name: string;
  email: string;
  password?: string;
  role: "USER" | "STAFF" | "ADMIN";
  image?: string;
};

type UserRole = "USER" | "STAFF" | "ADMIN";

interface UsersTableProps {
  users: any[];
  loading: boolean;
  error: any;
  filteredUsers: any[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  selectedUser: any;
  setSelectedUser: (user: any) => void;
  createForm: UseFormReturn<FormValues>;
  editForm: UseFormReturn<FormValues>;
  createLoading: boolean;
  editLoading: boolean;
  deleteLoading: boolean;
  handleCreateUser: (data: FormValues) => Promise<void>;
  handleEditUser: (data: FormValues) => Promise<void>;
  handleDeleteUser: () => Promise<void>;
  handleRoleChange: (userId: string, role: UserRole) => Promise<void>;
  getInitials: (name: string) => string;
  getRoleBadgeColor: (role: UserRole) => string;
}

export function UsersTable({
  users,
  loading,
  error,
  filteredUsers,
  activeTab,
  setActiveTab,
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedUser,
  setSelectedUser,
  createForm,
  editForm,
  createLoading,
  editLoading,
  deleteLoading,
  handleCreateUser,
  handleEditUser,
  handleDeleteUser,
  handleRoleChange,
  getInitials,
  getRoleBadgeColor,
}: UsersTableProps) {
  const { isAuthorized: isAdmin } = useAuthorization("ADMIN");

  return (
    <div className="container space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={createForm.handleSubmit(handleCreateUser)}>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>Add a new user to the system.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" className="col-span-3" placeholder="John Doe" {...createForm.register("name")} />
                  {typeof createForm.formState.errors.name?.message === 'string' && (
                    <p className="col-start-2 col-span-3 text-sm text-red-500">{createForm.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input id="email" className="col-span-3" placeholder="john@example.com" type="email" {...createForm.register("email")} />
                  {typeof createForm.formState.errors.email?.message === 'string' && (
                    <p className="col-start-2 col-span-3 text-sm text-red-500">{createForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">Password</Label>
                  <Input id="password" className="col-span-3" placeholder="••••••••" type="password" {...createForm.register("password")} />
                  {typeof createForm.formState.errors.password?.message === 'string' && (
                    <p className="col-start-2 col-span-3 text-sm text-red-500">{createForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">Role</Label>
                  <Select onValueChange={(value) => createForm.setValue("role", value as UserRole)} defaultValue={createForm.getValues("role")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">USER</SelectItem>
                      <SelectItem value="STAFF">STAFF</SelectItem>
                      <SelectItem value="ADMIN">ADMIN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      {filteredUsers.map(user => (
        <div key={user.id}>
          <div>
            <Select
              onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
              value={user.role}
              disabled={!isAdmin || user.id === selectedUser?.id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">USER</SelectItem>
                <SelectItem value="STAFF">STAFF</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setSelectedUser(user); setIsEditDialogOpen(true); }}
              disabled={!isAdmin}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => { setSelectedUser(user); setIsDeleteDialogOpen(true); }}
              disabled={!isAdmin || user.id === user.id}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={editForm.handleSubmit(handleEditUser)}>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update the user's information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Role</Label>
                <Select onValueChange={(value) => editForm.setValue("role", value as UserRole)} value={editForm.getValues("role")}>
                  <SelectTrigger disabled={!isAdmin}>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">USER</SelectItem>
                    <SelectItem value="STAFF">STAFF</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={editLoading || !isAdmin}>
                {editLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user {selectedUser?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={deleteLoading}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={deleteLoading || !isAdmin || selectedUser?.id === selectedUser?.id}>
              {deleteLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 