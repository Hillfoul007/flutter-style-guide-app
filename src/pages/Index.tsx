
import React, { useState } from 'react';
import ServiceCategories from '../components/ServiceCategories';
import ProviderList from '../components/ProviderList';
import BookingFlow from '../components/BookingFlow';
import BookingHistory from '../components/BookingHistory';
import Reviews from '../components/Reviews';
import { ArrowLeft, History } from 'lucide-react';

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
      history: 'Booking History'
    };

    if (currentView === 'categories') {
      return (
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="w-8 h-8"></div>
          <h1 className="text-lg font-semibold text-gray-900">TaskApp</h1>
          <button 
            onClick={() => setCurrentView('history')}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
          >
            <History className="w-5 h-5" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <button 
          onClick={navigateBack}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{titles[currentView]}</h1>
        <div className="w-8 h-8"></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
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
      </div>
    </div>
  );
};

export default Index;
