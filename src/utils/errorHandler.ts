// Enhanced error handling and debugging utility

export interface DetailedError {
  message: string;
  details?: string;
  code?: string;
  hint?: string;
  originalError?: any;
}

export const parseSupabaseError = (error: any): DetailedError => {
  if (!error) {
    return { message: "Unknown error occurred" };
  }

  // If it's already a properly formatted error
  if (typeof error === "string") {
    return { message: error };
  }

  // Extract Supabase-specific error information
  const message = error.message || error.msg || "Unknown error occurred";
  const details = error.details || error.detail || error.description || "";
  const code = error.code || error.error_code || error.status || "";
  const hint = error.hint || error.suggestion || "";

  return {
    message,
    details,
    code,
    hint,
    originalError: error,
  };
};

export const logDetailedError = (
  context: string,
  error: any,
): DetailedError => {
  const parsedError = parseSupabaseError(error);

  console.group(`🚨 Error in ${context}`);
  console.error("Message:", parsedError.message);
  if (parsedError.details) console.error("Details:", parsedError.details);
  if (parsedError.code) console.error("Code:", parsedError.code);
  if (parsedError.hint) console.error("Hint:", parsedError.hint);
  console.error("Full Error Object:", parsedError.originalError);
  console.groupEnd();

  return parsedError;
};

export const getDisplayError = (error: any): string => {
  const parsed = parseSupabaseError(error);

  // Return the most descriptive error message available
  if (parsed.details && parsed.details !== parsed.message) {
    return `${parsed.message}: ${parsed.details}`;
  }

  if (parsed.hint) {
    return `${parsed.message}. ${parsed.hint}`;
  }

  return parsed.message;
};

export const isAuthError = (error: any): boolean => {
  const message = error?.message || "";
  return (
    message.includes("refresh") ||
    message.includes("token") ||
    message.includes("authentication") ||
    message.includes("unauthorized")
  );
};

export const isDatabaseError = (error: any): boolean => {
  const code = error?.code || "";
  return (
    code.startsWith("23") || // Database constraint errors
    code.startsWith("42") || // Database syntax errors
    code.includes("PGRST")
  ); // PostgREST errors
};

export const getErrorCategory = (error: any): string => {
  if (isAuthError(error)) return "Authentication Error";
  if (isDatabaseError(error)) return "Database Error";

  const code = error?.code || "";
  if (code.startsWith("400")) return "Bad Request";
  if (code.startsWith("500")) return "Server Error";

  return "Unknown Error";
};
