
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Menu, ShoppingCart, ChevronDown, ChevronUp, X } from 'lucide-react';

const ServiceCategories = ({ onServiceSelect }) => {
  const [location, setLocation] = useState('');
  const [isLocationAuto, setIsLocationAuto] = useState(false);
  const [isLaundryMenuOpen, setIsLaundryMenuOpen] = useState(false);
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
    }
  ];

  const laundryServices = [
    { id: 'laundry-fold', name: 'Laundry & Fold Service', price: 25 },
    { id: 'laundry-iron', name: 'Laundry and Iron Service', price: 35 },
    { id: 'iron-only', name: 'Iron Service', price: 15 },
    { id: 'dry-cleaning-mens', name: "Dry Cleaning Mens' Wear", price: 45 },
    { id: 'dry-cleaning-womens', name: "Dry Cleaning Women's Wear", price: 50 },
    { id: 'other-dry-cleaning', name: 'Other Dry Cleaning', price: 40 }
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

  const handleServiceClick = (service) => {
    addToCart(service);
  };

  const handleBookService = (service) => {
    onServiceSelect(service.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Book a Task
          </h1>
          <p className="text-gray-600">Choose the service you need</p>
        </div>

        {/* Location Section */}
        <div className="mb-6 bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">📍 Location</h3>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Button
                onClick={handleAutoLocation}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl"
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
                className="pl-10 rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Laundry Service Menu Button */}
        <div className="mb-6">
          <Button
            onClick={() => setIsLaundryMenuOpen(!isLaundryMenuOpen)}
            variant="outline"
            className="w-full flex items-center justify-between p-6 border-2 border-blue-200 hover:border-blue-300 rounded-2xl bg-white shadow-lg"
          >
            <div className="flex items-center">
              <Menu className="w-5 h-5 mr-3 text-blue-600" />
              <span className="font-semibold text-gray-900">👕 Laundry Service Menu</span>
            </div>
            {isLaundryMenuOpen ? (
              <ChevronUp className="w-5 h-5 text-blue-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-blue-600" />
            )}
          </Button>

          {/* Expandable Laundry Services */}
          {isLaundryMenuOpen && (
            <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-inner">
              <h4 className="font-semibold text-gray-900 mb-4 text-lg">👕 Laundry Services</h4>
              <div className="space-y-3">
                {laundryServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex-1">
                      <span className="text-gray-800 font-medium">{service.name}</span>
                      <p className="text-blue-600 font-semibold">${service.price}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToCart(service)}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg px-4"
                      >
                        Add to Cart
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleBookService(service)}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg px-4"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-6 bg-white border border-blue-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">{service.name}</h3>
              <p className="text-sm text-gray-600 mb-6">{service.description}</p>
              <div className="flex flex-col space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleServiceClick(service)}
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg"
                >
                  Add to Cart
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleBookService(service)}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg"
                >
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Section */}
        <div className="mb-6 bg-white rounded-2xl shadow-lg border border-blue-100">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Cart</span>
              {cartItems.length > 0 && (
                <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg"
              onClick={() => setShowCart(!showCart)}
            >
              {showCart ? 'Hide Cart' : 'View Cart'}
            </Button>
          </div>

          {/* Cart Items */}
          {showCart && cartItems.length > 0 && (
            <div className="border-t border-blue-100 bg-blue-50 max-h-48 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border-b border-blue-100 last:border-b-0">
                  <div className="flex-1">
                    <span className="text-gray-800 text-sm font-medium">{item.name}</span>
                    {item.price && (
                      <p className="text-blue-600 font-semibold text-sm">${item.price}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleBookService(item)}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs px-3 py-1 rounded-lg"
                    >
                      Book
                    </Button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showCart && cartItems.length === 0 && (
            <div className="border-t border-blue-100 bg-blue-50 p-6 text-center text-gray-500">
              Your cart is empty
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <Button 
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 rounded-2xl shadow-lg"
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
    </div>
  );
};

export default ServiceCategories;
