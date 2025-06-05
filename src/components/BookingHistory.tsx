
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Booking History
          </h1>
          <p className="text-gray-600">Your past and upcoming bookings</p>
        </div>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{booking.service}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <User className="w-4 h-4 mr-1" />
                    <span className="text-sm">{booking.provider}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-blue-600">${booking.price}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600 bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-3 text-blue-600" />
                  <span>{new Date(booking.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-3 text-blue-600" />
                  <span>{booking.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-3 text-blue-600" />
                  <span>{booking.location}</span>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                {booking.status === 'Upcoming' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg"
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-red-300 text-red-700 hover:bg-red-50 rounded-lg"
                    >
                      Cancel
                    </Button>
                  </>
                )}
                {booking.status === 'Completed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg"
                  >
                    Book Again
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-blue-100">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600">Your booking history will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
