
import React, { useState } from 'react';
import ServiceCategories from '../components/ServiceCategories';
import ProviderList from '../components/ProviderList';
import BookingFlow from '../components/BookingFlow';
import BookingHistory from '../components/BookingHistory';
import Reviews from '../components/Reviews';
import ProviderRegistration from '../components/ProviderRegistration';
import { ArrowLeft, History, UserCog, User, Menu, X } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState('categories');
  const [selectedService, setSelectedService] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      categories: 'TaskApp',
      providers: 'Find Pros',
      booking: 'Book Service',
      reviews: 'Reviews',
      history: 'My Bookings',
      providerRegistration: 'Join as Pro',
      userLogin: 'Sign In'
    };

    if (currentView === 'categories') {
      return (
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between p-4 md:p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span className="text-xl md:text-2xl font-bold text-white">T</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">TaskApp</h1>
                <p className="text-blue-100 text-xs md:text-sm">Professional Services</p>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-3">
              <button 
                onClick={() => setCurrentView('userLogin')}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105"
              >
                <User className="w-4 h-4 text-white" />
                <span className="text-white font-medium">Sign In</span>
              </button>
              <button 
                onClick={() => setCurrentView('history')}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105"
              >
                <History className="w-4 h-4 text-white" />
                <span className="text-white font-medium">Bookings</span>
              </button>
              <button 
                onClick={() => setCurrentView('providerRegistration')}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105"
              >
                <UserCog className="w-4 h-4 text-white" />
                <span className="text-white font-medium">Join as Pro</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm shadow-2xl border-t border-white/20 z-50">
              <div className="p-4 space-y-3">
                <button 
                  onClick={() => {
                    setCurrentView('userLogin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300"
                >
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-900 font-medium">Sign In</span>
                </button>
                <button 
                  onClick={() => {
                    setCurrentView('history');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300"
                >
                  <History className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-900 font-medium">My Bookings</span>
                </button>
                <button 
                  onClick={() => {
                    setCurrentView('providerRegistration');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300"
                >
                  <UserCog className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-900 font-medium">Join as Pro</span>
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 shadow-xl">
        <div className="flex items-center justify-between p-4 md:p-6">
          <button 
            onClick={navigateBack}
            className="w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>
          <h1 className="text-lg md:text-xl font-bold text-white">{titles[currentView]}</h1>
          <div className="w-10 h-10 md:w-12 md:h-12"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {renderHeader()}
      
      <div className="relative">
        {/* Close mobile menu overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        <div className="max-w-7xl mx-auto">
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
            <div className="p-4 md:p-6">
              <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                  <p className="text-blue-100">Sign in to your account</p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Password</label>
                    <input
                      type="password"
                      className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      placeholder="Enter your password"
                    />
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                    Sign In
                  </button>
                  
                  <div className="text-center space-y-3">
                    <p className="text-gray-600">Don't have an account?</p>
                    <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300">
                      Create Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
