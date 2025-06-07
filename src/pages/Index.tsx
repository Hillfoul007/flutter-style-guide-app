
import React, { useState, useEffect } from 'react';
import ServiceCategories from '../components/ServiceCategories';
import ProviderList from '../components/ProviderList';
import BookingFlow from '../components/BookingFlow';
import BookingHistory from '../components/BookingHistory';
import Reviews from '../components/Reviews';
import ProviderRegistration from '../components/ProviderRegistration';
import Auth from '../components/Auth';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ArrowLeft, History, UserCog, User, Menu, X, LogOut } from 'lucide-react';

const IndexContent = () => {
  const [currentView, setCurrentView] = useState('categories');
  const [selectedService, setSelectedService] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    // Close mobile menu when view changes
    setIsMobileMenuOpen(false);
  }, [currentView]);

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
    } else if (currentView === 'auth') {
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

  const handleSignOut = async () => {
    await signOut();
    setCurrentView('categories');
  };

  const requiresAuth = ['history', 'booking'].includes(currentView);

  // Show auth screen if user tries to access protected content
  if (requiresAuth && !user && !loading) {
    return <Auth onBack={() => setCurrentView('categories')} />;
  }

  // Show auth screen if current view is auth
  if (currentView === 'auth') {
    return <Auth onBack={() => setCurrentView('categories')} />;
  }

  const renderHeader = () => {
    const titles = {
      categories: 'TaskApp',
      providers: 'Find Pros',
      booking: 'Book Service',
      reviews: 'Reviews',
      history: 'My Bookings',
      providerRegistration: 'Join as Pro'
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
              {user ? (
                <>
                  <div className="text-white text-sm">
                    Welcome, {user.email}
                  </div>
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
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <LogOut className="w-4 h-4 text-white" />
                    <span className="text-white font-medium">Sign Out</span>
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setCurrentView('auth')}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <User className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">Sign In</span>
                </button>
              )}
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
                {user ? (
                  <>
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <span className="text-blue-900 font-medium text-sm">Welcome, {user.email}</span>
                    </div>
                    <button 
                      onClick={() => setCurrentView('history')}
                      className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300"
                    >
                      <History className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-900 font-medium">My Bookings</span>
                    </button>
                    <button 
                      onClick={() => setCurrentView('providerRegistration')}
                      className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300"
                    >
                      <UserCog className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-900 font-medium">Join as Pro</span>
                    </button>
                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 p-3 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-300"
                    >
                      <LogOut className="w-5 h-5 text-red-600" />
                      <span className="text-red-900 font-medium">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setCurrentView('auth')}
                    className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300"
                  >
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-900 font-medium">Sign In</span>
                  </button>
                )}
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <IndexContent />
    </AuthProvider>
  );
};

export default Index;
