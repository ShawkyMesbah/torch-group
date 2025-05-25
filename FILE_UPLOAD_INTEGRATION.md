# File Upload Integration with UploadThing

This document describes how file uploads are implemented in the Torch Group application using the UploadThing service.

## Overview

The Torch Group application uses [UploadThing](https://uploadthing.com/) for handling file uploads. This service provides a reliable and secure way to manage user-uploaded files with features like:

- Client-side file validation
- Direct-to-storage uploads
- File type restrictions
- Max file size limits
- Automatic file hosting
- Customizable UI components

## Implementation

### Core Components

1. **File Upload Component**
   - Location: `src/components/ui/file-upload.tsx`
   - A reusable React component that wraps the UploadThing dropzone
   - Supports image and document uploads with preview functionality

2. **UploadThing Router**
   - Location: `src/app/api/uploadthing/core.ts`
   - Defines different file upload routes with specific permissions and configurations
   - Each route has its own file type restrictions and size limits

3. **Upload API Route**
   - Location: `src/app/api/uploadthing/route.ts`
   - Handles the server-side processing of uploads
   - Integrates with NextAuth for authentication

### Available Upload Endpoints

The following upload endpoints are configured:

| Endpoint | File Types | Max Size | Max Files | Authentication |
|----------|------------|----------|-----------|----------------|
| profileImage | Images | 4MB | 1 | Required |
| teamMemberImage | Images | 4MB | 1 | Required |
| projectImage | Images | 4MB | 1 | Required |
| blogImage | Images | 4MB | 5 | Required |
| document | PDF, Text | 8MB, 1MB | 1 | Required |

### Integration Points

1. **Contact Form**
   - Users can attach documents to their contact form submissions
   - The attachment URL is stored in the database and included in notification emails
   - File types: PDF, Text files
   - Max size: 8MB

2. **Blog Post Editor**
   - Allows uploading images for blog posts
   - Supports multiple image uploads

3. **Team Member Management**
   - Enables profile image uploads for team members

4. **Project Management**
   - Supports cover image uploads for projects

### Demo Page

A demonstration page is available at `/dashboard/upload-demo` which showcases all available upload components and their functionality.

## Usage Examples

### Adding File Upload to a Form

```tsx
import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";

export function MyForm() {
  const [fileUrl, setFileUrl] = useState<string | undefined>();
  
  return (
    <form>
      {/* Other form fields */}
      
      <FileUpload
        endpoint="document"
        value={fileUrl}
        onChange={setFileUrl}
      />
      
      {/* Form submission button */}
    </form>
  );
}
```

### Handling Uploaded Files in API Routes

```tsx
// API route handler
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Store the file URL in the database
  await prisma.someModel.create({
    data: {
      // Other fields
      fileUrl: body.fileUrl,
    },
  });
  
  // Return success response
  return NextResponse.json({ success: true });
}
```

## Testing and Development

When testing locally:

1. Ensure your `.env` file contains valid UploadThing credentials:
   ```
   UPLOADTHING_SECRET=your-secret-key
   UPLOADTHING_APP_ID=your-app-id
   ```

2. Use the development endpoints which don't count against your production quota
   - All file uploads during local development are stored in the development environment

## Security Considerations

1. **Authentication**
   - All upload endpoints require authentication through NextAuth
   - The middleware checks for a valid session before allowing uploads

2. **File Validation**
   - File types are restricted to prevent malicious uploads
   - File sizes are limited to prevent abuse

3. **Frontend Security**
   - Upload components show friendly error messages for validation failures
   - Loading states prevent multiple submissions

## Production Considerations

In production, uploaded files are stored in UploadThing's secure cloud storage and served through their CDN. The URLs are stable and can be stored in the database.

## Troubleshooting

Common issues:

1. **Upload Failures**
   - Check browser console for errors
   - Verify CORS configuration
   - Ensure authentication is working

2. **Missing Environment Variables**
   - UploadThing requires valid credentials in `.env`

3. **File Size Restrictions**
   - If uploads fail with large files, check the size limits in `core.ts` 