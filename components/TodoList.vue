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

      <ul
        class="todo-list"
        @dragover="onDragOver($event, groupIndex)"
        @drop="onDrop($event, groupIndex)"
      >
        <li
          v-for="(todo, todoIndex) in group.todos"
          :key="todo.id || todoIndex"
          class="todo-item"
          draggable="true"
          @dragstart="onDragStart($event, { groupIndex, todoIndex })"
          @dragend="onDragEnd"
        >
          <div class="todo-content">
            <span class="drag-handle">☰</span>
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
const dragItem = ref(null);

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
      try {
        await saveTodos(user.value.uid, newTodos);
      } catch (error) {
        console.error("Error saving todos:", error);
        // Could add a notification here for failed sync
      }
    }
  },
  { deep: true }
);

// Drag and drop functions
function onDragStart(event, item) {
  dragItem.value = item;
  event.dataTransfer.effectAllowed = "move";

  // Store the dragged element data
  const todoData = JSON.stringify(
    todoGroups.value[item.groupIndex].todos[item.todoIndex]
  );
  event.dataTransfer.setData("text/plain", todoData);

  // Add a class to the dragged element
  event.target.classList.add("dragging");
}

function onDragEnd(event) {
  // Remove the dragging class
  event.target.classList.remove("dragging");

  // Clear any drop indicators
  document
    .querySelectorAll(".drop-target")
    .forEach(el => el.classList.remove("drop-target"));
  document.querySelectorAll(".drop-indicator").forEach(el => el.remove());
}

function onDragOver(event, _targetGroupIndex) {
  event.preventDefault();

  // Add a class to the target list to indicate it's a valid drop zone
  const list = event.currentTarget;
  list.classList.add("drop-target");

  // Find position where item would be dropped
  const items = Array.from(list.querySelectorAll(".todo-item:not(.dragging)"));

  // Remove any existing indicators
  document.querySelectorAll(".drop-indicator").forEach(el => el.remove());

  const dropIndicator = document.createElement("div");
  dropIndicator.className = "drop-indicator";

  if (items.length === 0) {
    // If list is empty, just add indicator to the list
    list.appendChild(dropIndicator);
    return;
  }

  // Get mouse position
  const mouseY = event.clientY;

  // Find where to place the indicator
  let closestItem = null;
  let closestDistance = Infinity;
  let position = "before"; // 'before' or 'after'

  items.forEach(item => {
    const rect = item.getBoundingClientRect();
    const itemMiddle = rect.top + rect.height / 2;

    // Check distance to middle of item
    const distance = Math.abs(mouseY - itemMiddle);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestItem = item;
      position = mouseY < itemMiddle ? "before" : "after";
    }
  });

  if (closestItem) {
    if (position === "before") {
      // Insert before the closest item
      list.insertBefore(dropIndicator, closestItem);
    } else {
      // Insert after the closest item
      const nextSibling = closestItem.nextElementSibling;
      if (nextSibling) {
        list.insertBefore(dropIndicator, nextSibling);
      } else {
        list.appendChild(dropIndicator);
      }
    }
  } else {
    // Fallback - add to end
    list.appendChild(dropIndicator);
  }
}

function onDrop(event, targetGroupIndex) {
  event.preventDefault();

  // Clear drop indicators
  document
    .querySelectorAll(".drop-target")
    .forEach(el => el.classList.remove("drop-target"));
  document.querySelectorAll(".drop-indicator").forEach(el => el.remove());

  if (!dragItem.value) return;

  const { groupIndex: sourceGroupIndex, todoIndex: sourceTodoIndex } =
    dragItem.value;

  // Only proceed if we have valid source information
  if (sourceGroupIndex !== undefined && sourceTodoIndex !== undefined) {
    // Get the todo item being dragged
    const todo = {
      ...todoGroups.value[sourceGroupIndex].todos[sourceTodoIndex],
    };

    // Ensure the todo has an ID
    if (!todo.id) {
      todo.id = Date.now() + Math.random();
    }

    // Find the drop target index
    const list = event.currentTarget;
    const items = Array.from(
      list.querySelectorAll(".todo-item:not(.dragging)")
    );
    let targetIndex = todoGroups.value[targetGroupIndex].todos.length; // Default to end

    if (items.length > 0) {
      // Get mouse position
      const mouseY = event.clientY;

      // Find the closest item using the same logic as onDragOver
      let closestItem = null;
      let closestDistance = Infinity;
      let position = "before"; // 'before' or 'after'
      let itemIndex = -1;

      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const itemMiddle = rect.top + rect.height / 2;

        // Check distance to middle of item
        const distance = Math.abs(mouseY - itemMiddle);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestItem = item;
          itemIndex = index;
          position = mouseY < itemMiddle ? "before" : "after";
        }
      });

      if (closestItem) {
        targetIndex = itemIndex;
        if (position === "after") {
          targetIndex += 1;
        }
      }
    }

    // Remove from source location
    todoGroups.value[sourceGroupIndex].todos.splice(sourceTodoIndex, 1);

    // Add to target location at specific index
    todoGroups.value[targetGroupIndex].todos.splice(targetIndex, 0, todo);

    // Reset drag item
    dragItem.value = null;
  }
}

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

        // Ensure every todo has an ID for dragging
        todoGroups.value.forEach(group => {
          group.todos.forEach(todo => {
            if (!todo.id) {
              todo.id = Date.now() + Math.random();
            }
          });
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

// Save todos to Firestore with optimistic UI
async function saveTodos(userId, groups) {
  // Create a copy of the data to send to firestore
  const groupsToSave = JSON.parse(JSON.stringify(groups));

  try {
    // Remove any temporary UI-only properties
    groupsToSave.forEach(group => {
      if (group.todos) {
        group.todos.forEach(_todo => {
          // Clean any temporary properties that shouldn't be stored
          // (none needed right now but could be added later)
        });
      }
    });

    const userDocRef = doc($firestore, "todos", userId);
    await setDoc(userDocRef, { groups: groupsToSave }, { merge: true });
  } catch (error) {
    console.error("Error saving todos:", error);
    throw error; // Re-throw to handle in the watch
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
      id: Date.now() + Math.random(), // Unique ID for draggable
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
  min-height: 50px;
  padding: 0.5rem;
  border: 1px dashed transparent;
  border-radius: 0.25rem;
  transition: background-color 0.2s, border-color 0.2s;
  position: relative;
}

.todo-list.drop-target {
  border-color: var(--primary-color);
  background-color: rgba(59, 130, 246, 0.05);
}

.todo-list:empty {
  border-color: #e5e7eb;
}

.drop-indicator {
  height: 4px;
  background-color: var(--primary-color);
  margin: 6px 0;
  border-radius: 2px;
  position: relative;
  box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
  animation: pulse 1.5s infinite;
  z-index: 10;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

.drop-indicator::before {
  content: "";
  position: absolute;
  left: 0;
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: var(--primary-color);
  top: -2px;
}

.drop-indicator::after {
  content: "";
  position: absolute;
  right: 0;
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: var(--primary-color);
  top: -2px;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #f3f4f6;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  cursor: move;
  transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
}

.todo-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.todo-item.dragging {
  opacity: 0.5;
  transform: scale(0.95);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.drag-handle {
  cursor: move;
  color: #9ca3af;
  font-size: 1.25rem;
  user-select: none;
}
</style>
