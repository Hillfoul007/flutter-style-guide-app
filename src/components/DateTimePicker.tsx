
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  selectedDate?: Date;
  selectedTime?: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

const DateTimePicker = ({ selectedDate, selectedTime, onDateChange, onTimeChange }: DateTimePickerProps) => {
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  // Generate time slots from 8 AM to 8 PM
  const timeSlots = [];
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const displayTime = `${hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
      timeSlots.push({ value: time, label: displayTime });
    }
  }

  const today = new Date();
  const isToday = selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  const currentHour = today.getHours();
  const currentMinute = today.getMinutes();

  const availableTimeSlots = timeSlots.filter(slot => {
    if (!isToday) return true;
    const [hour, minute] = slot.value.split(':').map(Number);
    return hour > currentHour || (hour === currentHour && minute > currentMinute);
  });

  return (
    <div className="space-y-4">
      {/* Date Picker */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Date</h3>
        <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal p-4 h-auto",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-3 h-5 w-5" />
              {selectedDate ? format(selectedDate, "PPPP") : "Select a date"}
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
              disabled={(date) => date < new Date()}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Picker */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Time</h3>
        <Select 
          value={selectedTime} 
          onValueChange={onTimeChange}
          open={isTimeOpen}
          onOpenChange={setIsTimeOpen}
        >
          <SelectTrigger className="w-full p-4 h-auto">
            <div className="flex items-center">
              <Clock className="mr-3 h-5 w-5" />
              <SelectValue placeholder="Select a time" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {availableTimeSlots.map((slot) => (
              <SelectItem key={slot.value} value={slot.value}>
                {slot.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DateTimePicker;
