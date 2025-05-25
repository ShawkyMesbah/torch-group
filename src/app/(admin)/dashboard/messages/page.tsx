"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2, Mail, PhoneCall, Calendar, User, MessageSquare, CheckCircle, XCircle, RefreshCw, AlertTriangle } from "lucide-react";
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

export default function MessagesPage() {
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
                                <Badge variant="outline" className="ml-2 bg-green-950 text-green-300 border-green-800 text-[10px] h-4">
                                  <CheckCircle className="h-2 w-2 mr-1" /> Verified
                                </Badge>
                              )}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DialogTrigger asChild onClick={() => viewMessage(message)}>
                          <button className="text-left hover:underline">{message.subject}</button>
                        </DialogTrigger>
                      </TableCell>
                      <TableCell>
                        {message.isRead ? (
                          <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">Read</Badge>
                        ) : (
                          <Badge className="bg-red-600">New</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300">{formatDate(message.createdAt)}</TableCell>
                      <TableCell>
                        <DialogTrigger asChild onClick={() => viewMessage(message)}>
                          <Button variant="outline" size="sm" className="p-2 h-8 w-8">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Message Detail Dialog */}
          <Dialog>
            {selectedMessage && (
              <DialogContent className="bg-gray-900 border border-gray-800 text-white sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="text-xl flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-red-500" />
                    {selectedMessage.subject}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Message received on {formatDate(selectedMessage.createdAt)}
                  </DialogDescription>
                </DialogHeader>
                
                {/* Message Details */}
                <div className="space-y-6">
                  {/* Sender Information */}
                  <div className="bg-gray-800 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-gray-300 mb-3">Sender Information</h3>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{selectedMessage.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{selectedMessage.email}</span>
                      </div>
                      {selectedMessage.phone && (
                        <div className="flex items-center">
                          <PhoneCall className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{selectedMessage.phone}</span>
                          {selectedMessage.phoneVerified && (
                            <Badge variant="outline" className="ml-2 bg-green-950 text-green-300 border-green-800 text-[10px]">
                              <CheckCircle className="h-2 w-2 mr-1" /> Verified
                            </Badge>
                          )}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{formatDate(selectedMessage.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Message Content */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Message</h3>
                    <div className="bg-gray-800 p-4 rounded-md whitespace-pre-wrap">
                      {selectedMessage.message}
                    </div>
                  </div>
                  
                  {/* Attachment */}
                  {selectedMessage.attachment && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-2">Attachment</h3>
                      <div className="bg-gray-800 p-4 rounded-md">
                        <a 
                          href={selectedMessage.attachment} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-red-400 hover:text-red-300 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          View Attachment
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex justify-end gap-3">
                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Reply by Email
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Mark as Handled
                    </Button>
                  </div>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </>
      )}
    </div>
  );
} 