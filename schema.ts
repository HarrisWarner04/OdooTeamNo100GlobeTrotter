import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const itineraries = pgTable("itineraries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  stops: text("stops"),
  duration: text("duration").notNull(),
  notes: text("notes"),
  generatedContent: text("generated_content").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const travelRequestSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  stops: z.string().optional(),
  duration: z.string().min(1, "Duration is required"),
  notes: z.string().optional(),
});

export const insertItinerarySchema = createInsertSchema(itineraries).pick({
  origin: true,
  destination: true,
  stops: true,
  duration: true,
  notes: true,
  generatedContent: true,
});

export type TravelRequest = z.infer<typeof travelRequestSchema>;
export type InsertItinerary = z.infer<typeof insertItinerarySchema>;
export type Itinerary = typeof itineraries.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
