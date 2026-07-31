import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import RootLayout from "../../layouts/RootLayout";
import AuthLayout from "../../layouts/AuthLayout";
import DashboardLayout from "../../layouts/DashboardLayout";
import AdminLayout from "../../layouts/AdminLayout";
import ProfileLayout from "../../layouts/ProfileLayout";
import LoadingOverlay from "../../components/feedback/LoadingOverlay";
import NotFound from "../../components/feedback/NotFound";
import ErrorBoundary from "../../components/feedback/ErrorBoundary";
import { ProtectedRoute, PublicRoute } from "../../routes/ProtectedRoute";

const LoginPage = React.lazy(() => import("../../features/auth/pages/LoginPage"));
const RegisterPage = React.lazy(() => import("../../features/auth/pages/RegisterPage"));
const ForgotPasswordPage = React.lazy(() => import("../../features/auth/pages/ForgotPasswordPage"));
const ResetPasswordPage = React.lazy(() => import("../../features/auth/pages/ResetPasswordPage"));
const VerifyEmailPage = React.lazy(() => import("../../features/auth/pages/VerifyEmailPage"));
const DashboardPage = React.lazy(() => import("../../features/dashboard/pages/DashboardPage"));
const PollsPage = React.lazy(() => import("../../features/polls/pages/PollsPage"));
const PollDetailPage = React.lazy(() => import("../../features/polls/pages/PollDetailPage"));
const CreatePollPage = React.lazy(() => import("../../features/polls/pages/CreatePollPage"));
const EditPollPage = React.lazy(() => import("../../features/polls/pages/EditPollPage"));
const SearchPage = React.lazy(() => import("../../features/search/pages/SearchPage"));
const NotificationsPage = React.lazy(() => import("../../features/notifications/pages/NotificationsPage"));
const BookmarksPage = React.lazy(() => import("../../features/bookmarks/pages/BookmarksPage"));
const ProfilePage = React.lazy(() => import("../../features/user/pages/ProfilePage"));
const AdminPage = React.lazy(() => import("../../features/admin/pages/AdminPage"));
const ReportsPage = React.lazy(() => import("../../features/reports/pages/ReportsPage"));
const SettingsPage = React.lazy(() => import("../../features/settings/pages/SettingsPage"));

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingOverlay />}>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route element={<PublicRoute />}>
              <Route element={<AuthLayout />}>
                <Route index element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="verify-email" element={<VerifyEmailPage />} />
              </Route>
            </Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/polls" element={<PollsPage />} />
              <Route path="/polls/create" element={<CreatePollPage />} />
              <Route path="/polls/:id" element={<PollDetailPage />} />
              <Route path="/polls/:id/edit" element={<EditPollPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/profile" element={<ProfileLayout />}>
                <Route index element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              <Route path="/reports" element={<ReportsPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={["admin", "super_admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
