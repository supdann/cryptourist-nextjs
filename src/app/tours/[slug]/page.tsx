"use client";

import { Navigation } from "@/components/Navigation";
import { TourDetails } from "@/components/TourDetails";
import { useEffect, useState } from "react";

export default function TourDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [isClient, setIsClient] = useState(false);
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    setIsClient(true);

    (async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    })();
  }, [params]);
  if (!isClient || !slug) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navigation />
      <TourDetails slug={slug} />
    </div>
  );
}
