"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BrowserProvider, Contract } from "ethers";
import { contractABI } from "@/lib/contractABI";
import { Button } from "@/components/ui/button";
import { FEATURED_TOURS, CONTRACT_ADDRESS } from "@/lib/constants";
import { Navigation } from "@/components/Navigation";
import { Booking, BlockchainBooking } from "@/types";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
          router.push("/"); // Redirect to home if not connected
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
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, contractABI, signer);
      console.log("Contract instance:", contract);

      try {
        const result = await contract.getAllBookings();
        console.log("Raw contract result:", result);

        if (!result) {
          throw new Error("No booking data returned from contract");
        }

        const transformedBookings = result.map(
          (booking: BlockchainBooking) => ({
            id: Number(booking.id),
            tourId: Number(booking.tourId),
            date: new Date(Number(booking.date) * 1000),
            status: booking.status,
          })
        );

        setBookings(transformedBookings);
      } catch (contractError) {
        console.error("Contract call error:", contractError);
        setError("Failed to fetch bookings from the blockchain");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading bookings:", error);
      setError("Failed to load bookings. Please try again later.");
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
              {bookings.map((booking) => {
                const tour = getTourDetails(booking.tourId);
                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {tour.title}
                      </h3>
                      <p className="text-gray-600">
                        {tour.city}, {tour.country}
                      </p>
                      <p className="text-gray-600">
                        Date: {booking.date.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          booking.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() =>
                          router.push(
                            `/tours/${tour.title
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`
                          )
                        }
                      >
                        View Tour
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
