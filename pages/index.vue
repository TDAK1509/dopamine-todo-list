<template>
  <div class="landing-page">
    <div class="container">
      <h1 class="title">Dopamine Todo List</h1>

      <div class="content">
        <p>
          I'm annoyed with over-complicated to-do list apps with flashy
          animations. I prefer a simple, straightforward todo list where I can
          add and remove tasks quickly, with an interface that's easy to
          understand.
        </p>

        <p>
          The most important feature for me is how completed tasks are
          displayed. In other apps, when I finish a task, it disappears or
          becomes grayed out. I prefer a clear strike-through text instead. It
          feels like I'm using a real notebook and crossing out completed tasks
          with my pencil—a satisfying dopamine hit, I would say.
        </p>

        <p>And that's why this is named <strong>Dopamine Todo List</strong>.</p>

        <div class="cta-buttons">
          <NuxtLink to="/app" class="primary-button">Get Started</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f9fafb;
}

.container {
  max-width: 800px;
  background-color: white;
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 2rem;
  text-align: center;
}

.content {
  font-size: 1.1rem;
  line-height: 1.7;
}

.content p {
  margin-bottom: 1.5rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: center;
}

.primary-button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
}

.primary-button:hover {
  background-color: var(--primary-hover);
}

.secondary-button {
  background-color: transparent;
  color: var(--primary-color);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: 1px solid var(--primary-color);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.secondary-button:hover {
  background-color: var(--primary-color);
  color: white;
}

@media (max-width: 768px) {
  .container {
    padding: 2rem;
  }

  .cta-buttons {
    flex-direction: column;
  }
}
</style>
