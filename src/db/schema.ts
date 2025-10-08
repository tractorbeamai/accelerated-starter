import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Example posts table with drizzle-zod integration
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Zod schemas generated from Drizzle schema
export const selectPostSchema = createSelectSchema(posts);
export const insertPostSchema = createInsertSchema(posts, {
  status: z.enum(["draft", "published"]),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const updatePostSchema = insertPostSchema.partial();

// Types inferred from schemas
export type Post = z.infer<typeof selectPostSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
