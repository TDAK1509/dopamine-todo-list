import { ref, onMounted, computed } from "vue";
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";

export function useAuth() {
  const { $auth, $googleProvider } = useNuxtApp();
  const user = ref(null);
  const isLoading = ref(true);
  const error = ref(null);

  // Set up auth state listener
  onMounted(() => {
    onAuthStateChanged($auth, currentUser => {
      user.value = currentUser;
      isLoading.value = false;
    });
  });

  // Sign in with Google
  const signInWithGoogle = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      await signInWithPopup($auth, $googleProvider);
      return true;
    } catch (e) {
      console.error("Authentication error:", e);
      error.value = e.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Sign out
  const signOut = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      await firebaseSignOut($auth);
      return true;
    } catch (e) {
      console.error("Sign out error:", e);
      error.value = e.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    user,
    isLoading,
    error,
    signInWithGoogle,
    signOut,
    isAuthenticated: computed(() => !!user.value),
  };
}
