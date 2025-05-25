import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";

const f = createUploadthing();

// Auth middleware to verify user is authenticated
const authMiddleware = async () => {
  const session = await auth();
  
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  
  return { userId: session.user.id };
};

// FileRouter for your app, can contain multiple file routes
export const ourFileRouter = {
  // For user profile images
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      return { fileUrl: file.url };
    }),
  
  // For team member images
  teamMemberImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      return { fileUrl: file.url };
    }),
  
  // For project covers and content images
  projectImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      return { fileUrl: file.url };
    }),
    
  // For blog post images
  blogImage: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      return { fileUrl: file.url };
    }),
  
  // For document uploads like PDFs
  document: f({ 
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
    text: { maxFileSize: "1MB", maxFileCount: 1 }
  })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      return { fileUrl: file.url };
    }),
};

export type OurFileRouter = typeof ourFileRouter; 