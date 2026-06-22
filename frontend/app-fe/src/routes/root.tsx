import type { Session } from "@supabase/supabase-js";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

interface RootRouteContext {
  auth: {
    session: Session | null;
    initializing: boolean;
  };
}

export const rootRoute = createRootRouteWithContext<RootRouteContext>()({
  component: () => <Outlet />,
  notFoundComponent: () => <div>404 - Page Not Found</div>,
});
