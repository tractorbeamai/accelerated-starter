# vibestarter 

A modern React starter template for building visually impressive demos quickly. Built with TanStack Start, React 19, shadcn/ui, Tailwind CSS v4, and Claude.

## ✨ Features

- 🚀 **React 19** with functional components and hooks
- 🎯 **[TanStack Start](https://tanstack.com/start/latest/docs)** for full-stack React with client-side rendering
- 🧭 **[TanStack Router](https://tanstack.com/router/latest/docs)** with file-based routing
- 📦 **[TanStack Store](https://tanstack.com/store/latest/docs)** for state management
- 🔄 **[TanStack Query](https://tanstack.com/query/latest/docs)** for data fetching and caching
- 🔌 **Server Functions** for type-safe server-side logic
- 🗄️ **[Drizzle ORM](https://orm.drizzle.team/)** with Neon Postgres and [drizzle-zod](https://orm.drizzle.team/docs/zod) integration
- ☁️ **[Neon Database](https://neon.tech/docs)** with branching for development
- 🎨 **[Tailwind CSS v4](https://tailwindcss.com/)** with semantic color variables
- 🧩 **[shadcn/ui](https://ui.shadcn.com/)** components (new-york style)
- 🤖 **[AI SDK](https://ai-sdk.dev/)** with Anthropic Claude
- ✨ **[Motion](https://motion.dev/)** for smooth animations and transitions
- 📝 **TypeScript** with strict mode and path aliases

## 🚀 Quick Start

### Prerequisites

- Node.js v22.12.0+ ([Download Node.js](https://nodejs.org/en/download))
- pnpm (`npm install -g pnpm`)
- GitHub and Vercel accounts
- Vercel CLI (`npm install -g vercel`)
- Anthropic API key ([console.anthropic.com](https://console.anthropic.com/settings/keys))

### 1. Create your project with Vercel

[![Deploy with Vercel](https://vercel.com/button)](<https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftractorbeamai%2Faccelerated-starter&env=ANTHROPIC_API_KEY&envDescription=API%20key%20for%20Anthropic%20Claude%20(required%20for%20AI%20features)&envLink=https%3A%2F%2Fconsole.anthropic.com%2Fsettings%2Fkeys&project-name=accelerated-starter&products=%5B%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22storage%22%2C%22productSlug%22%3A%22neon%22%2C%22integrationSlug%22%3A%22neon%22%7D%5D>)

1. Click the **Deploy with Vercel** button above
2. Sign in to Vercel and GitHub if needed
3. You will be prompted to configure details on your project setup:
   - Choose GitHub as your git provider, select your git workspace, and assign a name to your repo
   - Choose your Vercel team and click **Create**
4. In **Add Products**, you should see **Neon**. Click **Add** and configure the following settings:
   - Keep **Region** as the default
   - Set **Auth** to `false`, click "Continue"
   - Keep **Database Name (\*)** as the default name, click "Create"
   - Check the **Preview** box for the **Create Database Branch For Deployment** section, keep everything else as is. Click "Connect"
5. Enter your `ANTHROPIC_API_KEY` when prompted
6. Click **Deploy**

This will:

- Clone the repo to your GitHub account
- Create a Vercel project
- Provision a Neon Postgres database with branching
- Deploy your app

Once deployment has completed, go to the project in Vercel and click the **Repository** button to navigate to the repository in GitHub

### 2. Clone your repo locally

```bash
git clone <your-repo-url>
cd <your-repo>
```

### 3. Install dependencies

```bash
pnpm install
```

### 4. Link to Vercel and pull environment

```bash
vercel link    # Select your deployed project when prompted
```

When prompted to pull environment variables now, select **Yes**

### 5. Add Anthropic key to local env

```bash
echo "ANTHROPIC_API_KEY=your_key_here" >> .env.local
```

Replace `your_key_here` with your actual API key

### 6. Set up the database

```bash
pnpm db:push    # Push schema to Neon
pnpm db:seed    # Optional: seed with example data
```

### 7. Start dev server

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
│   └── example/        # Example routes (safe to delete)
├── routeTree.gen.ts    # Auto-generated route tree (don't edit)
├── router.tsx          # Router configuration
├── components/          # React components
│   ├── ui/             # shadcn/ui components (managed by CLI)
│   ├── ai-elements/    # AI-powered UI components
│   └── header.tsx      # Navigation header
├── db/                 # Database layer
│   ├── schema.ts       # Database schema (Drizzle ORM + drizzle-zod)
│   ├── client.ts       # Database connection
│   └── seed.ts         # Database seeding script
├── server/             # Server functions (TanStack Start)
│   └── posts.ts        # Example server functions with query options
├── lib/                # Utilities and helpers
│   ├── utils.ts        # cn() for className merging
│   ├── env-client.ts   # Client-side environment variables
│   ├── env-server.ts   # Server-side environment variables
│   └── demo-store.ts   # Example TanStack Store (safe to delete)
├── store/              # TanStack Store state management
├── data/               # Static/mock data
├── utils/              # Additional utilities
└── styles.css          # Global styles and Tailwind config
migrations/             # Database migrations (auto-generated)
```

## 🛠️ Commands

### Database

```bash
pnpm db:push                # push schema directly (dev)
pnpm db:generate            # generate migration from schema changes
pnpm db:migrate             # apply migrations to database
pnpm db:seed                # seed database with example data
pnpm db:studio              # open Drizzle Studio GUI
```

### Development

```bash
pnpm dev                    # start dev server
pnpm build                  # build for production
```

### Linting & Formatting (file-scoped)

```bash
pnpm lint:types path/to/file.tsx        # type check
pnpm lint:eslint path/to/file.tsx       # lint
pnpm format:prettier path/to/file.tsx   # format
```

### Linting & Formatting (project-wide)

```bash
pnpm lint                   # run all lints
pnpm lint:types             # type check all files
pnpm lint:eslint            # lint all files
pnpm lint:format            # check formatting
pnpm lint:knip              # check for unused code
```

## 🎨 Styling

Use **Tailwind CSS v4** with semantic color variables from `src/styles.css`:

```tsx
<div className="border border-border bg-primary text-foreground">
  <button className="bg-accent hover:bg-accent/90">Click me</button>
</div>
```

Always use `cn()` to merge className strings:

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-class", isActive && "active-class")} />;
```

---

## 📚 Examples

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

### Data Fetching (Drizzle + Server Functions)

**1. Define schema** in `src/db/schema.ts`:

```tsx
// src/db/schema.ts
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as z from "zod";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
});

// Auto-generate Zod schemas from Drizzle
export const selectPostSchema = createSelectSchema(posts);
export const insertPostSchema = createInsertSchema(posts);
export type Post = z.infer<typeof selectPostSchema>;
```

**2. Create server function** in `src/server/posts.ts`:

```tsx
// src/server/posts.ts
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

import { db } from "@/db/client";
import { posts, type Post } from "@/db/schema";

export const listPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<Post[]> => {
    return await db.select().from(posts);
  },
);

export const listPostsQueryOptions = () =>
  queryOptions({
    queryKey: ["posts"],
    queryFn: () => listPosts(),
  });
```

**3. Use in route** with loader and `useSuspenseQuery`:

```tsx
// src/routes/posts/index.tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { listPostsQueryOptions } from "@/server/posts";

export const Route = createFileRoute("/posts/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(listPostsQueryOptions()),
  component: PostsPage,
});

function PostsPage() {
  const { data: posts } = useSuspenseQuery(listPostsQueryOptions());
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### State Management (TanStack Store)

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";

export const counterStore = new Store(0);

function Counter() {
  const count = useStore(counterStore);
  return (
    <button onClick={() => counterStore.setState((n) => n + 1)}>
      Count: {count}
    </button>
  );
}
```

### AI Chat Integration

**Server route** (`src/routes/api.chat.ts`):

```tsx
import { anthropic } from "@ai-sdk/anthropic";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export const Route = createFileRoute("/api/chat")({
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

**Client usage**:

```tsx
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

function Chat() {
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  // ...
}
```

See `src/routes/example/` for complete working examples.

### Example Files

- `src/routes/example/chat.tsx` - AI chat interface with streaming
- `src/routes/example/posts/` - Dynamic routes with Drizzle + Server Functions
- `src/server/posts.ts` - Server functions with query options
- `src/routes/example/store.tsx` - TanStack Store with derived state
- `src/lib/demo-store.ts` - Example store (safe to delete)

**You can safely delete `src/routes/example/` and `src/lib/demo-store.ts` when starting your project.**
