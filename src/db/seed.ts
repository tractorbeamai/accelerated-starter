import { drizzle } from "drizzle-orm/neon-http";
import { loadEnv } from "vite";

import * as schema from "./schema";

const env = loadEnv("development", process.cwd(), ["DATABASE_URL"]);

async function main() {
  const db = drizzle(env.DATABASE_URL, { schema });

  console.log("🌱 Seeding database...");

  // Seed with 3 example posts
  await db.insert(schema.posts).values([
    {
      title: "Getting Started with TanStack Start",
      content:
        "TanStack Start is a powerful framework for building modern web applications with React. It provides type-safe routing, server functions, and seamless integration with other TanStack libraries. In this post, we'll explore the key features and how to get started with your first project.",
      status: "published",
    },
    {
      title: "Building Modern Web Apps with Drizzle ORM",
      content:
        "Drizzle ORM offers a type-safe and performant way to interact with your database. With its intuitive API and excellent TypeScript support, it makes database operations a breeze. Learn how to set up Drizzle, define schemas, and perform queries in this comprehensive guide.",
      status: "published",
    },
    {
      title: "The Future of Full-Stack TypeScript",
      content:
        "TypeScript has revolutionized how we build full-stack applications. With frameworks like TanStack Start and tools like Drizzle ORM, we can now have end-to-end type safety from the database to the UI. Discover the benefits and best practices for building type-safe full-stack applications.",
      status: "draft",
    },
  ]);

  console.log("✅ Database seeded successfully with 3 posts!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  });
