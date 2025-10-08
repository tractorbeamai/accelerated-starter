import { loadEnv } from "vite";
import * as z from "zod";

const rawEnv = loadEnv(import.meta.env.MODE, process.cwd());

export function validateEnv<T extends z.ZodSchema>(
  schema: T,
  env: Record<keyof z.infer<T>, string | undefined>,
) {
  const result = schema.safeParse(env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    console.error(JSON.stringify(z.treeifyError(result.error), null, 2));
    throw new Error("Invalid environment variables");
  }

  return result.data;
}

export const envServerSchema = z.object({
  DATABASE_URL: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().trim().min(1).optional(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export const env = validateEnv(envServerSchema, {
  DATABASE_URL: rawEnv.DATABASE_URL,
  ANTHROPIC_API_KEY: rawEnv.ANTHROPIC_API_KEY,
  NODE_ENV: rawEnv.NODE_ENV,
});
