import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Protected({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500">Duke ngarkuar...</div>
    );
  }

  if (!user) {
    return <Navigate to={adminOnly ? "/admin/login" : "/"} replace />;
  }
  if (adminOnly && user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
