"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FEATURED_TOURS } from "@/lib/constants";
import { Navigation } from "@/components/Navigation";
import { Booking } from "@/types";
import { useWeb3 } from "@/contexts/Web3Context";
import { BookingCard } from "@/components/BookingCard";
import { useSettings } from "@/contexts/SettingsContext";

export default function BookingsPage() {
  const { getAllBookings } = useWeb3();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { getContractAddress } = useSettings();

  useEffect(() => {
    async function checkWalletAndLoadBookings() {
      if (typeof window.ethereum === "undefined") {
        setError("Please install MetaMask to view your bookings");
        setIsLoading(false);
        return;
      }

      try {
        const accounts = (await window.ethereum.request({
          method: "eth_accounts",
        })) as string[];
        if (accounts.length === 0) {
          router.push("/");
          return;
        }

        await loadBookings();
      } catch (error) {
        console.error("Error checking wallet:", error);
        setError("Failed to load bookings. Please try again later.");
        setIsLoading(false);
      }
    }

    checkWalletAndLoadBookings();
  }, [router]);

  async function loadBookings() {
    try {
      if (!window.ethereum) {
        setError("Please install MetaMask to view your bookings");
        setIsLoading(false);
        return;
      }
      const contractAddress = await getContractAddress();
      console.log("BookingsPage: contractAddress", contractAddress);
      const bookings = await getAllBookings(contractAddress);
      setBookings(bookings);
      setIsLoading(false);
    } catch (contractError) {
      console.error("Contract call error:", contractError);
      setError("Failed to fetch bookings from the blockchain");
      setIsLoading(false);
    }
  }

  function getTourDetails(tourId: number) {
    return (
      FEATURED_TOURS[tourId] || {
        title: "Unknown Tour",
        city: "Unknown",
        country: "Unknown",
      }
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                You haven&apos;t made any bookings yet.
              </p>
              <Button onClick={() => router.push("/tours")}>
                Explore Available Tours
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  tour={getTourDetails(booking.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
