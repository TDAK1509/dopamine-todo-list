<template>
  <div class="app-container">
    <header class="app-header">
      <div class="container">
        <div class="header-content">
          <h1 class="header-title">Dopamine Todo List</h1>
          <div v-if="isAuthenticated" class="auth-status">
            <span class="auth-status-text">Signed in</span>
          </div>
        </div>
      </div>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useAuth } from "~/composables/useAuth";

const { isAuthenticated } = useAuth();
</script>

<style scoped>
.app-container {
  min-height: 100vh;
}

.app-header {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.auth-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.auth-status-text {
  font-size: 0.875rem;
}
</style>
