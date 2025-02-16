// File: vite.config.ts

/// <reference types="vitest" />
import eslintPlugin from '@nabla/vite-plugin-eslint'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: env.VITE_BASE_URL || '/',
    
    define: {
      'import.meta.env.VITE_BASE_URL': JSON.stringify(env.VITE_BASE_URL),
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
    },

    test: {
      css: false,
      include: ['src/**/__tests__/*'],
      globals: true,
      environment: 'jsdom',
      setupFiles: 'src/setupTests.ts',
      clearMocks: true,
      restoreMocks: true,
      // mockReset: true,
      testTimeout: 20000,
      hookTimeout: 20000,
      pool: 'forks',
      sequence: {
        concurrent: true
      },
      coverage: {
        include: ['src/**/*'],
        exclude: ['src/main.tsx'],
        thresholds: {
          '100': true
        },
        provider: 'istanbul',
        enabled: true,
        reporter: ['text', 'lcov'],
        reportsDirectory: 'coverage'
      }
    },

    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
          },
        },
      },
    },

    server: {
      port: 5173,
      host: true,
      open: false,
    },

    plugins: [
      tsconfigPaths(),
      react(),
      ...(mode === 'test'
        ? []
        : [
            eslintPlugin(),
            VitePWA({
              registerType: 'autoUpdate',
              includeAssets: [
                'favicon.png',
                'robots.txt',
                'apple-touch-icon.png',
                'icons/*.svg',
                'fonts/*.woff2'
              ],
              manifest: {
                theme_color: '#BD34FE',
                icons: [
                  {
                    src: '/android-chrome-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'any maskable'
                  },
                  {
                    src: '/android-chrome-512x512.png',
                    sizes: '512x512',
                    type: 'image/png'
                  }
                ]
              }
            })
          ])
    ]
  }
})