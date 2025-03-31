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

      <ul
        class="todo-list"
        :class="{ 'drop-active': activeDropZone === groupIndex }"
        @dragover.prevent="onDragOver($event, groupIndex)"
        @dragenter.prevent="onDragEnter(groupIndex)"
        @dragleave="onDragLeave(groupIndex, $event)"
        @drop="onDrop($event, groupIndex)"
      >
        <li
          v-for="(todo, todoIndex) in group.todos"
          :key="todoIndex"
          class="todo-item"
          draggable="true"
          @dragstart="onDragStart($event, { groupIndex, todoIndex })"
          @dragover.prevent
        >
          <div class="todo-content">
            <span class="drag-handle">&#8801;</span>
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
        <div v-if="group.todos.length === 0" class="empty-list-message">
          Drop items here
        </div>
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
const draggedItem = ref(null);
const activeDropZone = ref(null);

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

// Drag and drop functionality
function onDragStart(event, item) {
  draggedItem.value = item;
  event.dataTransfer.effectAllowed = "move";
  // Make drag preview transparent
  setTimeout(() => {
    event.target.style.opacity = "0.4";
  }, 0);
}

function onDragOver(event, groupIndex) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";

  // Find the element we're dragging over
  const target = event.target.closest(".todo-item");
  if (target) {
    // Clear previous drag-over class
    document.querySelectorAll(".drag-over").forEach(el => {
      el.classList.remove("drag-over");
    });

    // Add drag-over class to the target
    target.classList.add("drag-over");
  }
}

function onDragEnter(groupIndex) {
  activeDropZone.value = groupIndex;
}

function onDragLeave(_groupIndex, event) {
  // Only reset if we're leaving the list, not just moving between items
  if (
    !event.relatedTarget ||
    !event.currentTarget.contains(event.relatedTarget)
  ) {
    activeDropZone.value = null;
  }
}

function onDrop(event, targetGroupIndex) {
  event.preventDefault();
  activeDropZone.value = null;

  // Reset opacity of the dragged item and drag-over class
  document.querySelectorAll('.todo-item[style*="opacity"]').forEach(el => {
    el.style.removeProperty("opacity");
  });
  document.querySelectorAll(".drag-over").forEach(el => {
    el.classList.remove("drag-over");
  });

  if (draggedItem.value) {
    const { groupIndex: sourceGroupIndex, todoIndex: sourceTodoIndex } =
      draggedItem.value;

    // Get the todo item being dragged
    const todo = {
      ...todoGroups.value[sourceGroupIndex].todos[sourceTodoIndex],
    };

    // Remove from the source
    todoGroups.value[sourceGroupIndex].todos.splice(sourceTodoIndex, 1);

    // Find the target todo index (where to insert)
    let targetTodoIndex = todoGroups.value[targetGroupIndex].todos.length; // Default to end

    const targetElement = findDropTargetElement(event.target);
    if (targetElement) {
      targetTodoIndex = [...targetElement.parentNode.children]
        .filter(el => el.classList.contains("todo-item")) // Filter only actual todo items
        .indexOf(targetElement);
    }

    // Insert at the target position
    todoGroups.value[targetGroupIndex].todos.splice(targetTodoIndex, 0, todo);

    // Reset the dragged item
    draggedItem.value = null;
  }
}

// Helper function to find the drop target element (the <li> we're dropping onto)
function findDropTargetElement(element) {
  // If we're directly on a todo-item, return it
  if (element.classList.contains("todo-item")) {
    return element;
  }

  // If we're on a child of todo-item, find the parent todo-item
  const parent = element.closest(".todo-item");
  if (parent) {
    return parent;
  }

  // If we're on the list itself, return null (will append to the end)
  return null;
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
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1.5rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  border: 1px dashed var(--border-color);
  border-radius: 0.25rem;
  transition: background-color 0.2s, border-color 0.2s;
}

.todo-list.drop-active {
  background-color: rgba(59, 130, 246, 0.05);
  border-color: var(--primary-color);
}

.empty-list-message {
  color: #9ca3af;
  text-align: center;
  padding: 1rem;
  font-style: italic;
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
  transition: transform 0.2s, box-shadow 0.2s;
}

.todo-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.todo-item.drag-over {
  border-top: 2px solid var(--primary-color);
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
