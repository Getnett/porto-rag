import { RouterProvider } from '@tanstack/react-router'

import { appRouter, type AppRouter } from './router'

type AppProps = {
  router?: AppRouter
}

function App({ router = appRouter }: AppProps) {
  return <RouterProvider router={router} />
}

export default App
