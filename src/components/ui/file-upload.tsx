"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { File, X, Upload, Image, FileText, FileCode, Film, Music, Archive, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export interface FileUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  onUploadComplete?: (url: string, fileType: string) => void;
  accept?: string;
  maxSize?: number;
  buttonText?: string;
  disabled?: boolean;
  folder?: string;
}

export function FileUpload({
  value,
  onChange,
  onUploadComplete,
  accept = "*",
  maxSize = 5, // Default max size in MB
  buttonText = "Upload File",
  disabled = false,
  folder = "uploads"
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>(value || "");
  const [fileType, setFileType] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive"
      });
      return;
    }
    
    setFileType(file.type);
    setUploading(true);
    
    // In a real implementation, this would use an actual upload service
    // For now, we'll simulate a file upload with a delay
    setTimeout(() => {
      // Create a fake URL for demo purposes
      // In production, this would be the URL returned from your upload service
      const fakeUrl = `https://upload.example.com/${folder}/${Date.now()}-${file.name}`;
      
      setFileUrl(fakeUrl);
      setUploading(false);
      
      if (onChange) {
        onChange(fakeUrl);
      }
      
      if (onUploadComplete) {
        onUploadComplete(fakeUrl, file.type);
      }
      
      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully"
      });
    }, 1500);
  };
  
  const getFileIcon = (url: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (fileType.startsWith('video/')) return <Film className="h-5 w-5" />;
    if (fileType.startsWith('audio/')) return <Music className="h-5 w-5" />;
    if (fileType.startsWith('text/')) return <FileText className="h-5 w-5" />;
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <Archive className="h-5 w-5" />;
    if (fileType.includes('code') || fileType.includes('json')) return <FileCode className="h-5 w-5" />;
    
    return <File className="h-5 w-5" />;
  };
  
  const handleClearFile = () => {
    setFileUrl("");
    setFileType("");
    
    // Reset the file input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    
    if (onChange) {
      onChange("");
    }
  };
  
  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
        disabled={uploading || disabled}
      />
      
      {fileUrl ? (
        <div className="flex items-center space-x-2 bg-muted p-2 rounded-md">
          <div className="flex-shrink-0">
            {getFileIcon(fileUrl)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm truncate">{fileUrl.split('/').pop()}</p>
            <p className="text-xs text-muted-foreground truncate">{fileUrl}</p>
          </div>
          <div className="flex-shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearFile}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md px-6 py-8">
          <div className="flex flex-col items-center text-center space-y-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-sm font-medium">
              {buttonText}
            </div>
            <div className="text-xs text-muted-foreground">
              Drag and drop or click to upload
            </div>
            <div className="text-xs text-muted-foreground">
              Max file size: {maxSize}MB
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || disabled}
        >
          {uploading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-foreground"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Uploading...
            </>
          ) : fileUrl ? (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Change File
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {buttonText}
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 