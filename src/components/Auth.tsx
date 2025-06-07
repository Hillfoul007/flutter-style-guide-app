import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import {
  checkEmailExists,
  checkPhoneExists,
  isValidEmail,
  isValidPhoneNumber,
  formatPhoneNumber,
} from "@/utils/userValidation";
import { validatePassword } from "@/utils/passwordValidation";
import { suggestEmailCorrection } from "@/utils/bounceEmailPrevention";
import PasswordRequirements from "@/components/PasswordRequirements";
import EmailSuggestion from "@/components/EmailSuggestion";
import {
  User,
  LogIn,
  UserPlus,
  ArrowLeft,
  UserCog,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface AuthProps {
  onBack: () => void;
  onJoinAsPro?: () => void;
  onLoginAsPro?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onBack, onJoinAsPro, onLoginAsPro }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Validation states
  const [emailValidation, setEmailValidation] = useState<{
    isValid: boolean;
    message?: string;
    checking?: boolean;
  }>({ isValid: true });
  const [phoneValidation, setPhoneValidation] = useState<{
    isValid: boolean;
    message?: string;
    checking?: boolean;
  }>({ isValid: true });
  const [passwordValidation, setPasswordValidation] = useState(
    validatePassword(""),
  );
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);
  const [emailCheckTimeout, setEmailCheckTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [phoneCheckTimeout, setPhoneCheckTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [emailSuggestions, setEmailSuggestions] = useState<{
    suggestions: string[];
    reason: string;
  } | null>(null);

  const { signIn, signUp } = useAuth();

  // Email validation with debounce
  useEffect(() => {
    if (!email || isLogin) {
      setEmailValidation({ isValid: true });
      return;
    }

    if (!isValidEmail(email)) {
      setEmailValidation({
        isValid: false,
        message: "Please enter a valid email address",
      });

      // Check for typo suggestions
      const suggestionResult = suggestEmailCorrection(email);
      if (
        suggestionResult.suggestions &&
        suggestionResult.suggestions.length > 0
      ) {
        setEmailSuggestions({
          suggestions: suggestionResult.suggestions,
          reason: suggestionResult.reason || "Did you mean one of these?",
        });
      } else {
        setEmailSuggestions(null);
      }
      return;
    } else {
      setEmailSuggestions(null);
    }

    // Clear previous timeout
    if (emailCheckTimeout) {
      clearTimeout(emailCheckTimeout);
    }

    setEmailValidation({ isValid: true, checking: true });

    // Set new timeout for email checking
    const timeout = setTimeout(async () => {
      try {
        const result = await checkEmailExists(email);
        setEmailValidation({
          isValid: result.isValid,
          message: result.message,
          checking: false,
        });
      } catch (error) {
        setEmailValidation({ isValid: true, checking: false });
      }
    }, 1000); // 1 second debounce

    setEmailCheckTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [email, isLogin]); // Removed emailCheckTimeout from dependencies

  // Phone validation with debounce
  useEffect(() => {
    if (!mobile || isLogin) {
      setPhoneValidation({ isValid: true });
      return;
    }

    if (!isValidPhoneNumber(mobile)) {
      setPhoneValidation({
        isValid: false,
        message: "Please enter a valid phone number",
      });
      return;
    }

    // Clear previous timeout
    if (phoneCheckTimeout) {
      clearTimeout(phoneCheckTimeout);
    }

    setPhoneValidation({ isValid: true, checking: true });

    // Set new timeout for phone checking
    const timeout = setTimeout(async () => {
      try {
        const result = await checkPhoneExists(mobile);
        setPhoneValidation({
          isValid: result.isValid,
          message: result.message,
          checking: false,
        });
      } catch (error) {
        setPhoneValidation({ isValid: true, checking: false });
      }
    }, 1000); // 1 second debounce

    setPhoneCheckTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [mobile, isLogin]); // Removed phoneCheckTimeout from dependencies

  // Password validation
  useEffect(() => {
    if (!isLogin) {
      const validation = validatePassword(password);
      setPasswordValidation(validation);
    }
  }, [password, isLogin]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleEmailSuggestionSelect = (suggestion: string) => {
    setEmail(suggestion);
    setEmailSuggestions(null);
  };

  const handleEmailSuggestionDismiss = () => {
    setEmailSuggestions(null);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setMobile(formattedPhone);
  };

  const isFormValid = () => {
    if (isLogin) {
      return email && password;
    }
    return (
      name &&
      email &&
      password &&
      mobile &&
      emailValidation.isValid &&
      phoneValidation.isValid &&
      passwordValidation.isValid &&
      !emailValidation.checking &&
      !phoneValidation.checking
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Additional validation before submission
    if (!isLogin && (!emailValidation.isValid || !phoneValidation.isValid)) {
      setMessage("Please fix the validation errors before submitting");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setMessage(error.message);
        } else {
          setMessage("Login successful!");
          setTimeout(onBack, 1500);
        }
      } else {
        const { error } = await signUp(email, password, name);
        if (error) {
          setMessage(error.message);
        } else {
          setMessage(
            "Account created! Please check your email to confirm your account.",
          );
        }
      }
    } catch (error) {
      setMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-md mx-auto">
        <Button
          onClick={onBack}
          variant="outline"
          className="mb-6 border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-blue-100">
              {isLogin ? "Sign in to your account" : "Join TaskApp today"}
            </p>
          </div>

          <div className="p-6">
            {message && (
              <div
                className={`p-3 rounded-xl mb-4 text-sm ${
                  message.includes("successful") || message.includes("created")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-gray-700 font-semibold"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                      className="mt-2 rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="mobile"
                      className="text-gray-700 font-semibold"
                    >
                      Mobile Number
                    </Label>
                    <div className="relative">
                      <Input
                        id="mobile"
                        type="tel"
                        value={mobile}
                        onChange={handlePhoneChange}
                        required={!isLogin}
                        className={`mt-2 rounded-xl pr-10 ${
                          mobile
                            ? phoneValidation.checking
                              ? "border-yellow-300"
                              : phoneValidation.isValid
                                ? "border-green-300"
                                : "border-red-300"
                            : "border-blue-200"
                        } focus:border-blue-500 focus:ring-blue-200`}
                        placeholder="(123) 456-7890"
                      />
                      {mobile && (
                        <div className="absolute right-3 top-5">
                          {phoneValidation.checking ? (
                            <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : phoneValidation.isValid ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      )}
                    </div>
                    {mobile &&
                      !phoneValidation.isValid &&
                      phoneValidation.message && (
                        <p className="mt-1 text-sm text-red-600">
                          {phoneValidation.message}
                        </p>
                      )}
                    {mobile && phoneValidation.checking && (
                      <p className="mt-1 text-sm text-yellow-600">
                        Checking phone availability...
                      </p>
                    )}
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="email" className="text-gray-700 font-semibold">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    className={`mt-2 rounded-xl pr-10 ${
                      !isLogin && email
                        ? emailValidation.checking
                          ? "border-yellow-300"
                          : emailValidation.isValid
                            ? "border-green-300"
                            : "border-red-300"
                        : "border-blue-200"
                    } focus:border-blue-500 focus:ring-blue-200`}
                    placeholder="Enter your email"
                  />
                  {!isLogin && email && (
                    <div className="absolute right-3 top-5">
                      {emailValidation.checking ? (
                        <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : emailValidation.isValid ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
                {!isLogin &&
                  email &&
                  !emailValidation.isValid &&
                  emailValidation.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {emailValidation.message}
                    </p>
                  )}
                {!isLogin && email && emailValidation.checking && (
                  <p className="mt-1 text-sm text-yellow-600">
                    Checking email availability...
                  </p>
                )}
                {!isLogin && emailSuggestions && (
                  <EmailSuggestion
                    suggestions={emailSuggestions.suggestions}
                    reason={emailSuggestions.reason}
                    onSelectSuggestion={handleEmailSuggestionSelect}
                    onDismiss={handleEmailSuggestionDismiss}
                  />
                )}
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="text-gray-700 font-semibold"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => !isLogin && setShowPasswordRequirements(true)}
                  onBlur={() => setShowPasswordRequirements(false)}
                  required
                  className={`mt-2 rounded-xl ${
                    !isLogin && password
                      ? passwordValidation.isValid
                        ? "border-green-300"
                        : "border-red-300"
                      : "border-blue-200"
                  } focus:border-blue-500 focus:ring-blue-200`}
                  placeholder={
                    isLogin ? "Enter your password" : "Create a secure password"
                  }
                />
                {!isLogin && (
                  <>
                    <PasswordRequirements
                      validation={passwordValidation}
                      show={
                        showPasswordRequirements ||
                        (password.length > 0 && !passwordValidation.isValid)
                      }
                    />
                    {!showPasswordRequirements && password.length > 0 && (
                      <div className="mt-1 text-xs text-gray-500">
                        8+ chars, 1 letter, 1 number, 1 special character
                      </div>
                    )}
                  </>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || !isFormValid()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  "Processing..."
                ) : isLogin ? (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="text-center mt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300"
              >
                {isLogin
                  ? "Don't have an account? Create one"
                  : "Already have an account? Sign in"}
              </button>
            </div>

            {/* Pro Options */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center space-y-3">
                <p className="text-gray-600 text-sm">Professional Services</p>

                {isLogin ? (
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      onClick={onLoginAsPro}
                      variant="outline"
                      className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl py-3"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Login as a Pro
                    </Button>
                    <Button
                      onClick={onJoinAsPro}
                      variant="outline"
                      className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl py-3"
                    >
                      <UserCog className="w-4 h-4 mr-2" />
                      Join as a Pro
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={onJoinAsPro}
                    variant="outline"
                    className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl py-3"
                  >
                    <UserCog className="w-4 h-4 mr-2" />
                    Join as a Pro
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
