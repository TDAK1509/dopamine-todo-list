<template>
  <div>
    <div class="create-group-section">
      <h2 class="section-title">Create Todo Group</h2>
      <div class="input-group">
        <input
          v-model="newGroupTitle"
          type="text"
          placeholder="Enter group title"
          class="w-full"
        />
        <button @click="addGroup" class="primary-button">Add Group</button>
      </div>
    </div>

    <div
      v-for="(group, groupIndex) in todoGroups"
      :key="groupIndex"
      class="todo-group"
    >
      <div class="group-header">
        <h2 class="group-title">{{ group.title }}</h2>
        <button @click="removeGroup(groupIndex)" class="text-danger">
          Remove Group
        </button>
      </div>

      <div class="add-todo-section">
        <div class="input-group">
          <input
            v-model="newTodos[groupIndex]"
            type="text"
            placeholder="Add a new todo"
            class="w-full"
            @keyup.enter="addTodo(groupIndex)"
          />
          <button @click="addTodo(groupIndex)" class="success-button">
            Add
          </button>
        </div>
      </div>

      <ul class="todo-list">
        <li
          v-for="(todo, todoIndex) in group.todos"
          :key="todoIndex"
          class="todo-item"
        >
          <div class="todo-content">
            <input
              type="checkbox"
              :checked="todo.completed"
              @change="toggleTodo(groupIndex, todoIndex)"
            />
            <span :class="{ 'line-through': todo.completed }">
              {{ todo.text }}
            </span>
          </div>
          <button
            @click="removeTodo(groupIndex, todoIndex)"
            class="text-danger"
          >
            Delete
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Todo groups with title and todos
const todoGroups = ref([]);
const newGroupTitle = ref("");
const newTodos = ref({});

// Add a new todo group
function addGroup() {
  if (newGroupTitle.value.trim()) {
    todoGroups.value.push({
      title: newGroupTitle.value,
      todos: [],
    });
    newTodos.value[todoGroups.value.length - 1] = "";
    newGroupTitle.value = "";
  }
}

// Remove a todo group
function removeGroup(groupIndex) {
  todoGroups.value.splice(groupIndex, 1);
}

// Add a new todo to a group
function addTodo(groupIndex) {
  const todoText = newTodos.value[groupIndex]?.trim();
  if (todoText) {
    todoGroups.value[groupIndex].todos.push({
      text: todoText,
      completed: false,
    });
    newTodos.value[groupIndex] = "";
  }
}

// Toggle todo completion status
function toggleTodo(groupIndex, todoIndex) {
  const todo = todoGroups.value[groupIndex].todos[todoIndex];
  todo.completed = !todo.completed;
}

// Remove a todo from a group
function removeTodo(groupIndex, todoIndex) {
  todoGroups.value[groupIndex].todos.splice(todoIndex, 1);
}
</script>

<style scoped>
.create-group-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.todo-group {
  margin-bottom: 2rem;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.group-title {
  font-size: 1.5rem;
  font-weight: 700;
}

.add-todo-section {
  margin-bottom: 1rem;
}

.todo-list {
  list-style: none;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #f3f4f6;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
