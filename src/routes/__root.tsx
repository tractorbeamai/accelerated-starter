/// <reference types="vite/client" />

import { ReactNode } from "react";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";

import appCss from "@/styles.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Taurean Talent Network" },
      { name: "description", content: "Private Equity Performance Architects" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Add dark class to html for Taurean dark-only theme
  // No header needed - each page handles its own layout
  const isDarkRoute =
    pathname.startsWith("/join") || pathname.startsWith("/admin");

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className={isDarkRoute ? "min-h-screen" : ""}>
        {children}
        <Analytics />
        <Scripts />
      </body>
    </html>
  );
}
