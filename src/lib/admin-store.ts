import { Store } from "@tanstack/store";

interface AdminState {
  isAuthenticated: boolean;
  user: {
    email: string;
    name: string;
  } | null;
}

export const adminStore = new Store<AdminState>({
  isAuthenticated: false,
  user: null,
});

export function login(email: string) {
  // Mock login - accept any email
  const name = email
    .split("@")[0]
    .replaceAll(/[._]/g, " ")
    .split(" ")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(" ");

  adminStore.setState((state) => ({
    ...state,
    isAuthenticated: true,
    user: { email, name },
  }));
}

export function logout() {
  adminStore.setState((state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }));
}
