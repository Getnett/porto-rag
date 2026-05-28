import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import { AppShell } from "@/components/layout/AppShell";
import { ComingSoonPage } from "@/pages/ComingSoonPage";
import Ingestion from "@/pages/Ingestion";

const rootRoute = createRootRoute({
  component: AppShell,
});

const overviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ComingSoonPage,
});

const ingestionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ingestion",
  component: Ingestion,
});

const knowledgeBaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/knowledge-base",
  component: ComingSoonPage,
});

const conversationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/conversations",
  component: ComingSoonPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: ComingSoonPage,
});

const routeTree = rootRoute.addChildren([
  overviewRoute,
  ingestionRoute,
  knowledgeBaseRoute,
  conversationsRoute,
  settingsRoute,
]);

export function createAppRouter() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
  });
}

export const appRouter = createAppRouter();

export type AppRouter = typeof appRouter;

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof appRouter;
  }
}
