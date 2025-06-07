import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { handleAuthError } from "@/utils/authErrorHandler";

interface Booking {
  id: string;
  service: string;
  provider_name: string;
  date: string;
  time: string;
  location: string;
  status: "Confirmed" | "Upcoming" | "Cancelled" | "Completed";
  price: number;
  user_email?: string;
  details?: string;
  booked_at: string;
  service_provider_id?: string;
}

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBookings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("booked_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // Check if it's an auth error
      if (
        error?.message?.includes("refresh") ||
        error?.message?.includes("token")
      ) {
        await handleAuthError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: Omit<Booking, "id">) => {
    if (!user) throw new Error("User not authenticated");

    try {
      console.log("Attempting to create booking for user:", user.id);
      console.log("Booking data:", bookingData);

      const insertData = {
        ...bookingData,
        user_id: user.id,
        user_email: user.email,
      };

      console.log("Final insert data:", insertData);

      const { data, error } = await supabase
        .from("bookings")
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }

      console.log("Booking inserted successfully:", data);
      setBookings((prev) => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error("Error creating booking:", error);
      // Check if it's an auth error
      if (
        error?.message?.includes("refresh") ||
        error?.message?.includes("token")
      ) {
        await handleAuthError(error);
      }
      return { data: null, error };
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      const { error } = await supabase.from("bookings").delete().eq("id", id);

      if (error) throw error;

      setBookings((prev) => prev.filter((b) => b.id !== id));
      return { error: null };
    } catch (error) {
      console.error("Error deleting booking:", error);
      return { error };
    }
  };

  const clearAllBookings = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      setBookings([]);
      return { error: null };
    } catch (error) {
      console.error("Error clearing bookings:", error);
      return { error };
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  return {
    bookings,
    loading,
    createBooking,
    deleteBooking,
    clearAllBookings,
    refetch: fetchBookings,
  };
};
