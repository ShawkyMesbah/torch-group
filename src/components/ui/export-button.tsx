"use client"

import * as React from "react"
import { 
  Download, 
  FileSpreadsheet,
  FileJson,
  FileDown,
  ChevronDown,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type ExportFormat = "csv" | "excel" | "json" | "pdf";

interface ExportButtonProps {
  onExport: (format: ExportFormat) => void
  isLoading?: boolean
  disabled?: boolean
  className?: string
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg"
  formats?: ExportFormat[]
  label?: string
}

export function ExportButton({ 
  onExport, 
  isLoading = false, 
  disabled = false,
  className,
  variant = "outline",
  size = "sm",
  formats = ["csv", "excel", "json"],
  label = "Export Data"
}: ExportButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          disabled={disabled || isLoading}
          className={cn(
            "flex items-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
            className
          )}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {label}
          <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {formats.includes("csv") && (
          <DropdownMenuItem 
            onClick={() => onExport("csv")}
            disabled={isLoading}
            className="cursor-pointer"
          >
            <FileDown className="mr-2 h-4 w-4" />
            <span>CSV</span>
          </DropdownMenuItem>
        )}
        {formats.includes("excel") && (
          <DropdownMenuItem 
            onClick={() => onExport("excel")}
            disabled={isLoading}
            className="cursor-pointer"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            <span>Excel</span>
          </DropdownMenuItem>
        )}
        {formats.includes("json") && (
          <DropdownMenuItem 
            onClick={() => onExport("json")}
            disabled={isLoading}
            className="cursor-pointer"
          >
            <FileJson className="mr-2 h-4 w-4" />
            <span>JSON</span>
          </DropdownMenuItem>
        )}
        {formats.includes("pdf") && (
          <DropdownMenuItem 
            onClick={() => onExport("pdf")}
            disabled={isLoading}
            className="cursor-pointer"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            <span>PDF</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 