
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

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt:', loginForm);
    setIsLoggedIn(true);
    setShowLogin(false);
    alert('Login successful!');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log('Signup attempt:', signupForm);
    setIsLoggedIn(true);
    setShowLogin(false);
    alert('Account created successfully!');
  };

  const handleConfirmAndPay = () => {
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

    console.log('Booking confirmed:', {
      provider: provider.name,
      date: selectedDate,
      time: selectedTime,
      details: additionalDetails
    });

    alert('Booking confirmed! You will receive a confirmation email shortly.');
  };

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
                placeholder="Enter your email"
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLoggedIn(false)}
                className="text-gray-600 border-gray-300 hover:bg-gray-50 rounded-lg"
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
          onClick={handleConfirmAndPay}
        >
          {isLoggedIn ? '💳 Confirm and Pay' : '🔐 Login to Continue'}
        </Button>
      </div>
    </div>
  );
};

export default BookingFlow;
