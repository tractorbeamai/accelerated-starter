import * as z from "zod";

export const envClientSchema = z.object({
  VITE_NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const result = envClientSchema.safeParse({
  VITE_NODE_ENV: import.meta.env.VITE_NODE_ENV,
});

if (!result.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(z.treeifyError(result.error), null, 2));
  throw new Error("Invalid environment variables");
}

export const env = result.data;
