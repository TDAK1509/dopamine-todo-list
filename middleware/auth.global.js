import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async to => {
  // Skip middleware on server
  if (import.meta.server) return;

  const { isAuthenticated, initAuth } = useAuth();

  // Protected routes that require authentication
  const protectedRoutes = ["/app"];

  // Initialize auth if needed
  await initAuth();

  // Handle direct access to a protected route when not authenticated
  if (!isAuthenticated.value && protectedRoutes.includes(to.path)) {
    console.log("Not authenticated, redirecting to login");
    return navigateTo("/login");
  }

  // Authenticated and trying to access login page
  if (isAuthenticated.value && to.path === "/login") {
    console.log("Already authenticated, redirecting to app");
    return navigateTo("/app");
  }
});
