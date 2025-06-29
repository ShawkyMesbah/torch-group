import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  href: string;
}

export function DashboardCard({
  title,
  value,
  icon: Icon,
  href,
}: DashboardCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "block p-6 bg-[#1a2234] rounded-xl border border-gray-800",
        "hover:bg-[#1e2943] transition-all duration-200",
        "group relative overflow-hidden"
      )}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "p-3 rounded-lg",
            "bg-red-500/10"
          )}>
            <Icon className="w-6 h-6 text-red-500" />
          </div>
          <span className="text-3xl font-bold text-white">{value}</span>
        </div>
        <h3 className="text-base font-medium text-gray-400 group-hover:text-gray-300">
          {title}
        </h3>
      </div>
      <div className="absolute right-0 top-0 -mt-4 -mr-4 opacity-20 group-hover:opacity-30 transition-opacity">
        <Icon className="w-24 h-24 text-red-500" />
      </div>
    </Link>
  );
} 