import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/client";
import { insertPostSchema, posts, updatePostSchema } from "@/db/schema";

import { createTRPCRouter, publicProcedure } from "./init";

// Posts router using Drizzle ORM + drizzle-zod integration
const postRouter = {
  list: publicProcedure.query(async () => {
    return await db.select().from(posts);
  }),
  byId: publicProcedure.input(z.number()).query(async ({ input }) => {
    const result = await db.select().from(posts).where(eq(posts.id, input));
    if (!result[0]) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return result[0];
  }),
  create: publicProcedure
    .input(insertPostSchema)
    .mutation(async ({ input }) => {
      const [post] = await db.insert(posts).values(input).returning();
      return post;
    }),
  update: publicProcedure
    .input(z.object({ id: z.number(), data: updatePostSchema }))
    .mutation(async ({ input }) => {
      const [post] = await db
        .update(posts)
        .set(input.data)
        .where(eq(posts.id, input.id))
        .returning();
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return post;
    }),
  delete: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    const [post] = await db
      .delete(posts)
      .where(eq(posts.id, input))
      .returning();
    if (!post) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return post;
  }),
} satisfies TRPCRouterRecord;

export const trpcRouter = createTRPCRouter({
  posts: postRouter,
});
export type TRPCRouter = typeof trpcRouter;
