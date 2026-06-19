import { createRoute, createRouter, redirect } from "@tanstack/react-router";
import { AuthPage } from "@/pages/AuthPage";
import { ComingSoonPage } from "@/pages/ComingSoonPage";
import Ingestion from "@/pages/Ingestion";
import { rootRoute } from "./routes/root";
import { authenticatedLayoutRoute } from "./routes/protected";
import { indexRoute } from "./routes";

const unauthenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: AuthPage,
  path: "/login",
  beforeLoad: ({ context }) => {
    const {
      auth: { session, initializing },
    } = context;
    if (initializing) return;
    if (session) {
      throw redirect({ to: "/overview" });
    }
  },
});

const overviewRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: "/overview",
  component: ComingSoonPage,
});

const ingestionRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: "/ingestion",
  component: Ingestion,
});

const knowledgeBaseRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: "/knowledge-base",
  component: ComingSoonPage,
});

const conversationsRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: "/conversations",
  component: ComingSoonPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => authenticatedLayoutRoute,
  path: "/settings",
  component: ComingSoonPage,
});

const authenticateRoutes = authenticatedLayoutRoute.addChildren([
  overviewRoute,
  ingestionRoute,
  knowledgeBaseRoute,
  conversationsRoute,
  settingsRoute,
]);

const routeTree = rootRoute.addChildren([
  indexRoute,
  unauthenticatedRoute,
  authenticateRoutes,
]);

export function createAppRouter() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    context: {
      auth: {
        session: null,
        initializing: true,
      },
    },
  });
}

export const appRouter = createAppRouter();

export type AppRouter = typeof appRouter;

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof appRouter;
  }
}
