export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/login/register",
  FORGOT_PASSWORD: "/login/forgot-password",
  RESET_PASSWORD: "/login/reset-password/:token",
  VERIFY_EMAIL: "/login/verify-email",
  DASHBOARD: "/dashboard",
  POLLS: "/polls",
  CREATE_POLL: "/polls/create",
  POLL_DETAIL: "/polls/:id",
  EDIT_POLL: "/polls/:id/edit",
  SEARCH: "/search",
  NOTIFICATIONS: "/notifications",
  BOOKMARKS: "/bookmarks",
  PROFILE: "/profile",
  SETTINGS: "/profile/settings",
  REPORTS: "/reports",
  ADMIN: "/admin",
};

export const ROLES = {
  USER: "user",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
  MODERATOR: "moderator",
};
