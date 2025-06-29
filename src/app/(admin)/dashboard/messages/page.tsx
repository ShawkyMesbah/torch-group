'use client';

import { useState, useEffect } from 'react';
import { Search, Mail, MailOpen, Trash2, Star, Calendar, Phone, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  isRead: boolean;
  isStarred: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read' | 'starred'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/contact/${id}/read`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === id 
            ? { ...msg, isRead: true }
            : msg
        ));
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const toggleStar = async (id: string, currentStarred: boolean) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isStarred: !currentStarred }),
      });

      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === id 
            ? { ...msg, isStarred: !currentStarred }
            : msg
        ));
      }
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'unread' && !message.isRead) ||
                         (filterStatus === 'read' && message.isRead) ||
                         (filterStatus === 'starred' && message.isStarred);

    return matchesSearch && matchesFilter;
  });

  const handleMessageClick = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      markAsRead(message.id);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded mb-4"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-gray-700 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
          <p className="text-gray-400">Manage contact messages and inquiries from your website.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Mail className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{messages.length}</p>
              <p className="text-sm text-gray-400">Total Messages</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <MailOpen className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {messages.filter(m => !m.isRead).length}
              </p>
              <p className="text-sm text-gray-400">Unread</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <MailOpen className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {messages.filter(m => m.isRead).length}
              </p>
              <p className="text-sm text-gray-400">Read</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Star className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {messages.filter(m => m.isStarred).length}
              </p>
              <p className="text-sm text-gray-400">Starred</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | 'unread' | 'read' | 'starred')}
          className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
        >
          <option value="all">All Messages</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="starred">Starred</option>
        </select>
      </div>

      {/* Messages Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No messages found</h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters.' 
                  : 'Contact messages will appear here.'}
              </p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => handleMessageClick(message)}
                className={`p-4 border rounded-xl cursor-pointer transition-colors ${
                  selectedMessage?.id === message.id
                    ? 'bg-red-500/10 border-red-500/30'
                    : message.isRead
                      ? 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
                      : 'bg-gray-800/50 border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium truncate ${
                      message.isRead ? 'text-gray-300' : 'text-white'
                    }`}>
                      {message.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">{message.email}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {!message.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(message.id, message.isStarred);
                      }}
                      className={`p-1 rounded ${
                        message.isStarred 
                          ? 'text-yellow-400 hover:bg-yellow-500/10' 
                          : 'text-gray-500 hover:text-yellow-400 hover:bg-yellow-500/10'
                      }`}
                    >
                      <Star className={`h-3 w-3 ${message.isStarred ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
                <p className={`text-sm font-medium mb-1 truncate ${
                  message.isRead ? 'text-gray-400' : 'text-gray-300'
                }`}>
                  {message.subject}
                </p>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                  {message.message}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {selectedMessage.subject}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {selectedMessage.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {selectedMessage.email}
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {selectedMessage.phone}
                      </div>
                    )}
                  </div>
                  {selectedMessage.company && (
                    <p className="text-sm text-gray-400 mt-1">
                      Company: {selectedMessage.company}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleStar(selectedMessage.id, selectedMessage.isStarred)}
                    className={`p-2 rounded-lg ${
                      selectedMessage.isStarred 
                        ? 'text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20' 
                        : 'text-gray-500 hover:text-yellow-400 hover:bg-yellow-500/10'
                    }`}
                  >
                    <Star className={`h-4 w-4 ${selectedMessage.isStarred ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <Calendar className="h-3 w-3" />
                Received {formatDistanceToNow(new Date(selectedMessage.createdAt), { addSuffix: true })}
              </div>

              <div className="prose prose-invert max-w-none">
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex gap-3">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    Reply via Email
                  </a>
                  {selectedMessage.phone && (
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center">
              <Mail className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">Select a message</h3>
              <p className="text-gray-500">Choose a message from the list to view its details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 