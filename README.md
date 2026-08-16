# Tractorbeam Quickstart

A React starter for building polished demos quickly. It uses TanStack Start,
React 19, TanStack Router and Query, shadcn/ui, Tailwind CSS v4, Drizzle ORM,
Neon Postgres, a TanStack Form example, and an optional streaming AI chat example.

## Features

- React 19 with TypeScript
- TanStack Start with file-based routing
- TanStack Query for data fetching and caching
- Server functions for type-safe server logic
- Drizzle ORM, drizzle-zod, and Neon Postgres
- Vite Plus with shared Tractorbeam Oxlint and Oxfmt configuration
- Tailwind CSS v4 and shadcn/ui
- TanStack Form with shadcn/ui fields and Zod validation
- Optional AI SDK chat example using Anthropic Claude and Streamdown

## Quick start

### Requirements

- Node.js 24.11 or newer within Node 24
- pnpm 11.22 or newer
- A Neon database
- An Anthropic API key if you want to run the chat example

### Install and run

```bash
git clone https://github.com/tractorbeamai/quickstart.git
cd quickstart
pnpm install
```

Create `.env.local` with your database connection. Add the Anthropic key if you
want to use the chat example:

```dotenv
DATABASE_URL=your_neon_connection_string
ANTHROPIC_API_KEY=your_key_here
```

Initialize the database and start the app:

```bash
pnpm db:push
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftractorbeamai%2Fquickstart&env=ANTHROPIC_API_KEY&envDescription=API%20key%20for%20the%20optional%20Anthropic%20chat%20example&envLink=https%3A%2F%2Fconsole.anthropic.com%2Fsettings%2Fkeys&project-name=quickstart&products=%5B%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22storage%22%2C%22productSlug%22%3A%22neon%22%2C%22integrationSlug%22%3A%22neon%22%7D%5D)

The deployment flow creates a Vercel project, clones the repository, and can
provision a Neon database. Add `ANTHROPIC_API_KEY` when prompted if you are
keeping the chat example.

## Project structure

```text
src/
├── components/
│   ├── ui/                # shadcn/ui components managed by the CLI
│   └── header.tsx         # Example navigation
├── db/                    # Drizzle client, schema, and seed data
├── lib/                   # Environment validation and utilities
├── routes/
│   ├── __root.tsx         # Root route
│   ├── index.tsx          # Home page
│   └── example/           # Chat, form, posts, and REST examples
├── server/                # Server functions
├── routeTree.gen.ts       # Generated route tree; do not edit
└── styles.css             # Global styles and Tailwind configuration
```

## Commands

```bash
pnpm dev              # start the development server
pnpm build            # create a production build
pnpm check            # run formatting, lint, and type checks
pnpm format           # format the repository with Oxfmt
pnpm lint             # lint the repository with Oxlint
pnpm typecheck        # run TypeScript checks
pnpm lint:knip        # find unused code and dependencies
pnpm db:push          # sync the schema directly in development
pnpm db:generate      # generate database migrations
pnpm db:migrate       # apply database migrations
pnpm db:seed          # seed example data
pnpm db:studio        # open Drizzle Studio
```

## Removing the AI chat features

The chat example is isolated from the posts, REST, database, and routing examples.

1. Delete the chat routes and first-party shadcn chat components:

   ```bash
   rm src/routes/example/chat.tsx src/routes/example/api.chat.ts
   rm src/components/ui/bubble.tsx
   rm src/components/ui/message.tsx
   rm src/components/ui/message-scroller.tsx
   ```

2. Remove the `Chat` navigation item from `src/components/header.tsx`.

3. Remove `ANTHROPIC_API_KEY` from `src/lib/env-server.ts` and from your local
   and deployed environment variables.

4. Delete the Streamdown `@source` line from `src/styles.css` and remove
   `streamdown` from `ssr.noExternal` in `vite.config.ts`. If the array is then
   empty, remove the entire `ssr` block.

5. Remove the chat packages:

   ```bash
   pnpm remove @ai-sdk/anthropic @ai-sdk/react @shadcn/react ai streamdown
   ```

6. Regenerate the route tree and verify the result:

   ```bash
   pnpm build
   pnpm check
   ```

`src/routeTree.gen.ts` is generated automatically during the build and should
not be edited by hand.

## Adding a route

Create a file in `src/routes/` and export a file route:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return <div>About</div>;
}
```

## Styling

Use Tailwind classes and `cn()` for conditional class merging:

```tsx
import { cn } from "@/lib/utils";

<div className={cn("rounded-lg border p-4", isActive && "border-primary")} />;
```
