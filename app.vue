<template>
  <div class="min-h-screen bg-background text-foreground transition-colors duration-200">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

// Initialize color mode and set up watchers
onMounted(() => {
  // Force initial state
  const isDark = colorMode.value === 'dark'
  document.documentElement.classList.toggle('dark', isDark)
})

// Watch for color mode changes
watch(() => colorMode.value, (newValue) => {
  document.documentElement.classList.toggle('dark', newValue === 'dark')
}, { immediate: true })
</script>

<style>
/* Force dark mode styles */
:root {
  color-scheme: light;
}

:root.dark {
  color-scheme: dark;
}

html.dark body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
</style>
