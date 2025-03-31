<template>
  <div id="app">
    <NuxtPage />
  </div>
</template>

<script setup>
// Ensure favicon is properly loaded
useHead({
  link: [
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "/favicon.svg",
    },
  ],
});
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

#app {
  min-height: 100vh;
}
</style>
