import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./components/pages/Auth";
import Chat from "./components/pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Error from "./components/pages/Error";

function App() {
  const queryClient = new QueryClient();
  const router = createBrowserRouter([
    {
      path: "/",
      id: "root",
      errorElement: <Error />,
      element: (
        <PublicRoute>
          <Auth />
        </PublicRoute>
      ),
    },
    {
      path: "/chat",
      element: (
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      ),
    },
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
