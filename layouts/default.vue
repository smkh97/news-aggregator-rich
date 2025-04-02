<template>
  <div class="min-h-screen bg-background">
    <Navigation />
    <main class="bg-background">
      <slot />
    </main>
    <footer class="border-t py-6 bg-background">
      <div class="container flex items-center justify-between">
        <p class="text-sm text-muted-foreground">
          Built with Nuxt.js and NewsAPI
        </p>
        <div class="flex items-center space-x-4">
          <a
            href="https://newsapi.org"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            NewsAPI
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const categories = [
  'general',
  'business',
  'technology',
  'entertainment',
  'health',
  'science',
  'sports'
]
</script> 