import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "sonner";
import { Skeleton } from "./components/ui/Skeleton";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProfileLayout from "./layouts/ProfileLayout";
import RootLayout from "./layouts/RootLayout";
import { ProtectedRoute, PublicRoute } from "./routes/ProtectedRoute";
import { ROLES } from "./constants/routes";

const LoginPage = lazy(() => import("./features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("./features/auth/pages/RegisterPage"));
const VerifyEmailPage = lazy(() => import("./features/auth/pages/VerifyEmailPage"));
const ForgotPasswordPage = lazy(() => import("./features/auth/pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./features/auth/pages/ResetPasswordPage"));
const DashboardPage = lazy(() => import("./features/dashboard/pages/DashboardPage"));
const PollsPage = lazy(() => import("./features/polls/pages/PollsPage"));
const CreatePollPage = lazy(() => import("./features/polls/pages/CreatePollPage"));
const EditPollPage = lazy(() => import("./features/polls/pages/EditPollPage"));
const PollDetailPage = lazy(() => import("./features/polls/pages/PollDetailPage"));
const SearchPage = lazy(() => import("./features/search/pages/SearchPage"));
const AdminPage = lazy(() => import("./features/admin/pages/AdminPage"));
const ProfileActivityPage = lazy(() => import("./features/user/pages/ProfileActivityPage"));
const ProfilePollsPage = lazy(() => import("./features/user/pages/ProfilePollsPage"));
const SettingsPage = lazy(() => import("./features/user/pages/SettingsPage"));
const BookmarksPage = lazy(() => import("./features/bookmarks/pages/BookmarksPage"));
const NotificationsPage = lazy(() => import("./features/notifications/pages/NotificationsPage"));
const AnalyticsPage = lazy(() => import("./features/analytics/pages/AnalyticsPage"));
const ReportsPage = lazy(() => import("./features/reports/pages/ReportsPage"));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20V10" />
            <path d="M18 20V4" />
            <path d="M6 20v-4" />
          </svg>
        </div>
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

function AppRoutes() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={
        <PublicRoute>
          <AuthLayout>
            <Suspense fallback={<LoadingFallback />}>
              <LoginPage />
            </Suspense>
          </AuthLayout>
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <AuthLayout>
            <Suspense fallback={<LoadingFallback />}>
              <RegisterPage />
            </Suspense>
          </AuthLayout>
        </PublicRoute>
      } />
      <Route path="/verify-email" element={
        <PublicRoute>
          <AuthLayout>
            <Suspense fallback={<LoadingFallback />}>
              <VerifyEmailPage />
            </Suspense>
          </AuthLayout>
        </PublicRoute>
      } />
      <Route path="/forgot-password" element={
        <PublicRoute>
          <AuthLayout>
            <Suspense fallback={<LoadingFallback />}>
              <ForgotPasswordPage />
            </Suspense>
          </AuthLayout>
        </PublicRoute>
      } />
      <Route path="/reset-password" element={
        <PublicRoute>
          <AuthLayout>
            <Suspense fallback={<LoadingFallback />}>
              <ResetPasswordPage />
            </Suspense>
          </AuthLayout>
        </PublicRoute>
      } />

      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={
          <Suspense fallback={<LoadingFallback />}>
            <DashboardPage />
          </Suspense>
        } />
        <Route path="polls" element={
          <Suspense fallback={<LoadingFallback />}>
            <PollsPage />
          </Suspense>
        } />
        <Route path="polls/create" element={
          <Suspense fallback={<LoadingFallback />}>
            <CreatePollPage />
          </Suspense>
        } />
        <Route path="polls/:id" element={
          <Suspense fallback={<LoadingFallback />}>
            <PollDetailPage />
          </Suspense>
        } />
        <Route path="polls/:id/edit" element={
          <Suspense fallback={<LoadingFallback />}>
            <EditPollPage />
          </Suspense>
        } />
        <Route path="search" element={
          <Suspense fallback={<LoadingFallback />}>
            <SearchPage />
          </Suspense>
        } />
        <Route path="analytics" element={
          <Suspense fallback={<LoadingFallback />}>
            <AnalyticsPage />
          </Suspense>
        } />
        <Route path="bookmarks" element={
          <Suspense fallback={<LoadingFallback />}>
            <BookmarksPage />
          </Suspense>
        } />
        <Route path="notifications" element={
          <Suspense fallback={<LoadingFallback />}>
            <NotificationsPage />
          </Suspense>
        } />
        <Route path="reports" element={
          <Suspense fallback={<LoadingFallback />}>
            <ReportsPage />
          </Suspense>
        } />
      </Route>

      {/* Profile routes */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfileLayout />
        </ProtectedRoute>
      }>
        <Route index element={
          <Suspense fallback={<LoadingFallback />}>
            <ProfileActivityPage />
          </Suspense>
        } />
        <Route path="activity" element={
          <Suspense fallback={<LoadingFallback />}>
            <ProfileActivityPage />
          </Suspense>
        } />
        <Route path="polls" element={
          <Suspense fallback={<LoadingFallback />}>
            <ProfilePollsPage />
          </Suspense>
        } />
        <Route path="bookmarks" element={
          <Suspense fallback={<LoadingFallback />}>
            <BookmarksPage />
          </Suspense>
        } />
        <Route path="settings" element={
          <Suspense fallback={<LoadingFallback />}>
            <SettingsPage />
          </Suspense>
        } />
      </Route>
      <Route path="/profile/:username" element={
        <ProtectedRoute>
          <ProfileLayout />
        </ProtectedRoute>
      }>
        <Route index element={
          <Suspense fallback={<LoadingFallback />}>
            <ProfileActivityPage />
          </Suspense>
        } />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminPage />
          </Suspense>
        } />
        <Route path="users" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminPage />
          </Suspense>
        } />
        <Route path="polls" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminPage />
          </Suspense>
        } />
        <Route path="reports" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminPage />
          </Suspense>
        } />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RootLayout>
          <Suspense fallback={<LoadingFallback />}>
            <AppRoutes />
          </Suspense>
        </RootLayout>
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              error: "bg-danger-500 text-white",
              success: "bg-success-500 text-white",
              warning: "bg-warning-500 text-white",
              info: "bg-brand-500 text-white",
            },
            duration: 4000,
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
