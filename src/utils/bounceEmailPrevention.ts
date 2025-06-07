interface EmailValidationResult {
  isValid: boolean;
  reason?: string;
  suggestions?: string[];
}

// Common email domains for typo correction
const commonDomains = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
  "icloud.com",
  "protonmail.com",
  "zoho.com",
  "live.com",
  "msn.com",
];

// Common domain typos mapping
const domainCorrections: Record<string, string> = {
  "gmai.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmal.com": "gmail.com",
  "yahooo.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "hotmai.com": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "outloo.com": "outlook.com",
};

// Disposable/temporary email domains to block
const disposableDomains = [
  "10minutemail.com",
  "10minutemail.net",
  "tempmail.org",
  "guerrillamail.com",
  "mailinator.com",
  "yopmail.com",
  "temp-mail.org",
  "throwaway.email",
  "fakeinbox.com",
  "maildrop.cc",
  "sharklasers.com",
  "guerrillamailblock.com",
  "pokemail.net",
  "spam4.me",
  "bccto.me",
  "chacuo.net",
  "dispostable.com",
  "emailsensei.com",
  "etranquil.com",
  "fakemail.net",
  "hidemail.de",
  "mytrashmail.com",
  "no-spam.ws",
  "noclickemail.com",
  "nogmailspam.info",
  "nomail.xl.cx",
  "notmailinator.com",
  "nowmymail.com",
  "recode.me",
  "recursor.net",
  "rhyta.com",
  "safe-mail.net",
  "selfdestructingmail.com",
  "sendspamhere.com",
  "snakemail.com",
  "sogetthis.com",
  "spamavert.com",
  "tempalias.com",
  "tempail.com",
  "tempemail.com",
  "tempinbox.com",
  "tempmail.eu",
  "tempmailer.com",
  "tempmailer.de",
  "tempmailaddress.com",
  "tempymail.com",
  "thankyou2010.com",
  "trash-amil.com",
  "trashmail.at",
  "trashmail.com",
  "trashmail.io",
  "trashmail.me",
  "trashmail.net",
  "trashymail.com",
  "trbvm.com",
  "tryalert.com",
  "uggsrock.com",
  "wegwerfmail.de",
  "wegwerfmail.net",
  "wegwerfmail.org",
  "wh4f.org",
  "whyspam.me",
  "willselfdestruct.com",
  "xoxy.net",
  "yogamaven.com",
  "yopmail.fr",
  "yopmail.net",
  "zetmail.com",
  "zoemail.org",
];

// Advanced email regex with comprehensive validation
const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const validateEmailFormat = (email: string): EmailValidationResult => {
  if (!email || typeof email !== "string") {
    return { isValid: false, reason: "Email is required" };
  }

  const trimmedEmail = email.trim().toLowerCase();

  // Basic format validation
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, reason: "Invalid email format" };
  }

  // Check for common issues
  if (trimmedEmail.includes("..")) {
    return { isValid: false, reason: "Email cannot contain consecutive dots" };
  }

  if (trimmedEmail.startsWith(".") || trimmedEmail.endsWith(".")) {
    return { isValid: false, reason: "Email cannot start or end with a dot" };
  }

  if (trimmedEmail.includes("@.") || trimmedEmail.includes(".@")) {
    return { isValid: false, reason: "Invalid dot placement around @" };
  }

  const [localPart, domain] = trimmedEmail.split("@");

  // Local part validation
  if (localPart.length > 64) {
    return {
      isValid: false,
      reason: "Email local part too long (max 64 characters)",
    };
  }

  if (localPart.length === 0) {
    return { isValid: false, reason: "Email local part cannot be empty" };
  }

  // Domain validation
  if (domain.length > 253) {
    return {
      isValid: false,
      reason: "Email domain too long (max 253 characters)",
    };
  }

  if (domain.length === 0) {
    return { isValid: false, reason: "Email domain cannot be empty" };
  }

  return { isValid: true };
};

