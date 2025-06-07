import { supabase } from "@/integrations/supabase/client";

export const testDatabaseConnection = async () => {
  try {
    console.log("Testing database connection...");

    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from("bookings")
      .select("count")
      .limit(1);

    if (connectionError) {
      console.error("Connection test failed:", connectionError);
      return { success: false, error: connectionError };
    }

    console.log("Database connection successful");

    // Test table structure
    const { data: tableTest, error: tableError } = await supabase
      .from("bookings")
      .select("*")
      .limit(1);

    if (tableError) {
      console.error("Table test failed:", tableError);
      return { success: false, error: tableError };
    }

    console.log("Table structure test successful");
    console.log("Sample data structure:", tableTest);

    return { success: true, data: tableTest };
  } catch (error) {
    console.error("Database test failed:", error);
    return { success: false, error };
  }
};

export const testBookingInsertion = async () => {
  try {
    console.log("Testing booking insertion...");

    const testBooking = {
      service: "Test Service",
      provider_name: "Test Provider",
      date: "2024-01-15",
      time: "10:00 AM",
      location: "Test Location",
      status: "Confirmed",
      price: 50,
      details: "Test booking for debugging",
      booked_at: new Date().toISOString(),
      user_id: "test-user-id",
      user_email: "test@example.com",
    };

    const { data, error } = await supabase
      .from("bookings")
      .insert([testBooking])
      .select()
      .single();

    if (error) {
      console.error("Test booking insertion failed:", error);
      return { success: false, error };
    }

    console.log("Test booking inserted successfully:", data);

    // Clean up test booking
    await supabase.from("bookings").delete().eq("id", data.id);

    return { success: true, data };
  } catch (error) {
    console.error("Test booking insertion failed:", error);
    return { success: false, error };
  }
};
