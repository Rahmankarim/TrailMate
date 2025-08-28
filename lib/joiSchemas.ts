import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  role: Joi.string().valid("guide", "company").required(),
  companyName: Joi.string().allow("").optional(),
  googleId: Joi.string().optional(),
});

export const destinationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  detailedDescription: Joi.string().allow('').optional(),
  image: Joi.string().uri().required(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  companyName: Joi.string().min(2).max(100).required(),
  date: Joi.string().required(),
  time: Joi.string().required(),
  availableSeats: Joi.number().min(1).required(),
  location: Joi.string().allow('').optional(),
  difficulty: Joi.string().allow('').optional(),
  duration: Joi.string().allow('').optional(),
  elevation: Joi.string().allow('').optional(),
  distance: Joi.string().allow('').optional(),
  bestSeason: Joi.string().allow('').optional(),
  activities: Joi.array().items(Joi.string()).optional(),
  price: Joi.number().min(0).optional(),
  featured: Joi.boolean().optional(),
  highlights: Joi.array().items(Joi.string()).optional(),
  itinerary: Joi.array().items(Joi.string()).optional(),
  included: Joi.array().items(Joi.string()).optional(),
  notIncluded: Joi.array().items(Joi.string()).optional(),
  packingList: Joi.array().items(Joi.string()).optional(),
});

export const guideSchema = Joi.object({
  places: Joi.array().items(Joi.string().min(2).max(100)).required(),
  availableDates: Joi.array().items(Joi.string()).required(),
});

export const bookingSchema = Joi.object({
  destinationId: Joi.string().required(),
  userId: Joi.string().required(),
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  seats: Joi.number().min(1).required(),
  details: Joi.string().max(500).optional(),
});
