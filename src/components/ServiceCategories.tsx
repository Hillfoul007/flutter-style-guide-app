import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Plus, Minus, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const ServiceCategories = ({ onServiceSelect }) => {
  const [location, setLocation] = useState("");
  const [isLocationAuto, setIsLocationAuto] = useState(false);
  const { addToCart, cartItems, updateQuantity } = useCart();

  const services = [
    {
      id: "cleaning",
      name: "House Cleaning",
      icon: "🧹",
      description: "Professional house & apartment cleaning",
      price: 50,
      rating: 4.8,
      reviews: 234,
    },
    {
      id: "furniture",
      name: "Furniture Assembly",
      icon: "🪑",
      description: "IKEA & furniture setup service",
      price: 65,
      rating: 4.7,
      reviews: 189,
    },
    {
      id: "repair",
      name: "Home Repair",
      icon: "🔧",
      description: "Fix & maintenance tasks",
      price: 75,
      rating: 4.9,
      reviews: 456,
    },
    {
      id: "moving",
      name: "Moving Service",
      icon: "📦",
      description: "Packing & moving assistance",
      price: 80,
      rating: 4.6,
      reviews: 123,
    },
    {
      id: "laundry",
      name: "Laundry Service",
      icon: "👕",
      description: "Wash, dry & fold service",
      price: 25,
      rating: 4.5,
      reviews: 89,
    },
    {
      id: "gardening",
      name: "Gardening",
      icon: "🌱",
      description: "Garden maintenance & care",
      price: 45,
      rating: 4.7,
      reviews: 67,
    },
  ];

  const handleAutoLocation = () => {
    setIsLocationAuto(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation("Current Location - Downtown Area");
          setIsLocationAuto(false);
        },
        (error) => {
          console.log("Location access denied");
          setLocation("Location access denied");
          setIsLocationAuto(false);
        },
      );
    }
  };

  const getItemQuantity = (serviceId: string) => {
    const item = cartItems.find((item) => item.id === serviceId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (service) => {
    addToCart({
      id: service.id,
      name: service.name,
      price: service.price,
      description: service.description,
      icon: service.icon,
    });
  };

  const handleUpdateQuantity = (serviceId: string, newQuantity: number) => {
    updateQuantity(serviceId, newQuantity);
  };

  const handleBookNow = (service) => {
    // Add to cart first if not already added
    if (getItemQuantity(service.id) === 0) {
      handleAddToCart(service);
    }
    // Then proceed to booking
    onServiceSelect(service.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Book a Service
          </h1>
          <p className="text-gray-600">Choose from our professional services</p>
        </div>

        {/* Location Section */}
        <div className="mb-6 bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            📍 Service Location
          </h3>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Button
                onClick={handleAutoLocation}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl"
                disabled={isLocationAuto}
              >
                <MapPin className="w-4 h-4 mr-2" />
                {isLocationAuto ? "Getting Location..." : "Auto Detect"}
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

        {/* Service Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {services.map((service) => {
            const quantity = getItemQuantity(service.id);
            return (
              <div
                key={service.id}
                className="p-6 bg-white border border-blue-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-4xl mb-4 text-center">{service.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg text-center">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 text-center">
                  {service.description}
                </p>

                {/* Price and Rating */}
                <div className="mb-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    ${service.price}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">per hour</div>
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {service.rating}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({service.reviews})
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="mb-4">
                  {quantity === 0 ? (
                    <Button
                      onClick={() => handleAddToCart(service)}
                      variant="outline"
                      className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center space-x-3 p-2 bg-blue-50 rounded-xl">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(service.id, quantity - 1)
                        }
                        className="w-8 h-8 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center transition-all"
                      >
                        <Minus className="w-4 h-4 text-blue-600" />
                      </button>
                      <span className="font-bold text-blue-900 min-w-[2rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(service.id, quantity + 1)
                        }
                        className="w-8 h-8 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center transition-all"
                      >
                        <Plus className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Book Now Button */}
                <Button
                  onClick={() => handleBookNow(service)}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl"
                >
                  Book Now
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServiceCategories;
