import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  HelpCircle,
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your TaskApp AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (message.includes("book") || message.includes("service")) {
      return "I can help you book services! We offer house cleaning, furniture assembly, home repair, moving services, laundry, and gardening. Would you like to browse our services or need help with a specific one?";
    }

    if (
      message.includes("price") ||
      message.includes("cost") ||
      message.includes("how much")
    ) {
      return "Our service prices start from $25 for laundry service and go up to $80 for moving services. All prices are per hour. You can see detailed pricing on each service card. Would you like information about a specific service?";
    }

    if (
      message.includes("location") ||
      message.includes("area") ||
      message.includes("where")
    ) {
      return "We serve multiple areas! You can use the auto-detect feature to find your location or manually enter your area. We'll match you with professional service providers in your vicinity.";
    }

    if (message.includes("payment") || message.includes("pay")) {
      return "We accept various payment methods including credit cards, debit cards, and digital wallets. Payment is processed securely after your service is completed to your satisfaction.";
    }

    if (message.includes("cancel") || message.includes("reschedule")) {
      return "You can cancel or reschedule your booking up to 2 hours before the scheduled time. Just go to 'My Bookings' in your account to manage your appointments.";
    }

    if (message.includes("professional") || message.includes("provider")) {
      return "All our service providers are vetted professionals with verified credentials and excellent ratings. You can view their profiles, ratings, and reviews before booking.";
    }

    if (
      message.includes("hello") ||
      message.includes("hi") ||
      message.includes("hey")
    ) {
      return "Hello! Welcome to TaskApp. I'm here to help you with any questions about our services, booking process, or account management. What would you like to know?";
    }

    if (message.includes("help") || message.includes("support")) {
      return "I'm here to help! You can ask me about:\n• Booking services\n• Pricing information\n• Service areas\n• Payment methods\n• Managing bookings\n• Professional providers\n\nWhat specific topic interests you?";
    }

    return (
      "I understand you're asking about: '" +
      userMessage +
      "'. Let me help you with that! For detailed assistance, you can browse our services, check our FAQ, or contact our support team. Is there something specific about TaskApp services I can explain?"
    );
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(
      () => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: generateBotResponse(inputValue),
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
      },
      1000 + Math.random() * 1000,
    ); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "How do I book a service?",
    "What are your prices?",
    "How do I cancel a booking?",
    "Are providers verified?",
  ];

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Button */}
      <div className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 shadow-2xl hover:shadow-3xl transform active:scale-95 hover:scale-110 transition-all duration-300 border-2 border-white/20"
        >
          <div className="relative">
            {isOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            ) : (
              <>
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></div>
              </>
            )}
          </div>
        </Button>

        {/* Chat Panel */}
        {isOpen && (
          <div className="absolute bottom-16 sm:bottom-20 left-0 w-[calc(100vw-2rem)] sm:w-96 max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[70vh] sm:max-h-[80vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 text-white flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">TaskApp AI Assistant</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-cyan-200 text-sm">Online</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
              style={{ maxHeight: "calc(70vh - 200px)" }}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-slate-700 to-slate-800 text-white"
                        : "bg-white border border-cyan-100 text-slate-800 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === "bot" && (
                        <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {message.text}
                        </p>
                        <span
                          className={`text-xs mt-1 block ${
                            message.sender === "user"
                              ? "text-slate-300"
                              : "text-slate-500"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {message.sender === "user" && (
                        <div className="w-6 h-6 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <User className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-cyan-100 p-3 rounded-2xl shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="px-4 py-2 bg-white border-t border-slate-100">
                <div className="flex items-center space-x-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-cyan-600" />
                  <span className="text-xs font-medium text-slate-600">
                    Quick Questions:
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-left p-2 text-xs bg-cyan-50 hover:bg-cyan-100 rounded-lg transition-colors text-cyan-700 border border-cyan-200"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about TaskApp..."
                  className="flex-1 rounded-xl border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 rounded-xl px-4 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatBot;
