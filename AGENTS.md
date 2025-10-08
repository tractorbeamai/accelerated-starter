# AGENTS.md

## Prototype Philosophy

**This is a demo/prototype project, NOT production software.**

Our goal is to build visually impressive, fire demos that get potential customers excited. We're not building real products that need to be maintained or used in production.

**Build for impact, not perfection:**

- prioritize visual polish and delightful experiences
- focus on core value and happy path only
- don't handle edge cases or error states unless they break the demo
- keep it simple to build quickly
- use AI features prominently to showcase capabilities
- rely on shadcn/ui defaults for instant polish
- use Tailwind animations for micro-interactions
- use Motion (formerly framer-motion) to animate components and create smooth transitions
- prioritize "wow factor" over robustness

Remember: A beautiful, working demo shown in 2 days beats a perfect product delivered never.

### Do

- use React 19 with functional components and hooks
- use TanStack Start (the React Start framework) for routing and server functions
- **CLIENT-ONLY RENDERING**: React components render only on the client - NO SSR or RSC
- server functions (tRPC, API routes) run on the server, but React renders client-side only
- use TanStack Router for navigation with `Link` component
- use TanStack Store for state management with `new Store()` and `useStore()` hook
- use TanStack Query for data fetching and caching
- use Drizzle ORM for database access with PostgreSQL
- use drizzle-zod to auto-generate Zod schemas from Drizzle tables
- use Tailwind CSS v4 for all styling with semantic color variables (e.g., `bg-primary`, `text-foreground`)
- use shadcn/ui components (new-york style) - add via `pnpx shadcn@latest add component-name`
- use `cn()` utility from `@/lib/utils` for className merging - never use template literals in className
- use lucide-react for icons
- use Motion (formerly framer-motion) for component animations and page transitions - install with `pnpm add motion`
- use tRPC for type-safe API routes
- use `@ai-sdk/anthropic` and `@ai-sdk/react` for AI features
- use path aliases with `@/` prefix (e.g., `@/components`, `@/lib/utils`)
- use pnpm as the package manager
- default to small, focused components over large multi-purpose ones
- default to small diffs - avoid large rewrites unless explicitly requested
- preserve existing code style and patterns
- use strict TypeScript with proper typing

### Don't

- do not use template literals in className (ESLint will error) - use `cn()` instead
- do not hard code colors - use Tailwind's semantic variables from `src/styles.css`
- do not use class components - use functional components with hooks
- do not use other state management libraries like Redux, Zustand, or MobX
- do not use npm or yarn - use pnpm
- do not add heavy dependencies without approval
- do not use array index as React keys
- do not create generic `div` wrappers when shadcn/ui components exist
- do not modify files in `src/components/ui/` - these are managed by shadcn CLI
- do not modify `src/routeTree.gen.ts` - it's auto-generated
- do not use inline styles - use Tailwind classes
- **do not render React on the server** - keep React client-only

### Commands

# Type check - file scoped preferred

pnpm exec tsc --noEmit path/to/file.tsx

# Format - file scoped preferred

pnpm exec prettier --write path/to/file.tsx

# Lint - file scoped preferred

pnpm exec eslint --fix path/to/file.tsx

# Full project checks when explicitly requested

pnpm lint:types # type check all files
pnpm lint:eslint # lint all files
pnpm lint:format # check formatting
pnpm lint # run all lints
pnpm build # build for production

# Database commands

pnpm db:generate # generate migration from schema changes
pnpm db:migrate # apply migrations to database
pnpm db:push # push schema directly (no migrations)
pnpm db:studio # open Drizzle Studio GUI

# Dev server

pnpm dev # or pnpm start (starts instantly, no need to wait)

# Docker commands

docker-compose up -d # start postgres database in background
docker-compose down # stop postgres database
docker-compose logs -f postgres # view postgres logs

Note: Always type check, format, and lint updated files. Use full builds sparingly.

### Project structure

