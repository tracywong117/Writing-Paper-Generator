<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
:root {
  --bg-app: #E5E5E2; /* Light Lead */
  --bg-sidebar: #FFFFFF; /* Fresh Sheet */
  --text-primary: #2D2D2A; /* Dried Ink */
  --text-muted: #7A7A72; /* Graphite */
  --border-color: #D1D1CD; /* Darker Lead */
  --accent-color: #9C8470; /* Taupe Stone */
  --accent-hover: #8A7360;
  --font-heading: 'Bodoni Moda', serif;
  --font-body: 'Jost', sans-serif;
}

*, *::before, *::after {
  box-sizing: border-box;
}

body {
  font-family: var(--font-body);
  margin: 0;
  padding: 0;
  background-color: var(--bg-app);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
}

.heading-serif {
  font-family: var(--font-heading);
  font-weight: 500;
  letter-spacing: -0.02em;
}

/* Page Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
