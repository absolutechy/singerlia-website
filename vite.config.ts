import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import cssnano from "cssnano";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),

    ViteImageOptimizer({
      png: { quality: 85 },
      jpeg: { quality: 75 },
      webp: { quality: 80 },
      svg: { multipass: true },
    }),

    ...(mode === "analyze"
      ? [
          visualizer({
            filename: "dist/stats.html",
            template: "treemap",
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  css: {
    postcss: {
      plugins: [cssnano({ preset: "default" })],
    },
  },

  build: {
    target: "esnext",
    sourcemap: false,
    cssCodeSplit: true,
    minify: "esbuild",
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router"],
          ui: [
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-popover",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-select",
            "@radix-ui/react-slot",
            "lucide-react",
          ],
          utils: [
            "axios",
            "clsx",
            "class-variance-authority",
            "tailwind-merge",
            "date-fns",
            "zod",
          ],
        },

        assetFileNames: (assetInfo) => {
          if (/\.css$/i.test(assetInfo.name ?? "")) {
            return "assets/css/[name]-[hash][extname]";
          }
          if (/\.(png|jpe?g|svg|gif|webp)$/i.test(assetInfo.name ?? "")) {
            return "assets/images/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },

  server: {
    port: 5173,
    open: true,
  },
}));
