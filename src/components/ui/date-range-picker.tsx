"use client";

import * as React from "react";
import { CalendarIcon, Clock } from "lucide-react";
import { addDays, format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  onApply?: () => void;
  className?: string;
}

const presets = [
  {
    label: "Last 7 days",
    range: () => ({
      from: subDays(new Date(), 6),
      to: new Date(),
    }),
  },
  {
    label: "Last 30 days",
    range: () => ({
      from: subDays(new Date(), 29),
      to: new Date(),
    }),
  },
  {
    label: "Last 90 days",
    range: () => ({
      from: subDays(new Date(), 89),
      to: new Date(),
    }),
  },
  {
    label: "This month",
    range: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: "Last month",
    range: () => {
      const lastMonth = subDays(startOfMonth(new Date()), 1);
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth),
      };
    },
  },
  {
    label: "This year",
    range: () => ({
      from: startOfYear(new Date()),
      to: endOfYear(new Date()),
    }),
  },
];

export function DateRangePicker({ value, onChange, onApply, className }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedPreset, setSelectedPreset] = React.useState<string | null>(null);

  const handlePresetClick = (preset: typeof presets[0]) => {
    const range = preset.range();
    onChange(range);
    setSelectedPreset(preset.label);
  };

  const handleApply = () => {
    if (onApply) onApply();
    setIsOpen(false);
    setSelectedPreset(null);
  };

  const handleClear = () => {
    onChange(undefined);
    setSelectedPreset(null);
    setIsOpen(false);
  };

  const formatDateRange = () => {
    if (value?.from) {
      if (value.to) {
        return (
          <>
            {format(value.from, "MMM dd, yyyy")} - {format(value.to, "MMM dd, yyyy")}
          </>
        );
      } else {
        return format(value.from, "MMM dd, yyyy");
      }
    }
    return <span className="text-muted-foreground">Pick a date range</span>;
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[320px] justify-start text-left font-normal bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-3 h-4 w-4 text-gray-500" />
            <div className="flex flex-col">
              <span className="text-sm">{formatDateRange()}</span>
              {selectedPreset && (
                <span className="text-xs text-gray-500 font-normal">
                  {selectedPreset}
                </span>
            )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800" align="start">
          <div className="flex">
            {/* Presets Sidebar */}
            <div className="w-48 p-3 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Quick Select
                </div>
                {presets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start text-left h-8 px-2 font-normal",
                      selectedPreset === preset.label && "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                    )}
                    onClick={() => handlePresetClick(preset)}
                  >
                    <Clock className="mr-2 h-3 w-3" />
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="p-3">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
                onSelect={(range) => {
                  onChange(range);
                  setSelectedPreset(null);
                }}
            numberOfMonths={2}
                className="rounded-md"
          />
              
              <Separator className="my-3" />
              
              <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
                  onClick={handleClear}
                  className="flex-1"
            >
              Clear
            </Button>
            <Button
              size="sm"
                  onClick={handleApply}
                  disabled={!value?.from}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Apply
            </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 