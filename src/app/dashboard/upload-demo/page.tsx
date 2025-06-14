"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Upload, 
  ImageIcon, 
  FileIcon, 
  CheckCircle, 
  AlertTriangle, 
  Trash2 
} from "lucide-react";

export default function UploadDemoPage() {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [documentUrl, setDocumentUrl] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<string>("images");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  
  const handleImageUploadComplete = (url: string, fileType: string) => {
    setImageUrl(url);
    setFileName(url.split('/').pop() || "");
    
    toast({
      title: "Image Upload Success",
      description: "Your image has been uploaded successfully.",
    });
  };
  
  const handleDocumentUploadComplete = (url: string, fileType: string) => {
    setDocumentUrl(url);
    setFileName(url.split('/').pop() || "");
    
    toast({
      title: "Document Upload Success",
      description: "Your document has been uploaded successfully.",
    });
  };
  
  const handleDeleteFile = () => {
    if (currentTab === "images") {
      setImageUrl("");
    } else {
      setDocumentUrl("");
    }
    
    setShowDeleteDialog(false);
    
    toast({
      title: "File Deleted",
      description: `${fileName} has been deleted successfully.`,
    });
  };
  
  const confirmDeleteFile = () => {
    setShowDeleteDialog(true);
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">File Upload Demo</h1>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-8">
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="images">
            <ImageIcon className="h-4 w-4 mr-2" />
            Images
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileIcon className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="images" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Image Upload</CardTitle>
              <CardDescription>
                Upload images for your blog posts and articles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <FileUpload
                  accept="image/*"
                  maxSize={2}
                  buttonText="Upload Image"
                  folder="images"
                  onUploadComplete={handleImageUploadComplete}
                  value={imageUrl}
                />
                
                {imageUrl && (
                  <div className="mt-4">
                    <Label className="mb-2 block">Image Preview</Label>
                    <div className="border rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={imageUrl} 
                        alt="Preview" 
                        className="max-h-[300px] mx-auto object-contain p-2"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            {imageUrl && (
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">Successfully uploaded</span>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={confirmDeleteFile}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Image
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Upload</CardTitle>
              <CardDescription>
                Upload PDFs, Word documents, and other files.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <FileUpload
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                  maxSize={5}
                  buttonText="Upload Document"
                  folder="documents"
                  onUploadComplete={handleDocumentUploadComplete}
                  value={documentUrl}
                />
                
                {documentUrl && (
                  <div className="mt-4">
                    <Label className="mb-2 block">Document Details</Label>
                    <div className="border rounded-md p-4 bg-muted/50">
                      <p className="text-sm font-medium">
                        Filename: {documentUrl.split('/').pop()}
                      </p>
                      <p className="text-sm mt-1">
                        URL: {documentUrl}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            {documentUrl && (
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">Successfully uploaded</span>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={confirmDeleteFile}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Document
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
      
      <Separator className="my-8" />
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Component Usage Instructions</CardTitle>
            <CardDescription>
              How to use the FileUpload component in your code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Basic Usage</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm mt-2">
{`import { FileUpload } from "@/components/ui/file-upload";

export default function MyComponent() {
  const handleUploadComplete = (url: string, fileType: string) => {
    console.log("File uploaded:", url, fileType);
  };
  
  return (
    <FileUpload
      accept="image/*"
      maxSize={2}
      onUploadComplete={handleUploadComplete}
    />
  );
}`}
                </pre>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Available Props</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse mt-2">
                    <thead>
                      <tr className="bg-muted text-left">
                        <th className="py-2 px-4 font-medium">Prop</th>
                        <th className="py-2 px-4 font-medium">Type</th>
                        <th className="py-2 px-4 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-2 px-4">value</td>
                        <td className="py-2 px-4">string</td>
                        <td className="py-2 px-4">Current file URL</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">onChange</td>
                        <td className="py-2 px-4">(url: string) =&gt; void</td>
                        <td className="py-2 px-4">Called when file URL changes</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">onUploadComplete</td>
                        <td className="py-2 px-4">(url: string, fileType: string) =&gt; void</td>
                        <td className="py-2 px-4">Called when upload completes</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">accept</td>
                        <td className="py-2 px-4">string</td>
                        <td className="py-2 px-4">Accepted file types</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">maxSize</td>
                        <td className="py-2 px-4">number</td>
                        <td className="py-2 px-4">Maximum file size in MB</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">buttonText</td>
                        <td className="py-2 px-4">string</td>
                        <td className="py-2 px-4">Text for upload button</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">disabled</td>
                        <td className="py-2 px-4">boolean</td>
                        <td className="py-2 px-4">Disable the upload input</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">folder</td>
                        <td className="py-2 px-4">string</td>
                        <td className="py-2 px-4">Target folder for upload</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your file
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFile} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 