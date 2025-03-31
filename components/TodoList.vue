<template>
  <div>
    <div class="create-group-section">
      <h2 class="section-title">Create Todo Category</h2>
      <div class="input-group">
        <input
          v-model="newGroupTitle"
          type="text"
          placeholder="Enter category title"
          class="w-full"
          @keyup.enter="addGroup"
        />
        <button @click="addGroup" class="primary-button">Create</button>
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
          Remove Category
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
import { ref, watch } from "vue";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { useAuth } from "~/composables/useAuth";
import { useNuxtApp } from "nuxt/app";

// Get Firestore from plugin
const { $firestore } = useNuxtApp();

// Todo categories with title and todos
const todoGroups = ref([]);
const newGroupTitle = ref("");
const newTodos = ref({});

// Get authentication state
const { user } = useAuth();

// Load todos when user authenticated
watch(
  () => user.value?.uid,
  async (newUserId, oldUserId) => {
    if (newUserId && newUserId !== oldUserId) {
      loadUserTodos(newUserId);
    }
  },
  { immediate: true }
);

// Save todos when they change
watch(
  todoGroups,
  async newTodos => {
    if (user.value?.uid) {
      await saveTodos(user.value.uid, newTodos);
    }
  },
  { deep: true }
);

// Load user's todos from Firestore
async function loadUserTodos(userId) {
  try {
    // Set up real-time listener for todo changes
    const userDocRef = doc($firestore, "todos", userId);
    onSnapshot(userDocRef, snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        todoGroups.value = data.groups || [];

        // Initialize newTodos ref for each category
        todoGroups.value.forEach((_, index) => {
          newTodos.value[index] = "";
        });
      } else {
        // No todos exist yet, start with empty array
        todoGroups.value = [];
      }
    });
  } catch (error) {
    console.error("Error loading todos:", error);
  }
}

// Save todos to Firestore
async function saveTodos(userId, groups) {
  try {
    const userDocRef = doc($firestore, "todos", userId);
    await setDoc(userDocRef, { groups }, { merge: true });
  } catch (error) {
    console.error("Error saving todos:", error);
  }
}

// Add a new category
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

// Remove a category
function removeGroup(groupIndex) {
  todoGroups.value.splice(groupIndex, 1);
}

// Add a new todo to a category
function addTodo(groupIndex) {
  const todoText = newTodos.value[groupIndex]?.trim();
  if (todoText) {
    todoGroups.value[groupIndex].todos.push({
      id: Date.now(), // Unique ID for draggable
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

// Remove a todo from a category
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
