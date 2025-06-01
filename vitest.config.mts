import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'istanbul',
      enabled: true,
      reporter: ['html', 'text'],
    },
    include: ["'__tests__/**/*.{test,spec}.?(c|m)[jt]s?(x)'"],
  },
})
