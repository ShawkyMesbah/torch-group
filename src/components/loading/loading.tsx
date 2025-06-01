export default function Loading() {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <div className="relative">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-red-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 rounded-full bg-black"></div>
        </div>
      </div>
    </div>
  );
} 