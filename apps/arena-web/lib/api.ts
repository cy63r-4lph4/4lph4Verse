import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
export const api = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor — attach JWT from localStorage ──────────────────────
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("arena_token") : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor — auto-logout on 401 Unauthorized ──────────────────
// If the backend rejects a request as unauthenticated (expired / invalid token)
// we clear the stored credentials and redirect to /login so the user is never
// left staring at a blank screen or an infinite loading state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error?.response?.status === 401
    ) {
      // Clear all stored auth state
      localStorage.removeItem("arena_token");
      localStorage.removeItem("arena_user");

      // Redirect to login, preserving the current path so the user can return
      // after re-authenticating.
      const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/login?returnTo=${returnTo}`;
    }
    return Promise.reject(error);
  }
);