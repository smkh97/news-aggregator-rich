<template>
  <div class="flex items-center justify-center gap-2 py-4">
    <button
      v-if="currentPage > 1"
      @click="$emit('change', currentPage - 1)"
      class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      :disabled="loading"
    >
      <Icon name="lucide:chevron-left" class="mr-2 h-4 w-4" />
      Previous
    </button>

    <div class="flex items-center gap-1">
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="$emit('change', page)"
        class="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        :class="[
          page === currentPage
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
        ]"
        :disabled="loading"
      >
        {{ page }}
      </button>
    </div>

    <button
      v-if="hasMore"
      @click="$emit('change', currentPage + 1)"
      class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      :disabled="loading"
    >
      Next
      <Icon name="lucide:chevron-right" class="ml-2 h-4 w-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * Props for the PaginationControls component
 * @property {number} currentPage - The current active page number
 * @property {number} totalPages - The total number of available pages
 * @property {boolean} hasMore - Indicates if there are more pages to load
 * @property {boolean} loading - Indicates if a page change is in progress
 */
const props = defineProps<{
  currentPage: number
  totalPages: number
  hasMore: boolean
  loading: boolean
}>()

/**
 * Emits for the PaginationControls component
 * @property {function} change - Emitted when the page number changes
 * @param {number} page - The new page number
 */
const emit = defineEmits<{
  (e: 'change', page: number): void
}>()

/**
 * Computed property that generates the array of visible page numbers
 * Ensures a maximum of 5 pages are shown at a time
 * Centers the current page when possible
 * @type {ComputedRef<number[]>}
 */
const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisiblePages = 5
  const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2)

  let startPage = Math.max(1, props.currentPage - halfMaxVisiblePages)
  let endPage = Math.min(props.totalPages, startPage + maxVisiblePages - 1)

  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  // Generate array of page numbers
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})
</script> 