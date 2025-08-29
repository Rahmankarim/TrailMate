import { ObjectId } from "mongodb";

export interface Review {
  userId: ObjectId;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Destination {
  _id?: ObjectId;
  name: string;
  description: string;
  detailedDescription?: string;
  image: string;
  images?: string[];
  companyName?: string;
  date?: string;
  time?: string;
  availableSeats?: number;
  postedBy?: ObjectId;
  difficulty?: string;
  duration?: string;
  elevation?: string;
  distance?: string;
  bestSeason?: string;
  activities?: string[];
  price?: number;
  featured?: boolean;
  highlights?: string[];
  itinerary?: string[];
  included?: string[];
  notIncluded?: string[];
  packingList?: string[];
  rating?: number;
  reviews?: Review[];
}
// ...existing code...
// ...existing code...

// ...existing code...
