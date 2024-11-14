"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/contexts/Web3Context";
import { Booking, Article } from "@/types";
import { FEATURED_TOURS } from "@/lib/constants";
import { use } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { formatPrice } from "@/lib/utils";

export default function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getContractAddress } = useSettings();
  const { getAllBookings, payBooking, getBookingArticles } = useWeb3();
  const [booking, setBooking] = useState<Booking>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [articles, setArticles] = useState<Omit<Article, "id">[]>([]);

  const fetchBooking = useCallback(async () => {
    setIsLoading(true);
    try {
      const bookings = await getAllBookings(await getContractAddress());
      console.log("bookings in fetchBooking", bookings);
      const booking = bookings.find(
        (b) => b.id === parseInt(resolvedParams.id)
      );
      if (booking) {
        console.log("booking found", booking);
        setBooking(booking);
      } else {
        setError("Booking not found");
      }
    } catch (error) {
      setError("Error fetching booking, " + error);
    } finally {
      setIsLoading(false);
    }
  }, [resolvedParams.id, getContractAddress]);
  
  const fetchBookingArticles = useCallback(async () => {
    try {
      const articles = await getBookingArticles(
        parseInt(resolvedParams.id),
        await getContractAddress()
      );
      console.log("articles", articles);
      setArticles(articles);
    } catch (error) {
      console.error("Error fetching booking articles:", error);
    }
  }, [resolvedParams.id, getContractAddress, getBookingArticles]);

  useEffect(() => {
    setIsClient(true);
    fetchBooking();
    fetchBookingArticles();
  }, [fetchBooking, fetchBookingArticles]);

  async function handlePayBooking() {
    if (!booking) return;

    setIsProcessing(true);
    try {
      const contractAddress = await getContractAddress();
      await payBooking(
        booking.id,
        booking.totalAmount.toString(),
        contractAddress
      );
      // Refresh booking details after payment
      const bookings = await getAllBookings(contractAddress);
      const updatedBooking = bookings.find((b) => b.id === booking.id);
      if (updatedBooking) {
        setBooking(updatedBooking);
      }
    } catch (error) {
      console.error("Error paying for booking:", error);
      setError("Failed to process payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  if (!isClient || !resolvedParams.id) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8 mt-16">
          <div className="animate-pulse">Loading...</div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8 mt-16">
          <div className="text-center text-black">
            Loading booking details...
          </div>
        </main>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8 mt-16">
          <div className="text-center text-red-600">{error}</div>
          <div className="text-center mt-4">
            <Button onClick={() => router.push("/bookings")}>
              Back to Bookings
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const tour = FEATURED_TOURS.find((t) => t.id === booking.id.toString()) || {
    title: "Unknown Tour",
    city: "Unknown",
    country: "Unknown",
    price: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-black">Booking Details</h1>
            <Button variant="outline" onClick={() => router.push("/bookings")}>
              Back to Bookings
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Booking Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4 text-black">
                  Tour Information
                </h2>
                <div className="space-y-3">
                  <p className="text-black">
                    <span className="font-medium">Tour:</span> {tour.title}
                  </p>
                  <p className="text-black">
                    <span className="font-medium">Location:</span> {tour.city},{" "}
                    {tour.country}
                  </p>
                  <p className="text-black">
                    <span className="font-medium">Date:</span>{" "}
                    {booking.timestamp.toLocaleDateString()}
                  </p>
                </div>
              </div>

              {articles.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold mb-4 text-black">
                    Booking Items
                  </h2>
                  <div className="space-y-4">
                    {articles.map((article, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-blue-200 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="font-medium text-black">
                              {article.title}
                            </h3>
                            <p className="text-sm text-black">
                              Provider: {article.address}
                            </p>
                            {!article.active && (
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                Currently Unavailable
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-semibold text-black">
                              {formatPrice(
                                parseFloat(article.price.toString()),
                                "CAM"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Status and Payment */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 space-y-6 lg:sticky lg:top-24">
                <div>
                  <h2 className="text-lg font-semibold mb-4 text-black">
                    Payment Details
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-black">Articles Total:</span>
                      <span className="font-semibold text-black">
                        {"CAM"}{" "}
                        {articles.reduce(
                          (sum, article) =>
                            sum + Number(article.price) / 10 ** 18,
                          0
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-black">Operator Fee:</span>
                      <span className="font-semibold text-black">
                        {"CAM"} {booking.operatorFee.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-black">Total Amount:</span>
                      <span className="font-semibold text-black">
                        {"CAM"} {booking.totalAmount.toFixed(3)}
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-black font-medium">Status:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            booking.isPaid
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {booking.isPaid ? "Paid" : "Unpaid"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h2 className="text-lg font-semibold mb-3 text-black">
                    Booking Status
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-black">Completed:</span>
                      <span
                        className={
                          booking.isCompleted ? "text-green-600" : "text-black"
                        }
                      >
                        {booking.isCompleted ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-black">Refunded:</span>
                      <span
                        className={
                          booking.isRefunded ? "text-red-600" : "text-black"
                        }
                      >
                        {booking.isRefunded ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                {!booking.isPaid && (
                  <div className="pt-4">
                    <Button
                      onClick={handlePayBooking}
                      disabled={isProcessing}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center">
                          Processing Payment...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          Pay Now
                        </span>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
