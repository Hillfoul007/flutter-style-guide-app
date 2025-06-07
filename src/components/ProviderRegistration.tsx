import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserCog, Mail, Phone, MapPin, Briefcase, Upload, CheckCircle, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useServiceProviders } from '@/hooks/useServiceProviders';
import { supabase } from '@/integrations/supabase/client';

const ProviderRegistration = () => {
  const [providerProfile, setProviderProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    specialty: 'Cleaning',
    experience: '',
    hourlyRate: '',
    bio: '',
    profileImage: null,
  });

  const { user } = useAuth();
  const { createProvider, updateProvider } = useServiceProviders();

  useEffect(() => {
    if (user) {
      fetchProviderProfile();
    }
  }, [user]);

  const fetchProviderProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching provider profile:', error);
        return;
      }

      if (data) {
        setProviderProfile(data);
        setRegistrationForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          specialty: data.specialty || 'Cleaning',
          experience: data.experience || '',
          hourlyRate: data.price?.toString() || '',
          bio: data.bio || '',
          profileImage: data.image || null,
        });
      }
    } catch (error) {
      console.error('Error fetching provider profile:', error);
    }
  };

  const handleRegistrationChange = (e) => {
    setRegistrationForm({
      ...registrationForm,
      [e.target.id]: e.target.value
    });
  };

  const handleSpecialtyChange = (value) => {
    setRegistrationForm({
      ...registrationForm,
      specialty: value
    });
  };

  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setRegistrationForm({
          ...registrationForm,
          profileImage: event.target.result
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const providerData = {
        name: registrationForm.name,
        email: registrationForm.email,
        password: 'temp_password', // This is now just for compatibility
        phone: registrationForm.phone,
        address: registrationForm.address,
        specialty: registrationForm.specialty,
        experience: registrationForm.experience,
        price: parseInt(registrationForm.hourlyRate, 10) || 25,
        bio: registrationForm.bio,
        image: registrationForm.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        rating: 0,
        reviews: 0,
      };

      let result;
      if (providerProfile) {
        // Update existing profile
        result = await updateProvider(providerProfile.id, providerData);
      } else {
        // Create new profile
        result = await createProvider(providerData);
      }

      if (result.error) {
        alert('Error saving provider profile: ' + result.error.message);
        return;
      }

      alert(providerProfile ? 'Profile updated successfully!' : 'Registration successful!');
      fetchProviderProfile(); // Refresh the profile
    } catch (error) {
      console.error('Registration error:', error);
      alert('Error processing registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 text-center">
          <UserCog className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to register as a service provider.</p>
        </div>
      </div>
    );
  }

  if (providerProfile && !loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <img 
              src={providerProfile.image} 
              alt={providerProfile.name} 
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-300" 
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{providerProfile.name}</h2>
              <p className="text-blue-600 font-semibold">{providerProfile.specialty}</p>
              <div className="mt-1 text-sm text-gray-500">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  <span>{providerProfile.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Service Details</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-medium">Specialty:</span>
                <span className="ml-2">{providerProfile.specialty}</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-medium">Experience:</span>
                <span className="ml-2">{providerProfile.experience || 'Not specified'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Hourly Rate:</span>
                <span className="ml-2 text-green-600 font-semibold">${providerProfile.price}/hr</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-medium">Phone:</span>
                <span className="ml-2">{providerProfile.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-medium">Address:</span>
                <span className="ml-2">{providerProfile.address || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {providerProfile.bio && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">About Me</h3>
              <p className="text-gray-600">{providerProfile.bio}</p>
            </div>
          )}

          <div className="text-center">
            <Button 
              onClick={() => setProviderProfile(null)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg mr-4"
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <UserCog className="w-12 h-12 text-blue-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {providerProfile ? 'Update Provider Profile' : 'Become a Service Provider'}
        </h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-gray-700">Full Name</Label>
              <Input
                id="name"
                value={registrationForm.name}
                onChange={handleRegistrationChange}
                required
                className="mt-1 rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={registrationForm.email}
                onChange={handleRegistrationChange}
                required
                className="mt-1 rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
              <Input
                id="phone"
                value={registrationForm.phone}
                onChange={handleRegistrationChange}
                className="mt-1 rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <Label htmlFor="specialty" className="text-gray-700">Specialty</Label>
              <Select 
                onValueChange={handleSpecialtyChange}
                value={registrationForm.specialty}
              >
                <SelectTrigger className="mt-1 rounded-lg border-blue-200">
                  <SelectValue placeholder="Select a specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cleaning">Cleaning</SelectItem>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Carpentry">Carpentry</SelectItem>
                  <SelectItem value="Painting">Painting</SelectItem>
                  <SelectItem value="Gardening">Gardening</SelectItem>
                  <SelectItem value="General Repairs">General Repairs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experience" className="text-gray-700">Years of Experience</Label>
              <Input
                id="experience"
                value={registrationForm.experience}
                onChange={handleRegistrationChange}
                className="mt-1 rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <Label htmlFor="hourlyRate" className="text-gray-700">Hourly Rate ($)</Label>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                value={registrationForm.hourlyRate}
                onChange={handleRegistrationChange}
                className="mt-1 rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address" className="text-gray-700">Address</Label>
            <Input
              id="address"
              value={registrationForm.address}
              onChange={handleRegistrationChange}
              className="mt-1 rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <Label htmlFor="bio" className="text-gray-700">Bio (Tell clients about yourself)</Label>
            <Textarea
              id="bio"
              value={registrationForm.bio}
              onChange={handleRegistrationChange}
              className="mt-1 rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="profileImage" className="text-gray-700">Profile Image</Label>
            <div className="mt-1 flex items-center">
              {registrationForm.profileImage ? (
                <div className="mr-4">
                  <img
                    src={registrationForm.profileImage}
                    alt="Profile Preview"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                </div>
              ) : null}
              <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-4 rounded-lg flex items-center transition duration-300">
                <Upload className="w-4 h-4 mr-2" />
                <span>Upload Image</span>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 rounded-lg"
          >
            {loading ? 'Processing...' : (providerProfile ? 'Update Profile' : 'Register as Service Provider')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProviderRegistration;
