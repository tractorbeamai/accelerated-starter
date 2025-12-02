import * as z from "zod";

export const envServerSchema = z.object({
  DATABASE_URL: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().trim().min(1).optional(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const result = envServerSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  NODE_ENV: process.env.NODE_ENV,
});

if (!result.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(z.treeifyError(result.error), null, 2));
  throw new Error("Invalid environment variables");
}

export const env = result.data;
