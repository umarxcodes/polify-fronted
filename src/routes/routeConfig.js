import { ROUTES } from "../../constants/routes";

export const routeConfig = [
  { path: ROUTES.DASHBOARD, label: "Dashboard", icon: "LayoutDashboard" },
  { path: ROUTES.POLLS, label: "Polls", icon: "BarChart3" },
  { path: ROUTES.CREATE_POLL, label: "Create Poll", icon: "Plus" },
  { path: ROUTES.SEARCH, label: "Search", icon: "Search" },
  { path: ROUTES.NOTIFICATIONS, label: "Notifications", icon: "Bell" },
  { path: ROUTES.BOOKMARKS, label: "Bookmarks", icon: "Bookmark" },
  { path: ROUTES.PROFILE, label: "Profile", icon: "User" },
  { path: ROUTES.REPORTS, label: "Reports", icon: "Flag" },
  { path: ROUTES.ADMIN, label: "Admin", icon: "Shield", roles: ["admin", "super_admin"] },
];
