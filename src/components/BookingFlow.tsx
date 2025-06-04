
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import DateTimePicker from './DateTimePicker';

const BookingFlow = ({ provider }) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');

  const handleConfirmAndPay = () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    if (!selectedTime) {
      alert('Please select a time');
      return;
    }

    console.log('Booking confirmed:', {
      provider: provider.name,
      date: selectedDate,
      time: selectedTime,
      details: additionalDetails
    });

    alert('Booking confirmed! You will receive a confirmation email shortly.');
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-8">
        <img
          src={provider.image}
          alt={provider.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{provider.name}</h2>
          <p className="text-lg text-gray-700">${provider.price}/hr</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
          <p className="text-gray-700">123 Main St</p>
        </div>

        <DateTimePicker
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onDateChange={setSelectedDate}
          onTimeChange={setSelectedTime}
        />

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Details</h3>
          <Textarea
            placeholder="e.g. Please bring cleaning supplies"
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            className="min-h-[100px] resize-none border-gray-300 focus:border-amber-500 focus:ring-amber-500"
          />
        </div>
      </div>

      <Button 
        className="w-full mt-8 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 rounded-xl"
        onClick={handleConfirmAndPay}
      >
        Confirm and Pay
      </Button>
    </div>
  );
};

export default BookingFlow;
