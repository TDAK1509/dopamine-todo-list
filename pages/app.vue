<template>
  <div class="container">
    <div class="user-info">
      <template v-if="user">
        <div class="user-profile">
          <img
            v-if="user.photoURL"
            :src="user.photoURL"
            alt="Profile"
            class="profile-image"
          />
          <div class="user-details">
            <p class="user-name">{{ user.displayName }}</p>
            <p class="user-email">{{ user.email }}</p>
          </div>
        </div>
        <button @click="handleSignOut" class="sign-out-btn">Sign Out</button>
      </template>
    </div>

    <div class="page-header">
      <h1>Todo List</h1>
    </div>

    <TodoList />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "default",
});

const { user, signOut } = useAuth();
const router = useRouter();

async function handleSignOut() {
  const success = await signOut();
  if (success) {
    router.push("/login");
  }
}
</script>

<style scoped>
.page-header {
  margin: 2rem 0;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: bold;
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.user-email {
  font-size: 0.875rem;
  color: #666;
}

.sign-out-btn {
  background-color: transparent;
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sign-out-btn:hover {
  background-color: var(--danger-color);
  color: white;
}
</style>
