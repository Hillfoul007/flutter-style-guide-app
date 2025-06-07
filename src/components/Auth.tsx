import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogIn, UserPlus, ArrowLeft, UserCog } from "lucide-react";

interface AuthProps {
  onBack: () => void;
  onJoinAsPro?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onBack, onJoinAsPro }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

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
                    <Input
                      id="mobile"
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required={!isLogin}
                      className="mt-2 rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-200"
                      placeholder="Enter your mobile number"
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="email" className="text-gray-700 font-semibold">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-200"
                  placeholder="Enter your email"
                />
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
                  required
                  className="mt-2 rounded-xl border-blue-200 focus:border-blue-500 focus:ring-blue-200"
                  placeholder="Enter your password"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
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

            {/* Join as Pro Option */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-gray-600 mb-3 text-sm">
                  Want to offer services?
                </p>
                <Button
                  onClick={onJoinAsPro}
                  variant="outline"
                  className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl py-3"
                >
                  <UserCog className="w-4 h-4 mr-2" />
                  Join as a Pro
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
