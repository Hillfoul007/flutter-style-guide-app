
import React, { useState } from 'react';
import ServiceCategories from '../components/ServiceCategories';
import ProviderList from '../components/ProviderList';
import BookingFlow from '../components/BookingFlow';
import BookingHistory from '../components/BookingHistory';
import Reviews from '../components/Reviews';
import ProviderRegistration from '../components/ProviderRegistration';
import { ArrowLeft, History, UserCog, User } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState('categories');
  const [selectedService, setSelectedService] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);

  const navigateBack = () => {
    if (currentView === 'booking') {
      setCurrentView('providers');
    } else if (currentView === 'providers') {
      setCurrentView('categories');
    } else if (currentView === 'reviews') {
      setCurrentView('providers');
    } else if (currentView === 'history') {
      setCurrentView('categories');
    } else if (currentView === 'providerRegistration') {
      setCurrentView('categories');
    } else if (currentView === 'userLogin') {
      setCurrentView('categories');
    }
  };

  const handleServiceSelect = (service) => {
    console.log('Selected service:', service);
    setSelectedService(service);
    setCurrentView('providers');
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setCurrentView('booking');
  };

  const handleViewReviews = (provider) => {
    setSelectedProvider(provider);
    setCurrentView('reviews');
  };

  const renderHeader = () => {
    const titles = {
      categories: '',
      providers: 'Search Results',
      booking: 'Schedule Task',
      reviews: 'Reviews',
      history: 'Booking History',
      providerRegistration: 'Service Provider Portal',
      userLogin: 'User Login'
    };

    if (currentView === 'categories') {
      return (
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-indigo-600 border-b border-blue-200 shadow-lg">
          <button 
            onClick={() => setCurrentView('providerRegistration')}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
          >
            <UserCog className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">TaskApp</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentView('userLogin')}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
            >
              <User className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={() => setCurrentView('history')}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
            >
              <History className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-indigo-600 border-b border-blue-200 shadow-lg">
        <button 
          onClick={navigateBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">{titles[currentView]}</h1>
        <div className="w-10 h-10"></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {renderHeader()}
      
      <div className="max-w-md mx-auto bg-transparent min-h-screen">
        {currentView === 'categories' && (
          <ServiceCategories onServiceSelect={handleServiceSelect} />
        )}
        
        {currentView === 'providers' && (
          <ProviderList 
            service={selectedService}
            onProviderSelect={handleProviderSelect}
            onViewReviews={handleViewReviews}
          />
        )}
        
        {currentView === 'booking' && selectedProvider && (
          <BookingFlow provider={selectedProvider} />
        )}
        
        {currentView === 'reviews' && selectedProvider && (
          <Reviews provider={selectedProvider} />
        )}

        {currentView === 'history' && (
          <BookingHistory />
        )}

        {currentView === 'providerRegistration' && (
          <ProviderRegistration />
        )}

        {currentView === 'userLogin' && (
          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                User Login
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="Enter your password"
                  />
                </div>
                
                <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-colors">
                  Login
                </button>
                
                <div className="text-center">
                  <p className="text-gray-600">Don't have an account?</p>
                  <button className="text-blue-600 font-medium hover:underline">
                    Sign up here
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
