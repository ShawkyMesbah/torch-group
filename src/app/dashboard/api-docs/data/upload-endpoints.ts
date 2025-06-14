import { ApiEndpointType } from "../components/endpoint-list";

export const uploadEndpoints: ApiEndpointType[] = [
  {
    method: 'POST',
    path: '/api/uploadthing',
    description: 'Upload files using UploadThing service',
    authorization: 'Staff or Admin, depending on file type',
    requestBody: {
      file: "Binary file data (multipart/form-data)",
      fileType: "image",
      metadata: {
        userId: "user_id",
        purpose: "blog-cover"
      }
    },
    responseExample: {
      success: true,
      fileUrl: "https://uploadthing.com/f/abcdef123456",
      fileName: "image.jpg",
      fileSize: 1024000,
      fileType: "image/jpeg",
      uploadedAt: "2023-02-01T00:00:00.000Z"
    }
  }
]; 