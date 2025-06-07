import { supabase } from "@/integrations/supabase/client";

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  field?: "email" | "phone";
}

export const checkEmailExists = async (
  email: string,
): Promise<ValidationResult> => {
  try {
    // Check if email exists in auth.users
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error("Error checking email existence:", error);
      // Fallback: try to sign in with dummy password to check if email exists
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: "dummy-password-check-123",
      });

      if (signInError?.message?.includes("Invalid login credentials")) {
        // Could be invalid password OR invalid email, so we can't be sure
        return { isValid: true }; // Allow to proceed
      } else if (signInError?.message?.includes("Email not confirmed")) {
        return {
          isValid: false,
          message:
            "This email is already registered but not confirmed. Please check your email for verification.",
          field: "email",
        };
      } else if (signInError?.message?.includes("Invalid")) {
        return { isValid: true }; // Email might not exist
      }

      return { isValid: true }; // Default to allowing if we can't check
    }

    // Check if email exists in the users list
    const existingUser = data?.users?.find((user) => user.email === email);

    if (existingUser) {
      return {
        isValid: false,
        message:
          "This email is already associated with an account. Please use a different email or sign in.",
        field: "email",
      };
    }

    return { isValid: true };
  } catch (error) {
    console.error("Unexpected error checking email:", error);
    return { isValid: true }; // Default to allowing if we can't check
  }
};

export const checkPhoneExists = async (
  phone: string,
): Promise<ValidationResult> => {
  try {
    // Check in profiles table for phone number
    const { data, error } = await supabase
      .from("profiles")
      .select("phone")
      .eq("phone", phone)
      .limit(1);

    if (error) {
      console.error("Error checking phone existence:", error);
      return { isValid: true }; // Default to allowing if we can't check
    }

    if (data && data.length > 0) {
      return {
        isValid: false,
        message:
          "This phone number is already associated with an account. Please use a different number.",
        field: "phone",
      };
    }

    return { isValid: true };
  } catch (error) {
    console.error("Unexpected error checking phone:", error);
    return { isValid: true }; // Default to allowing if we can't check
  }
};

export const validateUserCredentials = async (
  email: string,
  phone: string,
): Promise<ValidationResult[]> => {
  const emailValidation = await checkEmailExists(email);
  const phoneValidation = await checkPhoneExists(phone);

  return [emailValidation, phoneValidation].filter((result) => !result.isValid);
};

// Utility function to format phone number for consistency
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // Format as (XXX) XXX-XXXX if it's a 10-digit US number
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // Return as-is if not a standard format
  return phone;
};

// Email validation regex
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (US format)
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/;
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || phoneRegex.test(phone);
};
