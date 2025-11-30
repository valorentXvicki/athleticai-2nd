import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  bio: text("bio"),
  discipline: text("discipline"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  username: true,
  password: true,
  displayName: true,
  bio: true,
  discipline: true,
  avatarUrl: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  conversationId: varchar("conversation_id").notNull(),
  role: text("role").notNull(), // 'user' | 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  conversationId: true,
  role: true,
  content: true,
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// User preferences table
export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  sports: text("sports").array(),
  fitnessLevel: text("fitness_level"),
  goals: text("goals").array(),
  preferredWorkoutTime: text("preferred_workout_time"),
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).pick({
  userId: true,
  sports: true,
  fitnessLevel: true,
  goals: true,
  preferredWorkoutTime: true,
});

export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;

// Activities table for tracking workouts
export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration"), // in minutes
  distance: integer("distance"), // in meters
  calories: integer("calories"),
  date: timestamp("date").defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  userId: true,
  type: true,
  title: true,
  description: true,
  duration: true,
  distance: true,
  calories: true,
  date: true,
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Achievements/Trophies table
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon"),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  userId: true,
  title: true,
  description: true,
  icon: true,
});

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

// OTP table for password reset
export const otpCodes = pgTable("otp_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  code: text("code").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
});

export const insertOtpCodeSchema = createInsertSchema(otpCodes).pick({
  email: true,
  code: true,
  expiresAt: true,
});

export type InsertOtpCode = z.infer<typeof insertOtpCodeSchema>;
export type OtpCode = typeof otpCodes.$inferSelect;

// Frontend-only types for chat interface
export interface ChatMessageUI {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  updatedAt: Date;
}

// Auth request/response types
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// Dashboard stats type
export interface DashboardStats {
  totalWorkouts: number;
  totalDistance: number;
  totalCalories: number;
  currentStreak: number;
  weeklyGoalProgress: number;
}

// Sports events table - stores available sports events and clubs
export const sportsEvents = pgTable("sports_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'basketball', 'tennis', 'yoga', etc.
  location: text("location").notNull(),
  date: timestamp("date").notNull(),
  venue: text("venue"),
  price: integer("price"), // in rupees
  capacity: integer("capacity"),
  enrolledCount: integer("enrolled_count").default(0),
  imageUrl: text("image_url"),
  skillLevel: text("skill_level"), // 'beginner', 'intermediate', 'advanced'
  duration: integer("duration"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSportsEventSchema = createInsertSchema(sportsEvents).pick({
  title: true,
  description: true,
  type: true,
  location: true,
  date: true,
  venue: true,
  price: true,
  capacity: true,
  imageUrl: true,
  skillLevel: true,
  duration: true,
});

export type InsertSportsEvent = z.infer<typeof insertSportsEventSchema>;
export type SportsEvent = typeof sportsEvents.$inferSelect;

// User event enrollments
export const eventEnrollments = pgTable("event_enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  eventId: varchar("event_id").notNull().references(() => sportsEvents.id),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
});

export const insertEventEnrollmentSchema = createInsertSchema(eventEnrollments).pick({
  userId: true,
  eventId: true,
});

export type InsertEventEnrollment = z.infer<typeof insertEventEnrollmentSchema>;
export type EventEnrollment = typeof eventEnrollments.$inferSelect;

// Event recommendation type
export interface SportEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  type: string;
  imageUrl?: string;
}

export interface RecommendationResult {
  event: SportsEvent;
  reason: string;
  matchScore: number;
}