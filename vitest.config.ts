import { defineConfig } from "vitest/config"
import vue from "@vitejs/plugin-vue"
import { fileURLToPath, URL } from "node:url"
import { dirname, resolve } from "node:path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [vue() as any],
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        ".nuxt/**",
        "dist/**",
        "public/**",
        "assets/**",
        "types/**",
        "**/*.d.ts",
        "**/*.test.ts",
        "**/*.config.ts",
        "**/test/**",
      ],
      thresholds: {
        global: {
          branches: 85,
          functions: 90,
          lines: 90,
          statements: 90,
        },
      },
    },
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
    },
    extensions: ['.ts', '.js', '.vue']
  }
})
