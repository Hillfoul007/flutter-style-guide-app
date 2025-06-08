import React, { useState, useEffect } from "react";
import ServiceCategories from "../components/ServiceCategories";
import ProviderList from "../components/ProviderList";
import BookingFlow from "../components/BookingFlow";
import BookingHistory from "../components/BookingHistory";
import Reviews from "../components/Reviews";
import ProviderRegistration from "../components/ProviderRegistration";
import Auth from "../components/Auth";
import ProAuth from "../components/ProAuth";
import FloatingCartButton from "../components/FloatingCartButton";
import ChatBot from "../components/ChatBot";
import UserProfile from "../components/UserProfile";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { CartProvider, useCart } from "../contexts/CartContext";
import {
  ArrowLeft,
  History,
  UserCog,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const IndexContent = () => {
  const [currentView, setCurrentView] = useState("categories");
  const [selectedService, setSelectedService] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const { cartItems, getTotalPrice } = useCart();

  useEffect(() => {
    // Close mobile menu when view changes
    setIsMobileMenuOpen(false);
  }, [currentView]);

  const navigateBack = () => {
    if (currentView === "booking") {
      setCurrentView("categories");
    } else if (currentView === "providers") {
      setCurrentView("categories");
    } else if (currentView === "reviews") {
      setCurrentView("categories");
    } else if (currentView === "history") {
      setCurrentView("categories");
    } else if (currentView === "providerRegistration") {
      setCurrentView("categories");
    } else if (currentView === "auth") {
      setCurrentView("categories");
    } else if (currentView === "proAuth") {
      setCurrentView("categories");
    } else if (currentView === "proLogin") {
      setCurrentView("categories");
    }
  };

  const handleServiceSelect = (service) => {
    console.log("Selected service:", service);
    setSelectedService(service);
    // Skip provider selection, go directly to booking
    setSelectedProvider({
      id: null, // Use null instead of invalid UUID
      name: "Professional Service Provider",
      specialty: service,
      price: 75,
    });
    setCurrentView("booking");
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setCurrentView("booking");
  };

  const handleViewReviews = (provider) => {
    setSelectedProvider(provider);
    setCurrentView("reviews");
  };

  const handleSignOut = async () => {
    await signOut();
    setCurrentView("categories");
  };

  const requiresAuth = ["history", "booking"].includes(currentView);

  // Show auth screen if user tries to access protected content
  if (requiresAuth && !user && !loading) {
    return <Auth onBack={() => setCurrentView("categories")} />;
  }

  // Show auth screen if current view is auth
  if (currentView === "auth") {
    return (
      <Auth
        onBack={() => setCurrentView("categories")}
        onJoinAsPro={() => setCurrentView("proAuth")}
        onLoginAsPro={() => setCurrentView("proLogin")}
      />
    );
  }

  // Show pro auth screen
  if (currentView === "proAuth") {
    return (
      <ProAuth mode="register" onBack={() => setCurrentView("categories")} />
    );
  }

  // Show pro login screen
  if (currentView === "proLogin") {
    return <ProAuth mode="login" onBack={() => setCurrentView("categories")} />;
  }

  const renderHeader = () => {
    const titles = {
      categories: "TaskApp",
      providers: "Find Pros",
      booking: "Book Service",
      reviews: "Reviews",
      history: "My Bookings",
      providerRegistration: "Join as Pro",
      proAuth: "Join as Pro",
      proLogin: "Pro Login",
    };

    if (currentView === "categories") {
      return (
        <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-teal-500/10"></div>
          <div className="relative flex items-center justify-between p-4 md:p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl md:text-2xl font-bold text-white">
                  T
                </span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  TaskApp
                </h1>
                <p className="text-cyan-200 text-xs md:text-sm">
                  Professional Services
                </p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <>
                  <UserProfile
                    onNavigateToBookings={() => setCurrentView("history")}
                  />
                </>
              ) : (
                <button
                  onClick={() => setCurrentView("auth")}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <User className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-2xl border-t border-cyan-200/20 z-50">
              <div className="p-6 space-y-4">
                {user ? (
                  <>
                    <div className="p-4 bg-gradient-to-r from-slate-50 to-cyan-50 rounded-xl border border-cyan-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-sm font-bold">
                            {(
                              user.user_metadata?.name ||
                              user.email?.split("@")[0] ||
                              "U"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-800 font-medium text-base">
                            Welcome,{" "}
                            {user.user_metadata?.name ||
                              user.email?.split("@")[0] ||
                              "User"}
                            !
                          </span>
                          <div className="text-slate-600 text-sm mt-1 truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setCurrentView("history")}
                      className="w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-cyan-50 to-teal-50 hover:from-cyan-100 hover:to-teal-100 rounded-xl transition-all duration-300 active:scale-95 border border-cyan-200"
                    >
                      <History className="w-6 h-6 text-cyan-600" />
                      <span className="text-slate-800 font-medium text-lg">
                        My Bookings
                      </span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-rose-50 to-red-50 hover:from-rose-100 hover:to-red-100 rounded-xl transition-all duration-300 active:scale-95 border border-rose-200"
                    >
                      <LogOut className="w-6 h-6 text-rose-600" />
                      <span className="text-slate-800 font-medium text-lg">
                        Sign Out
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setCurrentView("auth")}
                      className="w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-cyan-50 to-teal-50 hover:from-cyan-100 hover:to-teal-100 rounded-xl transition-all duration-300 active:scale-95 border border-cyan-200"
                    >
                      <User className="w-6 h-6 text-cyan-600" />
                      <span className="text-slate-800 font-medium text-lg">
                        Sign In
                      </span>
                    </button>
                    <button
                      onClick={() => setCurrentView("proAuth")}
                      className="w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 rounded-xl transition-all duration-300 active:scale-95 border border-emerald-200"
                    >
                      <UserCog className="w-6 h-6 text-emerald-600" />
                      <span className="text-slate-800 font-medium text-lg">
                        Join as a Pro
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-teal-500/10"></div>
        <div className="relative flex items-center justify-between p-4 md:p-6">
          <button
            onClick={navigateBack}
            className="w-10 h-10 md:w-12 md:h-12 bg-cyan-500/20 hover:bg-cyan-400/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 border border-cyan-400/20"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-cyan-200" />
          </button>
          <h1 className="text-lg md:text-xl font-bold text-white">
            {titles[currentView]}
          </h1>
          <div className="w-10 h-10 md:w-12 md:h-12"></div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const handleProceedToBookingFromCart = () => {
    if (cartItems.length > 0) {
      // Create a combined service name from all cart items
      const serviceNames = cartItems.map((item) => item.name).join(", ");
      const totalPrice = getTotalPrice();

      // Create a provider object for cart booking
      setSelectedProvider({
        id: null, // No specific provider for cart bookings
        name: "Professional Service Provider",
        specialty: `Multiple Services: ${serviceNames}`,
        price: Math.round(
          totalPrice / cartItems.reduce((sum, item) => sum + item.quantity, 0),
        ), // Average price
      });

      setSelectedService("cart-booking");
      setCurrentView("booking");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50">
      {renderHeader()}

      <div className="relative">
        {/* Close mobile menu overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div className="max-w-7xl mx-auto">
          {currentView === "categories" && (
            <ServiceCategories onServiceSelect={handleServiceSelect} />
          )}

          {currentView === "providers" && (
            <ProviderList
              service={selectedService}
              onProviderSelect={handleProviderSelect}
              onViewReviews={handleViewReviews}
            />
          )}

          {currentView === "booking" && selectedProvider && (
            <BookingFlow provider={selectedProvider} />
          )}

          {currentView === "reviews" && selectedProvider && (
            <Reviews provider={selectedProvider} />
          )}

          {currentView === "history" && <BookingHistory />}

          {currentView === "providerRegistration" && <ProviderRegistration />}
        </div>
      </div>

      {/* Floating Cart Button */}
      {currentView === "categories" && (
        <FloatingCartButton
          onProceedToBooking={handleProceedToBookingFromCart}
        />
      )}

      {/* AI ChatBot */}
      {currentView === "categories" && <ChatBot />}
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <IndexContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default Index;
