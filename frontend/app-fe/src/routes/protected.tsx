import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { AppShell } from "@/components/layout/AppShell";

export const authenticatedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "authenticated", // id required when no path is specified
  beforeLoad: ({ context }) => {
    const {
      auth: { session, initializing },
    } = context;
    if (initializing) return;
    if (!session) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: () => <AppShell />,
});
