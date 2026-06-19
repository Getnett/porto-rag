import { RouterProvider } from "@tanstack/react-router";
import { appRouter, type AppRouter } from "./router";
import useAuthSessionStateChange from "./hooks/useAuthSessionStateChange";
import { useEffect } from "react";

type AppProps = {
  router?: AppRouter;
};

function App({ router = appRouter }: AppProps) {
  const { session, initializing } = useAuthSessionStateChange();
  useEffect(() => {
    router.invalidate();
  }, [session]);
  if (initializing)
    return <div className="flex justify-center">Checking your session...</div>;
  return (
    <RouterProvider
      router={router}
      context={{ auth: { session, initializing } }}
    />
  );
}

export default App;
