
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Menu, ShoppingCart, ChevronDown, ChevronUp, X } from 'lucide-react';

const ServiceCategories = ({ onServiceSelect }) => {
  const [location, setLocation] = useState('');
  const [isLocationAuto, setIsLocationAuto] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const services = [
    {
      id: 'cleaning',
      name: 'Cleaning',
      icon: '🧹',
      description: 'House & apartment cleaning'
    },
    {
      id: 'furniture',
      name: 'Furniture Assembly',
      icon: '🪑',
      description: 'IKEA & furniture setup'
    },
    {
      id: 'repair',
      name: 'Home Repair',
      icon: '🔧',
      description: 'Fix & maintenance tasks'
    },
    {
      id: 'moving',
      name: 'Moving',
      icon: '📦',
      description: 'Packing & moving help'
    },
    {
      id: 'laundry',
      name: 'Laundry Services',
      icon: '👕',
      description: 'Professional laundry care'
    }
  ];

  const laundryServices = [
    { id: 'laundry-fold', name: 'Laundry & Fold Service' },
    { id: 'laundry-iron', name: 'Laundry and Iron Service' },
    { id: 'iron-only', name: 'Iron Service' },
    { id: 'dry-cleaning-mens', name: "Dry Cleaning Mens' Wear" },
    { id: 'dry-cleaning-womens', name: "Dry Cleaning Women's Wear" },
    { id: 'other-dry-cleaning', name: 'Other Dry Cleaning' }
  ];

  const handleAutoLocation = () => {
    setIsLocationAuto(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation('Current Location - Downtown Area');
          setIsLocationAuto(false);
        },
        (error) => {
          console.log('Location access denied');
          setLocation('Location access denied');
          setIsLocationAuto(false);
        }
      );
    }
  };

  const addToCart = (service) => {
    const newItem = { 
      ...service, 
      id: `${service.id}-${Date.now()}`,
      addedAt: new Date().toISOString()
    };
    setCartItems([...cartItems, newItem]);
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const handleServiceClick = (serviceId) => {
    if (serviceId === 'laundry') {
      setIsServicesMenuOpen(!isServicesMenuOpen);
    } else {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        addToCart(service);
      }
    }
  };

  const handleBookService = (service) => {
    // Pass the service to the booking flow
    onServiceSelect(service.id);
  };

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Book a Task</h1>
        <p className="text-gray-600">Choose the service you need</p>
      </div>

      {/* Location Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <Button
              onClick={handleAutoLocation}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
              disabled={isLocationAuto}
            >
              <MapPin className="w-4 h-4 mr-2" />
              {isLocationAuto ? 'Getting Location...' : 'Auto Detect'}
            </Button>
          </div>
          <div className="relative">
            <Input
              placeholder="Enter area, city manually"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10"
            />
            <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Services Menu Button */}
      <div className="mb-6">
        <Button
          onClick={() => setIsServicesMenuOpen(!isServicesMenuOpen)}
          variant="outline"
          className="w-full flex items-center justify-between p-4 border-2 border-amber-200 hover:border-amber-300"
        >
          <div className="flex items-center">
            <Menu className="w-5 h-5 mr-3 text-amber-600" />
            <span className="font-semibold text-gray-900">Services Menu</span>
          </div>
          {isServicesMenuOpen ? (
            <ChevronUp className="w-5 h-5 text-amber-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-amber-600" />
          )}
        </Button>

        {/* Expandable Laundry Services */}
        {isServicesMenuOpen && (
          <div className="mt-3 bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h4 className="font-semibold text-gray-900 mb-3">Laundry Services</h4>
            <div className="space-y-2">
              {laundryServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-gray-800">{service.name}</span>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addToCart(service)}
                      className="border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      Add to Cart
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleBookService(service)}
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Service Categories Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm"
          >
            <div className="text-3xl mb-3">{service.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{service.description}</p>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleServiceClick(service.id)}
                className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                Add to Cart
              </Button>
              <Button
                size="sm"
                onClick={() => handleBookService(service)}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
              >
                Book Now
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-6 h-6 text-amber-600" />
            <span className="font-semibold text-gray-900">Cart</span>
            {cartItems.length > 0 && (
              <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                {cartItems.length}
              </span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
            onClick={() => setShowCart(!showCart)}
          >
            {showCart ? 'Hide Cart' : 'View Cart'}
          </Button>
        </div>

        {/* Cart Items */}
        {showCart && cartItems.length > 0 && (
          <div className="mt-3 bg-white rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-800 text-sm">{item.name}</span>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleBookService(item)}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-2 py-1"
                  >
                    Book
                  </Button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showCart && cartItems.length === 0 && (
          <div className="mt-3 bg-white rounded-lg border border-gray-200 p-4 text-center text-gray-500">
            Your cart is empty
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
        <Button 
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 rounded-xl"
          onClick={() => {
            if (cartItems.length > 0) {
              handleBookService(cartItems[0]);
            }
          }}
        >
          Book Selected Services
        </Button>
      )}
    </div>
  );
};

export default ServiceCategories;
