# Vibe Starter

A modern React starter template for building visually impressive demos quickly. Built with TanStack Start, React 19, Tailwind CSS v4, and AI integration.

**This is a demo/prototype starter, not production software.** The goal is to build beautiful, fire demos in days, not months.

## ✨ Features

- 🚀 **React 19** with functional components and hooks
- 🎯 **TanStack Start** for full-stack React with client-side rendering
- 🧭 **TanStack Router** with file-based routing
- 📦 **TanStack Store** for state management
- 🔄 **TanStack Query** for data fetching and caching
- 🔌 **tRPC** for type-safe API routes
- 🗄️ **Drizzle ORM** with Neon Postgres and drizzle-zod integration
- ☁️ **Neon Database** with branching for development
- 🎨 **Tailwind CSS v4** with semantic color variables
- 🧩 **shadcn/ui** components (new-york style)
- 🤖 **AI Integration** with Anthropic Claude (via AI SDK)
- ✨ **Motion** for smooth animations and transitions
- 📝 **TypeScript** with strict mode and path aliases

## 🚀 Quick Start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up Neon Database

This project uses [Neon](https://neon.tech) for serverless Postgres with database branching.

```bash
# Authenticate with Neon
neon auth

# Create a new project (or use existing one)
neon projects create --name vibe-starter

# Set project context (so you don't need to pass project ID each time)
neon set-context --org-id $ORG_ID --project-id $PROJECT_ID

# Create a development branch
neon branches create --name local-dev

# Get your connection string
neon connection-string
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```bash
cat > .env.local << 'EOF'
DATABASE_URL=your_neon_connection_string
ANTHROPIC_API_KEY=your_key_here
EOF
```

**Tip:** You can also get your connection string from the [Neon Console](https://console.neon.tech).

### 4. Set up the database

```bash
# Push schema to database
pnpm db:push

# Seed with example data (3 posts)
pnpm db:seed
```

### 5. Start dev server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app.

## 📁 Project Structure

```
src/
├── routes/              # File-based routing
│   ├── __root.tsx      # Root layout with Header and Outlet
│   ├── index.tsx       # Home page
│   ├── api.trpc.$.ts   # tRPC API endpoint
│   └── example/        # Example routes (safe to delete)
├── components/          # React components
│   ├── ui/             # shadcn/ui components (managed by CLI)
│   ├── ai-elements/    # AI-powered UI components
│   └── Header.tsx      # Navigation header
├── db/                 # Database layer
│   ├── schema.ts       # Database schema (Drizzle ORM + drizzle-zod)
│   └── client.ts       # Database connection
├── lib/                # Utilities and stores
│   ├── utils.ts        # cn() for className merging
│   └── demo-store.ts   # Example TanStack Store (safe to delete)
├── trpc/               # tRPC setup and routers
│   ├── init.ts         # tRPC initialization
│   ├── router.ts       # API routes
│   └── provider.tsx    # tRPC provider
├── data/               # Static/mock data
└── styles.css          # Global styles and Tailwind config
```

## 🎯 Common Tasks

### Add a new route

Create a file in `src/routes/`:

```tsx
// src/routes/about.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return <div>About Page</div>;
}
```

### Add a shadcn/ui component

```bash
pnpx shadcn@latest add button
```

Components are added to `src/components/ui/` and ready to use.

### Create a tRPC API route

Add procedures to `src/trpc/router.ts`:

```tsx
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "./init";

export const trpcRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return { message: `Hello ${input.name}!` };
    }),
});
```

### Work with Drizzle ORM

Define a schema in `src/db/schema.ts`:

```tsx
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
});

// Auto-generate Zod schemas from Drizzle
export const insertPostSchema = createInsertSchema(posts).omit({ id: true });
```

Use in tRPC:

```tsx
import { db } from "@/db/client";
import { insertPostSchema, posts } from "@/db/schema";

const postRouter = {
  list: publicProcedure.query(async () => {
    return await db.select().from(posts);
  }),
  create: publicProcedure
    .input(insertPostSchema)
    .mutation(async ({ input }) => {
      const [post] = await db.insert(posts).values(input).returning();
      return post;
    }),
};
```

### Add state management

Create a store:

```tsx
// src/lib/counter-store.ts
import { Store } from "@tanstack/store";

export const counterStore = new Store(0);
```

Use in a component:

```tsx
import { useStore } from "@tanstack/react-store";

import { counterStore } from "@/lib/counter-store";

function Counter() {
  const count = useStore(counterStore);
  return (
    <button onClick={() => counterStore.setState((n) => n + 1)}>
      Count: {count}
    </button>
  );
}
```

For derived state (computed values):

```tsx
// src/lib/name-store.ts
import { Derived, Store } from "@tanstack/store";

