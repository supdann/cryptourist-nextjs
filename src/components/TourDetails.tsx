"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FEATURED_TOURS } from "@/lib/constants";
import { generateAvailableDates } from "@/lib/utils";
import { MapPin, Clock, Users, Calendar } from "lucide-react";

interface TourDetailsProps {
  slug: string;
}

export function TourDetails({ slug }: TourDetailsProps) {
  const [availableDates] = useState(() => generateAvailableDates(10));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Find tour directly from the resolved params slug
  const tour = FEATURED_TOURS.find(
    (t) => t.title.toLowerCase().replace(/\s+/g, "-") === slug
  );

  const calculateTotalPrice = (basePrice: number, persons: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(basePrice * persons);
  };

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!tour || !selectedDate) return;
    setIsLoading(true);
    setError(null);

    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("Please install MetaMask to make a booking");
      }

      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts.length === 0) {
        throw new Error("Please connect your wallet to make a booking");
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tourId: tour.id,
          date: selectedDate.toISOString(),
          numberOfPersons,
          walletAddress: accounts[0],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      router.push("/bookings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setIsLoading(false);
    }
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Tour not found
          </h1>
          <Button onClick={() => router.push("/")}>Return to Home</Button>
        </div>
      </div>
    );
  }

  // ... rest of the component logic remains the same ...
  // (copy all the functions and JSX from the page component)
  return (
    <main className="flex-grow container mx-auto px-4 py-12 mt-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tour Details Section - Takes up 2 columns */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={tour.imageUrl}
              alt={tour.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{tour.title}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">
                    {tour.city}, {tour.country}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-lg">{tour.duration}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Tour Overview
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {tour.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <Clock className="h-6 w-6 text-blue-600 mb-2" />
                <h3 className="font-medium text-gray-900">Duration</h3>
                <p className="text-gray-600">{tour.duration}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <Users className="h-6 w-6 text-blue-600 mb-2" />
                <h3 className="font-medium text-gray-900">Group Size</h3>
                <p className="text-gray-600">Max 10 people</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                <h3 className="font-medium text-gray-900">Available</h3>
                <p className="text-gray-600">All Year</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Section - Takes up 1 column */}
        <div className="lg:sticky lg:top-24 h-fit space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Book Tour
              </h2>
              <div className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(tour.price)}
              </div>
            </div>

            <form onSubmit={handleBooking} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Select Date
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableDates.map((date) => (
                    <button
                      key={date.toISOString()}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      className={`p-3 text-sm rounded-lg border transition-all ${
                        selectedDate?.toDateString() === date.toDateString()
                          ? "border-blue-600 bg-blue-50 text-blue-600 font-medium"
                          : "border-gray-200 text-gray-700 hover:border-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      {date.toLocaleDateString()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Number of Persons
                </label>
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setNumberOfPersons(Math.max(1, numberOfPersons - 1))
                    }
                    className="h-8 w-8 rounded-md"
                  >
                    -
                  </Button>
                  <span className="text-gray-900 font-medium">
                    {numberOfPersons}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setNumberOfPersons(Math.min(10, numberOfPersons + 1))
                    }
                    className="h-8 w-8 rounded-md"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Total Price</span>
                  <span className="text-xl font-bold text-gray-900">
                    {calculateTotalPrice(tour.price, numberOfPersons)}
                  </span>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm mb-4">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !selectedDate}
                  className="w-full h-12 text-base font-medium"
                >
                  {isLoading ? "Processing..." : "Book Now"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
