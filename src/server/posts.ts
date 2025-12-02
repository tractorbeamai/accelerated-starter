import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import {
  InsertPost,
  insertPostSchema,
  PostId,
  postIdSchema,
  posts,
  UpdatePost,
  updatePostSchema,
  type Post,
} from "@/db/schema";

export const listPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<Post[]> => {
    return await db.select().from(posts);
  },
);

export const findPostById = createServerFn({ method: "GET" })
  .inputValidator(postIdSchema)
  .handler(async ({ data: { id } }): Promise<Post | null> => {
    const result = await db.select().from(posts).where(eq(posts.id, id));
    return result[0] ?? null;
  });

export const createPost = createServerFn({ method: "POST" })
  .inputValidator(insertPostSchema)
  .handler(async ({ data }): Promise<Post> => {
    const [post] = await db.insert(posts).values(data).returning();
    if (!post) {
      throw new Error("Failed to create post");
    }
    return post;
  });

export const updatePost = createServerFn({ method: "POST" })
  .inputValidator(updatePostSchema)
  .handler(async ({ data: { id, ...updateData } }): Promise<Post> => {
    const [post] = await db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, id))
      .returning();
    if (!post) {
      throw new Error("Post not found");
    }
    return post;
  });

export const deletePost = createServerFn({ method: "POST" })
  .inputValidator(postIdSchema)
  .handler(async ({ data: { id } }): Promise<Post> => {
    const [post] = await db.delete(posts).where(eq(posts.id, id)).returning();
    if (!post) {
      throw new Error("Post not found");
    }
    return post;
  });

export const listPostsQueryOptions = () =>
  queryOptions({
    queryKey: ["posts"],
    queryFn: () => listPosts(),
  });

export const findPostByIdQueryOptions = ({ id }: PostId) =>
  queryOptions({
    queryKey: ["posts", id],
    queryFn: () => findPostById({ data: { id } }),
  });

export const createPostMutationOptions = () =>
  mutationOptions({
    mutationFn: (data: InsertPost) => createPost({ data }),
  });

export const updatePostMutationOptions = () =>
  mutationOptions({
    mutationFn: (data: UpdatePost) => updatePost({ data }),
  });

export const deletePostMutationOptions = () =>
  mutationOptions({
    mutationFn: (data: PostId) => deletePost({ data }),
  });
