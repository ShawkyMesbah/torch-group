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
  const handleCreateUser = async (data: FormValues) => {
    const result = await createUser(data);
    if (result) {
      createForm.reset();
      setIsCreateDialogOpen(false);
    }
  };
  
  // Edit user handler
  const handleEditUser = async (data: FormValues) => {
    if (!selectedUser) return;
    
    // Only include password if it was provided
    const updateData = { ...data };
    if (!updateData.password) {
      delete updateData.password;
    }
    
    const result = await updateUser(selectedUser.id, updateData);
    if (result) {
      setIsEditDialogOpen(false);
    }
  };
  
  // Delete user handler
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    const result = await deleteUser(selectedUser.id);
    if (result) {
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
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
                  <Input
                    id="name"
                    className="col-span-3"
                    placeholder="John Doe"
                    {...createForm.register("name")}
                  />
                  {createForm.formState.errors.name && (
                    <p className="col-start-2 col-span-3 text-sm text-red-500">
                      {createForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input
                    id="email"
                    className="col-span-3"
                    placeholder="john@example.com"
                    type="email"
                    {...createForm.register("email")}
                  />
                  {createForm.formState.errors.email && (
                    <p className="col-start-2 col-span-3 text-sm text-red-500">
                      {createForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">Password</Label>
                  <Input
                    id="password"
                    className="col-span-3"
                    placeholder="••••••••"
                    type="password"
                    {...createForm.register("password")}
                  />
                  {createForm.formState.errors.password && (
                    <p className="col-start-2 col-span-3 text-sm text-red-500">
                      {createForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">Role</Label>
                  <Select
                    onValueChange={(value) => createForm.setValue("role", value as UserRole)}
                    defaultValue={createForm.getValues("role")}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="STAFF">Staff</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">Avatar</Label>
                  <div className="col-span-3">
                    <FileUpload
                      endpoint="profileImage"
                      value={createForm.watch("image")}
                      onChange={(url) => createForm.setValue("image", url || "")}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading || createForm.formState.isSubmitting}>
                  {loading || createForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Users list */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="users">Regular Users</TabsTrigger>
        </TabsList>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Users className="h-12 w-12 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-1">No users found</h3>
            <p className="text-muted-foreground">Get started by adding a new user.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="flex flex-col overflow-hidden">
                <div className="md:flex">
                  <div className="p-5 flex-grow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={user.image} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{user.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium mr-4 ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                        <div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t md:border-t-0 md:border-l p-5 flex items-center space-x-2 bg-muted/30">
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <p className="text-sm font-medium">Change Role:</p>
                      <Select
                        defaultValue={user.role}
                        onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                        disabled={loading}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="STAFF">Staff</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <CardFooter className="bg-muted/20 text-xs text-muted-foreground px-5 py-2">
                  Created: {format(new Date(user.createdAt), "PPP")}
                  {user.emailVerified && (
                    <span className="ml-4 text-green-500 flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </span>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </Tabs>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          {selectedUser && (
            <form onSubmit={editForm.handleSubmit(handleEditUser)}>
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>Make changes to the user account.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">Name</Label>
                  <Input
                    id="edit-name"
                    className="col-span-3"
                    {...editForm.register("name")}
                  />
                  {editForm.formState.errors.name && (
                    <p className="col-start-2 col-span-3 text-sm text-red-500">
                      {editForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">Email</Label>
                  <Input
                    id="edit-email"
                    className="col-span-3"
                    type="email"
                    {...editForm.register("email")}
                  />
                  {editForm.formState.errors.email && (
                    <p className="col-start-2 col-span-3 text-sm text-red-500">
                      {editForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-password" className="text-right">
                    New Password
                    <span className="block text-xs text-muted-foreground">(Leave blank to keep unchanged)</span>
                  </Label>
                  <Input
                    id="edit-password"
                    className="col-span-3"
                    placeholder="••••••••"
                    type="password"
                    {...editForm.register("password")}
                  />
                  {editForm.formState.errors.password && (
                    <p className="col-start-2 col-span-3 text-sm text-red-500">
                      {editForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-role" className="text-right">Role</Label>
                  <Select
                    onValueChange={(value) => editForm.setValue("role", value as UserRole)}
                    defaultValue={editForm.getValues("role")}
                  >
                    <SelectTrigger className="col-span-3" id="edit-role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="STAFF">Staff</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-image" className="text-right">Avatar</Label>
                  <div className="col-span-3">
                    <FileUpload
                      endpoint="profileImage"
                      value={editForm.watch("image")}
                      onChange={(url) => editForm.setValue("image", url || "")}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading || editForm.formState.isSubmitting}>
                  {loading || editForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
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