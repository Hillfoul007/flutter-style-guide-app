
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import StarRating from './StarRating';

const ProviderList = ({ service, onProviderSelect, onViewReviews }) => {
  const [providers, setProviders] = useState([
    {
      id: 1,
      name: 'Jenny Wilson',
      price: 25,
      rating: 4.8,
      reviews: 127,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b332c5cd?w=150&h=150&fit=crop&crop=face',
      specialty: 'Cleaning'
    },
    {
      id: 2,
      name: 'Wade Warren',
      price: 20,
      rating: 4.7,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      specialty: 'Cleaning'
    },
    {
      id: 3,
      name: 'Albert Flores',
      price: 25,
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      specialty: 'Cleaning'
    }
  ]);

  useEffect(() => {
    // Load registered service providers from localStorage
    const registeredProviders = JSON.parse(localStorage.getItem('serviceProviders') || '[]');
    
    // Check if there are any registered providers to display
    if (registeredProviders.length > 0) {
      // Filter providers by specialty/service if needed
      // For now, we'll just combine them with default providers
      const allProviders = [...providers];
      
      // Avoid duplicates by checking existing IDs
      const existingIds = new Set(allProviders.map(p => p.id));
      
      registeredProviders.forEach(provider => {
        if (!existingIds.has(provider.id)) {
          allProviders.push({
            ...provider,
            // Ensure required fields have default values
            rating: provider.rating || 0,
            reviews: provider.reviews || 0,
            specialty: provider.specialty || service
          });
          existingIds.add(provider.id);
        }
      });
      
      setProviders(allProviders);
    }
  }, [service]);

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
