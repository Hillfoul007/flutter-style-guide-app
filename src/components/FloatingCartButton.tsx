import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const FloatingCartButton = ({
  onProceedToBooking,
}: {
  onProceedToBooking: () => void;
}) => {
  const {
    cartItems,
    getTotalItems,
    getTotalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const cartScrollRef = useRef<HTMLDivElement>(null);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  // Auto-scroll to show recent additions when cart opens
  useEffect(() => {
    if (isOpen && cartScrollRef.current && cartItems.length > 3) {
      // Slight delay to ensure the panel is rendered
      setTimeout(() => {
        if (cartScrollRef.current) {
          cartScrollRef.current.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [isOpen, cartItems.length]);

  if (totalItems === 0) return null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Cart Details Panel */}
        {isOpen && (
          <div className="absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 mb-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Your Cart</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-blue-100 text-sm">
                {totalItems} items • ${totalPrice.toFixed(2)}
              </p>
            </div>

            <div
              ref={cartScrollRef}
              className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100"
              style={{ maxHeight: "calc(80vh - 200px)" }}
            >
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-2">
                      <h4 className="font-medium text-gray-900 text-sm leading-5">
                        {item.name}
                      </h4>
                      <p className="text-blue-600 font-semibold text-sm mt-1">
                        ${item.price} each
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="font-medium text-gray-900 min-w-[2rem] text-center bg-gray-50 px-2 py-1 rounded">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll indicator for many items */}
            {cartItems.length > 3 && (
              <div className="flex-shrink-0 px-4 py-2 bg-blue-50 border-t border-blue-100">
                <p className="text-center text-xs text-blue-700">
                  📜 Scroll to see all {cartItems.length} items
                </p>
              </div>
            )}

            <div className="flex-shrink-0 p-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-gray-900">Total:</span>
                <span className="font-bold text-xl text-blue-600">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={onProceedToBooking}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-2 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                >
                  Proceed to Booking ({totalItems} items)
                </Button>
                <Button
                  onClick={clearCart}
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-50 rounded-xl"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Cart Button */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300"
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6 text-white" />
            {totalItems > 0 && (
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              </div>
            )}
          </div>
        </Button>
      </div>
    </>
  );
};

export default FloatingCartButton;
