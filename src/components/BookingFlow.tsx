
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const BookingFlow = ({ provider }) => {
  const [selectedDate, setSelectedDate] = useState('October 15, 2023');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [additionalDetails, setAdditionalDetails] = useState('');

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

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Date</h3>
          <div className="p-4 bg-gray-50 rounded-lg border">
            <p className="text-gray-900">{selectedDate}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Time</h3>
          <div className="p-4 bg-gray-50 rounded-lg border">
            <p className="text-gray-900">{selectedTime}</p>
          </div>
        </div>

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

      <Button className="w-full mt-8 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 rounded-xl">
        Confirm and Pay
      </Button>
    </div>
  );
};

export default BookingFlow;
