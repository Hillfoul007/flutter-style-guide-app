
import React, { useState } from 'react';
import ServiceCategories from '../components/ServiceCategories';
import ProviderList from '../components/ProviderList';
import BookingFlow from '../components/BookingFlow';
import BookingHistory from '../components/BookingHistory';
import Reviews from '../components/Reviews';
import ProviderRegistration from '../components/ProviderRegistration';
import { ArrowLeft, History, UserCog } from 'lucide-react';

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
    }
  };

  const handleServiceSelect = (service) => {
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
      providerRegistration: 'Service Provider Portal'
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
          <button 
            onClick={() => setCurrentView('history')}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
          >
            <History className="w-5 h-5 text-white" />
          </button>
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
      </div>
    </div>
  );
};

export default Index;
