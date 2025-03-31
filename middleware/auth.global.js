import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(to => {
  // Skip middleware on server
  if (import.meta.server) return;

  const { isAuthenticated, isLoading } = useAuth();

  // Publicly accessible routes
  const publicRoutes = ["/login"];

  // Wait until auth is initialized
  if (isLoading.value) return;

  // Not authenticated and trying to access protected route
  if (!isAuthenticated.value && !publicRoutes.includes(to.path)) {
    return navigateTo("/login");
  }

  // Authenticated and trying to access login page
  if (isAuthenticated.value && to.path === "/login") {
    return navigateTo("/app");
  }
});
