"use client";

import { Navigation } from "@/components/Navigation";
import { TourDetails } from "@/components/TourDetails";
import { useEffect, useState } from "react";
import { use } from "react"; // Import the React use function

export default function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>; // Update type to Promise
}) {
  const resolvedParams = use(params); // Unwrap params
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !resolvedParams.slug) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navigation />
      <TourDetails slug={resolvedParams.slug} />
    </div>
  );
}