export const nameStore = new Store({
  firstName: "Jane",
  lastName: "Smith",
});

export const fullName = new Derived({
  fn: () => `${nameStore.state.firstName} ${nameStore.state.lastName}`,
  deps: [nameStore],
});

fullName.mount();
```

### Navigate between pages

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/about">About</Link>;
```

## 🎨 Styling

This project uses **Tailwind CSS v4** with semantic color variables:

```tsx
// Use semantic variables, not hardcoded colors
<div className="bg-primary text-foreground border-border border">
  <button className="bg-accent hover:bg-accent/90">Click me</button>
</div>
```

All color variables are defined in `src/styles.css` and automatically adapt to dark mode.

**Important:** Always use the `cn()` utility to merge className strings:

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-class", isActive && "active-class")} />;
```

## 🤖 AI Integration

AI features use Anthropic's Claude API. Requires `ANTHROPIC_API_KEY` in `.env`.

### Server Route (API Endpoint)

```tsx
// src/routes/example/api.chat.ts
import { anthropic } from "@ai-sdk/anthropic";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export const Route = createFileRoute("/example/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages }: { messages: UIMessage[] } = await request.json();

        const result = streamText({
          model: anthropic("claude-sonnet-4-5-20250929"),
          messages: convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse();
      },
    },
  },
});
```

### Client Usage

```tsx
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

function Chat() {
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/example/api/chat",
    }),
  });

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          {message.parts?.map((part) =>
            part.type === "text" ? part.text : null,
          )}
        </div>
      ))}
    </div>
  );
}
```

See `src/routes/example/chat.tsx` and `src/routes/example/api.chat.ts` for complete examples.

## 🗄️ Database Commands

```bash
pnpm db:generate            # generate migration from schema changes
pnpm db:migrate             # apply migrations to database
pnpm db:push                # push schema directly (no migrations)
pnpm db:seed                # seed database with example data
pnpm db:studio              # open Drizzle Studio GUI
```

## 🧪 Development

```bash
# Type check a file
pnpm exec tsc --noEmit src/routes/index.tsx

# Lint a file
pnpm exec eslint --fix src/routes/index.tsx

# Format a file
pnpm exec prettier --write src/routes/index.tsx

# Run all lints (sparingly)
pnpm lint

# Build for production
pnpm build
```

## 📚 Tech Stack Details

- **React 19** - Latest React with concurrent features
- **TanStack Start** - Full-stack React framework (client-only rendering)
- **TanStack Router** - File-based routing with type safety
- **TanStack Store** - Simple, powerful state management
- **TanStack Query** - Data fetching and caching
- **tRPC** - End-to-end type-safe APIs
- **Drizzle ORM** - Type-safe SQL with Neon Postgres
- **Neon Database** - Serverless Postgres with branching
- **drizzle-zod** - Auto-generate Zod schemas from Drizzle tables
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **Motion** - Smooth animations (formerly framer-motion)
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type safety throughout

## 🗂️ Example Files

The project includes example files to demonstrate patterns:

- `src/routes/example/chat.tsx` - AI chat interface with streaming
- `src/routes/example/api.chat.ts` - Server route for AI chat API
- `src/routes/example/posts/` - Dynamic routes with Drizzle ORM + tRPC + shadcn/ui
- `src/routes/example/store.tsx` - TanStack Store with derived state
- `src/routes/example/rest-api.tsx` - TanStack Query data fetching demo
- `src/lib/demo-store.ts` - Example store with derived state

**You can safely delete the `src/routes/example/` directory and `src/lib/demo-store.ts` when starting your project.**

## 📖 Documentation

- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Store](https://tanstack.com/store)
- [TanStack Query](https://tanstack.com/query)
- [Drizzle ORM](https://orm.drizzle.team/)
- [drizzle-zod](https://orm.drizzle.team/docs/zod)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [tRPC](https://trpc.io/)
- [AI SDK](https://sdk.vercel.ai/)
- [Motion](https://motion.dev/)

## 🎯 Philosophy

This starter is built for **rapid demo development**:

- Prioritize visual polish and "wow factor"
- Focus on happy path, skip edge cases
- Use AI features to showcase capabilities
- Keep it simple and build fast
- Beautiful demos beat perfect products

See `AGENTS.md` for detailed development guidelines.

## 📦 Package Manager

This project uses **pnpm**. Do not use npm or yarn.

```bash
# Required versions
node >= 22.12.0
pnpm >= 10.18.1
```

---

**Ready to build something amazing?** Start by exploring the example routes, then delete them and create your own! 🎉
