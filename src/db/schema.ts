import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import * as z from "zod";

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
export const postIdSchema = z.object({
  id: z.int().positive(),
});
export const selectPostSchema = createSelectSchema(posts);
export const insertPostSchema = createInsertSchema(posts);
export const updatePostSchema = createUpdateSchema(posts).extend(
  postIdSchema.shape,
);

// Types inferred from schemas
export type PostId = z.infer<typeof postIdSchema>;
export type Post = z.infer<typeof selectPostSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
