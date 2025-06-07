
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User, Trash2 } from 'lucide-react';
import { useBookings } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';

const BookingHistory = () => {
  const { bookings, loading, deleteBooking, clearAllBookings } = useBookings();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600">Please sign in to view your booking history.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      await deleteBooking(bookingId);
    }
  };

  const handleClearAllBookings = async () => {
    if (confirm('Are you sure you want to clear all booking history?')) {
      await clearAllBookings();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Booking History
          </h1>
          <p className="text-gray-600">Your past and upcoming bookings</p>
          {bookings.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAllBookings}
              className="mt-4 border-red-300 text-red-700 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All History
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{booking.service}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <User className="w-4 h-4 mr-1" />
                    <span className="text-sm">{booking.provider_name}</span>
                  </div>
                  {booking.user_email && (
                    <div className="text-sm text-blue-600 mt-1">
                      Booked by: {booking.user_email}
                    </div>
                  )}
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
                {booking.details && (
                  <div className="mt-2 p-2 bg-white rounded-lg">
                    <span className="text-gray-700 text-xs">Details: {booking.details}</span>
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  Booked on: {new Date(booking.booked_at).toLocaleDateString()} at {new Date(booking.booked_at).toLocaleTimeString()}
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg"
                >
                  Book Again
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteBooking(booking.id)}
                  className="border-red-300 text-red-700 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
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
            <p className="text-gray-600">Your booking history will appear here after you make a booking</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
