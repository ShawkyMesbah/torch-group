"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, MoreHorizontal, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useTalents } from "@/hooks/useTalents";
import { useToast } from "@/components/ui/use-toast";
import { useAuthorization } from "@/hooks/useAuthorization";
// Import TalentCategory and TalentStatus from the generated Prisma client
import { TalentCategory, TalentStatus } from "@/generated/prisma";

// UI Components
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { DataLoader } from "@/components/ui/data-loader";

// Type for form data
type TalentFormData = {
  name: string;
  role: string;
  category: TalentCategory;
  bio: string;
  imageUrl?: string;
  status: TalentStatus;
};

// Form schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  category: z.nativeEnum(TalentCategory, {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  imageUrl: z.string().url("Please provide a valid URL").optional(),
  status: z.nativeEnum(TalentStatus, {
    errorMap: () => ({ message: "Please select a valid status" }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function TalentsPage() {
  const { toast } = useToast();
  // Add authorization check hook
  const { isAuthorized, isLoading: authLoading } = useAuthorization("STAFF");
  const { 
    talents, 
    loading, 
    error, 
    retryCount,
    fetchTalents, 
    createTalent, 
    updateTalent, 
    deleteTalent 
  } = useTalents();
  
  const [isNewTalentOpen, setIsNewTalentOpen] = useState(false);
  const [isEditTalentOpen, setIsEditTalentOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState<string | null>(null);
  
  // Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
      category: undefined,
      bio: "",
      imageUrl: "",
      status: TalentStatus.PENDING,
    },
  });
  
  // Load talents on mount
  useEffect(() => {
    fetchTalents();
  }, [fetchTalents]);
  
  // Reset form when dialog closes
  useEffect(() => {
    if (!isNewTalentOpen && !isEditTalentOpen) {
      form.reset();
    }
  }, [isNewTalentOpen, isEditTalentOpen, form]);
  
  // Load talent data into form when editing
  useEffect(() => {
    if (isEditTalentOpen && selectedTalent) {
      const talent = talents.find(t => t.id === selectedTalent);
      if (talent) {
        form.reset({
          name: talent.name,
          role: talent.role,
          category: talent.category as TalentCategory,
          bio: talent.bio,
          imageUrl: talent.imageUrl || "",
          status: talent.status as TalentStatus,
        });
      }
    }
  }, [isEditTalentOpen, selectedTalent, talents, form]);
  
  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    try {
      if (isEditTalentOpen && selectedTalent) {
        // Update existing talent
        await updateTalent(selectedTalent, data);
        setIsEditTalentOpen(false);
      } else {
        // Create new talent
        await createTalent(data);
        setIsNewTalentOpen(false);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };
  
  // Delete handler
  const handleDelete = async () => {
    if (selectedTalent) {
      const success = await deleteTalent(selectedTalent);
      if (success) {
        setIsDeleteConfirmOpen(false);
        setSelectedTalent(null);
      } else {
        toast({
          title: "Permission Denied",
          description: "You don't have sufficient permissions to delete talents.",
          variant: "destructive",
        });
      }
    }
  };
  
  // Helper for status badge
  const getStatusBadge = (status: TalentStatus) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="success">Active</Badge>;
      case "PENDING":
        return <Badge variant="warning">Pending</Badge>;
      case "HIDDEN":
        return <Badge variant="secondary">Hidden</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Show table with talent data
  const renderTalentsTable = (data: typeof talents) => (
    <Table>
      <TableCaption>
        {retryCount > 0 && (
          <div className="mb-2 text-xs text-yellow-600 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Experienced connection issues. Retry {retryCount}/{3}
          </div>
        )}
        A list of all talents ({data.length})
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((talent) => (
          <TableRow key={talent.id}>
            <TableCell className="font-medium">{talent.name}</TableCell>
            <TableCell>{talent.role}</TableCell>
            <TableCell>{talent.category}</TableCell>
            <TableCell>{getStatusBadge(talent.status as TalentStatus)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedTalent(talent.id);
                      setIsEditTalentOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => {
                      setSelectedTalent(talent.id);
                      setIsDeleteConfirmOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
  
  return (
    <ErrorBoundary>
      <div className="container mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Talent Management</h1>
          
          {/* New Talent Button */}
          <Dialog open={isNewTalentOpen} onOpenChange={setIsNewTalentOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>New Talent</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Talent</DialogTitle>
                <DialogDescription>
                  Enter the details for the new talent. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Input placeholder="Singer, Designer, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(TalentCategory).map((category) => (
                                <SelectItem
                                  key={category}
                                  value={category}
                                >
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(TalentStatus).map((status) => (
                                <SelectItem
                                  key={status}
                                  value={status}
                                >
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Brief description of the talent"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <div className="flex gap-2 items-start">
                            <Input
                              placeholder="https://example.com/image.jpg"
                              {...field}
                              value={field.value || ""}
                            />
                            <FileUpload
                              endpoint="profileImage"
                              value={field.value || ""}
                              onChange={(url) => field.onChange(url || "")}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload or provide a URL to the talent's image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      type="button"
                      onClick={() => isEditTalentOpen ? setIsEditTalentOpen(false) : setIsNewTalentOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          <span>Saving...</span>
                        </div>
                      ) : isEditTalentOpen ? "Update Talent" : "Create Talent"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Edit Talent Dialog */}
        <Dialog open={isEditTalentOpen} onOpenChange={setIsEditTalentOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Talent</DialogTitle>
              <DialogDescription>
                Update the talent's information. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Same form fields as in the New Talent dialog */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input placeholder="Singer, Designer, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(TalentCategory).map((category) => (
                              <SelectItem
                                key={category}
                                value={category}
                              >
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(TalentStatus).map((status) => (
                              <SelectItem
                                key={status}
                                value={status}
                              >
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brief description of the talent"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <div className="flex gap-2 items-start">
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                            value={field.value || ""}
                          />
                          <FileUpload
                            endpoint="profileImage"
                            value={field.value || ""}
                            onChange={(url) => field.onChange(url || "")}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => setIsEditTalentOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Updating...</span>
                      </div>
                    ) : "Update Talent"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this talent? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Deleting...</span>
                  </div>
                ) : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Data Display with Error and Loading Handling */}
        <DataLoader
          isLoading={loading || authLoading}
          error={error}
          data={talents}
          onRetry={fetchTalents}
          emptyMessage="No talents found. Create your first talent to get started."
        >
          {(talentsData) => renderTalentsTable(talentsData)}
        </DataLoader>
      </div>
    </ErrorBoundary>
  );
}

// Mark this page as dynamic to prevent static rendering
export const dynamic = 'force-dynamic'; 