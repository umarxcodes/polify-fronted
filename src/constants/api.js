/**
 * Development always uses Vite's same-origin proxy. This prevents a local
 * `.env` value from bypassing the proxy and causing a browser CORS failure.
 */
export const API_BASE_URL = import.meta.env.DEV
  ? "/api/v1"
  : (import.meta.env.VITE_API_BASE_URL || "https://polling-backend-three.vercel.app/api/v1");
