"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/contexts/Web3Context";
import { Booking } from "@/types";
import { FEATURED_TOURS } from "@/lib/constants";
import { use } from "react";

export default function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getAllBookings, payBooking } = useWeb3();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function loadBookingDetails() {
      try {
        const bookings = await getAllBookings();
        const foundBooking = bookings.find(
          (b) => b.id === parseInt(resolvedParams.id)
        );

        if (!foundBooking) {
          setError("Booking not found");
          setIsLoading(false);
          return;
        }

        setBooking(foundBooking);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading booking details:", error);
        setError("Failed to load booking details");
        setIsLoading(false);
      }
    }

    if (isClient) {
      loadBookingDetails();
    }
  }, [resolvedParams.id, getAllBookings, isClient]);

  async function handlePayBooking() {
    if (!booking) return;
    
    setIsProcessing(true);
    try {
      await payBooking(booking.id, booking.totalAmount.toString());
      // Refresh booking details after payment
      const bookings = await getAllBookings();
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
          <div className="text-center">Loading booking details...</div>
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
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Booking Details</h1>
            <Button variant="outline" onClick={() => router.push("/bookings")}>
              Back to Bookings
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">Tour Information</h2>
                <p className="text-gray-600">Tour: {tour.title}</p>
                <p className="text-gray-600">
                  Location: {tour.city}, {tour.country}
                </p>
                <p className="text-gray-600">
                  Date: {booking.timestamp.toLocaleDateString()}
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Payment Details</h2>
                <p className="text-gray-600">
                  Total Amount: ${booking.totalAmount.toFixed(2)}
                </p>
                <p className="text-gray-600">
                  Operator Fee: ${booking.operatorFee.toFixed(2)}
                </p>
                <p className="text-gray-600">
                  Status:{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      booking.isPaid
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {booking.isPaid ? "Paid" : "Unpaid"}
                  </span>
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-2">Booking Status</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Completed:{" "}
                  <span
                    className={booking.isCompleted ? "text-green-600" : "text-gray-600"}
                  >
                    {booking.isCompleted ? "Yes" : "No"}
                  </span>
                </p>
                <p className="text-gray-600">
                  Refunded:{" "}
                  <span
                    className={booking.isRefunded ? "text-red-600" : "text-gray-600"}
                  >
                    {booking.isRefunded ? "Yes" : "No"}
                  </span>
                </p>

                {!booking.isPaid && (
                  <div className="mt-4">
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