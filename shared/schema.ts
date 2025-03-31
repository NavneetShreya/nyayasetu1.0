import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  role: text("role").default("client").notNull(), // client, advocate, admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Practice Areas (specialties)
export const practiceAreas = pgTable("practice_areas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const insertPracticeAreaSchema = createInsertSchema(practiceAreas).omit({
  id: true,
});

// Location (cities and states)
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode"),
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
});

// Advocate profiles
export const advocates = pgTable("advocates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  locationId: integer("location_id").notNull().references(() => locations.id),
  bio: text("bio").notNull(),
  experience: integer("experience").notNull(), // in years
  barCouncilNumber: text("bar_council_number").notNull(),
  imageUrl: text("image_url"),
  rating: doublePrecision("rating").default(0),
  reviewCount: integer("review_count").default(0),
  verified: boolean("verified").default(false),
});

export const insertAdvocateSchema = createInsertSchema(advocates).omit({
  id: true,
  rating: true,
  reviewCount: true,
  verified: true,
});

// Advocate specialties (many-to-many relationship)
export const advocateSpecialties = pgTable("advocate_specialties", {
  id: serial("id").primaryKey(),
  advocateId: integer("advocate_id").notNull().references(() => advocates.id),
  practiceAreaId: integer("practice_area_id").notNull().references(() => practiceAreas.id),
});

export const insertAdvocateSpecialtySchema = createInsertSchema(advocateSpecialties).omit({
  id: true,
});

// Reviews for advocates
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  advocateId: integer("advocate_id").notNull().references(() => advocates.id),
  userId: integer("user_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(), // 1-5 stars
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Connections between clients and advocates
export const connections = pgTable("connections", {
  id: serial("id").primaryKey(),
  advocateId: integer("advocate_id").notNull().references(() => advocates.id),
  clientId: integer("client_id").notNull().references(() => users.id),
  status: text("status").default("pending").notNull(), // pending, active, expired
  paymentId: text("payment_id"), // Razorpay payment ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"), // 30 days after creation
});

export const insertConnectionSchema = createInsertSchema(connections).omit({
  id: true,
  createdAt: true,
});

// Chat messages between AI and users
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  isUserMessage: boolean("is_user_message").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type PracticeArea = typeof practiceAreas.$inferSelect;
export type InsertPracticeArea = z.infer<typeof insertPracticeAreaSchema>;

export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type Advocate = typeof advocates.$inferSelect;
export type InsertAdvocate = z.infer<typeof insertAdvocateSchema>;

export type AdvocateSpecialty = typeof advocateSpecialties.$inferSelect;
export type InsertAdvocateSpecialty = z.infer<typeof insertAdvocateSpecialtySchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Connection = typeof connections.$inferSelect;
export type InsertConnection = z.infer<typeof insertConnectionSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

// Extended types for API responses
export type AdvocateWithDetails = Advocate & {
  user: {
    fullName: string;
    email: string;
    phone?: string;
  };
  location: Location;
  specialties: PracticeArea[];
  reviewCount: number;
  rating: number;
};
