import { Tour } from "@/types";

export const FEATURED_TOURS: Tour[] = [
  {
    id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    title: "Antalya Coastal Route",
    city: "Antalya", 
    country: "Turkey",
    duration: "4 hours",
    price: 89,
    distance: "25 km",
    imageUrl: "/images/antalya.webp",
    description:
      "Cycle along the stunning Turkish Riviera, passing ancient ruins and beautiful beaches with breathtaking Mediterranean views.",
  },
  {
    id: "04dbc84b-6b05-4da8-9110-663c4c0af1e6",
    title: "Berlin Wall Trail",
    city: "Berlin",
    country: "Germany", 
    duration: "3 hours",
    price: 69,
    distance: "18 km",
    imageUrl: "/images/berlin.webp",
    description:
      "Follow the historic path of the Berlin Wall on this cultural ride through Germany's capital, exploring both East and West Berlin.",
  },
  {
    id: "7d9a5e25-f712-4c2e-b874-e89d8fb214aa",
    title: "Istanbul Historical Tour",
    city: "Istanbul",
    country: "Turkey",
    duration: "2.5 hours", 
    price: 79,
    distance: "15 km",
    imageUrl: "/images/istanbul.webp",
    description:
      "Pedal through two continents in one tour, discovering Istanbul's rich history from the Hagia Sophia to the Grand Bazaar.",
  },
  {
    id: "3b99c48c-df6a-4c3e-9164-6606d7f2c9b1",
    title: "Mallorca Island Circuit",
    city: "Mallorca",
    country: "Spain",
    duration: "5 hours",
    price: 129,
    distance: "35 km",
    imageUrl: "/images/mallorca.webp",
    description:
      "Experience the best of Balearic beauty as you cycle through pristine beaches, charming villages, and scenic mountain paths.",
  },
  {
    id: "e8d89c32-1e54-4c65-93e4-d8c9f48e6583",
    title: "Paris City Explorer",
    city: "Paris",
    country: "France",
    duration: "3 hours",
    price: 75,
    distance: "16 km",
    imageUrl: "/images/paris.webp",
    description:
      "Discover the City of Light's hidden gems, from the iconic Eiffel Tower to charming local neighborhoods and riverside paths.",
  },
] as const;

export const TESTIMONIALS = [
  {
    name: "Sarah L.",
    tour: "Tuscan Countryside",
    quote:
      "An incredible journey through picturesque landscapes. The local cuisine was a highlight!",
    rating: 5,
  },
  {
    name: "Michael R.",
    tour: "Vietnam Heritage Trail",
    quote:
      "While the guides were knowledgeable, some parts felt a bit rushed. Would've loved more time at the cultural sites.",
    rating: 3.8,
  },
  {
    name: "Emma K.",
    tour: "Paris City Explorer",
    quote:
      "A magical way to see Paris! Though the morning traffic was a bit challenging for beginners.",
    rating: 4.2,
  },
  {
    name: "David M.",
    tour: "Berlin Wall Trail",
    quote:
      "Fascinating historical tour, but bike maintenance could've been better. Had some issues with the gears.",
    rating: 3.9,
  },
  {
    name: "Sophie H.",
    tour: "Paris City Explorer",
    quote:
      "The evening ride was beautiful, but some parts of the route felt unsafe after dark.",
    rating: 4.1,
  },
  {
    name: "James W.",
    tour: "Antalya Coastal Route",
    quote:
      "Perfect mix of history and views. The summer heat was intense though - earlier starts would be better.",
    rating: 4.3,
  },
  {
    name: "Maria G.",
    tour: "Mallorca Island Circuit",
    quote:
      "The mountain views were breathtaking, but route difficulty was underestimated in the description.",
    rating: 3.9,
  },
  {
    name: "Thomas B.",
    tour: "Istanbul Historical Tour",
    quote:
      "Crossing the Bosphorus was amazing! The city traffic was a bit scary at times.",
    rating: 4.2,
  },
  {
    name: "Anna K.",
    tour: "Berlin Wall Trail",
    quote:
      "The historical insights were fascinating. Wish we had more bathroom breaks though.",
    rating: 4.0,
  },
  {
    name: "Lucas M.",
    tour: "Paris City Explorer",
    quote:
      "Great hidden spots, but the group was too large which made navigation difficult in narrow streets.",
    rating: 3.8,
  },
  {
    name: "Elena R.",
    tour: "Istanbul Historical Tour",
    quote:
      "The spice market break was a highlight, though keeping up with the guide was challenging in crowded areas.",
    rating: 4.1,
  },
  {
    name: "Oliver P.",
    tour: "Mallorca Island Circuit",
    quote:
      "Beautiful coastal paths, but bike seats could use an upgrade for longer rides.",
    rating: 4.2,
  },
  {
    name: "Isabella F.",
    tour: "Antalya Coastal Route",
    quote:
      "Lovely beach breaks, though some uphill sections were tougher than expected. Better fitness warning needed.",
    rating: 4.0,
  },
  {
    name: "Max S.",
    tour: "Berlin Wall Trail",
    quote:
      "Great street art, but audio equipment for guide commentary didn't work well in wind.",
    rating: 3.7,
  },
  {
    name: "Clara D.",
    tour: "Paris City Explorer",
    quote:
      "Early morning Montmartre was magical, but the coffee break cafe was overpriced.",
    rating: 4.3,
  },
  {
    name: "Adrian B.",
    tour: "Istanbul Historical Tour",
    quote:
      "Sunset ride was spectacular! Though the meeting point was hard to find - better directions needed.",
    rating: 4.1,
  },
  {
    name: "Nina L.",
    tour: "Mallorca Island Circuit",
    quote:
      "Loved the wine tasting! The bike's water bottle holder was broken though.",
    rating: 4.0,
  },
  {
    name: "Felix H.",
    tour: "Antalya Coastal Route",
    quote:
      "Great historical commentary, but the lunch stop restaurant was a bit disappointing for the price.",
    rating: 3.9,
  },
  {
    name: "Laura M.",
    tour: "Berlin Wall Trail",
    quote:
      "East Side Gallery was amazing! Bike baskets would've been helpful for carrying cameras.",
    rating: 4.2,
  },
  {
    name: "Victor K.",
    tour: "Paris City Explorer",
    quote:
      "Food stops were good but pricey. Maybe include some in the tour price?",
    rating: 4.0,
  },
  {
    name: "Sophia A.",
    tour: "Istanbul Historical Tour",
    quote:
      "Guide was knowledgeable but spoke too quickly. Some historical details were hard to follow.",
    rating: 3.8,
  },
  {
    name: "Daniel R.",
    tour: "Mallorca Island Circuit",
    quote:
      "Breathtaking routes but the promised 'all-levels welcome' was misleading. Quite challenging.",
    rating: 3.9,
  },
  {
    name: "Julia W.",
    tour: "Antalya Coastal Route",
    quote:
      "Views were stunning, but the helmet provided was uncomfortable for longer rides.",
    rating: 4.1,
  },
  {
    name: "Marco B.",
    tour: "Berlin Wall Trail",
    quote:
      "Fascinating stories, though some stops felt rushed. An extra hour would make it perfect.",
    rating: 4.0,
  },
] as const;

export const CONTRACT_ADDRESS = "0x06F15D6E234CD1F5815DDf2949b537eae91bf565";
