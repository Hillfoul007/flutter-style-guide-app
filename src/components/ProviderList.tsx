import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import StarRating from './StarRating';

const ProviderList = ({ service, onProviderSelect, onViewReviews }) => {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    // Load only registered service providers from localStorage
    const registeredProviders = JSON.parse(localStorage.getItem('serviceProviders') || '[]');
    
    // Filter providers by specialty/service - show all if service is 'all' or matches specialty
    const filteredProviders = registeredProviders.filter(provider => {
      if (!service || service === 'all') return true;
      // Check if provider's specialty matches the selected service
      return provider.specialty && provider.specialty.toLowerCase() === service.toLowerCase();
    });
    
    console.log('Service:', service);
    console.log('Registered providers:', registeredProviders);
    console.log('Filtered providers:', filteredProviders);
    
    setProviders(filteredProviders);
  }, [service]);

  if (providers.length === 0) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=40&h=40&fit=crop"
              alt="Service"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-semibold text-gray-900 capitalize">{service}</span>
          </div>
          <button className="text-gray-600 font-medium">Sort</button>
        </div>
        
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No service providers available for {service}</div>
          <div className="text-gray-400 text-sm">Please check back later or try a different service.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <img 
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=40&h=40&fit=crop"
            alt="Service"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-semibold text-gray-900 capitalize">{service}</span>
        </div>
        <button className="text-gray-600 font-medium">Sort</button>
      </div>

      <div className="space-y-4">
        {providers.map((provider) => (
          <div key={provider.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-start space-x-4">
              <img
                src={provider.image}
                alt={provider.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                  <span className="text-lg font-semibold text-gray-900">${provider.price}/hr</span>
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  <StarRating rating={provider.rating} />
                  <span className="text-sm text-gray-600">({provider.rating})</span>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={() => onProviderSelect(provider)}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Book
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => onViewReviews(provider)}
                    className="border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Reviews
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button className="w-full mt-8 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 rounded-xl">
        Book Pros
      </Button>
    </div>
  );
};

export default ProviderList;
