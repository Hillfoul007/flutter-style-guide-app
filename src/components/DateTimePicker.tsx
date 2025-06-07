import React, { useState, useEffect } from "react";
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
import { CalendarIcon, Clock } from "lucide-react";
import { format, addHours, addDays, isToday, isTomorrow } from "date-fns";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  selectedDate?: Date;
  selectedTime?: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

const DateTimePicker = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
}: DateTimePickerProps) => {
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<
    { value: string; label: string }[]
  >([]);

  const generateTimeSlots = (date: Date | undefined) => {
    if (!date) return [];

    const now = new Date();
    const slots: { value: string; label: string }[] = [];

    // If selected date is today, start from next hour
    // If selected date is in the future, start from 8 AM
    let startTime: Date;

    if (isToday(date)) {
      // Start from next hour (rounded up)
      startTime = new Date(now);
      startTime.setMinutes(0, 0, 0);
      startTime = addHours(startTime, 1);
    } else {
      // Start from 8 AM for future dates
      startTime = new Date(date);
      startTime.setHours(8, 0, 0, 0);
    }

    // End time is 8 PM on the selected date
    const endTime = new Date(date);
    endTime.setHours(20, 0, 0, 0);

    // Generate hourly slots
    let currentSlot = new Date(startTime);

    while (currentSlot <= endTime) {
      const timeValue = format(currentSlot, "HH:mm");
      const timeLabel = format(currentSlot, "h:mm a");

      slots.push({
        value: timeValue,
        label: timeLabel,
      });

      // Add 1 hour to current slot
      currentSlot = addHours(currentSlot, 1);
    }

    return slots;
  };

  useEffect(() => {
    const slots = generateTimeSlots(selectedDate);
    setAvailableSlots(slots);

    // Clear selected time if it's no longer available
    if (selectedTime && !slots.some((slot) => slot.value === selectedTime)) {
      onTimeChange("");
    }
  }, [selectedDate, selectedTime, onTimeChange]);

  const getDateDisplayText = (date: Date) => {
    if (isToday(date)) {
      return `Today, ${format(date, "MMM d")}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow, ${format(date, "MMM d")}`;
    } else {
      return format(date, "EEEE, MMM d");
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Picker */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          📅 Select Date
        </h3>
        <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal p-4 h-auto rounded-xl border-blue-200",
                !selectedDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-3 h-5 w-5 text-blue-600" />
              {selectedDate
                ? getDateDisplayText(selectedDate)
                : "Choose your preferred date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                onDateChange(date);
                setIsDateOpen(false);
              }}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Picker */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          🕐 Select Time
        </h3>
        {selectedDate ? (
          <Select
            value={selectedTime}
            onValueChange={onTimeChange}
            open={isTimeOpen}
            onOpenChange={setIsTimeOpen}
          >
            <SelectTrigger className="w-full p-4 h-auto rounded-xl border-blue-200">
              <div className="flex items-center">
                <Clock className="mr-3 h-5 w-5 text-blue-600" />
                <SelectValue placeholder="Choose your preferred time" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {availableSlots.length > 0 ? (
                availableSlots.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-slots" disabled>
                  No available slots for this date
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        ) : (
          <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 text-center">
            Please select a date first to see available time slots
          </div>
        )}

        {selectedDate && availableSlots.length > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            <p>📍 {availableSlots.length} time slots available</p>
            <p>⏰ Next available: {availableSlots[0]?.label}</p>
          </div>
        )}

        {selectedDate && isToday(selectedDate) && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800">
              💡 <strong>Same-day booking:</strong> Slots start from the next
              available hour
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateTimePicker;
