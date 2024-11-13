"use client";

import { useState } from "react";
import { ReviewCard } from "./ReviewCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface ReviewCarouselProps {
  reviews: {
    name: string;
    tour: string;
    quote: string;
    rating: number;
  }[];
}

export function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 3 >= reviews.length ? 0 : prevIndex + 3
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 3 < 0 ? reviews.length - 3 : prevIndex - 3
    );
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center gap-8">
        <Button
          variant="outline"
          size="sm"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 bg-white"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="grid grid-cols-3 gap-8 transition-all duration-300 ease-in-out">
          {reviews
            .slice(currentIndex, currentIndex + 3)
            .map((review, index) => (
              <ReviewCard key={currentIndex + index} {...review} />
            ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 bg-white"
          onClick={nextSlide}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: Math.ceil(reviews.length / 3) }).map(
          (_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex / 3 ? "bg-blue-600 w-4" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(index * 3)}
            />
          )
        )}
      </div>
    </div>
  );
}
