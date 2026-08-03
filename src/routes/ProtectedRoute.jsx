import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ROLES } from "../constants/routes";

export function ProtectedRoute({ children, roles }) {
  const { user, isLoading, restoreError } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  // Do not redirect to login merely because a slow/offline bootstrap request
  // failed. That is not proof that the user signed out.
  if (restoreError && !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-sm text-surface-600">We could not restore your session. Check your connection and retry.</p>
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white" onClick={() => window.location.reload()}>
          Retry
        </button>
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
