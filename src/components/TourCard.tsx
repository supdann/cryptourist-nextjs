import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { Tour } from "@/types";
import { useCart } from "@/contexts/CartContext";

type TourCardProps = Tour;

export function TourCard({
  id,
  title,
  city,
  country,
  duration,
  price,
  imageUrl,
  description,
  ...tour
}: TourCardProps) {
  const { addToCart, removeFromCart, items } = useCart();

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAM",
  }).format(price / 10 ** 18);

  const isInCart = items.some((item) => item.id === id);

  const handleCartAction = () => {
    if (isInCart) {
      removeFromCart(id);
    } else {
      addToCart({
        id,
        title,
        city,
        country,
        duration,
        price,
        imageUrl,
        description,
        ...tour,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Image
        src={imageUrl}
        alt={title}
        width={400}
        height={200}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2 text-black">{title}</h3>
        <div className="flex items-center mb-2">
          <MapPin className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600">
            {city}, {country}
          </span>
        </div>
        <div className="flex items-center mb-3">
          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600">{duration}</span>
        </div>
        <p className="text-gray-600 text-xs mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-blue-600">
            {formattedPrice}
          </span>
          <Button
            variant={isInCart ? "secondary" : "outline"}
            size="sm"
            onClick={handleCartAction}
          >
            {isInCart ? "Remove" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
