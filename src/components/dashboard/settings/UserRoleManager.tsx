"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { 
  ChevronDown, 
  Search, 
  UserCog, 
  RefreshCw, 
  FilterX, 
  Trash, 
  Shield, 
  ShieldAlert, 
  ShieldCheck,
  Check,
  X,
  User,
  UserPlus,
  Mail
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// User Types
export type UserRole = "ADMIN" | "EDITOR" | "VIEWER";

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

// Props interface
interface UserRoleManagerProps {
  onRoleUpdate?: (userId: string, newRole: UserRole) => Promise<boolean>;
  onUserActivation?: (userId: string, activate: boolean) => Promise<boolean>;
  onUserDelete?: (userId: string) => Promise<boolean>;
  onUserInvite?: (email: string, name: string, role: UserRole) => Promise<boolean>;
  refreshUsers?: () => Promise<void>;
}

const roleOptions: { label: string; value: UserRole; icon: JSX.Element; description: string }[] = [
  { 
    label: "Admin", 
    value: "ADMIN", 
    icon: <ShieldAlert className="h-4 w-4 text-red-500" />,
    description: "Full access to all features and settings"
  },
  { 
    label: "Editor", 
    value: "EDITOR", 
    icon: <ShieldCheck className="h-4 w-4 text-blue-500" />,
    description: "Can edit content but cannot manage users or settings"
  },
  { 
    label: "Viewer", 
    value: "VIEWER", 
    icon: <Shield className="h-4 w-4 text-gray-500" />,
    description: "Read-only access to content"
  }
];

// Sample data for demonstration - would be replaced with real API calls
const sampleUsers: UserData[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@torchgroup.co",
    role: "ADMIN",
    createdAt: "2023-01-01",
    lastLogin: "2023-05-20",
    isActive: true
  },
  {
    id: "2",
    name: "Content Editor",
    email: "editor@torchgroup.co",
    role: "EDITOR",
    createdAt: "2023-02-15",
    lastLogin: "2023-05-18",
    isActive: true
  },
  {
    id: "3",
    name: "Team Member",
    email: "viewer@torchgroup.co",
    role: "VIEWER",
    createdAt: "2023-03-10",
    isActive: true
  },
  {
    id: "4",
    name: "Inactive User",
    email: "inactive@torchgroup.co",
    role: "VIEWER",
    createdAt: "2023-04-05",
    isActive: false
  }
];

