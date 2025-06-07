import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import DateTimePicker from "./DateTimePicker";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/hooks/useBookings";
import Auth from "./Auth";

const BookingFlow = ({ provider }) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [address, setAddress] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  const { user } = useAuth();
  const { createBooking } = useBookings();

  const handleProceedToPayment = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    if (!selectedDate) {
      alert("Please select a date");
      return;
    }
    if (!selectedTime) {
      alert("Please select a time");
      return;
    }
    if (!address.trim()) {
      alert("Please enter your address");
      return;
    }

    setShowPayment(true);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    console.log("Payment attempt:", paymentForm);

    try {
      const bookingData = {
        service: provider.specialty || provider.name,
        provider_name: provider.name,
        date: selectedDate.toISOString().split("T")[0],
        time: selectedTime,
        location: address || "123 Main St",
        status: "Confirmed" as const,
        price: provider.price || 80,
        details: additionalDetails,
        service_provider_id: provider.id,
        booked_at: new Date().toISOString(),
      };

      console.log("Creating booking with data:", bookingData);
      const { data, error } = await createBooking(bookingData);

      if (error) {
        console.error("Booking creation error:", error);
        alert("Error creating booking: " + (error.message || error.toString()));
        return;
      }

      console.log("Booking created successfully:", data);
      alert("Payment successful! Your booking has been confirmed.");
      setShowPayment(false);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Error processing booking. Please try again.");
    }
  };

  if (showAuth) {
    return <Auth onBack={() => setShowAuth(false)} />;
  }

  if (showPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            💳 Payment Gateway
          </h2>

          <div className="mb-6 p-4 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">
              Booking Summary
            </h3>
            <p className="text-sm text-gray-600">
              Service: {provider.specialty || provider.name}
            </p>
            <p className="text-sm text-gray-600">
              Date: {selectedDate?.toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">Time: {selectedTime}</p>
            <p className="text-lg font-bold text-blue-600 mt-2">
              Total: ${provider.price || 80}
            </p>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            <div>
              <label
                htmlFor="nameOnCard"
                className="block text-gray-700 font-medium mb-2"
              >
                Name on Card
              </label>
              <input
                id="nameOnCard"
                type="text"
                value={paymentForm.nameOnCard}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, nameOnCard: e.target.value })
                }
                required
                className="w-full p-3 border border-blue-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label
                htmlFor="cardNumber"
                className="block text-gray-700 font-medium mb-2"
              >
                Card Number
              </label>
              <input
                id="cardNumber"
                type="text"
                value={paymentForm.cardNumber}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, cardNumber: e.target.value })
                }
                required
                className="w-full p-3 border border-blue-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="expiryDate"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Expiry Date
                </label>
                <input
                  id="expiryDate"
                  type="text"
                  value={paymentForm.expiryDate}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      expiryDate: e.target.value,
                    })
                  }
                  required
                  className="w-full p-3 border border-blue-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <label
                  htmlFor="cvv"
                  className="block text-gray-700 font-medium mb-2"
                >
                  CVV
                </label>
                <input
                  id="cvv"
                  type="text"
                  value={paymentForm.cvv}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, cvv: e.target.value })
                  }
                  required
                  className="w-full p-3 border border-blue-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl"
            >
              💳 Pay ${provider.price || 80}
            </Button>
          </form>

          <Button
            variant="outline"
            onClick={() => setShowPayment(false)}
            className="w-full mt-4 border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl"
          >
            Back to Booking Details
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
        <div className="flex items-center space-x-4 mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <img
            src={
              provider.image ||
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
            }
            alt={provider.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {provider.name}
            </h2>
            <p className="text-xl text-blue-600 font-semibold">
              ${provider.price}/hr
            </p>
          </div>
          {user && (
            <div className="ml-auto text-right">
              <div className="text-sm text-gray-600">Logged in as:</div>
              <div className="font-medium text-blue-600">{user.email}</div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📍 Service Address
            </h3>
            <Textarea
              placeholder="Enter your complete address where service is needed..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="min-h-[80px] resize-none border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
              required
            />
          </div>

          <div className="bg-blue-50 p-6 rounded-xl">
            <DateTimePicker
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateChange={setSelectedDate}
              onTimeChange={setSelectedTime}
            />
          </div>

          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📝 Additional Details
            </h3>
            <Textarea
              placeholder="e.g. Please bring cleaning supplies, special instructions..."
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              className="min-h-[120px] resize-none border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
            />
          </div>
        </div>

        <Button
          className="w-full mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg text-lg"
          onClick={handleProceedToPayment}
        >
          {user ? "💳 Proceed to Payment" : "🔐 Login to Continue"}
        </Button>
      </div>
    </div>
  );
};

export default BookingFlow;
