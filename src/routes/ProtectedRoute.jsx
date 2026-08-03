import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ROLES } from "../constants/routes";

export function ProtectedRoute({ children, roles }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.some((role) => user.role === role || (role === "admin" && (user.role === "admin" || user.role === "super_admin")))) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export function PublicRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export function AdminRoute({ children }) {
  return <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>{children}</ProtectedRoute>;
}
