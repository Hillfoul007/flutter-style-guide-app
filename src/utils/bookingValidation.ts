// Booking data validation utility

export interface BookingData {
  service: string;
  provider_name: string;
  date: string;
  time: string;
  location: string;
  status: "Confirmed" | "Upcoming" | "Cancelled" | "Completed";
  price: number;
  details?: string;
  service_provider_id?: string | null;
  booked_at: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData?: BookingData;
}

export const validateBookingData = (data: any): ValidationResult => {
  const errors: string[] = [];

  // Required fields validation
  if (!data.service || typeof data.service !== "string") {
    errors.push("Service name is required and must be a string");
  }

  if (!data.provider_name || typeof data.provider_name !== "string") {
    errors.push("Provider name is required and must be a string");
  }

  if (!data.date || typeof data.date !== "string") {
    errors.push("Date is required and must be a string");
  } else {
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.date)) {
      errors.push("Date must be in YYYY-MM-DD format");
    }
  }

  if (!data.time || typeof data.time !== "string") {
    errors.push("Time is required and must be a string");
  }

  if (!data.location || typeof data.location !== "string") {
    errors.push("Location is required and must be a string");
  }

  if (
    !data.status ||
    !["Confirmed", "Upcoming", "Cancelled", "Completed"].includes(data.status)
  ) {
    errors.push(
      "Status must be one of: Confirmed, Upcoming, Cancelled, Completed",
    );
  }

  if (
    data.price === undefined ||
    data.price === null ||
    typeof data.price !== "number" ||
    data.price < 0
  ) {
    errors.push("Price is required and must be a positive number");
  }

  if (!data.booked_at || typeof data.booked_at !== "string") {
    errors.push("Booking timestamp is required and must be a string");
  }

  // Optional fields validation
  if (
    data.details !== undefined &&
    data.details !== null &&
    typeof data.details !== "string"
  ) {
    errors.push("Details must be a string if provided");
  }

  if (
    data.service_provider_id !== undefined &&
    data.service_provider_id !== null
  ) {
    if (typeof data.service_provider_id !== "string") {
      errors.push("Service provider ID must be a string or null");
    } else {
      // Validate UUID format if provided
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(data.service_provider_id)) {
        errors.push("Service provider ID must be a valid UUID format or null");
      }
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // Sanitize and structure the data
  const sanitizedData: BookingData = {
    service: data.service.trim(),
    provider_name: data.provider_name.trim(),
    date: data.date,
    time: data.time.trim(),
    location: data.location.trim(),
    status: data.status,
    price: Number(data.price),
    details: data.details ? data.details.trim() : undefined,
    service_provider_id: data.service_provider_id || null,
    booked_at: data.booked_at,
  };

  return { isValid: true, errors: [], sanitizedData };
};

export const generateBookingId = (): string => {
  return (
    "booking_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
  );
};

export const formatBookingDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const formatBookingTime = (time: string): string => {
  // Ensure time is in HH:MM format
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (timeRegex.test(time)) {
    return time;
  }

  // Try to parse and format common time formats
  const date = new Date(`2000-01-01 ${time}`);
  if (!isNaN(date.getTime())) {
    return date.toTimeString().substr(0, 5);
  }

  return time; // Return as-is if we can't format it
};
