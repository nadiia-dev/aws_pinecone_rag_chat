import { useAuthStore } from "@/store/auth";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { email } = useAuthStore();

  if (email) return <Navigate to="/chat" />;

  return <>{children}</>;
};

export default PublicRoute;
