import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Booking, Tour } from "@/types";

interface BookingCardProps {
  booking: Booking;
  tour: Tour;
}

export function BookingCard({ booking, tour }: BookingCardProps) {
  const router = useRouter();

  return (
    <div
      key={booking.id}
      className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div>
        <h3 className="text-xl font-semibold mb-2">{tour.title}</h3>
        <p className="text-gray-600">
          {tour.city}, {tour.country}
        </p>
        <p className="text-gray-600">
          Date: {booking.timestamp.toLocaleDateString()}
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            booking.isPaid
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {booking.isPaid ? "Paid" : "Unpaid"}
        </span>
        <Button
          variant="outline"
          onClick={() => router.push(`/bookings/${booking.id}`)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
} 