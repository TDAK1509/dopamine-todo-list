<template>
  <div class="app-container">
    <header class="app-header">
      <div class="container">
        <h1 class="header-title">Dopamine Todo List</h1>
      </div>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
}

.app-header {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem;
}

.header-title {
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
