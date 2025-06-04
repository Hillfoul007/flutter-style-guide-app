
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
    // Simulate login
    setIsLoggedIn(true);
    setShowLogin(false);
    alert('Login successful!');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log('Signup attempt:', signupForm);
    // Simulate signup
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
      <div className="p-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isSignup ? 'Create Account' : 'Login to Continue'}
          </h2>
          
          <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
            {isSignup && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                  required
                  className="mt-1"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
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
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
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
                className="mt-1"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            >
              {isSignup ? 'Create Account' : 'Login'}
            </Button>
          </form>
          
          <div className="text-center mt-4">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-amber-600 hover:text-amber-700"
            >
              {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
            </button>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowLogin(false)}
            className="w-full mt-4"
          >
            Back to Booking
          </Button>
        </div>
      </div>
    );
  }

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
        {isLoggedIn && (
          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLoggedIn(false)}
              className="text-gray-600"
            >
              Logout
            </Button>
          </div>
        )}
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
        {isLoggedIn ? 'Confirm and Pay' : 'Login to Continue'}
      </Button>
    </div>
  );
};

export default BookingFlow;
