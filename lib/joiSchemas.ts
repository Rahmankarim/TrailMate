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
  image: Joi.string().uri().required(),
  companyName: Joi.string().min(2).max(100).required(),
  date: Joi.string().required(),
  time: Joi.string().required(),
  availableSeats: Joi.number().min(1).required(),
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
