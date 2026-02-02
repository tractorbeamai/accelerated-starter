"use client";

import { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { Kanban, LayoutDashboard, LogOut, Settings, Users } from "lucide-react";

import { TaureanLogo } from "@/components/taurean/logo";
import { adminStore, logout } from "@/lib/admin-store";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Candidates",
    href: "/admin/dashboard",
    icon: Users,
  },
  {
    label: "Pipeline",
    href: "/admin/pipeline",
    icon: Kanban,
  },
  {
    label: "Settings",
    href: "#",
    icon: Settings,
    disabled: true,
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useStore(adminStore, (s) => s.user);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-white/5 bg-sidebar">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-white/5 px-6">
          <TaureanLogo />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            if (item.disabled) {
              return (
                <div
                  key={item.label}
                  className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground/50"
                >
                  <Icon className="size-5" />
                  {item.label}
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-white"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-white",
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-accent/20 text-accent">
              <span className="text-sm font-medium">
                {user?.name?.charAt(0) ?? "U"}
              </span>
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium text-white">
                {user?.name ?? "User"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email ?? "user@taurean.com"}
              </p>
            </div>
            <button
              onClick={logout}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
              title="Logout"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 pl-60">
        <div className="min-h-screen p-8">{children}</div>
      </main>
    </div>
  );
}
