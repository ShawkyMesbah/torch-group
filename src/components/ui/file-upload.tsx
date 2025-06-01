"use client";

import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";

interface FileUploadProps {
  endpoint: keyof OurFileRouter;
  onUploadComplete: (res: { url: string }[]) => void;
  onUploadError?: (error: Error) => void;
  onUploadBegin?: () => void;
  className?: string;
  fileUrl?: string;
  id?: string;
}

export function FileUpload({
  endpoint,
  onUploadComplete,
  onUploadError,
  onUploadBegin,
  className,
  id,
  fileUrl,
}: FileUploadProps) {
  return (
    <UploadDropzone<OurFileRouter, keyof OurFileRouter>
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (res) {
          onUploadComplete(res);
        }
      }}
      onUploadError={(error: Error) => {
        console.error("Upload error:", error);
        if (onUploadError) onUploadError(error);
      }}
      onUploadBegin={() => {
        console.log("Upload begins");
        if (onUploadBegin) onUploadBegin();
      }}
    />
  );
} 