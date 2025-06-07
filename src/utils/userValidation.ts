import { supabase } from "@/integrations/supabase/client";
import {
  comprehensiveEmailValidation,
  validateEmailFormat,
} from "./bounceEmailPrevention";
import {
  validateIndianPhoneNumber,
  formatIndianNumber,
} from "./indianPhoneValidation";

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  field?: "email" | "phone";
}

export const checkEmailExists = async (
  email: string,
): Promise<ValidationResult> => {
  try {
    // First, run comprehensive email validation (bounce prevention)
    const emailValidation = await comprehensiveEmailValidation(email);
    if (!emailValidation.isValid) {
      return {
        isValid: false,
        message: emailValidation.reason || "Invalid email address",
        field: "email",
      };
    }

    // Use password reset request to check if email exists (client-safe method)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://dummy-url-that-will-never-be-used.com",
    });

    // If no error, email exists in the system
    if (!error) {
      return {
        isValid: false,
        message:
          "This email is already associated with an account. Please use a different email or sign in.",
        field: "email",
      };
    }

    // Check specific error messages
    if (
      error.message?.includes("User not found") ||
      error.message?.includes("Invalid email")
    ) {
      // Email doesn't exist, safe to use
      return { isValid: true };
    }

    if (error.message?.includes("Email not confirmed")) {
      return {
        isValid: false,
        message:
          "This email is already registered but not confirmed. Please check your email for verification.",
        field: "email",
      };
    }

    // For any other error, we'll check with a fallback method
    console.log("Password reset check inconclusive, trying fallback method");

    // Fallback: try to sign in with a very unlikely password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: "impossible-password-12345-!@#$%",
    });

    if (signInError) {
      if (
        signInError.message?.includes("Invalid login credentials") ||
        signInError.message?.includes("Wrong email or password")
      ) {
        // This usually means the email exists but password is wrong
        return {
          isValid: false,
          message:
            "This email is already associated with an account. Please use a different email or sign in.",
          field: "email",
        };
      } else if (signInError.message?.includes("Email not confirmed")) {
        return {
          isValid: false,
          message:
            "This email is already registered but not confirmed. Please check your email for verification.",
          field: "email",
        };
      } else if (
        signInError.message?.includes("User not found") ||
        signInError.message?.includes("Invalid email")
      ) {
        // Email doesn't exist
        return { isValid: true };
      }
    }

    // If we can't determine, allow to proceed (better UX than blocking)
    console.log("Could not determine email existence, allowing to proceed");
    return { isValid: true };
  } catch (error) {
    console.error("Unexpected error checking email:", error);
    // Default to allowing if we can't check (better UX)
    return { isValid: true };
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

// Utility function to format phone number for Indian numbers
export const formatPhoneNumber = (phone: string): string => {
  const validation = validateIndianPhoneNumber(phone);
  return validation.formatted;
};

// Enhanced email validation using bounce prevention
export const isValidEmail = (email: string): boolean => {
  const result = validateEmailFormat(email);
  return result.isValid;
};

// Phone validation (Indian format)
export const isValidPhoneNumber = (phone: string): boolean => {
  const validation = validateIndianPhoneNumber(phone);
  return validation.isValid;
};
