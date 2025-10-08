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

export const envClientSchema = z.object({
  VITE_NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export const env = validateEnv(envClientSchema, {
  VITE_NODE_ENV: rawEnv.VITE_NODE_ENV,
});