export const checkDisposableEmail = (email: string): EmailValidationResult => {
  const domain = email.toLowerCase().split("@")[1];

  if (disposableDomains.includes(domain)) {
    return {
      isValid: false,
      reason:
        "Disposable email addresses are not allowed. Please use a permanent email address.",
    };
  }

  return { isValid: true };
};

export const suggestEmailCorrection = (
  email: string,
): EmailValidationResult => {
  const [localPart, domain] = email.toLowerCase().split("@");

  if (!domain) {
    return { isValid: false, reason: "Invalid email format" };
  }

  // Check for exact domain corrections
  if (domainCorrections[domain]) {
    return {
      isValid: false,
      reason: "Possible typo detected",
      suggestions: [`${localPart}@${domainCorrections[domain]}`],
    };
  }

  // Check for similar domains (Levenshtein distance)
  const suggestions = commonDomains
    .map((commonDomain) => ({
      domain: commonDomain,
      distance: getLevenshteinDistance(domain, commonDomain),
    }))
    .filter((item) => item.distance <= 2 && item.distance > 0)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map((item) => `${localPart}@${item.domain}`);

  if (suggestions.length > 0) {
    return {
      isValid: false,
      reason: "Did you mean one of these?",
      suggestions,
    };
  }

  return { isValid: true };
};

export const checkDomainMX = async (
  email: string,
): Promise<EmailValidationResult> => {
  const domain = email.split("@")[1];

  try {
    // Use a public DNS API to check MX records
    const response = await fetch(
      `https://dns.google/resolve?name=${domain}&type=MX`,
    );
    const data = await response.json();

    if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
      return { isValid: true };
    } else {
      return {
        isValid: false,
        reason: "Email domain does not exist or cannot receive emails",
      };
    }
  } catch (error) {
    console.warn("MX record check failed, allowing email:", error);
    // If we can't check, we'll allow it (don't block users due to network issues)
    return { isValid: true };
  }
};

export const validateRoleBasedEmail = (
  email: string,
): EmailValidationResult => {
  const localPart = email.toLowerCase().split("@")[0];

  const roleBasedPrefixes = [
    "admin",
    "administrator",
    "postmaster",
    "hostmaster",
    "webmaster",
    "www",
    "ftp",
    "mail",
    "email",
    "marketing",
    "sales",
    "support",
    "help",
    "info",
    "contact",
    "service",
    "office",
    "team",
    "group",
    "noreply",
    "no-reply",
    "donotreply",
    "bounce",
    "mailer-daemon",
  ];

  if (roleBasedPrefixes.includes(localPart)) {
    return {
      isValid: false,
      reason:
        "Role-based email addresses are not allowed. Please use a personal email address.",
    };
  }

  return { isValid: true };
};

export const comprehensiveEmailValidation = async (
  email: string,
): Promise<EmailValidationResult> => {
  // Step 1: Format validation
  const formatResult = validateEmailFormat(email);
  if (!formatResult.isValid) {
    return formatResult;
  }

  // Step 2: Check for typos and suggest corrections
  const typoResult = suggestEmailCorrection(email);
  if (!typoResult.isValid && typoResult.suggestions) {
    return typoResult;
  }

  // Step 3: Check for disposable emails
  const disposableResult = checkDisposableEmail(email);
  if (!disposableResult.isValid) {
    return disposableResult;
  }

  // Step 4: Check for role-based emails
  const roleBasedResult = validateRoleBasedEmail(email);
  if (!roleBasedResult.isValid) {
    return roleBasedResult;
  }

  // Step 5: Check domain MX records (async)
  const mxResult = await checkDomainMX(email);
  if (!mxResult.isValid) {
    return mxResult;
  }

  return { isValid: true };
};

// Helper function to calculate Levenshtein distance
function getLevenshteinDistance(str1: string, str2: string): number {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}
