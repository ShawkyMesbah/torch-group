"use client";
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { PlusCircle, Pencil, Trash2, MoreHorizontal, AlertTriangle, Loader2 } from "lucide-react";
import { TalentCategory, TalentStatus } from "@/generated/prisma";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

// Import the form schema if needed, or define FormValues type
type FormValues = z.infer<ReturnType<typeof z.object>>;

interface TalentsTableProps {
  talents: any[];
  loading: boolean;
  error: any;
  retryCount: number;
  isNewTalentOpen: boolean;
  setIsNewTalentOpen: (open: boolean) => void;
  isEditTalentOpen: boolean;
  setIsEditTalentOpen: (open: boolean) => void;
  isDeleteConfirmOpen: boolean;
  setIsDeleteConfirmOpen: (open: boolean) => void;
  selectedTalent: string | null;
  setSelectedTalent: (id: string | null) => void;
  form: UseFormReturn<FormValues>;
  onSubmit: (data: FormValues) => Promise<void>;
  formLoading: boolean;
  deleteLoading: boolean;
  handleDelete: () => Promise<void>;
}

export function TalentsTable({
  talents,
  loading,
  error,
  retryCount,
  isNewTalentOpen,
  setIsNewTalentOpen,
  isEditTalentOpen,
  setIsEditTalentOpen,
  isDeleteConfirmOpen,
  setIsDeleteConfirmOpen,
  selectedTalent,
  setSelectedTalent,
  form,
  onSubmit,
  formLoading,
  deleteLoading,
  handleDelete,
}: TalentsTableProps) {
  // Helper for status badge
  const getStatusBadge = (status) => {
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
  const renderTalentsTable = (data) => (
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
            <TableCell>{getStatusBadge(talent.status)}</TableCell>
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
    <div>
      {/* New Talent Button and Dialog */}
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
              {/* Add more fields as needed */}
              <Button type="submit" disabled={formLoading} className="w-full">
                {formLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Save"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/* Table */}
      <div className="mt-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-red-500" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error.message || "Failed to load talents."}</div>
        ) : (
          renderTalentsTable(talents)
        )}
      </div>
      {/* Edit and Delete dialogs would go here, similar to New Talent dialog */}
      {/* ... */}
    </div>
  );
} 