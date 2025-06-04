
import React from 'react';
import { Button } from '@/components/ui/button';

const ServiceCategories = ({ onServiceSelect }) => {
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

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Book a Task</h1>
        <p className="text-gray-600">Choose the service you need</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onServiceSelect(service.id)}
            className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <div className="text-3xl mb-3">{service.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
            <p className="text-sm text-gray-600">{service.description}</p>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <div className="w-6 h-6 text-gray-400">📍</div>
          <span className="text-gray-700">Location</span>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <div className="w-6 h-6 text-gray-400">📅</div>
          <span className="text-gray-700">Date</span>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <div className="w-6 h-6 text-gray-400">🕐</div>
          <span className="text-gray-700">Time</span>
        </div>
      </div>

      <Button className="w-full mt-8 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 rounded-xl">
        Find Pros
      </Button>
    </div>
  );
};

export default ServiceCategories;
