import { z } from "zod";

// Basic Zod schemas for MongoDB data validation
export const userSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
  email: z.string().email().max(100),
  fullName: z.string().min(2).max(100),
  phone: z.string().max(20).optional(),
  role: z.enum(["client", "advocate", "admin"]).default("client"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const practiceAreaSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2).max(100),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const locationSchema = z.object({
  id: z.string().optional(),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  pincode: z.string().max(10).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const advocateSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  locationId: z.string(),
  bio: z.string().min(10),
  experience: z.number().int().min(0),
  barCouncilNumber: z.string().min(5).max(50),
  aorNumber: z.string().max(50).optional(),
  practitionerCourts: z.array(z.string()).optional(),
  notableCases: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  imageUrl: z.string().url(),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().min(0).default(0),
  verified: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const advocateSpecialtySchema = z.object({
  id: z.string().optional(),
  advocateId: z.string(),
  practiceAreaId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const reviewSchema = z.object({
  id: z.string().optional(),
  advocateId: z.string(),
  userId: z.string(), // Changed from clientId to align with existing schema
  rating: z.number().int().min(1).max(5),
  content: z.string().max(1000).optional(), // Changed from comment to align with existing schema
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const connectionSchema = z.object({
  id: z.string().optional(),
  advocateId: z.string(),
  clientId: z.string(),
  status: z.enum(["pending", "active", "expired", "cancelled"]).default("pending"),
  paymentId: z.string().optional(),
  expiresAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const chatMessageSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  isUserMessage: z.boolean().default(true),
  content: z.string().min(1),
  createdAt: z.date().optional()
});

// Schemas for insertion (omitting optional generated fields)
export const insertUserSchema = userSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertPracticeAreaSchema = practiceAreaSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertLocationSchema = locationSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertAdvocateSchema = advocateSchema.omit({ 
  id: true, 
  rating: true,
  reviewCount: true,
  createdAt: true, 
  updatedAt: true 
});

export const insertAdvocateSpecialtySchema = advocateSpecialtySchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertReviewSchema = reviewSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertConnectionSchema = connectionSchema.omit({ 
  id: true, 
  expiresAt: true,
  createdAt: true, 
  updatedAt: true 
});

export const insertChatMessageSchema = chatMessageSchema.omit({ 
  id: true, 
  createdAt: true 
});

// Export types
export type MongoUser = z.infer<typeof userSchema>;
export type MongoInsertUser = z.infer<typeof insertUserSchema>;

export type MongoPracticeArea = z.infer<typeof practiceAreaSchema>;
export type MongoInsertPracticeArea = z.infer<typeof insertPracticeAreaSchema>;

export type MongoLocation = z.infer<typeof locationSchema>;
export type MongoInsertLocation = z.infer<typeof insertLocationSchema>;

export type MongoAdvocate = z.infer<typeof advocateSchema>;
export type MongoInsertAdvocate = z.infer<typeof insertAdvocateSchema>;

export type MongoAdvocateSpecialty = z.infer<typeof advocateSpecialtySchema>;
export type MongoInsertAdvocateSpecialty = z.infer<typeof insertAdvocateSpecialtySchema>;

export type MongoReview = z.infer<typeof reviewSchema>;
export type MongoInsertReview = z.infer<typeof insertReviewSchema>;

export type MongoConnection = z.infer<typeof connectionSchema>;
export type MongoInsertConnection = z.infer<typeof insertConnectionSchema>;

export type MongoChatMessage = z.infer<typeof chatMessageSchema>;
export type MongoInsertChatMessage = z.infer<typeof insertChatMessageSchema>;

// Extended type for advocate with details
export type MongoAdvocateWithDetails = MongoAdvocate & {
  user: {
    fullName: string;
    email: string;
    phone?: string;
  };
  location: MongoLocation;
  specialties: MongoPracticeArea[];
  reviewCount: number;
  rating: number;
};