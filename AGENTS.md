# AGENTS.md

## Philosophy

This is a demo/prototype project, NOT production software.

Build for impact, not perfection:

- Prioritize visual polish and wow factor
- Focus on happy path only
- Skip edge cases unless they break the demo
- A beautiful demo in 2 days beats a perfect product never

## Working Guidelines

- Use pnpm (not npm or yarn)
- Prefer small diffs over large rewrites
- Preserve existing code style and patterns
- Use `cn()` from `@/lib/utils` for className merging
- Client-only rendering - no SSR or server-side React

Do not modify:

- `src/components/ui/` - managed by shadcn CLI
- `src/routeTree.gen.ts` - auto-generated

## Commands

```bash
pnpm dev                              # start dev server
pnpm db:push                          # push schema to database (dev)
pnpm lint:eslint path/to/file.tsx     # lint a file
pnpm format:prettier path/to/file.tsx # format a file
pnpm lint:types path/to/file.tsx      # type check a file
```

## Database Workflow

**Local development:** Use `pnpm db:push` to sync schema changes directly.

**Before deploying:** Run `pnpm db:generate` to create migration files, commit them, then `pnpm db:migrate` in production.

## Do / Do Not

Do:

- Use functional components with hooks
- Use TanStack Store for state (`new Store()`, `useStore()`)
- Use server functions in `src/server/` with `createServerFn`
- Use drizzle-zod to generate Zod schemas from Drizzle tables
- Use Motion for animations

Do not:

- Use Redux, Zustand, or other state libraries
- Use array index as React keys
- Add heavy dependencies without approval
- Use inline styles instead of Tailwind

## Finding Patterns

See README.md for:

- Project structure
- Full command reference
- Code patterns (routing, server functions, state, AI)

See `src/routes/example/` for working reference implementations.
