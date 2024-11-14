"use client";

import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useWeb3 } from "@/contexts/Web3Context";
import { Loader2, Minus, Plus, Trash2, ShoppingCart as CartIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ShoppingCartPage() {
  const { getContractAddress } = useSettings();
  const { createBooking, userAddress } = useWeb3();
  const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAM",
  }).format(getTotal() / 10 ** 18);

  const proceedToCheckout = async () => {
    setIsProcessing(true);
    try {
      await createBooking(
        items.map((item) => item.id.toString()),
        userAddress,
        await getContractAddress()
      );
      await clearCart();
      router.push("/bookings");
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <CartIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          {items.length > 0 && (
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
            >
              Empty Cart
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <CartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-900 mb-4 text-lg">Your cart is empty</p>
            <Button 
              onClick={() => router.push("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Browse Tours
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:border-blue-100 transition-colors"
                >
                  <div className="flex gap-6">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={120}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-gray-700 text-sm mb-4">
                        {item.city}, {item.country}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, Math.max(1, item.quantity - 1))
                            }
                            className="hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-gray-900 font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 sticky top-24">
                <h2 className="text-xl font-semibold mb-6 text-gray-900">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span className="font-medium">{item.title}</span>
                      <span>x{item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between font-semibold text-gray-900 text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">{formattedTotal}</span>
                  </div>
                </div>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={proceedToCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
