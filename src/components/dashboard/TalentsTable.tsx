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
  const getStatusBadge = (status: TalentStatus) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="success" className="bg-green-600 text-white">Active</Badge>;
      case "PENDING":
        return <Badge variant="warning" className="bg-yellow-500 text-white">Pending</Badge>;
      case "HIDDEN":
        return <Badge variant="secondary" className="bg-gray-500 text-white">Hidden</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-500 text-white">{status}</Badge>;
    }
  };

  // Show table with talent data
  const renderTalentsTable = (data: any[]) => (
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
        {data.map((talent: any) => (
          <TableRow key={talent.id} className="transition-shadow hover:shadow-md focus-within:shadow-md">
            <TableCell className="font-medium text-gray-900 dark:text-gray-100">{talent.name}</TableCell>
            <TableCell className="text-gray-700 dark:text-gray-300">{talent.role}</TableCell>
            <TableCell className="text-gray-700 dark:text-gray-300">{talent.category}</TableCell>
            <TableCell>{getStatusBadge(talent.status)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" aria-label={`Talent actions for ${talent.name}`} className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
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
                    aria-label={`Edit talent ${talent.name}`}
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
                    aria-label={`Delete talent ${talent.name}`}
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
          <Button className="flex items-center gap-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary" aria-label="Add new talent">
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-6 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>Failed to fetch talents.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="mt-4"
              aria-label="Retry fetching talents"
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <TableCaption>
                {retryCount > 0 && (
                  <div className="mb-2 text-xs text-yellow-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Experienced connection issues. Retry {retryCount}/3
                  </div>
                )}
                A list of all talents ({talents.length})
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
                {talents.map((talent: any) => (
                  <TableRow key={talent.id} className="transition-shadow hover:shadow-md focus-within:shadow-md">
                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">{talent.name}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">{talent.role}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">{talent.category}</TableCell>
                    <TableCell>{getStatusBadge(talent.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" aria-label={`Talent actions for ${talent.name}`} className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
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
                            aria-label={`Edit talent ${talent.name}`}
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
                            aria-label={`Delete talent ${talent.name}`}
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
          </div>
        )}
      </div>
      {/* Edit and Delete dialogs would go here, similar to New Talent dialog */}
      {/* ... */}
    </div>
  );
} 