export function UserRoleManager({
  onRoleUpdate,
  onUserActivation,
  onUserDelete,
  onUserInvite,
  refreshUsers
}: UserRoleManagerProps) {
  const [users, setUsers] = useState<UserData[]>(sampleUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("all");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("VIEWER");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  
  // Filter and sort users
  const filteredUsers = users.filter(user => {
    // Text search
    const matchesSearch = searchQuery === "" || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Role filter
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    
    // Status filter
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  }).sort((a, b) => {
    // Sort by role priority then by name
    const rolePriority = { "ADMIN": 1, "EDITOR": 2, "VIEWER": 3 };
    if (rolePriority[a.role] !== rolePriority[b.role]) {
      return rolePriority[a.role] - rolePriority[b.role];
    }
    return a.name.localeCompare(b.name);
  });
  
  // Load users
  const loadUsers = async () => {
    setIsLoading(true);
    
    try {
      if (refreshUsers) {
        await refreshUsers();
      }
      // In a real app, we would update the users state from an API response
      // For now, we'll just use the sample data
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update user role
  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    setIsLoading(true);
    
    try {
      let success = true;
      
      if (onRoleUpdate) {
        success = await onRoleUpdate(userId, newRole);
      }
      
      if (success) {
        // Update local state
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        
        toast({
          title: "Role Updated",
          description: "User role has been updated successfully.",
        });
      } else {
        throw new Error("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle user activation status
  const handleToggleActivation = async (userId: string, currentStatus: boolean) => {
    setIsLoading(true);
    
    try {
      let success = true;
      
      if (onUserActivation) {
        success = await onUserActivation(userId, !currentStatus);
      }
      
      if (success) {
        // Update local state
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, isActive: !currentStatus } : user
        ));
        
        toast({
          title: currentStatus ? "User Deactivated" : "User Activated",
          description: `User has been ${currentStatus ? "deactivated" : "activated"} successfully.`,
        });
      } else {
        throw new Error(`Failed to ${currentStatus ? "deactivate" : "activate"} user`);
      }
    } catch (error) {
      console.error("Error toggling user activation:", error);
      toast({
        title: "Error",
        description: `Failed to ${currentStatus ? "deactivate" : "activate"} user. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    
    try {
      let success = true;
      
      if (onUserDelete) {
        success = await onUserDelete(selectedUser.id);
      }
      
      if (success) {
        // Update local state
        setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
        
        toast({
          title: "User Deleted",
          description: "User has been deleted successfully.",
        });
        
        setConfirmDeleteDialogOpen(false);
        setSelectedUser(null);
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Invite new user
  const handleInviteUser = async () => {
    if (!newUserEmail) return;
    
    setIsLoading(true);
    
    try {
      let success = true;
      
      if (onUserInvite) {
        success = await onUserInvite(newUserEmail, newUserName, newUserRole);
      }
      
      if (success) {
        // In a real app, we would refresh the users list from an API
        // For now, just add a fake user to the list
        const newUser: UserData = {
          id: `temp-${Date.now()}`,
          name: newUserName || newUserEmail.split('@')[0],
          email: newUserEmail,
          role: newUserRole,
          createdAt: new Date().toISOString().split('T')[0],
          isActive: true
        };
        
        setUsers(prev => [...prev, newUser]);
        
        toast({
          title: "Invitation Sent",
          description: `An invitation has been sent to ${newUserEmail}.`,
        });
        
        // Reset form
        setNewUserEmail("");
        setNewUserName("");
        setNewUserRole("VIEWER");
        setInviteDialogOpen(false);
      } else {
        throw new Error("Failed to invite user");
      }
    } catch (error) {
      console.error("Error inviting user:", error);
      toast({
        title: "Error",
        description: "Failed to invite user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("ALL");
    setStatusFilter("all");
  };
  
  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Never";
    
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Get role info
  const getRoleInfo = (role: UserRole) => {
    return roleOptions.find(option => option.value === role) || roleOptions[2]; // Default to viewer
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage user access and permissions
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={loadUsers}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          
          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite New User</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your organization. They will receive an email with instructions.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="user@example.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select 
                    value={newUserRole} 
                    onValueChange={(value) => setNewUserRole(value as UserRole)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map(role => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center">
                            {role.icon}
                            <span className="ml-2">{role.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-4 mt-2">
                  <p className="text-sm text-gray-500">
                    {getRoleInfo(newUserRole).description}
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleInviteUser} 
                  disabled={isLoading || !newUserEmail}
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as UserRole | "ALL")}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                {roleOptions.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex items-center">
                      {role.icon}
                      <span className="ml-2">{role.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "active" | "inactive" | "all")}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={clearFilters}
              disabled={(searchQuery === "" && roleFilter === "ALL" && statusFilter === "all")}
            >
              <FilterX className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Users</CardTitle>
            <p className="text-sm text-gray-500">
              {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"} found
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border rounded-md">
            <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <div className="bg-gray-50 dark:bg-gray-800">
                <div className="grid grid-cols-12 px-4 py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  <div className="col-span-4">Name / Email</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Created</div>
                  <div className="col-span-2">Actions</div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                {filteredUsers.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No users found.
                  </div>
                ) : (
                  filteredUsers.map((user) => {
                    const roleInfo = getRoleInfo(user.role);
                    
                    return (
                      <div key={user.id} className="grid grid-cols-12 px-4 py-4 text-sm">
                        <div className="col-span-4">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-gray-500">{user.email}</div>
                        </div>
                        
                        <div className="col-span-2">
                          <div className="flex items-center">
                            {roleInfo.icon}
                            <span className="ml-2">{roleInfo.label}</span>
                          </div>
                        </div>
                        
                        <div className="col-span-2">
                          <Badge variant={user.isActive ? "success" : "secondary"}>
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        
                        <div className="col-span-2 text-gray-500">
                          {formatDate(user.createdAt)}
                        </div>
                        
                        <div className="col-span-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <span className="sr-only">Open menu</span>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              
                              <DropdownMenuItem 
                                onClick={() => handleToggleActivation(user.id, user.isActive)}
                                disabled={isLoading}
                              >
                                {user.isActive ? (
                                  <>
                                    <X className="h-4 w-4 mr-2 text-red-500" />
                                    <span>Deactivate User</span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4 mr-2 text-green-500" />
                                    <span>Activate User</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              
                              <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                              {roleOptions.map(role => (
                                <DropdownMenuItem
                                  key={role.value}
                                  disabled={user.role === role.value || isLoading}
                                  onClick={() => handleRoleUpdate(user.id, role.value)}
                                >
                                  {role.icon}
                                  <span className="ml-2">{role.label}</span>
                                </DropdownMenuItem>
                              ))}
                              
                              <DropdownMenuSeparator />
                              
                              <DropdownMenuItem 
                                className="text-red-600 focus:text-red-700" 
                                onClick={() => {
                                  setSelectedUser(user);
                                  setConfirmDeleteDialogOpen(true);
                                }}
                                disabled={isLoading}
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                <span>Delete User</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm User Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <div className="p-4 border rounded-md mb-4">
                <div className="font-medium">{selectedUser.name}</div>
                <div className="text-gray-500">{selectedUser.email}</div>
                <div className="flex items-center mt-2">
                  <Badge variant="outline" className="mr-2">
                    {getRoleInfo(selectedUser.role).label}
                  </Badge>
                  <Badge variant={selectedUser.isActive ? "success" : "secondary"}>
                    {selectedUser.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-start mb-4">
                <Checkbox id="confirm-delete" />
                <Label
                  htmlFor="confirm-delete"
                  className="ml-2 text-sm font-normal"
                >
                  I understand that this will permanently delete the user account and revoke all access.
                </Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteUser} 
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash className="h-4 w-4 mr-2" />
              )}
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 