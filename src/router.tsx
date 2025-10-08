import { createRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import * as TanstackQuery from "./trpc/provider";

// Create a new router instance
export function getRouter() {
  const router = routerWithQueryClient(
    createRouter({
      routeTree,
      context: {
        ...TanstackQuery.getContext(),
      },
      scrollRestoration: true,
      defaultPreloadStaleTime: 0,
      Wrap: (props: { children: React.ReactNode }) => {
        return (
          <TanstackQuery.Provider>{props.children}</TanstackQuery.Provider>
        );
      },
    }),
    TanstackQuery.getContext().queryClient,
  );

  return router;
}

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
