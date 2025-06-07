export interface PasswordRequirement {
  label: string;
  regex: RegExp;
  met: boolean;
}

export interface PasswordValidation {
  isValid: boolean;
  requirements: PasswordRequirement[];
  strength: "weak" | "medium" | "strong";
}

export const validatePassword = (password: string): PasswordValidation => {
  const requirements: PasswordRequirement[] = [
    {
      label: "At least 8 characters",
      regex: /.{8,}/,
      met: false,
    },
    {
      label: "At least 1 letter",
      regex: /[a-zA-Z]/,
      met: false,
    },
    {
      label: "At least 1 number",
      regex: /\d/,
      met: false,
    },
    {
      label: "At least 1 special character",
      regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      met: false,
    },
  ];

  // Check each requirement
  requirements.forEach((req) => {
    req.met = req.regex.test(password);
  });

  const metCount = requirements.filter((req) => req.met).length;
  const isValid = metCount === requirements.length;

  let strength: "weak" | "medium" | "strong" = "weak";
  if (metCount >= 4) {
    strength = "strong";
  } else if (metCount >= 2) {
    strength = "medium";
  }

  return {
    isValid,
    requirements,
    strength,
  };
};

export const getPasswordStrengthColor = (
  strength: "weak" | "medium" | "strong",
): string => {
  switch (strength) {
    case "weak":
      return "text-red-600";
    case "medium":
      return "text-yellow-600";
    case "strong":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
};

export const getPasswordStrengthBgColor = (
  strength: "weak" | "medium" | "strong",
): string => {
  switch (strength) {
    case "weak":
      return "bg-red-200";
    case "medium":
      return "bg-yellow-200";
    case "strong":
      return "bg-green-200";
    default:
      return "bg-gray-200";
  }
};
