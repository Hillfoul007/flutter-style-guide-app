import { supabase } from "@/integrations/supabase/client";

export const handleAuthError = async (error: any) => {
  console.error("Authentication error:", error);

  // Check if it's a refresh token error
  if (
    error?.message?.includes("refresh") ||
    error?.message?.includes("token") ||
    error?.message?.includes("Invalid Refresh Token")
  ) {
    console.log("Detected refresh token error, clearing session");

    try {
      // Clear the corrupted session
      await supabase.auth.signOut();

      // Clear any cached auth data in localStorage
      localStorage.removeItem("supabase.auth.token");

      // Reload the page to reset the app state
      window.location.reload();
    } catch (signOutError) {
      console.error("Error during auth recovery:", signOutError);
      // Force clear localStorage and reload as last resort
      localStorage.clear();
      window.location.reload();
    }
  }
};

// Global error handler for Supabase auth errors
export const setupAuthErrorHandler = () => {
  // Listen for unhandled promise rejections that might be auth errors
  window.addEventListener("unhandledrejection", (event) => {
    if (
      event.reason?.message?.includes("refresh") ||
      event.reason?.message?.includes("Invalid Refresh Token")
    ) {
      console.log("Caught unhandled auth error:", event.reason);
      handleAuthError(event.reason);
      event.preventDefault(); // Prevent the error from being logged to console
    }
  });
};
