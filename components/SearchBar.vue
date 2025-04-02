<template>
    <div class="mb-6">
      <form @submit.prevent="handleSearch" class="flex flex-col md:flex-row gap-3">
        <div class="relative flex-grow">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-muted-foreground" />
          </div>
          <input
            v-model="searchInput"
            type="search"
            class="block w-full p-3 pl-10 text-sm text-foreground border border-input rounded-lg bg-background focus:ring-primary focus:border-primary"
            placeholder="Search for news..."
            required
          />
        </div>
        
        <div class="flex gap-2">
          <select
            v-model="sortByValue"
            class="bg-background border border-input text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
          >
            <option value="publishedAt">Latest</option>
            <option value="relevancy">Relevance</option>
            <option value="popularity">Popularity</option>
          </select>
          
          <button
            type="submit"
            class="px-5 py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-primary/50"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  
  /**
   * Type definition for sort options
   * @typedef {'publishedAt' | 'relevancy' | 'popularity'} SortOption
   */
  type SortOption = 'publishedAt' | 'relevancy' | 'popularity'
  
  /**
   * Props for the SearchBar component
   * @property {string} [initialQuery] - Initial search query value
   * @property {SortOption} [initialSortBy] - Initial sort option value
   */
  const props = defineProps<{
    initialQuery?: string
    initialSortBy?: SortOption
  }>()
  
  /**
   * Emits for the SearchBar component
   * @property {function} search - Emitted when a search is performed
   * @param {string} query - The search query
   * @param {SortOption} sortBy - The selected sort option
   */
  const emit = defineEmits<{
    (e: 'search', query: string, sortBy: SortOption): void
  }>()
  
  /**
   * The current search input value
   * @type {Ref<string>}
   */
  const searchInput = ref(props.initialQuery || '')
  
  /**
   * The current sort option value
   * @type {Ref<SortOption>}
   */
  const sortByValue = ref<SortOption>(props.initialSortBy || 'publishedAt')
  
  /**
   * Handles the search form submission
   * Emits the search event with the current query and sort option
   */
  const handleSearch = (): void => {
    const trimmedQuery = searchInput.value.trim()
    if (trimmedQuery) {
      emit('search', trimmedQuery, sortByValue.value)
    }
  }
  
  /**
   * Watches for changes in the sort option
   * Triggers a new search if there's an existing query
   */
  watch(sortByValue, (newValue) => {
    const trimmedQuery = searchInput.value.trim()
    if (trimmedQuery) {
      emit('search', trimmedQuery, newValue)
    }
  })
  </script>
  
  