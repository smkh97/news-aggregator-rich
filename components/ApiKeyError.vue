<template>
  <div v-if="error && isApiKeyError" class="rounded-lg border border-destructive bg-destructive/10 p-4">
    <div class="flex items-start gap-4">
      <Icon name="lucide:alert-circle" class="mt-0.5 h-5 w-5 text-destructive" />
      <div>
        <h3 class="font-semibold text-destructive">API Key Error</h3>
        <p class="mt-1 text-sm text-destructive">{{ error }}</p>
        <p class="mt-2 text-sm text-muted-foreground">
          Please check your NewsAPI key configuration in the .env file:
          <code class="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-sm">NUXT_PUBLIC_NEWS_API_KEY=your_api_key</code>
        </p>
      </div>
    </div>
  </div>
  <br/>
</template>

<script setup lang="ts">
/**
 * ApiKeyError Component
 * 
 * Displays a user-friendly error message when there are issues with the NewsAPI key.
 * Provides guidance on how to fix the configuration.
 * 
 * Features:
 * - Visual error indication with icon and color
 * - Clear error message display
 * - Code snippet showing the required environment variable
 * - Conditional rendering based on error state
 */

/**
 * Props for the ApiKeyError component
 * @property {string | null} error - The error message to display
 * @property {boolean} isApiKeyError - Indicates if the error is related to the API key
 */
defineProps<{
  error: string | null
  isApiKeyError: boolean
}>()
</script> 