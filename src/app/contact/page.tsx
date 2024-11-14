"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import { Booking } from "@/types/booking";
import { useSettings } from "@/contexts/SettingsContext";

const CONTACT_REASONS = [
  "General Inquiry",
  "Tour Information",
  "Booking Question",
  "Technical Support",
  "Dispute Booking",
  "Partnership Opportunity",
  "Other",
] as const;

type ContactReason = (typeof CONTACT_REASONS)[number];

export default function ContactPage() {
  const { getContractAddress } = useSettings();
  const { isConnected, userAddress, getAllBookings } = useWeb3();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "" as ContactReason,
    bookingId: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Fetch user's bookings if they're connected and selected "Dispute Booking"
  useEffect(() => {
    const fetchBookings = async () => {
      if (!isConnected || formData.reason !== "Dispute Booking") return;

      try {
        if (!window.ethereum) {
          console.error("Ethereum provider not found");
          return;
        }

        const bookings = await getAllBookings(await getContractAddress());
        setBookings(bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [isConnected, userAddress, formData.reason]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Here you would typically make an API call to your backend
      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitStatus({
        type: "success",
        message: "Thank you for your message. We'll get back to you soon!",
      });
      setFormData({
        name: "",
        email: "",
        reason: "" as ContactReason,
        bookingId: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset bookingId if reason changes to something other than "Dispute Booking"
      ...(name === "reason" && value !== "Dispute Booking"
        ? { bookingId: "" }
        : {}),
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-12 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600">
              Have questions? We&apos;d love to hear from you. Send us a message
              and we&apos;ll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3 text-blue-600 mb-4">
                  <Mail className="h-6 w-6" />
                  <h3 className="font-semibold">Email</h3>
                </div>
                <p className="text-gray-600">info@cryptourists.com</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3 text-blue-600 mb-4">
                  <Phone className="h-6 w-6" />
                  <h3 className="font-semibold">Phone</h3>
                </div>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3 text-blue-600 mb-4">
                  <MapPin className="h-6 w-6" />
                  <h3 className="font-semibold">Office</h3>
                </div>
                <p className="text-gray-600">
                  123 Blockchain Street
                  <br />
                  Crypto Valley, CH 6300
                  <br />
                  Switzerland
                </p>
              </div>
            </div>

            {/* Updated Contact Form */}
            <div className="md:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-sm"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Reason for Contact
                  </label>
                  <select
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select a reason</option>
                    {CONTACT_REASONS.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.reason === "Dispute Booking" && (
                  <div className="mb-6">
                    <label
                      htmlFor="bookingId"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Select Booking
                    </label>
                    <select
                      id="bookingId"
                      name="bookingId"
                      value={formData.bookingId}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select a booking</option>
                      {bookings.map((booking) => (
                        <option
                          key={booking.id.toString()}
                          value={booking.id.toString()}
                        >
                          Booking #{booking.id.toString()} -{" "}
                          {new Date(
                            Number(booking.timestamp) * 1000
                          ).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="mb-6">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                {submitStatus.type && (
                  <div
                    className={`p-4 rounded-md mb-6 ${
                      submitStatus.type === "success"
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-base font-medium"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Send Message
                      <Send className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
