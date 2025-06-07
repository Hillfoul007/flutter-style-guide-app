
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DateTimePicker from './DateTimePicker';

const BookingFlow = ({ provider }) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ email: '', password: '', name: '' });
  const [isSignup, setIsSignup] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt:', loginForm);
    setIsLoggedIn(true);
    setUserEmail(loginForm.email);
    setShowLogin(false);
    alert('Login successful!');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log('Signup attempt:', signupForm);
    setIsLoggedIn(true);
    setUserEmail(signupForm.email);
    setShowLogin(false);
    alert('Account created successfully!');
  };

  const handleProceedToPayment = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }

    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    if (!selectedTime) {
      alert('Please select a time');
      return;
    }

    setShowPayment(true);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    console.log('Payment attempt:', paymentForm);
    
    // Save booking to localStorage (simulating booking history)
    const booking = {
      id: Date.now(),
      service: provider.name,
      provider: provider.name,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      location: '123 Main St',
      status: 'Confirmed',
      price: provider.price || 80,
      userEmail: userEmail,
      details: additionalDetails,
      bookedAt: new Date().toISOString()
    };

    const existingBookings = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('bookingHistory', JSON.stringify(existingBookings));

    console.log('Booking confirmed:', booking);
    alert('Payment successful! Your booking has been confirmed.');
    setShowPayment(false);
  };

  if (showPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            💳 Payment Gateway
          </h2>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">Booking Summary</h3>
            <p className="text-sm text-gray-600">Service: {provider.name}</p>
            <p className="text-sm text-gray-600">Date: {selectedDate?.toLocaleDateString()}</p>
            <p className="text-sm text-gray-600">Time: {selectedTime}</p>
            <p className="text-lg font-bold text-blue-600 mt-2">Total: ${provider.price || 80}</p>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            <div>
              <Label htmlFor="nameOnCard" className="text-gray-700 font-medium">Name on Card</Label>
              <Input
                id="nameOnCard"
                type="text"
                value={paymentForm.nameOnCard}
                onChange={(e) => setPaymentForm({...paymentForm, nameOnCard: e.target.value})}
                required
                className="mt-2 rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <Label htmlFor="cardNumber" className="text-gray-700 font-medium">Card Number</Label>
              <Input
                id="cardNumber"
                type="text"
                value={paymentForm.cardNumber}
                onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                required
                className="mt-2 rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate" className="text-gray-700 font-medium">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="text"
                  value={paymentForm.expiryDate}
                  onChange={(e) => setPaymentForm({...paymentForm, expiryDate: e.target.value})}
                  required
                  className="mt-2 rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv" className="text-gray-700 font-medium">CVV</Label>
                <Input
                  id="cvv"
                  type="text"
                  value={paymentForm.cvv}
                  onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value})}
                  required
                  className="mt-2 rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-500"
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

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>
          
          <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-6">
            {isSignup && (
              <div>
                <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                  required
                  className="mt-2 rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={isSignup ? signupForm.email : loginForm.email}
                onChange={(e) => {
                  if (isSignup) {
                    setSignupForm({...signupForm, email: e.target.value});
                  } else {
                    setLoginForm({...loginForm, email: e.target.value});
                  }
                }}
                required
                className="mt-2 rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your email address"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={isSignup ? signupForm.password : loginForm.password}
                onChange={(e) => {
                  if (isSignup) {
                    setSignupForm({...signupForm, password: e.target.value});
                  } else {
                    setLoginForm({...loginForm, password: e.target.value});
                  }
                }}
                required
                className="mt-2 rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl"
            >
              {isSignup ? 'Create Account' : 'Sign In'}
            </Button>
          </form>
          
          <div className="text-center mt-6">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowLogin(false)}
            className="w-full mt-4 border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl"
          >
            Back to Booking
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
            src={provider.image}
            alt={provider.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{provider.name}</h2>
            <p className="text-xl text-blue-600 font-semibold">${provider.price}/hr</p>
          </div>
          {isLoggedIn && (
            <div className="ml-auto">
              <div className="text-sm text-gray-600">Logged in as:</div>
              <div className="font-medium text-blue-600">{userEmail}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsLoggedIn(false);
                  setUserEmail('');
                }}
                className="mt-1 text-gray-600 border-gray-300 hover:bg-gray-50 rounded-lg"
              >
                Logout
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">📍 Service Location</h3>
            <p className="text-gray-700">123 Main St, Downtown Area</p>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-3">📝 Additional Details</h3>
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
          {isLoggedIn ? '💳 Proceed to Payment' : '🔐 Login to Continue'}
        </Button>
      </div>
    </div>
  );
};

export default BookingFlow;
