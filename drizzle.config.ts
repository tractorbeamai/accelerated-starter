import { defineConfig } from "drizzle-kit";
import { loadEnv } from "vite";

const env = loadEnv("development", process.cwd(), ["DATABASE_URL"]);

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
