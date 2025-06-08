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
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        {/* Cart Details Panel */}
        {isOpen && (
          <div className="absolute bottom-16 sm:bottom-20 right-0 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 mb-4 max-h-[70vh] sm:max-h-[80vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 sm:p-4 text-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg sm:text-lg">Your Cart</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-cyan-200 text-sm">
                {totalItems} items • ${totalPrice.toFixed(2)}
              </p>
            </div>

            <div
              ref={cartScrollRef}
              className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-300 scrollbar-track-slate-100"
              style={{ maxHeight: "calc(80vh - 200px)" }}
            >
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-3">
                      <h4 className="font-medium text-slate-800 text-sm leading-5">
                        {item.name}
                      </h4>
                      <p className="text-cyan-600 font-semibold text-sm mt-1">
                        ${item.price} each
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-colors flex-shrink-0"
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
                        className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors active:scale-95 border border-slate-200"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus className="w-4 h-4 text-slate-600" />
                      </button>
                      <span className="font-medium text-slate-800 min-w-[2.5rem] text-center bg-slate-50 px-3 py-2 rounded text-base border border-slate-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-cyan-100 hover:bg-cyan-200 flex items-center justify-center transition-colors active:scale-95 border border-cyan-200"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus className="w-4 h-4 text-cyan-600" />
                      </button>
                    </div>
                    <span className="font-semibold text-slate-800 text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll indicator for many items */}
            {cartItems.length > 3 && (
              <div className="flex-shrink-0 px-4 py-2 bg-cyan-50 border-t border-cyan-100">
                <p className="text-center text-xs text-cyan-700">
                  📜 Scroll to see all {cartItems.length} items
                </p>
              </div>
            )}

            <div className="flex-shrink-0 p-4 bg-slate-50 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-slate-800 text-base">
                  Total:
                </span>
                <span className="font-bold text-xl text-cyan-600">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={onProceedToBooking}
                  className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 active:scale-95 text-base shadow-lg hover:shadow-xl"
                >
                  Proceed to Booking ({totalItems} items)
                </Button>
                <Button
                  onClick={clearCart}
                  variant="outline"
                  className="w-full border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl py-3 px-4 text-base active:scale-95 transition-all duration-200 border-2"
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
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 shadow-2xl hover:shadow-3xl transform active:scale-95 hover:scale-110 transition-all duration-300 border-2 border-cyan-200"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            {totalItems > 0 && (
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-rose-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
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
