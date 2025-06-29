import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnifiedLoadingProps {
  fullScreen?: boolean;
  className?: string;
}

export function UnifiedLoading({ fullScreen = false, className }: UnifiedLoadingProps) {
  return (
    <div className={cn(
      "flex items-center justify-center p-4",
      fullScreen ? "min-h-screen" : "min-h-[100px]",
      className
    )}>
      <Loader2 className="w-8 h-8 animate-spin text-primary dark:text-primary-light" />
    </div>
  );
} 