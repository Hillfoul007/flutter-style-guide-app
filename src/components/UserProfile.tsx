import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  User,
  LogOut,
  Clock,
  Shield,
  Mail,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfileProps {
  className?: string;
  onNavigateToBookings?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  className = "",
  onNavigateToBookings,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!user) return null;

  const userName =
    user.user_metadata?.name || user.email?.split("@")[0] || "User";
  const userEmail = user.email || "";
  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 transition-all duration-300 group"
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-bold">
              {getInitials(userName)}
            </span>
          </div>
          <div className="hidden md:block text-left">
            <div className="text-white font-medium text-sm">
              Welcome, {userName}
            </div>
            <div className="text-cyan-200 text-xs">Account Settings</div>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-cyan-200 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-50 to-cyan-50 p-4 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">
                  {getInitials(userName)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-base">
                  {userName}
                </h3>
                <p className="text-slate-600 text-sm">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="p-4 space-y-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <h4 className="font-semibold text-slate-800 text-sm mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-cyan-600" />
                Account Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center">
                    <Mail className="w-3 h-3 mr-2" />
                    Email
                  </span>
                  <span className="text-slate-800 font-medium truncate ml-2">
                    {userEmail}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center">
                    <Calendar className="w-3 h-3 mr-2" />
                    Joined
                  </span>
                  <span className="text-slate-800 font-medium">{joinDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center">
                    <Shield className="w-3 h-3 mr-2" />
                    Status
                  </span>
                  <span className="text-emerald-600 font-medium flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></div>
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl p-3 border border-cyan-100">
              <h4 className="font-semibold text-slate-800 text-sm mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-cyan-600" />
                Quick Stats
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-cyan-600">0</div>
                  <div className="text-slate-600 text-xs">Total Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-cyan-600">0</div>
                  <div className="text-slate-600 text-xs">Active Services</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 pt-0 space-y-2">
            {onNavigateToBookings && (
              <Button
                onClick={() => {
                  setIsOpen(false);
                  onNavigateToBookings();
                }}
                variant="outline"
                className="w-full justify-start border-cyan-200 text-cyan-700 hover:bg-cyan-50 rounded-xl"
              >
                <Clock className="w-4 h-4 mr-2" />
                My Bookings
              </Button>
            )}

            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full justify-start border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
