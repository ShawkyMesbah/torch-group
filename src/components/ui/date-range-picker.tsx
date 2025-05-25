import * as React from "react";
import { addDays, addMonths, addWeeks, format, startOfMonth, startOfWeek, endOfWeek, subDays, subMonths } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateRangePickerProps {
  className?: string;
  onChange: (range: DateRange | undefined) => void;
  value: DateRange | undefined;
  align?: "start" | "center" | "end";
}

type DatePreset = {
  name: string;
  getValue: () => DateRange;
};

export function DateRangePicker({
  className,
  onChange,
  value,
  align = "end",
}: DateRangePickerProps) {
  const today = new Date();
  
  const datePresets: DatePreset[] = [
    {
      name: "Today",
      getValue: () => ({
        from: today,
        to: today,
      }),
    },
    {
      name: "Yesterday",
      getValue: () => {
        const yesterday = subDays(today, 1);
        return {
          from: yesterday,
          to: yesterday,
        };
      },
    },
    {
      name: "Last 7 days",
      getValue: () => ({
        from: subDays(today, 6),
        to: today,
      }),
    },
    {
      name: "Last 14 days",
      getValue: () => ({
        from: subDays(today, 13),
        to: today,
      }),
    },
    {
      name: "Last 30 days",
      getValue: () => ({
        from: subDays(today, 29),
        to: today,
      }),
    },
    {
      name: "This week",
      getValue: () => ({
        from: startOfWeek(today, { weekStartsOn: 1 }),
        to: today,
      }),
    },
    {
      name: "This month",
      getValue: () => ({
        from: startOfMonth(today),
        to: today,
      }),
    },
    {
      name: "Last month",
      getValue: () => {
        const lastMonth = subMonths(today, 1);
        return {
          from: startOfMonth(lastMonth),
          to: endOfWeek(lastMonth),
        };
      },
    },
    {
      name: "Last 90 days",
      getValue: () => ({
        from: subDays(today, 89),
        to: today,
      }),
    },
  ];

  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size="sm"
            className={cn(
              "w-[240px] justify-start text-left font-normal bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} - {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Select date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <div className="flex justify-end border-b border-gray-200 dark:border-gray-700 p-3">
            <Select
              defaultValue="preset"
              onValueChange={(value) => {
                if (value !== "custom") {
                  const preset = datePresets.find((preset) => preset.name === value);
                  if (preset) {
                    onChange(preset.getValue());
                  }
                }
              }}
            >
              <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Select preset" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="preset">Select preset</SelectItem>
                {datePresets.map((preset) => (
                  <SelectItem key={preset.name} value={preset.name}>
                    {preset.name}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
            className="p-3"
          />
          <div className="flex items-center justify-between p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onChange({
                    from: subDays(today, 6),
                    to: today,
                  });
                  setOpen(false);
                }}
              >
                Last 7 days
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onChange({
                    from: subDays(today, 29),
                    to: today,
                  });
                  setOpen(false);
                }}
              >
                Last 30 days
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange(undefined);
                  setOpen(false);
                }}
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 