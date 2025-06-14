"use client";

import { useState, useEffect, Suspense } from "react";
import { useUsers, UserRole } from "@/hooks/useUsers";
import { useAuthorization } from "@/hooks/useAuthorization";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus, Users, Save, Loader2, UserCog, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/components/ui/use-toast";
import dynamic from 'next/dynamic';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.enum(["USER", "STAFF", "ADMIN"]),
  image: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Wrap any component that might use useSearchParams in Suspense
const UserContent = () => {
  // Authorization check - only ADMIN can access
  const { isAuthorized, isLoading: authLoading } = useAuthorization("ADMIN");
  const { users, loading, error, fetchUsers, createUser, updateUser, deleteUser, changeUserRole } = useUsers();
  const { toast } = useToast();
  
  // UI state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  // Forms
  const createForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
      image: "",
    },
  });
  
  const editForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "USER",
      image: "",
    },
  });
  
  // Fetch users on component mount
  useEffect(() => {
    if (isAuthorized) {
      fetchUsers();
    }
  }, [isAuthorized, fetchUsers]);
  
  // Update edit form when selected user changes
  useEffect(() => {
    if (selectedUser) {
      editForm.reset({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        image: selectedUser.image || "",
      });
    }
  }, [selectedUser, editForm]);
  
  // Create user handler
  const [createLoading, setCreateLoading] = useState(false);
  const handleCreateUser = async (data: FormValues) => {
    setCreateLoading(true);
    try {
      const result = await createUser(data);
      if (result) {
        createForm.reset();
        setIsCreateDialogOpen(false);
        toast({ title: "User created successfully", variant: "default" });
      }
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message || "An error occurred.", variant: "destructive" });
    } finally {
      setCreateLoading(false);
    }
  };
  
  // Edit user handler
  const [editLoading, setEditLoading] = useState(false);
  const handleEditUser = async (data: FormValues) => {
    if (!selectedUser) return;
    setEditLoading(true);
    try {
      // Only include password if it was provided
      const updateData = { ...data };
      if (!updateData.password) {
        delete updateData.password;
      }
      const result = await updateUser(selectedUser.id, updateData);
      if (result) {
        setIsEditDialogOpen(false);
        toast({ title: "User updated successfully", variant: "default" });
      }
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message || "An error occurred.", variant: "destructive" });
    } finally {
      setEditLoading(false);
    }
  };
  
  // Delete user handler
  const [deleteLoading, setDeleteLoading] = useState(false);
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setDeleteLoading(true);
    try {
      const result = await deleteUser(selectedUser.id);
      if (result) {
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
        toast({ title: "User deleted successfully", variant: "default" });
      }
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message || "An error occurred.", variant: "destructive" });
    } finally {
      setDeleteLoading(false);
    }
  };
  
  // Change user role handler
  const handleRoleChange = async (userId: string, role: UserRole) => {
    await changeUserRole(userId, role);
  };
  
  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Get color for role badge
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-500 text-white";
      case "STAFF":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  
  // Filter users based on active tab
  const filteredUsers = users.filter(user => {
    if (activeTab === "admin") return user.role === "ADMIN";
    if (activeTab === "staff") return user.role === "STAFF";
    if (activeTab === "users") return user.role === "USER";
    return true; // "all" tab
  });
  
  if (authLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }
  
  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-bold mb-2">Unauthorized</h2>
        <p className="text-muted-foreground mb-4">You don't have permission to access this page.</p>
        <Button asChild>
          <a href="/dashboard">Go Back to Dashboard</a>
        </Button>
      </div>
    );
  }
  
  const UsersTable = dynamic(() => import('@/components/dashboard/UsersTable').then(mod => mod.UsersTable), { ssr: false });
  
  return (
    <Suspense fallback={<div>Loading users...</div>}>
      <UsersTable
        users={users}
        loading={loading}
        error={error}
        filteredUsers={filteredUsers}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        createForm={createForm}
        editForm={editForm}
        createLoading={createLoading}
        editLoading={editLoading}
        deleteLoading={deleteLoading}
        handleCreateUser={handleCreateUser}
        handleEditUser={handleEditUser}
        handleDeleteUser={handleDeleteUser}
        handleRoleChange={handleRoleChange}
        getInitials={getInitials}
        getRoleBadgeColor={getRoleBadgeColor}
      />
    </Suspense>
  );
};

// Main component that wraps the content in a Suspense boundary
export default function UserManagement() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
      <UserContent />
    </Suspense>
  );
} 