import { Star, Users } from "lucide-react";

interface ReviewCardProps {
  name: string;
  tour: string;
  quote: string;
}

export function ReviewCard({ name, tour, quote }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <Star className="h-5 w-5 text-yellow-400" />
        <Star className="h-5 w-5 text-yellow-400" />
        <Star className="h-5 w-5 text-yellow-400" />
        <Star className="h-5 w-5 text-yellow-400" />
        <Star className="h-5 w-5 text-yellow-400" />
      </div>
      <p className="text-gray-600 mb-4">
        &quot;{quote}&quot;
      </p>
      <div className="flex items-center">
        <div className="bg-gray-300 rounded-full h-12 w-12 flex items-center justify-center mr-4">
          <Users className="h-6 w-6 text-gray-600" />
        </div>
        <div>
          <p className="font-semibold text-black">{name}</p>
          <p className="text-sm text-gray-500">{tour}</p>
        </div>
      </div>
    </div>
  );
} 