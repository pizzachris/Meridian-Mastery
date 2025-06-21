import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh optimizations
      fastRefresh: true,
      // Exclude node_modules from transformation for better performance
      exclude: /node_modules/,
    }),
    // DISABLE PWA in development to prevent caching issues
    ...(process.env.NODE_ENV === "production"
      ? [
          VitePWA({
            registerType: "autoUpdate",
            workbox: {
              globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
              maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB limit
              runtimeCaching: [
                {
                  urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                  handler: "CacheFirst",
                  options: {
                    cacheName: "google-fonts-cache",
                    expiration: {
                      maxEntries: 10,
                      maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                    },
                  },
                },
                // Cache data files with network-first strategy
                {
                  urlPattern: /\/data\/.*\.json$/,
                  handler: "NetworkFirst",
                  options: {
                    cacheName: "data-cache",
                    expiration: {
                      maxEntries: 50,
                      maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
                    },
                  },
                },
              ],
            },
            manifest: {
              name: "Meridian Mastery - Kuk Sool Won Pressure Points",
              short_name: "Meridian Mastery",
              description:
                "Master Korean martial arts pressure points and meridians",
              theme_color: "#EAB308",
              background_color: "#000000",
              display: "standalone",
              orientation: "portrait",
              scope: "/",
              start_url: "/",
              icons: [
                {
                  src: "/icons/triskelion-192.png",
                  sizes: "192x192",
                  type: "image/png",
                },
                {
                  src: "/icons/triskelion-512.png",
                  sizes: "512x512",
                  type: "image/png",
                },
              ],
            },
          }),
        ]
      : []),
  ],

  // Base configuration
  base: "/",

  // Build configuration
  build: {
    outDir: "dist",
    // Optimize bundle size
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor libraries
          vendor: ["react", "react-dom"],
          // Data utilities
          dataUtils: [
            "./src/utils/dataLoaderOptimized.js",
            "./src/utils/progressTracker.js",
          ],
          // Components
          components: [
            "./src/components/BodyMapInteractiveNew.jsx",
            "./src/components/DailySession.jsx",
          ],
        },
        // Optimize chunk names for caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId
                .split("/")
                .pop()
                .replace(".jsx", "")
                .replace(".js", "")
            : "chunk";
          return `assets/${facadeModuleId}-[hash].js`;
        },
      },
    },
    // Enable minification and compression
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    // Generate source maps for debugging
    sourcemap: false, // Disable in production for smaller bundle
    // Asset optimization
    assetsInlineLimit: 4096, // Inline small assets as base64
    // Enable CSS code splitting
    cssCodeSplit: true,
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom"],
    exclude: [], // Add packages that should not be pre-bundled
  },

  // Server configuration for development
  server: {
    port: 5173,
    host: true,
    // Enable compression
    middlewareMode: false,
    // Fix HMR WebSocket connection
    hmr: {
      port: 5173,
      overlay: false, // Disable error overlay for better mobile experience
    },
  },
});
