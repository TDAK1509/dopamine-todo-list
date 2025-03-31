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
  const authInitialized = ref(false);

  // Function to ensure auth is initialized
  const initAuth = () => {
    return new Promise(resolve => {
      if (authInitialized.value) {
        resolve(user.value);
        return;
      }

      const unsubscribe = onAuthStateChanged($auth, currentUser => {
        user.value = currentUser;
        isLoading.value = false;
        authInitialized.value = true;
        unsubscribe();
        resolve(currentUser);
      });
    });
  };

  // Set up auth state listener
  onMounted(() => {
    if (!authInitialized.value) {
      onAuthStateChanged($auth, currentUser => {
        user.value = currentUser;
        isLoading.value = false;
        authInitialized.value = true;
      });
    }
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
    initAuth,
    isAuthenticated: computed(() => !!user.value),
  };
}
