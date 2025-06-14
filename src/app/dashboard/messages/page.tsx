import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { MessagesContent } from "@/components/dashboard/messages/messages-content";

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        <span className="ml-3 text-lg">Loading messages...</span>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
} 