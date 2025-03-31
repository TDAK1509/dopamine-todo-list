<template>
  <div class="container">
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
</script>

<style scoped>
.page-header {
  margin: 2rem 0;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: bold;
}
</style>
