import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const notes = pgTable("notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertNoteSchema = createInsertSchema(notes).pick({
  title: true,
  content: true,
  tags: true,
}).extend({
  title: z.string().min(1, "El título no puede estar vacío"),
  content: z.string().min(10, "El contenido debe tener al menos 10 caracteres"),
  tags: z.array(z.string()).default([]),
});

export const updateNoteSchema = createInsertSchema(notes).pick({
  title: true,
  content: true,
  tags: true,
}).extend({
  id: z.string(),
  title: z.string().min(1, "El título no puede estar vacío"),
  content: z.string().min(10, "El contenido debe tener al menos 10 caracteres"),
  tags: z.array(z.string()).default([]),
});

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type UpdateNote = z.infer<typeof updateNoteSchema>;
export type Note = typeof notes.$inferSelect;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
