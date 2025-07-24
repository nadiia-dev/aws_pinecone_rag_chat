import { useAuthStore } from "@/store/auth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { email } = useAuthStore();

  if (!email) return <Navigate to="/" />;

  return <>{children}</>;
};

export default ProtectedRoute;
