<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Todo List App</h1>
      <p class="login-subtitle">Sign in to manage your todos</p>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button
        @click="handleGoogleSignIn"
        class="google-signin-btn"
        :disabled="isLoading"
      >
        <span v-if="isLoading">Loading...</span>
        <span v-else>Sign in with Google</span>
      </button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "default",
});

const { signInWithGoogle, isLoading, error } = useAuth();
const router = useRouter();

async function handleGoogleSignIn() {
  const success = await signInWithGoogle();
  if (success) {
    router.push("/app");
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.login-card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-title {
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.login-subtitle {
  color: #666;
  margin-bottom: 2rem;
}

.google-signin-btn {
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s;
}

.google-signin-btn:hover {
  background-color: #f8f8f8;
}

.google-signin-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 0.75rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
}
</style>
