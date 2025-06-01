"use client";

import { useState, useEffect } from "react";
import { useContactMessages } from "@/hooks/useContactMessages";
import { useAuthorization } from "@/hooks/useAuthorization";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Trash2, Check, X, Mail, User, Phone, CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { ContactMessage } from "@/types";

export default function ContactMessagesPage() {
  // Authorization check - only ADMIN can access
  const { isAuthorized, isLoading: authLoading } = useAuthorization("ADMIN");
  const { messages, loading, error, fetchMessages, markMessageAsRead, deleteMessage } = useContactMessages();
  
  // UI state
  const [activeTab, setActiveTab] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch messages on component mount
  useEffect(() => {
    if (isAuthorized) {
      fetchMessages();
    }
  }, [isAuthorized, fetchMessages]);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "all") {
      fetchMessages();
    } else if (value === "unread") {
      fetchMessages({ isRead: false });
    } else if (value === "read") {
      fetchMessages({ isRead: true });
    }
  };
  
  // Handle message view
  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);
    
    // If message is unread, mark it as read
    if (!message.isRead) {
      markMessageAsRead(message.id, true);
    }
  };
  
  // Handle message delete
  const handleDeleteMessage = async () => {
    if (!selectedMessage) return;
    
    const success = await deleteMessage(selectedMessage.id);
    if (success) {
      setIsDeleteDialogOpen(false);
      setSelectedMessage(null);
    }
  };
  
  // Handle toggle read status
  const handleToggleReadStatus = async (message: ContactMessage) => {
    await markMessageAsRead(message.id, !message.isRead);
  };
  
  // Format date
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };
  
  // Filter messages based on search query
  const filteredMessages = messages.filter((message) => {
    const query = searchQuery.toLowerCase();
    return (
      message.name.toLowerCase().includes(query) ||
      message.email.toLowerCase().includes(query) ||
      message.subject.toLowerCase().includes(query) ||
      message.message.toLowerCase().includes(query)
    );
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full md:w-96 grid-cols-3">
          <TabsTrigger value="all">All Messages</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">No messages found</h2>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search query."
                  : activeTab === "unread"
                  ? "You don't have any unread messages."
                  : activeTab === "read"
                  ? "You don't have any read messages."
                  : "You don't have any messages yet."}
              </p>
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Status</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((message) => (
                      <TableRow key={message.id} className={!message.isRead ? "bg-muted/30" : ""}>
                        <TableCell>
                          <Checkbox 
                            checked={message.isRead}
                            onCheckedChange={() => handleToggleReadStatus(message)}
                            aria-label={message.isRead ? "Mark as unread" : "Mark as read"}
                          />
                        </TableCell>
                        <TableCell>{message.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{message.email}</TableCell>
                        <TableCell className="font-medium">{message.subject}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {formatDate(message.createdAt)}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewMessage(message)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedMessage(message);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMessage.subject}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <Badge variant={selectedMessage.isRead ? "outline" : "default"}>
                    {selectedMessage.isRead ? "Read" : "Unread"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(selectedMessage.createdAt)}
                  </span>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{selectedMessage.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                  </div>
                </div>
                
                {selectedMessage.phone && (
                  <div className="flex items-start gap-4">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <p>{selectedMessage.phone}</p>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <p className="whitespace-pre-line">{selectedMessage.message}</p>
                </div>
              </div>
              
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => handleToggleReadStatus(selectedMessage)}
                >
                  {selectedMessage.isRead ? (
                    <>
                      <X className="mr-2 h-4 w-4" /> Mark as Unread
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Mark as Read
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteMessage}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 