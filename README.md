# News Aggregator

A modern, performant news aggregator application built with Nuxt 3, featuring real-time news updates, search functionality, and a beautiful user interface.

## Features

- 📰 Fetch and display news articles from NewsAPI
- 🔍 Search functionality with sorting options
- 📱 Responsive design for all devices
- 🌓 Dark mode support
- 🔖 Bookmark articles for later reading
- ⚡ Performance optimized with lazy loading and infinite scroll with lru caching
- 📊 Performance monitoring with Web Vitals
- 🧪 Comprehensive test coverage

## Tech Stack

- [Nuxt 3](https://nuxt.com/) - Vue.js framework for building modern web applications
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Pinia](https://pinia.vuejs.org/) - State management library
- [Web Vitals](https://web.dev/vitals/) - Performance monitoring
- [NewsAPI](https://newsapi.org/) - News data provider

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm (recommended) or npm
- NewsAPI key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/smkh97/news-aggregator-rich.git
   cd news-aggregator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your NewsAPI key:
   ```
   NEWS_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm dev
   ```

5. Build for production:
   ```bash
   npm build
   ```

## Project Structure

Source code management folder structure

```
news-aggregator/
├── components/         # Reusable Vue components
├── composables/        # Vue composables
├── layouts/           # Page layouts
├── pages/             # Application pages
├── server/            # Server-side API routes
├── stores/            # Pinia stores
└── public/            # Static assets
```

## Performance Optimizations

- **Lazy Loading**: Images are loaded only when they enter the viewport
- **Infinite Scroll**: Articles are loaded in batches to improve initial load time
- **Component Caching**: Reusable components are cached for better performance
- **State Management**: Efficient state management with Pinia to minimize re-renders
- **Code Splitting**: Automatic code splitting for better initial load time
- **Lru caching** : For optimized performance

## Testing

Run the test suite:
Check the script runner for more information 

```bash
npm test

```

## Test Results 

 Test Files  18 passed (18)
      Tests  125 passed (125)
   Start at  22:17:56
   Duration  6.78s (transform 997ms, setup 2ms, collect 3.88s, tests 999ms, environment 16.81s, prepare 3.96s)

 % Coverage report from v8
----------------------------------------|---------|----------|---------|---------|-----------------------------------------------------------------------------------
File                                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------------------------|---------|----------|---------|---------|-----------------------------------------------------------------------------------
All files                               |   62.64 |    81.85 |   69.41 |   62.64 | 
 NewsAggregatorRichPanel                |       0 |        0 |       0 |       0 | 
  app.vue                               |       0 |        0 |       0 |       0 | 1-39
 NewsAggregatorRichPanel/components     |   79.71 |    84.61 |   55.55 |   79.71 | 
  ApiKeyError.vue                       |     100 |      100 |     100 |     100 | 
  ArticleCard.vue                       |   94.15 |    95.83 |      75 |   94.15 | 135-144
  ArticleSkeleton.vue                   |       0 |        0 |       0 |       0 | 1-26
  CategorySelector.vue                  |     100 |      100 |     100 |     100 | 
  LateImage.vue                         |   87.03 |    42.85 |   33.33 |   87.03 | 18-19,65-71,78-81,102
  Navigation.vue                        |       0 |        0 |       0 |       0 | 1-95
  NewsGrid.vue                          |     100 |      100 |     100 |     100 | 
  PaginationControls.vue                |    96.8 |    66.66 |   33.33 |    96.8 | 1,84-85
  SearchBar.vue                         |     100 |      100 |     100 |     100 | 
  ThemeToggle.vue                       |       0 |        0 |       0 |       0 | 1-23                                                                              
 NewsAggregatorRichPanel/composables    |   96.19 |    90.14 |      95 |   96.19 | 
  useApiError.ts                        |     100 |      100 |     100 |     100 | 
  useBookmarks.ts                       |   95.49 |    79.16 |     100 |   95.49 | 30,46-47,88-89
  useEventBus.ts                        |     100 |      100 |     100 |     100 | 
  useInfiniteScroll.ts                  |   98.09 |    94.73 |     100 |   98.09 | 80-81
  useMemoryMonitor.ts                   |   94.59 |    85.71 |     100 |   94.59 | 15-16
  usePerformance.ts                     |   92.75 |      100 |   66.66 |   92.75 | 29-33
 NewsAggregatorRichPanel/layouts        |       0 |        0 |       0 |       0 | 
  default.vue                           |       0 |        0 |       0 |       0 | 1-45
 NewsAggregatorRichPanel/pages          |       0 |        0 |       0 |       0 | 
  bookmarks.vue                         |       0 |        0 |       0 |       0 | 1-43
  index.vue                             |       0 |        0 |       0 |       0 | 1-92
  search.vue                            |       0 |        0 |       0 |       0 | 1-162
 NewsAggregatorRichPanel/pages/category |       0 |        0 |       0 |       0 | 
  [category].vue                        |       0 |        0 |       0 |       0 | 1-116
 NewsAggregatorRichPanel/plugins        |       0 |        0 |       0 |       0 | 
  axios.ts                              |       0 |        0 |       0 |       0 | 1-61
  pinia.ts                              |       0 |        0 |       0 |       0 | 1-12
  web-vitals.ts                         |       0 |        0 |       0 |       0 | 1-23
 NewsAggregatorRichPanel/server/api     |       0 |        0 |       0 |       0 | 
  everything.ts                         |       0 |        0 |       0 |       0 | 1-36
  top-headlines.ts                      |       0 |        0 |       0 |       0 | 1-27
 NewsAggregatorRichPanel/stores         |   88.06 |    79.41 |   86.36 |   88.06 | 
  bookmarks.ts                          |   94.25 |    73.68 |     100 |   94.25 | 36,38-39,52-53
  loading.ts                            |     100 |      100 |     100 |     100 | 
  news.ts                               |   83.83 |    76.92 |   66.66 |   83.83 | 80-82,107-108,112-113,162-173,177-179,190-191,204-205,228-229,243-247,255,264-277
  ui.ts                                 |     100 |      100 |     100 |     100 | 
 NewsAggregatorRichPanel/tests/utils    |   66.33 |      100 |      40 |   66.33 | 
  test-utils.ts                         |   66.33 |      100 |      40 |   66.33 | 11-14,28,31,66-79,88-101
 NewsAggregatorRichPanel/utils          |   96.25 |    94.11 |     100 |   96.25 | 
  cn.ts                                 |     100 |      100 |     100 |     100 | 
  lruCache.ts                           |   95.94 |    93.75 |     100 |   95.94 | 56-58
----------------------------------------|---------|----------|---------|---------|-----------------------------------------------------------------------------------

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

