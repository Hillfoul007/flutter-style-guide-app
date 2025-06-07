interface PhoneValidationResult {
  isValid: boolean;
  formatted: string;
  message?: string;
}

// Indian mobile number prefixes (first digit after country code)
const validPrefixes = ["6", "7", "8", "9"];

// Indian telecom operators and their number series
const operatorSeries = {
  Airtel: ["7", "8", "9"],
  Vodafone: ["7", "8", "9"],
  Jio: ["6", "7", "8", "9"],
  BSNL: ["6", "7", "8", "9"],
  Idea: ["7", "8", "9"],
};

export const validateIndianPhoneNumber = (
  phone: string,
): PhoneValidationResult => {
  if (!phone) {
    return {
      isValid: false,
      formatted: "",
      message: "Phone number is required",
    };
  }

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // Handle different input scenarios
  let cleanNumber = "";

  if (digits.length === 10) {
    cleanNumber = digits;
  } else if (digits.length === 12 && digits.startsWith("91")) {
    cleanNumber = digits.slice(2); // Remove +91
  } else if (digits.length === 13 && digits.startsWith("911")) {
    cleanNumber = digits.slice(3); // Remove 911 (mistaken +91)
  } else if (digits.length === 11 && digits.startsWith("0")) {
    cleanNumber = digits.slice(1); // Remove leading 0
  } else {
    return {
      isValid: false,
      formatted: digits,
      message: `Invalid phone number. Indian mobile numbers should be 10 digits. You entered ${digits.length} digits.`,
    };
  }

  // Validate 10-digit Indian mobile number
  if (cleanNumber.length !== 10) {
    return {
      isValid: false,
      formatted: digits,
      message: "Indian mobile numbers must be exactly 10 digits",
    };
  }

  // Check if first digit is valid (6, 7, 8, or 9)
  const firstDigit = cleanNumber[0];
  if (!validPrefixes.includes(firstDigit)) {
    return {
      isValid: false,
      formatted: formatIndianNumber(cleanNumber),
      message: "Indian mobile numbers must start with 6, 7, 8, or 9",
    };
  }

  // Additional validation for known invalid patterns
  if (
    cleanNumber === "0000000000" ||
    cleanNumber === "1111111111" ||
    cleanNumber === "1234567890" ||
    cleanNumber === "0987654321"
  ) {
    return {
      isValid: false,
      formatted: formatIndianNumber(cleanNumber),
      message: "Please enter a valid phone number",
    };
  }

  return {
    isValid: true,
    formatted: formatIndianNumber(cleanNumber),
  };
};

export const formatIndianNumber = (digits: string): string => {
  if (digits.length === 10) {
    // Format as XXXXX XXXXX
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return digits;
};

export const getCarrierInfo = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");
  const cleanNumber =
    digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;

  if (cleanNumber.length === 10) {
    const firstDigit = cleanNumber[0];
    const secondDigit = cleanNumber[1];

    // Basic carrier detection based on number series
    if (firstDigit === "6") {
      return "Reliance Jio";
    } else if (firstDigit === "7") {
      if (["0", "1", "2", "3", "4", "5"].includes(secondDigit)) {
        return "Airtel";
      } else {
        return "Vodafone";
      }
    } else if (firstDigit === "8") {
      return "Airtel/Vodafone";
    } else if (firstDigit === "9") {
      return "Various Operators";
    }
  }

  return "Unknown";
};

export const addCountryCode = (phone: string): string => {
  const validation = validateIndianPhoneNumber(phone);
  if (validation.isValid) {
    const digits = phone.replace(/\D/g, "");
    const cleanNumber =
      digits.length === 12 && digits.startsWith("91")
        ? digits.slice(2)
        : digits.length === 10
          ? digits
          : digits.slice(-10);
    return `+91 ${formatIndianNumber(cleanNumber)}`;
  }
  return phone;
};
