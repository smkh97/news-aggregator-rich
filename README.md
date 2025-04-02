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

### Prerequisites

- Node.js 16.x or later
- npm (recommended) or npm
- NewsAPI key

### Setup Instructions

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


## Design Decisions and Optimizations  

### **Tech Stack Selection**  

- **Nuxt 3**: Chosen for its powerful server-side rendering (SSR) and static site generation (SSG) capabilities, ensuring fast initial load times and better SEO. It provides automatic code splitting, optimized performance, and a seamless developer experience with TypeScript support.  
- **Tailwind CSS**: Enables a utility-first styling approach, leading to a highly customizable and maintainable UI. It improves performance by reducing CSS file sizes and eliminating unused styles via tree-shaking.  
- **Pinia**: A modern state management library that simplifies global state handling with a minimal API. It offers better TypeScript support and is more efficient than Vuex, reducing re-renders and improving performance.  
- **Web Vitals**: Ensures performance is continuously monitored by tracking key user experience metrics such as First Contentful Paint (FCP) and Cumulative Layout Shift (CLS), allowing for optimizations based on real-world data.  
- **NewsAPI**: A reliable and scalable third-party news source, allowing easy integration of dynamic news content without maintaining a dedicated backend for article retrieval.  

### Trade off

- Though nuxt 3 images a module has been set with appropriate settings for dynamic url the configuration 
is not being applied for all images as there are breakages from the news api urls 

- XSS headers and cross site scripting policy was previously tried to be set and removed since the news api url are too random urls
to apply self script as chrome blocks xss policy 

- Search page has been added fuzzy search type of debounce function for intutive feel for user , The drawback is more api calls 
But this would be more appropriate as to waste user time much 

Finally emit function need to be improved


### **Screenshots Links**  

- Check the public folder for screenshots of the images includes both desktop and mobile displays public/


### **Performance Optimizations**  

- **Lazy Loading**: Images and other assets are only loaded when they enter the viewport, reducing initial page load time and conserving bandwidth.  
- **Infinite Scroll**: Instead of fetching all articles at once, content is loaded dynamically in batches, reducing memory usage and improving performance.  
- **Component Caching**: Frequently used UI components are cached to prevent unnecessary re-renders, optimizing runtime performance.  
- **State Management with Pinia**: Reduces redundant API calls and minimizes component re-renders, ensuring smooth and efficient updates to UI elements.  
- **Code Splitting**: Automatically splits the JavaScript bundle into smaller chunks, allowing for faster initial loads and only loading code when needed.  
- **LRU Caching**: Implements a Least Recently Used (LRU) cache for API responses, reducing redundant requests to the NewsAPI and improving data retrieval speed.  

These choices ensure the application is **highly performant**, **scalable**, and **user-friendly**, making it an optimal solution for a modern news aggregator. 🚀  

## Testing

Run the test suite:
Check the script runner for more information 

```bash
npm test

```



