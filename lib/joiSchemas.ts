import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters with uppercase, lowercase, number and special character",
    }),
  role: Joi.string().valid("user", "company").required(),
  companyName: Joi.string().allow("").optional(),
  googleId: Joi.string().optional(),
});

export const destinationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  detailedDescription: Joi.string().allow("").optional(),
  image: Joi.string().uri().required(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  companyName: Joi.string().min(2).max(100).required(),
  date: Joi.string().required(),
  time: Joi.string().required(),
  availableSeats: Joi.number().min(1).required(),
  location: Joi.string().allow("").optional(),
  difficulty: Joi.string().allow("").optional(),
  duration: Joi.string().allow("").optional(),
  elevation: Joi.string().allow("").optional(),
  distance: Joi.string().allow("").optional(),
  bestSeason: Joi.string().allow("").optional(),
  activities: Joi.array().items(Joi.string()).optional(),
  price: Joi.number().min(0).optional(),
  featured: Joi.boolean().optional(),
  highlights: Joi.array().items(Joi.string()).optional(),
  itinerary: Joi.array().items(Joi.string()).optional(),
  included: Joi.array().items(Joi.string()).optional(),
  notIncluded: Joi.array().items(Joi.string()).optional(),
  packingList: Joi.array().items(Joi.string()).optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
});

export const guideSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  bio: Joi.string().min(10).max(1000).required(),
  experience: Joi.number().min(0).max(100).required(),
  specialties: Joi.array().items(Joi.string().min(2).max(50)).required(),
  languages: Joi.array().items(Joi.string().min(2).max(50)).required(),
  location: Joi.string().min(2).max(100).required(),
  dailyRate: Joi.number().min(0).required(),
  contactInfo: Joi.object({
    phone: Joi.string().min(7).max(20).required(),
    email: Joi.string().email().required(),
  }).required(),
  places: Joi.array().items(Joi.string().min(2).max(100)).optional(),
  availableDates: Joi.array().items(Joi.string()).optional(),
});

export const bookingSchema = Joi.object({
  destinationId: Joi.string().required(),
  userId: Joi.string().required(),
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  seats: Joi.number().min(1).required(),
  details: Joi.string().max(500).optional(),
});
