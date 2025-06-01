"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2, Mail, PhoneCall, Calendar, MessageSquare, CheckCircle, XCircle, RefreshCw, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Define message type
type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  phoneVerified?: boolean;
  subject: string;
  message: string;
  attachment?: string | null;
  isRead: boolean;
  createdAt: string;
};

export function MessagesContent() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  
  // Fetch messages on mount
  useEffect(() => {
    fetchMessages();
  }, []);
  
  // Fetch messages from API
  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch from the real API endpoint
      const response = await fetch('/api/contact');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  // Mark message as read
  const markAsRead = async (id: string) => {
    try {
      // Call the API to mark the message as read
      const response = await fetch(`/api/contact/${id}/read`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Update local state
      setMessages(messages.map(message => 
        message.id === id ? { ...message, isRead: true } : message
      ));
      
      // Update selected message if it's the one being marked
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, isRead: true });
      }
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };
  
  // View message details
  const viewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    
    // Mark as read if it's unread
    if (!message.isRead) {
      markAsRead(message.id);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Contact Messages</h1>
          <p className="text-gray-400">View and manage messages from the contact form.</p>
        </div>
        
        <Button 
          onClick={fetchMessages} 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          <span className="ml-3 text-lg">Loading messages...</span>
        </div>
      ) : error ? (
        <Card className="bg-red-900/20 border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-center text-red-400">
              <XCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      ) : messages.length === 0 ? (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <AlertTriangle className="h-12 w-12 text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No messages found</h3>
              <p className="text-gray-500 max-w-md">
                There are no contact form messages to display. Messages will appear here once visitors submit the contact form.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[200px]">From</TableHead>
                    <TableHead className="w-[200px]">Contact</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[150px]">Date</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow key={message.id} className={message.isRead ? "" : "bg-red-950/10"}>
                      <TableCell className="font-medium">{message.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-300 flex items-center">
                            <Mail className="h-3 w-3 mr-1" /> {message.email}
                          </span>
                          {message.phone && (
                            <span className="text-sm text-gray-300 flex items-center mt-1">
                              <PhoneCall className="h-3 w-3 mr-1" /> {message.phone}
                              {message.phoneVerified && (
                                <CheckCircle className="h-3 w-3 ml-1 text-green-500" />
                              )}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{message.subject}</TableCell>
                      <TableCell>
                        <Badge variant={message.isRead ? "outline" : "default"}>
                          {message.isRead ? "Read" : "Unread"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(message.createdAt)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => viewMessage(message)}
                            >
                              <MessageSquare className="h-4 w-4" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{message.subject}</DialogTitle>
                              <DialogDescription>
                                From {message.name} ({message.email})
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDate(message.createdAt)}</span>
                                </div>
                                {message.phone && (
                                  <div className="flex items-center gap-2">
                                    <PhoneCall className="h-4 w-4" />
                                    <span>{message.phone}</span>
                                    {message.phoneVerified && (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="bg-zinc-900 p-4 rounded-md">
                                <p className="whitespace-pre-wrap">{message.message}</p>
                              </div>
                              {message.attachment && (
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Attachment</h4>
                                  <Link 
                                    href={message.attachment} 
                                    target="_blank"
                                    className="flex items-center gap-2 text-red-500 hover:text-red-400"
                                  >
                                    View attachment <ArrowRight className="h-4 w-4" />
                                  </Link>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
} 