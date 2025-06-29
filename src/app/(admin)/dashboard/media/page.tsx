'use client';

import { useState, useEffect } from 'react';
import { Upload, Search, Image as ImageIcon, File, Trash2, Download, Eye, Grid, List } from 'lucide-react';
import Image from 'next/image';
import { UploadButton } from '@/lib/uploadthing';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'document'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  const fetchMediaFiles = async () => {
    try {
      // Note: This would need to be implemented as an API endpoint
      // For now, we'll use mock data
      const mockFiles: MediaFile[] = [
        {
          id: '1',
          name: 'hero-image.jpg',
          url: '/images/hero-bg.jpg',
          size: 2048576,
          type: 'image/jpeg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'logo.png',
          url: '/images/logo.png',
          size: 512000,
          type: 'image/png',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'company-profile.pdf',
          url: '/documents/profile.pdf',
          size: 1024000,
          type: 'application/pdf',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setMediaFiles(mockFiles);
    } catch (error) {
      console.error('Error fetching media files:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      // Note: This would need to be implemented as an API endpoint
      setMediaFiles(mediaFiles.filter(file => file.id !== id));
      setSelectedFiles(selectedFiles.filter(fileId => fileId !== id));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const deleteSelectedFiles = async () => {
    if (selectedFiles.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedFiles.length} file(s)?`)) return;

    try {
      setMediaFiles(mediaFiles.filter(file => !selectedFiles.includes(file.id)));
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error deleting files:', error);
    }
  };

  const toggleFileSelection = (id: string) => {
    setSelectedFiles(prev => 
      prev.includes(id) 
        ? prev.filter(fileId => fileId !== id)
        : [...prev, id]
    );
  };

  const selectAllFiles = () => {
    setSelectedFiles(filteredFiles.map(file => file.id));
  };

  const deselectAllFiles = () => {
    setSelectedFiles([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5" />;
    }
    return <File className="h-5 w-5" />;
  };

  const isImage = (type: string) => type.startsWith('image/');

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'image' && file.type.startsWith('image/')) ||
                         (filterType === 'document' && !file.type.startsWith('image/'));
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 animate-pulse">
              <div className="h-32 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Media Library</h1>
          <p className="text-gray-400">Manage your uploaded files and media assets.</p>
        </div>
        <div className="flex items-center gap-3">
          <UploadButton
            endpoint="projectImage"
            onClientUploadComplete={(res) => {
              console.log('Files uploaded:', res);
              fetchMediaFiles(); // Refresh the list
            }}
            onUploadError={(error: Error) => {
              console.error('Upload error:', error);
            }}
            className="ut-button:bg-red-500 ut-button:ut-readying:bg-red-500/50"
          />
          <UploadButton
            endpoint="document"
            onClientUploadComplete={(res) => {
              console.log('Files uploaded:', res);
              fetchMediaFiles(); // Refresh the list
            }}
            onUploadError={(error: Error) => {
              console.error('Upload error:', error);
            }}
            className="ut-button:bg-red-500 ut-button:ut-readying:bg-red-500/50"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <File className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{mediaFiles.length}</p>
              <p className="text-sm text-gray-400">Total Files</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <ImageIcon className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {mediaFiles.filter(f => f.type.startsWith('image/')).length}
              </p>
              <p className="text-sm text-gray-400">Images</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <File className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {mediaFiles.filter(f => !f.type.startsWith('image/')).length}
              </p>
              <p className="text-sm text-gray-400">Documents</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Upload className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {formatFileSize(mediaFiles.reduce((total, file) => total + file.size, 0))}
              </p>
              <p className="text-sm text-gray-400">Total Size</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'image' | 'document')}
            className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
          >
            <option value="all">All Files</option>
            <option value="image">Images</option>
            <option value="document">Documents</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {selectedFiles.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {selectedFiles.length} selected
              </span>
              <button
                onClick={deleteSelectedFiles}
                className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={deselectAllFiles}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Deselect
              </button>
            </div>
          )}
          <div className="flex bg-gray-800/50 border border-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* File Selection Controls */}
      {filteredFiles.length > 0 && (
        <div className="flex items-center gap-4">
          <button
            onClick={selectAllFiles}
            className="text-sm text-gray-400 hover:text-white"
          >
            Select All
          </button>
          <button
            onClick={deselectAllFiles}
            className="text-sm text-gray-400 hover:text-white"
          >
            Deselect All
          </button>
        </div>
      )}

      {/* Files Display */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <Upload className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No files found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filters.' 
              : 'Upload your first file to get started.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className={`bg-gray-800/50 border rounded-xl p-4 hover:border-gray-600 transition-colors ${
                selectedFiles.includes(file.id) ? 'border-red-500 bg-red-500/10' : 'border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => toggleFileSelection(file.id)}
                  className="rounded border-gray-600 text-red-500 focus:ring-red-500"
                />
                <div className="flex items-center gap-2">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                  >
                    <Eye className="h-4 w-4" />
                  </a>
                  <a
                    href={file.url}
                    download={file.name}
                    className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                {isImage(file.type) ? (
                  <div className="relative h-32 bg-gray-700 rounded-lg overflow-hidden">
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-32 bg-gray-700 rounded-lg flex items-center justify-center">
                    {getFileIcon(file.type)}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium text-white mb-1 truncate" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-xs text-gray-400 mb-1">
                  {formatFileSize(file.size)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(file.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-300">
                    <input
                      type="checkbox"
                      checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                      onChange={() => {
                        if (selectedFiles.length === filteredFiles.length) {
                          deselectAllFiles();
                        } else {
                          selectAllFiles();
                        }
                      }}
                      className="rounded border-gray-600 text-red-500 focus:ring-red-500"
                    />
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-300">Name</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-300">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-300">Size</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-300">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="border-t border-gray-700 hover:bg-gray-700/20">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => toggleFileSelection(file.id)}
                        className="rounded border-gray-600 text-red-500 focus:ring-red-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {isImage(file.type) ? (
                          <div className="relative w-8 h-8 bg-gray-700 rounded overflow-hidden">
                            <Image
                              src={file.url}
                              alt={file.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                            {getFileIcon(file.type)}
                          </div>
                        )}
                        <span className="text-white font-medium">{file.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400">{file.type}</td>
                    <td className="p-4 text-gray-400">{formatFileSize(file.size)}</td>
                    <td className="p-4 text-gray-400">
                      {new Date(file.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                        <a
                          href={file.url}
                          download={file.name}
                          className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => deleteFile(file.id)}
                          className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 