"use client";

import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { FEATURED_TOURS } from "@/lib/constants";
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface HeroProps {
  locations: string[];
  searchRef: React.RefObject<HTMLDivElement>;
  searchQuery: string;
  showSuggestions: boolean;
  setSearchQuery: (query: string) => void;
  setShowSuggestions: (show: boolean) => void;
}

export function Hero({
  locations,
  searchRef,
  searchQuery,
  showSuggestions,
  setSearchQuery,
  setShowSuggestions,
}: HeroProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const images = ['/images/hero_bike_1.avif', '/images/hero_bike_2.avif', '/images/hero_bike_3.avif'];
  
  useEffect(() => {
    // Preload images
    Promise.all(
      images.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.src = src;
          img.onload = () => resolve(img);
          img.onerror = reject;
        });
      })
    ).then(() => {
      setImagesLoaded(true);
    });

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredLocations = locations.filter((location) =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setSearchQuery(location);
    setShowSuggestions(false);

    const selectedTour = FEATURED_TOURS.find(
      tour => `${tour.city}, ${tour.country}` === location
    );

    if (selectedTour) {
      router.push(`/tours/${selectedTour.title.toLowerCase().replace(/\s+/g, "-")}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, location: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLocationSelect(location);
    }
  };

  return (
    <section className="bg-blue-600 text-white min-h-screen flex items-center relative overflow-hidden">
      {/* Background Images */}
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            !imagesLoaded ? 'opacity-0' : ''
          }`}
          style={{
            opacity: currentImageIndex === index ? 1 : 0,
            zIndex: 1
          }}
        >
          <Image
            src={image}
            alt={`Hero background ${index + 1}`}
            fill
            className="object-cover"
            priority={true}
            sizes="100vw"
            quality={90}
          />
        </div>
      ))}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-shadow-lg drop-shadow-2xl [text-shadow:_2px_2px_10px_rgb(0_0_0_/_90%)]">
            Discover the World on Two Wheels
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-shadow-md [text-shadow:_1px_1px_5px_rgb(0_0_0_/_80%)]">
            Book unforgettable bike tours and explore breathtaking destinations
          </p>
          <div className="flex justify-center flex-col sm:flex-row items-center gap-4" ref={searchRef}>
            <div className="relative w-full sm:w-96">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Where do you want to ride?"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full pl-10 h-12 text-base shadow-lg bg-white/95 backdrop-blur-sm border-0 ring-2 ring-white/20 focus-visible:ring-blue-400 transition-all text-gray-800 placeholder:text-gray-400"
                />
              </div>
              {showSuggestions && searchQuery && (
                <div className="absolute z-10 w-full bg-white/95 backdrop-blur-sm mt-2 rounded-lg shadow-lg max-h-60 overflow-auto border border-gray-100">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((location, index) => (
                      <div
                        key={index}
                        role="button"
                        tabIndex={0}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-gray-800 transition-colors"
                        onClick={(e) => handleLocationSelect(location, e)}
                        onKeyDown={(e) => handleKeyDown(e, location)}
                      >
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                          {location}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">
                      No locations found
                    </div>
                  )}
                </div>
              )}
            </div>
            <Button size="lg" className="w-full sm:w-auto px-8 h-12 bg-white text-blue-800 hover:bg-blue-50">
              Search Tours
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 