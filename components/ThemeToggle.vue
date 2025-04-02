<template>
  <div class="relative">
    <button
      @click="toggleColorMode"
      class="rounded-md bg-primary flex align-text-center text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
      :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <Icon
        :name="colorMode.value === 'dark' ? 'lucide:sun' : 'lucide:moon'"
          class="h-6 w-6"
      />
      <span class="sr-only">Toggle theme</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const toggleColorMode = () => {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script> 