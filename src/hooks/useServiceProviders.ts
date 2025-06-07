
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  specialty: string;
  experience: string;
  price: number;
  bio: string;
  image: string;
  rating: number;
  location: string;
  phone?: string;
  address?: string;
}

export const useServiceProviders = () => {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProvider = async (providerData: Omit<ServiceProvider, 'id'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('service_providers')
        .insert([{
          ...providerData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setProviders(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error creating provider:', error);
      return { data: null, error };
    }
  };

  const updateProvider = async (id: string, updates: Partial<ServiceProvider>) => {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setProviders(prev => prev.map(p => p.id === id ? data : p));
      return { data, error: null };
    } catch (error) {
      console.error('Error updating provider:', error);
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return {
    providers,
    loading,
    createProvider,
    updateProvider,
    refetch: fetchProviders
  };
};
