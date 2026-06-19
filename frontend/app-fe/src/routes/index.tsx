import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "./root";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: ({ context }) => {
    const {
      auth: { session, initializing },
    } = context;
    if (initializing) return;
    if (session) {
      throw redirect({
        to: "/overview",
      });
    } else {
      throw redirect({
        to: "/login",
      });
    }
  },
});
