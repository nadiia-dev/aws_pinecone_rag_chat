import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./components/pages/Auth";
import Chat from "./components/pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { Toaster } from "sonner";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
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
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
