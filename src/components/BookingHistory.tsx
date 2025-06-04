
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

const BookingHistory = () => {
  // Mock booking data
  const bookings = [
    {
      id: 1,
      service: 'House Cleaning',
      provider: 'Sarah Johnson',
      date: '2024-06-15',
      time: '10:00 AM',
      location: '123 Main St',
      status: 'Completed',
      price: 80
    },
    {
      id: 2,
      service: 'Furniture Assembly',
      provider: 'Mike Wilson',
      date: '2024-06-20',
      time: '2:00 PM',
      location: '123 Main St',
      status: 'Upcoming',
      price: 120
    },
    {
      id: 3,
      service: 'Laundry & Fold Service',
      provider: 'Lisa Chen',
      date: '2024-06-10',
      time: '9:00 AM',
      location: '123 Main St',
      status: 'Completed',
      price: 45
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking History</h1>
        <p className="text-gray-600">Your past and upcoming bookings</p>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{booking.service}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <User className="w-4 h-4 mr-1" />
                  <span className="text-sm">{booking.provider}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${booking.price}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(booking.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{booking.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{booking.location}</span>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              {booking.status === 'Upcoming' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                </>
              )}
              {booking.status === 'Completed' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  Book Again
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Calendar className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-600">Your booking history will appear here</p>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
