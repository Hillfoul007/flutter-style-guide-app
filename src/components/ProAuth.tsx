import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import {
  checkEmailExists,
  checkPhoneExists,
  isValidEmail,
  isValidPhoneNumber,
  formatPhoneNumber,
} from "@/utils/userValidation";
import { validatePassword } from "@/utils/passwordValidation";
import PasswordRequirements from "@/components/PasswordRequirements";
import {
  UserCog,
  LogIn,
  UserPlus,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Mail,
  Phone,
  Upload,
} from "lucide-react";

interface ProAuthProps {
  onBack: () => void;
  mode: "register" | "login";
}

const ProAuth: React.FC<ProAuthProps> = ({ onBack, mode: initialMode }) => {
  const [mode, setMode] = useState<"register" | "login">(initialMode);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Registration form state
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialty: "",
    experience: "",
    hourlyRate: "",
    address: "",
    bio: "",
    profileImage: null as string | null,
  });

  // Login form state
  const [loginForm, setLoginForm] = useState({
    identifier: "", // can be email or phone
    password: "",
    usePhone: false,
  });

  // Validation states for registration
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

  const specialties = [
    "House Cleaning",
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Painting",
    "Gardening",
    "Furniture Assembly",
    "Home Repair",
    "Moving Service",
    "Laundry Service",
    "General Repairs",
    "HVAC",
    "Roofing",
    "Flooring",
  ];

  // Email validation with debounce
  useEffect(() => {
    if (!registerForm.email || mode === "login") {
      setEmailValidation({ isValid: true });
      return;
    }

    if (!isValidEmail(registerForm.email)) {
      setEmailValidation({
        isValid: false,
        message: "Please enter a valid email address",
      });
      return;
    }

    if (emailCheckTimeout) {
      clearTimeout(emailCheckTimeout);
    }

    setEmailValidation({ isValid: true, checking: true });

    const timeout = setTimeout(async () => {
      try {
        const result = await checkEmailExists(registerForm.email);
        setEmailValidation({
          isValid: result.isValid,
          message: result.message,
          checking: false,
        });
      } catch (error) {
        setEmailValidation({ isValid: true, checking: false });
      }
    }, 1000);

    setEmailCheckTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [registerForm.email, mode, emailCheckTimeout]);

  // Phone validation with debounce
  useEffect(() => {
    if (!registerForm.phone || mode === "login") {
      setPhoneValidation({ isValid: true });
      return;
    }

    if (!isValidPhoneNumber(registerForm.phone)) {
      setPhoneValidation({
        isValid: false,
        message: "Please enter a valid phone number",
      });
      return;
    }

    if (phoneCheckTimeout) {
      clearTimeout(phoneCheckTimeout);
    }

    setPhoneValidation({ isValid: true, checking: true });

    const timeout = setTimeout(async () => {
      try {
        const result = await checkPhoneExists(registerForm.phone);
        setPhoneValidation({
          isValid: result.isValid,
          message: result.message,
          checking: false,
        });
      } catch (error) {
        setPhoneValidation({ isValid: true, checking: false });
      }
    }, 1000);

    setPhoneCheckTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [registerForm.phone, mode, phoneCheckTimeout]);

  // Password validation for registration
  useEffect(() => {
    if (mode === "register") {
      const validation = validatePassword(registerForm.password);
      setPasswordValidation(validation);
    }
  }, [registerForm.password, mode]);

  const handleRegisterInputChange = (field: string, value: string) => {
    setRegisterForm((prev) => ({
      ...prev,
      [field]: field === "phone" ? formatPhoneNumber(value) : value,
    }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setRegisterForm((prev) => ({
          ...prev,
          profileImage: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const isRegisterFormValid = () => {
    return (
      registerForm.name &&
      registerForm.email &&
      registerForm.password &&
      registerForm.phone &&
      registerForm.specialty &&
      registerForm.hourlyRate &&
      emailValidation.isValid &&
      phoneValidation.isValid &&
      passwordValidation.isValid &&
      !emailValidation.checking &&
      !phoneValidation.checking
    );
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!isRegisterFormValid()) {
      setMessage("Please fix all validation errors before submitting");
      setLoading(false);
      return;
    }

    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerForm.email,
        password: registerForm.password,
        options: {
          data: {
            name: registerForm.name,
            user_type: "provider",
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // Create provider profile
        const { error: providerError } = await supabase
          .from("service_providers")
          .insert([
            {
              user_id: authData.user.id,
              name: registerForm.name,
              email: registerForm.email,
              password: registerForm.password, // Note: This is for compatibility, actual auth uses Supabase
              phone: registerForm.phone,
              specialty: registerForm.specialty,
              experience: registerForm.experience,
              price: parseInt(registerForm.hourlyRate) || 25,
              address: registerForm.address,
              bio: registerForm.bio,
              image:
                registerForm.profileImage ||
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
              rating: 0,
              reviews: 0,
            },
          ]);

        if (providerError) {
          throw providerError;
        }

        setMessage(
          "Registration successful! Please check your email to confirm your account.",
        );

        // Clear form
        setRegisterForm({
          name: "",
          email: "",
          password: "",
          phone: "",
          specialty: "",
          experience: "",
          hourlyRate: "",
          address: "",
          bio: "",
          profileImage: null,
        });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setMessage(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let email = loginForm.identifier;

      // If using phone, find the email associated with it
      if (loginForm.usePhone) {
        const { data: providerData, error: lookupError } = await supabase
          .from("service_providers")
          .select("email")
          .eq("phone", loginForm.identifier)
          .single();

        if (lookupError || !providerData) {
          throw new Error("No account found with this phone number");
        }

        email = providerData.email;
      }

      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: loginForm.password,
      });

      if (error) {
        throw error;
      }

      // Verify user is a provider
      const { data: providerData, error: providerError } = await supabase
        .from("service_providers")
        .select("*")
        .eq("user_id", data.user.id)
        .single();

      if (providerError || !providerData) {
        // Sign out if not a provider
        await supabase.auth.signOut();
        throw new Error("This account is not registered as a service provider");
      }

      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        onBack(); // This should redirect to provider dashboard
      }, 1500);
    } catch (error: any) {
      console.error("Login error:", error);
      setMessage(
        error.message || "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleLoginMethod = () => {
    setLoginForm((prev) => ({
      ...prev,
      usePhone: !prev.usePhone,
      identifier: "",
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Button
          onClick={onBack}
          variant="outline"
          className="mb-6 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-600 to-green-700 p-6 text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserCog className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {mode === "register" ? "Join as a Pro" : "Pro Login"}
            </h2>
            <p className="text-emerald-100">
              {mode === "register"
                ? "Start earning by offering your services"
                : "Sign in to your pro account"}
            </p>
          </div>

          <div className="p-6">
            {message && (
              <div
                className={`p-3 rounded-xl mb-4 text-sm ${
                  message.includes("successful")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            {mode === "register" ? (
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-gray-700 font-semibold"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={registerForm.name}
                      onChange={(e) =>
                        handleRegisterInputChange("name", e.target.value)
                      }
                      required
                      className="mt-2 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-gray-700 font-semibold"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={registerForm.email}
                        onChange={(e) =>
                          handleRegisterInputChange("email", e.target.value)
                        }
                        required
                        className={`mt-2 rounded-xl pr-10 ${
                          registerForm.email
                            ? emailValidation.checking
                              ? "border-yellow-300"
                              : emailValidation.isValid
                                ? "border-green-300"
                                : "border-red-300"
                            : "border-emerald-200"
                        } focus:border-emerald-500 focus:ring-emerald-200`}
                        placeholder="Enter your email"
                      />
                      {registerForm.email && (
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
                    {registerForm.email &&
                      !emailValidation.isValid &&
                      emailValidation.message && (
                        <p className="mt-1 text-sm text-red-600">
                          {emailValidation.message}
                        </p>
                      )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      value={registerForm.password}
                      onChange={(e) =>
                        handleRegisterInputChange("password", e.target.value)
                      }
                      onFocus={() => setShowPasswordRequirements(true)}
                      onBlur={() => setShowPasswordRequirements(false)}
                      required
                      className={`mt-2 rounded-xl ${
                        registerForm.password
                          ? passwordValidation.isValid
                            ? "border-green-300"
                            : "border-red-300"
                          : "border-emerald-200"
                      } focus:border-emerald-500 focus:ring-emerald-200`}
                      placeholder="Create a secure password"
                    />
                    <PasswordRequirements
                      validation={passwordValidation}
                      show={
                        showPasswordRequirements ||
                        (registerForm.password.length > 0 &&
                          !passwordValidation.isValid)
                      }
                    />
                    {!showPasswordRequirements &&
                      registerForm.password.length > 0 && (
                        <div className="mt-1 text-xs text-gray-500">
                          8+ chars, 1 letter, 1 number, 1 special character
                        </div>
                      )}
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-gray-700 font-semibold"
                    >
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        type="tel"
                        value={registerForm.phone}
                        onChange={(e) =>
                          handleRegisterInputChange("phone", e.target.value)
                        }
                        required
                        className={`mt-2 rounded-xl pr-10 ${
                          registerForm.phone
                            ? phoneValidation.checking
                              ? "border-yellow-300"
                              : phoneValidation.isValid
                                ? "border-green-300"
                                : "border-red-300"
                            : "border-emerald-200"
                        } focus:border-emerald-500 focus:ring-emerald-200`}
                        placeholder="(123) 456-7890"
                      />
                      {registerForm.phone && (
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
                    {registerForm.phone &&
                      !phoneValidation.isValid &&
                      phoneValidation.message && (
                        <p className="mt-1 text-sm text-red-600">
                          {phoneValidation.message}
                        </p>
                      )}
                  </div>
                </div>

                {/* Service Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="specialty"
                      className="text-gray-700 font-semibold"
                    >
                      Service Specialty
                    </Label>
                    <Select
                      value={registerForm.specialty}
                      onValueChange={(value) =>
                        handleRegisterInputChange("specialty", value)
                      }
                    >
                      <SelectTrigger className="mt-2 rounded-xl border-emerald-200">
                        <SelectValue placeholder="Select your specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="hourlyRate"
                      className="text-gray-700 font-semibold"
                    >
                      Hourly Rate ($)
                    </Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      min="10"
                      max="500"
                      value={registerForm.hourlyRate}
                      onChange={(e) =>
                        handleRegisterInputChange("hourlyRate", e.target.value)
                      }
                      required
                      className="mt-2 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200"
                      placeholder="25"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="experience"
                      className="text-gray-700 font-semibold"
                    >
                      Years of Experience
                    </Label>
                    <Input
                      id="experience"
                      value={registerForm.experience}
                      onChange={(e) =>
                        handleRegisterInputChange("experience", e.target.value)
                      }
                      className="mt-2 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200"
                      placeholder="3+ years"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="address"
                      className="text-gray-700 font-semibold"
                    >
                      Service Area
                    </Label>
                    <Input
                      id="address"
                      value={registerForm.address}
                      onChange={(e) =>
                        handleRegisterInputChange("address", e.target.value)
                      }
                      className="mt-2 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200"
                      placeholder="City, State"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio" className="text-gray-700 font-semibold">
                    Professional Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={registerForm.bio}
                    onChange={(e) =>
                      handleRegisterInputChange("bio", e.target.value)
                    }
                    className="mt-2 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200 min-h-[100px]"
                    placeholder="Tell potential clients about your experience and services..."
                  />
                </div>

                <div>
                  <Label
                    htmlFor="profileImage"
                    className="text-gray-700 font-semibold"
                  >
                    Profile Photo
                  </Label>
                  <div className="mt-2 flex items-center space-x-4">
                    {registerForm.profileImage && (
                      <img
                        src={registerForm.profileImage}
                        alt="Profile Preview"
                        className="h-16 w-16 rounded-full object-cover border-2 border-emerald-200"
                      />
                    )}
                    <label className="cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-4 rounded-xl flex items-center transition duration-300">
                      <Upload className="w-4 h-4 mr-2" />
                      <span>Upload Photo</span>
                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !isRegisterFormValid()}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? (
                    "Creating Account..."
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Register as Pro
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="text-center mb-4">
                  <Button
                    type="button"
                    onClick={toggleLoginMethod}
                    variant="outline"
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl"
                  >
                    {loginForm.usePhone ? (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Use Email Instead
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4 mr-2" />
                        Use Phone Instead
                      </>
                    )}
                  </Button>
                </div>

                <div>
                  <Label
                    htmlFor="identifier"
                    className="text-gray-700 font-semibold"
                  >
                    {loginForm.usePhone ? "Phone Number" : "Email Address"}
                  </Label>
                  <Input
                    id="identifier"
                    type={loginForm.usePhone ? "tel" : "email"}
                    value={loginForm.identifier}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        identifier: e.target.value,
                      }))
                    }
                    required
                    className="mt-2 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200"
                    placeholder={
                      loginForm.usePhone ? "(123) 456-7890" : "Enter your email"
                    }
                  />
                </div>

                <div>
                  <Label
                    htmlFor="loginPassword"
                    className="text-gray-700 font-semibold"
                  >
                    Password
                  </Label>
                  <Input
                    id="loginPassword"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                    className="mt-2 rounded-xl border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200"
                    placeholder="Enter your password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={
                    loading || !loginForm.identifier || !loginForm.password
                  }
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? (
                    "Signing In..."
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In as Pro
                    </>
                  )}
                </Button>
              </form>
            )}

            <div className="text-center mt-6">
              <button
                onClick={() =>
                  setMode(mode === "register" ? "login" : "register")
                }
                className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors duration-300"
              >
                {mode === "register"
                  ? "Already a pro? Sign in here"
                  : "New to pro services? Register here"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProAuth;