- `src/routes/__root.tsx` - root layout with Header and Outlet
- `src/routes/index.tsx` - home page
- `src/routes/` - all routes (file-based routing via TanStack Router)
- `src/components/` - shared components
- `src/components/ui/` - shadcn/ui components (managed by CLI, don't edit directly)
- `src/components/Header.tsx` - main navigation header
- `src/db/` - database layer with Drizzle ORM
- `src/db/schema.ts` - Drizzle table schemas with drizzle-zod integration
- `src/db/client.ts` - database connection and Drizzle instance
- `src/lib/utils.ts` - utility functions including `cn()` for className merging
- `src/store/` - TanStack Store state management
- `src/trpc/` - tRPC setup and router (includes Drizzle examples)
- `src/integrations/` - third-party integrations (TanStack Query, etc.)
- `src/styles.css` - global styles and Tailwind configuration with CSS variables
- `src/data/` - static data and mock data
- `drizzle/` - database migrations (auto-generated)
- `drizzle.config.ts` - Drizzle Kit configuration
- `components.json` - shadcn/ui configuration
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration

### Good examples (copy these patterns)

- `src/components/Header.tsx` - navigation with TanStack Router Link components
- `src/routes/example/chat.tsx` - AI chat interface with streaming
- `src/routes/example/posts/` - dynamic routes with Drizzle ORM + tRPC + shadcn/ui
- `src/routes/example/store.tsx` - TanStack Store with derived state
- `src/lib/demo-store.ts` - TanStack Store usage pattern
- `src/db/schema.ts` - Drizzle schema with drizzle-zod integration
- `src/trpc/router.ts` - tRPC routers with Drizzle ORM examples
- `src/components/ui/button.tsx` - shadcn component with cn() utility

### Routing (TanStack Router)

- file-based routing in `src/routes/`
- create route: add file like `src/routes/about.tsx`
- route files export `Route` via `createFileRoute('/path')`
- nested routes: use folders like `src/routes/example.guitars/$guitarId.tsx`
- navigation: use `<Link to="/path">` from `@tanstack/react-router`
- loaders: use for data prefetching (runs before component renders)
- layouts: `__root.tsx` wraps all routes via `<Outlet />`
- route tree is auto-generated in `src/routeTree.gen.ts`
- **client-only rendering**: all React renders on the client, no SSR
- **ClientOnly component**: wrap browser-only components with `<ClientOnly fallback={...}>` to prevent SSR issues

### Server Routes (TanStack Start)

- server routes handle HTTP requests (API endpoints, authentication, etc.)
- defined in `src/routes/` alongside app routes using `createFileRoute`
- **ALWAYS use `server.handlers` pattern, NOT `createAPIFileRoute`**
- example pattern:
  ```typescript
  export const Route = createFileRoute("/api/chat")({
    server: {
      handlers: {
        POST: async ({ request }) => {
          const body = await request.json();
          return new Response(JSON.stringify({ data }));
        },
      },
    },
  });
  ```
- supports GET, POST, PUT, PATCH, DELETE methods
- can combine with component routes in same file
- use `json()` helper from `@tanstack/react-start` for JSON responses
- access path params via `({ params })` in handler
- server routes follow same file conventions as app routes

### State (TanStack Store)

- create store: `export const myStore = new Store(initialValue)`
- use in component: `const value = useStore(myStore)`
- update state: `myStore.setState(newValue)` or `myStore.setState(prev => newValue)`
- derived state: use `new Derived({ fn: () => ..., deps: [...] })` then `.mount()`
- example: `src/store/example-assistant.ts`

### Styling with Tailwind CSS v4

- use Tailwind utility classes exclusively
- use semantic color variables: `bg-primary`, `text-foreground`, `border-border`, etc.
- all CSS variables defined in `src/styles.css`
- dark mode: automatically handled via `.dark` class and CSS variables
- use `cn()` from `@/lib/utils` to merge classes: `cn("base-class", conditionalClass && "conditional")`
- responsive: use Tailwind breakpoints (`sm:`, `md:`, `lg:`, etc.)
- never use template literals in className - ESLint will error

### shadcn/ui components

- add new components: `pnpx shadcn@latest add component-name`
- components live in `src/components/ui/`
- do not manually edit files in `src/components/ui/`
- re-run add command to update components
- configuration in `components.json`
- style: "new-york", uses lucide-react icons
- all components use `cn()` utility for className handling

### tRPC for API routes

- router defined in `src/trpc/router.ts`
- create procedures with `publicProcedure` from `src/trpc/init.ts`
- use zod for input validation (or drizzle-zod for database operations)
- use in components via `trpc` from route context
- example router: see `guitarRouter` and `postRouter` in `src/trpc/router.ts`
- type safety: types are auto-inferred from router
- **tRPC runs on the server** - only React rendering is client-only

### Drizzle ORM for database

- schema defined in `src/db/schema.ts` using Drizzle table definitions
- use `createInsertSchema` and `createSelectSchema` from `drizzle-zod` to auto-generate Zod schemas
- database client exported from `src/db/client.ts` as `db`
- use Drizzle query builder for type-safe SQL queries
- integrate with tRPC by using drizzle-zod schemas as procedure inputs
- migrations stored in `drizzle/` directory (auto-generated via `pnpm db:generate`)
- example: see `postRouter` in `src/trpc/router.ts` for Drizzle + tRPC + Zod integration
- use `pnpm db:push` for rapid prototyping (pushes schema without migrations)
- use `pnpm db:generate` and `pnpm db:migrate` for proper migration workflow

### AI integration

- uses `@ai-sdk/anthropic` for Claude AI
- uses `@ai-sdk/react` for React hooks like `useChat`
- requires `ANTHROPIC_API_KEY` in `.env`
- example: `src/components/example-AIAssistant.tsx`
- markdown rendering: use `streamdown` component for streaming markdown

### TypeScript

- strict mode enabled with path aliases `@/*` mapping to `src/*`
- prefer explicit types over `any`, use `type` for objects, `interface` for extensible definitions
- avoid `ts-ignore` without good reason

### When stuck

- ask a clarifying question rather than making assumptions
- propose a plan for complex changes before implementing
- if uncertain about an API or pattern, look for similar examples in the codebase
- do not push speculative changes without confirmation

### Demo files

- files prefixed with `demo` or `example` can be safely deleted if not needed
- they exist to demonstrate features and patterns
- good references for learning project patterns
- `src/routes/example/` directory contains example routes showcasing various features
- `src/db/schema.ts` contains an example `posts` table - replace with your own schema
